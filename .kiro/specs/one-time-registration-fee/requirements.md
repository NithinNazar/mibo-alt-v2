# Requirements Document

## Introduction

This document specifies the requirements for implementing a one-time registration fee feature in the healthcare appointment booking system. The feature differentiates between new patients (booking their first appointment) and existing patients (who have already completed at least one paid appointment), charging a one-time registration fee of INR 100 to new patients only.

## Glossary

- **Patient**: A user with user_type 'PATIENT' who books appointments with clinicians
- **New_Patient**: A patient who has never completed a successful payment for any appointment
- **Existing_Patient**: A patient who has completed at least one successful payment for an appointment
- **Registration_Fee**: A one-time fee of INR 100 charged to new patients on their first appointment booking
- **Consultation_Fee**: The fee charged by a clinician for an appointment consultation
- **Total_Amount**: The sum of consultation fee and registration fee (for new patients) or consultation fee only (for existing patients)
- **Booking_System**: The appointment booking system accessible via website and admin panel
- **Payment_System**: The system that processes payments for appointments
- **Patient_Status_Tracker**: The component that determines if a patient is new or existing based on payment history

## Requirements

### Requirement 1: Patient Status Determination

**User Story:** As the system, I want to accurately determine if a patient is new or existing, so that the correct fees are applied during appointment booking.

#### Acceptance Criteria

1. THE Patient_Status_Tracker SHALL classify a patient as New_Patient IF no successful payment records exist for that patient
2. THE Patient_Status_Tracker SHALL classify a patient as Existing_Patient IF at least one successful payment record exists for that patient
3. WHEN checking patient status, THE Patient_Status_Tracker SHALL query the payments table for records with status 'COMPLETED' or 'SUCCESS' associated with the patient ID
4. THE Patient_Status_Tracker SHALL return patient status within 200 milliseconds for 95% of requests

### Requirement 2: Registration Fee Application

**User Story:** As a new patient, I want to be charged a one-time registration fee on my first appointment, so that I can register with the healthcare system.

#### Acceptance Criteria

1. WHEN a New_Patient books an appointment, THE Booking_System SHALL add the Registration_Fee to the Consultation_Fee to calculate the Total_Amount
2. WHEN an Existing_Patient books an appointment, THE Booking_System SHALL use only the Consultation_Fee as the Total_Amount
3. THE Booking_System SHALL apply the Registration_Fee value of INR 100 for all new patient bookings
4. THE Booking_System SHALL apply the Registration_Fee regardless of booking channel (website or admin panel)
5. THE Booking_System SHALL apply the Registration_Fee regardless of appointment type (in-person, video, or other consultation modes)

### Requirement 3: Registration Fee Configuration

**User Story:** As a system administrator, I want to configure the registration fee amount, so that I can adjust pricing without code changes.

#### Acceptance Criteria

1. THE Booking_System SHALL retrieve the Registration_Fee amount from a configuration table or environment variable
2. WHERE the registration fee configuration is missing, THE Booking_System SHALL use a default value of INR 100
3. WHEN the registration fee configuration is updated, THE Booking_System SHALL apply the new amount to subsequent bookings without requiring system restart
4. THE Booking_System SHALL validate that the configured registration fee is a non-negative integer value

### Requirement 4: Payment Amount Display

**User Story:** As a patient, I want to see a clear breakdown of fees before payment, so that I understand what I am being charged.

#### Acceptance Criteria

1. WHEN displaying payment details to a New_Patient, THE Booking_System SHALL show the Consultation_Fee, Registration_Fee, and Total_Amount as separate line items
2. WHEN displaying payment details to an Existing_Patient, THE Booking_System SHALL show only the Consultation_Fee as the Total_Amount
3. THE Booking_System SHALL label the Registration_Fee as "One-time Registration Fee" in the payment breakdown
4. THE Booking_System SHALL display all amounts in INR currency format with the rupee symbol (₹)

### Requirement 5: Patient Status Transition

**User Story:** As the system, I want to automatically mark a patient as existing after their first successful payment, so that they are not charged the registration fee again.

#### Acceptance Criteria

1. WHEN a payment for a New_Patient transitions to 'COMPLETED' or 'SUCCESS' status, THE Payment_System SHALL mark that patient as Existing_Patient
2. THE Payment_System SHALL ensure the patient status transition occurs within the same database transaction as the payment status update
3. IF a payment fails or is cancelled, THEN THE Payment_System SHALL NOT change the patient status from New_Patient to Existing_Patient
4. THE Payment_System SHALL maintain an audit trail of when a patient transitioned from New_Patient to Existing_Patient

### Requirement 6: Edge Case Handling - Concurrent Bookings

**User Story:** As the system, I want to handle concurrent booking attempts by the same new patient correctly, so that the registration fee is charged only once.

#### Acceptance Criteria

1. WHEN a New_Patient creates multiple concurrent appointment bookings, THE Booking_System SHALL apply the Registration_Fee to only the first booking that reaches payment processing
2. THE Booking_System SHALL use database row-level locking or optimistic locking to prevent race conditions in patient status determination
3. IF multiple bookings for a New_Patient are created simultaneously, THEN THE Booking_System SHALL ensure only one booking includes the Registration_Fee

### Requirement 7: Edge Case Handling - Failed Payments

**User Story:** As a new patient, I want to be charged the registration fee again if my first payment fails, so that I can complete registration when I retry.

#### Acceptance Criteria

1. WHEN a New_Patient's payment fails with status 'FAILED', 'CANCELLED', or 'EXPIRED', THE Booking_System SHALL continue to classify that patient as New_Patient
2. WHEN a New_Patient rebooks after a failed payment, THE Booking_System SHALL include the Registration_Fee in the new booking
3. THE Booking_System SHALL not count failed, cancelled, or expired payments when determining patient status

### Requirement 8: Backward Compatibility

**User Story:** As a system maintainer, I want the registration fee feature to work with existing frontend and admin panel code, so that deployment is seamless.

#### Acceptance Criteria

1. THE Booking_System SHALL maintain existing API response structures with the addition of optional registration fee fields
2. THE Booking_System SHALL not break existing appointment booking flows in the website (mibo_version-2) or admin panel
3. WHERE existing code does not display registration fee breakdown, THE Booking_System SHALL still calculate and apply the correct Total_Amount
4. THE Booking_System SHALL provide registration fee information in API responses in a format compatible with existing payment display components

### Requirement 9: Database Schema Requirements

**User Story:** As a developer, I want to track patient registration status efficiently, so that the system performs well at scale.

#### Acceptance Criteria

1. THE Booking_System SHALL add a boolean field 'has_paid_registration_fee' to the patient_profiles table to track registration status
2. THE Booking_System SHALL create a database index on the 'has_paid_registration_fee' field for query performance
3. THE Booking_System SHALL default the 'has_paid_registration_fee' field to FALSE for new patient records
4. WHEN a patient completes their first successful payment, THE Payment_System SHALL set 'has_paid_registration_fee' to TRUE

### Requirement 10: Reporting and Analytics

**User Story:** As a business analyst, I want to track registration fee revenue separately, so that I can analyze new patient acquisition costs.

#### Acceptance Criteria

1. THE Payment_System SHALL store the Registration_Fee amount as a separate field in the payments table
2. THE Payment_System SHALL record a value of 0 for the registration fee field when an Existing_Patient makes a payment
3. THE Payment_System SHALL enable filtering and aggregation of registration fee revenue in reporting queries
4. THE Payment_System SHALL maintain historical accuracy of registration fees even if the configured amount changes

### Requirement 11: Migration Strategy for Existing Patients

**User Story:** As a system administrator, I want all existing patients in the database to be marked as having paid the registration fee, so that they are not charged again after the feature is deployed.

#### Acceptance Criteria

1. WHEN the feature is deployed, THE Booking_System SHALL execute a one-time migration to mark all existing patients with at least one completed payment as Existing_Patient
2. THE Booking_System SHALL set 'has_paid_registration_fee' to TRUE for all patient records that have associated payment records with status 'COMPLETED' or 'SUCCESS'
3. THE Booking_System SHALL set 'has_paid_registration_fee' to FALSE for all patient records with no successful payment history
4. THE migration SHALL complete within 5 minutes for databases with up to 100,000 patient records
