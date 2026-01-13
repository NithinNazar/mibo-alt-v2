import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For AWS S3/CloudFront deployment, use root path
  // For GitHub Pages or subdirectory deployment, set VITE_BASE_PATH
  base: process.env.VITE_BASE_PATH || "/",
});
