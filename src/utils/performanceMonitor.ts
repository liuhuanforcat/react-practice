/**
 * 性能监控工具 - 首屏指标埋点
 * 用于采集和上报页面性能指标
 */

// 性能指标接口定义
export interface PerformanceMetrics {
  // 基础指标
  fcp?: number; // First Contentful Paint - 首次内容绘制
  lcp?: number; // Largest Contentful Paint - 最大内容绘制
  fid?: number; // First Input Delay - 首次输入延迟
  cls?: number; // Cumulative Layout Shift - 累积布局偏移
  ttfb?: number; // Time to First Byte - 首字节时间
  fmp?: number; // First Meaningful Paint - 首次有意义绘制
  
  // 时间指标
  domContentLoaded?: number; // DOM加载完成时间
  loadComplete?: number; // 页面完全加载时间
  firstScreenTime?: number; // 首屏渲染时间
  
  // 资源指标
  resourceCount?: number; // 资源数量
  resourceSize?: number; // 资源总大小
  
  // 内存指标
  memoryUsage?: {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  };
  
  // 网络指标
  dnsTime?: number; // DNS查询时间
  tcpTime?: number; // TCP连接时间
  requestTime?: number; // 请求时间
  responseTime?: number; // 响应时间
  
  // 其他信息
  url?: string;
  timestamp?: number;
  userAgent?: string;
  connectionType?: string;
}

// 埋点配置
export interface TrackingConfig {
  apiUrl?: string; // 上报接口地址
  enableConsole?: boolean; // 是否在控制台输出
  enableLocalStorage?: boolean; // 是否存储到本地
  samplingRate?: number; // 采样率 0-1
}

class PerformanceMonitor {
  private config: TrackingConfig;
  private metrics: PerformanceMetrics = {};
  private observerCallbacks: (() => void)[] = [];

  constructor(config: TrackingConfig = {}) {
    this.config = {
      enableConsole: true,
      enableLocalStorage: false,
      samplingRate: 1,
      ...config,
    };
  }

  /**
   * 初始化性能监控
   */
  init(): void {
    if (typeof window === 'undefined') return;
    
    // 采样判断
    if (Math.random() > (this.config.samplingRate || 1)) {
      return;
    }

    this.collectBasicMetrics();
    this.collectWebVitals();
    this.collectResourceMetrics();
    this.collectMemoryMetrics();
    this.collectNetworkMetrics();

    // 页面可见性变化时上报
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.report();
      }
    });

    // 页面卸载时上报
    window.addEventListener('beforeunload', () => {
      this.report();
    });
  }

  /**
   * 采集基础性能指标
   */
  private collectBasicMetrics(): void {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    this.metrics = {
      ...this.metrics,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      
      // DNS查询时间
      dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
      
      // TCP连接时间
      tcpTime: timing.connectEnd - timing.connectStart,
      
      // 请求时间
      requestTime: timing.responseStart - timing.requestStart,
      
      // 响应时间
      responseTime: timing.responseEnd - timing.responseStart,
      
      // TTFB - 首字节时间
      ttfb: timing.responseStart - timing.navigationStart,
      
      // DOM加载完成时间
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      
      // 页面完全加载时间
      loadComplete: timing.loadEventEnd - timing.navigationStart,
    };

    // 计算首屏时间（简化版本，实际需要更复杂的计算）
    this.calculateFirstScreenTime();
  }

  /**
   * 计算首屏渲染时间
   */
  private calculateFirstScreenTime(): void {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    
    // 方法1: 使用 DOMContentLoaded
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    
    // 方法2: 使用 load 事件
    const load = timing.loadEventEnd - timing.navigationStart;
    
    // 方法3: 使用 performance.getEntriesByType('navigation')
    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    let domInteractive = 0;
    if (navigationEntries.length > 0) {
      domInteractive = navigationEntries[0].domInteractive;
    }
    
    // 取最小值作为首屏时间
    this.metrics.firstScreenTime = Math.min(domReady, load, domInteractive || Infinity);
  }

  /**
   * 采集 Web Vitals 指标
   */
  private collectWebVitals(): void {
    // FCP - First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint') as PerformancePaintTiming;
          if (fcpEntry) {
            this.metrics.fcp = fcpEntry.startTime;
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observerCallbacks.push(() => fcpObserver.disconnect());
      } catch (e) {
        console.warn('FCP observer failed:', e);
      }

      // LCP - Largest Contentful Paint
      try {
        let lcpValue = 0;
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          lcpValue = lastEntry.renderTime || lastEntry.loadTime;
          this.metrics.lcp = lcpValue;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observerCallbacks.push(() => lcpObserver.disconnect());
      } catch (e) {
        console.warn('LCP observer failed:', e);
      }

      // FID - First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fidEntry = entries[0] as any;
          if (fidEntry && !this.metrics.fid) {
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observerCallbacks.push(() => fidObserver.disconnect());
      } catch (e) {
        console.warn('FID observer failed:', e);
      }

      // CLS - Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observerCallbacks.push(() => clsObserver.disconnect());
      } catch (e) {
        console.warn('CLS observer failed:', e);
      }
    }
  }

  /**
   * 采集资源指标
   */
  private collectResourceMetrics(): void {
    if (!window.performance || !window.performance.getEntriesByType) return;

    const resourceEntries = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    this.metrics.resourceCount = resourceEntries.length;
    
    // 计算资源总大小
    let totalSize = 0;
    resourceEntries.forEach(entry => {
      if (entry.transferSize) {
        totalSize += entry.transferSize;
      }
    });
    this.metrics.resourceSize = totalSize;
  }

  /**
   * 采集内存指标
   */
  private collectMemoryMetrics(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
  }

  /**
   * 采集网络指标
   */
  private collectNetworkMetrics(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        this.metrics.connectionType = connection.effectiveType || 'unknown';
      }
    }
  }

  /**
   * 获取当前指标
   */
  getMetrics(): PerformanceMetrics {
    // 更新实时指标
    this.collectMemoryMetrics();
    return { ...this.metrics };
  }

  /**
   * 上报性能数据
   */
  report(metrics?: PerformanceMetrics): void {
    const data = metrics || this.getMetrics();
    
    // 控制台输出
    if (this.config.enableConsole) {
      console.log('📊 Performance Metrics:', data);
    }

    // 本地存储
    if (this.config.enableLocalStorage) {
      try {
        const stored = localStorage.getItem('performance_metrics') || '[]';
        const metricsList = JSON.parse(stored);
        metricsList.push(data);
        localStorage.setItem('performance_metrics', JSON.stringify(metricsList.slice(-100))); // 只保留最近100条
      } catch (e) {
        console.warn('Failed to save metrics to localStorage:', e);
      }
    }

    // 上报到服务器
    if (this.config.apiUrl) {
      this.sendToServer(data);
    }
  }

  /**
   * 发送数据到服务器
   */
  private async sendToServer(data: PerformanceMetrics): Promise<void> {
    if (!this.config.apiUrl) return;

    try {
      // 使用 sendBeacon 确保在页面卸载时也能发送
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.config.apiUrl, blob);
      } else {
        // 降级方案：使用 fetch
        fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          keepalive: true,
        }).catch(err => {
          console.warn('Failed to send metrics:', err);
        });
      }
    } catch (error) {
      console.warn('Failed to report metrics:', error);
    }
  }

  /**
   * 清理观察者
   */
  destroy(): void {
    this.observerCallbacks.forEach(callback => callback());
    this.observerCallbacks = [];
  }
}

// 导出单例
let monitorInstance: PerformanceMonitor | null = null;

/**
 * 创建性能监控实例
 */
export function createPerformanceMonitor(config?: TrackingConfig): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor(config);
  }
  return monitorInstance;
}

/**
 * 获取性能监控实例
 */
export function getPerformanceMonitor(): PerformanceMonitor | null {
  return monitorInstance;
}

export default PerformanceMonitor;


