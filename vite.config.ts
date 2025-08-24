import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    }),
  ],
  
  // Path resolution - تصحيح المسارات
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true, // عرض الأخطاء في المتصفح
    },
  },
  
  // Build configuration
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // تمكين sourcemaps للتصحيح
    minify: 'terser',
    
    // Optimize bundle
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          charts: ['recharts'],
        },
      },
    },
    
    chunkSizeWarningLimit: 1000,
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    open: true,
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'recharts',
      'sonner',
      'react-hook-form',
    ],
    exclude: ['js-big-decimal']
  },
  
  // CSS configuration - إعدادات مهمة لـ Tailwind
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
    // إضافة postcss للتأكد من معالجة Tailwind
    postcss: './postcss.config.js',
  },
  
  // Esbuild configuration
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // إضافة دعم أفضل للـ JSX
    jsx: 'automatic',
  },
})