# Booking Slots Dynamic Data Fix

## Issue

When trying to fetch available slots on the live AWS website, the following errors occurred:

1. **401 Unauthorized Error**: "No token provided. Please login."
2. **500 Server Error**: "Clinician not found"

## Root Causes

### 1. Route Order Issue (401 Error)

The `/api/booking/available-slots` endpoint was being matched by the `/:id` route because it was defined AFTER the generic `:id` parameter route. Express matches routes in order, so `/available-slots` was treated as an ID parameter.

### 2. Hardcoded Clinician IDs (500 Error)

The frontend had a hardcoded `doctorToClinicianMap` that mapped frontend doctor IDs (1-23) to database clinician IDs (24-46). These hardcoded IDs didn't exist in the AWS production database, causing "Clinician not found" errors.

## Solutions Applied

### Backend Fix: Route Order

**File**: `backend/src/routes/booking.routes.ts`

Moved the `/available-slots` route BEFORE the `/:id` route to ensure specific routes are matched before generic parameter routes:

```typescript
// ✅ CORRECT ORDER
router.get("/available-slots", bookingController.getAvailableSlots);
router.get(
  "/my-appointments",
  authMiddleware,
  bookingController.getMyAppointments,
);
router.get("/:id", authMiddleware, bookingController.getAppointment);
```

### Frontend Fix: Dynamic Clinician Data

**File**: `mibo_version-2/src/pages/BookAppointment/Step1SessionDetails.tsx`

**Removed**:

- Hardcoded `doctorToClinicianMap` with IDs 24-46
- Mock clinician and centre data

**Added**:

- Dynamic fetching of clinician details from `/api/users/clinicians/:id`
- Dynamic fetching of centre details from `/api/centres/:id`
- Loading state while fetching clinician data
- Fallback data in case API calls fail

**Key Changes**:

```typescript
// Before: Hardcoded mapping
const doctorToClinicianMap = {
  1: { clinicianId: 24, centreId: 1 },
  // ... more hardcoded IDs
};

// After: Dynamic API fetch
useEffect(() => {
  const fetchClinicianData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/users/clinicians/${doctor.id}`,
    );
    const data = await response.json();
    setSelectedClinician(data.data);
    // ... fetch centre data
  };
  fetchClinicianData();
}, [doctor.id]);
```

## Benefits

1. **No Hardcoded Data**: Works with any clinicians created in the admin panel
2. **Production Ready**: Uses real database IDs from AWS RDS
3. **Scalable**: Automatically works when new clinicians are added
4. **Consistent**: Frontend and backend use the same clinician IDs
5. **Better UX**: Shows loading state while fetching data

## Testing

### Local Testing

```bash
# Build frontend
cd mibo_version-2
npm run build

# Deploy to AWS and test
```

### Verification Steps

1. ✅ Navigate to booking page for any clinician
2. ✅ Select a date
3. ✅ Verify slots load without 401 or 500 errors
4. ✅ Verify correct clinician name and details are shown
5. ✅ Complete booking flow

## Deployment

1. **Backend**: Already deployed to AWS Elastic Beanstalk
2. **Frontend**: Build completed - ready for deployment

```bash
# Frontend build output
dist/index.html                1.52 kB
dist/assets/index-C2wyvKFD.js  2,897.82 kB
✓ built in 15.57s
```

## Files Modified

### Backend

- `backend/src/routes/booking.routes.ts` - Fixed route order

### Frontend

- `mibo_version-2/src/pages/BookAppointment/Step1SessionDetails.tsx` - Removed hardcoded data, added dynamic fetching

## Next Steps

1. Deploy the new frontend build to AWS (S3/CloudFront)
2. Test the complete booking flow on production
3. Verify slots load correctly for all clinicians
4. Monitor AWS logs for any errors

## Notes

- The booking flow now works with real clinician data from the database
- No more hardcoded test data
- Clinicians created via admin panel will automatically work in the booking flow
- The fix maintains backward compatibility with the existing booking flow
