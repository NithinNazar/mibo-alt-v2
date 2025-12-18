# Razorpay Frontend Integration Guide

Complete guide for frontend developers to integrate Razorpay payment functionality in the patient website.

---

## 🎯 Overview

The backend handles all Razorpay operations. Your frontend needs to:

1. Trigger payment link generation
2. Display payment status
3. Handle payment success/failure callbacks

**Backend handles:**

- ✅ Payment link creation
- ✅ Amount calculation (from doctor's consultation fee)
- ✅ WhatsApp delivery to patient
- ✅ Payment verification
- ✅ Appointment confirmation after payment

---

## 📋 Prerequisites

### What You Need

- Patient is logged in (has JWT token)
- Appointment is already created
- Patient phone number is available

### What Backend Provides

- Payment link generation API
- Payment status checking API
- Automatic WhatsApp delivery
- Automatic appointment confirmation

---

## 🚀 Integration Steps

### Step 1: Trigger Payment Link Generation

**When to trigger:**

- After patient books an appointment
- When front desk creates appointment for patient
- When patient wants to pay for existing appointment

**API Endpoint:**

```
POST /api/payments/send-payment-link
```

**Request:**

```javascript
const sendPaymentLink = async (appointmentId, patientPhone, patientName) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/payments/send-payment-link",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourJWTToken}`,
        },
        body: JSON.stringify({
          appointmentId: appointmentId, // Required: Appointment ID
          patientPhone: patientPhone, // Required: +919876543210
          patientName: patientName, // Required: Patient name
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Payment link sent!");
      console.log("Link:", data.data.paymentLink);
      console.log("Amount:", data.data.amount);

      // Show success message to user
      alert("Payment link sent to your WhatsApp!");

      return data.data;
    } else {
      console.error("Failed:", data.message);
      alert("Failed to send payment link");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
};
```

**Response:**

```json
{
  "success": true,
  "message": "Payment link sent successfully",
  "data": {
    "paymentLinkId": "plink_abc123xyz",
    "paymentLink": "https://rzp.io/i/abc123",
    "amount": 1500,
    "currency": "INR",
    "status": "created",
    "expiresAt": "2024-12-21T10:00:00Z",
    "whatsappSent": true
  }
}
```

---

### Step 2: Display Payment Information

**Show to user:**

```javascript
// After sending payment link
const displayPaymentInfo = (paymentData) => {
  return (
    <div className="payment-info">
      <h3>Payment Link Sent! 📱</h3>
      <p>We've sent a payment link to your WhatsApp</p>

      <div className="payment-details">
        <p>
          <strong>Amount:</strong> ₹{paymentData.amount}
        </p>
        <p>
          <strong>Valid until:</strong> {formatDate(paymentData.expiresAt)}
        </p>
      </div>

      <div className="payment-methods">
        <p>You can pay using:</p>
        <ul>
          <li>UPI (Google Pay, PhonePe, Paytm)</li>
          <li>Credit/Debit Cards</li>
          <li>Net Banking</li>
        </ul>
      </div>

      <button onClick={() => window.open(paymentData.paymentLink, "_blank")}>
        Open Payment Link
      </button>

      <button onClick={() => checkPaymentStatus(paymentData.paymentLinkId)}>
        Check Payment Status
      </button>
    </div>
  );
};
```

---

### Step 3: Check Payment Status

**When to check:**

- When user clicks "Check Status" button
- Periodically while waiting for payment
- After user returns from payment page

**API Endpoint:**

```
GET /api/payments/link-status/:linkId
```

**Request:**

```javascript
const checkPaymentStatus = async (paymentLinkId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/payments/link-status/${paymentLinkId}`,
      {
        headers: {
          Authorization: `Bearer ${yourJWTToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      const status = data.data.status;

      switch (status) {
        case "paid":
          // Payment successful!
          showSuccessMessage();
          redirectToAppointmentConfirmation();
          break;

        case "created":
          // Payment pending
          showPendingMessage();
          break;

        case "expired":
          // Link expired
          showExpiredMessage();
          offerToResendLink();
          break;

        case "cancelled":
          // Payment cancelled
          showCancelledMessage();
          break;
      }

      return data.data;
    }
  } catch (error) {
    console.error("Error checking status:", error);
  }
};
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "plink_abc123xyz",
    "status": "paid",
    "amount": 1500,
    "currency": "INR",
    "paymentId": "pay_xyz789",
    "paidAt": "2024-12-20T10:30:00Z"
  }
}
```

**Status Values:**

- `created` - Link created, payment pending
- `paid` - Payment successful ✅
- `expired` - Link expired (24 hours)
- `cancelled` - Payment cancelled

---

### Step 4: Handle Payment Callback

**Setup callback URL:**
The backend is configured to redirect to:

```
http://your-website.com/payment-success
```

**Handle the callback:**

```javascript
// On your payment success page
const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const paymentLinkId = searchParams.get("razorpay_payment_link_id");
  const paymentId = searchParams.get("razorpay_payment_id");

  useEffect(() => {
    if (paymentLinkId) {
      // Verify payment status with backend
      verifyPayment(paymentLinkId);
    }
  }, [paymentLinkId]);

  const verifyPayment = async (linkId) => {
    const status = await checkPaymentStatus(linkId);

    if (status.status === "paid") {
      // Show success message
      // Redirect to appointment details
      setTimeout(() => {
        navigate("/appointments");
      }, 3000);
    }
  };

  return (
    <div className="payment-success">
      <h1>✅ Payment Successful!</h1>
      <p>Your appointment has been confirmed</p>
      <p>Payment ID: {paymentId}</p>
    </div>
  );
};
```

---

## 💡 Complete React Example

```javascript
import React, { useState, useEffect } from "react";

const AppointmentPayment = ({
  appointment,
  patientPhone,
  patientName,
  token,
}) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");

  // Send payment link
  const handleSendPaymentLink = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/payments/send-payment-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentId: appointment.id,
            patientPhone: patientPhone,
            patientName: patientName,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPaymentData(data.data);
        setStatus("link_sent");

        // Start polling for payment status
        startStatusPolling(data.data.paymentLinkId);
      } else {
        alert("Failed to send payment link: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  const checkStatus = async (linkId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/payments/link-status/${linkId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus(data.data.status);
        return data.data.status;
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  // Poll for payment status
  const startStatusPolling = (linkId) => {
    const interval = setInterval(async () => {
      const currentStatus = await checkStatus(linkId);

      if (currentStatus === "paid") {
        clearInterval(interval);
        // Payment successful!
      } else if (currentStatus === "expired" || currentStatus === "cancelled") {
        clearInterval(interval);
      }
    }, 5000); // Check every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(interval), 600000);
  };

  return (
    <div className="appointment-payment">
      {status === "pending" && (
        <div>
          <h3>Complete Payment</h3>
          <p>Consultation Fee: ₹{appointment.consultationFee}</p>
          <button onClick={handleSendPaymentLink} disabled={loading}>
            {loading ? "Sending..." : "Send Payment Link to WhatsApp"}
          </button>
        </div>
      )}

      {status === "link_sent" && paymentData && (
        <div>
          <h3>Payment Link Sent! 📱</h3>
          <p>Check your WhatsApp for the payment link</p>

          <div className="payment-details">
            <p>
              <strong>Amount:</strong> ₹{paymentData.amount}
            </p>
            <p>
              <strong>Valid until:</strong>{" "}
              {new Date(paymentData.expiresAt).toLocaleString()}
            </p>
          </div>

          <div className="payment-methods">
            <p>Payment methods available:</p>
            <ul>
              <li>UPI (Google Pay, PhonePe, Paytm)</li>
              <li>Credit/Debit Cards</li>
              <li>Net Banking</li>
            </ul>
          </div>

          <button
            onClick={() => window.open(paymentData.paymentLink, "_blank")}
          >
            Open Payment Link
          </button>

          <button onClick={() => checkStatus(paymentData.paymentLinkId)}>
            Refresh Status
          </button>
        </div>
      )}

      {status === "paid" && (
        <div className="payment-success">
          <h3>✅ Payment Successful!</h3>
          <p>Your appointment has been confirmed</p>
        </div>
      )}

      {status === "expired" && (
        <div className="payment-expired">
          <h3>⏰ Payment Link Expired</h3>
          <p>The payment link has expired. Please request a new one.</p>
          <button onClick={handleSendPaymentLink}>Send New Payment Link</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentPayment;
```

---

## 🔄 Complete User Flow

### Flow 1: Patient Books Appointment

```
1. Patient fills appointment form
   ↓
2. Frontend calls: POST /api/appointments
   ↓
3. Appointment created (status: BOOKED)
   ↓
4. Frontend calls: POST /api/payments/send-payment-link
   ↓
5. Backend creates Razorpay payment link
   ↓
6. Backend sends WhatsApp to patient
   ↓
7. Frontend shows "Payment link sent to WhatsApp"
   ↓
8. Patient clicks WhatsApp link
   ↓
9. Patient completes payment on Razorpay
   ↓
10. Razorpay redirects to: /payment-success
    ↓
11. Frontend verifies: GET /api/payments/link-status/:linkId
    ↓
12. Backend webhook confirms payment
    ↓
13. Appointment status → CONFIRMED
    ↓
14. Frontend shows success message
```

---

## 📱 WhatsApp Message Format

**What patient receives:**

```
Hello John Doe,

Your appointment has been booked! 🎉

📅 Date: December 20, 2024
⏰ Time: 2:00 PM
👨‍⚕️ Doctor: Dr. Smith

💰 Consultation Fee: ₹1500

Please complete your payment to confirm the appointment:
🔗 https://rzp.io/i/abc123

Payment Methods: UPI, Google Pay, PhonePe, Cards

This link is valid for 24 hours.

- Mibo Mental Hospital
```

---

## ⚠️ Error Handling

### Common Errors

**1. Appointment not found**

```json
{
  "success": false,
  "message": "Appointment not found"
}
```

**Solution:** Verify appointment ID is correct

**2. Payment link already exists**

```json
{
  "success": false,
  "message": "Payment link already sent for this appointment"
}
```

**Solution:** Check existing payment status first

**3. Invalid phone number**

```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

**Solution:** Ensure phone is in format: +919876543210

**4. Razorpay not configured**

```json
{
  "success": false,
  "message": "Razorpay is not configured"
}
```

**Solution:** Contact backend team to configure Razorpay

---

## 🧪 Testing

### Test Payment Link

```javascript
// Test data
const testData = {
  appointmentId: 1,
  patientPhone: "+919876543210",
  patientName: "Test Patient",
};

// Send payment link
sendPaymentLink(
  testData.appointmentId,
  testData.patientPhone,
  testData.patientName
);
```

### Test Payment Status

```javascript
// Check status
checkPaymentStatus("plink_test123");
```

### Razorpay Test Cards

Use these test cards in Razorpay test mode:

**Success:**

- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**

- Card: 4000 0000 0000 0002

---

## 📊 Payment Status Flow

```
created → paid ✅
   ↓
expired ❌
   ↓
cancelled ❌
```

**Status Meanings:**

- `created` - Link generated, waiting for payment
- `paid` - Payment successful, appointment confirmed
- `expired` - Link expired after 24 hours
- `cancelled` - Payment cancelled by user

---

## 🎨 UI/UX Recommendations

### 1. Show Clear Payment Status

```javascript
const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    created: { color: "orange", text: "Payment Pending", icon: "⏳" },
    paid: { color: "green", text: "Payment Successful", icon: "✅" },
    expired: { color: "red", text: "Link Expired", icon: "⏰" },
    cancelled: { color: "gray", text: "Payment Cancelled", icon: "❌" },
  };

  const config = statusConfig[status];

  return (
    <span style={{ color: config.color }}>
      {config.icon} {config.text}
    </span>
  );
};
```

### 2. Auto-refresh Status

```javascript
// Poll every 5 seconds while payment is pending
useEffect(() => {
  if (status === "created") {
    const interval = setInterval(() => {
      checkPaymentStatus(paymentLinkId);
    }, 5000);

    return () => clearInterval(interval);
  }
}, [status]);
```

### 3. Show Payment Methods

```javascript
<div className="payment-methods">
  <img src="/icons/upi.png" alt="UPI" />
  <img src="/icons/googlepay.png" alt="Google Pay" />
  <img src="/icons/phonepe.png" alt="PhonePe" />
  <img src="/icons/cards.png" alt="Cards" />
</div>
```

---

## 🔒 Security Notes

1. **Never expose Razorpay keys in frontend**

   - All Razorpay operations happen on backend
   - Frontend only triggers API calls

2. **Always verify payment on backend**

   - Don't trust frontend payment status
   - Backend webhook confirms payment

3. **Use HTTPS in production**
   - Payment links should use HTTPS
   - Callback URLs should use HTTPS

---

## 📞 Support

### Common Issues

**Payment link not received on WhatsApp:**

- Check phone number format (+91...)
- Verify Gallabox is configured on backend
- Check WhatsApp notifications table in database

**Payment successful but appointment not confirmed:**

- Backend webhook might be delayed
- Check payment status API
- Contact backend team

**Payment link expired:**

- Links expire after 24 hours
- Generate new payment link
- Patient can request new link

---

## ✅ Checklist for Frontend Developer

- [ ] Implement payment link generation button
- [ ] Show payment link sent confirmation
- [ ] Display payment amount and details
- [ ] Add "Open Payment Link" button
- [ ] Implement payment status checking
- [ ] Add auto-refresh for payment status
- [ ] Handle payment success callback
- [ ] Handle payment failure/expiry
- [ ] Show appropriate error messages
- [ ] Test with Razorpay test mode
- [ ] Add loading states
- [ ] Add payment status badges
- [ ] Implement retry mechanism for expired links

---

**Ready to integrate! 🚀**

For questions, refer to:

- `API_REFERENCE.md` - Complete API documentation
- `api-requests.http` - API testing examples
- Backend team for Razorpay configuration
