import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    minify: true,
  },
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
    },
    https: {
      key: "./certificates/cert.key",
      cert: "./certificates/cert.crt",
    },
  },
  preview: {
    port: 8080,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname + "/src"),
    },
  },
});
