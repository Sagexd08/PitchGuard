import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
  bundleSize: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showInProduction?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  showInProduction = false,
  position = 'bottom-right'
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    bundleSize: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled && !showInProduction) return;

    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            setMetrics(prev => ({ ...prev, renderTime: entry.duration }));
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }

    measureLoadTime();
    measureMemory();
    measureFPS();

    const memoryInterval = setInterval(measureMemory, 5000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, [enabled, showInProduction]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!enabled && !showInProduction) return null;

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="glass-card p-2 rounded-lg cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
      </motion.button>

      {isVisible && (
        <motion.div
          className="glass-card p-4 mt-2 min-w-[200px] text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <h3 className="text-white font-semibold mb-3 text-center">Performance</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Load Time:</span>
              <span className={getMetricColor(metrics.loadTime, { good: 1000, warning: 3000 })}>
                {metrics.loadTime}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">FPS:</span>
              <span className={getMetricColor(60 - metrics.fps, { good: 10, warning: 20 })}>
                {metrics.fps}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Memory:</span>
              <span className={getMetricColor(metrics.memoryUsage, { good: 50, warning: 100 })}>
                {metrics.memoryUsage}MB
              </span>
            </div>
            
            {metrics.renderTime > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Render:</span>
                <span className={getMetricColor(metrics.renderTime, { good: 16, warning: 33 })}>
                  {metrics.renderTime.toFixed(1)}ms
                </span>
              </div>
            )}
          </div>

          {}
          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Status:</span>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  metrics.loadTime <= 1000 ? 'bg-green-400' : 
                  metrics.loadTime <= 3000 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div className={`w-2 h-2 rounded-full ${
                  metrics.fps >= 50 ? 'bg-green-400' : 
                  metrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div className={`w-2 h-2 rounded-full ${
                  metrics.memoryUsage <= 50 ? 'bg-green-400' : 
                  metrics.memoryUsage <= 100 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PerformanceMonitor;
