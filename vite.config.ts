import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { buildStats } from './plugins/buildStats'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    // 构建统计插件
    buildStats(),
    
    // Gzip 压缩（兼容所有浏览器）
    viteCompression({
      verbose: true, // 在控制台输出压缩结果
      disable: false, // 是否禁用
      threshold: 10240, // 文件大于 10KB 才压缩
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 文件扩展名
      deleteOriginFile: false, // 压缩后是否删除原文件
    }),
    
    // Brotli 压缩（压缩率更高，现代浏览器支持）
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress', // 使用 Brotli 算法
      ext: '.br', // 生成 .br 文件
      deleteOriginFile: false,
    }),

    // 只在生产构建时启用
    // visualizer({
    //   open: true,
    //   filename: 'react-redis-test/stats.html', // 注意：匹配你的 outDir
    //   gzipSize: true,
    //   brotliSize: true,
    //   template: 'treemap', // treemap 视图最直观
    // }),
  ],
  build: {
    outDir: 'react-redis-test', // 默认是 'dist'，可修改为任意目录名
    // 代码分割优化
    rollupOptions: {
      output: {
        // 分包策略
        manualChunks: {
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          'antd-ui': ['antd', '@ant-design/icons'],
          'utils': ['axios', 'ahooks'],
        },
      },
    },
    // 压缩配置（使用 esbuild，速度更快）
    minify: 'esbuild',
    chunkSizeWarningLimit: 2000, // chunk 大小警告阈值（KB）
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
