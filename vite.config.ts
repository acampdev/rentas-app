// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiTarget = env.VITE_API_URL
  const enableDebugLogs = env.VITE_ENABLE_DEBUG_LOGS === 'true'

  if (!apiTarget) {
    throw new Error('VITE_API_URL debe estar configurada para iniciar Vite')
  }

  return {
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/models/**',
        'src/types/**'
      ]
    }
  },
  // Los logs del navegador quedan desactivados por defecto también en desarrollo.
  // Para una sesión de diagnóstico explícita use VITE_ENABLE_DEBUG_LOGS=true.
  esbuild: enableDebugLogs ? undefined : { drop: ['console', 'debugger'] },
  
  // Resolver alias para importaciones
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/types': path.resolve(__dirname, './src/types'),
    }
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true, // Permite acceso desde la red local
    
    
    // Configuración del proxy para evitar CORS
    proxy: {
      // Proxy para todas las rutas /api/*
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        }
      },
      
      // Proxy para rutas de autenticación /auth/*
      '/auth': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        }
      }
    }
  },
  
  // Configuración de build
  build: {
    outDir: 'dist',
    sourcemap: false,
    reportCompressedSize: true,
    // Mantener el umbral estándar como control de regresiones. Los chunks PDF
    // son diferidos, pero deben seguir apareciendo en el reporte si exceden 500 KB.
    chunkSizeWarningLimit: 500,
    // Manejar chunks grandes
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Evitar que el helper de precarga de Vite quede incluido dentro de
          // un motor PDF y fuerce su descarga durante el arranque.
          if (id.includes('vite/preload-helper')) return 'vite-runtime'
          if (!id.includes('node_modules')) return undefined
          // pnpm incluye nombres de peers en la ruta virtual. Evaluar únicamente
          // el paquete real posterior al último /node_modules/ evita chunks cíclicos.
          const normalizedId = id.replace(/\\/g, '/')
          const packageId = normalizedId.slice(normalizedId.lastIndexOf('/node_modules/') + 14)
          if (packageId.includes('pdfmake/build/vfs_fonts')) return 'pdf-fonts'
          if (packageId.startsWith('pdfmake/')) return 'pdfmake'
          if (packageId.startsWith('jspdf/')) return 'jspdf'
          if (packageId.startsWith('html2canvas/')) return 'html2canvas'
          if (/^(canvg|dompurify|fflate|fast-png|svg-pathdata)\//.test(packageId)) return 'pdf-support'
          if (packageId.startsWith('recharts/')) return 'charts'
          if (packageId.startsWith('@tanstack/')) return 'query'
          if (packageId.startsWith('@mui/x-data-grid/')) return 'mui-data-grid'
          if (packageId.startsWith('@mui/x-date-pickers/')) return 'mui-date-pickers'
          if (packageId.startsWith('@mui/icons-material/')) return 'mui-icons'
          if (packageId.startsWith('@mui/material/')) return 'mui-material'
          if (packageId.startsWith('@emotion/')) return 'emotion'
          if (packageId.startsWith('@mui/')) return 'mui-system'
          if (packageId.startsWith('react-router')) return 'router'
          if (/^(react|react-dom|scheduler|react-is)\//.test(packageId)) return 'react'
          if (packageId.startsWith('react-hook-form/') || packageId.startsWith('@hookform/')) return 'forms'
          if (packageId.startsWith('date-fns/') || packageId.startsWith('dayjs/')) return 'dates'
          if (packageId.startsWith('lucide-react/') || packageId.startsWith('react-icons/')) return 'icon-libs'
          if (packageId.startsWith('zod/') || packageId.startsWith('yup/')) return 'validation'
          return 'vendor'
        }
      }
    }
  },
  
  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
  }
})
