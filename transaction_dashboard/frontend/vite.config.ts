import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution para imports absolutos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },

  // Server configuration
  server: {
    port: 3000,
    host: true, // Para acceso desde red local
    open: true, // Abrir navegador automáticamente
    cors: true,
    
    // Proxy para el backend (opcional si necesitamos evitar CORS)
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // Optimizaciones para producción
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para mejor caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'nivo-vendor': ['@nivo/core', '@nivo/bar', '@nivo/pie', '@nivo/line'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
    
    // Configuración de chunks
    chunkSizeWarningLimit: 1000,
  },

  // Preview configuration (para testing de build)
  preview: {
    port: 3000,
    host: true,
    open: true,
  },

  // CSS configuration
  css: {
    devSourcemap: true, // Source maps para CSS en desarrollo
    
    // PostCSS configuration (se puede override con postcss.config.js)
    postcss: './postcss.config.js',
  },

  // Define environment variables disponibles en runtime
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      '@nivo/core',
      '@nivo/bar',
      '@nivo/pie',
      '@nivo/line',
      'axios',
      'date-fns',
      'zustand',
    ],
    exclude: ['@shared'], // Exclude shared package para hot reload
  },

  // Environment variables
  envPrefix: ['VITE_'], // Solo variables que empiecen con VITE_ serán expuestas

  // Development configuration
  esbuild: {
    // Remover console.log en producción
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})