// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Example: Split react and react-dom into their own chunk
          reactVendor: ["react", "react-dom"],
          // You can add more manual chunks here
        },
      },
    },
  },
});
