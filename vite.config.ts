import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      '@': path.resolve(__dirname, "./src"),
      // Forzar uso de lodash-es para compatibilidad ESM
      'lodash': 'lodash-es',
      'lodash/flatten': 'lodash-es/flatten',
      'lodash/isEqual': 'lodash-es/isEqual',
      'lodash/merge': 'lodash-es/merge',
      'lodash/pick': 'lodash-es/pick',
      'lodash/get': 'lodash-es/get',
      'lodash/set': 'lodash-es/set'
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    // Compresión Gzip y Brotli
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Carta Ruach - Menú Digital',
        short_name: 'MiPWA',
        description: 'Una PWA en React + TS que funciona offline',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        navigateFallback: '/offline.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3
            }
          },
          {
            // Cache imágenes de Google Drive/proxy
            urlPattern: /^https:\/\/images\.weserv\.nl/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'image', 'font'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Crear chunks más granulares para mejor caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('google-spreadsheet') || id.includes('lodash')) {
              return 'sheets';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            // Resto de dependencias en un chunk separado
            return 'vendor';
          }
        },
        // Optimizar nombres de archivos para mejor caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      external: (id) => {
        // Manejar módulos problemáticos externamente si es necesario
        if (id.includes('lodash/flatten')) {
          return false; // Forzar que se incluya en el bundle
        }
        return false;
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        safari10: true
      }
    },
    cssMinify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'framer-motion',
      'react-router-dom',
      'lodash-es',
      'lodash-es/flatten',
      'lodash-es/isEqual',
      'lodash-es/merge',
      'lodash-es/pick',
      'lodash-es/get',
      'lodash-es/set'
    ],
    exclude: ['google-spreadsheet'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  define: {
    global: 'globalThis',
    // Polyfill para process en el navegador
    'process.env': {}
  },
  server: {
    fs: {
      strict: false
    }
  }
})
