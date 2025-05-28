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
    },
  },
})
