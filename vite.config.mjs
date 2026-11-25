import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Anubis on prod challenges browser UAs; use a non-browser UA so local fetches get JSON
const prodProxy = {
  target: "https://wso.williams.edu",
  changeOrigin: true,
  secure: false,
  headers: {
    "User-Agent": "wso-react-dev-proxy",
  },
};

const apiProxy = {
  target: process.env.WSO_API_PROXY || "https://wso-dev.williams.edu",
  changeOrigin: true,
  secure: false,
  headers: {
    "User-Agent": "wso-react-dev-proxy",
  },
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "analyze" && visualizer({ open: true, gzipSize: true }),
  ],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    rolldownOptions: { transform: { define: { global: "globalThis" } } },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": apiProxy,
      "/pic": apiProxy,
      // fetch JSONs from prod
      "/dining.json": prodProxy,
      "/library.json": prodProxy,
      "^/courses(-.*)?\\.json": prodProxy,
    },
  },
  build: {
    // deploy.yml copies from build/
    outDir: "build",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
}));
