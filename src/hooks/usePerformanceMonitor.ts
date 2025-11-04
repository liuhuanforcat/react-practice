import { useEffect, useRef, useState } from 'react';
import { PerformanceMonitor, PerformanceMetrics, TrackingConfig, createPerformanceMonitor } from '../utils/performanceMonitor';

/**
 * 性能监控 Hook
 * 用于在组件中方便地使用性能监控功能
 */
export const usePerformanceMonitor = (config?: TrackingConfig) => {
  const monitorRef = useRef<PerformanceMonitor | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 初始化监控
    monitorRef.current = createPerformanceMonitor(config);
    monitorRef.current.init();
    setIsInitialized(true);

    // 定期更新指标（用于实时展示）
    const updateMetrics = () => {
      if (monitorRef.current) {
        const currentMetrics = monitorRef.current.getMetrics();
        setMetrics(currentMetrics);
      }
    };

    // 立即获取一次
    updateMetrics();

    // 每秒更新一次（主要用于内存等动态指标）
    const interval = setInterval(updateMetrics, 1000);

    // 页面可见性变化时更新
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateMetrics();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (monitorRef.current) {
        monitorRef.current.destroy();
      }
    };
  }, []);

  // 手动上报
  const report = (customMetrics?: PerformanceMetrics) => {
    if (monitorRef.current) {
      monitorRef.current.report(customMetrics);
    }
  };

  // 获取当前指标
  const getMetrics = (): PerformanceMetrics => {
    if (monitorRef.current) {
      return monitorRef.current.getMetrics();
    }
    return {};
  };

  return {
    metrics,
    isInitialized,
    report,
    getMetrics,
  };
};

export default usePerformanceMonitor;


