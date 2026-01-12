# Front Desk Staff Feature - Implementation Plan

## Current Status Analysis

### ✅ What's Already Working

**Admin Panel (mibo-admin):**

- ✅ FRONT_DESK role exists in types
- ✅ FrontDeskPage route configured
- ✅ Authentication system supports username+password login
- ✅ BookAppointmentPage exists with full booking flow
- ✅ Role-based access control in place

**Backend:**

- ✅ Razorpay payment link creation (`razorpayUtil.createPaymentLink()`)
- ✅ Gallabox WhatsApp messaging (`gallaboxUtil.sendPaymentLink()`)
- ✅ Staff management APIs
- ✅ Appointment booking APIs
- ✅ Authentication with username+password

### ❌ What's Missing

**Admin Panel:**

- ❌ FrontDeskPage is empty (placeholder only)
- ❌ No front desk staff creation UI
- ❌ No simplified booking interface for front desk
- ❌ No payment link sending feature in UI

**Backend:**

- ❌ No dedicated endpoint for sending payment links
- ❌ No front desk specific booking endpoint
- ❌ Staff service needs front desk creation method

---

## Implementation Plan

### Phase 1: Backend Implementation

#### 1.1 Staff Service - Add Front Desk Creation

**File:** `backend/src/services/staff.service.ts`

- Add `createFrontDeskStaff()` method
- Generate username and password
- Assign to specific centre

#### 1.2 Payment Controller - Add Payment Link Endpoint

**File:** `backend/src/controllers/payment.controller.ts`

- Add `sendPaymentLink()` endpoint
- Create payment link via Razorpay
- Send link via Gallabox WhatsApp
- Store payment link reference

#### 1.3 Booking Controller - Add Front Desk Booking

**File:** `backend/src/controllers/booking.controller.ts`

- Add `bookForPatient()` endpoint
- Allow booking without immediate payment
- Mark source as `ADMIN_FRONT_DESK`
- Return appointment with payment link option

#### 1.4 Routes

**File:** `backend/src/routes/payment.routes.ts`

- POST `/api/payment/send-link` - Send payment link to patient

**File:** `backend/src/routes/booking.routes.ts`

- POST `/api/booking/front-desk` - Book appointment for patient

---

### Phase 2: Admin Panel Implementation

#### 2.1 Front Desk Staff Management Page

**File:** `mibo-admin/src/modules/staff/pages/FrontDeskPage.tsx`

- List all front desk staff
- Create new front desk staff form
- Assign to centre
- Generate credentials
- Display username/password on creation

#### 2.2 Front Desk Booking Interface

**File:** `mibo-admin/src/modules/appointments/pages/FrontDeskBookingPage.tsx`

- Simplified booking flow for front desk
- Doctor availability view
- Available slots grid
- Booked slots view
- Patient phone number input
- Send payment link button

#### 2.3 Services

**File:** `mibo-admin/src/services/staffService.ts`

- Add `createFrontDeskStaff()` method

**File:** `mibo-admin/src/services/paymentService.ts`

- Add `sendPaymentLink()` method

#### 2.4 Router Update

**File:** `mibo-admin/src/router/index.tsx`

- Add `/front-desk-booking` route for front desk users

---

## Feature Flow

### Admin Creates Front Desk Staff

1. Admin goes to Staff > Front Desk
2. Clicks "Add Front Desk Staff"
3. Fills form: Name, Phone, Email, Assigned Centre
4. System generates username and password
5. Admin sees credentials (one-time display)
6. Staff can login with username+password

### Front Desk Staff Books Appointment

1. Front desk staff logs in with username+password
2. Sees simplified dashboard with:
   - Doctor availability calendar
   - Available slots
   - Booked slots
3. Patient calls front desk
4. Staff checks doctor availability
5. Staff selects doctor, date, time
6. Staff enters patient phone number
7. Staff books appointment
8. System shows "Send Payment Link" button
9. Staff clicks button
10. System:
    - Creates Razorpay payment link
    - Sends link via WhatsApp (Gallabox)
    - Shows confirmation

---

## API Endpoints to Create

### Backend

```typescript
// POST /api/staff/front-desk
{
  "name": "John Doe",
  "phone": "919876543210",
  "email": "john@example.com",
  "centreId": 1
}
Response: {
  "user": {...},
  "credentials": {
    "username": "frontdesk_john_doe",
    "password": "generated_password"
  }
}

// POST /api/booking/front-desk
{
  "clinicianId": 1,
  "centreId": 1,
  "patientPhone": "919876543210",
  "patientName": "Patient Name",
  "appointmentType": "IN_PERSON",
  "scheduledStartAt": "2026-01-15T10:00:00Z",
  "durationMinutes": 30
}
Response: {
  "appointment": {...},
  "paymentRequired": true,
  "amount": 1000
}

// POST /api/payment/send-link
{
  "appointmentId": 123,
  "patientPhone": "919876543210",
  "patientName": "Patient Name"
}
Response: {
  "paymentLink": "https://rzp.io/l/xxxxx",
  "whatsappSent": true,
  "expiresAt": "2026-01-16T10:00:00Z"
}
```

---

## Database Changes

### payments table

- Add `payment_link_id` column (VARCHAR)
- Add `payment_link_url` column (TEXT)
- Add `payment_link_sent_at` column (TIMESTAMP)

---

## Security Considerations

1. ✅ Front desk staff can only see their assigned centre
2. ✅ Front desk staff cannot access admin features
3. ✅ Payment links expire after 24 hours
4. ✅ Phone numbers validated before sending
5. ✅ Rate limiting on payment link sending

---

## Testing Checklist

- [ ] Admin can create front desk staff
- [ ] Front desk staff can login
- [ ] Front desk staff sees only their centre
- [ ] Front desk can view doctor availability
- [ ] Front desk can book appointments
- [ ] Payment link is created successfully
- [ ] WhatsApp message is sent via Gallabox
- [ ] Payment link works in Razorpay
- [ ] Payment confirmation updates appointment status

---

## Implementation Order

1. ✅ Backend: Add payment link endpoint
2. ✅ Backend: Add front desk booking endpoint
3. ✅ Backend: Add front desk staff creation
4. ✅ Admin Panel: Front desk staff management page
5. ✅ Admin Panel: Front desk booking interface
6. ✅ Admin Panel: Payment link sending UI
7. ✅ Testing: End-to-end flow
8. ✅ Documentation: User guide for front desk staff

---

**Status:** Ready to implement
**Estimated Time:** 3-4 hours
**Priority:** High
