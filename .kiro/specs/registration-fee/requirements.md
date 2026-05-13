# Requirements Document: One-Time Registration Fee

## Introduction

This document specifies the requirements for implementing a one-time registration fee of INR 100 for new patients booking their first appointment in the MIBO healthcare booking system. The registration fee will be automatically added to the consultation fee for first-time bookings only, ensuring proper patient classification and accurate payment tracking across both website and admin panel booking flows.

## Glossary

- **System**: The MIBO healthcare booking and payment system
- **New_Patient**: A patient who has never completed a paid appointment (no payment records with status = 'SUCCESS')
- **Existing_Patient**: A patient who has at least one completed paid appointment (at least one payment record with status = 'SUCCESS')
- **Registration_Fee**: A one-time fee of INR 100 charged to new patients
- **Consultation_Fee**: The clinician's standard consultation fee
- **Total_Amount**: The sum of Consultation_Fee and Registration_Fee (for new patients) or just Consultation_Fee (for existing patients)
- **Payment_Record**: A record in the payments table tracking payment details
- **Appointment**: A scheduled consultation between a patient and clinician
- **Website_Booking**: Patient self-booking through the mibo_version-2 frontend application
- **Admin_Booking**: Staff-initiated booking through the mibo-admin panel
- **Payment_Status**: The status of a payment (CREATED, PENDING, SUCCESS, FAILED)

## Requirements

### Requirement 1: Patient Classification

**User Story:** As the system, I want to accurately classify patients as new or existing, so that the registration fee is applied correctly.

#### Acceptance Criteria

1. WHEN checking if a patient is new, THE System SHALL query the payments table for any payment records with patient_id matching the patient and status = 'SUCCESS'
2. WHEN a patient has zero payment records with status = 'SUCCESS', THE System SHALL classify the patient as a New_Patient
3. WHEN a patient has one or more payment records with status = 'SUCCESS', THE System SHALL classify the patient as an Existing_Patient
4. WHEN multiple concurrent booking requests occur for the same New_Patient, THE System SHALL ensure only the first successful payment includes the Registration_Fee

### Requirement 2: Registration Fee Calculation

**User Story:** As the system, I want to calculate the correct total amount based on patient classification, so that new patients are charged the registration fee exactly once.

#### Acceptance Criteria

1. WHEN a New_Patient creates an appointment, THE System SHALL calculate Total_Amount as Consultation_Fee + Registration_Fee
2. WHEN an Existing_Patient creates an appointment, THE System SHALL calculate Total_Amount as Consultation_Fee only
3. THE Registration_Fee SHALL be exactly 100 INR
4. WHEN storing a payment record for a New_Patient, THE System SHALL include a registration_fee field with value 100
5. WHEN storing a payment record for an Existing_Patient, THE System SHALL include a registration_fee field with value 0

### Requirement 3: Payment Record Tracking

**User Story:** As a system administrator, I want payment records to clearly show the registration fee breakdown, so that I can track and audit registration fee collection.

#### Acceptance Criteria

1. THE Payment_Record SHALL include a registration_fee field storing the registration fee amount
2. THE Payment_Record SHALL include a consultation_fee field storing the consultation fee amount
3. THE Payment_Record amount field SHALL equal consultation_fee + registration_fee
4. WHEN querying payment details, THE System SHALL return both consultation_fee and registration_fee separately
5. WHEN generating payment reports, THE System SHALL include registration_fee as a separate line item

### Requirement 4: Website Booking Flow

**User Story:** As a patient booking through the website, I want to see a clear breakdown of fees, so that I understand what I'm paying for.

#### Acceptance Criteria

1. WHEN a New_Patient reaches the payment screen, THE System SHALL display the Consultation_Fee, Registration_Fee, and Total_Amount separately
2. WHEN an Existing_Patient reaches the payment screen, THE System SHALL display only the Consultation_Fee as the Total_Amount
3. WHEN creating a Razorpay order for a New_Patient, THE System SHALL use the Total_Amount (including Registration_Fee)
4. WHEN a New_Patient completes payment successfully, THE System SHALL store the payment record with registration_fee = 100
5. WHEN payment verification succeeds, THE System SHALL update the appointment status to CONFIRMED

### Requirement 5: Admin Panel Booking Flow

**User Story:** As front desk staff booking through the admin panel, I want to see the registration fee automatically calculated, so that I can inform patients of the correct amount.

#### Acceptance Criteria

1. WHEN staff creates an appointment for a New_Patient, THE System SHALL display the Total_Amount including Registration_Fee
2. WHEN staff creates an appointment for an Existing_Patient, THE System SHALL display only the Consultation_Fee
3. WHEN staff sends a payment link for a New_Patient appointment, THE System SHALL include the Registration_Fee in the payment link amount
4. WHEN staff views appointment details, THE System SHALL show the fee breakdown including registration_fee if applicable
5. WHEN staff searches for a patient by phone, THE System SHALL indicate whether the patient is new or existing

### Requirement 6: Database Schema Changes

**User Story:** As a developer, I want the database schema to support registration fee tracking, so that the system can store and retrieve fee breakdowns accurately.

#### Acceptance Criteria

1. THE payments table SHALL include a registration_fee column of type INTEGER with default value 0
2. THE payments table SHALL include a consultation_fee column of type INTEGER storing the clinician's fee
3. WHEN inserting a new payment record, THE System SHALL populate both registration_fee and consultation_fee fields
4. THE System SHALL maintain backward compatibility with existing payment records by treating NULL registration_fee as 0
5. WHEN querying payment records, THE System SHALL return registration_fee, consultation_fee, and amount fields

### Requirement 7: API Endpoint Changes

**User Story:** As a frontend developer, I want API endpoints to return registration fee information, so that I can display accurate fee breakdowns to users.

#### Acceptance Criteria

1. WHEN calling the create payment order endpoint, THE System SHALL return an object containing consultation_fee, registration_fee, and total_amount
2. WHEN calling the get appointment details endpoint, THE System SHALL include payment breakdown with registration_fee if a payment exists
3. WHEN calling the book appointment for patient endpoint (admin), THE System SHALL return whether registration_fee applies and the total amount
4. THE System SHALL provide an endpoint to check if a patient is new or existing given a patient_id or phone number
5. WHEN payment verification succeeds, THE System SHALL return the complete payment breakdown including registration_fee

### Requirement 8: Edge Case Handling

**User Story:** As a system architect, I want the system to handle edge cases correctly, so that registration fees are applied fairly and consistently.

#### Acceptance Criteria

1. WHEN a New_Patient creates multiple appointments before paying, THE System SHALL apply Registration_Fee only to the first appointment that receives a successful payment
2. WHEN a New_Patient's first payment fails, THE System SHALL continue to classify the patient as New_Patient for subsequent booking attempts
3. WHEN a New_Patient cancels their first appointment before payment, THE System SHALL still classify them as New_Patient for the next booking
4. WHEN staff manually creates a patient record, THE System SHALL classify them as New_Patient until they complete their first paid appointment
5. IF a payment record exists with status = 'CREATED' or 'PENDING' but not 'SUCCESS', THE System SHALL still classify the patient as New_Patient

### Requirement 9: Backward Compatibility

**User Story:** As a system administrator, I want existing functionality to continue working without disruption, so that current users are not affected by the registration fee implementation.

#### Acceptance Criteria

1. WHEN querying existing payment records without registration_fee column data, THE System SHALL treat the registration_fee as 0
2. WHEN displaying payment history for Existing_Patients, THE System SHALL show registration_fee = 0 for all their payments
3. THE System SHALL continue to support all existing payment API endpoints without breaking changes
4. WHEN existing patients book new appointments, THE System SHALL not charge them a Registration_Fee
5. THE System SHALL maintain all existing payment verification and webhook handling logic

### Requirement 10: Testing and Validation

**User Story:** As a QA engineer, I want comprehensive test coverage for the registration fee feature, so that I can verify correct behavior across all scenarios.

#### Acceptance Criteria

1. THE System SHALL correctly identify a patient with zero successful payments as New_Patient
2. THE System SHALL correctly identify a patient with one or more successful payments as Existing_Patient
3. WHEN a New_Patient completes their first payment, THE System SHALL charge Consultation_Fee + 100 INR
4. WHEN an Existing_Patient books an appointment, THE System SHALL charge only the Consultation_Fee
5. WHEN concurrent bookings occur for the same New_Patient, THE System SHALL ensure only one payment includes the Registration_Fee
