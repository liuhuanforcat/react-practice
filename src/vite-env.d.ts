/// <reference types="vite/client" />

interface AMapInstance {
  Map: new (container: string, options?: Record<string, unknown>) => unknown;
  Marker: new (options?: Record<string, unknown>) => unknown;
  [key: string]: unknown;
}

interface Window {
  AMap: AMapInstance;
}

