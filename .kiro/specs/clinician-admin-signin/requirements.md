# Requirements Document

## Introduction

This document specifies the requirements for implementing individual clinician sign-in functionality to the admin panel. Currently, clinicians have username and password fields during creation, but cannot use them to log into the admin panel. This feature will enable clinicians to authenticate using their credentials and access a personalized view showing only their own appointments.

## Glossary

- **Admin_Panel**: The administrative web application (mibo-admin workspace) used by staff to manage appointments, patients, and clinicians
- **Clinician**: A staff member with the CLINICIAN role who provides medical consultations to patients
- **Auth_Service**: The backend authentication service that validates credentials and issues JWT tokens
- **Appointment_Repository**: The backend data access layer for retrieving appointment information
- **Login_Page**: The admin panel authentication page where users select their login method and enter credentials
- **Clinician_Profile**: The database record linking a user to their clinician-specific information (specialization, registration number, etc.)
- **User_Record**: The database record in the users table containing authentication credentials and user type
- **JWT_Token**: JSON Web Token containing user identity and role information for authenticated sessions
- **Upcoming_Appointment**: An appointment with scheduled_start_at in the future and status not in ('CANCELLED', 'NO_SHOW')
- **Clinician_Dashboard**: The dedicated page in the Admin_Panel showing appointments specific to the logged-in clinician
- **Notepad_Interface**: The UI component that allows clinicians to add, edit, and view notes for appointments
- **Google_Meet_Link**: A URL generated for online appointments that allows video consultation via Google Meet
- **Appointment_Service**: The backend service layer that handles business logic for appointment operations
- **Clinician_Edit_Page**: The admin interface page for editing clinician profile information and credentials
- **Clinician_Service**: The backend service layer that handles business logic for clinician operations
- **Appointments_Table**: The database table storing appointment records including patient, clinician, time, and notes
- **Database_Migration**: A script that modifies the database schema to add or update tables and columns

## Requirements

### Requirement 1: Clinician Authentication

**User Story:** As a clinician, I want to log into the admin panel using my username and password, so that I can access my appointment schedule.

#### Acceptance Criteria

1. WHEN a clinician selects "username + password" option on the Login_Page, THE Login_Page SHALL display username and password input fields
2. WHEN a clinician enters valid username and password, THE Auth_Service SHALL verify the credentials against the User_Record
3. WHEN credentials are valid and the user has a Clinician_Profile, THE Auth_Service SHALL generate a JWT_Token containing the user ID, role, and clinician ID
4. WHEN credentials are valid, THE Auth_Service SHALL return the JWT_Token and user profile information to the Admin_Panel
5. IF credentials are invalid, THEN THE Auth_Service SHALL return an error message "Invalid credentials"
6. IF the user does not have a Clinician_Profile, THEN THE Auth_Service SHALL return an error message "Access denied"

### Requirement 2: Clinician-Specific Appointment Filtering

**User Story:** As a clinician, I want to see only my own appointments when I log into the admin panel, so that I can focus on my patient schedule without seeing other clinicians' appointments.

#### Acceptance Criteria

1. WHEN a clinician is authenticated, THE Appointment_Repository SHALL filter appointments where clinician_id matches the authenticated clinician's ID
2. WHEN retrieving appointments, THE Appointment_Repository SHALL only return Upcoming_Appointments for the authenticated clinician
3. THE Appointment_Repository SHALL include patient name, appointment time, appointment type, and centre name in the filtered results
4. WHEN no appointments exist for the clinician, THE Admin_Panel SHALL display an empty state message "No upcoming appointments"
5. THE Appointment_Repository SHALL order appointments by scheduled_start_at in ascending order

### Requirement 3: Role-Based Access Control for Clinicians

**User Story:** As a system administrator, I want clinicians to have restricted access to only their own data, so that patient privacy and data security are maintained.

#### Acceptance Criteria

1. WHEN a clinician accesses appointment endpoints, THE Auth_Service SHALL verify the JWT_Token contains the CLINICIAN role
2. WHEN a clinician requests appointment data, THE Appointment_Repository SHALL enforce filtering by the clinician's ID from the JWT_Token
3. THE Admin_Panel SHALL hide administrative functions (create clinician, manage staff, system settings) from clinician users
4. WHEN a clinician attempts to access another clinician's data, THE Auth_Service SHALL return an error with status code 403 and message "Access denied"
5. THE Admin_Panel SHALL display only appointment management features to clinician users

### Requirement 4: Clinician Dashboard with Enhanced Appointment Display

**User Story:** As a clinician, I want to see my appointments in a dedicated dashboard with detailed information, so that I can efficiently manage my patient consultations.

#### Acceptance Criteria

1. WHEN a clinician logs in with valid username and password, THE Admin_Panel SHALL redirect to a dedicated clinician dashboard page
2. THE Clinician_Dashboard SHALL display appointments as numbered rows in ascending order by scheduled time
3. FOR EACH appointment row, THE Clinician_Dashboard SHALL display appointment number, appointment date, appointment time, centre name, and mode of session
4. WHEN an appointment has mode "online", THE Clinician_Dashboard SHALL display a Google Meet link in the appointment row
5. THE Appointment_Repository SHALL fetch session details and modes from the database in real-time
6. WHEN a patient chooses online session during booking, THE Google_Meet_Link SHALL be generated and stored in the database
7. WHEN a clinician clicks on an appointment slot with online mode, THE Clinician_Dashboard SHALL display the Google Meet link
8. THE Admin_Panel SHALL display the clinician's name and role in the header navigation bar

### Requirement 5: Appointment Notes Management

**User Story:** As a clinician, I want to add and edit notes for each appointment, so that I can document session details and review them later.

#### Acceptance Criteria

1. FOR EACH appointment row in the Clinician_Dashboard, THE Admin_Panel SHALL display an "Add Notes" button
2. WHEN a clinician clicks the "Add Notes" button, THE Admin_Panel SHALL display a notepad interface
3. THE Notepad_Interface SHALL allow clinicians to type and edit text notes
4. THE Notepad_Interface SHALL display "Save" and "Edit" buttons
5. WHEN a clinician clicks "Save", THE Appointment_Service SHALL store the notes in the database linked to the appointment ID
6. WHEN a clinician views an appointment with existing notes, THE Notepad_Interface SHALL display the saved notes
7. WHEN a clinician clicks "Edit", THE Notepad_Interface SHALL allow modification of existing notes
8. THE Clinician_Dashboard SHALL allow clinicians to view saved notes anytime for review

### Requirement 6: Clinician Role Restrictions

**User Story:** As a system administrator, I want clinicians to have restricted capabilities, so that they cannot perform administrative actions.

#### Acceptance Criteria

1. WHEN a clinician is logged in, THE Admin_Panel SHALL hide the "Book Appointment" button
2. THE Admin_Panel SHALL prevent clinicians from accessing appointment booking functionality
3. THE Admin_Panel SHALL display a navigation menu containing only "My Appointments" and "Profile" options for clinicians
4. THE Admin_Panel SHALL hide administrative functions (create clinician, manage staff, system settings) from clinician users

### Requirement 7: Clinician Profile Edit Enhancement

**User Story:** As an admin, I want to view and edit clinician username and password fields on the clinician edit page, so that I can manage clinician credentials.

#### Acceptance Criteria

1. WHEN an admin is logged in, THE Admin_Panel SHALL display a pen button next to clinician view details
2. WHEN an admin clicks the pen button, THE Admin_Panel SHALL navigate to the clinician edit page
3. THE Clinician_Edit_Page SHALL display username and password fields for existing clinicians
4. THE Clinician_Edit_Page SHALL allow admins to edit the username field
5. THE Clinician_Edit_Page SHALL allow admins to edit the password field
6. WHEN an admin saves changes, THE Clinician_Service SHALL update the username and password in the database

### Requirement 8: Database Schema Enhancement for Notes

**User Story:** As a developer, I want the database schema to support storing appointment notes, so that clinicians can save and retrieve notes for appointments.

#### Acceptance Criteria

1. THE Appointments_Table SHALL include a notes column of type TEXT to store clinician notes
2. THE Appointments_Table SHALL allow NULL values for the notes column for appointments without notes
3. WHEN a clinician saves notes, THE Appointment_Repository SHALL update the notes column for the specific appointment ID
4. WHEN retrieving appointments, THE Appointment_Repository SHALL include the notes field in the response
5. THE Database_Migration SHALL add the notes column if it does not already exist

### Requirement 9: Existing Admin Authentication Compatibility

**User Story:** As an admin or manager, I want to continue using existing authentication methods, so that the new clinician login does not disrupt current workflows.

#### Acceptance Criteria

1. THE Login_Page SHALL continue to support phone + OTP authentication for admin and manager users
2. THE Login_Page SHALL continue to support phone + password authentication for admin and manager users
3. THE Login_Page SHALL continue to support username + password authentication for admin and manager users
4. WHEN an admin or manager logs in, THE Admin_Panel SHALL display the full administrative interface with all features
5. THE Auth_Service SHALL maintain backward compatibility with existing authentication flows
