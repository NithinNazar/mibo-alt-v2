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
        quality: "85", // Increased quality from 75 to 85 for better visual quality
        w: "1920", // Max width 1920px (increased from 800px)
      }),
      // Exclude GIF files from processing to preserve animation
      exclude: /\.gif$/,
    }),
  ],
  // Image optimization during build
  build: {
    rollupOptions: {
      output: {
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // For AWS S3/CloudFront deployment, use root path
  // For GitHub Pages or subdirectory deployment, set VITE_BASE_PATH
  base: process.env.VITE_BASE_PATH || "/",
});
