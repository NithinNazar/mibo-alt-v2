/**
 * Patient Dashboard Service
 *
 * This service handles patient dashboard operations:
 * - Get dashboard overview
 * - View appointments
 * - View payment history
 * - Manage profile
 *
 * All endpoints require authentication.
 *
 * @module services/patientDashboardService
 */

import apiClient from "./api";

/**
 * Dashboard overview response
 */
interface DashboardResponse {
  success: boolean;
  data: {
    patient: {
      id: number;
      name: string;
      phone: string;
      email: string | null;
      date_of_birth: Date | null;
      gender: string | null;
      blood_group: string | null;
    };
    statistics: {
      totalAppointments: number;
      completedAppointments: number;
      upcomingAppointments: number;
      totalSpent: number;
    };
    upcomingAppointments: Array<{
      id: number;
      clinician_name: string;
      centre_name: string;
      appointment_type: string;
      scheduled_start_at: string;
      status: string;
    }>;
    recentAppointments: Array<{
      id: number;
      clinician_name: string;
      centre_name: string;
      appointment_type: string;
      scheduled_start_at: string;
      status: string;
    }>;
    recentPayments: Array<{
      id: number;
      amount: number;
      status: string;
      created_at: string;
    }>;
  };
}

/**
 * Appointments list response
 */
interface AppointmentsResponse {
  success: boolean;
  data: {
    appointments: Array<{
      id: number;
      clinician_name: string;
      centre_name: string;
      appointment_type: string;
      scheduled_start_at: string;
      scheduled_end_at: string;
      status: string;
      notes: string | null;
      created_at: string;
    }>;
  };
}

/**
 * Payments list response
 */
interface PaymentsResponse {
  success: boolean;
  data: {
    payments: Array<{
      id: number;
      amount: number;
      currency: string;
      status: string;
      razorpay_payment_id: string | null;
      paid_at: string | null;
      created_at: string;
      appointment_id: number;
    }>;
  };
}

/**
 * Profile response
 */
interface ProfileResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      phone: string;
      full_name: string;
      email: string | null;
      created_at: string;
    };
    profile: {
      id: number;
      date_of_birth: Date | null;
      gender: string | null;
      blood_group: string | null;
      emergency_contact_name: string | null;
      emergency_contact_phone: string | null;
      notes: string | null;
    };
  };
}

/**
 * Profile update data
 */
export interface UpdateProfileData {
  full_name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

/**
 * Patient Dashboard Service Class
 *
 * Provides methods for patient dashboard operations.
 * All methods require authentication (JWT token in localStorage).
 */
class PatientDashboardService {
  /**
   * Get dashboard overview
   *
   * Retrieves patient dashboard with statistics, upcoming appointments,
   * and recent activity.
   *
   * @returns Promise with dashboard data
   * @throws {AxiosError} If not authenticated or request fails
   *
   * @example
   * ```typescript
   * const response = await patientDashboardService.getDashboard();
   *
   * console.log(response.data.statistics.totalAppointments);
   * console.log(response.data.upcomingAppointments);
   * ```
   */
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>(
      "/patient/dashboard"
    );
    return response.data;
  }

  /**
   * Get all patient appointments
   *
   * Retrieves complete list of patient's appointments (past and upcoming).
   *
   * @returns Promise with appointments list
   * @throws {AxiosError} If not authenticated or request fails
   *
   * @example
   * ```typescript
   * const response = await patientDashboardService.getAppointments();
   *
   * response.data.appointments.forEach(apt => {
   *   console.log(`${apt.clinician_name} - ${apt.scheduled_start_at}`);
   * });
   * ```
   */
  async getAppointments(): Promise<AppointmentsResponse> {
    const response = await apiClient.get<AppointmentsResponse>(
      "/patient/appointments"
    );
    return response.data;
  }

  /**
   * Get payment history
   *
   * Retrieves complete list of patient's payments.
   *
   * @returns Promise with payments list
   * @throws {AxiosError} If not authenticated or request fails
   *
   * @example
   * ```typescript
   * const response = await patientDashboardService.getPayments();
   *
   * const totalPaid = response.data.payments
   *   .filter(p => p.status === "SUCCESS")
   *   .reduce((sum, p) => sum + p.amount, 0);
   * ```
   */
  async getPayments(): Promise<PaymentsResponse> {
    const response = await apiClient.get<PaymentsResponse>("/patient/payments");
    return response.data;
  }

  /**
   * Get patient profile
   *
   * Retrieves patient's profile information including personal details
   * and emergency contact.
   *
   * @returns Promise with profile data
   * @throws {AxiosError} If not authenticated or request fails
   *
   * @example
   * ```typescript
   * const response = await patientDashboardService.getProfile();
   *
   * console.log(response.data.user.full_name);
   * console.log(response.data.profile.blood_group);
   * ```
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>("/patient/profile");
    return response.data;
  }

  /**
   * Update patient profile
   *
   * Updates patient's profile information. All fields are optional.
   *
   * @param data - Profile update data
   * @returns Promise with updated profile
   * @throws {AxiosError} If not authenticated or validation fails
   *
   * @example
   * ```typescript
   * const response = await patientDashboardService.updateProfile({
   *   full_name: "John Doe Updated",
   *   email: "john.new@example.com",
   *   date_of_birth: "1990-01-01",
   *   gender: "MALE",
   *   blood_group: "O+",
   *   emergency_contact_name: "Jane Doe",
   *   emergency_contact_phone: "919876543210"
   * });
   *
   * console.log("Profile updated successfully");
   * ```
   */
  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    const response = await apiClient.put<ProfileResponse>(
      "/patient/profile",
      data
    );
    return response.data;
  }
}

/**
 * Export singleton instance of PatientDashboardService
 *
 * @example
 * ```typescript
 * import patientDashboardService from './services/patientDashboardService';
 *
 * // Get dashboard
 * const dashboard = await patientDashboardService.getDashboard();
 *
 * // Update profile
 * await patientDashboardService.updateProfile({ email: "new@example.com" });
 * ```
 */
export default new PatientDashboardService();
