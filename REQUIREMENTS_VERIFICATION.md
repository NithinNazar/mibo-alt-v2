# Requirements Verification Before Deployment

## Status Summary

| #   | Requirement                    | Status                    | Notes                                       |
| --- | ------------------------------ | ------------------------- | ------------------------------------------- |
| 1   | OTP Sign-in with User Creation | ✅ COMPLETE               | Backend handles both new and existing users |
| 2   | Frontend User Tracking         | ✅ COMPLETE               | Auth service with localStorage and events   |
| 3   | Admin Panel User Tracking      | ✅ COMPLETE               | AuthContext with role-based access          |
| 4   | All Bookings in Admin Panel    | ❌ **MISSING**            | No centralized appointments list page       |
| 5   | Clinicians Show on Frontend    | ✅ COMPLETE               | Frontend fetches from backend API           |
| 6   | Soft Delete (Enable/Disable)   | ⚠️ **NEEDS VERIFICATION** | Need to check implementation                |

---

## Detailed Verification

### ✅ 1. OTP Sign-in with User Creation/Login

**Backend Implementation:**

- File: `backend/src/controllers/patient-auth.controller.ts`
- Endpoints:
  - `POST /api/patient-auth/send-otp` - Sends OTP via WhatsApp
  - `POST /api/patient-auth/verify-otp` - Verifies OTP and creates/logs in user

**Flow:**

1. User enters phone number → OTP sent via WhatsApp (Gallabox)
2. User enters OTP + name (if new user) → Backend verifies
3. Backend checks if user exists:
   - **New user**: Creates user + patient record, returns `isNewUser: true`
   - **Existing user**: Returns user data, returns `isNewUser: false`
4. Frontend stores tokens and user data in localStorage

**Response includes:**

- `user` object with id, phone, full_name, email
- `patient` object with patient-specific data
- `accessToken` and `refreshToken`
- `isNewUser` flag

**Status:** ✅ **WORKING**

---

### ✅ 2. Frontend User Tracking

**Implementation:**

- File: `mibo_version-2/src/services/authService.ts`
- Storage: localStorage with keys:
  - `mibo_access_token`
  - `mibo_refresh_token`
  - `mibo_user`

**Features:**

- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user data
- `logout()` - Clear all auth data
- Custom `authChange` event dispatched on login/logout

**API Integration:**

- File: `mibo_version-2/src/services/api.ts`
- Automatically adds Bearer token to all requests
- Handles 401 errors and redirects to login

**Status:** ✅ **WORKING**

---

### ✅ 3. Admin Panel User Tracking

**Implementation:**

- File: `mibo-admin/src/contexts/AuthContext.tsx`
- Features:
  - Validates token on page load by calling `/api/auth/me`
  - Stores user in React state + localStorage
  - Logout clears data and redirects to `/login`
  - Protected routes check authentication

**Role-Based Access:**

- File: `mibo-admin/src/layouts/AdminLayout/Sidebar.tsx`
- Filters menu items based on user role:
  - **ADMIN/MANAGER**: See all menu items
  - **CLINICIAN**: Limited to dashboard, patients, appointments
  - **FRONT_DESK**: Booking and patient management
  - **CENTRE_MANAGER**: Centre-specific management
  - **CARE_COORDINATOR**: Patient care coordination

**Status:** ✅ **WORKING**

---

### ❌ 4. All Bookings Display in Admin Panel

**Current State:**

- ❌ No centralized "All Appointments" page
- ✅ Has centre-specific appointments: `CentreAppointmentsPage.tsx`
- ✅ Has clinician-specific appointments: `ClinicianAppointmentsPage.tsx`
- ✅ Has booking creation pages

**What's Missing:**
A page that shows ALL appointments across all centres and clinicians in a tabular view with:

- Patient name and phone
- Clinician name
- Centre name
- Appointment date/time
- Status (BOOKED, CONFIRMED, COMPLETED, CANCELLED, etc.)
- Appointment type (IN_PERSON, ONLINE)
- Booking source (WEB_PATIENT, ADMIN_FRONT_DESK, etc.)
- Actions (view details, reschedule, cancel)

**Backend Support:**

- ✅ Endpoint exists: `GET /api/appointments`
- ✅ Returns all appointments with filters

**Action Required:**
Create `mibo-admin/src/modules/appointments/pages/AllAppointmentsPage.tsx`

**Status:** ❌ **NEEDS IMPLEMENTATION**

---

### ✅ 5. Clinicians Show on Frontend

**Frontend Implementation:**

- File: `mibo_version-2/src/services/clinicianService.ts`
- Method: `getClinicians(params?)`
- Features:
  - Fetches from `GET /api/clinicians`
  - Caches data for 5 minutes
  - Supports filtering by centre and specialization

**Backend Implementation:**

- Endpoint: `GET /api/clinicians`
- Returns all active clinicians with:
  - User details (name, phone, email)
  - Professional info (specialization, experience, fee)
  - Primary centre
  - Consultation modes (IN_PERSON, ONLINE)
  - Availability rules

**Filtering:**

- By centre: `?centreId=1`
- By specialization: `?specialization=Psychiatry`
- Only returns `is_active = true` clinicians

**Status:** ✅ **WORKING**

---

### ⚠️ 6. Soft Delete (Enable/Disable Toggle)

**Current Implementation - NEEDS VERIFICATION:**

**Database Schema:**
All tables have `is_active` boolean field:

- `users` table: `is_active BOOLEAN DEFAULT true`
- `clinicians` table: `is_active BOOLEAN DEFAULT true`
- `centres` table: `is_active BOOLEAN DEFAULT true`

**Backend - NEEDS CHECK:**
Need to verify if delete operations use soft delete:

- `DELETE /api/clinicians/:id` - Should set `is_active = false`
- `DELETE /api/centres/:id` - Should set `is_active = false`
- `DELETE /api/users/:id` - Should set `is_active = false`

**Admin Panel UI - NEEDS IMPLEMENTATION:**
Currently has DELETE buttons, should have:

- ❌ Remove permanent delete buttons
- ❌ Add toggle switch for enable/disable
- ❌ Visual indicator (badge/color) showing active/inactive status
- ❌ Filter to show/hide inactive items

**Frontend API Calls:**
Should only fetch active items:

- `GET /api/clinicians` - Should filter `is_active = true`
- `GET /api/centres` - Should filter `is_active = true`

**Action Required:**

1. Verify backend delete methods use soft delete
2. Update admin panel UI to use toggle instead of delete
3. Add active/inactive visual indicators
4. Ensure frontend only shows active items

**Status:** ⚠️ **NEEDS VERIFICATION & UI UPDATE**

---

## Priority Actions Before Deployment

### HIGH PRIORITY

1. **❌ Create All Appointments Page** (Requirement #4)
   - Create `AllAppointmentsPage.tsx` in admin panel
   - Show tabular view of all bookings
   - Add filters (date range, status, centre, clinician)
   - Add actions (view, reschedule, cancel)

2. **⚠️ Implement Soft Delete UI** (Requirement #6)
   - Replace DELETE buttons with TOGGLE switches
   - Add active/inactive badges
   - Update delete API calls to use soft delete
   - Add filter to show/hide inactive items

### MEDIUM PRIORITY

3. **Deploy CORS Fix**
   - Current blocker for production frontend
   - Follow `backend/CORS_FIX_DEPLOYMENT.md`

### LOW PRIORITY

4. **Testing**
   - Test complete OTP flow on production
   - Test booking creation from frontend
   - Test admin panel role-based access
   - Test clinician availability display

---

## Deployment Checklist

### Before Deploying Backend:

- [ ] Implement soft delete for clinicians
- [ ] Implement soft delete for centres
- [ ] Implement soft delete for staff users
- [ ] Add CORS origins for production domains
- [ ] Test all endpoints locally
- [ ] Build backend: `npm run build`
- [ ] Create deployment zip
- [ ] Upload to Elastic Beanstalk

### Before Deploying Frontend:

- [ ] Update `.env` with production API URL
- [ ] Test OTP flow locally
- [ ] Test booking flow locally
- [ ] Build frontend: `npm run build`
- [ ] Upload `dist/` to S3
- [ ] Invalidate CloudFront cache

### Before Deploying Admin Panel:

- [ ] Create All Appointments page
- [ ] Implement soft delete UI
- [ ] Update `.env` with production API URL
- [ ] Test role-based access
- [ ] Build admin panel: `npm run build`
- [ ] Upload `dist/` to S3 (separate bucket)
- [ ] Configure CloudFront

---

## Recommendations

1. **All Appointments Page**: This is critical for admin operations. Should be implemented before deployment.

2. **Soft Delete**: Important for data integrity. Prevents accidental permanent deletion of important records.

3. **CORS Fix**: Blocking issue for production. Must be deployed first.

4. **Admin Panel Deployment**: Currently only running locally. Should be deployed to AWS for production use.

5. **Monitoring**: Set up error logging and monitoring for production:
   - CloudWatch for backend logs
   - Sentry or similar for frontend error tracking
   - Database backup schedule

6. **Security**:
   - Ensure all environment variables are set in AWS
   - Enable HTTPS for all domains
   - Set up proper IAM roles and permissions
   - Regular security audits

---

## Next Steps

1. **Immediate**: Fix CORS and deploy backend
2. **Short-term**: Implement missing features (#4, #6)
3. **Medium-term**: Deploy admin panel to AWS
4. **Long-term**: Set up monitoring and CI/CD pipeline
