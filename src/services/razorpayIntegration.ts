/**
 * Razorpay Payment Integration Service
 *
 * Handles complete Razorpay payment flow for appointment bookings.
 * Backend handles all Razorpay operations - this service triggers APIs.
 */

import apiClient from "./api";
import type { APIResponse } from "../types";

export interface PaymentLinkData {
  paymentLinkId: string;
  paymentLink: string;
  amount: number;
  currency: string;
  status: PaymentLinkStatus;
  expiresAt: string;
  whatsappSent: boolean;
}

export type PaymentLinkStatus = "created" | "paid" | "expired" | "cancelled";

export interface PaymentStatusData {
  id: string;
  status: PaymentLinkStatus;
  amount: number;
  currency: string;
  paymentId?: string;
  paidAt?: string;
}

class RazorpayIntegrationService {
  /**
   * Send payment link to patient via WhatsApp
   * Backend creates Razorpay link and sends WhatsApp automatically
   */
  async sendPaymentLink(
    appointmentId: number,
    patientPhone: string,
    patientName: string
  ): Promise<PaymentLinkData> {
    if (!this.validatePhoneNumber(patientPhone)) {
      throw new Error("Invalid phone number format. Must be: +919876543210");
    }

    const response = await apiClient.post<APIResponse<PaymentLinkData>>(
      "/payments/send-payment-link",
      { appointmentId, patientPhone, patientName }
    );

    console.log(`Payment link created: ${response.data.data.paymentLinkId}`);
    return response.data.data;
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentLinkId: string): Promise<PaymentStatusData> {
    const response = await apiClient.get<APIResponse<PaymentStatusData>>(
      `/payments/link-status/${paymentLinkId}`
    );
    return response.data.data;
  }

  /**
   * Start polling for payment status updates
   */
  startPaymentStatusPolling(
    paymentLinkId: string,
    onStatusChange: (status: PaymentStatusData) => void,
    intervalMs: number = 5000,
    maxDurationMs: number = 600000
  ): () => void {
    let lastStatus: PaymentLinkStatus | null = null;

    const intervalId = setInterval(async () => {
      try {
        const status = await this.checkPaymentStatus(paymentLinkId);
        if (status.status !== lastStatus) {
          lastStatus = status.status;
          onStatusChange(status);
        }
        if (["paid", "expired", "cancelled"].includes(status.status)) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, intervalMs);

    const timeoutId = setTimeout(
      () => clearInterval(intervalId),
      maxDurationMs
    );

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }

  /**
   * Validate Indian phone number format (+91...)
   */
  validatePhoneNumber(phone: string): boolean {
    return /^\+91[6-9]\d{9}$/.test(phone);
  }

  /**
   * Format phone number to +91... format
   */
  formatPhoneNumber(phone: string): string {
    phone = phone.replace(/[\s\-\(\)]/g, "");
    if (!phone.startsWith("+91")) {
      phone = phone.startsWith("91") ? "+" + phone : "+91" + phone;
    }
    return phone;
  }

  /**
   * Open payment link in new tab
   */
  openPaymentLink(paymentLink: string): void {
    window.open(paymentLink, "_blank", "noopener,noreferrer");
  }

  /**
   * Get status badge configuration for UI
   */
  getStatusBadgeConfig(status: PaymentLinkStatus) {
    const configs = {
      created: { color: "#f59e0b", text: "Payment Pending", icon: "⏳" },
      paid: { color: "#10b981", text: "Payment Successful", icon: "✅" },
      expired: { color: "#ef4444", text: "Link Expired", icon: "⏰" },
      cancelled: { color: "#6b7280", text: "Payment Cancelled", icon: "❌" },
    };
    return configs[status];
  }

  /**
   * Format amount with currency symbol
   */
  formatAmount(amount: number): string {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

export default new RazorpayIntegrationService();
