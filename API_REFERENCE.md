# Mibo Mental Hospital Chain - API Reference

> **Complete API Documentation for Backend Services**  
> Version: 1.0.0  
> Base URL: `http://localhost:5000/api` (development)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Response Formats](#common-response-formats)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [Health Check](#health-check)
   - [Authentication APIs](#authentication-apis)
   - [Patient APIs](#patient-apis)
   - [Appointment APIs](#appointment-apis)
   - [Staff/User APIs](#staffuser-apis)
   - [Clinician APIs](#clinician-apis)
   - [Centre APIs](#centre-apis)
   - [Payment APIs](#payment-apis)
   - [Video APIs](#video-apis)
   - [Notification APIs](#notification-apis)
   - [Analytics APIs](#analytics-apis)

---

## Overview

This API provides comprehensive backend services for the Mibo Mental Hospital Chain management system. It supports:

- Multi-role authentication (Admin, Manager, Centre Manager, Care Coordinator, Front Desk, Clinician)
- Patient management
- Appointment scheduling and management
- Payment processing via Razorpay
- Video consultation links (Google Meet)
- WhatsApp notifications via Gallabox
- Analytics and reporting

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Content Type

All requests and responses use `application/json` unless otherwise specified.

---

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens).

### Authentication Flow

1. **Send OTP** or **Login with credentials**
2. Receive `accessToken` and `refreshToken`
3. Include `accessToken` in subsequent requests
4. Refresh token when access token expires

### Authorization Header

```
Authorization: Bearer <your_access_token>
```

### Token Expiry

- **Access Token**: 15 minutes (default)
- **Refresh Token**: 7 days (default)

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | Success                                 |
| 201  | Created                                 |
| 400  | Bad Request                             |
| 401  | Unauthorized                            |
| 403  | Forbidden                               |
| 404  | Not Found                               |
| 422  | Unprocessable Entity (Validation Error) |
| 500  | Internal Server Error                   |

---

## API Endpoints

### Health Check

#### Get API Health Status

```http
GET /health
```

**Authentication**: Not required

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```

#### Get API Root Information

```http
GET /
```

**Authentication**: Not required

**Response**:

```json
{
  "message": "Mibo Mental Hospital Chain Backend API",
  "version": "1.0.0",
  "environment": "development",
  "documentation": "See API_DOCUMENTATION.md for detailed API documentation",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "analytics": "/api/analytics",
    "appointments": "/api/appointments",
    "centres": "/api/centres",
    "patients": "/api/patients",
    "users": "/api/users",
    "clinicians": "/api/clinicians",
    "video": "/api/video",
    "notifications": "/api/notifications",
    "payments": "/api/payments"
  }
}
```

---

## Authentication APIs

### 1. Send OTP

Send OTP to staff user's phone number for authentication.

```http
POST /auth/send-otp
```

**Authentication**: Not required

**Request Body**:

```json
{
  "phone": "9876543210"
}
```

**Validation**:

- `phone`: Required, must be 10 digits

**Response** (200):

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "9876543210",
    "expiresIn": 600
  }
}
```

---

### 2. Login with Phone + OTP

Authenticate using phone number and OTP.

```http
POST /auth/login/phone-otp
```

**Authentication**: Not required

**Request Body**:

```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Validation**:

- `phone`: Required, must be 10 digits
- `otp`: Required, must be 6 digits

**Response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "user_type": "STAFF",
      "roles": ["ADMIN", "MANAGER"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Login with Phone + Password

Authenticate using phone number and password.

```http
POST /auth/login/phone-password
```

**Authentication**: Not required

**Request Body**:

```json
{
  "phone": "9876543210",
  "password": "SecurePass123"
}
```

**Validation**:

- `phone`: Required, must be 10 digits
- `password`: Required, minimum 8 characters

**Response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "user_type": "STAFF",
      "roles": ["CENTRE_MANAGER"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Login with Username + Password

Authenticate using username and password.

```http
POST /auth/login/username-password
```

**Authentication**: Not required

**Request Body**:

```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Validation**:

- `username`: Required, alphanumeric, 3-50 characters
- `password`: Required, minimum 8 characters

**Response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "user_type": "STAFF",
      "roles": ["ADMIN"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 5. Refresh Access Token

Get a new access token using refresh token.

```http
POST /auth/refresh
```

**Authentication**: Not required

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 6. Logout

Invalidate refresh token and logout user.

```http
POST /auth/logout
```

**Authentication**: Required

**Headers**:

```
Authorization: Bearer <access_token>
```

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 7. Get Current User

Get authenticated user's profile information.

```http
GET /auth/me
```

**Authentication**: Required

**Headers**:

```
Authorization: Bearer <access_token>
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "username": "johndoe",
    "user_type": "STAFF",
    "roles": ["ADMIN", "MANAGER"],
    "centreIds": [1, 2],
    "is_active": true
  }
}
```

---

## Patient APIs

### 1. Get Patients

Get list of patients with optional search filters.

```http
GET /patients?search=John&phone=9876543210
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Query Parameters**:

- `search` (optional): Search by patient name
- `phone` (optional): Filter by phone number

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "John Smith",
      "phone": "9876543210",
      "email": "john.smith@example.com",
      "date_of_birth": "1990-05-15",
      "gender": "Male",
      "blood_group": "O+",
      "emergency_contact_name": "Jane Smith",
      "emergency_contact_phone": "9876543211",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Patient by ID

Get detailed information about a specific patient.

```http
GET /patients/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK, CLINICIAN

**Path Parameters**:

- `id`: Patient ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "John Smith",
    "phone": "9876543210",
    "email": "john.smith@example.com",
    "date_of_birth": "1990-05-15",
    "gender": "Male",
    "blood_group": "O+",
    "emergency_contact_name": "Jane Smith",
    "emergency_contact_phone": "9876543211",
    "notes": "Patient has anxiety disorder",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 3. Create Patient

Create a new patient record.

```http
POST /patients
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Request Body**:

```json
{
  "phone": "9876543210",
  "full_name": "John Smith",
  "email": "john.smith@example.com",
  "date_of_birth": "1990-05-15",
  "gender": "Male",
  "blood_group": "O+",
  "emergency_contact_name": "Jane Smith",
  "emergency_contact_phone": "9876543211"
}
```

**Validation**:

- `phone`: Required, 10 digits starting with 6-9
- `full_name`: Required, non-empty string
- `email`: Optional, valid email format
- Other fields: Optional

**Response** (201):

```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "id": 1,
    "full_name": "John Smith",
    "phone": "9876543210",
    "email": "john.smith@example.com",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Patient

Update patient profile information.

```http
PUT /patients/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Path Parameters**:

- `id`: Patient ID (integer)

**Request Body** (all fields optional):

```json
{
  "date_of_birth": "1990-05-15",
  "gender": "Male",
  "blood_group": "O+",
  "emergency_contact_name": "Jane Smith",
  "emergency_contact_phone": "9876543211",
  "notes": "Updated medical notes"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {
    "id": 1,
    "full_name": "John Smith",
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 5. Get Patient Appointments

Get appointment history for a specific patient.

```http
GET /patients/:id/appointments
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK, CLINICIAN

**Path Parameters**:

- `id`: Patient ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "patient_id": 1,
      "clinician_id": 5,
      "clinician_name": "Dr. Sarah Johnson",
      "centre_id": 1,
      "centre_name": "Bangalore Centre",
      "appointment_type": "IN_PERSON",
      "scheduled_start_at": "2024-01-20T10:00:00.000Z",
      "scheduled_end_at": "2024-01-20T10:30:00.000Z",
      "duration_minutes": 30,
      "status": "BOOKED",
      "notes": "Initial consultation",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 6. Add Medical Note

Add a medical note to patient's record.

```http
POST /patients/:id/notes
```

**Authentication**: Required

**Roles**: CLINICIAN, ADMIN

**Path Parameters**:

- `id`: Patient ID (integer)

**Request Body**:

```json
{
  "note": "Patient shows improvement in anxiety symptoms. Continue current medication."
}
```

**Validation**:

- `note`: Required, non-empty string

**Response** (201):

```json
{
  "success": true,
  "message": "Medical note added successfully",
  "data": {
    "note_id": 1,
    "patient_id": 1,
    "clinician_id": 5,
    "note": "Patient shows improvement in anxiety symptoms. Continue current medication.",
    "created_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## Appointment APIs

### 1. Get Appointments

Get appointments with optional filters. Role-based filtering is applied automatically.

```http
GET /appointments?centreId=1&clinicianId=5&patientId=1&date=2024-01-20&status=BOOKED
```

**Authentication**: Required

**Roles**: All authenticated users (filtered by role)

**Query Parameters** (all optional):

- `centreId`: Filter by centre ID
- `clinicianId`: Filter by clinician ID
- `patientId`: Filter by patient ID
- `date`: Filter by date (YYYY-MM-DD)
- `status`: Filter by status (BOOKED, CONFIRMED, RESCHEDULED, COMPLETED, CANCELLED, NO_SHOW)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "patient_id": 1,
      "patient_name": "John Smith",
      "clinician_id": 5,
      "clinician_name": "Dr. Sarah Johnson",
      "centre_id": 1,
      "centre_name": "Bangalore Centre",
      "appointment_type": "IN_PERSON",
      "scheduled_start_at": "2024-01-20T10:00:00.000Z",
      "scheduled_end_at": "2024-01-20T10:30:00.000Z",
      "duration_minutes": 30,
      "status": "BOOKED",
      "source": "ADMIN_FRONT_DESK",
      "notes": "Initial consultation",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get My Appointments (Doctor Dashboard)

Get current clinician's appointments categorized by current (today), upcoming, and past.

```http
GET /appointments/my-appointments
```

**Authentication**: Required

**Roles**: CLINICIAN only

**Response** (200):

```json
{
  "success": true,
  "data": {
    "current": [
      {
        "id": 101,
        "patient_id": 25,
        "patient_name": "Amit Sharma",
        "patient_phone": "+919876543211",
        "clinician_id": 15,
        "centre_id": 1,
        "centre_name": "Main Clinic - Mumbai",
        "centre_address": "123 MG Road, Mumbai",
        "appointment_type": "CONSULTATION",
        "scheduled_start_at": "2024-12-13T10:00:00.000Z",
        "scheduled_end_at": "2024-12-13T10:30:00.000Z",
        "duration_minutes": 30,
        "status": "CONFIRMED",
        "source": "ADMIN_FRONT_DESK",
        "notes": "Follow-up consultation",
        "created_at": "2024-12-12T15:30:00.000Z"
      }
    ],
    "upcoming": [
      {
        "id": 103,
        "patient_id": 27,
        "patient_name": "Rahul Verma",
        "patient_phone": "+919876543213",
        "clinician_id": 15,
        "centre_id": 2,
        "centre_name": "Branch Clinic - Pune",
        "centre_address": "456 FC Road, Pune",
        "appointment_type": "CONSULTATION",
        "scheduled_start_at": "2024-12-14T11:00:00.000Z",
        "scheduled_end_at": "2024-12-14T11:30:00.000Z",
        "duration_minutes": 30,
        "status": "CONFIRMED",
        "source": "ADMIN_FRONT_DESK",
        "notes": "New patient",
        "created_at": "2024-12-12T16:45:00.000Z"
      }
    ],
    "past": [
      {
        "id": 95,
        "patient_id": 20,
        "patient_name": "Sneha Desai",
        "patient_phone": "+919876543214",
        "clinician_id": 15,
        "centre_id": 1,
        "centre_name": "Main Clinic - Mumbai",
        "centre_address": "123 MG Road, Mumbai",
        "appointment_type": "CONSULTATION",
        "scheduled_start_at": "2024-12-12T10:00:00.000Z",
        "scheduled_end_at": "2024-12-12T10:30:00.000Z",
        "duration_minutes": 30,
        "status": "COMPLETED",
        "source": "WEB_PATIENT",
        "notes": "Regular checkup",
        "created_at": "2024-12-10T14:20:00.000Z"
      }
    ],
    "summary": {
      "currentCount": 1,
      "upcomingCount": 1,
      "pastCount": 1
    }
  },
  "message": "Clinician appointments retrieved successfully"
}
```

**Categories Explained**:

- **current**: Appointments scheduled for today (not cancelled/no-show)
- **upcoming**: Future appointments (after today, not completed/cancelled/no-show)
- **past**: Previous appointments or completed appointments

---

### 3. Get Clinician Availability

Get available time slots for a clinician on a specific date.

```http
GET /appointments/availability?clinician_id=5&centre_id=1&date=2024-01-20
```

**Authentication**: Required

**Query Parameters**:

- `clinician_id`: Required, clinician ID
- `centre_id`: Required, centre ID
- `date`: Required, date in YYYY-MM-DD format

**Response** (200):

```json
{
  "success": true,
  "data": {
    "clinician_id": 5,
    "clinician_name": "Dr. Sarah Johnson",
    "centre_id": 1,
    "date": "2024-01-20",
    "available_slots": [
      {
        "start_time": "09:00",
        "end_time": "09:30",
        "available": true
      },
      {
        "start_time": "09:30",
        "end_time": "10:00",
        "available": true
      },
      {
        "start_time": "10:00",
        "end_time": "10:30",
        "available": false
      }
    ]
  }
}
```

---

### 4. Get Appointment by ID

Get detailed information about a specific appointment.

```http
GET /appointments/:id
```

**Authentication**: Required

**Path Parameters**:

- `id`: Appointment ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 101,
    "patient_id": 1,
    "patient_name": "John Smith",
    "patient_phone": "9876543210",
    "clinician_id": 5,
    "clinician_name": "Dr. Sarah Johnson",
    "centre_id": 1,
    "centre_name": "Bangalore Centre",
    "appointment_type": "IN_PERSON",
    "scheduled_start_at": "2024-01-20T10:00:00.000Z",
    "scheduled_end_at": "2024-01-20T10:30:00.000Z",
    "duration_minutes": 30,
    "status": "BOOKED",
    "source": "ADMIN_FRONT_DESK",
    "booked_by_user_id": 2,
    "notes": "Initial consultation",
    "parent_appointment_id": null,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 5. Create Appointment

Create a new appointment.

```http
POST /appointments
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Request Body**:

```json
{
  "patient_id": 1,
  "clinician_id": 5,
  "centre_id": 1,
  "appointment_type": "IN_PERSON",
  "scheduled_start_at": "2024-01-20T10:00:00.000Z",
  "duration_minutes": 30,
  "notes": "Initial consultation",
  "parent_appointment_id": null
}
```

**Validation**:

- `clinician_id`: Required
- `centre_id`: Required
- `appointment_type`: Required (IN_PERSON, ONLINE, INPATIENT_ASSESSMENT, FOLLOW_UP)
- `scheduled_start_at`: Required, ISO datetime string
- `patient_id`: Required if user is STAFF, auto-derived if user is PATIENT
- `duration_minutes`: Optional (default: 30)
- `notes`: Optional
- `parent_appointment_id`: Optional (for follow-up appointments)

**Response** (201):

```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": 101,
    "patient_id": 1,
    "clinician_id": 5,
    "centre_id": 1,
    "appointment_type": "IN_PERSON",
    "scheduled_start_at": "2024-01-20T10:00:00.000Z",
    "scheduled_end_at": "2024-01-20T10:30:00.000Z",
    "status": "BOOKED",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 6. Update Appointment

Update appointment details (reschedule or update status).

```http
PUT /appointments/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR

**Path Parameters**:

- `id`: Appointment ID (integer)

**Request Body** (for rescheduling):

```json
{
  "scheduled_start_at": "2024-01-21T14:00:00.000Z",
  "duration_minutes": 45
}
```

**Request Body** (for status update):

```json
{
  "new_status": "CONFIRMED",
  "reason": "Patient confirmed via phone"
}
```

**Validation**:

- `new_status`: Must be valid status (BOOKED, CONFIRMED, RESCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- `scheduled_start_at`: Must be valid ISO datetime string

**Response** (200):

```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "id": 101,
    "status": "CONFIRMED",
    "scheduled_start_at": "2024-01-21T14:00:00.000Z",
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 7. Cancel Appointment

Cancel an appointment with reason.

```http
DELETE /appointments/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Path Parameters**:

- `id`: Appointment ID (integer)

**Request Body**:

```json
{
  "reason": "Patient requested cancellation due to emergency"
}
```

**Validation**:

- `reason`: Required, non-empty string

**Response** (200):

```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 101,
    "status": "CANCELLED",
    "cancellation_reason": "Patient requested cancellation due to emergency",
    "cancelled_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## Staff/User APIs

### 1. Get Staff Users

Get list of staff users with optional filters.

```http
GET /users?roleId=1&centreId=1
```

**Authentication**: Required

**Roles**: ADMIN only

**Query Parameters** (all optional):

- `roleId`: Filter by role ID
- `centreId`: Filter by centre ID

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "user": {
        "id": 1,
        "full_name": "John Doe",
        "phone": "9876543210",
        "email": "john@example.com",
        "username": "johndoe",
        "user_type": "STAFF",
        "is_active": true
      },
      "roles": ["ADMIN", "MANAGER"],
      "centres": [
        {
          "centre_id": 1,
          "centre_name": "Bangalore Centre",
          "role_name": "ADMIN"
        }
      ],
      "profile": {
        "designation": "Senior Manager",
        "profile_picture_url": null
      }
    }
  ]
}
```

---

### 2. Get Staff User by ID

Get detailed information about a specific staff user.

```http
GET /users/:id
```

**Authentication**: Required

**Roles**: ADMIN only

**Path Parameters**:

- `id`: User ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "username": "johndoe",
      "user_type": "STAFF",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00.000Z"
    },
    "roles": ["ADMIN", "MANAGER"],
    "centres": [
      {
        "centre_id": 1,
        "centre_name": "Bangalore Centre",
        "role_name": "ADMIN"
      }
    ],
    "profile": {
      "designation": "Senior Manager",
      "profile_picture_url": null
    }
  }
}
```

---

### 3. Create Staff User

Create a new staff user.

```http
POST /users
```

**Authentication**: Required

**Roles**: ADMIN only

**Request Body**:

```json
{
  "full_name": "Jane Smith",
  "phone": "9876543211",
  "email": "jane@example.com",
  "username": "janesmith",
  "password": "SecurePass123",
  "designation": "Care Coordinator",
  "role_ids": [3, 4],
  "centre_ids": [1, 2]
}
```

**Validation**:

- `full_name`: Required, non-empty string
- `phone`: Required, 10 digits starting with 6-9
- `password`: Required, minimum 8 characters
- `role_ids`: Required, array with at least one role ID
- `centre_ids`: Required, array with at least one centre ID
- `email`: Optional, valid email format
- `username`: Optional, 3-50 alphanumeric characters
- `designation`: Optional

**Response** (201):

```json
{
  "success": true,
  "message": "Staff user created successfully",
  "data": {
    "id": 2,
    "full_name": "Jane Smith",
    "phone": "9876543211",
    "email": "jane@example.com",
    "username": "janesmith",
    "roles": ["CARE_COORDINATOR", "FRONT_DESK"],
    "centres": [1, 2],
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Staff User

Update staff user information.

```http
PUT /users/:id
```

**Authentication**: Required

**Roles**: ADMIN only

**Path Parameters**:

- `id`: User ID (integer)

**Request Body** (all fields optional):

```json
{
  "full_name": "Jane Smith Updated",
  "phone": "9876543212",
  "email": "jane.updated@example.com",
  "designation": "Senior Care Coordinator"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Staff user updated successfully",
  "data": {
    "id": 2,
    "full_name": "Jane Smith Updated",
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 5. Delete Staff User

Soft delete a staff user (marks as inactive).

```http
DELETE /users/:id
```

**Authentication**: Required

**Roles**: ADMIN only

**Path Parameters**:

- `id`: User ID (integer)

**Response** (200):

```json
{
  "success": true,
  "message": "Staff user deleted successfully",
  "data": {
    "id": 2,
    "is_active": false,
    "deleted_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## Clinician APIs

### 1. Get Clinicians

Get list of clinicians with optional filters.

```http
GET /clinicians?centreId=1&specialization=Psychiatry
```

**Authentication**: Required

**Roles**: All authenticated users

**Query Parameters** (all optional):

- `centreId`: Filter by centre ID
- `specialization`: Filter by specialization

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "full_name": "Dr. Sarah Johnson",
      "phone": "9876543215",
      "email": "sarah@example.com",
      "primary_centre_id": 1,
      "primary_centre_name": "Bangalore Centre",
      "specialization": "Psychiatry",
      "registration_number": "MCI12345",
      "experience_years": 10,
      "consultation_fee": 1500,
      "bio": "Experienced psychiatrist specializing in anxiety and depression",
      "is_active": true
    }
  ]
}
```

---

### 2. Get Clinician by ID

Get detailed information about a specific clinician.

```http
GET /clinicians/:id
```

**Authentication**: Required

**Roles**: All authenticated users

**Path Parameters**:

- `id`: Clinician ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 5,
    "full_name": "Dr. Sarah Johnson",
    "phone": "9876543215",
    "email": "sarah@example.com",
    "primary_centre_id": 1,
    "primary_centre_name": "Bangalore Centre",
    "specialization": "Psychiatry",
    "registration_number": "MCI12345",
    "experience_years": 10,
    "consultation_fee": 1500,
    "bio": "Experienced psychiatrist specializing in anxiety and depression",
    "availability_rules": [
      {
        "day_of_week": 1,
        "start_time": "09:00",
        "end_time": "17:00",
        "slot_duration_minutes": 30,
        "consultation_mode": "BOTH"
      }
    ],
    "is_active": true
  }
}
```

---

### 3. Create Clinician

Create a new clinician profile.

```http
POST /clinicians
```

**Authentication**: Required

**Roles**: ADMIN, CENTRE_MANAGER

**Request Body**:

```json
{
  "user_id": 5,
  "primary_centre_id": 1,
  "specialization": "Psychiatry",
  "registration_number": "MCI12345",
  "experience_years": 10,
  "consultation_fee": 1500,
  "bio": "Experienced psychiatrist specializing in anxiety and depression"
}
```

**Validation**:

- `user_id`: Required
- `primary_centre_id`: Required
- `specialization`: Required, non-empty string
- `registration_number`: Optional
- `experience_years`: Optional, number
- `consultation_fee`: Optional, number
- `bio`: Optional

**Response** (201):

```json
{
  "success": true,
  "message": "Clinician created successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "primary_centre_id": 1,
    "specialization": "Psychiatry",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Clinician

Update clinician profile information.

```http
PUT /clinicians/:id
```

**Authentication**: Required

**Roles**: ADMIN, CENTRE_MANAGER

**Path Parameters**:

- `id`: Clinician ID (integer)

**Request Body** (all fields optional):

```json
{
  "primary_centre_id": 2,
  "specialization": "Clinical Psychology",
  "registration_number": "MCI12346",
  "experience_years": 12,
  "consultation_fee": 1800,
  "bio": "Updated bio"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Clinician updated successfully",
  "data": {
    "id": 1,
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 5. Delete Clinician

Soft delete a clinician (marks as inactive).

```http
DELETE /clinicians/:id
```

**Authentication**: Required

**Roles**: ADMIN, CENTRE_MANAGER

**Path Parameters**:

- `id`: Clinician ID (integer)

**Response** (200):

```json
{
  "success": true,
  "message": "Clinician deleted successfully",
  "data": {
    "id": 1,
    "is_active": false,
    "deleted_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 6. Update Clinician Availability

Update clinician's availability schedule.

```http
PUT /clinicians/:id/availability
```

**Authentication**: Required

**Roles**: ADMIN, CENTRE_MANAGER

**Path Parameters**:

- `id`: Clinician ID (integer)

**Request Body**:

```json
{
  "availability_rules": [
    {
      "day_of_week": 1,
      "start_time": "09:00",
      "end_time": "17:00",
      "slot_duration_minutes": 30,
      "consultation_mode": "BOTH"
    },
    {
      "day_of_week": 2,
      "start_time": "10:00",
      "end_time": "16:00",
      "slot_duration_minutes": 45,
      "consultation_mode": "ONLINE"
    }
  ]
}
```

**Validation**:

- `day_of_week`: Required, 0-6 (0=Sunday, 6=Saturday)
- `start_time`: Required, HH:MM format
- `end_time`: Required, HH:MM format
- `slot_duration_minutes`: Required, minimum 1
- `consultation_mode`: Required (IN_PERSON, ONLINE, BOTH)

**Response** (200):

```json
{
  "success": true,
  "message": "Clinician availability updated successfully",
  "data": {
    "clinician_id": 1,
    "availability_rules": [
      {
        "day_of_week": 1,
        "start_time": "09:00",
        "end_time": "17:00",
        "slot_duration_minutes": 30,
        "consultation_mode": "BOTH"
      }
    ]
  }
}
```

---

## Centre APIs

### 1. Get Centres

Get list of all centres with optional city filter.

```http
GET /centres?city=bangalore
```

**Authentication**: Required

**Roles**: All authenticated users

**Query Parameters** (all optional):

- `city`: Filter by city (bangalore, kochi, mumbai)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mibo Bangalore Centre",
      "city": "bangalore",
      "address_line_1": "123 MG Road",
      "address_line_2": "Near Metro Station",
      "pincode": "560001",
      "contact_phone": "9876543220",
      "is_active": true,
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Centre by ID

Get detailed information about a specific centre.

```http
GET /centres/:id
```

**Authentication**: Required

**Roles**: All authenticated users

**Path Parameters**:

- `id`: Centre ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mibo Bangalore Centre",
    "city": "bangalore",
    "address_line_1": "123 MG Road",
    "address_line_2": "Near Metro Station",
    "pincode": "560001",
    "contact_phone": "9876543220",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Create Centre

Create a new centre.

```http
POST /centres
```

**Authentication**: Required

**Roles**: ADMIN only

**Request Body**:

```json
{
  "name": "Mibo Kochi Centre",
  "city": "kochi",
  "addressLine1": "456 Marine Drive",
  "addressLine2": "Near Beach",
  "pincode": "682001",
  "contactPhone": "9876543221"
}
```

**Validation**:

- `name`: Required, 3-150 characters
- `city`: Required (bangalore, kochi, mumbai)
- `addressLine1`: Required, max 255 characters
- `addressLine2`: Optional, max 255 characters
- `pincode`: Required, 6 digits
- `contactPhone`: Required, 10 digits

**Response** (201):

```json
{
  "success": true,
  "message": "Centre created successfully",
  "data": {
    "id": 2,
    "name": "Mibo Kochi Centre",
    "city": "kochi",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Centre

Update centre information.

```http
PUT /centres/:id
```

**Authentication**: Required

**Roles**: ADMIN, CENTRE_MANAGER

**Path Parameters**:

- `id`: Centre ID (integer)

**Request Body** (all fields optional):

```json
{
  "name": "Mibo Kochi Centre Updated",
  "city": "kochi",
  "addressLine1": "456 Marine Drive Updated",
  "addressLine2": "Near Beach",
  "pincode": "682002",
  "contactPhone": "9876543222"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Centre updated successfully",
  "data": {
    "id": 2,
    "name": "Mibo Kochi Centre Updated",
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 5. Delete Centre

Soft delete a centre (marks as inactive).

```http
DELETE /centres/:id
```

**Authentication**: Required

**Roles**: ADMIN only

**Path Parameters**:

- `id`: Centre ID (integer)

**Response** (200):

```json
{
  "success": true,
  "message": "Centre deleted successfully",
  "data": {
    "id": 2,
    "is_active": false,
    "deleted_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## Payment APIs

### 1. Create Payment Order

Create a Razorpay payment order for an appointment.

```http
POST /payments/create-order
```

**Authentication**: Required

**Roles**: All authenticated users

**Request Body**:

```json
{
  "appointment_id": 101
}
```

**Notes**:

- For patients: `patient_id` is automatically derived from authentication
- For staff: `patient_id` must be provided in the body

**Validation**:

- `appointment_id`: Required, valid appointment ID

**Response** (201):

```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "order_id": "order_MNOPqrstuvwxyz",
    "amount": 150000,
    "currency": "INR",
    "appointment_id": 101,
    "patient_id": 1,
    "razorpay_key_id": "rzp_test_xxxxx"
  }
}
```

---

### 2. Verify Payment

Verify payment after Razorpay checkout completion.

```http
POST /payments/verify
```

**Authentication**: Required

**Request Body**:

```json
{
  "razorpay_order_id": "order_MNOPqrstuvwxyz",
  "razorpay_payment_id": "pay_ABCDefghijklmn",
  "razorpay_signature": "signature_hash_here"
}
```

**Validation**:

- All fields are required and must be strings

**Response** (200):

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment_id": 1,
    "order_id": "order_MNOPqrstuvwxyz",
    "payment_id_razorpay": "pay_ABCDefghijklmn",
    "status": "SUCCESS",
    "amount": 150000,
    "verified_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 3. Razorpay Webhook

Webhook endpoint for Razorpay payment events.

```http
POST /payments/webhook
```

**Authentication**: Not required (signature verified in controller)

**Headers**:

```
X-Razorpay-Signature: <webhook_signature>
```

**Request Body**: Razorpay webhook payload (varies by event)

**Response** (200):

```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

### 4. Get Payments

Get list of payments with optional filters.

```http
GET /payments?status=SUCCESS&patientId=1&startDate=2024-01-01&endDate=2024-01-31
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Query Parameters** (all optional):

- `status`: Filter by payment status (PENDING, SUCCESS, FAILED, REFUNDED)
- `patientId`: Filter by patient ID
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointment_id": 101,
      "patient_id": 1,
      "patient_name": "John Smith",
      "order_id": "order_MNOPqrstuvwxyz",
      "payment_id": "pay_ABCDefghijklmn",
      "amount": 150000,
      "currency": "INR",
      "status": "SUCCESS",
      "payment_method": "card",
      "created_at": "2024-01-15T10:00:00.000Z",
      "verified_at": "2024-01-15T10:05:00.000Z"
    }
  ]
}
```

---

### 5. Get Payment by ID

Get detailed information about a specific payment.

```http
GET /payments/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Path Parameters**:

- `id`: Payment ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointment_id": 101,
    "patient_id": 1,
    "patient_name": "John Smith",
    "order_id": "order_MNOPqrstuvwxyz",
    "payment_id": "pay_ABCDefghijklmn",
    "amount": 150000,
    "currency": "INR",
    "status": "SUCCESS",
    "payment_method": "card",
    "created_at": "2024-01-15T10:00:00.000Z",
    "verified_at": "2024-01-15T10:05:00.000Z"
  }
}
```

---

### 6. Get Payments by Patient

Get all payments for a specific patient.

```http
GET /payments/patient/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Path Parameters**:

- `id`: Patient ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointment_id": 101,
      "order_id": "order_MNOPqrstuvwxyz",
      "payment_id": "pay_ABCDefghijklmn",
      "amount": 150000,
      "status": "SUCCESS",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Create Refund

Create a refund for a payment.

```http
POST /payments/refund
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER

**Request Body**:

```json
{
  "payment_id": 1,
  "amount": 150000,
  "reason": "Appointment cancelled by patient"
}
```

**Validation**:

- `payment_id`: Required, valid payment ID
- `amount`: Optional (defaults to full amount), must be positive
- `reason`: Optional

**Response** (201):

```json
{
  "success": true,
  "message": "Refund created successfully",
  "data": {
    "refund_id": "rfnd_ABCDefghijklmn",
    "payment_id": 1,
    "amount": 150000,
    "status": "PROCESSING",
    "reason": "Appointment cancelled by patient",
    "created_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## Video APIs

### 1. Generate Google Meet Link

Generate a Google Meet link for an appointment.

```http
POST /video/generate-meet-link
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Request Body**:

```json
{
  "appointment_id": 101,
  "summary": "Consultation with Dr. Sarah Johnson",
  "description": "Online psychiatric consultation"
}
```

**Response** (201):

```json
{
  "success": true,
  "message": "Meet link generated successfully",
  "data": {
    "video_link_id": 1,
    "appointment_id": 101,
    "meet_link": "https://meet.google.com/abc-defg-hij",
    "provider": "GOOGLE_MEET",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 2. Get Meet Link for Appointment

Get the Google Meet link for a specific appointment.

```http
GET /video/appointment/:id/meet-link
```

**Authentication**: Required

**Path Parameters**:

- `id`: Appointment ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "video_link_id": 1,
    "appointment_id": 101,
    "meet_link": "https://meet.google.com/abc-defg-hij",
    "provider": "GOOGLE_MEET",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Update Meet Link

Update the Google Meet link for an appointment.

```http
PUT /video/appointment/:id/meet-link
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Path Parameters**:

- `id`: Appointment ID (integer)

**Request Body**:

```json
{
  "meet_link": "https://meet.google.com/new-link-xyz"
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Meet link updated successfully",
  "data": {
    "video_link_id": 1,
    "appointment_id": 101,
    "meet_link": "https://meet.google.com/new-link-xyz",
    "updated_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 4. Delete Meet Link

Delete the Google Meet link for an appointment.

```http
DELETE /video/appointment/:id/meet-link
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Path Parameters**:

- `id`: Appointment ID (integer)

**Response** (200):

```json
{
  "success": true,
  "message": "Meet link deleted successfully"
}
```

---

### 5. Get All Video Links

Get all video links with optional filters.

```http
GET /video/links?startDate=2024-01-01&endDate=2024-01-31&provider=GOOGLE_MEET
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER

**Query Parameters** (all optional):

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `provider`: Filter by provider (GOOGLE_MEET, ZOOM, etc.)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "video_link_id": 1,
      "appointment_id": 101,
      "patient_name": "John Smith",
      "clinician_name": "Dr. Sarah Johnson",
      "meet_link": "https://meet.google.com/abc-defg-hij",
      "provider": "GOOGLE_MEET",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Notification APIs

### 1. Send Appointment Confirmation

Send appointment confirmation notification to patient via WhatsApp.

```http
POST /notifications/appointment-confirmation
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER, CARE_COORDINATOR, FRONT_DESK

**Request Body**:

```json
{
  "appointment_id": 101
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Appointment confirmation sent successfully",
  "data": {
    "notification_id": 1,
    "appointment_id": 101,
    "patient_id": 1,
    "notification_type": "APPOINTMENT_CONFIRMATION",
    "channel": "WHATSAPP",
    "status": "SENT",
    "sent_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 2. Send Appointment Reminder

Send appointment reminder notification to patient.

```http
POST /notifications/appointment-reminder
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER

**Request Body**:

```json
{
  "appointment_id": 101
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Appointment reminder sent successfully",
  "data": {
    "notification_id": 2,
    "appointment_id": 101,
    "patient_id": 1,
    "notification_type": "APPOINTMENT_REMINDER",
    "channel": "WHATSAPP",
    "status": "SENT",
    "sent_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Get Notification History

Get notification history with optional filters.

```http
GET /notifications/history?patientId=1&appointmentId=101&notificationType=APPOINTMENT_CONFIRMATION&status=SENT&startDate=2024-01-01&endDate=2024-01-31&limit=50
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER

**Query Parameters** (all optional):

- `patientId`: Filter by patient ID
- `appointmentId`: Filter by appointment ID
- `notificationType`: Filter by type (APPOINTMENT_CONFIRMATION, APPOINTMENT_REMINDER, APPOINTMENT_CANCELLATION)
- `status`: Filter by status (SENT, FAILED, PENDING)
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Limit number of results (default: 50)

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "notification_id": 1,
      "appointment_id": 101,
      "patient_id": 1,
      "patient_name": "John Smith",
      "patient_phone": "9876543210",
      "notification_type": "APPOINTMENT_CONFIRMATION",
      "channel": "WHATSAPP",
      "status": "SENT",
      "message_content": "Your appointment is confirmed...",
      "sent_at": "2024-01-15T10:00:00.000Z",
      "delivered_at": "2024-01-15T10:00:30.000Z"
    }
  ]
}
```

---

### 4. Get Notification Statistics

Get notification statistics for a date range.

```http
GET /notifications/stats?startDate=2024-01-01&endDate=2024-01-31
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER

**Query Parameters** (all optional):

- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "total_sent": 150,
    "total_delivered": 145,
    "total_failed": 5,
    "by_type": {
      "APPOINTMENT_CONFIRMATION": 80,
      "APPOINTMENT_REMINDER": 60,
      "APPOINTMENT_CANCELLATION": 10
    },
    "by_channel": {
      "WHATSAPP": 140,
      "SMS": 10
    },
    "delivery_rate": 96.67
  }
}
```

---

### 5. Get Notification by ID

Get detailed information about a specific notification.

```http
GET /notifications/:id
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Path Parameters**:

- `id`: Notification ID (integer)

**Response** (200):

```json
{
  "success": true,
  "data": {
    "notification_id": 1,
    "appointment_id": 101,
    "patient_id": 1,
    "patient_name": "John Smith",
    "patient_phone": "9876543210",
    "notification_type": "APPOINTMENT_CONFIRMATION",
    "channel": "WHATSAPP",
    "status": "SENT",
    "message_content": "Your appointment is confirmed for 20th Jan 2024 at 10:00 AM with Dr. Sarah Johnson at Bangalore Centre.",
    "sent_at": "2024-01-15T10:00:00.000Z",
    "delivered_at": "2024-01-15T10:00:30.000Z",
    "error_message": null
  }
}
```

---

## Analytics APIs

### 1. Get Dashboard Metrics

Get overall dashboard metrics including patients, doctors, follow-ups, and revenue.

```http
GET /analytics/dashboard
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Response** (200):

```json
{
  "success": true,
  "data": {
    "total_patients": 1250,
    "total_doctors": 45,
    "pending_follow_ups": 78,
    "total_revenue": 5600000,
    "monthly_revenue": 450000,
    "appointments_today": 32,
    "appointments_this_week": 156,
    "appointments_this_month": 678,
    "new_patients_this_month": 89,
    "revenue_growth_percentage": 12.5
  }
}
```

---

### 2. Get Top Doctors

Get top performing doctors based on appointments and revenue.

```http
GET /analytics/top-doctors?limit=10&centreId=1
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Query Parameters** (all optional):

- `limit`: Number of doctors to return (default: 10)
- `centreId`: Filter by centre ID

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "clinician_id": 5,
      "clinician_name": "Dr. Sarah Johnson",
      "specialization": "Psychiatry",
      "total_appointments": 156,
      "completed_appointments": 142,
      "total_revenue": 213000,
      "average_rating": 4.8,
      "completion_rate": 91.03
    },
    {
      "clinician_id": 8,
      "clinician_name": "Dr. Michael Chen",
      "specialization": "Clinical Psychology",
      "total_appointments": 134,
      "completed_appointments": 128,
      "total_revenue": 192000,
      "average_rating": 4.7,
      "completion_rate": 95.52
    }
  ]
}
```

---

### 3. Get Revenue Data

Get revenue data by period (day, week, month, year).

```http
GET /analytics/revenue?period=month&centreId=1
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Query Parameters** (all optional):

- `period`: Time period (day, week, month, year) - default: month
- `centreId`: Filter by centre ID

**Response** (200):

```json
{
  "success": true,
  "data": {
    "period": "month",
    "centre_id": 1,
    "centre_name": "Bangalore Centre",
    "revenue_data": [
      {
        "date": "2024-01-01",
        "revenue": 45000,
        "appointments": 30,
        "average_per_appointment": 1500
      },
      {
        "date": "2024-01-02",
        "revenue": 52500,
        "appointments": 35,
        "average_per_appointment": 1500
      }
    ],
    "total_revenue": 450000,
    "total_appointments": 300,
    "average_revenue_per_day": 14516,
    "growth_percentage": 8.5
  }
}
```

---

### 4. Get Leads by Source

Get appointment distribution by source (web, admin, etc.).

```http
GET /analytics/leads-by-source?centreId=1
```

**Authentication**: Required

**Roles**: ADMIN, MANAGER, CENTRE_MANAGER

**Query Parameters** (all optional):

- `centreId`: Filter by centre ID

**Response** (200):

```json
{
  "success": true,
  "data": {
    "centre_id": 1,
    "centre_name": "Bangalore Centre",
    "sources": [
      {
        "source": "WEB_PATIENT",
        "count": 450,
        "percentage": 45.0,
        "revenue": 675000
      },
      {
        "source": "ADMIN_FRONT_DESK",
        "count": 320,
        "percentage": 32.0,
        "revenue": 480000
      },
      {
        "source": "ADMIN_CARE_COORDINATOR",
        "count": 180,
        "percentage": 18.0,
        "revenue": 270000
      },
      {
        "source": "ADMIN_MANAGER",
        "count": 50,
        "percentage": 5.0,
        "revenue": 75000
      }
    ],
    "total_appointments": 1000,
    "total_revenue": 1500000
  }
}
```

---

## Role-Based Access Control

### Available Roles

| Role             | Description                            |
| ---------------- | -------------------------------------- |
| ADMIN            | Full system access                     |
| MANAGER          | Management level access across centres |
| CENTRE_MANAGER   | Management access for specific centre  |
| CARE_COORDINATOR | Patient care coordination              |
| FRONT_DESK       | Front desk operations                  |
| CLINICIAN        | Medical professional access            |

### Role Permissions Summary

| Endpoint Category                | ADMIN | MANAGER | CENTRE_MANAGER | CARE_COORDINATOR | FRONT_DESK | CLINICIAN |
| -------------------------------- | ----- | ------- | -------------- | ---------------- | ---------- | --------- |
| **Authentication**               | ✓     | ✓       | ✓              | ✓                | ✓          | ✓         |
| **Patients - View**              | ✓     | ✓       | ✓              | ✓                | ✓          | ✓         |
| **Patients - Create/Update**     | ✓     | ✓       | ✓              | ✓                | ✓          | ✗         |
| **Patients - Add Notes**         | ✓     | ✗       | ✗              | ✗                | ✗          | ✓         |
| **Appointments - View**          | ✓     | ✓       | ✓              | ✓                | ✓          | ✓         |
| **Appointments - Create**        | ✓     | ✓       | ✓              | ✓                | ✓          | ✗         |
| **Appointments - Update**        | ✓     | ✓       | ✓              | ✓                | ✗          | ✗         |
| **Appointments - Cancel**        | ✓     | ✓       | ✓              | ✓                | ✓          | ✗         |
| **Staff - Manage**               | ✓     | ✗       | ✗              | ✗                | ✗          | ✗         |
| **Clinicians - View**            | ✓     | ✓       | ✓              | ✓                | ✓          | ✓         |
| **Clinicians - Manage**          | ✓     | ✗       | ✓              | ✗                | ✗          | ✗         |
| **Centres - View**               | ✓     | ✓       | ✓              | ✓                | ✓          | ✓         |
| **Centres - Create**             | ✓     | ✗       | ✗              | ✗                | ✗          | ✗         |
| **Centres - Update**             | ✓     | ✗       | ✓              | ✗                | ✗          | ✗         |
| **Centres - Delete**             | ✓     | ✗       | ✗              | ✗                | ✗          | ✗         |
| **Payments - View**              | ✓     | ✓       | ✓              | ✓                | ✓          | ✗         |
| **Payments - Refund**            | ✓     | ✓       | ✗              | ✗                | ✗          | ✗         |
| **Video - Generate Link**        | ✓     | ✓       | ✓              | ✓                | ✓          | ✗         |
| **Video - Manage Links**         | ✓     | ✓       | ✓              | ✗                | ✗          | ✗         |
| **Notifications - Send**         | ✓     | ✓       | ✓              | ✓                | ✓          | ✗         |
| **Notifications - View History** | ✓     | ✓       | ✗              | ✗                | ✗          | ✗         |
| **Analytics**                    | ✓     | ✓       | ✓              | ✗                | ✗          | ✗         |

---

## Data Types & Enums

### Appointment Types

```typescript
type AppointmentType =
  | "IN_PERSON" // Physical consultation at centre
  | "ONLINE" // Video consultation
  | "INPATIENT_ASSESSMENT" // Assessment for inpatient admission
  | "FOLLOW_UP"; // Follow-up consultation
```

### Appointment Status

```typescript
type AppointmentStatus =
  | "BOOKED" // Initial booking
  | "CONFIRMED" // Confirmed by patient/staff
  | "RESCHEDULED" // Rescheduled to new time
  | "COMPLETED" // Consultation completed
  | "CANCELLED" // Cancelled by patient/staff
  | "NO_SHOW"; // Patient didn't show up
```

### Appointment Source

```typescript
type AppointmentSource =
  | "WEB_PATIENT" // Booked by patient via web
  | "ADMIN_FRONT_DESK" // Booked by front desk staff
  | "ADMIN_CARE_COORDINATOR" // Booked by care coordinator
  | "ADMIN_MANAGER"; // Booked by manager
```

### User Type

```typescript
type UserType =
  | "PATIENT" // Patient user
  | "STAFF"; // Staff user (various roles)
```

### Payment Status

```typescript
type PaymentStatus =
  | "PENDING" // Payment initiated
  | "SUCCESS" // Payment successful
  | "FAILED" // Payment failed
  | "REFUNDED"; // Payment refunded
```

### Notification Type

```typescript
type NotificationType =
  | "APPOINTMENT_CONFIRMATION" // Appointment confirmed
  | "APPOINTMENT_REMINDER" // Reminder before appointment
  | "APPOINTMENT_CANCELLATION"; // Appointment cancelled
```

### Notification Channel

```typescript
type NotificationChannel =
  | "WHATSAPP" // WhatsApp via Gallabox
  | "SMS" // SMS message
  | "EMAIL"; // Email notification
```

### Consultation Mode

```typescript
type ConsultationMode =
  | "IN_PERSON" // Only in-person consultations
  | "ONLINE" // Only online consultations
  | "BOTH"; // Both modes available
```

---

## Common Request/Response Patterns

### Pagination

For endpoints that return lists, pagination can be implemented:

**Request**:

```http
GET /api/patients?page=1&limit=20
```

**Response**:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Date Formats

- **Date Only**: `YYYY-MM-DD` (e.g., `2024-01-20`)
- **DateTime**: ISO 8601 format (e.g., `2024-01-20T10:00:00.000Z`)
- **Time Only**: `HH:MM` format (e.g., `09:30`)

### Phone Number Format

- **Format**: 10 digits starting with 6-9
- **Example**: `9876543210`
- **Validation**: Must match regex `^[6-9]\d{9}$`

### Currency

- **Currency**: INR (Indian Rupees)
- **Format**: Amount in paise (smallest unit)
- **Example**: ₹1500 = 150000 paise

---

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mibo_db

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
```

### Optional Variables

```bash
# Server
PORT=5000
NODE_ENV=development

# JWT Expiry
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OTP
OTP_EXPIRY_MINUTES=10

# Gallabox (WhatsApp)
GALLABOX_BASE_URL=https://api.gallabox.com/wa/api/v1
GALLABOX_API_KEY=your_api_key
GALLABOX_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Google Meet
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Testing the API

### Using cURL

#### Example: Login with Phone + Password

```bash
curl -X POST http://localhost:5000/api/auth/login/phone-password \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "password": "SecurePass123"
  }'
```

#### Example: Get Patients (with authentication)

```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

#### Example: Create Appointment

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "clinician_id": 5,
    "centre_id": 1,
    "appointment_type": "IN_PERSON",
    "scheduled_start_at": "2024-01-20T10:00:00.000Z",
    "duration_minutes": 30
  }'
```

### Using JavaScript/Fetch

#### Example: Login

```javascript
const response = await fetch(
  "http://localhost:5000/api/auth/login/phone-password",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: "9876543210",
      password: "SecurePass123",
    }),
  }
);

const data = await response.json();
const accessToken = data.data.accessToken;
```

#### Example: Get Appointments

```javascript
const response = await fetch(
  "http://localhost:5000/api/appointments?status=BOOKED",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }
);

const appointments = await response.json();
```

#### Example: Create Patient

```javascript
const response = await fetch("http://localhost:5000/api/patients", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    phone: "9876543211",
    full_name: "Jane Doe",
    email: "jane@example.com",
    date_of_birth: "1995-03-15",
    gender: "Female",
  }),
});

const patient = await response.json();
```

---

## Common Error Scenarios

### 401 Unauthorized

**Cause**: Missing or invalid access token

**Response**:

```json
{
  "success": false,
  "message": "Unauthorized. Please login again.",
  "error": "TOKEN_EXPIRED"
}
```

**Solution**: Refresh the access token using the refresh token endpoint

---

### 403 Forbidden

**Cause**: User doesn't have required role/permission

**Response**:

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions.",
  "requiredRoles": ["ADMIN", "MANAGER"]
}
```

**Solution**: Ensure the user has the appropriate role

---

### 404 Not Found

**Cause**: Resource doesn't exist

**Response**:

```json
{
  "success": false,
  "message": "Patient not found",
  "resourceType": "Patient",
  "resourceId": 999
}
```

---

### 422 Validation Error

**Cause**: Invalid request data

**Response**:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be 10 digits"
    },
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Solution**: Fix the validation errors and retry

---

### 409 Conflict

**Cause**: Resource conflict (e.g., duplicate appointment slot)

**Response**:

```json
{
  "success": false,
  "message": "Appointment slot already booked",
  "conflictType": "SLOT_UNAVAILABLE",
  "details": {
    "clinician_id": 5,
    "scheduled_start_at": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### 500 Internal Server Error

**Cause**: Server-side error

**Response**:

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later.",
  "errorId": "err_abc123xyz"
}
```

**Solution**: Contact support with the errorId

---

## Quick Reference - All Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/login/phone-otp` - Login with phone + OTP
- `POST /api/auth/login/phone-password` - Login with phone + password
- `POST /api/auth/login/username-password` - Login with username + password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Patients

- `GET /api/patients` - Get patients list
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `POST /api/patients/:id/notes` - Add medical note

### Appointments

- `GET /api/appointments` - Get appointments
- `GET /api/appointments/availability` - Get clinician availability
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Staff/Users

- `GET /api/users` - Get staff users
- `GET /api/users/:id` - Get staff user by ID
- `POST /api/users` - Create staff user
- `PUT /api/users/:id` - Update staff user
- `DELETE /api/users/:id` - Delete staff user

### Clinicians

- `GET /api/clinicians` - Get clinicians
- `GET /api/clinicians/:id` - Get clinician by ID
- `POST /api/clinicians` - Create clinician
- `PUT /api/clinicians/:id` - Update clinician
- `DELETE /api/clinicians/:id` - Delete clinician
- `PUT /api/clinicians/:id/availability` - Update clinician availability

### Centres

- `GET /api/centres` - Get centres
- `GET /api/centres/:id` - Get centre by ID
- `POST /api/centres` - Create centre
- `PUT /api/centres/:id` - Update centre
- `DELETE /api/centres/:id` - Delete centre

### Payments

- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Razorpay webhook
- `GET /api/payments` - Get payments
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/patient/:id` - Get payments by patient
- `POST /api/payments/refund` - Create refund

### Video

- `POST /api/video/generate-meet-link` - Generate Google Meet link
- `GET /api/video/appointment/:id/meet-link` - Get Meet link
- `PUT /api/video/appointment/:id/meet-link` - Update Meet link
- `DELETE /api/video/appointment/:id/meet-link` - Delete Meet link
- `GET /api/video/links` - Get all video links

### Notifications

- `POST /api/notifications/appointment-confirmation` - Send confirmation
- `POST /api/notifications/appointment-reminder` - Send reminder
- `GET /api/notifications/history` - Get notification history
- `GET /api/notifications/stats` - Get notification statistics
- `GET /api/notifications/:id` - Get notification by ID

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/top-doctors` - Get top doctors
- `GET /api/analytics/revenue` - Get revenue data
- `GET /api/analytics/leads-by-source` - Get leads by source

### Health

- `GET /api/health` - Health check
- `GET /api/` - API root information

---

## Integration Guide for Frontend

### Step 1: Setup API Client

Create a base API client with authentication handling:

```javascript
// api/client.js
const API_BASE_URL = "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiry
        if (response.status === 401 && this.refreshToken) {
          await this.refreshAccessToken();
          return this.request(endpoint, options);
        }
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async refreshAccessToken() {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    const data = await response.json();

    if (response.ok) {
      this.accessToken = data.data.accessToken;
      this.refreshToken = data.data.refreshToken;
      localStorage.setItem("accessToken", this.accessToken);
      localStorage.setItem("refreshToken", this.refreshToken);
    } else {
      // Refresh failed, logout user
      this.logout();
      throw new Error("Session expired. Please login again.");
    }
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // HTTP Methods
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, body) {
    return this.request(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
```

---

### Step 2: Create API Service Modules

Organize API calls by feature:

```javascript
// api/auth.service.js
import { apiClient } from "./client";

export const authService = {
  sendOtp: (phone) => apiClient.post("/auth/send-otp", { phone }),

  loginWithPhoneOtp: (phone, otp) =>
    apiClient.post("/auth/login/phone-otp", { phone, otp }),

  loginWithPhonePassword: (phone, password) =>
    apiClient.post("/auth/login/phone-password", { phone, password }),

  loginWithUsername: (username, password) =>
    apiClient.post("/auth/login/username-password", { username, password }),

  refreshToken: (refreshToken) =>
    apiClient.post("/auth/refresh", { refreshToken }),

  logout: (refreshToken) => apiClient.post("/auth/logout", { refreshToken }),

  getCurrentUser: () => apiClient.get("/auth/me"),
};

// api/patients.service.js
import { apiClient } from "./client";

export const patientsService = {
  getPatients: (params) => apiClient.get("/patients", params),

  getPatientById: (id) => apiClient.get(`/patients/${id}`),

  createPatient: (data) => apiClient.post("/patients", data),

  updatePatient: (id, data) => apiClient.put(`/patients/${id}`, data),

  getPatientAppointments: (id) => apiClient.get(`/patients/${id}/appointments`),

  addMedicalNote: (id, note) =>
    apiClient.post(`/patients/${id}/notes`, { note }),
};

// api/appointments.service.js
import { apiClient } from "./client";

export const appointmentsService = {
  getAppointments: (params) => apiClient.get("/appointments", params),

  getAppointmentById: (id) => apiClient.get(`/appointments/${id}`),

  getClinicianAvailability: (params) =>
    apiClient.get("/appointments/availability", params),

  createAppointment: (data) => apiClient.post("/appointments", data),

  updateAppointment: (id, data) => apiClient.put(`/appointments/${id}`, data),

  cancelAppointment: (id, reason) =>
    apiClient.delete(`/appointments/${id}`, { reason }),
};

// api/payments.service.js
import { apiClient } from "./client";

export const paymentsService = {
  createOrder: (appointmentId) =>
    apiClient.post("/payments/create-order", { appointment_id: appointmentId }),

  verifyPayment: (data) => apiClient.post("/payments/verify", data),

  getPayments: (params) => apiClient.get("/payments", params),

  getPaymentById: (id) => apiClient.get(`/payments/${id}`),

  getPaymentsByPatient: (patientId) =>
    apiClient.get(`/payments/patient/${patientId}`),

  createRefund: (data) => apiClient.post("/payments/refund", data),
};
```

---

### Step 3: Usage Examples in Components

#### Login Component

```javascript
import { authService } from "./api/auth.service";
import { apiClient } from "./api/client";

async function handleLogin(phone, password) {
  try {
    const response = await authService.loginWithPhonePassword(phone, password);

    // Store tokens
    apiClient.setTokens(response.data.accessToken, response.data.refreshToken);

    // Store user info
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Redirect to dashboard
    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
}
```

#### Patients List Component

```javascript
import { patientsService } from "./api/patients.service";

async function loadPatients(searchTerm = "", phone = "") {
  try {
    const response = await patientsService.getPatients({
      search: searchTerm,
      phone: phone,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to load patients:", error.message);
    return [];
  }
}
```

#### Create Appointment Component

```javascript
import { appointmentsService } from "./api/appointments.service";

async function createAppointment(formData) {
  try {
    const response = await appointmentsService.createAppointment({
      patient_id: formData.patientId,
      clinician_id: formData.clinicianId,
      centre_id: formData.centreId,
      appointment_type: formData.type,
      scheduled_start_at: formData.dateTime,
      duration_minutes: formData.duration || 30,
      notes: formData.notes,
    });

    alert("Appointment created successfully!");
    return response.data;
  } catch (error) {
    console.error("Failed to create appointment:", error.message);
    alert("Failed to create appointment: " + error.message);
  }
}
```

#### Payment Integration with Razorpay

```javascript
import { paymentsService } from "./api/payments.service";

async function initiatePayment(appointmentId) {
  try {
    // Step 1: Create order
    const orderResponse = await paymentsService.createOrder(appointmentId);
    const { order_id, amount, currency, razorpay_key_id } = orderResponse.data;

    // Step 2: Open Razorpay checkout
    const options = {
      key: razorpay_key_id,
      amount: amount,
      currency: currency,
      order_id: order_id,
      name: "Mibo Mental Hospital",
      description: "Appointment Payment",
      handler: async function (response) {
        // Step 3: Verify payment
        try {
          await paymentsService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful!");
          window.location.href = "/appointments";
        } catch (error) {
          alert("Payment verification failed: " + error.message);
        }
      },
      prefill: {
        name: "Patient Name",
        email: "patient@example.com",
        contact: "9876543210",
      },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment initiation failed:", error.message);
    alert("Failed to initiate payment: " + error.message);
  }
}
```

---

## Best Practices

### 1. Token Management

- Store tokens securely (localStorage or httpOnly cookies)
- Implement automatic token refresh before expiry
- Clear tokens on logout
- Handle 401 errors gracefully

### 2. Error Handling

```javascript
try {
  const response = await apiClient.get("/patients");
  // Handle success
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show permission denied message
  } else if (error.status === 422) {
    // Show validation errors
  } else {
    // Show generic error message
  }
}
```

### 3. Loading States

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function loadData() {
  setLoading(true);
  setError(null);

  try {
    const data = await apiClient.get("/patients");
    // Update state with data
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### 4. Request Cancellation

```javascript
const abortController = new AbortController();

fetch(url, {
  signal: abortController.signal,
  // ... other options
});

// Cancel request when component unmounts
return () => abortController.abort();
```

### 5. Caching

Consider implementing caching for frequently accessed data:

```javascript
const cache = new Map();

async function getCachedData(key, fetchFn, ttl = 60000) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### 6. Rate Limiting

Implement debouncing for search inputs:

```javascript
import { debounce } from "lodash";

const debouncedSearch = debounce(async (searchTerm) => {
  const results = await patientsService.getPatients({ search: searchTerm });
  // Update UI with results
}, 300);
```

---

## Troubleshooting

### Issue: CORS Errors

**Problem**: Browser blocks requests due to CORS policy

**Solution**:

1. Ensure backend has correct CORS configuration
2. Check `CORS_ORIGIN` environment variable matches your frontend URL
3. For development, set `CORS_ORIGIN=http://localhost:5173`

---

### Issue: Token Expired

**Problem**: Getting 401 errors after some time

**Solution**:

1. Implement automatic token refresh
2. Use the `/auth/refresh` endpoint before token expires
3. Handle 401 errors by refreshing token and retrying request

---

### Issue: Validation Errors

**Problem**: Getting 422 errors with validation messages

**Solution**:

1. Check the `errors` array in response
2. Display field-specific error messages to user
3. Ensure all required fields are provided
4. Validate data format (phone, email, dates) before sending

---

### Issue: Payment Verification Fails

**Problem**: Payment successful but verification fails

**Solution**:

1. Ensure Razorpay webhook is configured correctly
2. Check `RAZORPAY_KEY_SECRET` is correct
3. Verify signature calculation matches Razorpay's algorithm
4. Check webhook endpoint is accessible from Razorpay servers

---

### Issue: Appointment Slot Conflicts

**Problem**: Getting 409 error when creating appointment

**Solution**:

1. Check clinician availability before booking
2. Use `/appointments/availability` endpoint
3. Implement real-time slot checking
4. Show only available slots to user

---

### Issue: WhatsApp Notifications Not Sending

**Problem**: Notifications not being delivered

**Solution**:

1. Verify Gallabox credentials are correct
2. Check `GALLABOX_API_KEY` and `GALLABOX_API_SECRET`
3. Ensure phone numbers are in correct format (10 digits)
4. Check Gallabox account has sufficient credits
5. Review notification history for error messages

---

## Support & Contact

### Documentation

- **API Reference**: This document
- **Database Schema**: See `database/schema.sql`
- **Environment Setup**: See `.env.example`

### Getting Help

For technical support or questions:

1. Check this API reference documentation
2. Review error messages and troubleshooting section
3. Check server logs for detailed error information
4. Contact the backend development team

### Reporting Issues

When reporting issues, please include:

- API endpoint being called
- Request payload (remove sensitive data)
- Response received
- Error messages
- Steps to reproduce
- Expected vs actual behavior

---

## Changelog

### Version 1.0.0 (Current)

**Initial Release**

- Complete authentication system with OTP and password login
- Patient management APIs
- Appointment scheduling and management
- Staff and clinician management
- Centre management
- Payment integration with Razorpay
- Video consultation links (Google Meet)
- WhatsApp notifications via Gallabox
- Analytics and reporting APIs
- Role-based access control

---

## Appendix

### Sample Data for Testing

#### Test User Credentials

```json
{
  "admin": {
    "username": "admin",
    "password": "Admin@123",
    "roles": ["ADMIN"]
  },
  "manager": {
    "phone": "9876543210",
    "password": "Manager@123",
    "roles": ["MANAGER"]
  },
  "clinician": {
    "phone": "9876543211",
    "password": "Doctor@123",
    "roles": ["CLINICIAN"]
  }
}
```

#### Sample Patient Data

```json
{
  "phone": "9876543220",
  "full_name": "Test Patient",
  "email": "patient@test.com",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "blood_group": "O+"
}
```

#### Sample Appointment Data

```json
{
  "patient_id": 1,
  "clinician_id": 5,
  "centre_id": 1,
  "appointment_type": "IN_PERSON",
  "scheduled_start_at": "2024-01-25T10:00:00.000Z",
  "duration_minutes": 30,
  "notes": "Initial consultation"
}
```

---

**End of API Reference Documentation**

_Last Updated: December 2025_  
_Version: 1.0.0_  
_Mibo Mental Hospital Chain Backend API_
