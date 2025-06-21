import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Zap,
  Eye,
  EyeOff,
  RotateCcw,
  Github,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import ClickSpark from './ClickSpark';
import PixelCard from './PixelCard';
import EncryptionSettings from './EncryptionSettings';
import Squares from './Squares';

import ParticleBackground from './ParticleBackground';

interface SettingsData {
  apiKey: string;
  animationsEnabled: boolean;
  encryptionLevel: 'standard' | 'high';
  modelProvider: 'openai' | 'mistral' | 'anthropic';
  notifications: {
    analysisComplete: boolean;
    securityAlerts: boolean;
    productUpdates: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    allowAnalytics: boolean;
  };
  performance: {
    autoSave: boolean;
    cacheResults: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'privacy' | 'advanced'>('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const [settings, setSettings] = useState<SettingsData>({
    apiKey: '',
    animationsEnabled: true,
    encryptionLevel: 'standard',
    modelProvider: 'mistral',
    notifications: {
      analysisComplete: true,
      securityAlerts: true,
      productUpdates: false
    },
    privacy: {
      shareUsageData: false,
      allowAnalytics: true
    },
    performance: {
      autoSave: true,
      cacheResults: true
    }
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('pitchguard_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateNestedSetting = <T extends keyof SettingsData>(
    category: T,
    key: keyof SettingsData[T],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as object),
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('pitchguard_settings', JSON.stringify({
        ...settings,
        lastUpdated: new Date().toISOString()
      }));
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleResetSettings = () => {
    const defaultSettings: SettingsData = {
      apiKey: '',
      animationsEnabled: true,
      encryptionLevel: 'standard',
      modelProvider: 'mistral',
      notifications: {
        analysisComplete: true,
        securityAlerts: true,
        productUpdates: false
      },
      privacy: {
        shareUsageData: false,
        allowAnalytics: true
      },
      performance: {
        autoSave: true,
        cacheResults: true
      }
    };

    setSettings(defaultSettings);
    setTheme('dark');
    setHasUnsavedChanges(true);
    toast.success('Settings reset to defaults');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={10} sparkRadius={35}>
      <div className="min-h-screen relative overflow-hidden">
        {}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(139, 92, 246, 0.08)"
            squareSize={50}
            hoverFillColor="rgba(139, 92, 246, 0.04)"
          />
        </div>

        {}
        <ParticleBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto p-6 space-y-8"
        >
      {}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-4"
        >
          <Settings className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Customize your Stealth Score experience and configure your preferences.
        </p>
      </div>

      <div className="space-y-8">
        {}
      <div className="glass-card p-2 mb-8">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-500/30 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {}
      <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">General Settings</h2>

                <div className="space-y-6">
                  {}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">API Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="apiKey" className="block text-white mb-2">OpenRouter API Key</label>
                        <div className="relative">
                          <input
                            id="apiKey"
                            type={showApiKey ? "text" : "password"}
                            value={settings.apiKey}
                            onChange={(e) => updateSetting('apiKey', e.target.value)}
                            placeholder="sk-or-v1-..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-white/50 text-sm mt-1">Your OpenRouter API key for accessing AI models</p>
                      </div>

                      <div>
                        <label htmlFor="modelProvider" className="block text-white mb-2">Model Provider</label>
                        <select
                          id="modelProvider"
                          value={settings.modelProvider}
                          onChange={(e) => updateSetting('modelProvider', e.target.value as any)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="mistral">Mistral AI</option>
                          <option value="openai">OpenAI</option>
                          <option value="anthropic">Anthropic</option>
                        </select>
                        <p className="text-white/50 text-sm mt-1">Select your preferred AI model provider</p>
                      </div>
                    </div>
                  </div>

                  {}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2">Theme</label>
                        <div className="flex gap-3">
                          {([
                            { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                            { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                            { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
                          ] as const).map((themeOption) => (
                            <button
                              key={themeOption.id}
                              onClick={() => {
                                setTheme(themeOption.id)
                                setHasUnsavedChanges(true)
                              }}
                              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                theme === themeOption.id
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {themeOption.icon}
                              <span>{themeOption.label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-white/50 text-sm mt-2">
                          {theme === 'system' ? 'Follows your system preference' : `Using ${theme} theme`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Enable Animations</label>
                          <p className="text-white/50 text-sm">Smooth transitions and visual effects</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.animationsEnabled ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateSetting('animationsEnabled', !settings.animationsEnabled)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {}
              <EncryptionSettings />

              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Encryption Level</h3>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => updateSetting('encryptionLevel', 'standard')}
                          className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                            settings.encryptionLevel === 'standard'
                              ? 'bg-blue-500/20 border-blue-400 text-white'
                              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium mb-1">Standard (AES-256-GCM)</div>
                            <div className="text-sm opacity-70">Recommended for most users</div>
                          </div>
                        </button>
                        <button
                          onClick={() => updateSetting('encryptionLevel', 'high')}
                          className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                            settings.encryptionLevel === 'high'
                              ? 'bg-blue-500/20 border-blue-400 text-white'
                              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium mb-1">High (AES-256 + RSA)</div>
                            <div className="text-sm opacity-70">Maximum security, slower performance</div>
                          </div>
                        </button>
                      </div>
                      <p className="text-white/50 text-sm">Higher encryption levels provide additional security but may affect performance</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Analysis Complete</label>
                          <p className="text-white/50 text-sm">Get notified when pitch analysis is finished</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.notifications.analysisComplete ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('notifications', 'analysisComplete', !settings.notifications.analysisComplete)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.notifications.analysisComplete ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Security Alerts</label>
                          <p className="text-white/50 text-sm">Important security notifications and updates</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.notifications.securityAlerts ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('notifications', 'securityAlerts', !settings.notifications.securityAlerts)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.notifications.securityAlerts ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Product Updates</label>
                          <p className="text-white/50 text-sm">New features and product announcements</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.notifications.productUpdates ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('notifications', 'productUpdates', !settings.notifications.productUpdates)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.notifications.productUpdates ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-medium">Privacy First</span>
                    </div>
                    <p className="text-blue-200 text-sm">
                      Stealth Score is designed with privacy at its core. Your pitch content is never stored on our servers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Share Usage Data</label>
                        <p className="text-white/50 text-sm">Help improve Stealth Score by sharing anonymous usage statistics</p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          settings.privacy.shareUsageData ? 'bg-blue-500' : 'bg-white/20'
                        }`}
                        onClick={() => updateNestedSetting('privacy', 'shareUsageData', !settings.privacy.shareUsageData)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            settings.privacy.shareUsageData ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Allow Analytics</label>
                        <p className="text-white/50 text-sm">Enable analytics to help us understand how you use the app</p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          settings.privacy.allowAnalytics ? 'bg-blue-500' : 'bg-white/20'
                        }`}
                        onClick={() => updateNestedSetting('privacy', 'allowAnalytics', !settings.privacy.allowAnalytics)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            settings.privacy.allowAnalytics ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Data Retention Policy</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Pitch content: Immediately deleted after analysis</li>
                      <li>• Analysis results: Stored locally in your browser only</li>
                      <li>• Usage data: Anonymized and aggregated if sharing is enabled</li>
                      <li>• Account data: Managed by Clerk authentication service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">Advanced Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Performance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Auto-save Results</label>
                          <p className="text-white/50 text-sm">Automatically save analysis results to local storage</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.performance.autoSave ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('performance', 'autoSave', !settings.performance.autoSave)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.performance.autoSave ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Cache Results</label>
                          <p className="text-white/50 text-sm">Cache analysis results for faster access</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.performance.cacheResults ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('performance', 'cacheResults', !settings.performance.cacheResults)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.performance.cacheResults ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
                    <div className="space-y-3">
                      <ClickSpark sparkColor="#ef4444" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="pink" className="w-full">
                          <button className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-400/30 rounded-lg hover:bg-red-500/20 transition-colors">
                            <div className="text-left">
                              <div className="text-white font-medium">Clear All Data</div>
                              <div className="text-red-200 text-sm">Remove all locally stored data and settings</div>
                            </div>
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>

                      <ClickSpark sparkColor="#3b82f6" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="blue" className="w-full">
                          <button className="w-full flex items-center justify-between p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg hover:bg-blue-500/20 transition-colors">
                            <div className="text-left">
                              <div className="text-white font-medium">Export Settings</div>
                              <div className="text-blue-200 text-sm">Download your settings as a backup file</div>
                            </div>
                            <Download className="w-5 h-5 text-blue-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>
                    </div>
                  </div>

                  <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Debug Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white ml-2">1.0.0</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Build:</span>
                        <span className="text-white ml-2">2024.01.15</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Environment:</span>
                        <span className="text-white ml-2">Production</span>
                      </div>
                      <div>
                        <span className="text-gray-400">API Status:</span>
                        <span className="text-green-400 ml-2">Connected</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Developer Resources</h3>
                    <div className="space-y-3">
                      <ClickSpark sparkColor="#6366f1" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="blue" className="w-full">
                          <button
                            onClick={() => window.open('https://github.com/Sagexd08/StealthScore')}
                            className="w-full flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-400/30 rounded-lg hover:bg-indigo-500/20 transition-colors"
                          >
                            <div className="text-left">
                              <div className="text-white font-medium">View Source Code</div>
                              <div className="text-indigo-200 text-sm">Explore the open-source codebase on GitHub</div>
                            </div>
                            <Github className="w-5 h-5 text-indigo-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>

                      <ClickSpark sparkColor="#10b981" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="blue" className="w-full">
                          <button
                            onClick={() => window.open('https://github.com/Sagexd08/StealthScore/issues')}
                            className="w-full flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-500/20 transition-colors"
                          >
                            <div className="text-left">
                              <div className="text-white font-medium">Report Issues</div>
                              <div className="text-emerald-200 text-sm">Submit bug reports and feature requests</div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-emerald-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>

                      <ClickSpark sparkColor="#f59e0b" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="blue" className="w-full">
                          <button
                            onClick={() => window.open('https://github.com/Sagexd08/StealthScore/blob/main/README.md')}
                            className="w-full flex items-center justify-between p-4 bg-amber-500/10 border border-amber-400/30 rounded-lg hover:bg-amber-500/20 transition-colors"
                          >
                            <div className="text-left">
                              <div className="text-white font-medium">Documentation</div>
                              <div className="text-amber-200 text-sm">Read the complete project documentation</div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-amber-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mt-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-white/70">You have unsaved changes</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResetSettings}
                  className="flex items-center gap-2 glass-button px-4 py-2 text-white/70 font-medium hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
        </div>
        </motion.div>
      </div>
    </ClickSpark>
  );
};

export default SettingsPage;
