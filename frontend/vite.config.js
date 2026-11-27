import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev`            -> http://localhost:5173, /api & /storage diteruskan ke Laravel (http://localhost:8000)
// `npm run build`          -> dist/ (hosting statis terpisah; isi VITE_API_URL di .env.production)
// `npm run build:laravel`  -> ../backend/public/app (disajikan langsung oleh Laravel, satu domain)
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'laravel' ? '/app/' : '/',
  build: {
    ...(mode === 'laravel' ? { outDir: '../backend/public/app', emptyOutDir: true } : {}),
    rolldownOptions: {
      output: {
        // React & router jarang berubah -> chunk terpisah agar bundle utama < 500 kB dan cache browser awet
        codeSplitting: {
          groups: [{ name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)[\\/]/ }],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/storage': 'http://localhost:8000',
    },
  },
}));
