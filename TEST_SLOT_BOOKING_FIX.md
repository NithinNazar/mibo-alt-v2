# Test Plan for Slot Booking Bug Fix

## Pre-Testing Setup

### 1. Start Backend Server

```bash
cd c:\Users\nithi\Desktop\backend_mibo\backend
npm run dev
```

### 2. Start Frontend Server

```bash
cd c:\Users\nithi\Desktop\host_test\mibo-v2\mibo_version-2
npm run dev
```

### 3. Verify Database Connection

- Check that backend connects to database successfully
- Verify clinicians and centres exist in database

---

## Test Cases

### Test 1: Booked Slots Display ✅

**Objective:** Verify booked slots are visible but disabled

**Steps:**

1. Navigate to Experts page
2. Click "Book" on any clinician
3. Select a date that has some booked appointments
4. Check the slot display

**Expected Result:**

- ✅ Booked slots appear as grayed-out buttons
- ✅ Booked slots show "Booked" label
- ✅ Booked slots are not clickable (cursor: not-allowed)
- ✅ Available slots are green/normal and clickable

**How to Verify:**

- Look for gray buttons with "Booked" text
- Try clicking a booked slot - should not be selectable
- Hover over booked slot - cursor should show "not-allowed"

---

### Test 2: Slot Count Display ✅

**Objective:** Verify slot count shows accurate information

**Steps:**

1. Navigate to book-appointment page
2. Select a date with mixed available/booked slots
3. Check the slot count display for each period

**Expected Result:**

- ✅ Shows "X available" when all slots are available
- ✅ Shows "X available / Y total" when some slots are booked
- ✅ Count matches actual visible slots

**Example:**

```
Morning (3 available / 5 total)
- 3 green buttons (available)
- 2 gray buttons (booked)
- Total: 5 buttons
```

---

### Test 3: Past Slots Filtering (Today) ✅

**Objective:** Verify past slots are hidden correctly using IST timezone

**Steps:**

1. Note current time in IST
2. Navigate to book-appointment page
3. Select TODAY's date
4. Check morning/afternoon slots

**Expected Result:**

- ✅ Slots before current IST time are hidden
- ✅ Slots after current IST time are shown
- ✅ Works correctly regardless of server timezone

**Example at 2:00 PM IST:**

```
Morning: Should show 0 slots (all past)
Afternoon: Should show slots from 2:30 PM onwards
Evening: Should show all slots
```

**How to Verify:**

1. Check browser console for current time logs
2. Verify no slots before current time are shown
3. Verify slots after current time are shown

---

### Test 4: Future Date Slots ✅

**Objective:** Verify all slots shown for future dates

**Steps:**

1. Navigate to book-appointment page
2. Select a FUTURE date (tomorrow or later)
3. Check all time periods

**Expected Result:**

- ✅ All slots shown (no past filtering)
- ✅ Booked slots shown as disabled
- ✅ Available slots shown as clickable

---

### Test 5: All Slots Booked Scenario ✅

**Objective:** Verify UI when all slots are booked

**Steps:**

1. Find a date where all slots are booked (or book all slots)
2. Navigate to that date
3. Check the display

**Expected Result:**

- ✅ Shows "0 available / X total"
- ✅ All slots shown as grayed out
- ✅ All slots show "Booked" label
- ✅ No slots are clickable
- ✅ Clear message that no slots available

---

### Test 6: No Slots Available Scenario ✅

**Objective:** Verify UI when clinician has no schedule for the day

**Steps:**

1. Find a date where clinician has no availability rules
2. Navigate to that date
3. Check the display

**Expected Result:**

- ✅ Shows "No slots available" message
- ✅ No slot buttons displayed
- ✅ Clear indication to select another date

---

### Test 7: Booking Flow Integration ✅

**Objective:** Verify booking flow works end-to-end

**Steps:**

1. Navigate to book-appointment page
2. Select an available slot
3. Complete phone verification
4. Complete payment
5. Go back to same date/time

**Expected Result:**

- ✅ Previously selected slot now shows as "Booked"
- ✅ Slot is grayed out and not clickable
- ✅ Other slots remain available

---

### Test 8: Admin Panel Consistency ✅

**Objective:** Verify admin panel and frontend show same availability

**Steps:**

1. Open admin panel (mibo-admin)
2. Check clinician's schedule for a specific date
3. Open frontend book-appointment for same clinician/date
4. Compare slot availability

**Expected Result:**

- ✅ Both show same booked slots
- ✅ Both show same available slots
- ✅ Consistent availability across platforms

---

### Test 9: Timezone Edge Cases ✅

**Objective:** Verify timezone handling at day boundaries

**Test at 11:55 PM IST:**

1. Navigate to book-appointment page
2. Select TODAY
3. Check if any slots shown

**Expected Result:**

- ✅ No slots shown (all past)
- ✅ Message to select another date

**Test at 12:05 AM IST:**

1. Navigate to book-appointment page
2. Select TODAY (new day)
3. Check morning slots

**Expected Result:**

- ✅ All morning slots shown
- ✅ No past filtering (new day)

---

### Test 10: Multiple Periods Display ✅

**Objective:** Verify all time periods display correctly

**Steps:**

1. Select a date with slots in all periods
2. Check Morning, Afternoon, Evening sections

**Expected Result:**

- ✅ Each period shows correct slot count
- ✅ Each period shows available and booked slots
- ✅ Periods with no slots are hidden

---

### Test 11: Mobile Responsiveness ✅

**Objective:** Verify fixes work on mobile devices

**Steps:**

1. Open browser DevTools
2. Switch to mobile view (iPhone/Android)
3. Navigate to book-appointment page
4. Test slot selection

**Expected Result:**

- ✅ Booked slots visible and grayed out
- ✅ Slot count displays correctly
- ✅ Touch interactions work properly
- ✅ Disabled slots not tappable

---

### Test 12: Accessibility Testing ✅

**Objective:** Verify accessibility improvements

**Steps:**

1. Use screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to slot selection
3. Tab through slots

**Expected Result:**

- ✅ Screen reader announces "Booked" for disabled slots
- ✅ Disabled slots skipped in tab order
- ✅ Available slots focusable and selectable
- ✅ Clear audio feedback for slot status

---

## API Testing

### Test API 1: Available Slots Endpoint

**Endpoint:** `GET /api/booking/available-slots`

**Test Request:**

```bash
curl "http://localhost:5000/api/booking/available-slots?clinicianId=1&centreId=1&date=2026-05-26"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "date": "2026-05-26",
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "09:50",
        "available": true
      },
      {
        "startTime": "10:00",
        "endTime": "10:50",
        "available": false
      }
    ]
  }
}
```

**Verify:**

- ✅ Returns both available and booked slots
- ✅ `available` flag correctly set
- ✅ Past slots filtered out for today
- ✅ All slots returned for future dates

---

### Test API 2: Dates with Slots Endpoint

**Endpoint:** `GET /api/booking/dates-with-slots`

**Test Request:**

```bash
curl "http://localhost:5000/api/booking/dates-with-slots?clinicianId=1&centreId=1&startDate=2026-05-25&endDate=2026-06-25"
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-26",
      "slotCount": 5
    },
    {
      "date": "2026-05-27",
      "slotCount": 8
    }
  ]
}
```

**Verify:**

- ✅ Returns dates with available slots only
- ✅ Slot count is accurate
- ✅ Dates without available slots excluded

---

## Browser Console Checks

### Check 1: Timezone Calculation Logs

**Open browser console and look for:**

```
Fetching slots for clinician X, centre Y, date 2026-05-26
Current IST time: 14:30
Filtering past slots before: 14:30
```

**Verify:**

- ✅ IST time matches your actual local time
- ✅ Past slot filtering uses correct time

---

### Check 2: Slot Data Logs

**Look for slot data in console:**

```javascript
Available slots: [
  { start_time: "09:00", end_time: "09:50", available: true },
  { start_time: "10:00", end_time: "10:50", available: false }
]
```

**Verify:**

- ✅ All slots present in data
- ✅ `available` flag correctly set
- ✅ No slots missing from response

---

## Performance Testing

### Test: Slot Rendering Performance

**Steps:**

1. Open browser DevTools > Performance tab
2. Start recording
3. Navigate to book-appointment page
4. Select a date with many slots
5. Stop recording

**Expected Result:**

- ✅ Slot rendering < 100ms
- ✅ No layout thrashing
- ✅ Smooth animations
- ✅ No performance degradation

---

## Regression Testing

### Areas to Verify No Breaking Changes:

1. **Appointment Creation** ✅
   - Can still create appointments successfully
   - Payment flow works
   - Confirmation emails/SMS sent

2. **Admin Panel** ✅
   - Slot management still works
   - Blocking slots works
   - Viewing appointments works

3. **Other Booking Flows** ✅
   - Front desk booking works
   - Rescheduling works
   - Cancellation works

4. **Clinician Dashboard** ✅
   - Clinicians can view their appointments
   - Schedule management works

---

## Bug Verification Checklist

- [ ] ✅ Past slots correctly filtered using IST timezone
- [ ] ✅ Booked slots visible but disabled
- [ ] ✅ Slot count displays accurately
- [ ] ✅ No breaking changes to existing functionality
- [ ] ✅ API responses unchanged
- [ ] ✅ Mobile view works correctly
- [ ] ✅ Accessibility improved
- [ ] ✅ Performance acceptable
- [ ] ✅ Admin panel consistency maintained
- [ ] ✅ End-to-end booking flow works

---

## Known Issues / Limitations

1. **Timezone Configuration**
   - Currently hardcoded to IST (UTC+5:30)
   - Future: Make configurable per centre

2. **Real-time Updates**
   - Slots don't auto-refresh
   - User must manually refresh page
   - Future: Add WebSocket or polling

3. **DST Handling**
   - India doesn't observe DST, so not an issue
   - Future: Handle DST for international expansion

---

## Rollback Procedure

If critical issues found:

1. **Stop testing immediately**
2. **Document the issue**
3. **Rollback backend:**
   ```bash
   cd backend
   git checkout HEAD~1 src/services/appointment.services.ts
   npm run dev
   ```
4. **Rollback frontend:**
   ```bash
   cd mibo_version-2
   git checkout HEAD~1 src/pages/BookAppointment/Step1SessionDetails.tsx
   npm run dev
   ```

---

## Sign-off

**Tested By:** ********\_********
**Date:** ********\_********
**Status:** [ ] PASS [ ] FAIL
**Notes:** ********\_********

---

## Next Steps After Testing

1. ✅ All tests pass → Deploy to staging
2. ⚠️ Minor issues → Fix and retest
3. ❌ Critical issues → Rollback and investigate

---

**Testing Status:** ⏳ PENDING
**Last Updated:** 2026-05-25
