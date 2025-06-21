import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export interface UserAnalytics {
  pitchesAnalyzed: number;
  reportsGenerated: number;
  privacyScore: number;
  totalTimeSpent: number; 
  lastAnalysisDate: string | null;
  averageScore: number;
  bestScore: number;
  analysisHistory: AnalysisRecord[];
  featuresUsed: {
    teeAnalysis: number;
    federatedLearning: number;
    zkProofs: number;
    web3Integration: number;
  };
  achievements: Achievement[];
}

export interface AnalysisRecord {
  id: string;
  date: string;
  scores: {
    clarity: number;
    originality: number;
    team_strength: number;
    market_fit: number;
    overall: number;
  };
  pitchLength: number;
  analysisTime: number; 
  receipt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'analysis' | 'privacy' | 'engagement' | 'milestone';
}

const defaultAnalytics: UserAnalytics = {
  pitchesAnalyzed: 0,
  reportsGenerated: 0,
  privacyScore: 100,
  totalTimeSpent: 0,
  lastAnalysisDate: null,
  averageScore: 0,
  bestScore: 0,
  analysisHistory: [],
  featuresUsed: {
    teeAnalysis: 0,
    federatedLearning: 0,
    zkProofs: 0,
    web3Integration: 0,
  },
  achievements: [],
};

export const useUserAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics>(defaultAnalytics);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`stealthscore_analytics_${user.id}`);
      if (stored) {
        try {
          const parsedAnalytics = JSON.parse(stored);
          setAnalytics({ ...defaultAnalytics, ...parsedAnalytics });
        } catch (error) {
          console.error('Failed to parse stored analytics:', error);
          setAnalytics(defaultAnalytics);
        }
      } else {
        
        const welcomeAchievement: Achievement = {
          id: 'welcome',
          title: 'Welcome to PitchGuard!',
          description: 'Started your privacy-preserving AI journey',
          icon: '🎉',
          unlockedAt: new Date().toISOString(),
          category: 'milestone',
        };
        setAnalytics({
          ...defaultAnalytics,
          achievements: [welcomeAchievement],
        });
      }
      setIsLoading(false);
    }
  }, [user?.id]);

  const saveAnalytics = (newAnalytics: UserAnalytics) => {
    if (user?.id) {
      localStorage.setItem(`stealthscore_analytics_${user.id}`, JSON.stringify(newAnalytics));
      setAnalytics(newAnalytics);
    }
  };

  const recordAnalysis = (scores: any, receipt: string, pitchLength: number, analysisTime: number) => {
    if (!user?.id) return;

    const overallScore = (scores.clarity + scores.originality + scores.team_strength + scores.market_fit) / 4;
    
    const newRecord: AnalysisRecord = {
      id: `analysis_${Date.now()}`,
      date: new Date().toISOString(),
      scores: {
        ...scores,
        overall: overallScore,
      },
      pitchLength,
      analysisTime,
      receipt,
    };

    const newAnalytics = { ...analytics };
    newAnalytics.pitchesAnalyzed += 1;
    newAnalytics.reportsGenerated += 1;
    newAnalytics.lastAnalysisDate = new Date().toISOString();
    newAnalytics.analysisHistory.unshift(newRecord);

    if (newAnalytics.analysisHistory.length > 50) {
      newAnalytics.analysisHistory = newAnalytics.analysisHistory.slice(0, 50);
    }

    const allScores = newAnalytics.analysisHistory.map(record => record.scores.overall);
    newAnalytics.averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    newAnalytics.bestScore = Math.max(...allScores);

    checkAndUnlockAchievements(newAnalytics);

    saveAnalytics(newAnalytics);
  };

  const recordFeatureUsage = (feature: keyof UserAnalytics['featuresUsed']) => {
    if (!user?.id) return;

    const newAnalytics = { ...analytics };
    newAnalytics.featuresUsed[feature] += 1;
    
    saveAnalytics(newAnalytics);
  };

  const recordTimeSpent = (minutes: number) => {
    if (!user?.id) return;

    const newAnalytics = { ...analytics };
    newAnalytics.totalTimeSpent += minutes;
    
    saveAnalytics(newAnalytics);
  };

  const checkAndUnlockAchievements = (currentAnalytics: UserAnalytics) => {
    const achievements: Achievement[] = [...currentAnalytics.achievements];
    const existingIds = achievements.map(a => a.id);

    if (currentAnalytics.pitchesAnalyzed >= 1 && !existingIds.includes('first_analysis')) {
      achievements.push({
        id: 'first_analysis',
        title: 'First Analysis',
        description: 'Completed your first pitch analysis',
        icon: '🚀',
        unlockedAt: new Date().toISOString(),
        category: 'analysis',
      });
    }

    if (currentAnalytics.featuresUsed.teeAnalysis >= 5 && !existingIds.includes('privacy_champion')) {
      achievements.push({
        id: 'privacy_champion',
        title: 'Privacy Champion',
        description: 'Used TEE analysis 5 times',
        icon: '🛡️',
        unlockedAt: new Date().toISOString(),
        category: 'privacy',
      });
    }

    if (currentAnalytics.bestScore >= 9.0 && !existingIds.includes('high_scorer')) {
      achievements.push({
        id: 'high_scorer',
        title: 'High Scorer',
        description: 'Achieved a score of 9.0 or higher',
        icon: '⭐',
        unlockedAt: new Date().toISOString(),
        category: 'analysis',
      });
    }

    if (currentAnalytics.pitchesAnalyzed >= 10 && !existingIds.includes('consistent_user')) {
      achievements.push({
        id: 'consistent_user',
        title: 'Consistent User',
        description: 'Analyzed 10 pitches',
        icon: '📈',
        unlockedAt: new Date().toISOString(),
        category: 'engagement',
      });
    }

    currentAnalytics.achievements = achievements;
  };

  const calculatePrivacyScore = () => {
    const { featuresUsed } = analytics;
    const totalFeatureUsage = Object.values(featuresUsed).reduce((sum, count) => sum + count, 0);
    
    if (totalFeatureUsage === 0) return 100;

    const privacyFeatureUsage = featuresUsed.teeAnalysis + featuresUsed.zkProofs;
    const privacyRatio = privacyFeatureUsage / totalFeatureUsage;
    
    return Math.min(100, 70 + (privacyRatio * 30));
  };

  const getRecentActivity = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return analytics.analysisHistory.filter(record => 
      new Date(record.date) >= cutoffDate
    );
  };

  return {
    analytics: {
      ...analytics,
      privacyScore: calculatePrivacyScore(),
    },
    isLoading,
    recordAnalysis,
    recordFeatureUsage,
    recordTimeSpent,
    getRecentActivity,
    saveAnalytics,
  };
};
