/**
 * Booking Service
 *
 * This service handles the patient booking flow with the NEW backend API:
 * 1. Create appointment (authenticated)
 * 2. Create payment order (authenticated)
 * 3. Verify payment (authenticated)
 * 4. Manage appointments (authenticated)
 *
 * @module services/bookingService
 */

import apiClient from "./api";

/**
 * Create appointment data
 */
export interface CreateAppointmentData {
  clinicianId: number;
  centreId: number;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  appointmentType: "ONLINE" | "IN_PERSON";
}

/**
 * Payment verification data
 */
export interface VerifyPaymentData {
  appointmentId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Booking Service Class
 *
 * Handles the complete booking flow with production endpoints.
 * All methods require authentication (JWT token in localStorage).
 */
class BookingService {
  /**
   * Create appointment (requires authentication)
   *
   * Creates a new appointment in the database.
   * For ONLINE appointments, Google Meet link will be generated if configured.
   * If Google Meet is not configured, the appointment will still be created successfully.
   *
   * @param data - Appointment creation data
   * @returns Promise with appointment details
   * @throws {AxiosError} If validation fails or slot is unavailable
   *
   * @example
   * ```typescript
   * const appointment = await bookingService.createAppointment({
   *   clinicianId: 1,
   *   centreId: 1,
   *   appointmentDate: "2026-01-15",
   *   appointmentTime: "10:00",
   *   appointmentType: "ONLINE"
   * });
   * ```
   */
  async createAppointment(data: CreateAppointmentData): Promise<any> {
    const response = await apiClient.post("/booking/create", data);
    return response.data;
  }

  /**
   * Create payment order (requires authentication)
   *
   * Creates a Razorpay payment order for the appointment.
   *
   * @param appointmentId - Appointment ID
   * @returns Promise with Razorpay order details
   * @throws {AxiosError} If appointment not found or already paid
   *
   * @example
   * ```typescript
   * const order = await bookingService.createPaymentOrder(appointmentId);
   * console.log(order.data.orderId); // Razorpay order ID
   * console.log(order.data.amount); // Amount in paise
   * ```
   */
  async createPaymentOrder(appointmentId: number): Promise<any> {
    const response = await apiClient.post("/payments/create-order", {
      appointmentId,
    });
    return response.data;
  }

  /**
   * Verify payment (requires authentication)
   *
   * Verifies Razorpay payment signature and confirms appointment.
   *
   * @param data - Razorpay payment response data
   * @returns Promise with payment verification result
   * @throws {AxiosError} If payment verification fails
   *
   * @example
   * ```typescript
   * await bookingService.verifyPayment({
   *   appointmentId: appointment.id,
   *   razorpayOrderId: response.razorpay_order_id,
   *   razorpayPaymentId: response.razorpay_payment_id,
   *   razorpaySignature: response.razorpay_signature
   * });
   * ```
   */
  async verifyPayment(data: VerifyPaymentData): Promise<any> {
    const response = await apiClient.post("/payments/verify", data);
    return response.data;
  }

  /**
   * Get my appointments (requires authentication)
   *
   * Retrieves all appointments for the authenticated patient.
   *
   * @returns Promise with appointments list
   * @throws {AxiosError} If not authenticated
   *
   * @example
   * ```typescript
   * const appointments = await bookingService.getMyAppointments();
   * console.log(appointments.data.appointments);
   * ```
   */
  async getMyAppointments(): Promise<any> {
    const response = await apiClient.get("/booking/my-appointments");
    return response.data;
  }

  /**
   * Cancel appointment (requires authentication)
   *
   * Cancels an appointment. Refund may be processed based on cancellation policy.
   *
   * @param appointmentId - Appointment ID to cancel
   * @returns Promise with cancellation result
   * @throws {AxiosError} If appointment not found or cannot be cancelled
   *
   * @example
   * ```typescript
   * await bookingService.cancelAppointment(appointmentId);
   * ```
   */
  async cancelAppointment(appointmentId: number): Promise<any> {
    const response = await apiClient.post(`/booking/${appointmentId}/cancel`);
    return response.data;
  }
}

/**
 * Export singleton instance of BookingService
 *
 * Use this instance throughout the application for booking operations.
 *
 * @example
 * ```typescript
 * import bookingService from './services/bookingService';
 *
 * // Complete booking flow
 * const appointment = await bookingService.createAppointment({
 *   clinicianId: 1,
 *   centreId: 1,
 *   appointmentDate: "2026-01-15",
 *   appointmentTime: "10:00",
 *   appointmentType: "ONLINE"
 * });
 *
 * const order = await bookingService.createPaymentOrder(appointment.data.appointment.id);
 *
 * // After Razorpay success
 * await bookingService.verifyPayment({
 *   appointmentId: appointment.data.appointment.id,
 *   razorpayOrderId: response.razorpay_order_id,
 *   razorpayPaymentId: response.razorpay_payment_id,
 *   razorpaySignature: response.razorpay_signature
 * });
 * ```
 */
export default new BookingService();
