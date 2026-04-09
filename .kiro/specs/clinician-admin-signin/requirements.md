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

### Requirement 4: Admin Panel UI Adaptation for Clinicians

**User Story:** As a clinician, I want the admin panel interface to show only relevant features for my role, so that I can efficiently manage my appointments without confusion.

#### Acceptance Criteria

1. WHEN a clinician logs in, THE Admin_Panel SHALL display a navigation menu containing only "My Appointments" and "Profile" options
2. WHEN a clinician views the appointments page, THE Admin_Panel SHALL display appointments in a list or calendar view
3. THE Admin_Panel SHALL display appointment details including patient name, scheduled time, appointment type, duration, and centre name
4. WHEN a clinician selects an appointment, THE Admin_Panel SHALL display full appointment details including patient contact information and notes
5. THE Admin_Panel SHALL display the clinician's name and role in the header navigation bar

### Requirement 5: Existing Admin Authentication Compatibility

**User Story:** As an admin or manager, I want to continue using existing authentication methods, so that the new clinician login does not disrupt current workflows.

#### Acceptance Criteria

1. THE Login_Page SHALL continue to support phone + OTP authentication for admin and manager users
2. THE Login_Page SHALL continue to support phone + password authentication for admin and manager users
3. THE Login_Page SHALL continue to support username + password authentication for admin and manager users
4. WHEN an admin or manager logs in, THE Admin_Panel SHALL display the full administrative interface with all features
5. THE Auth_Service SHALL maintain backward compatibility with existing authentication flows
