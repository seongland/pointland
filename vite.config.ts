import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify()
  ],
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
        rewrite: (path) => path.replace(/^\/tokyo-potree/, '/tokyo-potree')
      }
    }
  }
})
