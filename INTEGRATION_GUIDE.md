# Frontend Integration Guide

Complete guide for integrating the Mibo frontend with the backend API.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173` (or 5174 if port is in use)

## Backend Integration

### Backend Setup

Make sure backend is running first:

```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### API Base URL

All API calls use the base URL from environment:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

## Booking Flow Integration

### Step 1: Select Doctor & Time

**Component**: `src/pages/BookAppointment/Step1SelectDoctor.tsx`

- Doctors loaded from static data (no API call needed)
- User selects doctor, date, time, consultation type
- Data stored in booking state

### Step 2: Phone Verification

**Component**: `src/pages/BookAppointment/Step2PhoneVerification.tsx`

**Send OTP**:

```typescript
const response = await fetch("http://localhost:5000/api/test/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: "919876543210" }),
});

const data = await response.json();
// OTP shown in browser alert (test mode)
// OTP sent to WhatsApp (when Gallabox is working)
```

**Verify OTP**:

```typescript
const response = await fetch("http://localhost:5000/api/test/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: "919876543210",
    otp: "123456",
  }),
});

const data = await response.json();
// Returns: { accessToken, refreshToken, phone, verified: true }
```

### Step 3: Confirm Booking

**Component**: `src/pages/BookAppointment/Step3ConfirmBooking.tsx`

- Display booking summary
- Proceed to payment
- Show confirmation

## API Services

All API integration is in `src/services/`:

### Authentication Service

**File**: `src/services/authService.ts`

```typescript
// Send OTP
export const sendOTP = async (phone: string) => {
  const response = await axios.post(`${API_BASE_URL}/test/send-otp`, {
    phone: `91${phone}`, // Add country code
  });
  return response.data;
};

// Verify OTP
export const verifyOTP = async (phone: string, otp: string) => {
  const response = await axios.post(`${API_BASE_URL}/test/verify-otp`, {
    phone: `91${phone}`,
    otp,
  });
  return response.data;
};
```

### Booking Service

**File**: `src/services/bookingService.ts`

```typescript
// Create booking (requires auth token)
export const createBooking = async (bookingData: any, token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/booking/confirm`,
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
```

### Patient Dashboard Service

**File**: `src/services/patientDashboardService.ts`

```typescript
// Get patient profile
export const getProfile = async (token: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/patient-dashboard/profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Get appointments
export const getAppointments = async (token: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/patient-dashboard/appointments`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
```

## Authentication Flow

### 1. User Enters Phone Number

```typescript
const [phone, setPhone] = useState("");
```

### 2. Send OTP

```typescript
const handleSendOtp = async () => {
  try {
    const formattedPhone = `91${phone}`;
    const result = await sendOTP(formattedPhone);

    // In test mode, OTP shown in alert
    if (result.data.otp) {
      alert(`TEST MODE: Your OTP is ${result.data.otp}`);
    }

    setOtpSent(true);
  } catch (error) {
    console.error("Failed to send OTP:", error);
  }
};
```

### 3. Verify OTP

```typescript
const handleVerifyOtp = async (otpValue: string) => {
  try {
    const formattedPhone = `91${phone}`;
    const result = await verifyOTP(formattedPhone, otpValue);

    // Store tokens
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);

    // Update booking data
    setBookingData({
      ...bookingData,
      phone: `+${formattedPhone}`,
      accessToken: result.data.accessToken,
    });

    // Continue to next step
    onContinue();
  } catch (error) {
    console.error("Invalid OTP:", error);
  }
};
```

### 4. Use Token for Authenticated Requests

```typescript
const token = localStorage.getItem("accessToken");

const response = await fetch(`${API_BASE_URL}/patient-dashboard/profile`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Payment Integration (Razorpay)

### 1. Load Razorpay Script

```typescript
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);
```

### 2. Create Payment Order

```typescript
const createPaymentOrder = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await axios.post(
    `${API_BASE_URL}/payment/create-order`,
    {
      appointmentId: bookingData.appointmentId,
      amount: 500, // Amount in rupees
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
```

### 3. Open Razorpay Checkout

```typescript
const handlePayment = async () => {
  const order = await createPaymentOrder();

  const options = {
    key: order.data.razorpayKeyId, // From backend
    amount: order.data.amount, // In paise
    currency: order.data.currency,
    order_id: order.data.orderId,
    name: "Mibo Mental Hospital",
    description: "Consultation Fee",
    handler: async (response: any) => {
      // Payment successful
      await verifyPayment(response);
    },
    prefill: {
      contact: bookingData.phone,
    },
    theme: {
      color: "#1c0d54",
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
```

### 4. Verify Payment

```typescript
const verifyPayment = async (paymentResponse: any) => {
  const token = localStorage.getItem("accessToken");

  await axios.post(
    `${API_BASE_URL}/payment/verify`,
    {
      appointmentId: bookingData.appointmentId,
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Show success message
  alert("Payment successful! Appointment confirmed.");
};
```

## Error Handling

### API Error Response Format

```typescript
{
  success: false,
  message: "Error description",
  error: "Detailed error message"
}
```

### Handle Errors

```typescript
try {
  const response = await axios.post(API_URL, data);
  return response.data;
} catch (error: any) {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || "Something went wrong";
    throw new Error(message);
  } else if (error.request) {
    // No response from server
    throw new Error("Cannot connect to server. Please check your connection.");
  } else {
    // Other errors
    throw new Error(error.message);
  }
}
```

## State Management

### Booking State

```typescript
interface BookingData {
  doctorId: string;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: "online" | "in-person";
  phone?: string;
  accessToken?: string;
  refreshToken?: string;
}

const [bookingData, setBookingData] = useState<BookingData>({
  doctorId: "",
  doctorName: "",
  specialization: "",
  appointmentDate: "",
  appointmentTime: "",
  consultationType: "online",
});
```

### Update State

```typescript
setBookingData({
  ...bookingData,
  phone: "+919876543210",
  accessToken: "jwt_token",
});
```

## Testing

### Test Mode Features

- OTP shown in browser alert
- No database required
- Mock tokens returned
- All endpoints work without real data

### Test OTP Flow

1. Enter phone: `9876543210`
2. Click "Send OTP"
3. Check browser alert for OTP
4. Enter OTP from alert
5. Click "Verify & Continue"

### Test with cURL

```bash
# Send OTP
curl -X POST http://localhost:5000/api/test/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"919876543210"}'

# Verify OTP
curl -X POST http://localhost:5000/api/test/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"919876543210","otp":"123456"}'
```

## Common Issues

### CORS Errors

**Problem**: `Access to fetch has been blocked by CORS policy`

**Solution**: Backend is configured for ports 5173 and 5174. If using different port, update backend `.env`:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:YOUR_PORT
```

### Backend Not Running

**Problem**: `Failed to fetch` or `ERR_CONNECTION_REFUSED`

**Solution**: Start backend server:

```bash
cd backend
npm run dev
```

### OTP Not Received on WhatsApp

**Problem**: OTP only shows in browser alert

**Status**: ✅ FIXED! WhatsApp OTP now working

**Solution**: Backend updated with correct Gallabox API format. OTP will be delivered to WhatsApp.

### Token Expired

**Problem**: `401 Unauthorized` on authenticated requests

**Solution**: Implement token refresh:

```typescript
const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  const response = await axios.post(
    `${API_BASE_URL}/patient-auth/refresh-token`,
    {
      refreshToken: refresh,
    }
  );

  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data.accessToken;
};
```

## API Endpoints Reference

### Test Endpoints (No Auth Required)

- `POST /test/send-otp` - Send OTP
- `POST /test/verify-otp` - Verify OTP
- `GET /test/otp-status` - Check OTP status

### Patient Auth (No Auth Required)

- `POST /patient-auth/send-otp` - Send OTP
- `POST /patient-auth/verify-otp` - Verify OTP
- `POST /patient-auth/refresh-token` - Refresh token

### Booking (Auth Required)

- `POST /booking/initiate` - Start booking
- `POST /booking/confirm` - Confirm booking

### Payment (Auth Required)

- `POST /payment/create-order` - Create Razorpay order
- `POST /payment/verify` - Verify payment
- `POST /payment/create-link` - Create payment link

### Patient Dashboard (Auth Required)

- `GET /patient-dashboard/profile` - Get profile
- `PUT /patient-dashboard/profile` - Update profile
- `GET /patient-dashboard/appointments` - Get appointments
- `POST /patient-dashboard/appointments/:id/cancel` - Cancel appointment

See [backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md) for complete API reference.

## TypeScript Interfaces

```typescript
// API Response
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// OTP Response
interface OTPResponse {
  phone: string;
  otp?: string; // Only in development
}

// Verify OTP Response
interface VerifyOTPResponse {
  phone: string;
  verified: boolean;
  accessToken: string;
  refreshToken: string;
}

// Appointment
interface Appointment {
  id: string;
  appointmentNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  consultationType: "online" | "in-person";
  clinician: {
    name: string;
    specialization: string;
  };
  centre?: {
    name: string;
    address: string;
  };
}
```

## Next Steps

1. Complete payment flow integration
2. Add patient dashboard features
3. Implement appointment management
4. Add profile editing
5. Set up error boundaries
6. Add loading states
7. Implement offline support

## Support

For backend API issues, see:

- [backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md)
- [backend/SETUP_GUIDE.md](../backend/SETUP_GUIDE.md)
- [backend/PROJECT_OVERVIEW.md](../backend/PROJECT_OVERVIEW.md)

For frontend issues:

- Check browser console for errors
- Verify backend is running
- Check `.env` configuration
- Review network tab in DevTools
