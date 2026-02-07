# Complete API Documentation

# Mibo Mental Health - Clinic Booking System

**Version:** 1.0.0  
**Last Updated:** February 7, 2026  
**Architecture:** Monolithic Backend with 3 Frontend Applications

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Admin Panel API Usage](#admin-panel-api-usage)
6. [Patient Frontend API Usage](#patient-frontend-api-usage)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Deployment Information](#deployment-information)

---

## System Overview

### Applications

1. **Backend** (`backend/`) - Node.js/Express REST API
   - Port: 5000 (production uses AWS-assigned port)
   - Database: PostgreSQL (AWS RDS)
   - Deployed on: AWS Elastic Beanstalk

2. **Admin Panel** (`mibo-admin/`) - React/TypeScript SPA
   - For staff management (ADMIN, MANAGER, CENTRE_MANAGER, etc.)
   - Manages clinicians, appointments, patients, centres

3. **Patient Frontend** (`mibo_version-2/`) - React/TypeScript SPA
   - For patients to book appointments
   - OTP-based authentication
   - Payment integration (Razorpay)

### Technology Stack

**Backend:**

- Node.js 18+
- Express 5.x
- TypeScript
- PostgreSQL (pg-promise)
- JWT Authentication
- Razorpay Payment Gateway
- Gallabox WhatsApp Integration
- Google Meet API

**Frontend (Both):**

- React 18
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS

---

## Architecture

### Monolithic Backend Structure

```
backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Database operations
│   ├── middlewares/     # Auth, validation, error handling
│   ├── validations/     # Input validation schemas
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration files
│   └── types/           # TypeScript type definitions
```

### Request/Response Flow

```
Client (Admin/Patient)
    ↓
Frontend (React SPA)
    ↓
API Client (Axios with interceptors)
    ↓
Backend API (Express)
    ↓
Middleware (Auth, Validation)
    ↓
Controller (Request handling)
    ↓
Service (Business logic)
    ↓
Repository (Database operations)
    ↓
PostgreSQL Database
```

---

## Authentication

### Staff Authentication (Admin Panel)

**Endpoint:** `/api/auth/*`

**Supported Methods:**

1. Phone + OTP
2. Phone + Password
3. Username + Password

**Token Types:**

- **Access Token:** JWT, expires in 15 minutes
- **Refresh Token:** JWT, expires in 7 days

**Storage:** localStorage

- `accessToken` - Used for API authentication
- `refreshToken` - Used to get new access token
- `user` - User object with role information

**Roles:**

- ADMIN
- MANAGER
- CENTRE_MANAGER
- CARE_COORDINATOR
- FRONT_DESK
- CLINICIAN

### Patient Authentication (Patient Frontend)

**Endpoint:** `/api/patient-auth/*`

**Method:** Phone OTP only (via WhatsApp)

**Flow:**

1. Send OTP to phone → WhatsApp message sent
2. Verify OTP → Returns tokens
3. Store tokens in localStorage

**Storage:** localStorage

- `mibo_access_token`
- `mibo_refresh_token`
- `mibo_user`

---

## Backend API Endpoints

### Base URL

- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-aws-url.com/api`

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": []
  }
}
```

---

## 1. STAFF AUTHENTICATION ENDPOINTS

### 1.1 Send OTP

**POST** `/api/auth/send-otp`

Send OTP to staff user's phone number.

**Request:**

```json
{
  "phone": "919876543210"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 600
  }
}
```

**Roles:** Public (no authentication required)

---

### 1.2 Login with Phone + OTP

**POST** `/api/auth/login/phone-otp`

**Request:**

```json
{
  "phone": "919876543210",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "phone": "919876543210",
      "email": "john@example.com",
      "role": "ADMIN",
      "isActive": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Login with Phone + Password

**POST** `/api/auth/login/phone-password`

**Request:**

```json
{
  "phone": "919876543210",
  "password": "SecurePassword123"
}
```

**Response:** Same as 1.2

---

### 1.4 Login with Username + Password

**POST** `/api/auth/login/username-password`

**Request:**

```json
{
  "username": "johndoe",
  "password": "SecurePassword123"
}
```

**Response:** Same as 1.2

---

### 1.5 Refresh Token

**POST** `/api/auth/refresh`

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.6 Logout

**POST** `/api/auth/logout`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.7 Get Current User

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "phone": "919876543210",
      "email": "john@example.com",
      "role": "ADMIN",
      "centreId": 1,
      "isActive": true
    }
  }
}
```
