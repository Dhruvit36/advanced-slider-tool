import React, { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  layerCount: number;
  cacheHits: number;
  cacheMisses: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    memoryUsage: 0,
    layerCount: 0,
    cacheHits: 0,
    cacheMisses: 0
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(0);

  // FPS Monitoring
  useEffect(() => {
    let animationId: number;
    
    const measureFPS = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastTime.current >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount.current * 1000) / (now - lastTime.current))
        }));
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Memory Usage Monitoring
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1048576) // Convert to MB
        }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 2000);
    return () => clearInterval(interval);
  }, []);

  const startRenderMeasurement = () => {
    renderStartTime.current = performance.now();
  };

  const endRenderMeasurement = () => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(renderTime * 100) / 100
    }));
  };

  const updateLayerCount = (count: number) => {
    setMetrics(prev => ({
      ...prev,
      layerCount: count
    }));
  };

  const recordCacheHit = () => {
    setMetrics(prev => ({
      ...prev,
      cacheHits: prev.cacheHits + 1
    }));
  };

  const recordCacheMiss = () => {
    setMetrics(prev => ({
      ...prev,
      cacheMisses: prev.cacheMisses + 1
    }));
  };

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement,
    updateLayerCount,
    recordCacheHit,
    recordCacheMiss
  };
};

// Performance monitoring component
export const PerformanceMonitor: React.FC<{ show: boolean }> = ({ show }) => {
  const { metrics } = usePerformanceMonitor();

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-semibold">Performance Metrics</div>
      <div className="space-y-1">
        <div className={`flex justify-between ${metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
          <span>FPS:</span>
          <span>{metrics.fps}</span>
        </div>
        <div className="flex justify-between">
          <span>Render:</span>
          <span>{metrics.renderTime}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span>{metrics.memoryUsage}MB</span>
        </div>
        <div className="flex justify-between">
          <span>Layers:</span>
          <span>{metrics.layerCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Cache Hit Rate:</span>
          <span>
            {metrics.cacheHits + metrics.cacheMisses > 0 
              ? Math.round((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};
