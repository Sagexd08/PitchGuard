// Performance Monitor - Simple performance monitoring for MVP
// This is a client-side only implementation

import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  fps: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface PerformanceData {
  timestamp: string;
  metrics: PerformanceMetrics;
  url: string;
  userAgent: string;
}

class PerformanceMonitorClass {
  private metrics: PerformanceData[] = [];
  private observers: PerformanceObserver[] = [];

  // Initialize performance monitoring
  init(): void {
    if (typeof window === 'undefined') return;

    // Monitor navigation timing
    this.monitorNavigationTiming();
    
    // Monitor resource timing
    this.monitorResourceTiming();
    
    // Monitor FPS
    this.monitorFPS();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
  }

  private monitorNavigationTiming(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      this.recordMetric({
        loadTime,
        renderTime,
        memoryUsage: this.getMemoryUsage(),
        networkLatency: navigation.responseStart - navigation.requestStart,
        fps: 60, // Default value
        bundleSize: 0, // Will be calculated separately
        cacheHitRate: 0.95, // Mock value
        errorRate: 0.01 // Mock value
      });
    }
  }

  private monitorResourceTiming(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    const resources = window.performance.getEntriesByType('resource');
    let totalSize = 0;
    
    resources.forEach((resource: any) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
      }
    });

    // Update bundle size
    const currentMetrics = this.getCurrentMetrics();
    if (currentMetrics) {
      currentMetrics.metrics.bundleSize = totalSize;
    }
  }

  private monitorFPS(): void {
    if (typeof window === 'undefined') return;

    let frames = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        const currentMetrics = this.getCurrentMetrics();
        if (currentMetrics) {
          currentMetrics.metrics.fps = fps;
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);
  }

  private monitorMemoryUsage(): void {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      const memoryUsage = this.getMemoryUsage();
      const currentMetrics = this.getCurrentMetrics();
      if (currentMetrics) {
        currentMetrics.metrics.memoryUsage = memoryUsage;
      }
    }, 5000);
  }

  private getMemoryUsage(): number {
    if (typeof window === 'undefined') return 0;
    
    // @ts-ignore - performance.memory is not in all browsers
    if (window.performance && window.performance.memory) {
      // @ts-ignore
      return window.performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    
    return 0;
  }

  private recordMetric(metrics: PerformanceMetrics): void {
    const data: PerformanceData = {
      timestamp: new Date().toISOString(),
      metrics,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    this.metrics.push(data);
    
    // Keep only last 100 entries
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  private getCurrentMetrics(): PerformanceData | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  // Get performance metrics
  getMetrics(): PerformanceData[] {
    return this.metrics;
  }

  // Get latest metrics
  getLatestMetrics(): PerformanceMetrics | null {
    const latest = this.getCurrentMetrics();
    return latest ? latest.metrics : null;
  }

  // Get average metrics
  getAverageMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;

    const totals = this.metrics.reduce((acc, data) => ({
      loadTime: acc.loadTime + data.metrics.loadTime,
      renderTime: acc.renderTime + data.metrics.renderTime,
      memoryUsage: acc.memoryUsage + data.metrics.memoryUsage,
      networkLatency: acc.networkLatency + data.metrics.networkLatency,
      fps: acc.fps + data.metrics.fps,
      bundleSize: acc.bundleSize + data.metrics.bundleSize,
      cacheHitRate: acc.cacheHitRate + data.metrics.cacheHitRate,
      errorRate: acc.errorRate + data.metrics.errorRate
    }), {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkLatency: 0,
      fps: 0,
      bundleSize: 0,
      cacheHitRate: 0,
      errorRate: 0
    });

    const count = this.metrics.length;
    return {
      loadTime: Math.round(totals.loadTime / count),
      renderTime: Math.round(totals.renderTime / count),
      memoryUsage: Math.round(totals.memoryUsage / count),
      networkLatency: Math.round(totals.networkLatency / count),
      fps: Math.round(totals.fps / count),
      bundleSize: Math.round(totals.bundleSize / count),
      cacheHitRate: Math.round((totals.cacheHitRate / count) * 100) / 100,
      errorRate: Math.round((totals.errorRate / count) * 100) / 100
    };
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Export singleton instance
export const PerformanceMonitor = new PerformanceMonitorClass();

// React hook for performance metrics
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize performance monitoring
    PerformanceMonitor.init();

    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const latestMetrics = PerformanceMonitor.getLatestMetrics();
      if (latestMetrics) {
        setMetrics(latestMetrics);
        setIsLoading(false);
      }
    }, 2000);

    // Get initial metrics
    setTimeout(() => {
      const initialMetrics = PerformanceMonitor.getLatestMetrics();
      if (initialMetrics) {
        setMetrics(initialMetrics);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    isLoading,
    averageMetrics: PerformanceMonitor.getAverageMetrics(),
    clearMetrics: () => PerformanceMonitor.clearMetrics()
  };
};