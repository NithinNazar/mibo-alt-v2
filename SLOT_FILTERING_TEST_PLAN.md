# Slot Filtering - Test Plan

## 🧪 **COMPREHENSIVE TEST PLAN**

---

## **PRE-TESTING SETUP**

### **1. Start Servers**

```bash
# Backend
cd c:\Users\nithi\Desktop\backend_mibo\backend
npm run dev

# Frontend
cd c:\Users\nithi\Desktop\host_test\mibo-v2\mibo_version-2
npm run dev
```

### **2. Prepare Test Data**

- Ensure at least one clinician has availability rules
- Create some booked appointments for testing
- Note current IST time for testing

---

## **TEST SUITE 1: BOOKED SLOTS HIDDEN** 🚫

### **Test 1.1: Booked Slot Not Visible**

**Objective:** Verify booked slots are completely hidden

**Steps:**

1. Book a slot for 3:00 PM today
2. Refresh booking page
3. Navigate to book-appointment for same clinician
4. Select today's date

**Expected Result:**

- ✅ 3:00 PM slot is NOT visible in the UI
- ✅ No grayed-out button for 3:00 PM
- ✅ No "Booked" label shown
- ✅ Slot count doesn't include booked slot

**Pass Criteria:**

- [ ] Booked slot completely absent from UI
- [ ] No visual indication of booked slot

---

### **Test 1.2: Multiple Booked Slots**

**Objective:** Verify multiple booked slots are hidden

**Steps:**

1. Book slots: 10:00 AM, 11:00 AM, 2:00 PM
2. Refresh booking page
3. Check morning and afternoon periods

**Expected Result:**

- ✅ All three booked slots are hidden
- ✅ Only unbooked slots visible
- ✅ Slot count accurate (excludes booked)

**Pass Criteria:**

- [ ] All booked slots hidden
- [ ] Slot count correct

---

## **TEST SUITE 2: 30-MINUTE BUFFER** ⏰

### **Test 2.1: Slot Exactly 30 Minutes Away**

**Objective:** Verify slot at exactly 30-minute threshold is SHOWN

**Setup:**

- Current time: 2:00 PM IST
- Test slot: 2:30 PM (unbooked)

**Steps:**

1. Set system time to 2:00 PM (or test at actual 2:00 PM)
2. Open booking page
3. Select today's date
4. Check if 2:30 PM slot is visible

**Expected Result:**

- ✅ 2:30 PM slot IS VISIBLE (exactly 30 mins = shown)

**Pass Criteria:**

- [ ] Slot at exactly 30 minutes is shown

---

### **Test 2.2: Slot 29 Minutes Away**

**Objective:** Verify slot < 30 minutes away is HIDDEN

**Setup:**

- Current time: 2:01 PM IST
- Test slot: 2:30 PM (unbooked)

**Steps:**

1. Set system time to 2:01 PM
2. Open booking page
3. Select today's date
4. Check if 2:30 PM slot is visible

**Expected Result:**

- ✅ 2:30 PM slot IS HIDDEN (29 mins < 30 mins)

**Pass Criteria:**

- [ ] Slot less than 30 minutes away is hidden

---

### **Test 2.3: Slot 31 Minutes Away**

**Objective:** Verify slot > 30 minutes away is SHOWN

**Setup:**

- Current time: 1:59 PM IST
- Test slot: 2:30 PM (unbooked)

**Steps:**

1. Set system time to 1:59 PM
2. Open booking page
3. Select today's date
4. Check if 2:30 PM slot is visible

**Expected Result:**

- ✅ 2:30 PM slot IS VISIBLE (31 mins > 30 mins)

**Pass Criteria:**

- [ ] Slot more than 30 minutes away is shown

---

### **Test 2.4: Multiple Slots Near Threshold**

**Objective:** Verify correct filtering of multiple slots

**Setup:**

- Current time: 2:00 PM IST
- Test slots: 2:15 PM, 2:25 PM, 2:30 PM, 2:45 PM, 3:00 PM

**Expected Result:**

```
❌ 2:15 PM - HIDDEN (15 mins away)
❌ 2:25 PM - HIDDEN (25 mins away)
✅ 2:30 PM - SHOWN (30 mins away)
✅ 2:45 PM - SHOWN (45 mins away)
✅ 3:00 PM - SHOWN (60 mins away)
```

**Pass Criteria:**

- [ ] Only slots ≥ 30 minutes away are shown
- [ ] Slots < 30 minutes away are hidden

---

## **TEST SUITE 3: TIMEZONE ACCURACY** 🌍

### **Test 3.1: IST Timezone Calculation**

**Objective:** Verify filtering uses IST, not server time

**Steps:**

1. Check server timezone (may be UTC)
2. Note current IST time
3. Open browser console
4. Check slot filtering logs

**Expected Result:**

- ✅ Filtering uses IST time
- ✅ Correct slots hidden/shown based on IST
- ✅ Not affected by server timezone

**Pass Criteria:**

- [ ] Slot filtering matches IST time
- [ ] Console logs show IST calculations

---

### **Test 3.2: Midnight Boundary**

**Objective:** Verify day overflow handled correctly

**Setup:**

- Current time: 11:45 PM IST
- Test slot: 12:15 AM next day

**Expected Result:**

- ✅ Correctly calculates time difference
- ✅ Handles day boundary with modulo operation

**Pass Criteria:**

- [ ] No errors at midnight
- [ ] Correct slot visibility

---

## **TEST SUITE 4: FUTURE DATES** 📅

### **Test 4.1: Future Date Shows All Unbooked Slots**

**Objective:** Verify 30-minute rule only applies to today

**Steps:**

1. Select tomorrow's date
2. Check all time periods

**Expected Result:**

- ✅ ALL unbooked slots are visible
- ✅ No 30-minute filtering applied
- ✅ Only booked slots are hidden

**Pass Criteria:**

- [ ] All unbooked slots shown for future dates
- [ ] Booked slots still hidden

---

### **Test 4.2: Next Week Date**

**Objective:** Verify future dates work correctly

**Steps:**

1. Select date 7 days from now
2. Check slot availability

**Expected Result:**

- ✅ All unbooked slots visible
- ✅ No time-based filtering

**Pass Criteria:**

- [ ] Future dates show all unbooked slots

---

## **TEST SUITE 5: SLOT COUNT DISPLAY** 🔢

### **Test 5.1: Slot Count Accuracy**

**Objective:** Verify slot count matches visible slots

**Setup:**

- Morning: 5 slots (2 booked, 1 < 30 mins away, 2 available)

**Expected Result:**

- ✅ Shows "Morning (2 slots)"
- ✅ Count matches visible buttons
- ✅ Doesn't include booked or hidden slots

**Pass Criteria:**

- [ ] Slot count = number of visible buttons
- [ ] Count updates correctly

---

## **TEST SUITE 6: BOOKING FLOW** 🎫

### **Test 6.1: Book Available Slot**

**Objective:** Verify booking flow works with new filtering

**Steps:**

1. Select an available slot (> 30 mins away)
2. Complete phone verification
3. Complete payment
4. Return to booking page

**Expected Result:**

- ✅ Booking succeeds
- ✅ Previously selected slot now hidden (booked)
- ✅ Other slots still visible

**Pass Criteria:**

- [ ] Booking completes successfully
- [ ] Booked slot disappears from UI

---

### **Test 6.2: Attempt to Book Hidden Slot**

**Objective:** Verify backend validates slot availability

**Steps:**

1. Use browser DevTools to modify form
2. Try to submit booking for hidden slot
3. Check backend response

**Expected Result:**

- ✅ Backend rejects booking
- ✅ Error message shown
- ✅ No appointment created

**Pass Criteria:**

- [ ] Backend validation prevents invalid bookings

---

## **TEST SUITE 7: EDGE CASES** 🔍

### **Test 7.1: All Slots Booked**

**Objective:** Verify UI when no slots available

**Steps:**

1. Book all slots for a date
2. Navigate to that date

**Expected Result:**

- ✅ No slots shown
- ✅ Message: "No available slots for this date"
- ✅ Prompt to select another date

**Pass Criteria:**

- [ ] Clear message when no slots available
- [ ] No broken UI

---

### **Test 7.2: All Slots < 30 Minutes Away**

**Objective:** Verify UI when all remaining slots too soon

**Setup:**

- Current time: 4:30 PM
- Last slot: 4:45 PM (15 mins away)

**Expected Result:**

- ✅ No slots shown for today
- ✅ Message suggests selecting future date

**Pass Criteria:**

- [ ] Clear messaging
- [ ] No confusion

---

### **Test 7.3: Slot Disappears While Browsing**

**Objective:** Verify behavior when time passes

**Steps:**

1. At 2:00 PM, see 2:30 PM slot
2. Wait until 2:01 PM
3. Refresh page

**Expected Result:**

- ✅ 2:30 PM slot now hidden
- ✅ No errors
- ✅ Other slots still visible

**Pass Criteria:**

- [ ] Graceful handling of time passage
- [ ] No broken state

---

## **TEST SUITE 8: PERFORMANCE** ⚡

### **Test 8.1: Slot Rendering Performance**

**Objective:** Verify filtering doesn't slow down UI

**Steps:**

1. Open DevTools > Performance
2. Record while loading booking page
3. Check rendering time

**Expected Result:**

- ✅ Slot rendering < 100ms
- ✅ No layout thrashing
- ✅ Smooth user experience

**Pass Criteria:**

- [ ] Fast rendering
- [ ] No performance degradation

---

## **TEST SUITE 9: MOBILE TESTING** 📱

### **Test 9.1: Mobile Slot Display**

**Objective:** Verify filtering works on mobile

**Steps:**

1. Open on mobile device or DevTools mobile view
2. Test slot selection
3. Verify filtering behavior

**Expected Result:**

- ✅ Slots filter correctly on mobile
- ✅ Touch interactions work
- ✅ Responsive layout maintained

**Pass Criteria:**

- [ ] Mobile functionality intact
- [ ] No mobile-specific issues

---

## **TEST SUITE 10: INTEGRATION** 🔗

### **Test 10.1: Admin Panel Consistency**

**Objective:** Verify admin panel shows all slots

**Steps:**

1. Open admin panel
2. Check clinician schedule
3. Compare with frontend

**Expected Result:**

- ✅ Admin panel shows ALL slots (including booked)
- ✅ Frontend shows only available slots
- ✅ Data consistency maintained

**Pass Criteria:**

- [ ] Admin panel unaffected
- [ ] Data matches between systems

---

## **REGRESSION TESTING** 🔄

### **Areas to Verify No Breaking Changes:**

1. **Appointment Creation** ✅
   - [ ] Can create appointments successfully
   - [ ] Payment flow works
   - [ ] Confirmations sent

2. **Slot Management** ✅
   - [ ] Admin can block slots
   - [ ] Blocked slots hidden from frontend
   - [ ] Availability rules work

3. **Other Booking Flows** ✅
   - [ ] Front desk booking works
   - [ ] Rescheduling works
   - [ ] Cancellation works

4. **Clinician Dashboard** ✅
   - [ ] Clinicians see their appointments
   - [ ] Schedule management works

---

## **FINAL VERIFICATION CHECKLIST** ✅

- [ ] ✅ Booked slots completely hidden
- [ ] ✅ Unbooked slots < 30 mins hidden (today only)
- [ ] ✅ Future dates show all unbooked slots
- [ ] ✅ Timezone uses IST correctly
- [ ] ✅ Slot count accurate
- [ ] ✅ No TypeScript errors
- [ ] ✅ No console errors
- [ ] ✅ Booking flow works
- [ ] ✅ Admin panel unaffected
- [ ] ✅ Mobile works correctly
- [ ] ✅ Performance acceptable
- [ ] ✅ Edge cases handled

---

## **SIGN-OFF**

**Tested By:** ********\_********
**Date:** ********\_********
**Environment:** [ ] Local [ ] Staging [ ] Production
**Status:** [ ] PASS [ ] FAIL
**Notes:** ********\_********

---

**Test Status:** ⏳ PENDING
**Last Updated:** 2026-05-25
