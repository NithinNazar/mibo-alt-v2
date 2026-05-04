# Slot Exception Hybrid System Implementation

## Overview

Implemented **Option A: Hybrid System** for managing clinician availability slots. This system allows admins to:

- Create recurring availability rules (e.g., "Every Monday 9:00-10:00")
- Block/delete individual slots without affecting other recurring slots
- Maintain the simplicity of rule-based scheduling while adding per-slot flexibility

---

## Architecture

### **Two-Tier System:**

1. **Availability Rules** (`clinician_availability_rules` table)
   - Defines recurring patterns: "Every Monday 9:00-10:00"
   - One rule applies to all matching days indefinitely
   - Fields: `day_of_week`, `start_time`, `end_time`, `mode`, `is_active`

2. **Slot Exceptions** (`clinician_slot_exceptions` table) **[NEW]**
   - Blocks specific slots without deleting the rule
   - One exception = one blocked date/time
   - Fields: `clinician_id`, `centre_id`, `exception_date`, `start_time`, `end_time`, `mode`, `reason`

---

## How It Works

### **Creating Slots:**

```
Admin adds "Monday 9:00-10:00" slot
↓
System creates availability rule: day_of_week=1, start_time=09:00, end_time=10:00
↓
Rule generates slots for ALL Mondays:
- May 5 (Mon) 9:00-10:00 ✓
- May 12 (Mon) 9:00-10:00 ✓
- May 19 (Mon) 9:00-10:00 ✓
- May 26 (Mon) 9:00-10:00 ✓
```

### **Deleting Individual Slots:**

```
Admin clicks delete on May 12 Monday 9:00-10:00
↓
System creates slot exception:
  clinician_id=58, exception_date='2026-05-12', start_time='09:00', mode='IN_PERSON'
↓
Slot generation excludes May 12:
- May 5 (Mon) 9:00-10:00 ✓ (visible)
- May 12 (Mon) 9:00-10:00 ✗ (blocked by exception)
- May 19 (Mon) 9:00-10:00 ✓ (visible)
- May 26 (Mon) 9:00-10:00 ✓ (visible)
```

### **Slot Generation Logic:**

```typescript
1. Get availability rules for the day (e.g., Monday rules)
2. Generate time slots from rules (9:00, 9:30, 10:00, etc.)
3. Get slot exceptions for the date range
4. Filter out slots that match exceptions
5. Return only non-blocked slots
```

---

## Database Changes

### **New Table: `clinician_slot_exceptions`**

```sql
CREATE TABLE clinician_slot_exceptions (
  id SERIAL PRIMARY KEY,
  clinician_id INTEGER NOT NULL REFERENCES clinician_profiles(id),
  centre_id INTEGER NOT NULL REFERENCES centres(id),
  exception_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  mode VARCHAR(20) NOT NULL,
  reason VARCHAR(255),
  created_by_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinician_id, centre_id, exception_date, start_time, mode)
);
```

**Indexes:**

- `idx_slot_exceptions_clinician_date` - Fast lookups when generating slots
- `idx_slot_exceptions_centre` - Filter by centre

---

## API Endpoints

### **1. Create Slot Exception (Block a Slot)**

```
POST /api/users/clinicians/:clinicianId/slot-exceptions
Authorization: Bearer {token}
Roles: ADMIN, MANAGER, CENTRE_MANAGER

Body:
{
  "centreId": 1,
  "exceptionDate": "2026-05-12",
  "startTime": "09:00",
  "endTime": "10:00",
  "mode": "IN_PERSON",
  "reason": "Blocked by admin" // optional
}

Response:
{
  "success": true,
  "message": "Slot blocked successfully",
  "data": { ...exception object }
}
```

### **2. Get Slot Exceptions**

```
GET /api/users/clinicians/:clinicianId/slot-exceptions?startDate=2026-05-01&endDate=2026-05-31&centreId=1
Authorization: Bearer {token}
Roles: ADMIN, MANAGER, CENTRE_MANAGER

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "clinician_id": 58,
      "centre_id": 1,
      "exception_date": "2026-05-12",
      "start_time": "09:00:00",
      "end_time": "10:00:00",
      "mode": "IN_PERSON",
      "reason": "Blocked by admin"
    }
  ]
}
```

### **3. Delete Slot Exception (Unblock a Slot)**

```
DELETE /api/users/clinicians/:clinicianId/slot-exceptions/:exceptionId
Authorization: Bearer {token}
Roles: ADMIN, MANAGER, CENTRE_MANAGER

Response:
{
  "success": true,
  "message": "Slot unblocked successfully"
}
```

---

## Frontend Changes

### **Delete Button Behavior:**

**Before:**

```typescript
// Deleted the entire availability rule
DELETE /users/clinicians/{id}/availability/{ruleId}
→ All Mondays deleted
```

**After:**

```typescript
// Creates a slot exception
POST /users/clinicians/{id}/slot-exceptions
Body: { centreId, exceptionDate, startTime, endTime, mode }
→ Only that specific Monday blocked
```

### **Updated Functions:**

1. **`handleConfirmDeleteSlot`** - Now creates exceptions instead of deleting rules
2. **`handleInitiateDeleteSlot`** - Removed ruleId validation (no longer needed)

---

## Files Modified

### **Backend:**

1. `backend/migrations/create_slot_exceptions_table.sql` - Database migration
2. `backend/src/repositories/staff.repository.ts` - Added exception methods
3. `backend/src/services/staff.service.ts` - Added exception service methods, updated slot generation
4. `backend/src/controllers/staff.controller.ts` - Added exception endpoints
5. `backend/src/routes/staff.routes.ts` - Added exception routes

### **Frontend:**

1. `mibo-admin/src/modules/staff/pages/CliniciansPage.tsx` - Updated delete logic

---

## Deployment Steps

### **1. Run Database Migration:**

```bash
# Connect to PostgreSQL
psql -U postgres -d mibo_db

# Run migration
\i backend/migrations/create_slot_exceptions_table.sql

# Verify table created
\d clinician_slot_exceptions
```

### **2. Deploy Backend:**

```bash
cd backend
npm run build
# Deploy to AWS Elastic Beanstalk
```

### **3. Deploy Admin Panel:**

```bash
cd mibo-admin
npm run build
# Upload to S3
# Invalidate CloudFront cache for /admin/*
```

---

## Testing Checklist

### **Test 1: Create Recurring Slots**

- [ ] Edit clinician
- [ ] Add Monday 9:00-10:00 slot
- [ ] Click "Update Clinician"
- [ ] Verify all Mondays show 9:00-10:00 slot

### **Test 2: Delete Individual Slot**

- [ ] Edit clinician with Monday slots
- [ ] Click delete on May 12 Monday 9:00-10:00
- [ ] Confirm deletion
- [ ] Verify May 12 slot disappears
- [ ] Verify other Mondays (May 5, 19, 26) still have slots

### **Test 3: Multiple Deletions**

- [ ] Delete May 5 Monday slot
- [ ] Delete May 19 Monday slot
- [ ] Verify only May 26 Monday slot remains
- [ ] Verify rule still exists (check database)

### **Test 4: Frontend Booking**

- [ ] Go to booking page
- [ ] Select clinician with blocked slots
- [ ] Verify blocked dates don't show slots
- [ ] Verify non-blocked dates show slots correctly

### **Test 5: Database Verification**

```sql
-- Check availability rules (should still exist)
SELECT * FROM clinician_availability_rules
WHERE clinician_id = 58 AND day_of_week = 1;

-- Check slot exceptions (should have blocked dates)
SELECT * FROM clinician_slot_exceptions
WHERE clinician_id = 58;
```

---

## Benefits

✅ **Maintains Simplicity** - Admin still creates "Monday 9am" easily
✅ **Adds Flexibility** - Can block individual dates (holidays, leave, etc.)
✅ **Scalable** - Doesn't create thousands of database records
✅ **User-Friendly** - No need to specify date ranges
✅ **Backward Compatible** - Existing availability rules work as before

---

## Future Enhancements

1. **Bulk Block** - Block all slots for a date range (e.g., vacation)
2. **Recurring Exceptions** - Block "Every 2nd Monday" (advanced)
3. **Exception Reasons** - UI to add/view reasons for blocking
4. **Unblock Feature** - UI to view and unblock previously blocked slots
5. **Audit Log** - Track who blocked/unblocked slots and when

---

## Troubleshooting

### **Slots still appearing after deletion:**

- Check if exception was created: `SELECT * FROM clinician_slot_exceptions WHERE clinician_id = X`
- Verify slot generation logic includes exception filtering
- Clear browser cache and refresh

### **All slots disappeared:**

- Check if availability rule was accidentally deleted: `SELECT * FROM clinician_availability_rules WHERE clinician_id = X AND is_active = TRUE`
- If rule deleted, recreate it from admin panel

### **Exception not blocking slot:**

- Verify exception date/time matches exactly (including timezone)
- Check mode matches (IN_PERSON vs ONLINE)
- Verify centre_id matches

---

## Summary

The Hybrid System successfully combines the simplicity of rule-based scheduling with the flexibility of per-slot management. Admins can now:

- Create recurring availability patterns effortlessly
- Block individual slots for holidays, leave, or special circumstances
- Maintain clean, scalable database architecture
- Provide better patient experience with accurate availability

**Status:** ✅ Implementation Complete - Ready for Testing
