# File Inventory: Slot Blocking & Clinician Login Features

## 1. CLINICIAN STAFF USER ROLE LOGIN

### Backend (backend/)

#### Authentication & Authorization

- `src/services/auth.services.ts` - Enhanced with clinician profile querying and JWT clinician ID
- `src/utils/jwt.ts` - JWT payload interface with clinicianId field
- `src/middlewares/role.middleware.ts` - Role-based access control (requireRole, enforceClinicianScope)
- `src/middlewares/auth.middleware.ts` - Authentication middleware
- `src/controllers/auth.controller.ts` - Authentication endpoints

#### Appointment Filtering

- `src/repositories/appointment.repository.ts` - Added findAppointmentsByClinicianId() method
- `src/services/appointment.services.ts` - Role-based appointment filtering logic
- `src/routes/appointment.routes.ts` - Applied enforceClinicianScope middleware

#### User & Role Management

- `src/repositories/user.repository.ts` - User data access
- `src/repositories/authSession.repository.ts` - Session management

#### Testing & Diagnostics

- `test-clinician-login.js` - Manual test script for clinician login
- `diagnose-clinician-login.js` - Diagnostic script to check clinician setup
- `test-clinician-login-direct.js` - Direct API test for clinician login
- `CLINICIAN_LOGIN_IMPLEMENTATION.md` - Implementation documentation

### Admin Panel (mibo-admin/)

#### Authentication

- `src/modules/auth/pages/LoginPage.tsx` - Login page with role-based redirect
- `src/modules/auth/pages/UnauthorizedPage.tsx` - Access denied page
- `src/contexts/AuthContext.tsx` - Auth context with isClinician/isAdmin helpers
- `src/services/authService.ts` - Authentication service

#### Routing & Protection

- `src/router/index.tsx` - Router with ProtectedRoute and role-based redirects
- `src/components/ProtectedRoute.tsx` - Role-based route protection component
- `src/components/ProtectedRoute.test.tsx` - Unit tests for ProtectedRoute
- `src/components/ProtectedRoute.example.tsx` - Usage examples

#### UI Components

- `src/layouts/AdminLayout/Sidebar.tsx` - Role-based navigation menu
- `src/modules/appointments/pages/AllAppointmentsPage.tsx` - Appointments page with role-based title
- `src/modules/profile/pages/ProfilePage.tsx` - User profile page

#### Types

- `src/types/index.ts` - User interface with clinicianId field

#### Documentation

- `PROTECTED_ROUTE_IMPLEMENTATION.md` - ProtectedRoute documentation

### Patient Frontend (mibo_version-2/)

#### Specifications

- `.kiro/specs/clinician-admin-signin/requirements.md` - Feature requirements
- `.kiro/specs/clinician-admin-signin/design.md` - Technical design document
- `.kiro/specs/clinician-admin-signin/tasks.md` - Implementation tasks
- `.kiro/specs/clinician-admin-signin/.config.kiro` - Spec configuration
- `.kiro/specs/clinician-admin-signin/TASK_13.1_COMPLETE.md` - Error handling documentation

---

## 2. SLOT BLOCKING FEATURE

### Backend (backend/)

#### Core Slot Blocking

- `src/controllers/slot-blocking.controller.ts` - Slot blocking API endpoints
- `src/services/slot-blocking.service.ts` - Business logic for slot blocking
- `src/repositories/slot.repository.ts` - Database operations for slots
- `src/routes/slot-blocking.routes.ts` - Slot blocking routes
- `src/types/slot-blocking.types.ts` - TypeScript types for slot blocking

#### Patient Notifications

- `src/controllers/patient-notification.controller.ts` - Patient notification endpoints
- `src/services/patient-notification.service.ts` - Notification business logic (if exists)
- `src/repositories/patient-notification.repository.ts` - Notification data access

#### Audit & Logging

- `src/repositories/audit.repository.ts` - Audit trail for slot operations

#### Testing

- `test-slot-blocking-api.js` - API test script
- `slot-blocking-api-tests.http` - HTTP test requests

### Admin Panel (mibo-admin/)

#### UI Components

- `src/components/SlotBlocking/SlotBlockingPanel.tsx` - Main slot blocking UI component
- `src/modules/appointments/pages/SlotBlockingPage.tsx` - Slot blocking page

#### Services

- `src/services/slotBlockingService.ts` - Frontend service for slot blocking API calls

### Patient Frontend (mibo_version-2/)

#### Notifications

- `src/components/Notifications/NotificationBell.tsx` - Notification bell icon
- `src/components/Notifications/NotificationList.tsx` - Notification list display

#### Specifications

- `.kiro/specs/slot-blocking-notification/requirements.md` - Feature requirements
- `.kiro/specs/slot-blocking-notification/design.md` - Technical design
- `.kiro/specs/slot-blocking-notification/tasks.md` - Implementation tasks

#### Documentation

- `SLOT_BLOCKING_IMPLEMENTATION_COMPLETE.md` - Implementation summary
- `INTEGRATION_COMPLETE.md` - Integration documentation
- `TEST_RESULTS.md` - Test results

---

## File Count Summary

### Clinician Login Feature

- **Backend**: 11 files (8 source + 3 test/diagnostic)
- **Admin Panel**: 12 files (9 source + 3 documentation/test)
- **Patient Frontend**: 5 files (specifications and documentation)
- **Total**: 28 files

### Slot Blocking Feature

- **Backend**: 10 files (7 source + 3 test)
- **Admin Panel**: 3 files
- **Patient Frontend**: 6 files (3 source + 3 documentation)
- **Total**: 19 files

### Grand Total: 47 files across both features

---

## Key Integration Points

### Shared Files (Used by Both Features)

1. `backend/src/middlewares/auth.middleware.ts` - Authentication for all protected routes
2. `backend/src/middlewares/role.middleware.ts` - Role checks for slot blocking access
3. `mibo-admin/src/router/index.tsx` - Routes for both features
4. `mibo-admin/src/contexts/AuthContext.tsx` - Authentication state management

### Database Tables Involved

1. **Clinician Login**: users, user_roles, roles, clinician_profiles, auth_sessions
2. **Slot Blocking**: slots, appointments, patient_notifications, audit_logs

---

## Quick Reference

### To modify clinician login behavior:

- Backend auth logic: `backend/src/services/auth.services.ts`
- Frontend login: `mibo-admin/src/modules/auth/pages/LoginPage.tsx`
- Role-based access: `backend/src/middlewares/role.middleware.ts`

### To modify slot blocking:

- Backend API: `backend/src/controllers/slot-blocking.controller.ts`
- Frontend UI: `mibo-admin/src/components/SlotBlocking/SlotBlockingPanel.tsx`
- Notifications: `mibo_version-2/src/components/Notifications/`

### To modify role-based navigation:

- Sidebar menu: `mibo-admin/src/layouts/AdminLayout/Sidebar.tsx`
- Route protection: `mibo-admin/src/components/ProtectedRoute.tsx`
- Router config: `mibo-admin/src/router/index.tsx`
