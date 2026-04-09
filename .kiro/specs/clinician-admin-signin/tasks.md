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

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Backend changes are implemented first to support frontend development
- All changes maintain backward compatibility with existing authentication flows
- Role-based access control is enforced at both API and UI levels
- Security is prioritized with proper token validation and data isolation
