# Booking Flow Diagram

## New User Flow (Not Logged In)

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Clicks "Book" on Expert                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Session Details                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Doctor info displayed                                   │  │
│  │ • Select mode (In-person/Video/Phone)                     │  │
│  │ • Select date from calendar                               │  │
│  │ • Select time slot                                        │  │
│  │ • Click "Book Appointment"                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Check Auth?    │
                    │ authenticated  │
                    │ = false        │
                    └────────┬───────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Phone Verification (SHOWN)                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Enter phone number                                      │  │
│  │ • Click "Send OTP"                                        │  │
│  │ • Receive OTP via WhatsApp                                │  │
│  │ • Enter 6-digit OTP                                       │  │
│  │ • If new user: Enter name and email                      │  │
│  │ • Click "Verify & Continue"                               │  │
│  │ • Auth token stored in localStorage                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Confirm Booking & Payment                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Enter/confirm full name                                 │  │
│  │ • Enter/confirm email (optional)                          │  │
│  │ • Review booking summary                                  │  │
│  │ • Review payment amount                                   │  │
│  │ • Click "Confirm & Pay"                                   │  │
│  │ • Razorpay modal opens                                    │  │
│  │ • Complete payment                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Payment Success                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Show success message                                    │  │
│  │ • Display appointment ID                                  │  │
│  │ • Redirect to dashboard                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Logged-In User Flow (Already Authenticated)

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Clicks "Book" on Expert                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Check Auth on  │
                    │ Page Load      │
                    │ ✓ Token found  │
                    │ ✓ User data OK │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Set bookingData│
                    │ authenticated  │
                    │ = true         │
                    └────────┬───────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Session Details                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Doctor info displayed                                   │  │
│  │ • Select mode (In-person/Video/Phone)                     │  │
│  │ • Select date from calendar                               │  │
│  │ • Select time slot                                        │  │
│  │ • Click "Book Appointment"                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Check Auth?    │
                    │ authenticated  │
                    │ = true         │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ SKIP STEP 2!   │
                    │ Go directly to │
                    │ Step 3         │
                    └────────┬───────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Confirm Booking & Payment                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Name PRE-FILLED from user data ✓                       │  │
│  │ • Email PRE-FILLED from user data ✓                      │  │
│  │ • Review booking summary                                  │  │
│  │ • Review payment amount                                   │  │
│  │ • Click "Confirm & Pay"                                   │  │
│  │ • Razorpay modal opens                                    │  │
│  │ • Complete payment                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Payment Success                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Show success message                                    │  │
│  │ • Display appointment ID                                  │  │
│  │ • Redirect to dashboard                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Cross-Tab Authentication Sync

```
┌──────────────────────┐         ┌──────────────────────┐
│      TAB 1           │         │      TAB 2           │
│  (Login Page)        │         │  (Booking Page)      │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           │ User logs in                   │
           │ ↓                              │
           │ authService.verifyOTP()        │
           │ ↓                              │
           │ Store in localStorage:         │
           │ • mibo_access_token            │
           │ • mibo_refresh_token           │
           │ • mibo_user                    │
           │ ↓                              │
           │ Dispatch "authChange" event    │
           │ ─────────────────────────────→ │
           │                                │ Listener catches event
           │                                │ ↓
           │                                │ Read from localStorage
           │                                │ ↓
           │                                │ Update bookingData
           │                                │ authenticated = true
           │                                │ ↓
           │                                │ User can skip Step 2!
           │                                │
           │ User logs out                  │
           │ ↓                              │
           │ authService.logout()           │
           │ ↓                              │
           │ Clear localStorage             │
           │ ↓                              │
           │ Dispatch "authChange" event    │
           │ ─────────────────────────────→ │
           │                                │ Listener catches event
           │                                │ ↓
           │                                │ Update bookingData
           │                                │ authenticated = false
           │                                │ ↓
           │                                │ User must verify phone
           │                                │
```

## localStorage Structure

```javascript
// After successful authentication
localStorage = {
  mibo_access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  mibo_refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  mibo_user: JSON.stringify({
    id: 123,
    full_name: "John Doe",
    phone: "919876543210",
    email: "john@example.com",
    userType: "PATIENT",
    patientId: 456,
  }),
};
```

## API Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Component makes API call                                       │
│  Example: apiClient.post('/booking/create', data)               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Client Request Interceptor                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Read token from localStorage                           │  │
│  │    const token = localStorage.getItem('mibo_access_token')│  │
│  │                                                            │  │
│  │ 2. Add to request headers                                 │  │
│  │    headers.Authorization = `Bearer ${token}`              │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend API                                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Verify JWT token                                        │  │
│  │ • Extract user ID from token                              │  │
│  │ • Process request                                         │  │
│  │ • Return response                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Client Response Interceptor                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ If 200 OK: Return data to component                       │  │
│  │                                                            │  │
│  │ If 401 Unauthorized:                                      │  │
│  │   • Clear localStorage                                    │  │
│  │   • Redirect to /patientAuth                              │  │
│  │   • Dispatch "authChange" event                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### ✅ Smart Step Navigation

- Automatically detects authentication status
- Skips unnecessary steps for logged-in users
- Maintains proper back navigation

### ✅ Cross-Tab Synchronization

- Login on one tab → Reflected on all tabs
- Logout on one tab → Reflected on all tabs
- Uses localStorage + event listeners

### ✅ Pre-filled User Data

- Name and email auto-populated for logged-in users
- Reduces typing and errors
- Users can still edit if needed

### ✅ Seamless Experience

- No page reloads required
- Instant authentication detection
- Smooth transitions between steps

### ✅ Security

- JWT tokens stored securely in localStorage
- Automatic token validation on every request
- Auto-logout on token expiry
- No sensitive data in URL or session storage
