import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // ou '0.0.0.0'
    port: 5173,
    strictPort: true, // garante que a porta não muda
    allowedHosts: [
      ".ngrok-free.app"
    ]
  }
})
