// Database Service - Local Storage Implementation for MVP
// This is a client-side only implementation for the MVP version

export interface PitchAnalysis {
  id: string;
  title: string;
  content: string;
  analysisType: 'text' | 'video' | 'audio';
  scores: {
    clarity: number;
    originality: number;
    team_strength: number;
    market_fit: number;
  };
  receipt: string;
  feedback?: string;
  suggestions?: string[];
  aiModel: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoSave: boolean;
  privacyMode: boolean;
}

class DatabaseServiceClass {
  private readonly STORAGE_KEYS = {
    ANALYSES: 'pitchguard_analyses',
    PREFERENCES: 'pitchguard_preferences',
    USER_STATS: 'pitchguard_user_stats'
  };

  // Check if localStorage is available
  private isStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage !== undefined;
    } catch {
      return false;
    }
  }

  // Get data from localStorage with error handling
  private getStorageData<T>(key: string, defaultValue: T): T {
    if (!this.isStorageAvailable()) {
      return defaultValue;
    }

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.warn(`Failed to parse storage data for key ${key}:`, error);
      return defaultValue;
    }
  }

  // Set data to localStorage with error handling
  private setStorageData<T>(key: string, data: T): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to save data to storage for key ${key}:`, error);
      return false;
    }
  }

  // Save pitch analysis
  async savePitchAnalysis(analysisData: Omit<PitchAnalysis, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const analyses = this.getStorageData<PitchAnalysis[]>(this.STORAGE_KEYS.ANALYSES, []);
      
      const newAnalysis: PitchAnalysis = {
        ...analysisData,
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      analyses.unshift(newAnalysis); // Add to beginning of array
      
      // Keep only the last 50 analyses to prevent storage bloat
      if (analyses.length > 50) {
        analyses.splice(50);
      }

      const success = this.setStorageData(this.STORAGE_KEYS.ANALYSES, analyses);
      return success ? newAnalysis.id : null;
    } catch (error) {
      console.error('Failed to save pitch analysis:', error);
      return null;
    }
  }

  // Get all pitch analyses
  async getPitchAnalyses(): Promise<PitchAnalysis[]> {
    return this.getStorageData<PitchAnalysis[]>(this.STORAGE_KEYS.ANALYSES, []);
  }

  // Get pitch analysis by ID
  async getPitchAnalysisById(id: string): Promise<PitchAnalysis | null> {
    const analyses = await this.getPitchAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  // Update pitch analysis
  async updatePitchAnalysis(id: string, updates: Partial<PitchAnalysis>): Promise<boolean> {
    try {
      const analyses = this.getStorageData<PitchAnalysis[]>(this.STORAGE_KEYS.ANALYSES, []);
      const index = analyses.findIndex(analysis => analysis.id === id);
      
      if (index === -1) {
        return false;
      }

      analyses[index] = {
        ...analyses[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.setStorageData(this.STORAGE_KEYS.ANALYSES, analyses);
    } catch (error) {
      console.error('Failed to update pitch analysis:', error);
      return false;
    }
  }

  // Delete pitch analysis
  async deletePitchAnalysis(id: string): Promise<boolean> {
    try {
      const analyses = this.getStorageData<PitchAnalysis[]>(this.STORAGE_KEYS.ANALYSES, []);
      const filteredAnalyses = analyses.filter(analysis => analysis.id !== id);
      
      if (filteredAnalyses.length === analyses.length) {
        return false; // No analysis found with that ID
      }

      return this.setStorageData(this.STORAGE_KEYS.ANALYSES, filteredAnalyses);
    } catch (error) {
      console.error('Failed to delete pitch analysis:', error);
      return false;
    }
  }

  // Get user preferences
  async getUserPreferences(): Promise<UserPreferences> {
    return this.getStorageData<UserPreferences>(this.STORAGE_KEYS.PREFERENCES, {
      theme: 'dark',
      notifications: true,
      autoSave: true,
      privacyMode: true
    });
  }

  // Update user preferences
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      return this.setStorageData(this.STORAGE_KEYS.PREFERENCES, updatedPreferences);
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      return false;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    totalAnalyses: number;
    averageScores: {
      clarity: number;
      originality: number;
      team_strength: number;
      market_fit: number;
    };
    lastAnalysisDate: string | null;
    favoriteAnalysisType: string;
  }> {
    try {
      const analyses = await this.getPitchAnalyses();
      
      if (analyses.length === 0) {
        return {
          totalAnalyses: 0,
          averageScores: {
            clarity: 0,
            originality: 0,
            team_strength: 0,
            market_fit: 0
          },
          lastAnalysisDate: null,
          favoriteAnalysisType: 'text'
        };
      }

      // Calculate average scores
      const totalScores = analyses.reduce((acc, analysis) => ({
        clarity: acc.clarity + analysis.scores.clarity,
        originality: acc.originality + analysis.scores.originality,
        team_strength: acc.team_strength + analysis.scores.team_strength,
        market_fit: acc.market_fit + analysis.scores.market_fit
      }), { clarity: 0, originality: 0, team_strength: 0, market_fit: 0 });

      const averageScores = {
        clarity: Math.round((totalScores.clarity / analyses.length) * 10) / 10,
        originality: Math.round((totalScores.originality / analyses.length) * 10) / 10,
        team_strength: Math.round((totalScores.team_strength / analyses.length) * 10) / 10,
        market_fit: Math.round((totalScores.market_fit / analyses.length) * 10) / 10
      };

      // Find most common analysis type
      const typeCounts = analyses.reduce((acc, analysis) => {
        acc[analysis.analysisType] = (acc[analysis.analysisType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const favoriteAnalysisType = Object.entries(typeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'text';

      return {
        totalAnalyses: analyses.length,
        averageScores,
        lastAnalysisDate: analyses[0]?.createdAt || null,
        favoriteAnalysisType
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return {
        totalAnalyses: 0,
        averageScores: { clarity: 0, originality: 0, team_strength: 0, market_fit: 0 },
        lastAnalysisDate: null,
        favoriteAnalysisType: 'text'
      };
    }
  }

  // Clear all data (for privacy/reset purposes)
  async clearAllData(): Promise<boolean> {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }

  // Export data for backup
  async exportData(): Promise<string | null> {
    try {
      const data = {
        analyses: await this.getPitchAnalyses(),
        preferences: await this.getUserPreferences(),
        stats: await this.getUserStats(),
        exportDate: new Date().toISOString()
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  // Import data from backup
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);

      if (data.analyses && Array.isArray(data.analyses)) {
        this.setStorageData(this.STORAGE_KEYS.ANALYSES, data.analyses);
      }

      if (data.preferences) {
        this.setStorageData(this.STORAGE_KEYS.PREFERENCES, data.preferences);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Compatibility methods for UserDashboard
  async getUserStatsForDashboard(userId: string): Promise<any> {
    const stats = await this.getUserStats();
    return {
      total_analyses: stats.totalAnalyses,
      avg_overall_score: (stats.averageScores.clarity + stats.averageScores.originality +
                         stats.averageScores.team_strength + stats.averageScores.market_fit) / 4,
      avg_clarity_score: stats.averageScores.clarity,
      avg_originality_score: stats.averageScores.originality,
      avg_team_strength_score: stats.averageScores.team_strength,
      avg_market_fit_score: stats.averageScores.market_fit,
      credits_remaining: 100,
      subscription_tier: 'free'
    };
  }

  async getUserAnalyses(userId: string, limit: number = 50): Promise<any[]> {
    const analyses = await this.getPitchAnalyses();
    return analyses.slice(0, limit).map(analysis => ({
      id: analysis.id,
      title: analysis.title,
      content: analysis.content,
      overall_score: (analysis.scores.clarity + analysis.scores.originality +
                     analysis.scores.team_strength + analysis.scores.market_fit) / 4,
      clarity_score: analysis.scores.clarity,
      originality_score: analysis.scores.originality,
      team_strength_score: analysis.scores.team_strength,
      market_fit_score: analysis.scores.market_fit,
      created_at: analysis.createdAt,
      updated_at: analysis.updatedAt,
      status: 'completed'
    }));
  }

  async deleteAnalysis(analysisId: string): Promise<boolean> {
    return await this.deletePitchAnalysis(analysisId);
  }
}

// Export singleton instance
export const DatabaseService = new DatabaseServiceClass();