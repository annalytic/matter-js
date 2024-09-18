import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/javazone-spill/",
  plugins: [react(), tsconfigPaths({ root: __dirname })],
  envPrefix: "REACT_APP_",
  build: {
    outDir: "./build",
  },
  server: {
    port: 3000,
    //proxy: { "/api": "http://localhost:8080" }, if we want a separate backend
  },
});
