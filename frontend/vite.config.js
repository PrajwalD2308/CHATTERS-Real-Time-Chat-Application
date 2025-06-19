import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://slrtech-chatapp.onrender.com",
        changeOrigin: true, // 👈 important for cookies and CORS
        secure: false,
      },
    },
  },
});
