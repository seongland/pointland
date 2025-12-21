import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  define: {
    __dirname: 'window.location.pathname',
    'process.env': {},
  },
  server: {
    proxy: {
      '/tokyo-potree': {
        target: 'https://storage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tokyo-potree/, '/tokyo-potree'),
      },
    },
  },
})
