import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      // Default image optimization settings
      defaultDirectives: new URLSearchParams({
        format: "webp", // Convert to WebP by default
        quality: "75", // Good quality with significant size reduction
        w: "800", // Max width 800px
      }),
    }),
  ],
  // For AWS S3/CloudFront deployment, use root path
  // For GitHub Pages or subdirectory deployment, set VITE_BASE_PATH
  base: process.env.VITE_BASE_PATH || "/",
});
