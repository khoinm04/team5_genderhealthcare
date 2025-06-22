import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react-qr-code': 'react-qr-code',
<<<<<<< HEAD
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Hardcoded for reliability
        changeOrigin: true,
        secure: false,
      },
    },
  },
=======
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
>>>>>>> origin/An
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['react-qr-code'],
  },
<<<<<<< HEAD

});
=======
});
>>>>>>> origin/An
