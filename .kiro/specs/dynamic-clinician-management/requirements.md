# Requirements Document

## Introduction

This specification defines the transformation of the clinician management system from a static file-based approach to a fully dynamic database-driven system. Currently, clinician data is stored in static text files within folders (bangalore, kochi, mumbai) and displayed on the frontend. The new system will enable admins to create, manage, and update clinicians through the admin panel, with all data stored in the database and dynamically displayed on the frontend website.

## Glossary

- **Admin_Panel**: The administrative interface located at mibo-admin/ where staff management occurs
- **Clinician**: A healthcare professional (psychiatrist, psychologist, therapist, counselor) who provides consultations
- **Frontend_Website**: The public-facing website at mibo_version-2/ where clinicians are displayed to patients
- **Static_Data**: Existing clinician information stored in text files within bangalore/, kochi/, and mumbai/ folders
- **Specialization**: The professional category of a clinician (e.g., Clinical Psychologist, Psychiatrist)
- **Qualification**: Educational credentials of a clinician (e.g., MBBS, MD, M.Phil, Ph.D.)
- **Availability_Schedule**: Time slots when a clinician is available for consultations, organized by day of week
- **Consultation_Mode**: The format of consultation delivery (in-person or online)
- **Primary_Centre**: The main location where a clinician practices (Bangalore, Kochi, or Mumbai)

## Requirements

### Requirement 1: Admin Panel Clinician Creation

**User Story:** As an admin, I want to create clinicians through the admin panel, so that I can manage the clinician roster dynamically without editing static files.

#### Acceptance Criteria

1. WHEN an admin accesses the clinician management page, THE Admin_Panel SHALL display a "Create Clinician" form
2. WHEN creating a clinician, THE Admin_Panel SHALL require full name, phone, username, password, primary centre, specialization, qualification, years of experience, consultation fee, and consultation modes
3. WHEN a clinician is created, THE System SHALL store all clinician data in the database
4. WHEN a clinician is created, THE System SHALL create both a user account and a clinician profile
5. WHEN a clinician is created with a phone number that already exists, THE System SHALL reject the creation and display an error message

### Requirement 2: Specialization Field Enhancement

**User Story:** As an admin, I want to select specializations from a dropdown list, so that I can ensure consistency and avoid typos in specialization data.

#### Acceptance Criteria

1. WHEN an admin creates or edits a clinician, THE Admin_Panel SHALL display a dropdown containing all available specializations
2. THE System SHALL extract specializations from existing static data files (Doctors List Bangalore.txt, Doctors List Kochi.txt, doctor list mumbai.txt)
3. THE Specialization_Dropdown SHALL include: Clinical Psychologist, Psychiatrist, Counselling Psychologist, Clinical Hypnotherapist, Consultant Psychiatrist, Consultant Child & Adolescent Psychiatrist
4. WHEN an admin selects a specialization, THE Admin_Panel SHALL allow adding multiple specializations via an "Add" button
5. WHEN multiple specializations are added, THE System SHALL store them as an array in the database

### Requirement 3: Qualification Field Enhancement

**User Story:** As an admin, I want to select qualifications from a dropdown list, so that I can accurately record clinician credentials without manual typing errors.

#### Acceptance Criteria

1. WHEN an admin creates or edits a clinician, THE Admin_Panel SHALL display a dropdown containing common qualifications
2. THE Qualification_Dropdown SHALL include: MBBS, MD, DPM, DNB, M.Phil, M.Sc, Ph.D., MRCPsych, PDF, DM, PGDFM
3. WHEN an admin selects a qualification, THE Admin_Panel SHALL allow adding multiple qualifications via an "Add" button
4. WHEN multiple qualifications are added, THE System SHALL store them as an array in the database

### Requirement 4: Field Removals

**User Story:** As an admin, I want a streamlined clinician creation form, so that I can focus on essential information without redundant fields.

#### Acceptance Criteria

1. THE Admin_Panel SHALL NOT display a "registration number" field in the clinician creation form
2. THE Admin_Panel SHALL NOT display an "area of expertise" field in the clinician creation form
3. WHEN displaying existing clinicians with registration numbers, THE System SHALL continue to display this legacy data

### Requirement 5: Profile Picture Upload

**User Story:** As an admin, I want to upload clinician profile pictures from my device or provide a URL, so that I can easily add professional photos to clinician profiles.

#### Acceptance Criteria

1. WHEN creating or editing a clinician, THE Admin_Panel SHALL display a profile picture upload section
2. THE Admin_Panel SHALL provide two options: upload from device OR enter image URL
3. WHEN an admin uploads an image from device, THE System SHALL store the image and save the storage path
4. WHEN an admin provides an image URL, THE System SHALL validate the URL format and store it
5. WHEN no profile picture is provided, THE System SHALL use a default placeholder image

### Requirement 6: Availability Schedule Management

**User Story:** As an admin, I want to set clinician availability schedules by day and time, so that patients can book appointments during available slots.

#### Acceptance Criteria

1. WHEN creating or editing a clinician, THE Admin_Panel SHALL display an availability schedule section
2. THE Admin_Panel SHALL provide a dropdown to select day of week (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
3. WHEN a day is selected, THE Admin_Panel SHALL display time input fields with AM/PM selectors
4. WHEN a time slot is entered, THE Admin_Panel SHALL provide a "Set Slot" button to confirm the slot
5. WHEN a slot is set, THE Admin_Panel SHALL display the slot and provide a "+" button to add additional slots for that day
6. THE Admin_Panel SHALL provide a "Remove Slots" feature to delete specific time slots
7. WHEN availability is saved, THE System SHALL store all time slots in the database with day_of_week, start_time, end_time, and consultation_mode

### Requirement 7: Clinician Authentication

**User Story:** As a clinician, I want to log into the admin panel using my credentials, so that I can manage my profile and view my appointments.

#### Acceptance Criteria

1. WHEN a clinician is created, THE System SHALL generate login credentials (username and password)
2. THE System SHALL store clinician credentials securely with password hashing
3. WHEN a clinician logs into the admin panel, THE System SHALL authenticate using username and password
4. WHEN authentication succeeds, THE System SHALL grant role-based access appropriate for clinicians
5. WHEN an admin views the clinician list, THE System SHALL display username and password for each clinician

### Requirement 8: Frontend Display Integration

**User Story:** As a patient, I want to see all clinicians created in the admin panel on the website, so that I can browse available healthcare professionals.

#### Acceptance Criteria

1. WHEN the frontend experts page loads, THE Frontend_Website SHALL query the database for all active clinicians
2. WHEN clinicians are retrieved, THE Frontend_Website SHALL display clinician cards with name, qualification, specialization, experience, location, consultation modes, and profile picture
3. WHEN no clinicians exist in the database, THE Frontend_Website SHALL fall back to displaying static data
4. WHEN the API request fails, THE Frontend_Website SHALL fall back to displaying static data
5. THE Frontend_Website SHALL display availability information for each clinician

### Requirement 9: Frontend Filtering and Sorting

**User Story:** As a patient, I want to filter clinicians by location, specialization, and consultation mode, so that I can find the right healthcare professional for my needs.

#### Acceptance Criteria

1. WHEN a patient selects a location filter, THE Frontend_Website SHALL query the database for clinicians at that primary centre
2. WHEN a patient selects a specialization filter, THE Frontend_Website SHALL query the database for clinicians with that specialization
3. WHEN a patient selects a consultation mode filter, THE Frontend_Website SHALL query the database for clinicians offering that mode
4. WHEN multiple filters are applied, THE Frontend_Website SHALL return clinicians matching all selected criteria
5. WHEN filters are cleared, THE Frontend_Website SHALL display all active clinicians

### Requirement 10: Data Migration from Static Files

**User Story:** As a system administrator, I want to migrate existing clinician data from static files to the database, so that all historical data is preserved in the new system.

#### Acceptance Criteria

1. THE System SHALL provide a migration script to read clinician data from static text files
2. WHEN the migration script runs, THE System SHALL parse each clinician entry from bangalore/, kochi/, and mumbai/ folders
3. WHEN parsing clinician data, THE System SHALL extract name, qualification, designation, experience, and consultation modes
4. WHEN creating database records, THE System SHALL assign appropriate primary_centre_id based on folder location
5. WHEN migration completes, THE System SHALL log the number of clinicians successfully migrated and any errors encountered

### Requirement 11: Backward Compatibility During Transition

**User Story:** As a developer, I want the system to support both static and dynamic data during the transition period, so that the website remains functional while migration is in progress.

#### Acceptance Criteria

1. WHEN the frontend queries for clinicians, THE System SHALL first attempt to retrieve data from the database
2. IF the database query returns no results, THEN THE System SHALL fall back to reading static files
3. IF the database query fails due to authentication or network errors, THEN THE System SHALL fall back to reading static files
4. WHEN displaying clinicians, THE Frontend_Website SHALL use the same card component regardless of data source
5. THE System SHALL log whether data is being served from database or static files for monitoring purposes

### Requirement 12: Input Validation

**User Story:** As an admin, I want the system to validate all input fields, so that only valid clinician data is stored in the database.

#### Acceptance Criteria

1. WHEN an admin submits the clinician creation form, THE System SHALL validate that all required fields are filled
2. WHEN validating phone numbers, THE System SHALL ensure the format is a 10-digit number
3. WHEN validating email addresses, THE System SHALL ensure the format matches standard email patterns
4. WHEN validating consultation fees, THE System SHALL ensure the value is a positive number
5. WHEN validating years of experience, THE System SHALL ensure the value is a non-negative integer
6. WHEN validation fails, THE System SHALL display specific error messages indicating which fields are invalid

### Requirement 13: Credential Visibility for Admins

**User Story:** As an admin, I want to view clinician login credentials at any time, so that I can provide credentials to clinicians when needed.

#### Acceptance Criteria

1. WHEN an admin views the clinician list, THE Admin_Panel SHALL display a "View Credentials" button for each clinician
2. WHEN the "View Credentials" button is clicked, THE Admin_Panel SHALL display the username and password in a modal
3. WHEN viewing credentials, THE Admin_Panel SHALL provide a "Copy" button to copy credentials to clipboard
4. THE System SHALL log all credential access events for security auditing
5. WHEN a clinician's password is changed, THE Admin_Panel SHALL display the new password to the admin

### Requirement 16: Clinician Details View and Edit

**User Story:** As an admin, I want to view all clinician details and edit them in a single modal, so that I can quickly update clinician information without navigating away from the list.

#### Acceptance Criteria

1. WHEN an admin clicks "View Details" on a clinician, THE Admin_Panel SHALL display a modal with all clinician information
2. THE Details_Modal SHALL display all fields including: name, specialization, qualification, experience, consultation fee, bio, consultation modes, profile picture, languages, expertise, and availability schedule
3. THE Details_Modal SHALL allow editing all fields directly within the modal
4. WHEN an admin modifies any field, THE Admin_Panel SHALL enable a "Save" button
5. WHEN the "Save" button is clicked, THE System SHALL update the clinician record in the database
6. WHEN the update succeeds, THE System SHALL display a success message and refresh the clinician list
7. THE Details_Modal SHALL include the availability schedule with ability to add/remove time slots
8. THE Details_Modal SHALL include the profile picture with ability to upload new image or change URL

### Requirement 14: Image Upload Storage

**User Story:** As a system administrator, I want uploaded profile pictures to be stored securely and efficiently, so that images load quickly on the frontend.

#### Acceptance Criteria

1. WHEN an admin uploads a profile picture, THE System SHALL validate the file type (JPEG, PNG, WebP)
2. WHEN an image is uploaded, THE System SHALL validate the file size is under 5MB
3. WHEN storing images, THE System SHALL generate a unique filename to prevent collisions
4. WHEN storing images, THE System SHALL save them to a designated storage location (local filesystem or cloud storage)
5. WHEN an image is successfully uploaded, THE System SHALL return the image URL and store it in the database

### Requirement 15: Availability Schedule Validation

**User Story:** As an admin, I want the system to validate availability schedules, so that only logical time slots are created.

#### Acceptance Criteria

1. WHEN an admin sets a time slot, THE System SHALL validate that start_time is before end_time
2. WHEN an admin sets a time slot, THE System SHALL validate that the slot does not overlap with existing slots for the same day
3. WHEN an admin sets a time slot, THE System SHALL validate that the time format is valid (HH:MM)
4. WHEN validation fails, THE System SHALL display an error message indicating the specific validation issue
5. WHEN a slot is successfully created, THE System SHALL display it in the availability schedule list
