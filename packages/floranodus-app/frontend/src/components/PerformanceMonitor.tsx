import { useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Activity, Zap, Database } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  nodeCount: number;
  edgeCount: number;
  memoryUsage: number;
  renderTime: number;
}

const PerformanceMonitor = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    nodeCount: 0,
    edgeCount: 0,
    memoryUsage: 0,
    renderTime: 0,
  });
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics({
          fps,
          nodeCount: getNodes().length,
          edgeCount: getEdges().length,
          memoryUsage: (performance as any).memory?.usedJSHeapSize 
            ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
            : 0,
          renderTime: Math.round(currentTime - lastTime) / frameCount,
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    if (showMetrics) {
      measureFPS();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showMetrics, getNodes, getEdges]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="p-2 bg-floranodus-bg-secondary border border-floranodus-border rounded-lg hover:bg-floranodus-bg-tertiary transition-colors"
        title="Performance Metrics"
      >
        <Activity size={20} />
      </button>

      {showMetrics && (
        <div className="absolute bottom-full right-0 mb-2 bg-floranodus-bg-secondary border border-floranodus-border rounded-lg p-4 w-64">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Zap size={14} className="text-floranodus-accent-primary" />
            Performance
          </h3>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-floranodus-text-secondary">FPS:</span>
              <span className={metrics.fps < 30 ? 'text-floranodus-error' : 'text-floranodus-success'}>
                {metrics.fps}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-floranodus-text-secondary">Nodes:</span>
              <span>{metrics.nodeCount}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-floranodus-text-secondary">Edges:</span>
              <span>{metrics.edgeCount}</span>
            </div>
            
            {metrics.memoryUsage > 0 && (
              <div className="flex justify-between">
                <span className="text-floranodus-text-secondary">Memory:</span>
                <span>{metrics.memoryUsage} MB</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-floranodus-text-secondary">Render:</span>
              <span>{metrics.renderTime.toFixed(2)} ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor; 