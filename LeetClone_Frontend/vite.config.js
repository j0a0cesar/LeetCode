import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      // Redireciona qualquer pedido do React que comece com /api para o backend 
      '/api': {
      
        target: 'http://localhost:5178', 
        changeOrigin: true,
        secure: false, // se for http , caso a gnt mudar ver essa linha 
      },
    },
  },
})