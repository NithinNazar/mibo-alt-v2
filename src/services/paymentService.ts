/**
 * Payment Service
 *
 * This service handles payment processing using Razorpay payment gateway.
 * It manages the complete payment flow:
 * 1. Create payment order on backend
 * 2. Open Razorpay checkout modal
 * 3. Handle payment success/failure callbacks
 * 4. Verify payment signature on backend
 *
 * Razorpay Integration:
 * - Uses Razorpay Checkout for seamless payment experience
 * - Supports multiple payment methods (cards, UPI, wallets, net banking)
 * - Implements signature verification for security
 * - Handles payment failures and cancellations gracefully
 *
 * @module services/paymentService
 */

import apiClient from "./api";
import type {
  PaymentOrder,
  PaymentVerification,
  PaymentVerificationResponse,
  APIResponse,
} from "../types";

/**
 * Razorpay checkout options interface
 * Extends the Razorpay SDK options
 */
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

/**
 * Razorpay success response structure
 */
interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Extend Window interface to include Razorpay
 */
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Payment Service Class
 *
 * Manages Razorpay payment integration for appointment bookings.
 * Implements singleton pattern - use the exported instance.
 */
class PaymentService {
  /**
   * Create a Razorpay payment order for an appointment
   *
   * This method calls the backend to create a Razorpay order. The backend:
   * - Validates the appointment exists and is payable
   * - Calculates the consultation fee
   * - Creates a Razorpay order
   * - Returns order details including Razorpay key
   *
   * The returned order data is used to open the Razorpay checkout modal.
   *
   * @param appointmentId - ID of the appointment to pay for
   * @returns Promise with Razorpay order details
   * @throws {AxiosError} If appointment not found or order creation fails
   *
   * @example
   * ```typescript
   * try {
   *   const orderData = await paymentService.createPaymentOrder(456);
   *   console.log(`Order created: ${orderData.order_id}`);
   *   console.log(`Amount: ₹${orderData.amount / 100}`);
   *
   *   // Open Razorpay checkout with order data
   *   paymentService.openRazorpayCheckout(
   *     orderData,
   *     handleSuccess,
   *     handleFailure
   *   );
   * } catch (error) {
   *   console.error("Failed to create payment order:", error);
   * }
   * ```
   */
  async createPaymentOrder(appointmentId: number): Promise<PaymentOrder> {
    try {
      const response = await apiClient.post<
        APIResponse<{
          order_id: string;
          amount: number;
          currency: string;
          appointment_id: number;
          patient_id: number;
          razorpay_key_id: string;
        }>
      >("/payments/create-order", {
        appointment_id: appointmentId,
      });

      console.log("Payment order created:", response.data.data.order_id);
      return response.data.data;
    } catch (error) {
      console.error("Failed to create payment order:", error);
      throw error;
    }
  }

  /**
   * Verify payment after Razorpay checkout success
   *
   * This method sends the Razorpay payment response to the backend for verification.
   * The backend:
   * - Verifies the payment signature using Razorpay secret key
   * - Updates the payment record in database
   * - Updates appointment status to CONFIRMED
   * - Returns verification result
   *
   * This step is critical for security - never trust client-side payment success
   * without server-side signature verification.
   *
   * @param paymentData - Razorpay payment response data
   * @param paymentData.razorpay_order_id - Order ID from Razorpay
   * @param paymentData.razorpay_payment_id - Payment ID from Razorpay
   * @param paymentData.razorpay_signature - HMAC signature for verification
   * @returns Promise with verification result
   * @throws {AxiosError} If signature verification fails
   *
   * @example
   * ```typescript
   * // In Razorpay success handler
   * const handlePaymentSuccess = async (response) => {
   *   try {
   *     const verification = await paymentService.verifyPayment({
   *       razorpay_order_id: response.razorpay_order_id,
   *       razorpay_payment_id: response.razorpay_payment_id,
   *       razorpay_signature: response.razorpay_signature
   *     });
   *
   *     if (verification.data.status === "SUCCESS") {
   *       console.log("Payment verified successfully!");
   *       // Navigate to success page
   *     }
   *   } catch (error) {
   *     console.error("Payment verification failed:", error);
   *     // Show error message
   *   }
   * };
   * ```
   */
  async verifyPayment(
    paymentData: PaymentVerification
  ): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        "/payments/verify",
        paymentData
      );

      console.log("Payment verified:", response.data.data.status);
      return response.data;
    } catch (error) {
      console.error("Payment verification failed:", error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout modal
   *
   * This method initializes and opens the Razorpay checkout modal for payment.
   * The modal provides a seamless payment experience with multiple payment options:
   * - Credit/Debit Cards
   * - UPI (Google Pay, PhonePe, Paytm, etc.)
   * - Net Banking
   * - Wallets (Paytm, PhonePe, Amazon Pay, etc.)
   *
   * The method handles:
   * - Success callback: Called when payment is successful
   * - Failure callback: Called when payment fails or is cancelled
   * - Modal dismiss: Called when user closes the modal
   *
   * @param orderData - Payment order data from backend
   * @param onSuccess - Callback function for successful payment
   * @param onFailure - Callback function for failed/cancelled payment
   *
   * @example
   * ```typescript
   * const handleSuccess = async (response) => {
   *   console.log("Payment successful!");
   *   // Verify payment on backend
   *   await paymentService.verifyPayment(response);
   *   // Navigate to success page
   *   navigate('/booking-success');
   * };
   *
   * const handleFailure = (error) => {
   *   console.error("Payment failed:", error);
   *   // Show error message to user
   *   toast.error("Payment failed. Please try again.");
   * };
   *
   * // Open checkout
   * paymentService.openRazorpayCheckout(
   *   orderData,
   *   handleSuccess,
   *   handleFailure
   * );
   * ```
   */
  openRazorpayCheckout(
    orderData: PaymentOrder,
    onSuccess: (response: RazorpaySuccessResponse) => void,
    onFailure: (error: { message: string; code?: string }) => void
  ): void {
    // Check if Razorpay SDK is loaded
    if (typeof window.Razorpay === "undefined") {
      console.error("Razorpay SDK not loaded");
      onFailure({
        message:
          "Payment gateway not available. Please refresh the page and try again.",
        code: "SDK_NOT_LOADED",
      });
      return;
    }

    // Configure Razorpay checkout options
    const options: RazorpayOptions = {
      key: orderData.razorpay_key_id, // Razorpay public key
      amount: orderData.amount, // Amount in paise (₹100 = 10000 paise)
      currency: orderData.currency, // Currency code (INR)
      name: "Mibo Mental Health", // Business name
      description: "Appointment Consultation Fee", // Payment description
      order_id: orderData.order_id, // Razorpay order ID

      // Success handler - called when payment is successful
      handler: (response: RazorpaySuccessResponse) => {
        console.log(
          "Razorpay payment successful:",
          response.razorpay_payment_id
        );
        onSuccess(response);
      },

      // Pre-fill customer details (optional)
      prefill: {
        name: "", // Patient name (can be filled from user data)
        email: "", // Patient email
        contact: "", // Patient phone
      },

      // Theme customization
      theme: {
        color: "#0a107d", // Primary brand color
      },

      // Modal configuration
      modal: {
        // Called when user closes the modal without completing payment
        ondismiss: () => {
          console.log("Payment modal dismissed by user");
          onFailure({
            message: "Payment cancelled by user",
            code: "PAYMENT_CANCELLED",
          });
        },
      },
    };

    try {
      // Create Razorpay instance and open checkout
      const razorpay = new window.Razorpay(options);

      // Handle payment failure events
      razorpay.on("payment.failed", (response: any) => {
        console.error("Razorpay payment failed:", response.error);
        onFailure({
          message:
            response.error.description || "Payment failed. Please try again.",
          code: response.error.code,
        });
      });

      // Open the checkout modal
      razorpay.open();
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      onFailure({
        message: "Failed to open payment gateway. Please try again.",
        code: "CHECKOUT_ERROR",
      });
    }
  }

  /**
   * Check if Razorpay SDK is loaded
   *
   * Utility method to verify that the Razorpay SDK script is loaded
   * and available. Should be called before attempting to open checkout.
   *
   * @returns true if Razorpay SDK is available, false otherwise
   *
   * @example
   * ```typescript
   * if (!paymentService.isRazorpayLoaded()) {
   *   console.error("Razorpay SDK not loaded");
   *   // Show error message or load SDK dynamically
   * } else {
   *   // Proceed with payment
   *   paymentService.openRazorpayCheckout(...);
   * }
   * ```
   */
  isRazorpayLoaded(): boolean {
    return (
      typeof window !== "undefined" && typeof window.Razorpay !== "undefined"
    );
  }

  /**
   * Load Razorpay SDK dynamically
   *
   * Loads the Razorpay checkout script if not already loaded.
   * Useful for lazy loading the SDK only when needed.
   *
   * @returns Promise that resolves when SDK is loaded
   *
   * @example
   * ```typescript
   * try {
   *   await paymentService.loadRazorpaySDK();
   *   console.log("Razorpay SDK loaded successfully");
   *   // Now safe to open checkout
   * } catch (error) {
   *   console.error("Failed to load Razorpay SDK:", error);
   * }
   * ```
   */
  async loadRazorpaySDK(): Promise<void> {
    // Check if already loaded
    if (this.isRazorpayLoaded()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay SDK loaded successfully");
        resolve();
      };

      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        reject(new Error("Failed to load Razorpay SDK"));
      };

      document.body.appendChild(script);
    });
  }
}

/**
 * Export singleton instance of PaymentService
 *
 * Use this instance throughout the application for payment operations.
 * Do not create new instances of PaymentService.
 *
 * @example
 * ```typescript
 * import paymentService from './services/paymentService';
 *
 * // Create payment order
 * const orderData = await paymentService.createPaymentOrder(appointmentId);
 *
 * // Open Razorpay checkout
 * paymentService.openRazorpayCheckout(
 *   orderData,
 *   async (response) => {
 *     // Verify payment
 *     await paymentService.verifyPayment(response);
 *     // Handle success
 *   },
 *   (error) => {
 *     // Handle failure
 *     console.error(error.message);
 *   }
 * );
 * ```
 */
export default new PaymentService();
