# Implementation Plan

## Overview

This implementation plan outlines the tasks required to integrate the patient booking flow and dashboard with the Mibo Mental Health backend API. The tasks are organized to build incrementally, starting with foundational services and progressing through the booking flow, payment integration, and dashboard implementation.

## Task List

- [x] 1. Set up API client and base services

  - Create axios instance with interceptors for authentication and error handling
  - Implement retry logic with exponential backoff
  - Add timeout configuration (30 seconds)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.4_

- [x] 1.1 Create API client configuration

  - Write `src/services/api.ts` with axios instance
  - Add request interceptor to inject authentication tokens
  - Add response interceptor for error handling and 401 redirects
  - Configure base URL from environment variables
  - _Requirements: 9.1, 9.3_

- [x] 1.2 Implement retry logic utility

  - Create `apiCallWithRetry` function with exponential backoff
  - Configure to skip retries for 4xx errors
  - Set maximum retry attempts to 3
  - _Requirements: 9.5_

- [x] 1.3 Write unit tests for API client

  - Test request interceptor adds auth token
  - Test response interceptor handles 401 errors
  - Test retry logic with different error types
  - _Requirements: 9.1, 9.3, 9.5_

- [x] 2. Implement authentication service

  - Create authentication service with OTP send and verify methods
  - Implement token storage in localStorage
  - Add authentication state helpers
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.1 Create authService with OTP methods

  - Write `src/services/authService.ts`
  - Implement `sendOTP(phone)` method calling `/auth/send-otp`
  - Implement `verifyOTP(phone, otp)` method calling `/auth/login/phone-otp`
  - Store tokens and user data in localStorage on successful verification
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2.2 Add authentication state helpers

  - Implement `isAuthenticated()` method to check token presence
  - Implement `getCurrentUser()` method to retrieve user from localStorage
  - Implement `logout()` method to clear stored data
  - _Requirements: 1.5_

- [ ] 2.3 Write property test for OTP flow

  - **Property 1: OTP Request Triggers API Call**
  - **Validates: Requirements 1.1**
  - Generate random valid phone numbers
  - Verify API is called with correct parameters
  - _Requirements: 1.1_

- [ ] 2.4 Write property test for token storage

  - **Property 4: Token Storage After Authentication**
  - **Validates: Requirements 1.4**
  - Simulate successful authentication
  - Verify tokens are stored in localStorage
  - _Requirements: 1.4_

- [x] 3. Implement clinician service

  - Create service to fetch and cache clinician data
  - Implement filtering by centre and specialization
  - Add 5-minute caching mechanism
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 3.1 Create clinicianService with caching

  - Write `src/services/clinicianService.ts`
  - Implement `getClinicians(params)` method with cache check
  - Implement `getClinicianById(id)` method
  - Add cache management (5-minute expiry)
  - _Requirements: 2.1, 2.5_

- [x] 3.2 Implement clinician filtering logic

  - Add private `filterClinicians` method
  - Filter by centreId (primary_centre_id match)
  - Filter by specialization (case-insensitive substring match)
  - _Requirements: 2.3_

- [ ] 3.3 Write property test for clinician caching

  - **Property 9: Clinician Data Caching**
  - **Validates: Requirements 2.5**
  - Verify subsequent calls within 5 minutes use cache
  - Verify calls after 5 minutes fetch fresh data
  - _Requirements: 2.5_

- [ ] 3.4 Write property test for centre filtering

  - **Property 8: Centre-Based Clinician Filtering**
  - **Validates: Requirements 2.3**
  - Generate random clinicians with different centres
  - Apply centre filter and verify only matching clinicians returned
  - _Requirements: 2.3_

- [x] 4. Implement appointment service

  - Create service for appointment operations
  - Add availability fetching
  - Add appointment creation and cancellation
  - _Requirements: 3.1, 3.2, 3.4, 4.1, 4.2, 6.1, 7.2_

- [x] 4.1 Create appointmentService with availability

  - Write `src/services/appointmentService.ts`
  - Implement `getAvailability(clinicianId, centreId, date)` method
  - Call `/appointments/availability` endpoint
  - _Requirements: 3.1_

- [x] 4.2 Add appointment creation method

  - Implement `createAppointment(data)` method
  - Call `/appointments` POST endpoint
  - Include all required fields (patient_id, clinician_id, centre_id, appointment_type, scheduled_start_at, duration_minutes)
  - _Requirements: 4.1, 4.2_

- [x] 4.3 Add appointment management methods

  - Implement `getPatientAppointments(patientId)` method
  - Implement `cancelAppointment(appointmentId, reason)` method
  - Call appropriate endpoints
  - _Requirements: 6.1, 7.2_

- [ ] 4.4 Write property test for availability refresh

  - **Property 12: Availability Refresh on Change**
  - **Validates: Requirements 3.4**
  - Simulate date/clinician changes
  - Verify API is called for each change
  - _Requirements: 3.4_

- [ ] 4.5 Write property test for appointment data completeness

  - **Property 13: Complete Appointment Data Submission**
  - **Validates: Requirements 4.1, 4.2**
  - Generate random appointment data
  - Verify all required fields are included in API call
  - _Requirements: 4.1, 4.2_

- [x] 5. Implement payment service with Razorpay

  - Create service for payment operations
  - Integrate Razorpay checkout modal
  - Add payment verification
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5.1 Create paymentService with order creation

  - Write `src/services/paymentService.ts`
  - Implement `createPaymentOrder(appointmentId)` method
  - Call `/payments/create-order` endpoint
  - _Requirements: 5.1_

- [x] 5.2 Implement Razorpay checkout integration

  - Add `openRazorpayCheckout` method
  - Configure Razorpay options with order data
  - Handle success and failure callbacks
  - Add Razorpay script to `index.html`
  - _Requirements: 5.2_

- [x] 5.3 Add payment verification method

  - Implement `verifyPayment(paymentData)` method
  - Call `/payments/verify` endpoint with signature
  - _Requirements: 5.3_

- [ ] 5.4 Write property test for payment flow

  - **Property 15: Payment Order Creation**
  - **Validates: Requirements 5.1**
  - Simulate booking confirmation
  - Verify payment order API is called
  - _Requirements: 5.1_

- [ ] 5.5 Write property test for payment verification

  - **Property 17: Payment Verification After Success**
  - **Validates: Requirements 5.3**
  - Simulate successful Razorpay payment
  - Verify verification API is called with correct data
  - _Requirements: 5.3_

- [x] 6. Implement centre and patient services

  - Create centre service with fallback data
  - Create patient service with profile management
  - Add validation helpers
  - _Requirements: 8.1, 8.2, 11.1, 11.3, 11.5_

- [x] 6.1 Create centreService with fallback

  - Write `src/services/centreService.ts`
  - Implement `getCentres()` method with try-catch
  - Add fallback data for Bangalore, Mumbai, Kochi
  - Implement `getCentreById(id)` method
  - _Requirements: 8.1_

- [x] 6.2 Create patientService with validation

  - Write `src/services/patientService.ts`
  - Implement `getPatientById(id)` method
  - Implement `updatePatient(id, data)` method
  - Add `validateEmail(email)` helper
  - Add `validatePhone(phone)` helper
  - _Requirements: 11.1, 11.3, 11.5_

- [ ] 6.3 Write unit tests for validation helpers

  - Test `validateEmail` with valid and invalid emails
  - Test `validatePhone` with valid and invalid Indian mobile numbers
  - _Requirements: 11.5_

- [x] 7. Implement video service

  - Create service for video consultation links
  - Add method to fetch and open video links
  - _Requirements: 13.2, 13.3_

- [x] 7.1 Create videoService

  - Write `src/services/videoService.ts`
  - Implement `getVideoLink(appointmentId)` method
  - Implement `openVideoLink(meetLink)` method to open in new tab
  - _Requirements: 13.2, 13.3_

- [x] 8. Create TypeScript type definitions

  - Define all interfaces for API data models
  - Create types for appointment, clinician, centre, patient, payment
  - _Requirements: All_

- [x] 8.1 Create comprehensive type definitions

  - Write `src/types/index.ts`
  - Define User, Clinician, Centre, Appointment, Patient interfaces
  - Define AppointmentType and AppointmentStatus enums
  - Define TimeSlot, PaymentOrder, VideoLink interfaces
  - Define APIResponse and APIError interfaces
  - _Requirements: All_

- [ ] 9. Update Step1SessionDetails with API integration

  - Replace dummy doctor data with clinician API
  - Replace dummy availability with real API calls
  - Add loading states and error handling
  - Preserve all existing animations
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.4, 10.1, 10.2, 10.3_

- [ ] 9.1 Integrate clinician data fetching

  - Add useEffect to fetch clinicians on mount
  - Call `clinicianService.getClinicians()` with centre filter
  - Add loading state with skeleton loaders
  - Add error state with retry button
  - _Requirements: 2.1, 10.1, 10.3_

- [ ] 9.2 Integrate availability fetching

  - Add useEffect to fetch availability when date/clinician changes
  - Call `appointmentService.getAvailability()`
  - Update time slot display with real data
  - Show "No slots available" message when appropriate
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 9.3 Add centre selection integration

  - Fetch centres from `centreService.getCentres()`
  - Filter clinicians by selected centre
  - Display centre details
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 9.4 Preserve existing UI and animations

  - Ensure all animations remain unchanged
  - Maintain responsive design
  - Keep loading effects as-is
  - _Requirements: 14.1, 14.2_

- [ ] 9.5 Write property test for clinician display

  - **Property 7: Complete Clinician Information Display**
  - **Validates: Requirements 2.2**
  - Generate random clinician data
  - Verify all fields are rendered in UI
  - _Requirements: 2.2_

- [ ] 10. Update Step2PhoneVerification with authentication

  - Replace dummy OTP with real API calls
  - Integrate authService for OTP send and verify
  - Store authentication tokens
  - Add proper error handling
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 10.1, 10.2_

- [ ] 10.1 Integrate OTP sending

  - Replace dummy `handleSendOtp` with `authService.sendOTP()`
  - Add phone number validation before sending
  - Add loading state during API call
  - Display error messages from API
  - _Requirements: 1.1, 10.1, 10.2_

- [ ] 10.2 Integrate OTP verification

  - Replace dummy `handleVerifyOtp` with `authService.verifyOTP()`
  - Store tokens and user data on success
  - Add patient ID to booking data
  - Handle verification errors
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 10.3 Write property test for OTP UI state

  - **Property 2: OTP Input Display After Successful Send**
  - **Validates: Requirements 1.2**
  - Simulate successful OTP send
  - Verify OTP input field is displayed
  - _Requirements: 1.2_

- [ ] 11. Update Step3ConfirmBooking with appointment creation and payment

  - Create appointment via API
  - Integrate Razorpay payment flow
  - Handle payment success and failure
  - Navigate to dashboard on success
  - _Requirements: 4.1, 4.2, 4.5, 5.1, 5.2, 5.3, 5.4, 10.1, 10.2, 12.1, 12.2, 12.3_

- [ ] 11.1 Implement appointment creation

  - Call `appointmentService.createAppointment()` with booking data
  - Construct proper ISO datetime for scheduled_start_at
  - Store appointment ID in state
  - Add loading state and error handling
  - Disable submit button after first click
  - _Requirements: 4.1, 4.2, 4.5, 10.2_

- [ ] 11.2 Integrate payment flow

  - Call `paymentService.createPaymentOrder()` after appointment creation
  - Open Razorpay checkout with order data
  - Implement `handlePaymentSuccess` callback
  - Implement `handlePaymentFailure` callback
  - _Requirements: 5.1, 5.2_

- [ ] 11.3 Handle payment verification

  - Call `paymentService.verifyPayment()` in success callback
  - Update appointment status to CONFIRMED
  - Display success message with appointment details
  - Navigate to dashboard with success state
  - _Requirements: 5.3, 5.4, 12.1, 12.2, 12.3_

- [ ] 11.4 Write property test for duplicate prevention

  - **Property 14: Duplicate Submission Prevention**
  - **Validates: Requirements 4.5**
  - Simulate button click
  - Verify button is disabled during API call
  - _Requirements: 4.5_

- [ ] 11.5 Write property test for payment status update

  - **Property 18: Appointment Status Update After Payment**
  - **Validates: Requirements 5.4**
  - Simulate successful payment verification
  - Verify appointment status becomes CONFIRMED
  - _Requirements: 5.4_

- [ ] 12. Implement PatientDashboard with appointment display

  - Fetch patient appointments from API
  - Categorize appointments as upcoming/past
  - Display appointment details
  - Add empty state for no appointments
  - _Requirements: 6.1, 6.2, 6.3, 6.5, 10.1, 10.3_

- [ ] 12.1 Create dashboard data fetching

  - Add useEffect to fetch appointments on mount
  - Call `appointmentService.getPatientAppointments()`
  - Add loading state with skeleton loaders
  - Handle authentication check
  - _Requirements: 6.1, 10.1, 10.3_

- [ ] 12.2 Implement appointment categorization

  - Create `categorizeAppointments()` function
  - Separate upcoming (future dates, not completed/cancelled)
  - Separate past (past dates or completed status)
  - _Requirements: 6.2_

- [ ] 12.3 Display appointment details

  - Render appointment cards with all details
  - Show clinician name, centre name, date, time, status, type
  - Add status badges with appropriate colors
  - Display empty state message when no appointments
  - _Requirements: 6.3_

- [ ] 12.4 Add dashboard refresh on navigation

  - Refresh appointment data when navigating to dashboard
  - Use navigation state to detect returns
  - _Requirements: 6.5_

- [ ] 12.5 Write property test for categorization

  - **Property 20: Appointment Categorization**
  - **Validates: Requirements 6.2**
  - Generate random appointments with different dates and statuses
  - Verify correct categorization into upcoming/past
  - _Requirements: 6.2_

- [ ] 12.6 Write property test for appointment details display

  - **Property 21: Complete Appointment Details Display**
  - **Validates: Requirements 6.3**
  - Generate random appointment data
  - Verify all required fields are displayed
  - _Requirements: 6.3_

- [ ] 13. Add appointment cancellation functionality

  - Add cancel button to upcoming appointments
  - Show confirmation dialog
  - Call cancellation API
  - Refresh appointment list
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 13.1 Implement cancellation UI

  - Add cancel button to appointment cards
  - Only show for BOOKED or CONFIRMED status
  - Display confirmation dialog with cancellation policy
  - _Requirements: 7.1, 7.4_

- [ ] 13.2 Integrate cancellation API

  - Call `appointmentService.cancelAppointment()` on confirmation
  - Pass cancellation reason
  - Update UI on success
  - Refresh appointment list
  - Handle errors gracefully
  - _Requirements: 7.2, 7.3_

- [ ] 13.3 Write property test for cancellation restrictions

  - **Property 26: Cancellation Status Restriction**
  - **Validates: Requirements 7.4**
  - Generate appointments with different statuses
  - Verify cancel button only enabled for BOOKED/CONFIRMED
  - _Requirements: 7.4_

- [ ] 14. Add video consultation link access

  - Display "Join Video Call" button for online appointments
  - Fetch video link from API
  - Open link in new tab
  - Show button only near appointment time
  - _Requirements: 13.1, 13.2, 13.3, 13.5_

- [ ] 14.1 Implement video call button logic

  - Check if appointment is ONLINE type
  - Check if appointment is within 15 minutes of start time
  - Check if status is CONFIRMED or BOOKED
  - Display button conditionally
  - _Requirements: 13.1, 13.5_

- [ ] 14.2 Integrate video link fetching

  - Call `videoService.getVideoLink()` on button click
  - Open link in new tab using `videoService.openVideoLink()`
  - Handle case when link is not available
  - _Requirements: 13.2, 13.3_

- [ ] 14.3 Write property test for video button display

  - **Property 45: Video Call Button for Online Appointments**
  - **Validates: Requirements 13.1**
  - Generate appointments with different types and times
  - Verify button only shows for ONLINE appointments near start time
  - _Requirements: 13.1_

- [ ] 15. Implement profile management

  - Add profile view in dashboard
  - Fetch patient data from API
  - Add profile edit functionality
  - Validate inputs before submission
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 15.1 Create profile display

  - Fetch patient data using `patientService.getPatientById()`
  - Display all profile fields (name, phone, email, DOB, gender, emergency contacts)
  - Add loading state
  - _Requirements: 11.1, 11.2_

- [ ] 15.2 Implement profile editing

  - Add edit form with all editable fields
  - Validate email and phone formats before submission
  - Call `patientService.updatePatient()` on submit
  - Display success message and refresh data
  - Handle errors
  - _Requirements: 11.3, 11.4, 11.5_

- [ ] 15.3 Write property test for profile validation

  - **Property 40: Profile Validation Before Submission**
  - **Validates: Requirements 11.5**
  - Generate random valid and invalid emails/phones
  - Verify validation prevents submission of invalid data
  - _Requirements: 11.5_

- [x] 16. Add utility functions and helpers

  - Create date formatting utilities
  - Add time helpers for appointment display
  - Create appointment time checking functions
  - _Requirements: 6.2, 13.1_

- [x] 16.1 Create date/time utilities

  - Write `src/utils/dateHelpers.ts`
  - Implement `formatDateForAPI(date)` for YYYY-MM-DD format
  - Implement `formatDateForDisplay(date)` for user-friendly format
  - Implement `formatTimeForDisplay(date)` for time display
  - Implement `isAppointmentStartingSoon(scheduledStartAt)` for 15-minute check
  - Implement `isFutureDate(date)` for categorization
  - _Requirements: 6.2, 13.1_

- [ ] 17. Add comprehensive error handling

  - Implement error display components
  - Add toast notifications for success/error messages
  - Create error boundaries for React components
  - Add fallback UI for failed data fetches
  - _Requirements: 9.1, 9.2, 9.4_

- [ ] 17.1 Create error display components

  - Create toast notification component
  - Create inline error message component
  - Create error boundary component
  - Add retry buttons for recoverable errors
  - _Requirements: 9.1, 9.2, 9.4_

- [ ] 18. Add loading states and skeletons

  - Create skeleton loaders for all data fetching
  - Add button loading spinners
  - Implement consistent loading UX
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 18.1 Create loading components

  - Create clinician card skeleton
  - Create appointment card skeleton
  - Create button spinner component
  - Apply loading states to all API calls
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 19. Configure environment variables

  - Set up .env file with API base URL
  - Add Razorpay key configuration
  - Document environment setup
  - _Requirements: All_

- [x] 19.1 Create environment configuration

  - Create `.env` file with VITE_API_BASE_URL
  - Add VITE_RAZORPAY_KEY_ID
  - Update README with setup instructions
  - _Requirements: All_

- [ ] 20. Final testing and polish

  - Test complete booking flow end-to-end
  - Test dashboard functionality
  - Test error scenarios
  - Verify all animations are preserved
  - Test on mobile devices
  - _Requirements: All_

- [ ] 20.1 Perform end-to-end testing

  - Test complete booking flow from doctor selection to payment
  - Test dashboard with different appointment states
  - Test cancellation flow
  - Test video link access
  - Test profile management
  - _Requirements: All_

- [ ] 20.2 Test error scenarios

  - Test with network failures
  - Test with API errors (400, 401, 500)
  - Test with invalid inputs
  - Test payment failures
  - Verify error messages are user-friendly
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 20.3 Verify UI preservation

  - Confirm all animations work as before
  - Verify responsive design on mobile
  - Check loading effects are unchanged
  - Test touch targets on mobile (44x44px minimum)
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 21. Checkpoint - Ensure all tests pass, ask the user if questions arise
