# Frontend Integration Summary

Quick reference for frontend developers integrating with the backend API.

---

## 📚 Essential Documents for Frontend Developers

### 1. **RAZORPAY_FRONTEND_INTEGRATION.md** ⭐

**For:** Payment integration in patient website
**Contains:**

- Complete payment flow with React examples
- Payment link generation
- Payment status checking
- Error handling
- Testing guide

**Key APIs:**

- `POST /api/payments/send-payment-link` - Generate payment link
- `GET /api/payments/link-status/:linkId` - Check payment status

---

### 2. **GALLABOX_FRONTEND_INTEGRATION.md** ⭐

**For:** WhatsApp notification triggers in patient website
**Contains:**

- Automatic WhatsApp notification flows
- Online appointment booking (auto-sends Meet link)
- Payment link (auto-sends to WhatsApp)
- Complete React examples
- Phone number validation

**Key APIs:**

- `POST /api/appointments` (type: ONLINE) - Auto-sends WhatsApp
- `POST /api/payments/send-payment-link` - Auto-sends WhatsApp

---

### 3. **ADMIN_PANEL_COMPLETE_GUIDE.md**

**For:** Admin panel UI integration
**Contains:**

- Authentication flows
- Protected routes
- Role-based access control
- React component examples
- State management

**Key APIs:**

- `POST /api/auth/login/*` - Authentication
- All CRUD operations for admin features

---

### 4. **API_REFERENCE.md**

**For:** Complete API documentation
**Contains:**

- All 60+ endpoints
- Request/response examples
- Authentication requirements
- Role permissions
- Validation rules

---

### 5. **api-requests.http**

**For:** API testing
**Contains:**

- 56 pre-configured requests
- Works with VS Code REST Client, Postman, Insomnia
- All authentication methods
- Complete workflow examples

---

## 🎯 Quick Integration Guide

### For Patient Website Developers

**Step 1: Read These Documents**

1. `RAZORPAY_FRONTEND_INTEGRATION.md` - Payment integration
2. `GALLABOX_FRONTEND_INTEGRATION.md` - WhatsApp notifications
3. `API_REFERENCE.md` - API reference

**Step 2: Implement Key Features**

1. Online appointment booking (auto-sends WhatsApp with Meet link)
2. Payment link generation (auto-sends WhatsApp)
3. Payment status checking
4. Appointment listing

**Step 3: Test**

1. Use `api-requests.http` for testing
2. Test with real phone numbers
3. Verify WhatsApp delivery
4. Test payment flow

---

### For Admin Panel Developers

**Step 1: Read These Documents**

1. `ADMIN_PANEL_COMPLETE_GUIDE.md` - Main integration guide
2. `API_REFERENCE.md` - API reference
3. `USER_ROLES_AND_PERMISSIONS.md` - Role permissions

**Step 2: Implement Key Features**

1. Authentication (3 login methods)
2. Protected routes
3. Role-based UI
4. CRUD operations for all entities

**Step 3: Test**

1. Use `api-requests.http` for testing
2. Test with different user roles
3. Verify permissions

---

## 🚀 Key Integration Points

### 1. Razorpay (Payments)

**What frontend does:**

```javascript
// Trigger payment link generation
POST /api/payments/send-payment-link
{
  "appointmentId": 1,
  "patientPhone": "+919876543210",
  "patientName": "John Doe"
}
```

**What backend does automatically:**

- ✅ Creates Razorpay payment link
- ✅ Sends WhatsApp to patient
- ✅ Handles payment verification
- ✅ Confirms appointment after payment

**Frontend shows:**

- "Payment link sent to your WhatsApp!"
- Payment status
- Success/failure messages

---

### 2. Gallabox (WhatsApp)

**What frontend does:**

```javascript
// Book online appointment
POST /api/appointments
{
  "appointment_type": "ONLINE",  // ← Triggers WhatsApp!
  "clinician_id": 1,
  "centre_id": 1,
  "scheduled_start_at": "2024-12-20T14:00:00Z"
}
```

**What backend does automatically:**

- ✅ Generates Google Meet link
- ✅ Sends WhatsApp to patient (with Meet link)
- ✅ Sends WhatsApp to doctor
- ✅ Sends WhatsApp to admins/managers

**Frontend shows:**

- "Appointment booked! Check WhatsApp for meeting link"
- Appointment confirmation
- Success message

---

## 📋 Common Workflows

### Workflow 1: Patient Books Online Appointment

```
Frontend → POST /api/appointments (type: ONLINE)
           ↓
Backend → Creates appointment
           ↓
Backend → Generates Google Meet link
           ↓
Backend → Sends WhatsApp to patient (with link)
           ↓
Backend → Sends WhatsApp to doctor
           ↓
Backend → Sends WhatsApp to admins
           ↓
Frontend ← Shows success message
```

**Frontend code:** See `GALLABOX_FRONTEND_INTEGRATION.md`

---

### Workflow 2: Patient Pays for Appointment

```
Frontend → POST /api/payments/send-payment-link
           ↓
Backend → Creates Razorpay payment link
           ↓
Backend → Sends WhatsApp to patient
           ↓
Frontend ← Shows "Link sent to WhatsApp"
           ↓
Patient → Clicks WhatsApp link
           ↓
Patient → Completes payment on Razorpay
           ↓
Razorpay → Sends webhook to backend
           ↓
Backend → Confirms appointment
           ↓
Frontend → GET /api/payments/link-status/:linkId
           ↓
Frontend ← Shows "Payment successful!"
```

**Frontend code:** See `RAZORPAY_FRONTEND_INTEGRATION.md`

---

## 🔑 Key APIs for Frontend

### Authentication

```
POST /api/auth/login/phone-password
POST /api/auth/login/phone-otp
POST /api/auth/login/username-password
POST /api/auth/refresh-token
POST /api/auth/logout
```

### Appointments

```
GET  /api/appointments
POST /api/appointments
GET  /api/appointments/:id
GET  /api/appointments/my-appointments (Doctor dashboard)
PUT  /api/appointments/:id/reschedule
PUT  /api/appointments/:id/status
DELETE /api/appointments/:id
```

### Payments

```
POST /api/payments/send-payment-link
GET  /api/payments/link-status/:linkId
POST /api/payments/webhook (Internal)
```

### Patients

```
GET  /api/patients
POST /api/patients
GET  /api/patients/:id
PUT  /api/patients/:id
```

### Staff (Clinicians)

```
GET  /api/staff/clinicians
POST /api/staff/clinicians
PUT  /api/staff/clinicians/:id
POST /api/staff/clinicians/:id/availability
```

---

## ⚠️ Important Notes

### 1. Phone Number Format

Always use international format:

- ✅ Correct: `+919876543210`
- ❌ Wrong: `9876543210`

### 2. WhatsApp is Automatic

- Don't call any WhatsApp API directly
- Backend sends WhatsApp automatically
- Just create appointment or send payment link

### 3. Payment Verification

- Always verify payment status on backend
- Don't trust frontend payment status alone
- Use `GET /api/payments/link-status/:linkId`

### 4. JWT Token

- Include in all authenticated requests
- Format: `Authorization: Bearer <token>`
- Token expires in 7 days (configurable)

---

## 🧪 Testing

### Test Environment

```
Base URL: http://localhost:3000
```

### Test Accounts

Create test users with different roles:

- ADMIN - Full access
- MANAGER - Manage operations
- CLINICIAN - View own appointments
- FRONT_DESK - Book appointments, send payment links
- PATIENT - Book appointments, view own records

### Test Phone Numbers

Use real phone numbers to test WhatsApp delivery

### Test Payment

Use Razorpay test mode:

- Test card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

## 📞 Support

### Need Help?

**For Payment Integration:**
→ Read `RAZORPAY_FRONTEND_INTEGRATION.md`

**For WhatsApp Integration:**
→ Read `GALLABOX_FRONTEND_INTEGRATION.md`

**For Admin Panel:**
→ Read `ADMIN_PANEL_COMPLETE_GUIDE.md`

**For API Details:**
→ Read `API_REFERENCE.md`

**For Testing:**
→ Use `api-requests.http`

---

## ✅ Integration Checklist

### Patient Website

- [ ] Read `RAZORPAY_FRONTEND_INTEGRATION.md`
- [ ] Read `GALLABOX_FRONTEND_INTEGRATION.md`
- [ ] Implement online appointment booking
- [ ] Implement payment link generation
- [ ] Implement payment status checking
- [ ] Add phone number validation
- [ ] Test WhatsApp delivery
- [ ] Test payment flow
- [ ] Handle errors gracefully

### Admin Panel

- [ ] Read `ADMIN_PANEL_COMPLETE_GUIDE.md`
- [ ] Implement authentication (3 methods)
- [ ] Implement protected routes
- [ ] Implement role-based UI
- [ ] Implement CRUD operations
- [ ] Test with different roles
- [ ] Verify permissions

---

## 🎯 Quick Links

| Document             | Purpose                 | Link                               |
| -------------------- | ----------------------- | ---------------------------------- |
| Razorpay Integration | Payment integration     | `RAZORPAY_FRONTEND_INTEGRATION.md` |
| Gallabox Integration | WhatsApp notifications  | `GALLABOX_FRONTEND_INTEGRATION.md` |
| Admin Panel Guide    | Admin panel integration | `ADMIN_PANEL_COMPLETE_GUIDE.md`    |
| API Reference        | Complete API docs       | `API_REFERENCE.md`                 |
| API Collection       | Testing                 | `api-requests.http`                |
| Permissions          | Role permissions        | `USER_ROLES_AND_PERMISSIONS.md`    |

---

**Happy Coding! 🚀**
