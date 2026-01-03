# Frontend API Integration Status

## 🔍 Current Status Analysis

### ✅ What's Working

1. **Services Layer** - All service files are correctly configured:

   - `authService.ts` ✅ Uses production endpoints (`/patient-auth/*`)
   - `patientDashboardService.ts` ✅ Uses production endpoints (`/patient/*`)
   - `bookingService.ts` ⚠️ Uses OLD endpoints (needs update)

2. **API Client** - Properly configured with:
   - Base URL from environment variable
   - Authorization header interceptor
   - Token refresh logic

### ❌ What Needs Fixing

#### 1. Step2PhoneVerification.tsx

**Current**: Using test endpoints directly

```typescript
fetch("http://localhost:5000/api/test/send-otp"); // ❌ TEST ENDPOINT
fetch("http://localhost:5000/api/test/verify-otp"); // ❌ TEST ENDPOINT
```

**Should Use**: Production endpoints via authService

```typescript
authService.sendOTP(phone); // ✅ PRODUCTION
authService.verifyOTP(phone, otp, fullName, email); // ✅ PRODUCTION
```

**Missing**: Name and email input fields (required for new users)

#### 2. Step3ConfirmBooking.tsx

**Current**: Using old booking flow

```typescript
bookingService.confirmBooking({...})  // ❌ OLD ENDPOINT
```

**Should Use**: New 3-step flow

```typescript
// Step 1: Create appointment
POST / api / booking / create;

// Step 2: Create payment order
POST / api / payment / create - order;

// Step 3: Verify payment
POST / api / payment / verify;
```

#### 3. bookingService.ts

**Current**: Has old methods

- `initiateBooking()` - Uses `/booking/initiate` (doesn't exist in new backend)
- `confirmBooking()` - Uses `/booking/confirm` (doesn't exist in new backend)

**Should Have**: New methods

- `createAppointment()` - Uses `/booking/create`
- `createPaymentOrder()` - Uses `/payment/create-order`
- `verifyPayment()` - Uses `/payment/verify`

---

## 📊 Backend Endpoints Status

### Authentication Endpoints ✅

| Endpoint                               | Status     | Used By     |
| -------------------------------------- | ---------- | ----------- |
| `POST /api/patient-auth/send-otp`      | ✅ Working | authService |
| `POST /api/patient-auth/verify-otp`    | ✅ Working | authService |
| `POST /api/patient-auth/refresh-token` | ✅ Working | api.ts      |

### Booking Endpoints ✅

| Endpoint                           | Status     | Used By     |
| ---------------------------------- | ---------- | ----------- |
| `POST /api/booking/create`         | ✅ Working | Need to add |
| `GET /api/booking/my-appointments` | ✅ Working | Need to add |
| `POST /api/booking/:id/cancel`     | ✅ Working | Need to add |

### Payment Endpoints ✅

| Endpoint                         | Status     | Used By        |
| -------------------------------- | ---------- | -------------- |
| `POST /api/payment/create-order` | ✅ Working | Need to add    |
| `POST /api/payment/verify`       | ✅ Working | Need to add    |
| `POST /api/payment/create-link`  | ✅ Working | Not needed yet |

### Patient Dashboard Endpoints ✅

| Endpoint                        | Status     | Used By                 |
| ------------------------------- | ---------- | ----------------------- |
| `GET /api/patient/dashboard`    | ✅ Working | patientDashboardService |
| `GET /api/patient/appointments` | ✅ Working | patientDashboardService |
| `GET /api/patient/payments`     | ✅ Working | patientDashboardService |
| `GET /api/patient/profile`      | ✅ Working | patientDashboardService |
| `PUT /api/patient/profile`      | ✅ Working | patientDashboardService |

### Test Endpoints (Should NOT be used in production)

| Endpoint                    | Status       | Currently Used By         |
| --------------------------- | ------------ | ------------------------- |
| `POST /api/test/send-otp`   | ⚠️ Test Only | Step2PhoneVerification ❌ |
| `POST /api/test/verify-otp` | ⚠️ Test Only | Step2PhoneVerification ❌ |

---

## 🎯 Required Changes

### Priority 1: Update Step2PhoneVerification.tsx

**Changes Needed**:

1. Import authService
2. Replace test API calls with authService methods
3. Add name input field (required for new users)
4. Add email input field (optional)
5. Pass name and email to verifyOTP()

**Code Changes**:

```typescript
// At top of file
import authService from "../../services/authService";

// Add state for name and email
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");

// Replace handleSendOtp
const handleSendOtp = async () => {
  if (!validatePhone(phone)) {
    setError("Please enter a valid 10-digit mobile number");
    return;
  }

  setError("");
  setIsLoading(true);

  try {
    const formattedPhone = `91${phone}`;
    const response = await authService.sendOTP(formattedPhone);

    setOtpSent(true);
    setError("");

    // Check if new user (will need name)
    if (response.data.isNewUser) {
      // Show name/email fields
    }
  } catch (err: any) {
    setError(err.message || "Failed to send OTP");
  } finally {
    setIsLoading(false);
  }
};

// Replace handleVerifyOtp
const handleVerifyOtp = async (otpValue?: string) => {
  const otpToVerify = otpValue || otpDigits.join("");

  if (otpToVerify.length !== 6) {
    setError("Please enter complete 6-digit OTP");
    return;
  }

  // Validate name for new users
  if (!fullName.trim()) {
    setError("Please enter your full name");
    return;
  }

  setError("");
  setIsLoading(true);

  try {
    const formattedPhone = `91${phone}`;
    const response = await authService.verifyOTP(
      formattedPhone,
      otpToVerify,
      fullName,
      email || undefined
    );

    setIsVerified(true);

    // Tokens are automatically stored by authService
    // Update booking data
    setBookingData({
      ...bookingData,
      phone: `+${formattedPhone}`,
      fullName: fullName,
      email: email || undefined,
    });

    setTimeout(() => {
      onContinue();
    }, 1000);
  } catch (err: any) {
    setError(err.message || "Invalid OTP");
    setOtpDigits(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  } finally {
    setIsLoading(false);
  }
};
```

**Add Name/Email Fields** (after OTP is sent):

```tsx
{
  otpSent && !isVerified && (
    <>
      {/* Name Input */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2"
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Email <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2"
        />
      </div>

      {/* OTP Input boxes... */}
    </>
  );
}
```

---

### Priority 2: Update Step3ConfirmBooking.tsx

**Changes Needed**:

1. Remove old bookingService.confirmBooking() call
2. Implement new 3-step flow:
   - Create appointment
   - Create payment order
   - Verify payment after Razorpay success

**Code Changes**:

```typescript
const handleConfirmPayment = async () => {
  // Validate inputs
  if (!fullName.trim()) {
    setError("Please enter your full name");
    return;
  }

  setError("");
  setPaymentStep("processing");

  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem("mibo_access_token");
    if (!accessToken) {
      throw new Error("Please login first");
    }

    // Step 1: Create appointment
    const appointmentResponse = await fetch(
      "http://localhost:5000/api/booking/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinicianId: bookingData.clinicianId,
          centreId: bookingData.centreId,
          appointmentDate: bookingData.date.split("T")[0], // "2026-01-10"
          appointmentTime: bookingData.time, // "10:00"
          appointmentType: bookingData.appointmentType, // "ONLINE" or "IN_PERSON"
        }),
      }
    );

    const appointmentData = await appointmentResponse.json();
    if (!appointmentResponse.ok) {
      throw new Error(
        appointmentData.message || "Failed to create appointment"
      );
    }

    const appointmentId = appointmentData.data.appointment.id;

    // Step 2: Create payment order
    const paymentResponse = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
        }),
      }
    );

    const paymentData = await paymentResponse.json();
    if (!paymentResponse.ok) {
      throw new Error(paymentData.message || "Failed to create payment order");
    }

    // Step 3: Open Razorpay
    setPaymentStep("review");
    openRazorpayModal(
      paymentData.data.orderId,
      paymentData.data.amount,
      appointmentId,
      paymentData.data.razorpayKeyId
    );
  } catch (err: any) {
    setError(err.message || "Failed to process booking");
    setPaymentStep("review");
  }
};

// Update openRazorpayModal
const openRazorpayModal = (
  orderId: string,
  amount: number,
  appointmentId: number,
  razorpayKeyId: string
) => {
  if (!window.Razorpay) {
    setError("Payment gateway not loaded. Please refresh and try again.");
    return;
  }

  const options = {
    key: razorpayKeyId, // Use key from backend
    amount: amount, // Already in paise from backend
    currency: "INR",
    name: "Mibo Mental Health",
    description: "Consultation Booking",
    order_id: orderId,
    handler: async function (response: any) {
      // Payment successful - verify on backend
      setPaymentStep("processing");
      try {
        const accessToken = localStorage.getItem("mibo_access_token");

        const verifyResponse = await fetch(
          "http://localhost:5000/api/payment/verify",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appointmentId: appointmentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          }
        );

        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) {
          throw new Error(verifyData.message || "Payment verification failed");
        }

        setPaymentStep("success");

        // Navigate to dashboard
        setTimeout(() => {
          navigate("/profileDashboard", {
            state: {
              bookingSuccess: true,
              appointmentId: appointmentId,
            },
          });
        }, 3000);
      } catch (err: any) {
        setError(err.message || "Payment verification failed");
        setPaymentStep("failed");
      }
    },
    modal: {
      ondismiss: function () {
        setError("Payment cancelled. Please try again.");
        setPaymentStep("review");
      },
    },
    prefill: {
      name: fullName,
      email: email || undefined,
      contact: bookingData.phone,
    },
    theme: {
      color: "#034B44",
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", function (response: any) {
    setError(response.error.description || "Payment failed");
    setPaymentStep("failed");
  });

  razorpay.open();
};
```

---

### Priority 3: Update bookingService.ts

**Remove Old Methods**:

- `initiateBooking()`
- `confirmBooking()`
- `handlePaymentSuccess()`
- `handlePaymentFailure()`

**Add New Methods**:

```typescript
/**
 * Create appointment (requires authentication)
 */
async createAppointment(data: {
  clinicianId: number;
  centreId: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "ONLINE" | "IN_PERSON";
}): Promise<any> {
  const response = await apiClient.post("/booking/create", data);
  return response.data;
}

/**
 * Create payment order (requires authentication)
 */
async createPaymentOrder(appointmentId: number): Promise<any> {
  const response = await apiClient.post("/payment/create-order", {
    appointmentId,
  });
  return response.data;
}

/**
 * Verify payment (requires authentication)
 */
async verifyPayment(data: {
  appointmentId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<any> {
  const response = await apiClient.post("/payment/verify", data);
  return response.data;
}

/**
 * Get my appointments (requires authentication)
 */
async getMyAppointments(): Promise<any> {
  const response = await apiClient.get("/booking/my-appointments");
  return response.data;
}

/**
 * Cancel appointment (requires authentication)
 */
async cancelAppointment(appointmentId: number): Promise<any> {
  const response = await apiClient.post(`/booking/${appointmentId}/cancel`);
  return response.data;
}
```

---

## 🧪 Testing Plan

### Test 1: Authentication Flow

1. Go to booking page
2. Select doctor, date, time
3. Enter phone number → Click "Send OTP"
4. Check WhatsApp for OTP
5. Enter OTP, name, and email → Click "Verify"
6. Should proceed to Step 3

### Test 2: Booking & Payment Flow

1. Review booking details
2. Enter name and email
3. Click "Confirm & Pay"
4. Razorpay modal should open
5. Use test card: `4111 1111 1111 1111`
6. Payment should succeed
7. Should redirect to dashboard

### Test 3: Dashboard

1. Should see appointment in dashboard
2. Should see payment in payment history
3. Should be able to update profile

---

## 📝 Summary

### Current State

- ❌ Frontend using test endpoints
- ❌ Frontend using old booking flow
- ✅ Backend fully ready with all production endpoints
- ✅ Services layer correctly configured (except bookingService)

### Required Actions

1. **Update Step2PhoneVerification.tsx** - Use authService instead of test endpoints
2. **Update Step3ConfirmBooking.tsx** - Use new 3-step booking flow
3. **Update bookingService.ts** - Add new methods for production endpoints

### Estimated Time

- Step2PhoneVerification: 30 minutes
- Step3ConfirmBooking: 45 minutes
- bookingService: 15 minutes
- Testing: 30 minutes
- **Total: ~2 hours**

---

## 🚀 Next Steps

1. ✅ Backend is ready (all endpoints working)
2. 🔄 Update frontend components (this document)
3. 🔄 Test complete booking flow
4. 🔄 Deploy to production

**Status**: Ready to implement frontend updates!

---

**Last Updated**: January 3, 2026
**Backend**: ✅ Ready
**Frontend**: ⚠️ Needs Updates
