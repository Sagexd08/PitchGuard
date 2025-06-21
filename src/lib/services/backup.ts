// Backup Service - Simple backup functionality for MVP
// This is a client-side only implementation

export interface BackupMetadata {
  id: string;
  name: string;
  createdAt: string;
  size: number;
  type: 'full' | 'partial';
  version: string;
}

export interface BackupConfig {
  includeAnalyses: boolean;
  includePreferences: boolean;
  includeAnalytics: boolean;
  compression: boolean;
  encryption: boolean;
}

class BackupServiceClass {
  private readonly BACKUP_VERSION = '1.0.0';

  // Create backup
  async createBackup(config: BackupConfig): Promise<BackupMetadata> {
    try {
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      const backupData: any = {
        version: this.BACKUP_VERSION,
        createdAt: timestamp,
        config
      };

      // Include data based on config
      if (config.includeAnalyses) {
        const analyses = localStorage.getItem('pitchguard_analyses');
        backupData.analyses = analyses ? JSON.parse(analyses) : [];
      }

      if (config.includePreferences) {
        const preferences = localStorage.getItem('pitchguard_preferences');
        backupData.preferences = preferences ? JSON.parse(preferences) : {};
      }

      if (config.includeAnalytics) {
        const analytics = localStorage.getItem('pitchguard_user_actions');
        backupData.analytics = analytics ? JSON.parse(analytics) : [];
      }

      const backupString = JSON.stringify(backupData, null, 2);
      const size = new Blob([backupString]).size;

      const metadata: BackupMetadata = {
        id: backupId,
        name: `Backup_${new Date().toLocaleDateString().replace(/\//g, '-')}`,
        createdAt: timestamp,
        size,
        type: 'full',
        version: this.BACKUP_VERSION
      };

      // Store backup metadata
      const existingBackups = this.getBackupList();
      existingBackups.push(metadata);
      localStorage.setItem('pitchguard_backups', JSON.stringify(existingBackups));

      // Store backup data
      localStorage.setItem(`pitchguard_backup_${backupId}`, backupString);

      return metadata;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  // Get list of backups
  getBackupList(): BackupMetadata[] {
    try {
      const backups = localStorage.getItem('pitchguard_backups');
      return backups ? JSON.parse(backups) : [];
    } catch (error) {
      console.error('Failed to get backup list:', error);
      return [];
    }
  }

  // Restore from backup
  async restoreBackup(backupId: string): Promise<void> {
    try {
      const backupData = localStorage.getItem(`pitchguard_backup_${backupId}`);
      if (!backupData) {
        throw new Error('Backup not found');
      }

      const backup = JSON.parse(backupData);

      // Restore data based on what's available in backup
      if (backup.analyses) {
        localStorage.setItem('pitchguard_analyses', JSON.stringify(backup.analyses));
      }

      if (backup.preferences) {
        localStorage.setItem('pitchguard_preferences', JSON.stringify(backup.preferences));
      }

      if (backup.analytics) {
        localStorage.setItem('pitchguard_user_actions', JSON.stringify(backup.analytics));
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw new Error('Failed to restore backup');
    }
  }

  // Delete backup
  async deleteBackup(backupId: string): Promise<void> {
    try {
      // Remove backup data
      localStorage.removeItem(`pitchguard_backup_${backupId}`);

      // Update backup list
      const backups = this.getBackupList();
      const updatedBackups = backups.filter(backup => backup.id !== backupId);
      localStorage.setItem('pitchguard_backups', JSON.stringify(updatedBackups));
    } catch (error) {
      console.error('Failed to delete backup:', error);
      throw new Error('Failed to delete backup');
    }
  }

  // Export backup to file
  async exportBackup(backupId: string): Promise<string> {
    try {
      const backupData = localStorage.getItem(`pitchguard_backup_${backupId}`);
      if (!backupData) {
        throw new Error('Backup not found');
      }
      return backupData;
    } catch (error) {
      console.error('Failed to export backup:', error);
      throw new Error('Failed to export backup');
    }
  }

  // Import backup from file
  async importBackup(backupString: string): Promise<BackupMetadata> {
    try {
      const backup = JSON.parse(backupString);
      
      if (!backup.version || !backup.createdAt) {
        throw new Error('Invalid backup format');
      }

      const backupId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const size = new Blob([backupString]).size;

      const metadata: BackupMetadata = {
        id: backupId,
        name: `Imported_${new Date().toLocaleDateString().replace(/\//g, '-')}`,
        createdAt: new Date().toISOString(),
        size,
        type: 'full',
        version: backup.version
      };

      // Store backup
      localStorage.setItem(`pitchguard_backup_${backupId}`, backupString);

      // Update backup list
      const existingBackups = this.getBackupList();
      existingBackups.push(metadata);
      localStorage.setItem('pitchguard_backups', JSON.stringify(existingBackups));

      return metadata;
    } catch (error) {
      console.error('Failed to import backup:', error);
      throw new Error('Failed to import backup');
    }
  }

  // Get backup details
  async getBackupDetails(backupId: string): Promise<any> {
    try {
      const backupData = localStorage.getItem(`pitchguard_backup_${backupId}`);
      if (!backupData) {
        throw new Error('Backup not found');
      }

      const backup = JSON.parse(backupData);
      return {
        version: backup.version,
        createdAt: backup.createdAt,
        config: backup.config,
        analysesCount: backup.analyses ? backup.analyses.length : 0,
        hasPreferences: !!backup.preferences,
        hasAnalytics: !!backup.analytics
      };
    } catch (error) {
      console.error('Failed to get backup details:', error);
      throw new Error('Failed to get backup details');
    }
  }

  // Clear all backups
  async clearAllBackups(): Promise<void> {
    try {
      const backups = this.getBackupList();
      
      // Remove all backup data
      backups.forEach(backup => {
        localStorage.removeItem(`pitchguard_backup_${backup.id}`);
      });

      // Clear backup list
      localStorage.removeItem('pitchguard_backups');
    } catch (error) {
      console.error('Failed to clear backups:', error);
      throw new Error('Failed to clear backups');
    }
  }
}

// Export singleton instance
export const BackupService = new BackupServiceClass();