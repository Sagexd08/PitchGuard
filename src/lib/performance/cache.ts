// Cache Metrics - Simple cache monitoring for MVP
// This is a client-side only implementation

import { useState, useEffect } from 'react';

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  cacheSize: number;
  evictions: number;
  averageResponseTime: number;
}

export interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  hits: number;
  lastAccessed: number;
}

class CacheMetricsClass {
  private cache: Map<string, CacheEntry> = new Map();
  private metrics: CacheMetrics = {
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    cacheSize: 0,
    evictions: 0,
    averageResponseTime: 0
  };
  private responseTimes: number[] = [];

  // Set cache entry
  set(key: string, value: any): void {
    const now = Date.now();
    const entry: CacheEntry = {
      key,
      value,
      timestamp: now,
      hits: 0,
      lastAccessed: now
    };

    this.cache.set(key, entry);
    this.updateMetrics();
  }

  // Get cache entry
  get(key: string): any {
    const startTime = performance.now();
    const entry = this.cache.get(key);
    const endTime = performance.now();
    
    this.responseTimes.push(endTime - startTime);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }

    this.metrics.totalRequests++;

    if (entry) {
      entry.hits++;
      entry.lastAccessed = Date.now();
      this.updateMetrics();
      return entry.value;
    }

    this.updateMetrics();
    return null;
  }

  // Check if key exists
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Delete cache entry
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.metrics.evictions++;
      this.updateMetrics();
    }
    return deleted;
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
    this.metrics.evictions += this.metrics.cacheSize;
    this.updateMetrics();
  }

  // Update metrics
  private updateMetrics(): void {
    const totalRequests = this.metrics.totalRequests;
    const hits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0);
    const misses = totalRequests - hits;

    this.metrics = {
      hitRate: totalRequests > 0 ? (hits / totalRequests) * 100 : 0,
      missRate: totalRequests > 0 ? (misses / totalRequests) * 100 : 0,
      totalRequests,
      cacheSize: this.cache.size,
      evictions: this.metrics.evictions,
      averageResponseTime: this.responseTimes.length > 0 
        ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
        : 0
    };
  }

  // Get current metrics
  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  // Get cache entries
  getEntries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  // Get most accessed entries
  getMostAccessed(limit: number = 10): CacheEntry[] {
    return Array.from(this.cache.values())
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }

  // Get least recently used entries
  getLeastRecentlyUsed(limit: number = 10): CacheEntry[] {
    return Array.from(this.cache.values())
      .sort((a, b) => a.lastAccessed - b.lastAccessed)
      .slice(0, limit);
  }

  // Simulate cache operations for demo
  simulateOperations(): void {
    const keys = ['user_data', 'api_response', 'image_cache', 'config', 'analytics'];
    const operations = 50;

    for (let i = 0; i < operations; i++) {
      const key = keys[Math.floor(Math.random() * keys.length)];
      
      if (Math.random() > 0.3) {
        // 70% chance of get operation
        this.get(key);
      } else {
        // 30% chance of set operation
        this.set(key, `value_${i}`);
      }
    }
  }
}

// Export singleton instance
export const CacheMetrics = new CacheMetricsClass();

// React hook for cache metrics
export const useCacheMetrics = () => {
  const [metrics, setMetrics] = useState<CacheMetrics>({
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    cacheSize: 0,
    evictions: 0,
    averageResponseTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate some cache operations for demo
    CacheMetrics.simulateOperations();

    // Update metrics every 3 seconds
    const interval = setInterval(() => {
      const currentMetrics = CacheMetrics.getMetrics();
      setMetrics(currentMetrics);
      setIsLoading(false);
    }, 3000);

    // Get initial metrics
    setTimeout(() => {
      const initialMetrics = CacheMetrics.getMetrics();
      setMetrics(initialMetrics);
      setIsLoading(false);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    isLoading,
    mostAccessed: CacheMetrics.getMostAccessed(),
    leastRecentlyUsed: CacheMetrics.getLeastRecentlyUsed(),
    clearCache: () => CacheMetrics.clear()
  };
};