import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4444,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:4004',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
