# Implementation Plan: Clinician Admin Sign-In

## Overview

This implementation plan breaks down the clinician admin sign-in feature into discrete coding tasks. The feature enables clinicians to authenticate using username/password and access a personalized admin panel view showing only their appointments. The implementation extends the existing authentication system with role-based access control while maintaining backward compatibility.

## Tasks

- [ ] 1. Enhance backend authentication for clinician login
  - [x] 1.1 Update Auth Service to query clinician profile during login
    - Modify `loginWithUsernamePassword()` in `backend/src/services/auth.services.ts`
    - Query `clinician_profiles` table after user validation
    - Add clinician ID to JWT payload when clinician profile exists
    - Return 403 error if STAFF user has no clinician profile
    - _Requirements: 1.2, 1.3, 1.6_

  - [x] 1.2 Enhance JWT payload interface to include clinician ID
    - Update `JwtPayload` interface in `backend/src/utils/jwt.ts`
    - Add optional `clinicianId?: number` field
    - Update token generation to include clinician ID for clinician users
    - _Requirements: 1.3_

  - [x] 1.3 Update Auth Response interface to include clinician data
    - Modify `AuthResponse` interface in auth service types
    - Add `clinicianId?: number` to user object
    - Return clinician ID in login response for clinician users
    - _Requirements: 1.3, 1.4_

  - [ ]\* 1.4 Write unit tests for enhanced authentication
    - Test login with valid clinician credentials includes clinician ID
    - Test login rejection when STAFF user has no clinician profile
    - Test JWT token contains clinician ID for clinicians only
    - Test backward compatibility for admin/manager login
    - _Requirements: 1.2, 1.3, 1.6_

- [ ] 2. Implement role-based access control middleware
  - [x] 2.1 Create role middleware file
    - Create `backend/src/middlewares/role.middleware.ts`
    - Implement `requireRole()` function to check user roles
    - Implement `enforceClinicianScope()` to restrict clinician data access
    - Add error handling for missing roles or clinician ID
    - _Requirements: 3.1, 3.4_

  - [ ]\* 2.2 Write unit tests for role middleware
    - Test `requireRole()` allows users with correct role
    - Test `requireRole()` blocks users without required role
    - Test `enforceClinicianScope()` allows clinician to access own data
    - Test `enforceClinicianScope()` blocks access to other clinician's data
    - _Requirements: 3.1, 3.4_

- [ ] 3. Implement appointment filtering by clinician ID
  - [x] 3.1 Add clinician-specific query method to Appointment Repository
    - Create `findAppointmentsByClinicianId()` in `backend/src/repositories/appointment.repository.ts`
    - Filter by clinician_id and upcoming appointments only
    - Support optional filters for status, date range
    - Include patient details, centre info, and clinician name in results
    - Order results by scheduled_start_at ascending
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 3.2 Update Appointment Service to apply role-based filtering
    - Modify `getAppointments()` in `backend/src/services/appointment.services.ts`
    - Check if user has CLINICIAN role
    - Call `findAppointmentsByClinicianId()` for clinician users
    - Return all appointments for admin/manager users
    - Throw error if clinician ID missing from token
    - _Requirements: 2.1, 3.2_

  - [ ]\* 3.3 Write unit tests for appointment filtering
    - Test clinician users receive only their appointments
    - Test admin users receive all appointments
    - Test filtering by status and date range
    - Test error when clinician ID missing from token
    - Test empty result handling
    - _Requirements: 2.1, 2.2, 2.4, 3.2_

- [ ] 4. Update appointment routes with role middleware
  - [x] 4.1 Apply authentication and role middleware to appointment endpoints
    - Update appointment routes in `backend/src/routes/appointment.routes.ts`
    - Add `enforceClinicianScope` middleware to GET /appointments
    - Ensure all appointment endpoints verify authentication
    - _Requirements: 3.1, 3.2_

- [x] 5. Checkpoint - Backend authentication and filtering complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Enhance frontend authentication context
  - [x] 6.1 Update User interface to include clinician ID
    - Modify User interface in `mibo-admin/src/contexts/AuthContext.tsx`
    - Add `clinicianId?: number` field
    - Store clinician ID from login response
    - _Requirements: 1.3, 1.4_

  - [x] 6.2 Add role helper functions to Auth Context
    - Add `isClinician` computed property (checks if role === 'CLINICIAN')
    - Add `isAdmin` computed property (checks if role === 'ADMIN' or 'MANAGER')
    - Export helpers in AuthContextType interface
    - _Requirements: 3.3, 4.5_

  - [ ]\* 6.3 Write unit tests for Auth Context enhancements
    - Test `isClinician` returns true for clinician role
    - Test `isAdmin` returns true for admin/manager roles
    - Test clinician ID is stored after login
    - Test logout clears clinician ID
    - _Requirements: 1.4, 3.3_

- [ ] 7. Implement role-based navigation
  - [x] 7.1 Update Navigation component for role-based menu
    - Modify `mibo-admin/src/components/Navigation.tsx`
    - Show "My Appointments" for clinicians, "Appointments" for admins
    - Hide admin-only menu items (Clinicians, Patients, Centres, Staff, Settings) for clinicians
    - Display user name and role badge in header
    - Show Profile option for all users
    - _Requirements: 4.1, 4.5_

  - [ ]\* 7.2 Write unit tests for Navigation component
    - Test clinician sees limited menu items
    - Test admin sees all menu items
    - Test role badge displays correctly
    - Test menu item labels change based on role
    - _Requirements: 4.1, 4.5_

- [ ] 8. Update Appointment List component for clinicians
  - [x] 8.1 Adapt Appointment List UI for role-based display
    - Modify `mibo-admin/src/components/Appointments/AppointmentList.tsx`
    - Change page title based on role ("My Appointments" vs "All Appointments")
    - Display empty state message "No upcoming appointments" when no data
    - Ensure appointment table shows patient name, date/time, type, centre, status
    - _Requirements: 2.4, 4.2, 4.3_

  - [ ]\* 8.2 Write unit tests for Appointment List component
    - Test displays "My Appointments" for clinicians
    - Test displays "All Appointments" for admins
    - Test empty state renders correctly
    - Test appointment data renders in table
    - _Requirements: 2.4, 4.2, 4.3_

- [ ] 9. Create Protected Route component
  - [x] 9.1 Implement ProtectedRoute component
    - Create `mibo-admin/src/components/ProtectedRoute.tsx`
    - Check authentication status
    - Verify user role against allowed roles
    - Redirect to /login if not authenticated
    - Redirect to /unauthorized if role not allowed
    - Show loading state while checking authentication
    - _Requirements: 3.3, 3.4_

  - [x] 9.2 Apply ProtectedRoute to admin-only pages
    - Wrap admin-only routes with ProtectedRoute component
    - Set allowedRoles to ['ADMIN', 'MANAGER'] for admin pages
    - Allow all authenticated users for appointments and profile pages
    - _Requirements: 3.3, 3.4_

  - [ ]\* 9.3 Write unit tests for ProtectedRoute component
    - Test redirects to login when not authenticated
    - Test redirects to unauthorized when role not allowed
    - Test renders children when authenticated with correct role
    - Test loading state displays correctly
    - _Requirements: 3.3, 3.4_

- [ ] 10. Create Unauthorized page component
  - [x] 10.1 Implement Unauthorized page
    - Create `mibo-admin/src/pages/Unauthorized.tsx`
    - Display user-friendly "Access Denied" message
    - Provide link to return to appointments page
    - Show contact support information
    - _Requirements: 3.4_

- [ ] 11. Update appointment detail view for clinicians
  - [x] 11.1 Ensure appointment details are accessible to clinicians
    - Verify appointment detail component shows patient contact info
    - Display appointment notes and full details
    - Ensure API endpoint respects clinician scope
    - _Requirements: 4.4_

- [x] 12. Checkpoint - Frontend UI adaptation complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement error handling and user feedback
  - [x] 13.1 Add error handling for authentication failures
    - Display "Invalid credentials" message for failed login
    - Display "Access denied" message when no clinician profile
    - Display "Account inactive" message for deactivated accounts
    - Show user-friendly error messages in UI
    - _Requirements: 1.5, 1.6_

  - [x] 13.2 Add error handling for authorization failures
    - Display "Access denied" message when clinician tries to access restricted data
    - Handle token expiration with refresh or re-login prompt
    - Log unauthorized access attempts for security monitoring
    - _Requirements: 3.4_

- [ ] 14. Verify backward compatibility
  - [x] 14.1 Test existing authentication methods still work
    - Verify admin login with phone + OTP works unchanged
    - Verify manager login with phone + password works unchanged
    - Verify admin login with username + password works unchanged
    - Ensure admin users see full interface with all features
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]\* 14.2 Write integration tests for backward compatibility
    - Test admin phone + OTP flow end-to-end
    - Test manager phone + password flow end-to-end
    - Test admin username + password flow end-to-end
    - Verify admin users can access all features
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 15. Final integration and testing
  - [ ]\* 15.1 Write end-to-end integration tests
    - Test complete clinician login flow with username/password
    - Test clinician sees only their appointments
    - Test clinician cannot access admin features
    - Test appointment filtering returns correct data
    - Test role-based navigation displays correctly
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 4.1_

  - [ ]\* 15.2 Perform manual testing checklist
    - Manually verify clinician login works
    - Verify clinician sees only their appointments
    - Verify clinician cannot access admin pages
    - Verify admin login and full access still works
    - Test error messages display correctly
    - Test UI is responsive on different screen sizes
    - _Requirements: All_

- [x] 16. Final checkpoint - Feature complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Database migration for notes and Google Meet columns
  - [x] 17.1 Create migration script for appointments table
    - Create migration file `backend/migrations/YYYYMMDD_add_notes_and_meet_to_appointments.sql`
    - Add notes column (TEXT, nullable) to appointments table
    - Add google_meet_link column (VARCHAR(500), nullable) to appointments table
    - Add google_calendar_event_id column (VARCHAR(255), nullable) to appointments table
    - Add column comments for documentation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 17.2 Create rollback migration script
    - Create rollback file for removing added columns
    - Test rollback script in development environment
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 17.3 Execute migration in development environment
    - Run migration script against development database
    - Verify columns are added successfully
    - Verify existing data is not affected
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 18. Implement backend API for notes management
  - [x] 18.1 Add updateNotes method to Appointment Repository
    - Implement `updateNotes(appointmentId, notes)` in `backend/src/repositories/appointment.repository.ts`
    - Update notes column and updated_at timestamp
    - Return updated appointment record
    - _Requirements: 5.5, 8.3_

  - [x] 18.2 Add findByIdWithDetails method to Appointment Repository
    - Implement `findByIdWithDetails(appointmentId)` in appointment repository
    - Join with patient_profiles, centres, clinician_profiles, and users tables
    - Include notes and google_meet_link in SELECT query
    - Return null if appointment not found
    - _Requirements: 5.6, 8.4_

  - [x] 18.3 Add updateNotes method to Appointment Service
    - Implement `updateNotes(appointmentId, notes)` in `backend/src/services/appointment.services.ts`
    - Validate appointment exists
    - Call repository updateNotes method
    - Return updated appointment
    - _Requirements: 5.5_

  - [x] 18.4 Add getAppointmentById method to Appointment Service
    - Implement `getAppointmentById(appointmentId, authUser)` in appointment service
    - Call repository findByIdWithDetails method
    - Return appointment with full details
    - _Requirements: 5.6_

  - [x] 18.5 Add notes update endpoint to Appointment Controller
    - Implement `updateAppointmentNotes()` in `backend/src/controllers/appointment.controller.ts`
    - Validate notes field is present in request body
    - Verify appointment belongs to clinician (if clinician role)
    - Call service updateNotes method
    - Return success response with updated appointment
    - _Requirements: 5.5_

  - [x] 18.6 Add get appointment by ID endpoint to Appointment Controller
    - Implement `getAppointmentById()` in appointment controller
    - Verify appointment access for clinicians (enforce scope)
    - Call service getAppointmentById method
    - Return appointment details
    - _Requirements: 5.6_

  - [x] 18.7 Add notes routes to Appointment Routes
    - Add PATCH `/api/appointments/:id/notes` route in `backend/src/routes/appointment.routes.ts`
    - Add GET `/api/appointments/:id` route
    - Apply authMiddleware and enforceClinicianScope middleware
    - Wire routes to controller methods
    - _Requirements: 5.5, 5.6_

  - [ ]\* 18.8 Write unit tests for notes API
    - Test updateNotes updates notes column correctly
    - Test updateNotes validates appointment ownership for clinicians
    - Test getAppointmentById returns appointment with notes
    - Test getAppointmentById enforces clinician scope
    - Test error handling for invalid appointment ID
    - _Requirements: 5.5, 5.6, 8.3, 8.4_

- [x] 19. Implement backend API for clinician credentials update
  - [x] 19.1 Add updateUser method to User Repository
    - Implement `updateUser(userId, updates)` in `backend/src/repositories/user.repository.ts`
    - Build dynamic SET clause from updates object
    - Update updated_at timestamp
    - Execute parameterized query
    - _Requirements: 7.6_

  - [x] 19.2 Add updateClinicianCredentials method to Staff Service
    - Implement `updateClinicianCredentials(clinicianId, credentials)` in `backend/src/services/staff.service.ts`
    - Get clinician profile to find user_id
    - Validate username uniqueness if username provided
    - Hash password using bcrypt if password provided
    - Call user repository updateUser method
    - Return updated clinician data
    - _Requirements: 7.4, 7.5, 7.6_

  - [x] 19.3 Add updateClinicianCredentials controller method
    - Implement `updateClinicianCredentials()` in `backend/src/controllers/staff.controller.ts`
    - Validate at least one of username or password is provided
    - Call service updateClinicianCredentials method
    - Return success response
    - _Requirements: 7.4, 7.5, 7.6_

  - [x] 19.4 Add credentials update route
    - Add PATCH `/api/staff/clinicians/:id/credentials` route in `backend/src/routes/staff.routes.ts`
    - Apply authMiddleware and requireRole(['ADMIN', 'MANAGER']) middleware
    - Wire route to controller method
    - _Requirements: 7.1, 7.2, 7.6_

  - [ ]\* 19.5 Write unit tests for credentials update API
    - Test admin can update clinician username
    - Test admin can update clinician password
    - Test password is hashed before storage
    - Test username uniqueness validation
    - Test error when neither username nor password provided
    - _Requirements: 7.4, 7.5, 7.6_

- [x] 20. Checkpoint - Backend API enhancements complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Implement Clinician Dashboard component
  - [x] 21.1 Create ClinicianDashboard component file
    - Create `mibo-admin/src/components/Clinician/ClinicianDashboard.tsx`
    - Define AppointmentRow interface with rowNumber, date, time, centre, mode, googleMeetLink, patientName, notes
    - Set up component state for appointments, loading, selectedAppointment
    - _Requirements: 4.1, 4.2_

  - [x] 21.2 Implement appointment fetching in ClinicianDashboard
    - Add useEffect to fetch appointments on component mount
    - Call GET `/api/appointments` endpoint
    - Format appointments with row numbers (index + 1)
    - Parse scheduled_start_at into date and time
    - Handle loading and error states
    - _Requirements: 4.2, 4.5_

  - [x] 21.3 Implement dashboard header with user info
    - Display "My Appointments" heading
    - Show clinician name from auth context
    - Display "Clinician" role badge
    - _Requirements: 4.1, 4.8_

  - [x] 21.4 Implement appointments table with numbered rows
    - Create table with columns: #, Date, Time, Centre, Mode, Patient, Actions
    - Display row number for each appointment
    - Format date as YYYY-MM-DD and time as HH:mm
    - Display centre name from appointment data
    - _Requirements: 4.2, 4.3_

  - [x] 21.5 Implement Google Meet link display for online appointments
    - Check if appointment mode is 'ONLINE'
    - Display "Online" label with Google Meet link if available
    - Render link as clickable with target="\_blank" and rel="noopener noreferrer"
    - Display "In-Person" label for non-online appointments
    - _Requirements: 4.4, 4.6, 4.7_

  - [x] 21.6 Implement notes button in actions column
    - Display "Add Notes" button if appointment has no notes
    - Display "View/Edit Notes" button if appointment has notes
    - Handle button click to open notes panel
    - Pass appointment ID to notes panel
    - _Requirements: 5.1_

  - [x] 21.7 Implement empty state for no appointments
    - Display "No upcoming appointments" message when appointments array is empty
    - Style empty state appropriately
    - _Requirements: 4.2_

  - [x] 21.8 Add styling for ClinicianDashboard component
    - Style dashboard header with user info
    - Style appointments table with proper spacing
    - Style Google Meet link as button or badge
    - Style notes button
    - Ensure responsive design
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]\* 21.9 Write unit tests for ClinicianDashboard component
    - Test displays "My Appointments" heading
    - Test fetches appointments on mount
    - Test displays numbered rows correctly
    - Test displays Google Meet link for online appointments
    - Test hides Google Meet link for in-person appointments
    - Test displays correct notes button text
    - Test empty state renders when no appointments
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7_

- [x] 22. Implement Notes Panel component
  - [x] 22.1 Create NotesPanel component file
    - Create `mibo-admin/src/components/Clinician/NotesPanel.tsx`
    - Define NotesPanelProps interface with appointmentId, onClose, onSave
    - Set up component state for notes, isEditing, loading, saving
    - _Requirements: 5.2_

  - [x] 22.2 Implement notes fetching in NotesPanel
    - Add useEffect to fetch appointment notes on mount
    - Call GET `/api/appointments/:id` endpoint
    - Set notes state with existing notes or empty string
    - Set isEditing to true if no existing notes
    - Handle loading state
    - _Requirements: 5.6_

  - [x] 22.3 Implement notes textarea with edit/view modes
    - Display textarea for notes input
    - Disable textarea when not in edit mode
    - Enable textarea when in edit mode
    - Set placeholder text "Enter appointment notes here..."
    - Set rows to 10 for adequate space
    - _Requirements: 5.3_

  - [x] 22.4 Implement Save and Edit buttons
    - Display "Save" button when in edit mode
    - Display "Edit" button when not in edit mode
    - Display "Cancel" button when editing existing notes
    - Handle button click events
    - _Requirements: 5.4, 5.7_

  - [x] 22.5 Implement save notes functionality
    - Call PATCH `/api/appointments/:id/notes` endpoint with notes
    - Handle saving state (disable button, show "Saving..." text)
    - Call onSave callback on success
    - Display error message on failure
    - _Requirements: 5.5_

  - [x] 22.6 Implement modal overlay and panel styling
    - Create overlay that covers entire screen
    - Create centered panel with header, content, and actions
    - Add close button (×) in header
    - Style textarea appropriately
    - Style buttons (Save, Edit, Cancel, Close)
    - _Requirements: 5.2_

  - [ ]\* 22.7 Write unit tests for NotesPanel component
    - Test loads existing notes on mount
    - Test displays textarea in edit mode for new notes
    - Test displays read-only view for existing notes
    - Test "Edit" button enables editing
    - Test "Save" button calls API and triggers onSave
    - Test "Cancel" button discards changes
    - Test close button triggers onClose
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 23. Update Clinician Edit Page for credentials visibility
  - [x] 23.1 Add username field to Clinician Edit Page
    - Modify `mibo-admin/src/pages/Clinicians/ClinicianEdit.tsx` (or equivalent)
    - Add username input field to form
    - Display current username value for existing clinicians
    - Allow admin to edit username
    - _Requirements: 7.3, 7.4_

  - [x] 23.2 Add password field to Clinician Edit Page
    - Add password input field to form
    - Display empty password field (never show existing password)
    - Allow admin to enter new password
    - Add password visibility toggle
    - _Requirements: 7.3, 7.5_

  - [x] 23.3 Implement credentials update on save
    - Collect username and password from form
    - Call PATCH `/api/staff/clinicians/:id/credentials` endpoint
    - Only send fields that were modified
    - Display success message on successful update
    - Display error message on failure
    - _Requirements: 7.6_

  - [ ]\* 23.4 Write unit tests for Clinician Edit Page updates
    - Test displays username field with current value
    - Test displays empty password field
    - Test admin can edit username
    - Test admin can edit password
    - Test save button calls credentials update API
    - Test success message displays after save
    - _Requirements: 7.3, 7.4, 7.5, 7.6_

- [x] 24. Integrate Google Meet link display in appointment rows
  - [x] 24.1 Update appointment booking to generate Google Meet links
    - Modify booking API in `backend/src/controllers/booking.controller.ts` (or equivalent)
    - Check if appointment mode is 'ONLINE'
    - Call `googleMeetUtil.createMeetLinkForAppointmentFromFrontend()` for online appointments
    - Store returned meetLink in appointments.google_meet_link
    - Store returned eventId in appointments.google_calendar_event_id
    - _Requirements: 4.6_

  - [x] 24.2 Ensure appointment queries include Google Meet link
    - Verify `findAppointmentsByClinicianId()` includes google_meet_link in SELECT
    - Verify `findByIdWithDetails()` includes google_meet_link in SELECT
    - Verify all appointment queries return google_meet_link field
    - _Requirements: 4.5, 4.7_

  - [ ]\* 24.3 Write integration tests for Google Meet link generation
    - Test online appointment booking generates Google Meet link
    - Test in-person appointment booking does not generate link
    - Test appointment queries return google_meet_link field
    - Test clinician dashboard displays link for online appointments
    - _Requirements: 4.6, 4.7_

- [x] 25. Remove book appointment functionality for clinicians
  - [x] 25.1 Hide book appointment button in Navigation for clinicians
    - Modify `mibo-admin/src/components/Navigation.tsx`
    - Check if user role is CLINICIAN using isClinician helper
    - Hide "Book Appointment" menu item for clinicians
    - Show "Book Appointment" for admin/manager users
    - _Requirements: 6.1, 6.3_

  - [x] 25.2 Prevent clinicians from accessing booking routes
    - Apply ProtectedRoute with allowedRoles=['ADMIN', 'MANAGER'] to booking pages
    - Redirect clinicians to /unauthorized if they try to access booking URL
    - _Requirements: 6.2_

  - [ ]\* 25.3 Write tests for booking restriction
    - Test book appointment button hidden for clinicians
    - Test book appointment button visible for admins
    - Test clinician redirected when accessing booking URL
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 26. Update routing to use Clinician Dashboard for clinicians
  - [x] 26.1 Add route for Clinician Dashboard
    - Add route `/appointments` that renders ClinicianDashboard for clinicians
    - Add route `/appointments` that renders AppointmentList for admins
    - Use role-based conditional rendering or separate routes
    - _Requirements: 4.1_

  - [x] 26.2 Update login redirect logic
    - Modify login success handler to redirect clinicians to `/appointments`
    - Redirect admins to default admin dashboard or `/appointments`
    - _Requirements: 4.1_

- [x] 27. Checkpoint - Frontend enhancements complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 28. Integration testing for all new features
  - [ ]\* 28.1 Test notes management end-to-end flow
    - Clinician logs in and views appointments
    - Clinician clicks "Add Notes" for an appointment
    - Clinician types notes and saves
    - Verify notes are persisted in database
    - Clinician reopens notes panel
    - Verify saved notes are displayed
    - Clinician edits notes and saves
    - Verify updated notes are persisted
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [ ]\* 28.2 Test Google Meet link display end-to-end flow
    - Create appointment with ONLINE mode
    - Verify Google Meet link is generated during booking
    - Clinician logs in and views appointments
    - Verify Google Meet link is displayed in appointment row
    - Click Google Meet link
    - Verify link opens in new tab
    - _Requirements: 4.4, 4.5, 4.6, 4.7_

  - [ ]\* 28.3 Test clinician credentials update end-to-end flow
    - Admin logs in and navigates to clinicians list
    - Admin clicks edit button for a clinician
    - Admin updates username and password
    - Admin saves changes
    - Verify success message displays
    - Clinician logs out and logs in with new credentials
    - Verify login succeeds
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]\* 28.4 Test clinician dashboard displays all features correctly
    - Clinician logs in with username and password
    - Verify redirect to clinician dashboard
    - Verify numbered appointment rows display
    - Verify date, time, centre, mode display correctly
    - Verify Google Meet link displays for online appointments
    - Verify notes button displays correctly
    - Verify no book appointment button
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7, 6.1_

  - [ ]\* 28.5 Test backward compatibility with existing authentication
    - Admin logs in with phone + OTP
    - Verify existing flow works unchanged
    - Verify admin sees full interface
    - Manager logs in with phone + password
    - Verify existing flow works unchanged
    - Admin logs in with username + password
    - Verify existing flow works unchanged
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 29. Final checkpoint - All enhancements complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Backend changes are implemented first to support frontend development
- All changes maintain backward compatibility with existing authentication flows
- Role-based access control is enforced at both API and UI levels
- Security is prioritized with proper token validation and data isolation
- New tasks (17-29) cover database migration, notes management, credentials update, clinician dashboard, notes panel, Google Meet display, and clinician edit page enhancements
