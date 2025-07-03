import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react-qr-code': 'react-qr-code',
    },
  },
  define: {
    global: {}, // 👈 Để fix lỗi "global is not defined"
  },
  server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/ws': {
      target: 'ws://localhost:8080',
      changeOrigin: true,
      ws: true,
      secure: false,
      rewrite: (path) => path
    },
  },
},
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['react-qr-code'],
  },
});
