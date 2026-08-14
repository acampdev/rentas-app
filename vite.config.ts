// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiTarget = env.VITE_API_URL

  if (!apiTarget) {
    throw new Error('VITE_API_URL debe estar configurada para iniciar Vite')
  }

  return {
  plugins: [react()],
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : undefined,
  
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
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            console.log('➡️ Proxying:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('⬅️ Proxy response:', proxyRes.statusCode, 'for', req.url);
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
    // Manejar chunks grandes
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('vfs_fonts')) return 'pdf-fonts'
          if (id.includes('pdfmake')) return 'pdfmake'
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf-export'
          if (id.includes('recharts')) return 'charts'
          if (id.includes('@tanstack')) return 'query'
          if (id.includes('@mui/icons-material')) return 'mui-icons'
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui'
          if (id.includes('date-fns') || id.includes('dayjs')) return 'dates'
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
