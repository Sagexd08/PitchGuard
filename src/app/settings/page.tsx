'use client';

import React from 'react';
import SettingsPage from '../../components/SettingsPage';
import ParticleBackground from '../../components/ParticleBackground';
import Squares from '../../components/Squares';
import ClickSpark from '../../components/ClickSpark';
import Dock from '../../components/Dock';
import PerformanceMonitor from '../../components/PerformanceMonitor';
import { Home, Brain, Shield, Settings, Crown, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPageRoute() {
  const router = useRouter();

  const createDockItems = () => [
    {
      id: 'home',
      icon: <Home className="w-6 h-6" />,
      label: 'Home',
      onClick: () => router.push('/'),
      active: false,
    },
    {
      id: 'analyzer',
      icon: <Brain className="w-6 h-6" />,
      label: 'Analyzer',
      onClick: () => router.push('/analyzer'),
      active: false,
    },
    {
      id: 'security',
      icon: <Shield className="w-6 h-6" />,
      label: 'Security',
      onClick: () => router.push('/security'),
      active: false,
    },
    {
      id: 'settings',
      icon: <Settings className="w-6 h-6" />,
      label: 'Settings',
      onClick: () => router.push('/settings'),
      active: true,
    },
    {
      id: 'pricing',
      icon: <Crown className="w-6 h-6" />,
      label: 'Pricing',
      onClick: () => router.push('/pricing'),
      active: false,
    },
    {
      id: 'github',
      icon: <Github className="w-6 h-6" />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/Sagexd08/StealthScore', '_blank'),
      active: false,
    },
  ];

  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <ParticleBackground />
        
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="rgba(99, 102, 241, 0.1)"
          squareSize={60}
          hoverFillColor="rgba(99, 102, 241, 0.05)"
        />

        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">
            <SettingsPage />
          </main>

          <Dock items={createDockItems()} />

          <PerformanceMonitor
            enabled={true}
            showInProduction={false}
            position="bottom-right"
          />
        </div>
      </div>
    </ClickSpark>
  );
}
