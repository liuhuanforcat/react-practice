import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'react-redis-test', // 默认是 'dist'，可修改为任意目录名
  },
  resolve: {
    alias: {
      "@/*": "src/*",
      stream: 'stream-browserify',
    },
  },
  server: {
    proxy: {
      '/device': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, ''),
      },
    },
  },
  define: {
    global: 'window', // 让 simple-peer 依赖的 randombytes 能找到 global
  },
})
