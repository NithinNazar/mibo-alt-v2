# Fixed: Hardcoded Localhost URLs in Booking & Payment Flow ✅

## Problem

The booking and payment flow was failing on Vercel with `ERR_CONNECTION_REFUSED` errors because the code had hardcoded `http://localhost:5000` URLs that worked locally but failed in production.

## Root Cause

In `Step3ConfirmBooking.tsx`, there were 4 hardcoded localhost URLs:

1. Profile update: `http://localhost:5000/api/patient-auth/update-profile`
2. Create appointment: `http://localhost:5000/api/booking/create`
3. Create payment order: `http://localhost:5000/api/payments/create-order`
4. Verify payment: `http://localhost:5000/api/payments/verify`

These were using `fetch()` directly instead of the centralized API client that uses environment variables.

## Solution Applied

### Changed All Hardcoded URLs to Use Environment Variable

**Before:**

```typescript
await fetch("http://localhost:5000/api/patient-auth/update-profile", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ fullName, email }),
});
```

**After:**

```typescript
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
await fetch(`${apiBaseUrl}/patient-auth/update-profile`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ fullName, email }),
});
```

### Files Modified

- `mibo_version-2/src/pages/BookAppointment/Step3ConfirmBooking.tsx`
  - Fixed profile update URL
  - Fixed appointment creation URL
  - Fixed payment order creation URL
  - Fixed payment verification URL

## How It Works Now

### Local Development

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

All API calls go to local backend.

### Production (Vercel)

```env
VITE_API_BASE_URL=https://mibo-backend.onrender.com/api
```

All API calls go to Render backend.

### API Call Flow

```
Step3ConfirmBooking.tsx
  ↓
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ↓ (Vercel: https://mibo-backend.onrender.com/api)
  ↓
fetch(`${apiBaseUrl}/booking/create`)
  ↓
Final URL: https://mibo-backend.onrender.com/api/booking/create
  ↓
Render Backend ✅
```

## Why OTP Worked But Booking Didn't

**OTP Flow (authService.ts):**

- Uses centralized `apiClient` from `src/services/api.ts`
- `apiClient` already uses `import.meta.env.VITE_API_BASE_URL`
- ✅ Worked on Vercel

**Booking Flow (Step3ConfirmBooking.tsx):**

- Used direct `fetch()` calls with hardcoded localhost URLs
- ❌ Failed on Vercel with `ERR_CONNECTION_REFUSED`

## Verification

### Build Test

```bash
npm run build
# ✓ built in 12.07s
```

### What to Test on Vercel

1. **Complete Booking Flow:**

   - Sign in with OTP ✅ (already working)
   - Select clinician and time slot
   - Enter name and email
   - Click "Confirm & Pay"
   - Should create appointment (no more ERR_CONNECTION_REFUSED)
   - Razorpay modal should open
   - Complete payment
   - Should verify payment successfully
   - Should redirect to dashboard

2. **Check Network Tab:**

   - All API calls should go to `https://mibo-backend.onrender.com/api/*`
   - No calls to `localhost:5000`
   - All should return 200 OK (not 404 or connection refused)

3. **Check Console:**
   - No `ERR_CONNECTION_REFUSED` errors
   - No CORS errors
   - Should see success logs

## Files Changed

- ✅ `src/pages/BookAppointment/Step3ConfirmBooking.tsx` - Fixed 4 hardcoded URLs

## Files Already Correct

- ✅ `src/services/api.ts` - Uses environment variable
- ✅ `src/services/authService.ts` - Uses apiClient
- ✅ `src/services/bookingService.ts` - Uses apiClient
- ✅ `src/services/patientDashboardService.ts` - Uses apiClient
- ✅ `src/pages/profileDashboard/ProfileSettings.tsx` - Only uses localStorage

## Next Steps

1. **Vercel will auto-deploy** when it detects the push to GitHub
2. **Wait for deployment** to complete (usually 1-2 minutes)
3. **Test the booking flow** on your Vercel URL
4. **Verify payment works** end-to-end

## Environment Variables Checklist

Ensure these are set on Vercel:

- ✅ `VITE_API_BASE_URL` = `https://mibo-backend.onrender.com/api`
- ✅ `VITE_RAZORPAY_KEY_ID` = `rzp_test_Rv16VKPj91R00I` (or live key)

Ensure these are set on Render:

- ✅ `CORS_ORIGIN` = Your Vercel URL (e.g., `https://mibo-alt-v2.vercel.app`)
- ✅ All other backend environment variables (see `RENDER_ENVIRONMENT_SETUP.md`)

## Summary

✅ **Fixed**: All hardcoded localhost URLs replaced with environment variable
✅ **Build**: Successful
✅ **Pushed**: Changes pushed to GitHub
✅ **Ready**: Vercel will auto-deploy

The booking and payment flow should now work correctly on Vercel!
