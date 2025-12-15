# Requirements Document

## Introduction

This document outlines the requirements for updating the patient-facing booking flow and dashboard of the Mibo Mental Health website to integrate with the existing backend API and admin panel. The current implementation uses dummy data and needs to be connected to the production backend built with Express.js, TypeScript, and PostgreSQL. The integration will enable real patient authentication, live doctor availability, actual appointment booking, payment processing via Razorpay, and a functional patient dashboard showing real appointment data.

## Glossary

- **Patient_Booking_Flow**: The multi-step wizard interface where patients book appointments (session details, phone verification, confirmation, payment)
- **Patient_Dashboard**: The authenticated patient's personal area showing their appointments, profile, and booking history
- **Backend_API**: The Express.js REST API at `http://localhost:5000/api` that handles all data operations
- **API_Service**: TypeScript service layer that wraps API calls with proper error handling and type safety
- **Authentication_Token**: JWT token stored in localStorage after successful patient login/registration
- **Appointment_Status**: The state of an appointment (BOOKED, CONFIRMED, RESCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- **Session_Mode**: The consultation format (IN_PERSON, ONLINE, INPATIENT_ASSESSMENT, FOLLOW_UP)
- **Centre**: A physical Mibo hospital location (Bangalore, Mumbai, Kochi)
- **Clinician**: A mental health professional (doctor/therapist) available for appointments
- **Time_Slot**: A specific available time period for booking with a clinician
- **Payment_Gateway**: Razorpay integration for processing appointment payments
- **OTP_Verification**: One-time password sent via SMS for phone-based authentication
- **Availability_Rule**: Doctor's schedule defining when they are available at specific centres

## Requirements

### Requirement 1: Patient Authentication Integration

**User Story:** As a patient, I want to register and log in using my phone number with OTP verification, so that I can securely access my appointments and profile.

#### Acceptance Criteria

1. WHEN a patient enters their phone number in the booking flow, THE Patient_Booking_Flow SHALL send an OTP request to the Backend_API endpoint `/auth/send-otp`
2. WHEN the Backend_API successfully sends an OTP, THE Patient_Booking_Flow SHALL display an OTP input field and wait for the 6-digit code
3. WHEN a patient enters a valid OTP within 10 minutes, THE Patient_Booking_Flow SHALL call `/auth/login/phone-otp` and receive an Authentication_Token
4. WHEN authentication succeeds, THE Patient_Booking_Flow SHALL store the Authentication_Token and user data in localStorage
5. WHEN a patient returns to the site with a valid token, THE Patient_Dashboard SHALL automatically authenticate them without requiring re-login

### Requirement 2: Live Doctor Data Integration

**User Story:** As a patient, I want to see real doctor profiles with accurate information, so that I can make informed decisions about my care provider.

#### Acceptance Criteria

1. WHEN the booking flow loads, THE Patient_Booking_Flow SHALL fetch clinician data from `/clinicians` endpoint with proper error handling
2. THE Patient_Booking_Flow SHALL display clinician information including name, specialization, experience_years, consultation_fee, and bio
3. WHEN filtering by centre, THE Patient_Booking_Flow SHALL only show clinicians associated with the selected Centre
4. WHEN a clinician's data is unavailable, THE Patient_Booking_Flow SHALL display a fallback message and allow retry
5. THE Patient_Booking_Flow SHALL cache clinician data for 5 minutes to reduce API calls

### Requirement 3: Real-Time Availability Integration

**User Story:** As a patient, I want to see actual available time slots for doctors, so that I can book appointments at times that work for both of us.

#### Acceptance Criteria

1. WHEN a patient selects a clinician and date, THE Patient_Booking_Flow SHALL fetch availability from `/appointments/availability` endpoint
2. THE Patient_Booking_Flow SHALL display only Time_Slots that are marked as available in the API response
3. WHEN no slots are available for a selected date, THE Patient_Booking_Flow SHALL show a message indicating unavailability
4. THE Patient_Booking_Flow SHALL refresh availability data when the patient changes the selected date or clinician
5. WHEN a slot is selected, THE Patient_Booking_Flow SHALL hold that slot temporarily until booking is confirmed or 10 minutes elapse

### Requirement 4: Appointment Creation Integration

**User Story:** As a patient, I want to create appointments through the booking flow, so that my bookings are recorded in the system and visible to staff.

#### Acceptance Criteria

1. WHEN a patient completes all booking steps, THE Patient_Booking_Flow SHALL call `/appointments` POST endpoint with complete appointment data
2. THE Patient_Booking_Flow SHALL include patient_id, clinician_id, centre_id, appointment_type, scheduled_start_at, and duration_minutes in the request
3. WHEN the appointment is successfully created, THE Backend_API SHALL return the appointment ID and confirmation details
4. WHEN appointment creation fails, THE Patient_Booking_Flow SHALL display the error message from the API and allow retry
5. THE Patient_Booking_Flow SHALL prevent duplicate submissions by disabling the submit button after the first click

### Requirement 5: Payment Integration with Razorpay

**User Story:** As a patient, I want to pay for appointments securely online, so that I can complete my booking without visiting the hospital.

#### Acceptance Criteria

1. WHEN a patient confirms booking details, THE Patient_Booking_Flow SHALL call `/payments/create-order` to generate a Razorpay payment order
2. THE Patient_Booking_Flow SHALL open the Razorpay checkout modal with the order details and consultation fee
3. WHEN payment succeeds, THE Patient_Booking_Flow SHALL call `/payments/verify` with payment signature to confirm the transaction
4. WHEN payment verification succeeds, THE Patient_Booking_Flow SHALL update the appointment status to CONFIRMED
5. WHEN payment fails or is cancelled, THE Patient_Booking_Flow SHALL release the held time slot and display an appropriate error message

### Requirement 6: Patient Dashboard Implementation

**User Story:** As a patient, I want to view my upcoming and past appointments in a dashboard, so that I can manage my mental health care schedule.

#### Acceptance Criteria

1. WHEN an authenticated patient navigates to the dashboard, THE Patient_Dashboard SHALL fetch appointments from `/patients/:id/appointments` endpoint
2. THE Patient_Dashboard SHALL display appointments categorized as "Upcoming" (future dates) and "Past" (completed or past dates)
3. THE Patient_Dashboard SHALL show appointment details including clinician name, centre name, date, time, status, and appointment type
4. WHEN no appointments exist, THE Patient_Dashboard SHALL display a friendly message encouraging the patient to book their first session
5. THE Patient_Dashboard SHALL refresh appointment data when the patient navigates back to the dashboard from other pages

### Requirement 7: Appointment Cancellation

**User Story:** As a patient, I want to cancel my upcoming appointments, so that I can manage changes in my schedule.

#### Acceptance Criteria

1. WHEN a patient clicks cancel on an upcoming appointment, THE Patient_Dashboard SHALL display a confirmation dialog with cancellation policy
2. WHEN cancellation is confirmed, THE Patient_Dashboard SHALL call `/appointments/:id` DELETE endpoint with a cancellation reason
3. WHEN cancellation succeeds, THE Patient_Dashboard SHALL update the appointment status to CANCELLED and refresh the list
4. THE Patient_Dashboard SHALL only allow cancellation of appointments with status BOOKED or CONFIRMED
5. WHEN cancellation fails, THE Patient_Dashboard SHALL display the error message and keep the appointment unchanged

### Requirement 8: Centre Selection Integration

**User Story:** As a patient, I want to select from available hospital centres, so that I can book appointments at a convenient location.

#### Acceptance Criteria

1. WHEN the booking flow loads, THE Patient_Booking_Flow SHALL fetch centre data from `/centres` endpoint
2. THE Patient_Booking_Flow SHALL display centres with their name, city, address, and contact information
3. WHEN a patient selects a centre, THE Patient_Booking_Flow SHALL filter clinicians to show only those available at that Centre
4. THE Patient_Booking_Flow SHALL display centre details in the booking confirmation step
5. WHEN centre data is unavailable, THE Patient_Booking_Flow SHALL use fallback data for Bangalore, Mumbai, and Kochi

### Requirement 9: API Error Handling and User Feedback

**User Story:** As a patient, I want clear feedback when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN any API call fails with a network error, THE Patient_Booking_Flow SHALL display a user-friendly message indicating connection issues
2. WHEN the API returns a 400 error, THE Patient_Booking_Flow SHALL display the specific validation error messages from the response
3. WHEN the API returns a 401 error, THE Patient_Booking_Flow SHALL clear the stored token and redirect to the login step
4. WHEN the API returns a 500 error, THE Patient_Booking_Flow SHALL display a generic error message and log the full error for debugging
5. THE Patient_Booking_Flow SHALL implement a retry mechanism with exponential backoff for failed API calls

### Requirement 10: Loading States and User Experience

**User Story:** As a patient, I want to see loading indicators during API operations, so that I know the system is working and not frozen.

#### Acceptance Criteria

1. WHEN any API call is in progress, THE Patient_Booking_Flow SHALL display a loading spinner or skeleton screen
2. THE Patient_Booking_Flow SHALL disable form submission buttons while API calls are pending
3. WHEN data is being fetched, THE Patient_Booking_Flow SHALL show placeholder content that matches the expected layout
4. THE Patient_Booking_Flow SHALL implement a timeout of 30 seconds for API calls and show an error if exceeded
5. WHEN transitioning between booking steps, THE Patient_Booking_Flow SHALL show smooth animations without blocking user interaction

### Requirement 11: Profile Management Integration

**User Story:** As a patient, I want to view and update my profile information, so that my contact details and preferences are current.

#### Acceptance Criteria

1. WHEN a patient accesses their profile, THE Patient_Dashboard SHALL fetch patient data from `/patients/:id` endpoint
2. THE Patient_Dashboard SHALL display patient information including full_name, phone, email, date_of_birth, gender, and emergency contacts
3. WHEN a patient updates their profile, THE Patient_Dashboard SHALL call `/patients/:id` PUT endpoint with the updated data
4. WHEN profile update succeeds, THE Patient_Dashboard SHALL display a success message and refresh the displayed data
5. THE Patient_Dashboard SHALL validate email format and phone number format before submitting updates

### Requirement 12: Notification Display Integration

**User Story:** As a patient, I want to see confirmation messages after booking, so that I know my appointment is scheduled.

#### Acceptance Criteria

1. WHEN an appointment is successfully created, THE Patient_Booking_Flow SHALL display a success message with appointment details
2. THE Patient_Booking_Flow SHALL show the appointment date, time, clinician name, and centre address in the confirmation
3. WHEN payment is completed, THE Patient_Booking_Flow SHALL display the transaction ID and payment amount
4. THE Patient_Booking_Flow SHALL provide a button to view the appointment in the Patient_Dashboard
5. THE Patient_Booking_Flow SHALL display a message indicating that SMS and email confirmations will be sent

### Requirement 13: Video Consultation Link Access

**User Story:** As a patient with an online appointment, I want to access my video consultation link, so that I can join my session at the scheduled time.

#### Acceptance Criteria

1. WHEN a patient has an ONLINE appointment, THE Patient_Dashboard SHALL display a "Join Video Call" button for appointments within 15 minutes of start time
2. WHEN the button is clicked, THE Patient_Dashboard SHALL fetch the video link from `/video/:appointmentId` endpoint
3. THE Patient_Dashboard SHALL open the Google Meet link in a new tab when available
4. WHEN the video link is not yet available, THE Patient_Dashboard SHALL display a message indicating when it will be accessible
5. THE Patient_Dashboard SHALL only show the video link button for appointments with status CONFIRMED or BOOKED

### Requirement 14: Responsive Design Preservation

**User Story:** As a patient using a mobile device, I want the booking flow and dashboard to work smoothly, so that I can book appointments on any device.

#### Acceptance Criteria

1. THE Patient_Booking_Flow SHALL maintain all existing animations and loading effects without modification
2. THE Patient_Booking_Flow SHALL preserve the current responsive layout and mobile-first design
3. THE Patient_Dashboard SHALL adapt to different screen sizes while maintaining readability
4. THE Patient_Booking_Flow SHALL ensure touch targets are at least 44x44 pixels for mobile usability
5. THE Patient_Booking_Flow SHALL test all API integrations on mobile devices to ensure proper functionality

### Requirement 15: Code Documentation and Comments

**User Story:** As a developer maintaining the codebase, I want comprehensive comments on API implementations, so that I can understand and modify the integration easily.

#### Acceptance Criteria

1. THE API_Service SHALL include JSDoc comments for all service methods describing parameters, return types, and error conditions
2. THE Patient_Booking_Flow SHALL include inline comments explaining API call sequences and data transformations
3. THE API_Service SHALL document all API endpoints used with their HTTP methods and expected responses
4. THE Patient_Booking_Flow SHALL include comments explaining error handling strategies for each API call
5. THE API_Service SHALL include example usage comments for complex API interactions like payment flow
