# Design Document

## Overview

This design document outlines the architecture and implementation strategy for integrating the patient-facing booking flow and dashboard with the Mibo Mental Health backend API. The integration will transform the current dummy-data implementation into a fully functional system that connects to the Express.js/PostgreSQL backend, enabling real patient authentication, live doctor availability, appointment booking, Razorpay payment processing, and a comprehensive patient dashboard.

The design preserves all existing animations, loading effects, and UI/UX elements while adding robust API integration, error handling, and state management. The implementation follows a service-oriented architecture with clear separation between API communication, business logic, and UI components.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Patient Frontend                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Components (UI Layer)                 │  │
│  │  - BookAppointment (Multi-step wizard)               │  │
│  │  - PatientDashboard (Appointments & Profile)         │  │
│  │  - PatientAuth (Login/Register)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Service Layer (API Communication)             │  │
│  │  - authService (Authentication)                       │  │
│  │  - clinicianService (Doctor data)                     │  │
│  │  - appointmentService (Booking & management)          │  │
│  │  - patientService (Profile management)                │  │
│  │  - centreService (Location data)                      │  │
│  │  - paymentService (Razorpay integration)              │  │
│  │  - videoService (Meet links)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         API Client (Axios with interceptors)          │  │
│  │  - Request interceptor (Add auth token)              │  │
│  │  - Response interceptor (Handle errors)              │  │
│  │  - Retry logic with exponential backoff              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express.js)                    │
│  - Authentication endpoints                                  │
│  - Patient, Clinician, Centre, Appointment APIs             │
│  - Payment processing (Razorpay)                             │
│  - Video consultation (Google Meet)                          │
│  - PostgreSQL database                                       │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

The patient-facing application follows a layered architecture:

1. **Presentation Layer**: React components that handle UI rendering and user interactions
2. **Service Layer**: TypeScript services that encapsulate API communication logic
3. **API Client Layer**: Axios instance with interceptors for authentication and error handling
4. **State Management**: React hooks (useState, useEffect) with localStorage for persistence

## Components and Interfaces

### 1. API Client Configuration

**File**: `src/services/api.ts`

The API client is a configured Axios instance that handles all HTTP communication with the backend.

```typescript
import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mibo_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("mibo_access_token");
      localStorage.removeItem("mibo_user");
      window.location.href = "/auth";
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        type: "network_error",
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Authentication Service

**File**: `src/services/authService.ts`

Handles patient authentication via phone OTP.

```typescript
import apiClient from "./api";

interface SendOTPResponse {
  success: boolean;
  message: string;
  data: {
    phone: string;
    expiresIn: number;
  };
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      full_name: string;
      phone: string;
      email: string | null;
      user_type: "PATIENT";
    };
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  /**
   * Send OTP to patient's phone number
   * @param phone - 10-digit Indian mobile number
   * @returns Promise with OTP send confirmation
   */
  async sendOTP(phone: string): Promise<SendOTPResponse> {
    const response = await apiClient.post("/auth/send-otp", { phone });
    return response.data;
  }

  /**
   * Verify OTP and login patient
   * @param phone - 10-digit phone number
   * @param otp - 6-digit OTP code
   * @returns Promise with user data and tokens
   */
  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login/phone-otp", {
      phone,
      otp,
    });

    // Store tokens and user data
    const { accessToken, refreshToken, user } = response.data.data;
    localStorage.setItem("mibo_access_token", accessToken);
    localStorage.setItem("mibo_refresh_token", refreshToken);
    localStorage.setItem("mibo_user", JSON.stringify(user));

    return response.data;
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem("mibo_access_token");
    const user = localStorage.getItem("mibo_user");
    return !!(token && user);
  }

  /**
   * Get current authenticated user
   * @returns User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("mibo_user");
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    localStorage.removeItem("mibo_access_token");
    localStorage.removeItem("mibo_refresh_token");
    localStorage.removeItem("mibo_user");
  }
}

export default new AuthService();
```

### 3. Clinician Service

**File**: `src/services/clinicianService.ts`

Handles fetching doctor/clinician data.

```typescript
import apiClient from "./api";

interface Clinician {
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

interface GetCliniciansParams {
  centreId?: number;
  specialization?: string;
}

class ClinicianService {
  private cache: { data: Clinician[] | null; timestamp: number | null } = {
    data: null,
    timestamp: null,
  };
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all clinicians with optional filters
   * Implements 5-minute caching to reduce API calls
   * @param params - Optional filters (centreId, specialization)
   * @returns Promise with array of clinicians
   */
  async getClinicians(params?: GetCliniciansParams): Promise<Clinician[]> {
    // Check cache validity
    const now = Date.now();
    if (
      this.cache.data &&
      this.cache.timestamp &&
      now - this.cache.timestamp < this.CACHE_DURATION
    ) {
      return this.filterClinicians(this.cache.data, params);
    }

    // Fetch from API
    const response = await apiClient.get("/clinicians", { params });
    this.cache.data = response.data.data;
    this.cache.timestamp = now;

    return this.filterClinicians(this.cache.data, params);
  }

  /**
   * Get clinician by ID
   * @param id - Clinician ID
   * @returns Promise with clinician details
   */
  async getClinicianById(id: number): Promise<Clinician> {
    const response = await apiClient.get(`/clinicians/${id}`);
    return response.data.data;
  }

  /**
   * Clear the clinician cache
   */
  clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = null;
  }

  /**
   * Filter clinicians based on params
   * @private
   */
  private filterClinicians(
    clinicians: Clinician[],
    params?: GetCliniciansParams
  ): Clinician[] {
    if (!params) return clinicians;

    return clinicians.filter((clinician) => {
      if (params.centreId && clinician.primary_centre_id !== params.centreId) {
        return false;
      }
      if (
        params.specialization &&
        !clinician.specialization
          .toLowerCase()
          .includes(params.specialization.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
}

export default new ClinicianService();
```

### 4. Appointment Service

**File**: `src/services/appointmentService.ts`

Handles appointment booking, fetching, and management.

```typescript
import apiClient from "./api";

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

interface AvailabilityResponse {
  success: boolean;
  data: {
    clinician_id: number;
    clinician_name: string;
    centre_id: number;
    date: string;
    available_slots: TimeSlot[];
  };
}

interface CreateAppointmentRequest {
  patient_id?: number; // Optional, derived from auth if not provided
  clinician_id: number;
  centre_id: number;
  appointment_type:
    | "IN_PERSON"
    | "ONLINE"
    | "INPATIENT_ASSESSMENT"
    | "FOLLOW_UP";
  scheduled_start_at: string; // ISO datetime
  duration_minutes?: number; // Default 30
  notes?: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  clinician_id: number;
  clinician_name: string;
  centre_id: number;
  centre_name: string;
  appointment_type: string;
  status:
    | "BOOKED"
    | "CONFIRMED"
    | "RESCHEDULED"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";
  scheduled_start_at: string;
  scheduled_end_at: string;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
}

class AppointmentService {
  /**
   * Get available time slots for a clinician on a specific date
   * @param clinicianId - Clinician ID
   * @param centreId - Centre ID
   * @param date - Date in YYYY-MM-DD format
   * @returns Promise with available slots
   */
  async getAvailability(
    clinicianId: number,
    centreId: number,
    date: string
  ): Promise<AvailabilityResponse> {
    const response = await apiClient.get("/appointments/availability", {
      params: {
        clinician_id: clinicianId,
        centre_id: centreId,
        date,
      },
    });
    return response.data;
  }

  /**
   * Create a new appointment
   * @param data - Appointment creation data
   * @returns Promise with created appointment
   */
  async createAppointment(
    data: CreateAppointmentRequest
  ): Promise<Appointment> {
    const response = await apiClient.post("/appointments", data);
    return response.data.data;
  }

  /**
   * Get appointments for current patient
   * @param patientId - Patient ID
   * @returns Promise with array of appointments
   */
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    const response = await apiClient.get(`/patients/${patientId}/appointments`);
    return response.data.data;
  }

  /**
   * Cancel an appointment
   * @param appointmentId - Appointment ID
   * @param reason - Cancellation reason
   * @returns Promise with cancellation confirmation
   */
  async cancelAppointment(
    appointmentId: number,
    reason: string
  ): Promise<void> {
    await apiClient.delete(`/appointments/${appointmentId}`, {
      data: { reason },
    });
  }
}

export default new AppointmentService();
```

### 5. Payment Service

**File**: `src/services/paymentService.ts`

Handles Razorpay payment integration.

```typescript
import apiClient from "./api";

interface PaymentOrderResponse {
  success: boolean;
  message: string;
  data: {
    order_id: string;
    amount: number;
    currency: string;
    appointment_id: number;
    patient_id: number;
    razorpay_key_id: string;
  };
}

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    order_id: string;
    payment_id_razorpay: string;
    status: "SUCCESS" | "FAILED";
    amount: number;
    verified_at: string;
  };
}

class PaymentService {
  /**
   * Create a Razorpay payment order for an appointment
   * @param appointmentId - Appointment ID
   * @returns Promise with Razorpay order details
   */
  async createPaymentOrder(
    appointmentId: number
  ): Promise<PaymentOrderResponse> {
    const response = await apiClient.post("/payments/create-order", {
      appointment_id: appointmentId,
    });
    return response.data;
  }

  /**
   * Verify payment after Razorpay checkout
   * @param paymentData - Razorpay payment response data
   * @returns Promise with verification result
   */
  async verifyPayment(
    paymentData: PaymentVerificationRequest
  ): Promise<PaymentVerificationResponse> {
    const response = await apiClient.post("/payments/verify", paymentData);
    return response.data;
  }

  /**
   * Open Razorpay checkout modal
   * @param orderData - Payment order data from backend
   * @param onSuccess - Callback for successful payment
   * @param onFailure - Callback for failed payment
   */
  openRazorpayCheckout(
    orderData: PaymentOrderResponse["data"],
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ): void {
    const options = {
      key: orderData.razorpay_key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Mibo Mental Health",
      description: "Appointment Consultation Fee",
      order_id: orderData.order_id,
      handler: onSuccess,
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#0a107d",
      },
      modal: {
        ondismiss: () => {
          onFailure({ message: "Payment cancelled by user" });
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }
}

export default new PaymentService();
```

### 6. Centre Service

**File**: `src/services/centreService.ts`

Handles fetching hospital centre data.

```typescript
import apiClient from "./api";

interface Centre {
  id: number;
  name: string;
  city: "bangalore" | "kochi" | "mumbai";
  address_line_1: string;
  address_line_2: string | null;
  pincode: string;
  contact_phone: string;
  is_active: boolean;
}

class CentreService {
  private fallbackCentres: Centre[] = [
    {
      id: 1,
      name: "Mibo Bangalore Centre",
      city: "bangalore",
      address_line_1: "MG Road, Bangalore",
      address_line_2: null,
      pincode: "560001",
      contact_phone: "9876543210",
      is_active: true,
    },
    {
      id: 2,
      name: "Mibo Mumbai Centre",
      city: "mumbai",
      address_line_1: "Andheri West, Mumbai",
      address_line_2: null,
      pincode: "400053",
      contact_phone: "9876543211",
      is_active: true,
    },
    {
      id: 3,
      name: "Mibo Kochi Centre",
      city: "kochi",
      address_line_1: "Marine Drive, Kochi",
      address_line_2: null,
      pincode: "682031",
      contact_phone: "9876543212",
      is_active: true,
    },
  ];

  /**
   * Get all centres
   * Falls back to hardcoded centres if API fails
   * @returns Promise with array of centres
   */
  async getCentres(): Promise<Centre[]> {
    try {
      const response = await apiClient.get("/centres");
      return response.data.data;
    } catch (error) {
      console.warn("Failed to fetch centres from API, using fallback data");
      return this.fallbackCentres;
    }
  }

  /**
   * Get centre by ID
   * @param id - Centre ID
   * @returns Promise with centre details
   */
  async getCentreById(id: number): Promise<Centre> {
    try {
      const response = await apiClient.get(`/centres/${id}`);
      return response.data.data;
    } catch (error) {
      const fallback = this.fallbackCentres.find((c) => c.id === id);
      if (fallback) return fallback;
      throw error;
    }
  }
}

export default new CentreService();
```

### 7. Patient Service

**File**: `src/services/patientService.ts`

Handles patient profile management.

```typescript
import apiClient from "./api";

interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  blood_group: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  is_active: boolean;
}

interface UpdatePatientRequest {
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
}

class PatientService {
  /**
   * Get patient by ID
   * @param id - Patient ID
   * @returns Promise with patient details
   */
  async getPatientById(id: number): Promise<Patient> {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data.data;
  }

  /**
   * Update patient profile
   * @param id - Patient ID
   * @param data - Updated patient data
   * @returns Promise with updated patient
   */
  async updatePatient(
    id: number,
    data: UpdatePatientRequest
  ): Promise<Patient> {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data.data;
  }

  /**
   * Validate email format
   * @param email - Email address
   * @returns boolean indicating validity
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Indian phone number format
   * @param phone - Phone number
   * @returns boolean indicating validity
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }
}

export default new PatientService();
```

### 8. Video Service

**File**: `src/services/videoService.ts`

Handles video consultation link access.

```typescript
import apiClient from "./api";

interface VideoLink {
  video_link_id: number;
  appointment_id: number;
  meet_link: string;
  provider: "GOOGLE_MEET";
  created_at: string;
}

class VideoService {
  /**
   * Get video consultation link for an appointment
   * @param appointmentId - Appointment ID
   * @returns Promise with video link details
   */
  async getVideoLink(appointmentId: number): Promise<VideoLink> {
    const response = await apiClient.get(
      `/video/appointment/${appointmentId}/meet-link`
    );
    return response.data.data;
  }

  /**
   * Open video link in new tab
   * @param meetLink - Google Meet URL
   */
  openVideoLink(meetLink: string): void {
    window.open(meetLink, "_blank", "noopener,noreferrer");
  }
}

export default new VideoService();
```

## Data Models

### TypeScript Interfaces

**File**: `src/types/index.ts`

```typescript
// User and Authentication
export interface User {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  user_type: "PATIENT" | "STAFF";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Clinician
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

// Centre
export interface Centre {
  id: number;
  name: string;
  city: "bangalore" | "kochi" | "mumbai";
  address_line_1: string;
  address_line_2: string | null;
  pincode: string;
  contact_phone: string;
  is_active: boolean;
}

// Appointment
export type AppointmentType =
  | "IN_PERSON"
  | "ONLINE"
  | "INPATIENT_ASSESSMENT"
  | "FOLLOW_UP";
export type AppointmentStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

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
  scheduled_start_at: string;
  scheduled_end_at: string;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
}

// Patient
export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  blood_group: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  is_active: boolean;
}

// Time Slot
export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

// Payment
export interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  appointment_id: number;
  patient_id: number;
  razorpay_key_id: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Video
export interface VideoLink {
  video_link_id: number;
  appointment_id: number;
  meet_link: string;
  provider: "GOOGLE_MEET";
  created_at: string;
}

// API Response
export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface APIError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: OTP Request Triggers API Call

_For any_ valid 10-digit phone number, when a patient enters it and requests OTP, the system should call the `/auth/send-otp` endpoint with the phone number.

**Validates: Requirements 1.1**

### Property 2: OTP Input Display After Successful Send

_For any_ successful OTP send response, the UI should display an OTP input field and hide the phone input.

**Validates: Requirements 1.2**

### Property 3: Valid OTP Triggers Login

_For any_ valid phone number and 6-digit OTP combination, when submitted, the system should call `/auth/login/phone-otp` and receive an authentication token.

**Validates: Requirements 1.3**

### Property 4: Token Storage After Authentication

_For any_ successful authentication response, the system should store the access token, refresh token, and user data in localStorage.

**Validates: Requirements 1.4**

### Property 5: Auto-Authentication with Valid Token

_For any_ valid authentication token in localStorage, when the app loads, the user should be automatically authenticated without requiring login.

**Validates: Requirements 1.5**

### Property 6: Clinician Data Fetch on Load

_For any_ booking flow initialization, the system should fetch clinician data from `/clinicians` endpoint.

**Validates: Requirements 2.1**

### Property 7: Complete Clinician Information Display

_For any_ clinician object returned from the API, the UI should display name, specialization, experience_years, consultation_fee, and bio fields.

**Validates: Requirements 2.2**

### Property 8: Centre-Based Clinician Filtering

_For any_ selected centre, the displayed clinicians should only include those with primary_centre_id matching the selected centre.

**Validates: Requirements 2.3**

### Property 9: Clinician Data Caching

_For any_ clinician data fetch, subsequent requests within 5 minutes should use cached data instead of making new API calls.

**Validates: Requirements 2.5**

### Property 10: Availability Fetch on Selection

_For any_ clinician and date selection, the system should fetch availability from `/appointments/availability` with the correct parameters.

**Validates: Requirements 3.1**

### Property 11: Available Slots Display

_For any_ availability response, only time slots with `available: true` should be displayed to the patient.

**Validates: Requirements 3.2**

### Property 12: Availability Refresh on Change

_For any_ change in selected date or clinician, the system should fetch fresh availability data.

**Validates: Requirements 3.4**

### Property 13: Complete Appointment Data Submission

_For any_ appointment creation, the request should include patient_id, clinician_id, centre_id, appointment_type, scheduled_start_at, and duration_minutes.

**Validates: Requirements 4.1, 4.2**

### Property 14: Duplicate Submission Prevention

_For any_ appointment submission, the submit button should be disabled after the first click to prevent duplicate submissions.

**Validates: Requirements 4.5**

### Property 15: Payment Order Creation

_For any_ booking confirmation, the system should call `/payments/create-order` with the appointment ID.

**Validates: Requirements 5.1**

### Property 16: Razorpay Modal Opening

_For any_ successful payment order creation, the Razorpay checkout modal should open with the order details.

**Validates: Requirements 5.2**

### Property 17: Payment Verification After Success

_For any_ successful Razorpay payment, the system should call `/payments/verify` with the payment signature.

**Validates: Requirements 5.3**

### Property 18: Appointment Status Update After Payment

_For any_ successful payment verification, the appointment status should be updated to CONFIRMED.

**Validates: Requirements 5.4**

### Property 19: Dashboard Appointments Fetch

_For any_ authenticated patient accessing the dashboard, the system should fetch appointments from `/patients/:id/appointments`.

**Validates: Requirements 6.1**

### Property 20: Appointment Categorization

_For any_ list of appointments, they should be categorized as "Upcoming" (future dates) or "Past" (past dates or completed status).

**Validates: Requirements 6.2**

### Property 21: Complete Appointment Details Display

_For any_ appointment, the dashboard should display clinician name, centre name, date, time, status, and appointment type.

**Validates: Requirements 6.3**

### Property 22: Dashboard Data Refresh on Navigation

_For any_ navigation to the dashboard, the system should fetch fresh appointment data.

**Validates: Requirements 6.5**

### Property 23: Cancellation Confirmation Dialog

_For any_ cancel button click on an upcoming appointment, a confirmation dialog should be displayed.

**Validates: Requirements 7.1**

### Property 24: Cancellation API Call

_For any_ confirmed cancellation, the system should call `/appointments/:id` DELETE endpoint with a cancellation reason.

**Validates: Requirements 7.2**

### Property 25: UI Update After Cancellation

_For any_ successful cancellation, the appointment status should update to CANCELLED and the list should refresh.

**Validates: Requirements 7.3**

### Property 26: Cancellation Status Restriction

_For any_ appointment, the cancel button should only be enabled if the status is BOOKED or CONFIRMED.

**Validates: Requirements 7.4**

### Property 27: Centre Data Fetch

_For any_ booking flow initialization, the system should fetch centre data from `/centres` endpoint.

**Validates: Requirements 8.1**

### Property 28: Complete Centre Information Display

_For any_ centre object, the UI should display name, city, address, and contact information.

**Validates: Requirements 8.2**

### Property 29: Centre-Based Clinician Filtering

_For any_ selected centre, only clinicians with matching primary_centre_id should be displayed.

**Validates: Requirements 8.3**

### Property 30: Centre Details in Confirmation

_For any_ booking confirmation step, the selected centre's details should be displayed.

**Validates: Requirements 8.4**

### Property 31: Retry with Exponential Backoff

_For any_ failed API call, the system should retry with exponentially increasing delays between attempts.

**Validates: Requirements 9.5**

### Property 32: Loading State During API Calls

_For any_ in-progress API call, a loading spinner or skeleton screen should be displayed.

**Validates: Requirements 10.1**

### Property 33: Button Disable During API Calls

_For any_ form with pending API call, submission buttons should be disabled.

**Validates: Requirements 10.2**

### Property 34: Skeleton Content During Loading

_For any_ data fetch operation, placeholder content matching the expected layout should be shown.

**Validates: Requirements 10.3**

### Property 35: API Call Timeout

_For any_ API call exceeding 30 seconds, a timeout error should be displayed.

**Validates: Requirements 10.4**

### Property 36: Profile Data Fetch

_For any_ profile access, the system should fetch patient data from `/patients/:id` endpoint.

**Validates: Requirements 11.1**

### Property 37: Complete Profile Information Display

_For any_ patient object, the profile should display full_name, phone, email, date_of_birth, gender, and emergency contacts.

**Validates: Requirements 11.2**

### Property 38: Profile Update API Call

_For any_ profile update submission, the system should call `/patients/:id` PUT endpoint with the updated data.

**Validates: Requirements 11.3**

### Property 39: Success Message After Profile Update

_For any_ successful profile update, a success message should be displayed and the data should refresh.

**Validates: Requirements 11.4**

### Property 40: Profile Validation Before Submission

_For any_ profile update with email or phone, the format should be validated before API submission.

**Validates: Requirements 11.5**

### Property 41: Success Message with Appointment Details

_For any_ successful appointment creation, a success message with appointment details should be displayed.

**Validates: Requirements 12.1**

### Property 42: Confirmation Details Display

_For any_ booking confirmation, the date, time, clinician name, and centre address should be shown.

**Validates: Requirements 12.2**

### Property 43: Payment Details Display

_For any_ completed payment, the transaction ID and payment amount should be displayed.

**Validates: Requirements 12.3**

### Property 44: Dashboard Navigation Button

_For any_ successful booking, a button to navigate to the dashboard should be provided.

**Validates: Requirements 12.4**

### Property 45: Video Call Button for Online Appointments

_For any_ ONLINE appointment within 15 minutes of start time, a "Join Video Call" button should be displayed.

**Validates: Requirements 13.1**

### Property 46: Video Link Fetch on Button Click

_For any_ video call button click, the system should fetch the video link from `/video/:appointmentId` endpoint.

**Validates: Requirements 13.2**

### Property 47: Video Link Opening

_For any_ available video link, clicking the button should open the Google Meet link in a new tab.

**Validates: Requirements 13.3**

### Property 48: Video Button Status Restriction

_For any_ appointment, the video call button should only appear if the status is CONFIRMED or BOOKED.

**Validates: Requirements 13.5**

### Property 49: Touch Target Size

_For any_ interactive element on mobile, the touch target should be at least 44x44 pixels.

**Validates: Requirements 14.4**

## Error Handling

### Error Handling Strategy

The application implements a comprehensive error handling strategy across all API interactions:

#### 1. Network Errors

When the API is unreachable or network connection fails:

```typescript
// In API client response interceptor
if (!error.response) {
  return Promise.reject({
    message: "Network error. Please check your internet connection.",
    type: "network_error",
    retryable: true,
  });
}
```

**User Experience**: Display a friendly message with a retry button.

#### 2. Authentication Errors (401)

When the authentication token is invalid or expired:

```typescript
if (error.response?.status === 401) {
  localStorage.removeItem("mibo_access_token");
  localStorage.removeItem("mibo_user");
  window.location.href = "/auth";
}
```

**User Experience**: Automatically redirect to login page and clear stored credentials.

#### 3. Validation Errors (400)

When the API returns validation errors:

```typescript
if (error.response?.status === 400) {
  const errors = error.response.data.errors || [];
  // Display field-specific error messages
  errors.forEach((err) => {
    showFieldError(err.field, err.message);
  });
}
```

**User Experience**: Display specific error messages next to the relevant form fields.

#### 4. Server Errors (500)

When the backend encounters an internal error:

```typescript
if (error.response?.status === 500) {
  console.error("Server error:", error);
  showErrorMessage("Something went wrong. Please try again later.");
}
```

**User Experience**: Display a generic error message without exposing internal details.

#### 5. Retry Logic with Exponential Backoff

For transient failures, implement automatic retry:

```typescript
async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

#### 6. Timeout Handling

All API calls have a 30-second timeout:

```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
});
```

**User Experience**: If a request exceeds 30 seconds, show a timeout error with retry option.

### Error Display Components

**Toast Notifications**: For non-blocking errors and success messages
**Inline Errors**: For form validation errors
**Error Boundaries**: For catching React component errors
**Fallback UI**: For failed data fetches (e.g., fallback centre data)

## Testing Strategy

### Unit Testing

Unit tests will verify individual service methods and utility functions:

**Test Coverage**:

- Service method input/output validation
- Data transformation functions
- Validation helpers (email, phone)
- Error handling in services
- Cache management in ClinicianService

**Example Unit Tests**:

```typescript
describe("PatientService", () => {
  test("validateEmail returns true for valid email", () => {
    expect(patientService.validateEmail("test@example.com")).toBe(true);
  });

  test("validateEmail returns false for invalid email", () => {
    expect(patientService.validateEmail("invalid-email")).toBe(false);
  });

  test("validatePhone returns true for valid Indian mobile", () => {
    expect(patientService.validatePhone("9876543210")).toBe(true);
  });

  test("validatePhone returns false for invalid number", () => {
    expect(patientService.validatePhone("1234567890")).toBe(false);
  });
});
```

### Property-Based Testing

Property-based tests will verify universal properties across many inputs using a PBT library (fast-check for TypeScript).

**PBT Library**: fast-check (https://github.com/dubzzz/fast-check)

**Configuration**: Each property test should run a minimum of 100 iterations.

**Test Organization**: Each correctness property from the design document will have its own property-based test.

**Example Property Tests**:

```typescript
import fc from "fast-check";

describe("Property Tests - Authentication", () => {
  /**
   * Feature: patient-booking-integration, Property 1: OTP Request Triggers API Call
   * For any valid 10-digit phone number, when a patient enters it and requests OTP,
   * the system should call the /auth/send-otp endpoint with the phone number.
   */
  test("Property 1: OTP request calls API with phone number", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 6000000000, max: 9999999999 }).map(String),
        async (phone) => {
          const mockApiCall = jest.fn();
          // Test that API is called with correct phone
          await authService.sendOTP(phone);
          expect(mockApiCall).toHaveBeenCalledWith("/auth/send-otp", { phone });
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property Tests - Appointments", () => {
  /**
   * Feature: patient-booking-integration, Property 20: Appointment Categorization
   * For any list of appointments, they should be categorized as "Upcoming" (future dates)
   * or "Past" (past dates or completed status).
   */
  test("Property 20: Appointments are correctly categorized", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer(),
            scheduled_start_at: fc.date(),
            status: fc.constantFrom(
              "BOOKED",
              "CONFIRMED",
              "COMPLETED",
              "CANCELLED"
            ),
          })
        ),
        (appointments) => {
          const now = new Date();
          const categorized = categorizeAppointments(appointments);

          // All upcoming should be in future
          categorized.upcoming.every(
            (apt) => new Date(apt.scheduled_start_at) > now
          );

          // All past should be in past or completed
          categorized.past.every(
            (apt) =>
              new Date(apt.scheduled_start_at) <= now ||
              apt.status === "COMPLETED"
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

Integration tests will verify the interaction between components and services:

**Test Coverage**:

- Booking flow end-to-end (mock API)
- Dashboard data loading and display
- Payment flow with Razorpay (mock)
- Error handling across components

### Manual Testing Checklist

- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test with slow network (throttling)
- [ ] Test with API failures
- [ ] Test payment flow with Razorpay test mode
- [ ] Test video link access near appointment time
- [ ] Verify all animations are preserved
- [ ] Test accessibility (keyboard navigation, screen readers)

## Implementation Details

### Booking Flow State Management

The booking flow maintains state across multiple steps using React hooks:

```typescript
interface BookingState {
  // Step 1: Session Details
  clinician: Clinician | null;
  centre: Centre | null;
  appointmentType: AppointmentType;
  selectedDate: Date | null;
  selectedTime: string;
  duration: number;

  // Step 2: Phone Verification
  phone: string;
  otpSent: boolean;
  otp: string;

  // Step 3: Confirmation
  notes: string;

  // Payment
  paymentOrderId: string | null;
  paymentStatus: "pending" | "success" | "failed";

  // Created appointment
  appointmentId: number | null;
}
```

### Component Structure Updates

#### 1. Step1SessionDetails.tsx Updates

**Changes Required**:

- Replace dummy doctor data with API call to `clinicianService.getClinicians()`
- Replace dummy availability with API call to `appointmentService.getAvailability()`
- Add loading states for data fetching
- Add error handling with retry buttons
- Preserve all existing animations and UI

**Key Integration Points**:

```typescript
// Fetch clinicians on mount
useEffect(() => {
  const fetchClinicians = async () => {
    setLoading(true);
    try {
      const data = await clinicianService.getClinicians({
        centreId: selectedCentre?.id,
      });
      setClinicians(data);
    } catch (error) {
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  fetchClinicians();
}, [selectedCentre]);

// Fetch availability when date/clinician changes
useEffect(() => {
  if (selectedClinician && selectedDate) {
    const fetchAvailability = async () => {
      setLoadingSlots(true);
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const response = await appointmentService.getAvailability(
          selectedClinician.id,
          selectedCentre.id,
          dateStr
        );
        setAvailableSlots(response.data.available_slots);
      } catch (error) {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailability();
  }
}, [selectedClinician, selectedDate]);
```

#### 2. Step2PhoneVerification.tsx Updates

**Changes Required**:

- Replace dummy OTP logic with real API calls
- Integrate `authService.sendOTP()` and `authService.verifyOTP()`
- Add proper error handling for OTP failures
- Store authentication tokens on successful verification

**Key Integration Points**:

```typescript
const handleSendOtp = async () => {
  if (!patientService.validatePhone(phone)) {
    setError("Please enter a valid 10-digit mobile number");
    return;
  }

  setLoading(true);
  try {
    await authService.sendOTP(phone);
    setOtpSent(true);
    setError("");
  } catch (error: any) {
    setError(error.response?.data?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

const handleVerifyOtp = async () => {
  if (otp.length !== 6) {
    setError("Please enter a valid 6-digit OTP");
    return;
  }

  setLoading(true);
  try {
    const response = await authService.verifyOTP(phone, otp);
    setBookingData({
      ...bookingData,
      phone,
      patientId: response.data.user.id,
    });
    onContinue();
  } catch (error: any) {
    setError(error.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};
```

#### 3. Step3ConfirmBooking.tsx Updates

**Changes Required**:

- Create appointment via API before payment
- Integrate Razorpay payment flow
- Handle payment success/failure
- Navigate to dashboard on success

**Key Integration Points**:

```typescript
const handleConfirmBooking = async () => {
  setLoading(true);
  try {
    // 1. Create appointment
    const appointmentData = {
      clinician_id: bookingData.clinician.id,
      centre_id: bookingData.centre.id,
      appointment_type: bookingData.appointmentType,
      scheduled_start_at: new Date(
        `${bookingData.date}T${bookingData.time}`
      ).toISOString(),
      duration_minutes: bookingData.duration,
      notes: bookingData.notes,
    };

    const appointment = await appointmentService.createAppointment(
      appointmentData
    );
    setAppointmentId(appointment.id);

    // 2. Create payment order
    const paymentOrder = await paymentService.createPaymentOrder(
      appointment.id
    );

    // 3. Open Razorpay checkout
    paymentService.openRazorpayCheckout(
      paymentOrder.data,
      handlePaymentSuccess,
      handlePaymentFailure
    );
  } catch (error: any) {
    setError(error.response?.data?.message || "Failed to create appointment");
  } finally {
    setLoading(false);
  }
};

const handlePaymentSuccess = async (response: any) => {
  try {
    // Verify payment
    await paymentService.verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    // Navigate to success page
    navigate("/profileDashboard", {
      state: { bookingSuccess: true, appointmentId },
    });
  } catch (error) {
    setError("Payment verification failed");
  }
};

const handlePaymentFailure = (error: any) => {
  setError("Payment failed. Please try again.");
  // Optionally cancel the appointment
};
```

#### 4. PatientDashboard.tsx Updates

**Changes Required**:

- Fetch real appointments from API
- Display appointments categorized by upcoming/past
- Add cancellation functionality
- Add video link access for online appointments
- Add profile management

**Key Integration Points**:

```typescript
const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await appointmentService.getPatientAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeAppointments = () => {
    const now = new Date();
    return {
      upcoming: appointments.filter(
        (apt) =>
          new Date(apt.scheduled_start_at) > now &&
          !["COMPLETED", "CANCELLED", "NO_SHOW"].includes(apt.status)
      ),
      past: appointments.filter(
        (apt) =>
          new Date(apt.scheduled_start_at) <= now ||
          ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(apt.status)
      ),
    };
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await appointmentService.cancelAppointment(
        appointmentId,
        "Cancelled by patient"
      );
      fetchAppointments(); // Refresh list
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const handleJoinVideoCall = async (appointmentId: number) => {
    try {
      const videoLink = await videoService.getVideoLink(appointmentId);
      videoService.openVideoLink(videoLink.meet_link);
    } catch (error) {
      alert("Video link not available yet");
    }
  };

  const { upcoming, past } = categorizeAppointments();

  // Render UI...
};
```

### Environment Configuration

**File**: `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### Razorpay Integration

Add Razorpay script to `index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Loading States

Implement consistent loading states across all components:

```typescript
// Skeleton loader for clinician cards
const ClinicianSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-20 bg-gray-200 rounded-lg mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Spinner for button loading
const ButtonSpinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
```

### Utility Functions

**File**: `src/utils/dateHelpers.ts`

```typescript
/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format date for display (e.g., "Mon, Jan 15, 2024")
 */
export function formatDateForDisplay(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format time for display (e.g., "10:00 AM")
 */
export function formatTimeForDisplay(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Check if appointment is within 15 minutes of start time
 */
export function isAppointmentStartingSoon(scheduledStartAt: string): boolean {
  const now = new Date();
  const startTime = new Date(scheduledStartAt);
  const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);
  return diffMinutes >= 0 && diffMinutes <= 15;
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d > new Date();
}
```

### Security Considerations

1. **Token Storage**: Store JWT tokens in localStorage (acceptable for this use case)
2. **HTTPS**: Ensure production deployment uses HTTPS
3. **Input Validation**: Validate all user inputs before API submission
4. **XSS Prevention**: React's JSX escaping provides protection
5. **CSRF**: Not applicable for JWT-based auth
6. **Sensitive Data**: Never log tokens or sensitive user data

### Performance Optimizations

1. **Clinician Data Caching**: 5-minute cache to reduce API calls
2. **Lazy Loading**: Load components on demand
3. **Debouncing**: Debounce search inputs if implemented
4. **Memoization**: Use React.memo for expensive components
5. **Image Optimization**: Compress and lazy-load doctor images

### Accessibility

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **ARIA Labels**: Add appropriate ARIA labels to buttons and inputs
3. **Focus Management**: Manage focus when opening/closing modals
4. **Color Contrast**: Maintain WCAG AA contrast ratios
5. **Screen Reader Support**: Test with screen readers
