# Booking Page Slots Issue - Analysis and Fix

## Problem

When clicking "Book" button on a clinician card in the Experts page, the booking page loads but shows **HARDCODED mock time slots** instead of fetching real slots from the backend database.

## Current Situation

### Frontend (mibo_version-2/src/pages/BookAppointment/Step1SessionDetails.tsx)

**Lines 300-380**: The component uses `generateMockSlots()` function that creates fake time slots:

```typescript
const generateMockSlots = (date: Date): TimeSlot[] => {
  const dateKey = toISODateKey(date);
  const availability = availabilityMap[dateKey] ?? "unavailable";

  if (availability === "unavailable") return [];

  const allSlots: TimeSlot[] = [];

  // Morning slots (9:00 AM - 12:00 PM)
  const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

  // Afternoon slots (2:00 PM - 5:00 PM)
  const afternoonSlots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  // Evening slots (6:00 PM - 8:00 PM)
  const eveningSlots = ["18:00", "18:30", "19:00", "19:30"];

  // ... randomly selects slots based on date
};
```

**Problem**: This generates fake slots that don't reflect actual clinician availability in the database.

### Backend (Already Exists!)

✅ **Backend has the functionality ready**:

**File**: `backend/src/services/appointment.services.ts` (Line 586)

- Function: `checkClinicianAvailability(clinicianId, centreId, date)`
- Returns: Array of TimeSlot objects with `startTime`, `endTime`, `available`

**File**: `backend/src/controllers/appointment.controller.ts`

- Function: `getClinicianAvailability()`
- Endpoint: `GET /api/appointments/availability`

**File**: `backend/src/routes/appointment.routes.ts` (Line 37)

```typescript
router.get("/availability", authMiddleware, (req, res, next) =>
  appointmentController.getClinicianAvailability(req, res, next),
);
```

**❌ ISSUE**: This endpoint requires `authMiddleware` - users must be logged in!

But the booking page is accessed BEFORE login (Step 1 → Step 2 login → Step 3 payment).

## Root Cause

1. ✅ Backend has slot generation logic
2. ✅ Backend has availability checking
3. ❌ Backend endpoint requires authentication
4. ❌ Frontend doesn't call the API - uses mock data instead

## Solution

### Option 1: Create Public Availability Endpoint (RECOMMENDED)

Create a new PUBLIC endpoint that doesn't require authentication:

**1. Add public route** (`backend/src/routes/public.routes.ts`):

```typescript
/**
 * GET /api/public/clinicians/:id/availability
 * Get clinician availability for a specific date (PUBLIC - no auth required)
 * Query params: date (YYYY-MM-DD), centre_id (optional)
 */
router.get("/clinicians/:id/availability", (req, res, next) =>
  publicController.getClinicianAvailability(req, res, next),
);
```

**2. Add controller method** (`backend/src/controllers/public.controller.ts`):

```typescript
async getClinicianAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const clinicianId = Number(req.params.id);
    const date = String(req.query.date); // YYYY-MM-DD
    const centreId = req.query.centre_id ? Number(req.query.centre_id) : undefined;

    // Validate inputs
    if (!clinicianId || isNaN(clinicianId)) {
      throw ApiError.badRequest("Invalid clinician ID");
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw ApiError.badRequest("Invalid date format. Use YYYY-MM-DD");
    }

    // Get clinician's primary centre if not provided
    let finalCentreId = centreId;
    if (!finalCentreId) {
      const clinician = await db.oneOrNone(
        "SELECT primary_centre_id FROM clinician_profiles WHERE id = $1",
        [clinicianId]
      );
      if (!clinician) {
        throw ApiError.notFound("Clinician not found");
      }
      finalCentreId = clinician.primary_centre_id;
    }

    // Use existing appointment service method
    const slots = await appointmentService.checkClinicianAvailability(
      clinicianId,
      finalCentreId,
      date
    );

    return ok(res, slots);
  } catch (err) {
    next(err);
  }
}
```

**3. Update frontend** (`mibo_version-2/src/pages/BookAppointment/Step1SessionDetails.tsx`):

Replace mock data generation with API call:

```typescript
// Remove generateMockSlots function

// Add API call
const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
const [slotsLoading, setSlotsLoading] = useState(false);

useEffect(() => {
  if (!selectedDate || !selectedClinician) return;

  const fetchSlots = async () => {
    try {
      setSlotsLoading(true);
      const dateStr = toISODateKey(selectedDate); // YYYY-MM-DD format

      const response = await fetch(
        `${API_BASE_URL}/api/public/clinicians/${selectedClinician.id}/availability?date=${dateStr}&centre_id=${selectedCentre?.id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }

      const data = await response.json();
      setAvailableSlots(data.data || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  fetchSlots();
}, [selectedDate, selectedClinician, selectedCentre]);

// Update slotsByPeriod to use availableSlots instead of mockSlots
const slotsByPeriod = useMemo(() => {
  const grouped: Record<string, TimeSlot[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  availableSlots.forEach((slot) => {
    if (!slot.available) return;

    const hour = parseInt(slot.startTime.split(":")[0]);

    if (hour < 12) {
      grouped.Morning.push(slot);
    } else if (hour < 17) {
      grouped.Afternoon.push(slot);
    } else {
      grouped.Evening.push(slot);
    }
  });

  return grouped;
}, [availableSlots]);
```

### Option 2: Allow Unauthenticated Access to Existing Endpoint

Modify the existing endpoint to allow public access:

**Update route** (`backend/src/routes/appointment.routes.ts`):

```typescript
/**
 * GET /api/appointments/availability
 * Get clinician availability for a specific date
 * PUBLIC - No authentication required
 */
router.get("/availability", (req, res, next) =>
  appointmentController.getClinicianAvailability(req, res, next),
);
```

Remove `authMiddleware` from this specific route.

**Update controller** to not require `req.user`:

```typescript
async getClinicianAvailability(
  req: Request, // Changed from AuthRequest
  res: Response,
  next: NextFunction
) {
  try {
    const dto = validateAvailabilityQuery(req.query);
    const slots = await appointmentService.checkClinicianAvailability(
      dto.clinician_id,
      dto.centre_id,
      dto.date
    );
    return ok(res, slots);
  } catch (err) {
    next(err);
  }
}
```

## Recommendation

**Use Option 1** (Create Public Endpoint) because:

1. ✅ Keeps public and authenticated endpoints separate
2. ✅ Better security - doesn't expose internal appointment routes
3. ✅ Follows REST API best practices
4. ✅ Easier to add rate limiting for public endpoints
5. ✅ Cleaner URL structure: `/api/public/clinicians/:id/availability`

## Implementation Steps

### Backend Changes:

1. Create `backend/src/controllers/public.controller.ts` (if not exists)
2. Add `getClinicianAvailability` method to public controller
3. Update `backend/src/routes/public.routes.ts` to add availability endpoint
4. Test endpoint: `GET /api/public/clinicians/48/availability?date=2026-02-25`

### Frontend Changes:

1. Remove `generateMockSlots()` function from `Step1SessionDetails.tsx`
2. Remove `makeMonthAvailability()` function (or keep for UI only)
3. Add `useEffect` to fetch slots when date/clinician changes
4. Add loading state while fetching slots
5. Update `slotsByPeriod` to use real API data
6. Handle error states (no slots, API error)

## Expected API Response

```json
{
  "success": true,
  "data": [
    {
      "startTime": "09:00",
      "endTime": "09:50",
      "available": true
    },
    {
      "startTime": "10:00",
      "endTime": "10:50",
      "available": false
    },
    {
      "startTime": "14:00",
      "endTime": "14:50",
      "available": true
    }
  ]
}
```

## Testing

1. **Backend**: Test availability endpoint returns correct slots
2. **Frontend**: Verify slots load when date is selected
3. **Integration**: Book appointment and verify slot becomes unavailable
4. **Edge cases**:
   - No slots available for date
   - Clinician not found
   - Invalid date format
   - Network error handling

## Files to Modify

### Backend:

- `backend/src/controllers/public.controller.ts` (add method)
- `backend/src/routes/public.routes.ts` (add route)

### Frontend:

- `mibo_version-2/src/pages/BookAppointment/Step1SessionDetails.tsx` (replace mock with API)
- `mibo_version-2/src/services/api.ts` (add API call function - optional)

---

**Status**: Issue identified, solution designed  
**Priority**: High - affects user booking experience  
**Estimated Time**: 2-3 hours to implement and test
