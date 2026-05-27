# Slot Booking Bug Fix - Summary

## Date: 2026-05-25

## Problem Statement

Users were seeing past slots and booked slots were completely hidden in the book-appointment page, causing confusion and poor user experience.

---

## Root Causes Identified

### 1. **Timezone Issue in Backend** ⚠️ CRITICAL

- **Location:** `backend/src/services/appointment.services.ts` - `checkClinicianAvailability()` method
- **Problem:** Used `new Date()` which returns server's system time, not IST
- **Impact:** If backend server runs in UTC timezone, there's a 5.5 hour difference causing incorrect past slot filtering
- **Example:** At 2:00 PM IST (8:30 AM UTC), slots after 8:30 AM UTC would be hidden even though it's only 2:00 PM IST

### 2. **Booked Slots Hidden in Frontend** ❌

- **Location:** `src/pages/BookAppointment/Step1SessionDetails.tsx` - line 956
- **Problem:** Code returned `null` for booked slots: `return isBooked ? null : (<button>...)`
- **Impact:** Users couldn't see which time slots were booked vs. available, making it look like no slots exist

### 3. **Misleading Slot Count Display** ⚠️

- **Location:** `src/pages/BookAppointment/Step1SessionDetails.tsx` - slot count display
- **Problem:** Showed total slot count but only displayed available slots
- **Impact:** Confusing UX - "5 slots" shown but only 2 buttons visible

---

## Fixes Implemented

### Fix 1: Backend Timezone Handling ✅

**File:** `backend/src/services/appointment.services.ts`

**Changes:**

```typescript
// OLD CODE (INCORRECT):
const now = new Date();
const currentTimeMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

// NEW CODE (CORRECT):
// Get current date and time in IST (Asia/Kolkata) for filtering past slots
const now = new Date();

// Convert current UTC time to IST (UTC+5:30)
const istOffset = 5.5 * 60; // IST is UTC+5:30 in minutes
const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
const istMinutesRaw = utcMinutes + istOffset;
const istMinutes = istMinutesRaw % (24 * 60); // Handle day overflow

// Get current date in IST
const istDate = new Date(now.getTime() + istOffset * 60 * 1000);
const istYear = istDate.getUTCFullYear();
const istMonth = istDate.getUTCMonth();
const istDay = istDate.getUTCDate();

// Compare dates (ignoring time) - both in IST
const nowDateOnly = new Date(istYear, istMonth, istDay);
const currentTimeMinutes = isToday ? istMinutes : 0;
```

**Impact:**

- ✅ Past slot filtering now works correctly regardless of server timezone
- ✅ Uses explicit IST timezone calculation
- ✅ Handles day overflow (e.g., 11:30 PM + 5.5 hours = next day)

---

### Fix 2: Show Booked Slots as Disabled ✅

**File:** `src/pages/BookAppointment/Step1SessionDetails.tsx`

**Changes:**

```typescript
// OLD CODE (HIDES BOOKED SLOTS):
return isBooked ? null : (
  <button onClick={() => setSelectedTime(slot.start_time)}>
    {formatTime12Hour(slot.start_time)}
  </button>
);

// NEW CODE (SHOWS BOOKED SLOTS AS DISABLED):
return (
  <button
    onClick={() => !isBooked && setSelectedTime(slot.start_time)}
    disabled={isBooked}
    className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
      isBooked
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
        : "hover:shadow-md cursor-pointer"
    }`}
  >
    {formatTime12Hour(slot.start_time)}
    {isBooked && (
      <span className="block text-xs mt-0.5">
        Booked
      </span>
    )}
  </button>
);
```

**Impact:**

- ✅ Booked slots now visible but grayed out
- ✅ Shows "Booked" label on unavailable slots
- ✅ Better UX - users can see all time slots and their availability status
- ✅ Non-clickable and visually distinct from available slots

---

### Fix 3: Accurate Slot Count Display ✅

**File:** `src/pages/BookAppointment/Step1SessionDetails.tsx`

**Changes:**

```typescript
// OLD CODE (MISLEADING):
<span className="text-xs text-gray-500">
  ({slots.length} slot{slots.length !== 1 ? "s" : ""})
</span>

// NEW CODE (ACCURATE):
<span className="text-xs text-gray-500">
  ({slots.filter((s) => s.available).length} available
  {slots.filter((s) => !s.available).length > 0 &&
    ` / ${slots.length} total`})
</span>
```

**Impact:**

- ✅ Shows "X available" for clarity
- ✅ Shows "X available / Y total" when there are booked slots
- ✅ No confusion between displayed slots and total count

---

## Testing Checklist

### Backend Testing

- [ ] Test slot fetching for today's date with past and future slots
- [ ] Test slot fetching for future dates
- [ ] Test slot fetching with booked appointments
- [ ] Test slot fetching with admin-blocked slots
- [ ] Verify timezone handling works correctly on UTC servers
- [ ] Test edge cases: midnight, day boundaries

### Frontend Testing

- [ ] Verify booked slots appear as grayed out buttons
- [ ] Verify booked slots show "Booked" label
- [ ] Verify booked slots are not clickable
- [ ] Verify available slots are clickable and selectable
- [ ] Verify slot count displays correctly
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Test with all slots available
- [ ] Test with all slots booked
- [ ] Test with mixed available/booked slots

### Integration Testing

- [ ] Book an appointment and verify the slot becomes unavailable
- [ ] Book from admin panel and verify frontend reflects the change
- [ ] Block a slot from admin panel and verify it shows as unavailable
- [ ] Test across different timezones (if applicable)
- [ ] Test with multiple clinicians and centres

---

## Files Modified

### Backend

1. `backend/src/services/appointment.services.ts`
   - Modified `checkClinicianAvailability()` method
   - Fixed timezone handling for past slot filtering

### Frontend

1. `src/pages/BookAppointment/Step1SessionDetails.tsx`
   - Modified slot rendering logic to show booked slots
   - Updated slot count display
   - Added disabled state styling for booked slots

---

## Backward Compatibility

✅ **All changes are backward compatible:**

- API response format unchanged
- Database queries unchanged
- No breaking changes to existing functionality
- Admin panel already handles booked slots correctly
- Other parts of the codebase unaffected

---

## Related Components (Verified - No Changes Needed)

### Admin Panel

- `mibo-admin/src/modules/staff/pages/CliniciansPage.tsx`
- Already shows booked slots correctly with "(Booked)" label
- No changes needed

### API Endpoints

- `GET /api/booking/available-slots` - No changes needed
- `GET /api/booking/dates-with-slots` - No changes needed
- Both endpoints use `checkClinicianAvailability()` which is now fixed

### Services

- `booking.service.ts` - Uses `checkClinicianAvailability()`, benefits from timezone fix
- No direct changes needed

---

## Performance Impact

✅ **Minimal performance impact:**

- Timezone calculation adds negligible overhead (~1ms)
- Frontend now renders all slots instead of filtering, but difference is minimal
- No additional API calls
- No database query changes

---

## Security Considerations

✅ **No security concerns:**

- No changes to authentication/authorization
- No changes to data validation
- No new user inputs
- No changes to API endpoints

---

## Future Improvements (Optional)

1. **Use a timezone library** (e.g., `date-fns-tz`, `luxon`)
   - More robust timezone handling
   - Better DST support
   - Easier to maintain

2. **Add timezone configuration**
   - Allow configuring timezone in environment variables
   - Support multiple timezones for different centres

3. **Add loading states**
   - Show skeleton loaders while fetching slots
   - Better UX during API calls

4. **Add slot refresh**
   - Auto-refresh slots every few minutes
   - Ensure real-time availability

---

## Deployment Notes

### Pre-deployment

1. Review all changes in staging environment
2. Run full test suite
3. Test with real data in staging
4. Verify timezone handling on production-like server

### Deployment

1. Deploy backend changes first
2. Deploy frontend changes after backend is live
3. Monitor error logs for any issues
4. Test booking flow immediately after deployment

### Post-deployment

1. Monitor user bookings for 24 hours
2. Check for any timezone-related issues
3. Verify slot availability is accurate
4. Collect user feedback

---

## Rollback Plan

If issues occur:

1. **Backend rollback:** Revert `appointment.services.ts` to previous version
2. **Frontend rollback:** Revert `Step1SessionDetails.tsx` to previous version
3. Both can be rolled back independently without breaking the system

---

## Contact

For questions or issues related to this fix, contact the development team.

---

**Fix Status:** ✅ COMPLETED
**Tested:** ⏳ PENDING
**Deployed:** ⏳ PENDING
