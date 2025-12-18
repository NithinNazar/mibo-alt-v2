/**
 * useRazorpayPayment Hook
 *
 * React hook for managing Razorpay payment flow in components.
 * Handles payment link generation, status polling, and UI state.
 *
 * @example
 * ```typescript
 * const {
 *   sendPaymentLink,
 *   paymentData,
 *   paymentStatus,
 *   loading,
 *   error
 * } = useRazorpayPayment();
 *
 * // Send payment link
 * await sendPaymentLink(appointmentId, phone, name);
 *
 * // Payment status updates automatically via polling
 * if (paymentStatus === "paid") {
 *   navigate("/appointment-confirmed");
 * }
 * ```
 */

import { useState, useCallback } from "react";
import razorpayService from "../services/razorpayIntegration";
import type {
  PaymentLinkData,
  PaymentStatusData,
} from "../services/razorpayIntegration";

interface UseRazorpayPaymentReturn {
  // Payment data
  paymentData: PaymentLinkData | null;
  paymentStatus: PaymentStatusData | null;

  // Loading states
  loading: boolean;
  sendingLink: boolean;
  checkingStatus: boolean;

  // Error state
  error: string | null;

  // Actions
  sendPaymentLink: (
    appointmentId: number,
    patientPhone: string,
    patientName: string
  ) => Promise<void>;
  checkPaymentStatus: (paymentLinkId: string) => Promise<void>;
  openPaymentLink: () => void;
  resetPayment: () => void;

  // Helpers
  isPaymentComplete: boolean;
  isPaymentPending: boolean;
  isPaymentExpired: boolean;
  timeUntilExpiry: { hours: number; minutes: number; expired: boolean } | null;
}

export function useRazorpayPayment(): UseRazorpayPaymentReturn {
  const [paymentData, setPaymentData] = useState<PaymentLinkData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(
    null
  );
  const [sendingLink, setSendingLink] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send payment link to patient
   */
  const sendPaymentLink = useCallback(
    async (
      appointmentId: number,
      patientPhone: string,
      patientName: string
    ) => {
      setSendingLink(true);
      setError(null);

      try {
        const data = await razorpayService.sendPaymentLink(
          appointmentId,
          patientPhone,
          patientName
        );
        setPaymentData(data);

        // Start polling for status updates
        startStatusPolling(data.paymentLinkId);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to send payment link";
        setError(errorMessage);
        console.error("Error sending payment link:", err);
      } finally {
        setSendingLink(false);
      }
    },
    []
  );

  /**
   * Check payment status manually
   */
  const checkPaymentStatus = useCallback(async (paymentLinkId: string) => {
    setCheckingStatus(true);
    setError(null);

    try {
      const status = await razorpayService.checkPaymentStatus(paymentLinkId);
      setPaymentStatus(status);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to check payment status";
      setError(errorMessage);
      console.error("Error checking payment status:", err);
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  /**
   * Start polling for payment status
   */
  const startStatusPolling = useCallback((paymentLinkId: string) => {
    const stopPolling = razorpayService.startPaymentStatusPolling(
      paymentLinkId,
      (status) => {
        setPaymentStatus(status);
      }
    );

    // Return cleanup function
    return stopPolling;
  }, []);

  /**
   * Open payment link in new tab
   */
  const openPaymentLink = useCallback(() => {
    if (paymentData?.paymentLink) {
      razorpayService.openPaymentLink(paymentData.paymentLink);
    }
  }, [paymentData]);

  /**
   * Reset payment state
   */
  const resetPayment = useCallback(() => {
    setPaymentData(null);
    setPaymentStatus(null);
    setError(null);
  }, []);

  // Computed values
  const isPaymentComplete = paymentStatus?.status === "paid";
  const isPaymentPending = paymentStatus?.status === "created";
  const isPaymentExpired = paymentStatus?.status === "expired";
  const loading = sendingLink || checkingStatus;

  // Calculate time until expiry (if needed in future)
  const timeUntilExpiry = null; // Removed: razorpayService.getTimeUntilExpiry not implemented

  return {
    paymentData,
    paymentStatus,
    loading,
    sendingLink,
    checkingStatus,
    error,
    sendPaymentLink,
    checkPaymentStatus,
    openPaymentLink,
    resetPayment,
    isPaymentComplete,
    isPaymentPending,
    isPaymentExpired,
    timeUntilExpiry,
  };
}
