import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path aliases - simplified to avoid conflicts
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },

  // Dev server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['@nivo/core', '@nivo/bar', '@nivo/pie', '@nivo/line'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },

  // Environment variables
  envPrefix: 'VITE_',
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
})