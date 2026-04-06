import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/',
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/workshop/login': 'http://localhost:8000',
      '/workshop/logout': 'http://localhost:8000',
      '/admin': 'http://localhost:8000',
      '/static': 'http://localhost:8000',
      '/data': 'http://localhost:8000',
    }
  }
})
