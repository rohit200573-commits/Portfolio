import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reticle } from '@reticlehq/core/vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [reticle(), react()],
  base: command === 'build' ? '/static/' : '/',
  build: {
    outDir: '../static',
    emptyOutDir: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
}))
