// Analytics Service - Privacy-First Analytics Implementation
// This is a client-side only implementation for the MVP version

export interface UserAction {
  action: string;
  category: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export interface PitchAnalysisEvent {
  analysisType: 'text' | 'video' | 'audio';
  duration: number;
  scores: Record<string, number>;
  success: boolean;
  errorMessage?: string;
  timestamp?: string;
}

export interface ErrorEvent {
  message: string;
  component: string;
  action: string;
  severity: 'low' | 'medium' | 'high';
  timestamp?: string;
  userAgent?: string;
  url?: string;
}

class AnalyticsServiceClass {
  private readonly STORAGE_KEYS = {
    USER_ACTIONS: 'pitchguard_user_actions',
    ANALYSIS_EVENTS: 'pitchguard_analysis_events',
    ERROR_EVENTS: 'pitchguard_error_events',
    SESSION_DATA: 'pitchguard_session_data'
  };

  private sessionId: string;
  private sessionStartTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.initializeSession();
  }

  // Check if localStorage is available
  private isStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage !== undefined;
    } catch {
      return false;
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize session tracking
  private initializeSession(): void {
    if (!this.isStorageAvailable()) return;

    try {
      const sessionData = {
        sessionId: this.sessionId,
        startTime: this.sessionStartTime,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(this.STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to initialize analytics session:', error);
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
      console.warn(`Failed to parse analytics data for key ${key}:`, error);
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
      console.error(`Failed to save analytics data for key ${key}:`, error);
      return false;
    }
  }

  // Track user action
  async trackUserAction(action: UserAction): Promise<void> {
    try {
      const actions = this.getStorageData<UserAction[]>(this.STORAGE_KEYS.USER_ACTIONS, []);
      
      const actionWithMetadata: UserAction = {
        ...action,
        timestamp: action.timestamp || new Date().toISOString(),
        properties: {
          ...action.properties,
          sessionId: this.sessionId,
          url: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
        }
      };

      actions.push(actionWithMetadata);
      
      // Keep only the last 1000 actions to prevent storage bloat
      if (actions.length > 1000) {
        actions.splice(0, actions.length - 1000);
      }

      this.setStorageData(this.STORAGE_KEYS.USER_ACTIONS, actions);
    } catch (error) {
      console.warn('Failed to track user action:', error);
    }
  }

  // Track pitch analysis event
  async trackPitchAnalysis(event: PitchAnalysisEvent): Promise<void> {
    try {
      const events = this.getStorageData<PitchAnalysisEvent[]>(this.STORAGE_KEYS.ANALYSIS_EVENTS, []);
      
      const eventWithMetadata: PitchAnalysisEvent = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString()
      };

      events.push(eventWithMetadata);
      
      // Keep only the last 500 analysis events
      if (events.length > 500) {
        events.splice(0, events.length - 500);
      }

      this.setStorageData(this.STORAGE_KEYS.ANALYSIS_EVENTS, events);

      // Also track as user action
      await this.trackUserAction({
        action: 'pitch_analysis_completed',
        category: 'analysis',
        properties: {
          analysisType: event.analysisType,
          duration: event.duration,
          success: event.success,
          averageScore: Object.values(event.scores).reduce((a, b) => a + b, 0) / Object.keys(event.scores).length || 0
        }
      });
    } catch (error) {
      console.warn('Failed to track pitch analysis:', error);
    }
  }

  // Track error event
  async trackError(error: ErrorEvent): Promise<void> {
    try {
      const errors = this.getStorageData<ErrorEvent[]>(this.STORAGE_KEYS.ERROR_EVENTS, []);
      
      const errorWithMetadata: ErrorEvent = {
        ...error,
        timestamp: error.timestamp || new Date().toISOString(),
        userAgent: error.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'),
        url: error.url || (typeof window !== 'undefined' ? window.location.href : 'unknown')
      };

      errors.push(errorWithMetadata);
      
      // Keep only the last 200 error events
      if (errors.length > 200) {
        errors.splice(0, errors.length - 200);
      }

      this.setStorageData(this.STORAGE_KEYS.ERROR_EVENTS, errors);

      // Also track as user action for high severity errors
      if (error.severity === 'high') {
        await this.trackUserAction({
          action: 'error_occurred',
          category: 'error',
          properties: {
            component: error.component,
            action: error.action,
            severity: error.severity,
            message: error.message
          }
        });
      }
    } catch (err) {
      console.warn('Failed to track error:', err);
    }
  }

  // Get analytics summary
  async getAnalyticsSummary(): Promise<{
    totalActions: number;
    totalAnalyses: number;
    totalErrors: number;
    sessionDuration: number;
    topActions: Array<{ action: string; count: number }>;
    analysisSuccessRate: number;
    averageAnalysisDuration: number;
  }> {
    try {
      const actions = this.getStorageData<UserAction[]>(this.STORAGE_KEYS.USER_ACTIONS, []);
      const analyses = this.getStorageData<PitchAnalysisEvent[]>(this.STORAGE_KEYS.ANALYSIS_EVENTS, []);
      const errors = this.getStorageData<ErrorEvent[]>(this.STORAGE_KEYS.ERROR_EVENTS, []);

      // Calculate top actions
      const actionCounts = actions.reduce((acc, action) => {
        acc[action.action] = (acc[action.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topActions = Object.entries(actionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }));

      // Calculate analysis metrics
      const successfulAnalyses = analyses.filter(a => a.success).length;
      const analysisSuccessRate = analyses.length > 0 ? (successfulAnalyses / analyses.length) * 100 : 0;
      
      const totalDuration = analyses.reduce((sum, a) => sum + a.duration, 0);
      const averageAnalysisDuration = analyses.length > 0 ? totalDuration / analyses.length : 0;

      return {
        totalActions: actions.length,
        totalAnalyses: analyses.length,
        totalErrors: errors.length,
        sessionDuration: Date.now() - this.sessionStartTime,
        topActions,
        analysisSuccessRate: Math.round(analysisSuccessRate * 10) / 10,
        averageAnalysisDuration: Math.round(averageAnalysisDuration)
      };
    } catch (error) {
      console.warn('Failed to get analytics summary:', error);
      return {
        totalActions: 0,
        totalAnalyses: 0,
        totalErrors: 0,
        sessionDuration: 0,
        topActions: [],
        analysisSuccessRate: 0,
        averageAnalysisDuration: 0
      };
    }
  }

  // Get user actions for a specific category
  async getUserActionsByCategory(category: string): Promise<UserAction[]> {
    const actions = this.getStorageData<UserAction[]>(this.STORAGE_KEYS.USER_ACTIONS, []);
    return actions.filter(action => action.category === category);
  }

  // Get analysis events with filters
  async getAnalysisEvents(filters?: {
    analysisType?: 'text' | 'video' | 'audio';
    success?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PitchAnalysisEvent[]> {
    let events = this.getStorageData<PitchAnalysisEvent[]>(this.STORAGE_KEYS.ANALYSIS_EVENTS, []);

    if (filters) {
      if (filters.analysisType) {
        events = events.filter(e => e.analysisType === filters.analysisType);
      }
      if (filters.success !== undefined) {
        events = events.filter(e => e.success === filters.success);
      }
      if (filters.dateFrom) {
        events = events.filter(e => e.timestamp && e.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        events = events.filter(e => e.timestamp && e.timestamp <= filters.dateTo!);
      }
    }

    return events;
  }

  // Get error events by severity
  async getErrorEventsBySeverity(severity: 'low' | 'medium' | 'high'): Promise<ErrorEvent[]> {
    const errors = this.getStorageData<ErrorEvent[]>(this.STORAGE_KEYS.ERROR_EVENTS, []);
    return errors.filter(error => error.severity === severity);
  }

  // Clear analytics data (for privacy)
  async clearAnalyticsData(): Promise<boolean> {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Reinitialize session
      this.sessionId = this.generateSessionId();
      this.sessionStartTime = Date.now();
      this.initializeSession();
      
      return true;
    } catch (error) {
      console.error('Failed to clear analytics data:', error);
      return false;
    }
  }

  // Export analytics data
  async exportAnalyticsData(): Promise<string | null> {
    try {
      const data = {
        userActions: this.getStorageData<UserAction[]>(this.STORAGE_KEYS.USER_ACTIONS, []),
        analysisEvents: this.getStorageData<PitchAnalysisEvent[]>(this.STORAGE_KEYS.ANALYSIS_EVENTS, []),
        errorEvents: this.getStorageData<ErrorEvent[]>(this.STORAGE_KEYS.ERROR_EVENTS, []),
        sessionData: this.getStorageData(this.STORAGE_KEYS.SESSION_DATA, {}),
        exportDate: new Date().toISOString()
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      return null;
    }
  }

  // Track page view
  async trackPageView(page: string): Promise<void> {
    await this.trackUserAction({
      action: 'page_view',
      category: 'navigation',
      properties: {
        page,
        referrer: typeof document !== 'undefined' ? document.referrer : 'unknown'
      }
    });
  }

  // Track feature usage
  async trackFeatureUsage(feature: string, properties?: Record<string, any>): Promise<void> {
    await this.trackUserAction({
      action: 'feature_used',
      category: 'feature',
      properties: {
        feature,
        ...properties
      }
    });
  }

  // Track performance metrics
  async trackPerformance(metric: string, value: number, unit: string = 'ms'): Promise<void> {
    await this.trackUserAction({
      action: 'performance_metric',
      category: 'performance',
      properties: {
        metric,
        value,
        unit
      }
    });
  }

  // Compatibility methods for UserDashboard
  async trackPageView(event: { page: string; title: string }): Promise<void> {
    await this.trackUserAction({
      action: 'page_view',
      category: 'navigation',
      properties: {
        page: event.page,
        title: event.title,
        referrer: typeof document !== 'undefined' ? document.referrer : 'unknown'
      }
    });
  }
}

// Export singleton instance
export const AnalyticsService = new AnalyticsServiceClass();