/**
 * Utility to dynamically load Razorpay SDK
 * Only loads the SDK when needed (on payment pages)
 *
 * Benefits:
 * - Reduces initial page load time
 * - Eliminates console warnings on non-payment pages
 * - Improves overall site performance
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

let razorpayLoaded = false;
let razorpayLoadingPromise: Promise<void> | null = null;

/**
 * Load Razorpay SDK dynamically
 * Returns a promise that resolves when SDK is ready
 *
 * Usage:
 * ```typescript
 * await loadRazorpay();
 * // Now window.Razorpay is available
 * ```
 */
export const loadRazorpay = (): Promise<void> => {
  // If already loaded, return immediately
  if (razorpayLoaded && window.Razorpay) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (razorpayLoadingPromise) {
    return razorpayLoadingPromise;
  }

  // Create new loading promise
  razorpayLoadingPromise = new Promise((resolve, reject) => {
    // Double-check if Razorpay is already available
    // (in case it was loaded by another component)
    if (window.Razorpay) {
      razorpayLoaded = true;
      resolve();
      return;
    }

    console.log("💳 Loading Razorpay SDK...");

    // Create script element
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    // Handle successful load
    script.onload = () => {
      razorpayLoaded = true;
      console.log("✅ Razorpay SDK loaded successfully");
      resolve();
    };

    // Handle load error
    script.onerror = () => {
      razorpayLoadingPromise = null; // Allow retry
      const error = new Error("Failed to load Razorpay SDK");
      console.error("❌ Razorpay SDK load error:", error);
      reject(error);
    };

    // Append to document head
    document.head.appendChild(script);
  });

  return razorpayLoadingPromise;
};

/**
 * Check if Razorpay SDK is already loaded
 */
export const isRazorpayLoaded = (): boolean => {
  return razorpayLoaded && !!window.Razorpay;
};

/**
 * Preload Razorpay SDK in advance
 * Useful if you know user is about to need it
 *
 * Example: Call this when user clicks "Book Appointment" button
 */
export const preloadRazorpay = (): void => {
  loadRazorpay().catch((err) => {
    console.warn("Razorpay preload failed:", err);
  });
};
