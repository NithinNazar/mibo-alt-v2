# Mobile App API Issue - Resolution Summary

**Date**: May 13, 2026  
**Issue**: 400 Bad Request on `POST /api/booking/create`  
**Status**: ✅ RESOLVED

---

## 🔍 Root Cause

**Field name case mismatch:**

- Mobile app sent: `appointmentDateUtc` (lowercase 'u')
- Backend expected: `appointmentDateUTC` (uppercase 'UTC')

JavaScript destructuring failed to extract the field, causing validation to fail.

---

## ✅ Solution Applied

**Asked mobile developer to change field name to uppercase:**

- ❌ `appointmentDateUtc`
- ✅ `appointmentDateUTC`

---

## 📋 Correct Request Format

```json
{
  "clinicianId": "64",
  "centreId": "2",
  "appointmentDate": "2026-05-12",
  "appointmentTime": "10:00",
  "appointmentType": "IN_PERSON",
  "appointmentDateUTC": "2026-05-12T04:30:00.000Z"
}
```

**Note:** Extra fields like `startTime`, `endTime`, `consultationMode` are harmless (ignored by backend) but unnecessary.

---

## 📚 Documentation Updated

- ✅ `MIBO_MOBILE_APP_APIS.md` - Section 11 corrected
- ✅ `MOBILE_APP_API_FIX.md` - Detailed fix guide created

---

## 🎯 Why This Approach

1. **Web project is LIVE** - Already uses `appointmentDateUTC` (uppercase)
2. **Mobile app is in DEV** - Easy to change before launch
3. **Single source of truth** - One field name across all platforms
4. **No backend changes needed** - Zero risk to production

---

## 🔧 Technical Details

### Backend Flow:

1. Receives `appointmentDateUTC` (ISO 8601 timestamp)
2. Calculates `endTime` automatically from clinician's `default_consultation_duration_minutes`
3. Stores `scheduled_start_at` and `scheduled_end_at` in database

### Why endTime is not needed:

- Backend calculates it: `endTime = startTime + clinician.default_duration`
- Example: If clinician's session is 50 minutes, 10:00 → 10:50

---

## ✅ Testing Checklist for Mobile Dev

- [ ] Change `appointmentDateUtc` to `appointmentDateUTC`
- [ ] Test booking creation with valid token
- [ ] Verify appointment appears in `GET /booking/my-appointments`
- [ ] Test payment flow with Razorpay
- [ ] Verify Google Meet link generation (for ONLINE appointments)

---

## 📞 Contact

If issues persist after the fix:

- Check Authorization header (Bearer token)
- Verify `appointmentDateUTC` is valid ISO 8601 format
- Ensure `appointmentType` is exactly "ONLINE" or "IN_PERSON"

---

**Resolution**: Mobile dev will update field name. Monitor for any issues post-deployment.
