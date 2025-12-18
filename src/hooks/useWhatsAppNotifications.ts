/**
 * useWhatsAppNotifications Hook
 *
 * React hook for checking WhatsApp notification status in components.
 *
 * @example
 * ```typescript
 * const {
 *   notifications,
 *   loading,
 *   checkNotificationStatus
 * } = useWhatsAppNotifications(appointmentId);
 *
 * // Notifications are automatically loaded
 * // Check if specific notification was sent
 * const paymentLinkSent = notifications.some(
 *   n => n.notification_type === "PAYMENT_LINK" && n.status === "DELIVERED"
 * );
 * ```
 */

import { useState, useEffect, useCallback } from "react";
import gallaboxService from "../services/gallaboxNotifications";
import type {
  WhatsAppNotification,
  NotificationType,
  NotificationHistoryParams,
} from "../services/gallaboxNotifications";

interface UseWhatsAppNotificationsReturn {
  notifications: WhatsAppNotification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: (params?: NotificationHistoryParams) => Promise<void>;
  wasNotificationSent: (type: NotificationType) => boolean;
  getNotificationByType: (
    type: NotificationType
  ) => WhatsAppNotification | undefined;
}

export function useWhatsAppNotifications(
  appointmentId?: number
): UseWhatsAppNotificationsReturn {
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notifications from backend
   */
  const fetchNotifications = useCallback(
    async (params: NotificationHistoryParams = {}) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = appointmentId
          ? { ...params, appointmentId }
          : params;

        const data = await gallaboxService.getNotificationHistory(queryParams);
        setNotifications(data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch notifications";
        setError(errorMessage);
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [appointmentId]
  );

  /**
   * Check if notification of specific type was sent
   */
  const wasNotificationSent = useCallback(
    (type: NotificationType): boolean => {
      return notifications.some(
        (n) => n.notification_type === type && n.status !== "FAILED"
      );
    },
    [notifications]
  );

  /**
   * Get notification by type
   */
  const getNotificationByType = useCallback(
    (type: NotificationType): WhatsAppNotification | undefined => {
      return notifications.find((n) => n.notification_type === type);
    },
    [notifications]
  );

  // Auto-fetch on mount if appointmentId provided
  useEffect(() => {
    if (appointmentId) {
      fetchNotifications();
    }
  }, [appointmentId, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    wasNotificationSent,
    getNotificationByType,
  };
}
