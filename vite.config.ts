import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src/ui",
  build: {
    outDir: "../../dist/ui",
    emptyOutDir: true,
  },
  server: {
    port: 5199,
    proxy: {
      "/api": "http://localhost:4820",
      "/preview": "http://localhost:4820",
      "/refs": "http://localhost:4820",
    },
  },
});
