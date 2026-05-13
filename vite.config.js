import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8080',  // 生产环境 
        target: 'http://101.200.136.96:8080',  // 开发环境
        
        secure: false,
        changeOrigin: true,

        /* 仅开发环境生效 生产环境需配置Nginx反向代理重写URL */
        rewrite: (path) => path.replace(/^\/api/, '/nullbot'),
      },
    },
  },
})
