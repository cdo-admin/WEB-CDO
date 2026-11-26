import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev`            -> http://localhost:5173, /api & /storage diteruskan ke Laravel (http://localhost:8000)
// `npm run build`          -> dist/ (hosting statis terpisah; isi VITE_API_URL di .env.production)
// `npm run build:laravel`  -> ../backend/public/app (disajikan langsung oleh Laravel, satu domain)
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'laravel' ? '/app/' : '/',
  build: mode === 'laravel' ? { outDir: '../backend/public/app', emptyOutDir: true } : {},
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/storage': 'http://localhost:8000',
    },
  },
}));
