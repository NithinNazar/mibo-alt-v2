# Appointment Cancellation Feature

## Overview

Comprehensive appointment cancellation system with admin approval workflow and Razorpay refund integration.

---

## ✅ Frontend Implementation (COMPLETED)

### Patient Dashboard Updates

**File**: `mibo_version-2/src/pages/profileDashboard/PatientDashboard.tsx`

#### Features Implemented:

1. **Cancel Appointment Button**

   - Shown only for active appointments
   - Hidden when cancellation is already requested or appointment is cancelled
   - Red styling with XCircle icon

2. **Cancellation Modal**

   - Confirmation dialog with warning message
   - Required reason input (textarea)
   - Note about admin approval and refund timeline
   - Loading state during API call
   - Error handling

3. **Status Display**

   - Green "Confirmed" for active appointments
   - Yellow "Cancellation Requested" for pending cancellations
   - Red "Cancelled" for cancelled appointments
   - Dynamic status messages

4. **UI Updates**
   - Immediate reflection of cancellation status
   - Yellow badge showing "Cancellation pending admin approval"
   - Updated help text based on status

#### API Call:

```typescript
POST http://localhost:5000/api/patient/appointments/:appointmentId/cancel
Headers: Authorization: Bearer {accessToken}
Body: { reason: string }
```

#### State Management:

- Updates `booking` state immediately
- Saves updated booking to localStorage
- Shows cancellation status in UI

---

## 🔧 Backend Implementation (TODO)

### 1. Create Cancellation API Endpoint

**File**: `backend/src/routes/patient-dashboard.routes.ts`

```typescript
router.post(
  "/appointments/:appointmentId/cancel",
  authMiddleware,
  patientDashboardController.cancelAppointment
);
```

### 2. Controller Method

**File**: `backend/src/controllers/patient-dashboard.controller.ts`

```typescript
async cancelAppointment(req: Request, res: Response) {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Validate appointment belongs to user
    // Update appointment status to 'CANCELLATION_REQUESTED'
    // Store cancellation reason
    // Create admin notification
    // Return success response
  } catch (error) {
    // Handle errors
  }
}
```

### 3. Database Updates

**Update appointments table**:

```sql
ALTER TABLE appointments
ADD COLUMN cancellation_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN cancellation_reason TEXT,
ADD COLUMN cancellation_requested_at TIMESTAMP,
ADD COLUMN cancellation_approved_by INTEGER REFERENCES users(id),
ADD COLUMN cancellation_approved_at TIMESTAMP,
ADD COLUMN refund_status VARCHAR(50) DEFAULT 'PENDING',
ADD COLUMN refund_amount DECIMAL(10,2),
ADD COLUMN refund_transaction_id VARCHAR(255);
```

**Create notifications table** (if not exists):

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Admin Panel Integration

**File**: `mibo-admin/src/modules/appointments/pages/CancellationRequests.tsx` (NEW)

#### Features Needed:

1. **List View**

   - Show all pending cancellation requests
   - Display patient name, appointment details, reason
   - Sort by request date

2. **Detail View**

   - Full appointment information
   - Cancellation reason
   - Payment details
   - Approve/Reject buttons

3. **Actions**
   - Approve cancellation → Trigger refund
   - Reject cancellation → Notify patient
   - Add admin notes

### 5. Razorpay Refund Integration

**File**: `backend/src/services/refund.service.ts` (NEW)

```typescript
class RefundService {
  async processRefund(appointmentId: number, adminId: number) {
    // 1. Get payment details from database
    // 2. Calculate refund amount (full or partial based on policy)
    // 3. Call Razorpay refund API
    // 4. Update appointment status to 'CANCELLED'
    // 5. Update refund_status to 'PROCESSED'
    // 6. Store refund transaction ID
    // 7. Notify patient via WhatsApp/Email
    // 8. Create audit log
  }
}
```

**Razorpay Refund API**:

```typescript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const refund = await razorpay.payments.refund(paymentId, {
  amount: refundAmount, // in paise
  notes: {
    appointmentId: appointmentId,
    reason: cancellationReason,
  },
});
```

---

## Workflow

### Patient Side:

1. Patient clicks "Cancel Appointment"
2. Modal opens with reason input
3. Patient enters reason and confirms
4. API call to backend
5. Status updates to "Cancellation Requested"
6. Yellow badge shows "Pending admin approval"

### Admin Side:

1. Admin receives notification
2. Admin opens cancellation request
3. Reviews appointment details and reason
4. Decides to approve or reject
5. If approved:
   - Razorpay refund is initiated
   - Appointment status → CANCELLED
   - Patient notified
6. If rejected:
   - Appointment remains active
   - Patient notified with reason

### Refund Process:

1. Admin approves cancellation
2. Backend calculates refund amount
3. Razorpay refund API called
4. Refund processed (3-5 business days)
5. Status updated in database
6. Patient notified via WhatsApp/Email

---

## Database Schema

### appointments table (additions):

```sql
cancellation_requested: BOOLEAN
cancellation_reason: TEXT
cancellation_requested_at: TIMESTAMP
cancellation_approved_by: INTEGER (FK to users)
cancellation_approved_at: TIMESTAMP
refund_status: VARCHAR(50) -- PENDING, PROCESSING, PROCESSED, FAILED
refund_amount: DECIMAL(10,2)
refund_transaction_id: VARCHAR(255)
```

### notifications table:

```sql
id: SERIAL PRIMARY KEY
user_id: INTEGER (FK to users)
type: VARCHAR(50) -- CANCELLATION_REQUEST, REFUND_PROCESSED, etc.
title: VARCHAR(255)
message: TEXT
data: JSONB -- Additional data (appointmentId, etc.)
is_read: BOOLEAN
created_at: TIMESTAMP
```

---

## API Endpoints

### Patient Endpoints:

- `POST /api/patient/appointments/:id/cancel` - Request cancellation
- `GET /api/patient/appointments/:id/cancellation-status` - Check status

### Admin Endpoints:

- `GET /api/admin/cancellation-requests` - List all requests
- `GET /api/admin/cancellation-requests/:id` - Get details
- `POST /api/admin/cancellation-requests/:id/approve` - Approve & refund
- `POST /api/admin/cancellation-requests/:id/reject` - Reject request

---

## Notifications

### WhatsApp Notifications (via Gallabox):

1. **To Patient**:

   - Cancellation request received
   - Cancellation approved
   - Refund processed
   - Cancellation rejected

2. **To Admin**:
   - New cancellation request
   - Urgent: Appointment in < 24 hours

### Email Notifications:

- Same as WhatsApp (backup channel)

---

## Refund Policy

### Full Refund:

- Cancellation > 24 hours before appointment
- Medical emergency (with proof)

### Partial Refund (50%):

- Cancellation 12-24 hours before appointment

### No Refund:

- Cancellation < 12 hours before appointment
- No-show

**Implementation**: Add policy logic in `RefundService.calculateRefundAmount()`

---

## Testing Checklist

### Frontend:

- [ ] Cancel button appears for active appointments
- [ ] Modal opens with reason input
- [ ] API call succeeds
- [ ] Status updates immediately
- [ ] Yellow badge shows for pending
- [ ] Error handling works
- [ ] Modal closes after success

### Backend:

- [ ] API endpoint validates user ownership
- [ ] Cancellation reason is stored
- [ ] Status updates correctly
- [ ] Admin notification created
- [ ] Duplicate requests prevented

### Admin Panel:

- [ ] Notifications appear
- [ ] Request list loads
- [ ] Details view shows all info
- [ ] Approve triggers refund
- [ ] Reject updates status
- [ ] Patient notified

### Refund:

- [ ] Razorpay API called correctly
- [ ] Refund amount calculated per policy
- [ ] Transaction ID stored
- [ ] Status updated
- [ ] Patient notified

---

## Next Steps

1. **Create backend API endpoint** for cancellation request
2. **Update database schema** with new columns
3. **Create admin notification system**
4. **Build admin cancellation approval UI**
5. **Implement Razorpay refund service**
6. **Add WhatsApp/Email notifications**
7. **Test end-to-end workflow**

---

## Files Modified

### Frontend:

- `mibo_version-2/src/pages/profileDashboard/PatientDashboard.tsx`

### Backend (TODO):

- `backend/src/routes/patient-dashboard.routes.ts`
- `backend/src/controllers/patient-dashboard.controller.ts`
- `backend/src/services/refund.service.ts` (NEW)
- `backend/src/utils/razorpay.ts` (add refund methods)
- Database migration file (NEW)

### Admin Panel (TODO):

- `mibo-admin/src/modules/appointments/pages/CancellationRequests.tsx` (NEW)
- `mibo-admin/src/components/NotificationBell.tsx` (UPDATE)

---

**Status**: Frontend ✅ Complete | Backend ⏳ Pending | Admin Panel ⏳ Pending
**Date**: January 3, 2026
