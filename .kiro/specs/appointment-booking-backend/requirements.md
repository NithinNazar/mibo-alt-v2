# Requirements Document

## Introduction

This document outlines the requirements for building a comprehensive backend system and database for a mental hospital chain appointment booking platform in India. The system will replace the current dummy data implementation with a production-ready backend that handles patient authentication, doctor management, appointment scheduling, and payment processing. The backend will be built using Express.js with TypeScript, PostgreSQL database, and JWT-based authentication. It will serve a React TypeScript frontend and support multiple hospital locations across India (Bangalore, Mumbai, Kochi).

## Glossary

- **Backend_System**: The server-side application that processes API requests, manages business logic, and interfaces with the database
- **Database**: The persistent data storage system that stores all application data including patients, doctors, appointments, and transactions
- **Patient**: A user who books appointments and receives mental health services
- **Doctor**: A mental health professional (psychiatrist, psychologist, therapist) who provides consultations
- **Appointment**: A scheduled session between a patient and a doctor at a specific date, time, and location
- **Session_Mode**: The format of consultation (in-person, video call, or phone call)
- **Booking_Flow**: The multi-step process for creating an appointment (session details, phone verification, confirmation, payment)
- **Authentication_Service**: The component that handles patient login via email/password or phone OTP
- **Payment_Gateway**: The external service integration for processing appointment payments
- **API**: Application Programming Interface endpoints that the frontend uses to communicate with the backend
- **Centre**: A physical hospital location (Bangalore, Mumbai, or Kochi)
- **Availability_Slot**: A specific time period when a doctor is available for appointments
- **OTP**: One-Time Password sent via SMS for phone-based authentication

## Requirements

### Requirement 1: Patient Authentication and Profile Management

**User Story:** As a patient, I want to securely register and log in to the platform, so that I can book appointments and manage my profile.

#### Acceptance Criteria

1. WHEN a patient provides valid email and password credentials, THE Authentication_Service SHALL create a new account or authenticate an existing account
2. WHEN a patient requests phone-based authentication, THE Authentication_Service SHALL send a 6-digit OTP to the provided phone number within 30 seconds
3. WHEN a patient enters a valid OTP within 5 minutes of generation, THE Authentication_Service SHALL authenticate the patient and create a session token
4. WHEN a patient successfully authenticates, THE Backend_System SHALL return a JWT token valid for 7 days
5. WHEN an authenticated patient requests their profile, THE Backend_System SHALL return complete patient information including name, email, phone, and appointment history

### Requirement 2: Doctor Profile and Availability Management

**User Story:** As a system administrator, I want to manage doctor profiles and their availability schedules, so that patients can view accurate information and book available slots.

#### Acceptance Criteria

1. THE Backend_System SHALL store doctor profiles including name, qualification, designation, experience, expertise areas, location, languages, and pricing
2. WHEN a request is made for doctors list, THE Backend_System SHALL return all active doctors with their complete profile information within 2 seconds
3. WHEN a doctor's availability is queried for a specific date range, THE Backend_System SHALL return all available time slots grouped by date and session mode
4. THE Backend_System SHALL support filtering doctors by location, expertise area, language, and price range
5. WHEN an appointment is booked, THE Backend_System SHALL mark the corresponding availability slot as unavailable for other patients

### Requirement 3: Appointment Booking and Management

**User Story:** As a patient, I want to book appointments with doctors at my preferred time and mode, so that I can receive mental health consultations.

#### Acceptance Criteria

1. WHEN a patient selects a doctor, date, time, and session mode, THE Backend_System SHALL create a pending appointment record
2. WHEN a patient completes phone verification during booking, THE Backend_System SHALL update the appointment with verified contact information
3. WHEN a patient confirms booking details, THE Backend_System SHALL initiate payment processing and hold the time slot for 10 minutes
4. WHEN payment is successfully completed, THE Backend_System SHALL confirm the appointment and send confirmation notifications
5. THE Backend_System SHALL prevent double-booking by ensuring each time slot can only be booked by one patient

### Requirement 4: Payment Processing Integration

**User Story:** As a patient, I want to securely pay for appointments online, so that I can complete my booking without visiting the hospital.

#### Acceptance Criteria

1. WHEN a patient initiates payment, THE Backend_System SHALL create a payment order with the Payment_Gateway including appointment details and amount
2. WHEN the Payment_Gateway returns a successful payment response, THE Backend_System SHALL update the appointment status to confirmed within 5 seconds
3. WHEN a payment fails or is cancelled, THE Backend_System SHALL release the held time slot and update appointment status to cancelled
4. THE Backend_System SHALL store payment transaction records including transaction ID, amount, timestamp, and status
5. WHEN a patient requests payment history, THE Backend_System SHALL return all transaction records associated with their account

### Requirement 5: Appointment History and Dashboard

**User Story:** As a patient, I want to view my past and upcoming appointments, so that I can track my mental health journey and manage my schedule.

#### Acceptance Criteria

1. WHEN an authenticated patient requests their dashboard, THE Backend_System SHALL return upcoming appointments sorted by date and time
2. THE Backend_System SHALL return appointment details including doctor name, date, time, location, session mode, and status
3. WHEN a patient requests appointment history, THE Backend_System SHALL return all past appointments with completion status
4. THE Backend_System SHALL support filtering appointments by status (upcoming, completed, cancelled)
5. WHEN a patient cancels an upcoming appointment at least 24 hours in advance, THE Backend_System SHALL update the status and release the time slot

### Requirement 6: Centre and Location Management

**User Story:** As a system administrator, I want to manage hospital centres and their details, so that patients can book appointments at the correct locations.

#### Acceptance Criteria

1. THE Backend_System SHALL store centre information including name, address, contact details, and operating hours for Bangalore, Mumbai, and Kochi
2. WHEN a patient requests centre information, THE Backend_System SHALL return complete details for all active centres
3. THE Backend_System SHALL associate doctors with specific centres where they practice
4. WHEN filtering doctors by location, THE Backend_System SHALL return only doctors available at the selected centre
5. THE Backend_System SHALL support multiple session modes per centre (in-person sessions require physical centre, video and phone calls do not)

### Requirement 7: Notification System

**User Story:** As a patient, I want to receive notifications about my appointments, so that I don't miss scheduled sessions.

#### Acceptance Criteria

1. WHEN an appointment is confirmed, THE Backend_System SHALL send a confirmation notification via SMS and email within 2 minutes
2. THE Backend_System SHALL send a reminder notification 24 hours before the scheduled appointment time
3. WHEN an appointment is cancelled or rescheduled, THE Backend_System SHALL send an update notification immediately
4. THE Backend_System SHALL store notification delivery status and timestamps
5. WHEN a notification fails to deliver, THE Backend_System SHALL retry up to 3 times with exponential backoff

### Requirement 8: API Security and Rate Limiting

**User Story:** As a system administrator, I want the API to be secure and protected from abuse, so that patient data remains safe and the system remains available.

#### Acceptance Criteria

1. THE Backend_System SHALL validate JWT tokens for all protected endpoints and reject requests with invalid or expired tokens
2. THE Backend_System SHALL implement rate limiting of 100 requests per minute per IP address for public endpoints
3. WHEN a rate limit is exceeded, THE Backend_System SHALL return HTTP 429 status code with retry-after header
4. THE Backend_System SHALL encrypt sensitive data including passwords and payment information at rest
5. THE Backend_System SHALL log all authentication attempts and flag suspicious activity patterns

### Requirement 9: Data Validation and Error Handling

**User Story:** As a developer, I want comprehensive data validation and error handling, so that the system provides clear feedback and maintains data integrity.

#### Acceptance Criteria

1. THE Backend_System SHALL validate all incoming request data against defined schemas before processing
2. WHEN validation fails, THE Backend_System SHALL return HTTP 400 status with specific error messages indicating which fields are invalid
3. THE Backend_System SHALL handle database connection failures gracefully and return HTTP 503 status with retry guidance
4. WHEN an unexpected error occurs, THE Backend_System SHALL log the full error details and return a generic HTTP 500 response without exposing internal details
5. THE Backend_System SHALL validate phone numbers against Indian mobile number format (10 digits starting with 6-9)

### Requirement 10: Search and Filter Capabilities

**User Story:** As a patient, I want to search and filter doctors based on my needs, so that I can find the most suitable mental health professional.

#### Acceptance Criteria

1. WHEN a patient searches by expertise area, THE Backend_System SHALL return doctors whose expertise list contains the search term
2. THE Backend_System SHALL support filtering by multiple criteria simultaneously (location, language, price range, expertise)
3. WHEN a patient filters by price range, THE Backend_System SHALL return doctors whose session prices fall within the specified range
4. THE Backend_System SHALL support sorting results by experience, price, or availability
5. WHEN no doctors match the filter criteria, THE Backend_System SHALL return an empty list with HTTP 200 status
