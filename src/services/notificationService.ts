// Patient Dashboard - Notification Service
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface PatientNotification {
  id: number;
  patient_id: number;
  notification_type:
    | "APPOINTMENT_BLOCKED"
    | "APPOINTMENT_CANCELLED"
    | "REFUND_INITIATED"
    | "GENERAL";
  title: string;
  message: string;
  appointment_id: number | null;
  blocked_slot_id: number | null;
  metadata: any;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

class NotificationService {
  private getAuthHeader() {
    const token =
      localStorage.getItem("patientToken") || localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getNotifications(filters?: {
    limit?: number;
    offset?: number;
    unread_only?: boolean;
    date_from?: string;
    date_to?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await axios.get(
      `${API_BASE_URL}/patient/notifications?${params.toString()}`,
      this.getAuthHeader(),
    );
    return response.data;
  }

  async getUnreadCount() {
    const response = await axios.get(
      `${API_BASE_URL}/patient/notifications/unread-count`,
      this.getAuthHeader(),
    );
    return response.data;
  }

  async markAsRead(notificationId: number) {
    const response = await axios.put(
      `${API_BASE_URL}/patient/notifications/${notificationId}/read`,
      {},
      this.getAuthHeader(),
    );
    return response.data;
  }
}

export const notificationService = new NotificationService();
