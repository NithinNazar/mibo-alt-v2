# ⚠️ Frontend Update Required

## Current Status

**Backend**: ✅ All 4 steps complete and ready  
**Frontend**: ❌ Still using OLD test endpoints

---

## What Needs to Be Updated

### 1. Authentication Flow (Step2PhoneVerification.tsx)

**Current**: Using test endpoints

```typescript
// ❌ OLD - Test endpoints (no database)
fetch("http://localhost:5000/api/test/send-otp");
fetch("http://localhost:5000/api/test/verify-otp");
```

**Needs**: Production endpoints

```typescript
// ✅ NEW - Production endpoints (with database)
authService.sendOTP(phone);
authService.verifyOTP(phone, otp, fullName, email);
```

**Changes Required**:

- Replace test API calls with `authService` methods
- Add name and email input fields (required for new users)
- Store tokens in localStorage (already handled by authService)
- Handle authentication state properly

---

### 2. Booking Flow (Step3ConfirmBooking.tsx)

**Current**: Using old booking endpoints

```typescript
// ❌ OLD - Old booking flow
bookingService.confirmBooking({...})
```

**Needs**: New production endpoints

```typescript
// ✅ NEW - Production booking flow
// 1. Create appointment
const appointmentResponse = await fetch('/api/booking/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clinicianId: bookingData.clinicianId,
    centreId: bookingData.centreId,
    appointmentDate: bookingData.date,
    appointmentTime: bookingData.time,
    appointmentType: bookingData.appointmentType
  })
});

// 2. Create payment order
const paymentResponse = await fetch('/api/payment/create-order', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    appointmentId: appointmentResponse.data.appointment.id
  })
});

// 3. Open Razorpay with order details
openRazorpayModal(paymentResponse.data.orderId, ...);

// 4. After payment success, verify
await fetch('/api/payment/verify', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    appointmentId: appointmentId,
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature
  })
});
```

**Changes Required**:

- Split booking confirmation into separate steps
- Create appointment first (requires auth token)
- Create payment order second
- Verify payment after Razorpay success
- Handle authentication properly

---

### 3. Service Files

**Current**: Services are ready but not being used correctly

**authService.ts**: ✅ Ready (uses production endpoints)

- `/api/patient-auth/send-otp`
- `/api/patient-auth/verify-otp`

**bookingService.ts**: ❌ Uses old endpoints

- `/api/booking/initiate` (doesn't exist in new backend)
- `/api/booking/confirm` (doesn't exist in new backend)

**patientDashboardService.ts**: ✅ Ready (uses production endpoints)

- `/api/patient/dashboard`
- `/api/patient/appointments`
- `/api/patient/payments`
- `/api/patient/profile`

---

## Detailed Changes Needed

### File 1: `Step2PhoneVerification.tsx`

**Replace this**:

```typescript
// ❌ OLD
const response = await fetch("http://localhost:5000/api/test/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: formattedPhone }),
});
```

**With this**:

```typescript
// ✅ NEW
import authService from "../../services/authService";

const response = await authService.sendOTP(formattedPhone);
```

**Replace this**:

```typescript
// ❌ OLD
const response = await fetch("http://localhost:5000/api/test/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: formattedPhone, otp: otpToVerify }),
});
```

**With this**:

```typescript
// ✅ NEW
// Add name and email inputs to the form first!
const response = await authService.verifyOTP(
  formattedPhone,
  otpToVerify,
  fullName, // Get from input field
  email // Get from input field (optional)
);

// Tokens are automatically stored in localStorage by authService
```

**Add these input fields** (after OTP is sent):

```tsx
{
  /* Full Name Input - Required for new users */
}
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
  />
</div>;

{
  /* Email Input - Optional */
}
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
</div>;
```

---

### File 2: `Step3ConfirmBooking.tsx`

**Replace the entire `handleConfirmPayment` function**:

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
```

**Update the `openRazorpayModal` function**:

```typescript
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

### File 3: `bookingService.ts`

**Update the service to use new endpoints**:

```typescript
// Remove old methods: initiateBooking, confirmBooking, handlePaymentSuccess, handlePaymentFailure

// Add new methods:

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

## Summary of Changes

### Step2PhoneVerification.tsx

1. ✅ Import `authService`
2. ✅ Replace test API calls with `authService.sendOTP()` and `authService.verifyOTP()`
3. ✅ Add `fullName` and `email` input fields
4. ✅ Add state for `fullName` and `email`
5. ✅ Pass `fullName` and `email` to `verifyOTP()`
6. ✅ Remove test mode alerts

### Step3ConfirmBooking.tsx

1. ✅ Update `handleConfirmPayment()` to:
   - Get access token from localStorage
   - Call `/api/booking/create` to create appointment
   - Call `/api/payment/create-order` to create payment order
   - Open Razorpay with order details
2. ✅ Update `openRazorpayModal()` to:
   - Use Razorpay key from backend response
   - Call `/api/payment/verify` after payment success
   - Handle errors properly
3. ✅ Keep name and email inputs (already there)

### bookingService.ts

1. ✅ Remove old methods: `initiateBooking`, `confirmBooking`, `handlePaymentSuccess`, `handlePaymentFailure`
2. ✅ Add new methods: `createAppointment`, `createPaymentOrder`, `verifyPayment`, `getMyAppointments`, `cancelAppointment`

---

## Testing After Updates

### 1. Test Authentication

1. Go to booking page
2. Select doctor, date, time
3. Enter phone number → Click "Send OTP"
4. Check WhatsApp for OTP
5. Enter OTP, name, and email → Click "Verify"
6. Should proceed to Step 3

### 2. Test Booking & Payment

1. Review booking details
2. Click "Confirm & Pay"
3. Razorpay modal should open
4. Use test card: `4111 1111 1111 1111`
5. Payment should succeed
6. Should redirect to dashboard

### 3. Test Dashboard

1. Should see appointment in dashboard
2. Should see payment in payment history
3. Should be able to update profile

---

## Priority

**HIGH PRIORITY** - Frontend needs these updates to work with the new backend!

**Estimated Time**: 2-3 hours

**Order**:

1. Update `Step2PhoneVerification.tsx` first (authentication)
2. Update `Step3ConfirmBooking.tsx` second (booking + payment)
3. Update `bookingService.ts` third (service methods)
4. Test complete flow

---

## Need Help?

See these files for reference:

- `backend/ALL_STEPS_COMPLETE.md` - Complete backend overview
- `backend/API_DOCUMENTATION.md` - All API endpoints
- `backend/STEP_4_COMPLETE.md` - Dashboard endpoints
- `mibo_version-2/INTEGRATION_GUIDE.md` - Frontend integration guide
