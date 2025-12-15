# API Collection Guide

Complete guide for using the API collection with various tools.

---

## 📁 Available Files

### 1. api-requests.http

**REST Client format** - Works with:

- VS Code REST Client extension
- IntelliJ IDEA HTTP Client
- Can be imported into Postman
- Can be imported into Insomnia

**Contains:**

- 56 pre-configured API requests
- All authentication methods
- All CRUD operations
- Complete workflow examples
- Environment variables

---

## 🚀 Quick Start

### Option 1: VS Code REST Client (Recommended)

**Step 1: Install Extension**

1. Open VS Code
2. Install "REST Client" extension by Huachao Mao
3. Open `api-requests.http`

**Step 2: Configure Variables**
Edit the variables at the top of the file:

```http
@baseUrl = http://localhost:3000
@token = your-jwt-token-here
```

**Step 3: Send Requests**

- Click "Send Request" above any request
- Or use keyboard shortcut: `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (Mac)

**Step 4: Save Token**
After login, copy the JWT token from response and update `@token` variable

---

### Option 2: Import into Postman

**Step 1: Convert to Postman Collection**

1. Open Postman
2. Click "Import"
3. Select "Raw text"
4. Paste content from `api-requests.http`
5. Postman will auto-convert to collection

**Step 2: Set Environment Variables**

1. Create new environment in Postman
2. Add variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (leave empty, will be set after login)

**Step 3: Use Collection**

- Requests are organized by category
- Token is automatically added to headers
- Update `token` variable after login

---

### Option 3: Import into Insomnia

**Step 1: Import**

1. Open Insomnia
2. Click "Import/Export" → "Import Data"
3. Select "From File"
4. Choose `api-requests.http`

**Step 2: Configure Environment**

1. Create new environment
2. Add base URL and token variables
3. Use requests

---

## 📋 Request Categories

### 1. Authentication (6 requests)

- Login with Phone + OTP (2 steps)
- Login with Phone + Password
- Login with Username + Password
- Refresh Token
- Logout

### 2. Appointments (11 requests)

- List appointments (with filters)
- Create appointment (patient/staff)
- Create online appointment (auto Meet link)
- Get appointment by ID
- Doctor dashboard
- Reschedule appointment
- Update status
- Cancel appointment
- Check availability

### 3. Payments (3 requests)

- Send payment link
- Check payment status
- Webhook handler

### 4. Patients (7 requests)

- List/search patients
- Create patient
- Get patient details
- Update patient
- Get patient appointments
- Add medical notes

### 5. Staff/Clinicians (7 requests)

- List clinicians
- Create clinician
- Update clinician
- Set availability
- Get availability
- Delete clinician

### 6. Centres (5 requests)

- List centres
- Create centre
- Update centre
- Delete centre

### 7. Analytics (4 requests)

- Dashboard metrics
- Revenue analytics
- Top clinicians

### 8. Video Consultations (2 requests)

- Generate Meet link
- Get video link

### 9. Notifications (2 requests)

- Send WhatsApp
- Get notification history

### 10. Users & Roles (7 requests)

- List users
- Create user
- Update user
- Assign roles
- Remove roles
- Get user roles

### 11. Health Check (2 requests)

- Health check
- API version

---

## 🔐 Authentication Flow

### Method 1: Phone + OTP

```http
# Step 1: Request OTP
POST {{baseUrl}}/api/auth/send-otp
Content-Type: application/json

{
  "phone": "+919876543210"
}

# Step 2: Verify OTP and Login
POST {{baseUrl}}/api/auth/login/phone-otp
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}
```

### Method 2: Phone + Password

```http
POST {{baseUrl}}/api/auth/login/phone-password
Content-Type: application/json

{
  "phone": "+919876543210",
  "password": "password123"
}
```

### Method 3: Username + Password

```http
POST {{baseUrl}}/api/auth/login/username-password
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

### Using the Token

After successful login, copy the `token` from response:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

Update the `@token` variable in `api-requests.http`:

```http
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💡 Usage Examples

### Example 1: Book Online Appointment

**Step 1: Login**

```http
POST {{baseUrl}}/api/auth/login/phone-password
```

**Step 2: Check Availability**

```http
GET {{baseUrl}}/api/appointments/availability?clinicianId=1&centreId=1&date=2024-12-20
```

**Step 3: Book Appointment**

```http
POST {{baseUrl}}/api/appointments
Authorization: Bearer {{token}}

{
  "clinician_id": 1,
  "centre_id": 1,
  "appointment_type": "ONLINE",
  "scheduled_start_at": "2024-12-20T14:00:00Z",
  "duration_minutes": 30
}
```

**Result:**

- Appointment created
- Google Meet link generated automatically
- WhatsApp sent to patient with Meet link
- Email sent to patient (if configured)
- WhatsApp sent to doctor
- WhatsApp sent to admins/managers

---

### Example 2: Send Payment Link

**Step 1: Login as Front Desk**

```http
POST {{baseUrl}}/api/auth/login/username-password
```

**Step 2: Send Payment Link**

```http
POST {{baseUrl}}/api/payments/send-payment-link
Authorization: Bearer {{token}}

{
  "appointmentId": 1,
  "patientPhone": "+919876543210",
  "patientName": "John Doe"
}
```

**Result:**

- Payment link created with consultation fee
- WhatsApp sent to patient with payment link
- Link supports UPI, Google Pay, Cards

---

### Example 3: Doctor Dashboard

**Step 1: Login as Doctor**

```http
POST {{baseUrl}}/api/auth/login/phone-password

{
  "phone": "+919876543210",
  "password": "doctor123"
}
```

**Step 2: Get My Appointments**

```http
GET {{baseUrl}}/api/appointments/my-appointments
Authorization: Bearer {{token}}
```

**Result:**

```json
{
  "current": [...],      // Today's appointments
  "upcoming": [...],     // Future appointments
  "past": [...],         // Completed appointments
  "summary": {
    "currentCount": 3,
    "upcomingCount": 10,
    "pastCount": 50
  }
}
```

---

## 🎯 Tips & Best Practices

### 1. Environment Variables

Use variables for:

- Base URL (switch between dev/prod)
- JWT token (auto-include in headers)
- Common IDs (patient, clinician, centre)

### 2. Token Management

- Save token after login
- Token expires in 7 days (configurable)
- Use refresh token endpoint to get new token
- Logout to invalidate token

### 3. Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (scheduling conflict)
- `500` - Server Error

### 4. Role-Based Testing

Test with different roles:

- ADMIN - Full access
- MANAGER - Manage operations
- CLINICIAN - View own appointments
- FRONT_DESK - Book appointments, send payment links
- PATIENT - Book appointments, view own records

### 5. Date Formats

Use ISO 8601 format:

- DateTime: `2024-12-20T14:00:00Z`
- Date: `2024-12-20`
- Time: `14:00`

---

## 🔍 Testing Checklist

### Authentication

- [ ] Login with phone + OTP
- [ ] Login with phone + password
- [ ] Login with username + password
- [ ] Refresh token
- [ ] Logout

### Appointments

- [ ] List appointments (different roles)
- [ ] Create in-person appointment
- [ ] Create online appointment (verify Meet link)
- [ ] Check availability
- [ ] Reschedule appointment
- [ ] Update status
- [ ] Cancel appointment
- [ ] Doctor dashboard

### Payments

- [ ] Send payment link
- [ ] Check payment status
- [ ] Verify WhatsApp delivery

### Patients

- [ ] Create patient
- [ ] Search patients
- [ ] Update patient
- [ ] Add medical notes

### Staff

- [ ] Create clinician (ADMIN/MANAGER)
- [ ] Update clinician
- [ ] Set availability
- [ ] Verify permissions

### Centres

- [ ] Create centre (ADMIN/MANAGER)
- [ ] Update centre
- [ ] List centres

### Analytics

- [ ] Dashboard metrics (ADMIN/MANAGER)
- [ ] Revenue analytics

---

## 📞 Support

### Issues?

1. Check token is valid and not expired
2. Verify user has required role/permissions
3. Check request body matches validation rules
4. Review server logs for detailed errors

### Documentation

- **API Reference:** `API_REFERENCE.md`
- **Integration Guide:** `ADMIN_PANEL_COMPLETE_GUIDE.md`
- **Permissions:** `USER_ROLES_AND_PERMISSIONS.md`

---

## ✨ Features

- ✅ 56 pre-configured requests
- ✅ All authentication methods
- ✅ Complete CRUD operations
- ✅ Workflow examples
- ✅ Environment variables
- ✅ Works with multiple tools
- ✅ Easy to import and use

---

**Happy Testing! 🚀**
