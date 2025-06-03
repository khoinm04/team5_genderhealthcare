import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,       // cố định port bạn muốn dùng, ví dụ 5173 hoặc 3000
    strictPort: true, // nếu port 5173 đang bị chiếm, sẽ báo lỗi chứ không tự động tăng port
  },
});