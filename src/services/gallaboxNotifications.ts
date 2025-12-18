/**
 * Gallabox WhatsApp Notifications Service
 *
 * Handles WhatsApp notifications via Gallabox for appointment bookings.
 * Backend automatically sends WhatsApp - this service checks notification status.
 *
 * Automatic WhatsApp notifications sent by backend for:
 * - Online appointment bookings (Meet link to patient, doctor, admins)
 * - Payment links (link sent to patient)
 * - Appointment confirmations
 * - Appointment reminders
 * - Appointment cancellations
 */

import apiClient from "./api";
import type { APIResponse } from "../types";

/**
 * WhatsApp notification types
 */
export type NotificationType =
  | "APPOINTMENT_CONFIRMATION"
  | "ONLINE_APPOINTMENT_LINK"
  | "PAYMENT_LINK"
  | "APPOINTMENT_REMINDER"
  | "APPOINTMENT_CANCELLATION"
  | "APPOINTMENT_RESCHEDULED";

/**
 * Notification status
 */
export type NotificationStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";

/**
 * WhatsApp notification record
 */
export interface WhatsAppNotification {
  id: number;
  appointment_id: number;
  recipient_phone: string;
  recipient_name: string;
  notification_type: NotificationType;
  status: NotificationStatus;
  message_content: string;
  gallabox_message_id: string | null;
  created_at: string;
  delivered_at: string | null;
  read_at: string | null;
  error_message: string | null;
}

/**
 * Notification history query parameters
 */
export interface NotificationHistoryParams {
  appointmentId?: number;
  patientPhone?: string;
  notificationType?: NotificationType;
  status?: NotificationStatus;
  limit?: number;
}

class GallaboxNotificationsService {
  /**
   * Get notification history
   *
   * Retrieves WhatsApp notification history with optional filters.
   * Use this to check if notifications were sent successfully.
   *
   * @param params - Query parameters for filtering notifications
   * @returns Promise with array of notifications
   *
   * @example
   * ```typescript
   * // Get all notifications for an appointment
   * const notifications = await gallaboxService.getNotificationHistory({
   *   appointmentId: 123
   * });
   *
   * // Check if payment link was sent
   * const paymentNotifications = await gallaboxService.getNotificationHistory({
   *   appointmentId: 123,
   *   notificationType: "PAYMENT_LINK"
   * });
   * ```
   */
  async getNotificationHistory(
    params: NotificationHistoryParams = {}
  ): Promise<WhatsAppNotification[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params.appointmentId) {
        queryParams.append("appointmentId", params.appointmentId.toString());
      }
      if (params.patientPhone) {
        queryParams.append("patientPhone", params.patientPhone);
      }
      if (params.notificationType) {
        queryParams.append("notificationType", params.notificationType);
      }
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }

      const response = await apiClient.get<APIResponse<WhatsAppNotification[]>>(
        `/notifications/history?${queryParams.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch notification history:", error);
      throw error;
    }
  }

  /**
   * Check if WhatsApp was sent for appointment
   *
   * Quick check to see if WhatsApp notification was sent successfully.
   *
   * @param appointmentId - Appointment ID
   * @param notificationType - Type of notification to check
   * @returns Promise with boolean indicating if notification was sent
   *
   * @example
   * ```typescript
   * const wasSent = await gallaboxService.wasWhatsAppSent(123, "PAYMENT_LINK");
   * if (wasSent) {
   *   toast.success("Payment link sent to WhatsApp!");
   * }
   * ```
   */
  async wasWhatsAppSent(
    appointmentId: number,
    notificationType: NotificationType
  ): Promise<boolean> {
    try {
      const notifications = await this.getNotificationHistory({
        appointmentId,
        notificationType,
      });

      return notifications.length > 0 && notifications[0].status !== "FAILED";
    } catch (error) {
      console.error("Failed to check WhatsApp status:", error);
      return false;
    }
  }

  /**
   * Get notification status badge configuration
   *
   * Returns UI configuration for displaying notification status.
   *
   * @param status - Notification status
   * @returns Badge configuration with color, text, and icon
   *
   * @example
   * ```typescript
   * const badge = gallaboxService.getStatusBadgeConfig(notification.status);
   * <span style={{ color: badge.color }}>
   *   {badge.icon} {badge.text}
   * </span>
   * ```
   */
  getStatusBadgeConfig(status: NotificationStatus): {
    color: string;
    text: string;
    icon: string;
  } {
    const configs = {
      SENT: {
        color: "#3b82f6", // Blue
        text: "Sent",
        icon: "📤",
      },
      DELIVERED: {
        color: "#10b981", // Green
        text: "Delivered",
        icon: "✅",
      },
      READ: {
        color: "#8b5cf6", // Purple
        text: "Read",
        icon: "👁️",
      },
      FAILED: {
        color: "#ef4444", // Red
        text: "Failed",
        icon: "❌",
      },
    };

    return configs[status];
  }

  /**
   * Get notification type display name
   *
   * Returns user-friendly display name for notification type.
   *
   * @param type - Notification type
   * @returns Display name
   */
  getNotificationTypeDisplayName(type: NotificationType): string {
    const names = {
      APPOINTMENT_CONFIRMATION: "Appointment Confirmation",
      ONLINE_APPOINTMENT_LINK: "Online Meeting Link",
      PAYMENT_LINK: "Payment Link",
      APPOINTMENT_REMINDER: "Appointment Reminder",
      APPOINTMENT_CANCELLATION: "Cancellation Notice",
      APPOINTMENT_RESCHEDULED: "Rescheduled Notice",
    };

    return names[type];
  }

  /**
   * Format notification timestamp
   *
   * Formats notification timestamp for display.
   *
   * @param timestamp - ISO datetime string
   * @returns Formatted timestamp
   */
  formatNotificationTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Validate phone number for WhatsApp
   *
   * Ensures phone number is in correct format for WhatsApp delivery.
   * Required format: +91 followed by 10 digits starting with 6-9
   *
   * @param phone - Phone number to validate
   * @returns true if valid, false otherwise
   */
  validatePhoneNumber(phone: string): boolean {
    return /^\+91[6-9]\d{9}$/.test(phone);
  }

  /**
   * Format phone number for WhatsApp
   *
   * Converts phone number to required format (+91...).
   *
   * @param phone - Phone number in any format
   * @returns Formatted phone number
   */
  formatPhoneNumber(phone: string): string {
    phone = phone.replace(/[\s\-\(\)]/g, "");
    if (!phone.startsWith("+91")) {
      phone = phone.startsWith("91") ? "+" + phone : "+91" + phone;
    }
    return phone;
  }
}

export default new GallaboxNotificationsService();
