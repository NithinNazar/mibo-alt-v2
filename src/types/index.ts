/**
 * TypeScript Type Definitions
 *
 * This module contains all TypeScript interfaces and types used throughout
 * the Mibo Mental Health patient booking application. These types ensure
 * type safety and provide IntelliSense support for API data structures.
 *
 * @module types
 */

// ============================================================================
// User and Authentication Types
// ============================================================================

/**
 * User type enumeration
 */
export type UserType = "PATIENT" | "STAFF";

/**
 * User object representing an authenticated user
 */
export interface User {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  user_type: UserType;
}

/**
 * Authentication tokens returned from login
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ============================================================================
// Clinician Types
// ============================================================================

/**
 * Clinician (doctor/therapist) object
 * Represents a healthcare professional who provides consultations
 */
export interface Clinician {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  email: string | null;
  primary_centre_id: number;
  primary_centre_name: string;
  specialization: string;
  registration_number: string | null;
  experience_years: number;
  consultation_fee: number;
  bio: string | null;
  is_active: boolean;
}

/**
 * Parameters for fetching clinicians with filters
 */
export interface GetCliniciansParams {
  centreId?: number;
  specialization?: string;
}

// ============================================================================
// Centre Types
// ============================================================================

/**
 * City enumeration for centres
 */
export type CityType = "bangalore" | "kochi" | "mumbai";

/**
 * Centre (hospital location) object
 * Represents a physical location where consultations take place
 */
export interface Centre {
  id: number;
  name: string;
  city: CityType;
  address_line_1: string;
  address_line_2: string | null;
  pincode: string;
  contact_phone: string;
  is_active: boolean;
}

// ============================================================================
// Appointment Types
// ============================================================================

/**
 * Appointment type enumeration
 * Defines the mode of consultation
 */
export type AppointmentType =
  | "IN_PERSON" // Face-to-face consultation at centre
  | "ONLINE" // Video consultation via Google Meet
  | "INPATIENT_ASSESSMENT" // Assessment for inpatient admission
  | "FOLLOW_UP"; // Follow-up consultation

/**
 * Appointment status enumeration
 * Tracks the lifecycle of an appointment
 */
export type AppointmentStatus =
  | "BOOKED" // Initial booking, payment pending
  | "CONFIRMED" // Payment completed, appointment confirmed
  | "RESCHEDULED" // Appointment date/time changed
  | "COMPLETED" // Consultation completed
  | "CANCELLED" // Appointment cancelled by patient or staff
  | "NO_SHOW"; // Patient did not attend

/**
 * Appointment object
 * Represents a scheduled consultation between patient and clinician
 */
export interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  clinician_id: number;
  clinician_name: string;
  centre_id: number;
  centre_name: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  scheduled_start_at: string; // ISO datetime string
  scheduled_end_at: string; // ISO datetime string
  duration_minutes: number;
  notes: string | null;
  created_at: string; // ISO datetime string
}

/**
 * Request payload for creating a new appointment
 */
export interface CreateAppointmentRequest {
  patient_id?: number; // Optional, derived from auth if not provided
  clinician_id: number;
  centre_id: number;
  appointment_type: AppointmentType;
  scheduled_start_at: string; // ISO datetime string
  duration_minutes?: number; // Default 30 minutes
  notes?: string;
}

/**
 * Time slot for appointment availability
 */
export interface TimeSlot {
  start_time: string; // Time in HH:MM format (e.g., "09:00")
  end_time: string; // Time in HH:MM format (e.g., "09:30")
  available: boolean; // true if slot can be booked
}

/**
 * Availability response for a clinician on a specific date
 */
export interface AvailabilityResponse {
  success: boolean;
  data: {
    clinician_id: number;
    clinician_name: string;
    centre_id: number;
    date: string; // Date in YYYY-MM-DD format
    available_slots: TimeSlot[];
  };
}

// ============================================================================
// Patient Types
// ============================================================================

/**
 * Gender enumeration
 */
export type Gender = "male" | "female" | "other";

/**
 * Patient object
 * Represents a patient's profile information
 */
export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null; // Date in YYYY-MM-DD format
  gender: Gender | null;
  blood_group: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  is_active: boolean;
}

/**
 * Request payload for updating patient profile
 */
export interface UpdatePatientRequest {
  date_of_birth?: string; // Date in YYYY-MM-DD format
  gender?: Gender;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
}

// ============================================================================
// Payment Types
// ============================================================================

/**
 * Payment order object from backend
 * Contains Razorpay order details for checkout
 */
export interface PaymentOrder {
  order_id: string; // Razorpay order ID
  amount: number; // Amount in paise (₹100 = 10000 paise)
  currency: string; // Currency code (e.g., "INR")
  appointment_id: number;
  patient_id: number;
  razorpay_key_id: string; // Razorpay public key for checkout
}

/**
 * Payment verification request payload
 * Sent to backend after successful Razorpay payment
 */
export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string; // HMAC signature for verification
}

/**
 * Payment status enumeration
 */
export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

/**
 * Payment verification response from backend
 */
export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    order_id: string;
    payment_id_razorpay: string;
    status: PaymentStatus;
    amount: number;
    verified_at: string; // ISO datetime string
  };
}

// ============================================================================
// Video Consultation Types
// ============================================================================

/**
 * Video provider enumeration
 */
export type VideoProvider = "GOOGLE_MEET";

/**
 * Video link object
 * Contains Google Meet link for online consultations
 */
export interface VideoLink {
  video_link_id: number;
  appointment_id: number;
  meet_link: string; // Google Meet URL
  provider: VideoProvider;
  created_at: string; // ISO datetime string
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic successful API response wrapper
 */
export interface APIResponse<T> {
  success: true;
  message?: string;
  data: T;
}

/**
 * API error response structure
 */
export interface APIError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Generic API response that can be success or error
 */
export type APIResult<T> = APIResponse<T> | APIError;

// ============================================================================
// Booking Flow Types
// ============================================================================

/**
 * Booking data accumulated during the multi-step booking flow
 * Used to track user selections across steps
 */
export interface BookingData {
  // Step 1: Session Details
  selectedCentre?: Centre;
  selectedDoctor?: Clinician;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
  appointmentType?: AppointmentType;

  // Step 2: Phone Verification
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  patientId?: number;

  // Step 3: Confirmation
  appointmentId?: number;
  paymentOrderId?: string;
  paymentStatus?: PaymentStatus;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
