# Slot APIs Reference Guide

## APIs to Get Slots for Clinicians

### 1. Get Clinician Time Slots (Main API)

**Endpoint:** `GET /api/clinicians/:id/slots`

**Location:**

- Route: `backend/src/routes/staff.routes.ts` (line 104)
- Controller: `backend/src/controllers/staff.controller.ts` (line 309)
- Service: `backend/src/services/staff.service.ts` (line 621)

**Authentication:** PUBLIC (no authentication required)

**Parameters:**

- `id` (path parameter) - Clinician ID
- `date` (query parameter, required) - Date in YYYY-MM-DD format
- `centreId` (query parameter, optional) - Centre ID to filter by specific centre

**Response:** Array of time slots with availability status

**Example Request:**

```
GET /api/clinicians/71/slots?date=2026-04-15&centreId=1
```

**How it works:**

1. Checks if clinician exists
2. Gets day of week from the date
3. Fetches availability rules for that day
4. Gets booked appointments for that date
5. Generates time slots based on availability rules
6. Marks slots as available/booked based on existing appointments

---

### 2. Get Available Slots (Booking API)

**Endpoint:** `GET /api/booking/available-slots`

**Location:**

- Route: `backend/src/routes/booking.routes.ts` (line 25)
- Controller: `backend/src/controllers/booking.controller.ts` (line 213)
- Service: `backend/src/services/booking.service.ts` (line 351)

**Authentication:** PUBLIC (no authentication required)

**Parameters:**

- `clinicianId` (query parameter, required)
- `centreId` (query parameter, required)
- `date` (query parameter, required) - YYYY-MM-DD format

**Response:** Array of available time slots (only shows available slots, not booked ones)

**Example Request:**

```
GET /api/booking/available-slots?clinicianId=71&centreId=1&date=2026-04-15
```

---

### 3. Get Dates with Available Slots

**Endpoint:** `GET /api/booking/dates-with-slots`

**Location:**

- Route: `backend/src/routes/booking.routes.ts` (line 35)
- Controller: `backend/src/controllers/booking.controller.ts` (line 251)
- Service: `backend/src/services/booking.service.ts` (line 392)

**Authentication:** PUBLIC (no authentication required)

**Parameters:**

- `clinicianId` (query parameter, required)
- `centreId` (query parameter, required)
- `startDate` (query parameter, required) - YYYY-MM-DD format
- `endDate` (query parameter, required) - YYYY-MM-DD format

**Response:** Array of dates that have at least one available slot

**Example Request:**

```
GET /api/booking/dates-with-slots?clinicianId=71&centreId=1&startDate=2026-04-15&endDate=2026-04-30
```

---

### 4. Check Clinician Availability (Appointment API)

**Endpoint:** `GET /api/appointments/availability`

**Location:**

- Route: `backend/src/routes/appointment.routes.ts`
- Controller: `backend/src/controllers/appointment.controller.ts` (line 139)
- Service: `backend/src/services/appointment.services.ts`

**Authentication:** Required (authMiddleware)

**Parameters:**

- `clinician_id` (query parameter, required)
- `centre_id` (query parameter, required)
- `date` (query parameter, required) - YYYY-MM-DD format

**Response:** Availability information with time slots

**Example Request:**

```
GET /api/appointments/availability?clinician_id=71&centre_id=1&date=2026-04-15
```

---

### 5. Get Blocked Slots (Admin API)

**Endpoint:** `GET /api/admin/slots/blocked`

**Location:**

- Route: `backend/src/routes/slot-blocking.routes.ts` (line 59)
- Controller: `backend/src/controllers/slot-blocking.controller.ts` (line 291)
- Service: `backend/src/services/slot-blocking.service.ts`
- Repository: `backend/src/repositories/slot.repository.ts`

**Authentication:** Required (authMiddleware)

**Parameters:**

- `clinicianId` (query parameter, optional)
- `centreId` (query parameter, optional)
- `date` (query parameter, optional) - YYYY-MM-DD format
- `blocked_by_admin_id` (query parameter, optional)

**Response:** Array of blocked slots with details

**Example Request:**

```
GET /api/admin/slots/blocked?clinicianId=71&date=2026-04-15
```

---

## Repository Methods

### Slot Repository

**File:** `backend/src/repositories/slot.repository.ts`

**Key Methods:**

1. `findSlotsByClinicianAndDate(clinicianId, date)` - Find all slots for a clinician on a specific date
2. `findBlockedSlots(filters)` - Find blocked slots with various filters
3. `blockSlot(slotData)` - Block a specific slot
4. `unblockSlot(slotId)` - Unblock a slot

---

## Frontend Services

### Patient Frontend (mibo_version-2)

**File:** `mibo_version-2/src/services/appointmentService.ts`

**Method:** `getAvailableSlots(clinicianId, centreId, date)`

- Calls: `GET /api/booking/available-slots`

### Admin Panel (mibo-admin)

**File:** `mibo-admin/src/services/slotBlockingService.ts`

**Methods:**

- `getBlockedSlots(filters)` - Get blocked slots
- `blockSlot(slotData)` - Block a slot
- `unblockSlot(slotId)` - Unblock a slot
- `blockDaySlots(data)` - Block all slots for a day

**File:** `mibo-admin/src/services/clinicianService.ts`

- Methods for managing clinician data and availability

---

## Quick Reference

### To get all slots for a clinician on a specific date:

```
GET /api/clinicians/:id/slots?date=YYYY-MM-DD&centreId=1
```

### To get only available (bookable) slots:

```
GET /api/booking/available-slots?clinicianId=71&centreId=1&date=YYYY-MM-DD
```

### To get dates with availability in a range:

```
GET /api/booking/dates-with-slots?clinicianId=71&centreId=1&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

### To get blocked slots (admin only):

```
GET /api/admin/slots/blocked?clinicianId=71&date=YYYY-MM-DD
```

---

## Data Flow

```
Frontend Request
    ↓
Route Handler (staff.routes.ts)
    ↓
Controller (staff.controller.ts)
    ↓
Service (staff.service.ts)
    ↓
Repository (staff.repository.ts)
    ↓
Database Query
    ↓
Response with Slots
```

---

## Database Tables Involved

1. **clinician_profiles** - Clinician information
2. **availability_rules** - Clinician availability schedule (stored as JSONB in clinician_profiles)
3. **appointments** - Booked appointments
4. **slots** - Blocked/unavailable slots
5. **centres** - Centre information

---

## Notes

- The main API for getting all slots (available + booked) is `/api/clinicians/:id/slots`
- This API is PUBLIC and doesn't require authentication
- It generates slots dynamically based on availability rules
- It checks existing appointments to mark slots as booked
- It respects blocked slots from the slot blocking feature
- The `centreId` parameter is optional but recommended for multi-centre clinicians
