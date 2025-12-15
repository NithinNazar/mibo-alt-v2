/**
 * Appointment Service
 *
 * This service handles all appointment-related operations including:
 * - Fetching clinician availability for booking
 * - Creating new appointments
 * - Retrieving patient appointments
 * - Cancelling appointments
 *
 * The service integrates with the backend API to manage the complete
 * appointment lifecycle from booking to cancellation.
 *
 * @module services/appointmentService
 */

import apiClient from "./api";
import type {
  Appointment,
  CreateAppointmentRequest,
  AvailabilityResponse,
  APIResponse,
} from "../types";

/**
 * Appointment Service Class
 *
 * Manages all appointment operations for patients.
 * Implements singleton pattern - use the exported instance.
 */
class AppointmentService {
  /**
   * Get available time slots for a clinician on a specific date
   *
   * This method fetches the availability schedule for a clinician at a
   * specific centre on a given date. It returns all time slots with their
   * availability status (available or booked).
   *
   * The availability is calculated based on:
   * - Clinician's working hours at the centre
   * - Existing appointments
   * - Blocked time slots
   *
   * @param clinicianId - ID of the clinician
   * @param centreId - ID of the centre where consultation will take place
   * @param date - Date in YYYY-MM-DD format (e.g., "2024-12-20")
   * @returns Promise with availability data including all time slots
   * @throws {AxiosError} If API request fails or parameters are invalid
   *
   * @example
   * ```typescript
   * try {
   *   const availability = await appointmentService.getAvailability(
   *     5,  // clinician ID
   *     1,  // centre ID
   *     "2024-12-20"
   *   );
   *
   *   console.log(`Available slots for Dr. ${availability.data.clinician_name}:`);
   *   availability.data.available_slots.forEach(slot => {
   *     if (slot.available) {
   *       console.log(`${slot.start_time} - ${slot.end_time}`);
   *     }
   *   });
   * } catch (error) {
   *   console.error("Failed to fetch availability:", error);
   * }
   * ```
   */
  async getAvailability(
    clinicianId: number,
    centreId: number,
    date: string
  ): Promise<AvailabilityResponse> {
    try {
      const response = await apiClient.get<AvailabilityResponse>(
        "/appointments/availability",
        {
          params: {
            clinician_id: clinicianId,
            centre_id: centreId,
            date,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      throw error;
    }
  }

  /**
   * Create a new appointment
   *
   * This method books a new appointment for a patient with a clinician.
   * The appointment is initially created with status "BOOKED" and will be
   * updated to "CONFIRMED" after successful payment.
   *
   * Required fields:
   * - clinician_id: The doctor/therapist
   * - centre_id: Location of consultation
   * - appointment_type: IN_PERSON, ONLINE, INPATIENT_ASSESSMENT, or FOLLOW_UP
   * - scheduled_start_at: ISO datetime string (e.g., "2024-12-20T10:00:00+05:30")
   *
   * Optional fields:
   * - patient_id: Defaults to authenticated user if not provided
   * - duration_minutes: Defaults to 30 minutes
   * - notes: Additional information about the appointment
   *
   * @param data - Appointment creation data
   * @returns Promise with created appointment details
   * @throws {AxiosError} If validation fails or time slot is no longer available
   *
   * @example
   * ```typescript
   * try {
   *   const appointment = await appointmentService.createAppointment({
   *     clinician_id: 5,
   *     centre_id: 1,
   *     appointment_type: "IN_PERSON",
   *     scheduled_start_at: "2024-12-20T10:00:00+05:30",
   *     duration_minutes: 30,
   *     notes: "First consultation for anxiety"
   *   });
   *
   *   console.log(`Appointment booked! ID: ${appointment.id}`);
   *   console.log(`Status: ${appointment.status}`);
   * } catch (error) {
   *   if (error.response?.status === 409) {
   *     console.error("Time slot no longer available");
   *   } else {
   *     console.error("Failed to create appointment:", error);
   *   }
   * }
   * ```
   */
  async createAppointment(
    data: CreateAppointmentRequest
  ): Promise<Appointment> {
    try {
      const response = await apiClient.post<APIResponse<Appointment>>(
        "/appointments",
        data
      );

      console.log("Appointment created successfully:", response.data.data.id);
      return response.data.data;
    } catch (error) {
      console.error("Failed to create appointment:", error);
      throw error;
    }
  }

  /**
   * Get all appointments for a patient
   *
   * Fetches the complete appointment history for a patient, including
   * upcoming, past, and cancelled appointments. The appointments are
   * returned in descending order by scheduled date (most recent first).
   *
   * Each appointment includes:
   * - Clinician details (name, specialization)
   * - Centre details (name, location)
   * - Appointment status and type
   * - Scheduled date and time
   * - Duration and notes
   *
   * @param patientId - ID of the patient
   * @returns Promise with array of appointments
   * @throws {AxiosError} If patient not found or API request fails
   *
   * @example
   * ```typescript
   * try {
   *   const appointments = await appointmentService.getPatientAppointments(123);
   *
   *   // Separate upcoming and past appointments
   *   const now = new Date();
   *   const upcoming = appointments.filter(apt =>
   *     new Date(apt.scheduled_start_at) > now &&
   *     !['CANCELLED', 'COMPLETED'].includes(apt.status)
   *   );
   *   const past = appointments.filter(apt =>
   *     new Date(apt.scheduled_start_at) <= now ||
   *     ['CANCELLED', 'COMPLETED'].includes(apt.status)
   *   );
   *
   *   console.log(`Upcoming: ${upcoming.length}, Past: ${past.length}`);
   * } catch (error) {
   *   console.error("Failed to fetch appointments:", error);
   * }
   * ```
   */
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<APIResponse<Appointment[]>>(
        `/patients/${patientId}/appointments`
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch patient appointments:", error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   *
   * Cancels an existing appointment and updates its status to "CANCELLED".
   * A cancellation reason must be provided for record-keeping.
   *
   * Cancellation rules:
   * - Only appointments with status BOOKED or CONFIRMED can be cancelled
   * - Cancelled appointments cannot be un-cancelled
   * - Refund processing (if applicable) is handled separately
   *
   * @param appointmentId - ID of the appointment to cancel
   * @param reason - Reason for cancellation (required)
   * @returns Promise that resolves when cancellation is complete
   * @throws {AxiosError} If appointment cannot be cancelled or not found
   *
   * @example
   * ```typescript
   * try {
   *   await appointmentService.cancelAppointment(
   *     456,
   *     "Patient unable to attend due to emergency"
   *   );
   *
   *   console.log("Appointment cancelled successfully");
   *   // Refresh appointment list to show updated status
   * } catch (error) {
   *   if (error.response?.status === 400) {
   *     console.error("Appointment cannot be cancelled (already completed or cancelled)");
   *   } else {
   *     console.error("Failed to cancel appointment:", error);
   *   }
   * }
   * ```
   */
  async cancelAppointment(
    appointmentId: number,
    reason: string
  ): Promise<void> {
    try {
      await apiClient.delete(`/appointments/${appointmentId}`, {
        data: { reason },
      });

      console.log(`Appointment ${appointmentId} cancelled successfully`);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      throw error;
    }
  }

  /**
   * Get appointment by ID
   *
   * Fetches detailed information about a specific appointment.
   * Useful for displaying appointment details or refreshing data.
   *
   * @param appointmentId - ID of the appointment
   * @returns Promise with appointment details
   * @throws {AxiosError} If appointment not found
   *
   * @example
   * ```typescript
   * try {
   *   const appointment = await appointmentService.getAppointmentById(456);
   *   console.log(`Appointment with Dr. ${appointment.clinician_name}`);
   *   console.log(`Status: ${appointment.status}`);
   *   console.log(`Date: ${new Date(appointment.scheduled_start_at).toLocaleDateString()}`);
   * } catch (error) {
   *   console.error("Appointment not found");
   * }
   * ```
   */
  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    try {
      const response = await apiClient.get<APIResponse<Appointment>>(
        `/appointments/${appointmentId}`
      );

      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch appointment ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Update appointment status
   *
   * Updates the status of an appointment. This is typically used internally
   * after payment confirmation or by staff for status changes.
   *
   * @param appointmentId - ID of the appointment
   * @param status - New status
   * @returns Promise with updated appointment
   * @throws {AxiosError} If update fails or invalid status transition
   *
   * @example
   * ```typescript
   * // After successful payment
   * await appointmentService.updateAppointmentStatus(456, "CONFIRMED");
   * ```
   */
  async updateAppointmentStatus(
    appointmentId: number,
    status: string
  ): Promise<Appointment> {
    try {
      const response = await apiClient.patch<APIResponse<Appointment>>(
        `/appointments/${appointmentId}`,
        { status }
      );

      console.log(`Appointment ${appointmentId} status updated to ${status}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      throw error;
    }
  }
}

/**
 * Export singleton instance of AppointmentService
 *
 * Use this instance throughout the application for appointment operations.
 * Do not create new instances of AppointmentService.
 *
 * @example
 * ```typescript
 * import appointmentService from './services/appointmentService';
 *
 * // Check availability
 * const availability = await appointmentService.getAvailability(5, 1, "2024-12-20");
 *
 * // Book appointment
 * const appointment = await appointmentService.createAppointment({
 *   clinician_id: 5,
 *   centre_id: 1,
 *   appointment_type: "IN_PERSON",
 *   scheduled_start_at: "2024-12-20T10:00:00+05:30"
 * });
 *
 * // Get patient appointments
 * const appointments = await appointmentService.getPatientAppointments(123);
 *
 * // Cancel appointment
 * await appointmentService.cancelAppointment(456, "Unable to attend");
 * ```
 */
export default new AppointmentService();
