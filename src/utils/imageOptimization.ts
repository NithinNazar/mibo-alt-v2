/**
 * Image Optimization Utilities
 *
 * Provides functions to optimize image URLs for faster loading.
 * Works with various CDN providers and falls back gracefully.
 */

/**
 * Optimize image URL for faster loading
 *
 * Attempts to add optimization parameters based on the image host.
 * Falls back to original URL if optimization is not supported.
 *
 * @param imageUrl - Original image URL
 * @param width - Desired width in pixels (default: 400)
 * @param quality - Image quality 1-100 (default: 75)
 * @returns Optimized image URL or original if optimization not supported
 */
export function optimizeImageUrl(
  imageUrl: string,
  width: number = 400,
  quality: number = 75,
): string {
  // Return original if no URL provided
  if (!imageUrl) return imageUrl;

  // Don't optimize default avatars
  if (imageUrl.includes("default-avatar")) return imageUrl;

  try {
    const url = new URL(imageUrl);
    const hostname = url.hostname.toLowerCase();

    // Cloudinary
    if (hostname.includes("cloudinary.com")) {
      // Insert transformation parameters before the image path
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_${width},q_${quality},f_auto/${parts[1]}`;
      }
    }

    // Imgix
    if (hostname.includes("imgix.net")) {
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("auto", "format,compress");
      return url.toString();
    }

    // ImageKit
    if (hostname.includes("imagekit.io")) {
      const parts = imageUrl.split("/tr:");
      if (parts.length === 1) {
        // No transformation yet, add it
        const pathParts = imageUrl.split(hostname);
        return `${pathParts[0]}${hostname}/tr:w-${width},q-${quality}${pathParts[1]}`;
      }
    }

    // AWS S3 / CloudFront with image optimization
    if (
      hostname.includes("cloudfront.net") ||
      hostname.includes("amazonaws.com")
    ) {
      // Try adding query parameters (works if Lambda@Edge is configured)
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      return url.toString();
    }

    // Generic CDN - try adding query parameters
    // Many CDNs support these standard parameters
    if (hostname.includes("cdn")) {
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      return url.toString();
    }

    // For any other URL, try adding query parameters
    // If the server doesn't support it, it will just ignore them
    url.searchParams.set("w", width.toString());
    url.searchParams.set("q", quality.toString());
    return url.toString();
  } catch (error) {
    // If URL parsing fails, return original
    console.warn("Failed to optimize image URL:", error);
    return imageUrl;
  }
}

/**
 * Get responsive image sizes for srcset
 *
 * @param imageUrl - Original image URL
 * @returns Object with URLs for different sizes
 */
export function getResponsiveImageUrls(imageUrl: string) {
  return {
    small: optimizeImageUrl(imageUrl, 200, 75),
    medium: optimizeImageUrl(imageUrl, 400, 75),
    large: optimizeImageUrl(imageUrl, 800, 80),
  };
}

/**
 * Preload an image
 *
 * @param imageUrl - Image URL to preload
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
}

/**
 * Preload multiple images in parallel
 *
 * @param imageUrls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export function preloadImages(imageUrls: string[]): Promise<void[]> {
  return Promise.all(imageUrls.map((url) => preloadImage(url)));
}

/**
 * Check if image format is already optimized
 *
 * @param imageUrl - Image URL to check
 * @returns true if image is likely already optimized
 */
export function isImageOptimized(imageUrl: string): boolean {
  const url = imageUrl.toLowerCase();
  return (
    url.endsWith(".webp") ||
    url.includes(".webp?") ||
    url.includes("w_") || // Cloudinary transformation
    url.includes("?w=") || // Generic optimization
    url.includes("tr:") // ImageKit transformation
  );
}
