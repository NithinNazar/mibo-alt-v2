# Mibo Mobile App - API Documentation

**Base URL (Production)**: `https://api.mibo.care/api`  
**Base URL (Development)**: `http://localhost:5000/api`

---

## 🔐 Authentication

### 1. Send OTP

**Endpoint**: `POST /patient-auth/send-otp`  
**Auth Required**: No  
**Description**: Send OTP to patient's phone via WhatsApp

**Request Body**:

```json
{
  "phone": "919999999999"
}
```

**Response**:

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### 2. Verify OTP & Login/Signup

**Endpoint**: `POST /patient-auth/verify-otp`  
**Auth Required**: No  
**Description**: Verify OTP and automatically login or create new patient account

**Request Body**:

```json
{
  "phone": "919999999999",
  "otp": "123456"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "fullName": "John Doe",
      "phone": "919999999999",
      "email": "john@example.com",
      "userType": "PATIENT"
    }
  }
}
```

---

### 3. Refresh Access Token

**Endpoint**: `POST /patient-auth/refresh-token`  
**Auth Required**: No  
**Description**: Get new access token using refresh token

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Current Patient Profile

**Endpoint**: `GET /patient-auth/me`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Get logged-in patient's profile

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "fullName": "John Doe",
    "phone": "919999999999",
    "email": "john@example.com",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE",
    "address": "123 Main St"
  }
}
```

---

### 5. Logout

**Endpoint**: `POST /patient-auth/logout`  
**Auth Required**: No (but requires refresh token)  
**Description**: Logout and invalidate refresh token

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👨‍⚕️ Clinicians (Doctors)

### 6. Get All Clinicians

**Endpoint**: `GET /users/clinicians`  
**Auth Required**: No  
**Description**: Get list of all active clinicians with optional filters

**Query Parameters**:

- `centreId` (optional): Filter by centre ID
- `specialization` (optional): Filter by specialization

**Example**: `GET /users/clinicians?centreId=1&specialization=Psychiatrist`

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "58",
      "fullName": "Dr. Anet Augustine",
      "specialization": ["Clinical Psychologist"],
      "qualification": ["M.Phil", "Ph.D."],
      "yearsOfExperience": 10,
      "consultationFee": 3000,
      "consultationModes": ["IN_PERSON", "ONLINE"],
      "defaultDurationMinutes": 50,
      "profilePictureUrl": "https://...",
      "bio": "Experienced clinical psychologist...",
      "primaryCentreId": "1",
      "primaryCentreName": "Mibo Bangalore",
      "languages": ["English", "Malayalam"],
      "expertise": ["Anxiety Disorders", "Depression"],
      "isActive": true
    }
  ]
}
```

---

### 7. Get Clinician Details

**Endpoint**: `GET /users/clinicians/:id`  
**Auth Required**: No  
**Description**: Get detailed information about a specific clinician

**Example**: `GET /users/clinicians/58`

**Response**: Same as above (single clinician object)

---

## 📅 Availability & Slots

### 8. Get Dates with Available Slots

**Endpoint**: `GET /booking/dates-with-slots`  
**Auth Required**: No  
**Description**: Get all dates that have available slots within a date range

**Query Parameters** (all required):

- `clinicianId`: Clinician ID
- `centreId`: Centre ID
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Example**: `GET /booking/dates-with-slots?clinicianId=58&centreId=1&startDate=2026-04-01&endDate=2026-04-30`

**Response**:

```json
{
  "success": true,
  "data": {
    "datesWithSlots": ["2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28"]
  }
}
```

**Usage**: Show blue dots on calendar for these dates

---

### 9. Get Available Time Slots for a Date

**Endpoint**: `GET /booking/available-slots`  
**Auth Required**: No  
**Description**: Get all available time slots for a specific date

**Query Parameters** (all required):

- `clinicianId`: Clinician ID
- `date`: Date (YYYY-MM-DD)
- `centreId`: Centre ID

**Example**: `GET /booking/available-slots?clinicianId=58&date=2026-04-07&centreId=1`

**Response**:

```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "10:00",
        "available": true,
        "mode": "IN_PERSON"
      },
      {
        "startTime": "10:00",
        "endTime": "11:00",
        "available": true,
        "mode": "IN_PERSON"
      },
      {
        "startTime": "14:00",
        "endTime": "15:00",
        "available": false,
        "mode": "IN_PERSON"
      }
    ]
  }
}
```

---

## 🏥 Centres (Clinics)

### 10. Get All Centres

**Endpoint**: `GET /centres`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Get list of all centres

**Query Parameters**:

- `city` (optional): Filter by city

**Example**: `GET /centres?city=bangalore`

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Mibo Bangalore",
      "city": "Bangalore",
      "address": "123 MG Road, Bangalore",
      "phone": "919999999999",
      "email": "bangalore@mibo.care",
      "isActive": true
    }
  ]
}
```

---

## 📝 Appointment Booking

### 11. Create Appointment

**Endpoint**: `POST /booking/create`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Book a new appointment

**Request Body**:

```json
{
  "clinicianId": "58",
  "centreId": "1",
  "appointmentDate": "2026-04-07",
  "appointmentTime": "09:00",
  "appointmentType": "IN_PERSON",
  "appointmentDateUTC": "2026-04-07T03:30:00.000Z",
  "notes": "First time consultation"
}
```

**Field Descriptions**:

- `clinicianId` (required): ID of the clinician
- `centreId` (required): ID of the centre
- `appointmentDate` (required): Date in YYYY-MM-DD format (local date)
- `appointmentTime` (required): Time in HH:MM format (local time, 24-hour)
- `appointmentType` (required): Either "ONLINE" or "IN_PERSON"
- `appointmentDateUTC` (required): Full UTC timestamp in ISO 8601 format
- `notes` (optional): Additional notes for the appointment

**Response**:

```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "appointment": {
      "id": "456",
      "clinicianId": "58",
      "clinicianName": "Dr. Anet Augustine",
      "appointmentDate": "2026-04-07",
      "appointmentTime": "09:00",
      "appointmentType": "IN_PERSON",
      "consultationFee": 3000,
      "status": "PENDING_PAYMENT",
      "centreName": "Mibo Bangalore"
    },
    "razorpayOrderId": "order_xyz123"
  }
}
```

**Important Notes**:

- `appointmentDateUTC` must be in ISO 8601 format (e.g., "2026-04-07T03:30:00.000Z")
- Convert local date/time to UTC before sending
- The backend will validate that the appointment is in the future
- After creating appointment, proceed to payment using the returned `razorpayOrderId`

---

## 💳 Payment

### 12. Create Razorpay Order

**Endpoint**: `POST /payment/create-order`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Create Razorpay order for payment

**Request Body**:

```json
{
  "appointmentId": "456"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz123",
    "amount": 300000,
    "currency": "INR",
    "razorpayKeyId": "rzp_live_SV2cgPgjbxBTKL"
  }
}
```

**Usage**: Use this `orderId` to open Razorpay payment gateway in mobile app

---

### 13. Verify Payment

**Endpoint**: `POST /payment/verify`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Verify payment signature and confirm appointment

**Request Body**:

```json
{
  "appointmentId": "456",
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "razorpaySignature": "signature_hash"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "appointmentId": "456",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "meetingLink": "https://meet.google.com/abc-defg-hij"
  }
}
```

---

## 📋 Appointment Management

### 14. Get My Appointments

**Endpoint**: `GET /booking/my-appointments`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Get all appointments for logged-in patient

**Query Parameters**:

- `status` (optional): Filter by status (PENDING_PAYMENT, CONFIRMED, COMPLETED, CANCELLED)
- `upcoming` (optional): true/false - Get only upcoming appointments

**Example**: `GET /booking/my-appointments?upcoming=true`

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "456",
      "clinicianId": "58",
      "clinicianName": "Dr. Anet Augustine",
      "clinicianSpecialization": ["Clinical Psychologist"],
      "appointmentDate": "2026-04-07",
      "startTime": "09:00",
      "endTime": "10:00",
      "consultationMode": "IN_PERSON",
      "consultationFee": 3000,
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "centreName": "Mibo Bangalore",
      "centreAddress": "123 MG Road, Bangalore",
      "meetingLink": null,
      "reasonForVisit": "Anxiety management",
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```

---

### 15. Get Appointment Details

**Endpoint**: `GET /booking/:id`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Get detailed information about a specific appointment

**Example**: `GET /booking/456`

**Response**: Same as above (single appointment object)

---

### 16. Cancel Appointment

**Endpoint**: `POST /booking/:id/cancel`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Cancel an appointment

**Request Body**:

```json
{
  "cancellationReason": "Unable to attend due to emergency"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "appointmentId": "456",
    "status": "CANCELLED",
    "refundStatus": "PENDING"
  }
}
```

---

## 📊 Payment History

### 17. Get Payment History

**Endpoint**: `GET /payment/history`  
**Auth Required**: Yes (Bearer Token)  
**Description**: Get payment history for logged-in patient

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "789",
      "appointmentId": "456",
      "amount": 3000,
      "currency": "INR",
      "status": "PAID",
      "razorpayOrderId": "order_xyz123",
      "razorpayPaymentId": "pay_abc456",
      "paymentMethod": "card",
      "paidAt": "2026-04-01T10:30:00Z"
    }
  ]
}
```

---

## 🔑 Authentication Headers

For all protected endpoints, include the access token in the request header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

**Common HTTP Status Codes**:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📱 Mobile App Integration Notes

1. **Same Database**: Mobile app uses the same PostgreSQL database as the website
2. **Real-time Sync**: Bookings made on mobile app appear on website immediately
3. **Token Expiry**: Access token expires in 15 minutes, refresh token in 7 days
4. **Token Storage**: Store tokens securely (iOS Keychain / Android Keystore)
5. **Razorpay Integration**: Use Razorpay mobile SDK for payment processing
6. **WhatsApp Notifications**: Automatic via Gallabox (no mobile app action needed)
7. **Google Meet Links**: Generated automatically for ONLINE consultations

---

## 🚀 Quick Start Flow

### Booking Flow:

1. User opens app → Send OTP → Verify OTP → Get tokens
2. Browse clinicians → `GET /users/clinicians`
3. Select clinician → Get available dates → `GET /booking/dates-with-slots`
4. Select date → Get time slots → `GET /booking/available-slots`
5. Select slot → Create appointment → `POST /booking/create`
6. Create payment order → `POST /payment/create-order`
7. Open Razorpay SDK → User pays
8. Verify payment → `POST /payment/verify`
9. Show confirmation with meeting link (if online)

### View Appointments:

1. Get my appointments → `GET /booking/my-appointments`
2. View details → `GET /booking/:id`
3. Cancel if needed → `POST /booking/:id/cancel`

---

**Last Updated**: April 25, 2026  
**API Version**: 1.0  
**Contact**: For API support, contact the backend team
