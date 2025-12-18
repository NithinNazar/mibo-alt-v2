# Gallabox (WhatsApp) Frontend Integration Guide

Complete guide for frontend developers to trigger WhatsApp notifications via Gallabox in the patient website.

---

## 🎯 Overview

The backend handles all Gallabox (WhatsApp) operations. Your frontend triggers notifications by:

1. Creating appointments (auto-sends WhatsApp)
2. Sending payment links (auto-sends WhatsApp)
3. Manual notification triggers (optional)

**Backend automatically sends WhatsApp for:**

- ✅ Online appointment bookings (Meet link to patient, doctor, admins)
- ✅ Payment links (link sent to patient)
- ✅ Appointment confirmations
- ✅ Appointment reminders
- ✅ Appointment cancellations

---

## 📋 Prerequisites

### What You Need

- Patient phone number (with country code: +91...)
- JWT token for authentication
- Appointment details

### What Backend Provides

- Automatic WhatsApp delivery
- Message formatting
- Delivery status logging
- Error handling

---

## 🚀 Integration Scenarios

### Scenario 1: Online Appointment Booking (Automatic WhatsApp)

**When:** Patient books an ONLINE appointment

**What happens automatically:**

1. ✅ Google Meet link generated
2. ✅ WhatsApp sent to patient with Meet link
3. ✅ WhatsApp sent to doctor with appointment details
4. ✅ WhatsApp sent to all admins/managers

**Frontend code:**

```javascript
const bookOnlineAppointment = async (appointmentData, token) => {
  try {
    const response = await fetch("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clinician_id: appointmentData.doctorId,
        centre_id: appointmentData.centreId,
        appointment_type: "ONLINE", // ← This triggers WhatsApp!
        scheduled_start_at: appointmentData.dateTime,
        duration_minutes: 30,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Backend has automatically:
      // 1. Generated Google Meet link
      // 2. Sent WhatsApp to patient
      // 3. Sent WhatsApp to doctor
      // 4. Sent WhatsApp to admins

      console.log("Appointment created:", data.data);
      console.log("WhatsApp notifications sent automatically!");

      // Show success message
      showSuccessMessage(
        "Appointment booked! Check your WhatsApp for the meeting link."
      );

      return data.data;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**What patient receives on WhatsApp:**

```
Hello John Doe,

Your online consultation is scheduled for:
📅 December 20, 2024 at ⏰ 2:00 PM

Join the meeting using this link:
🔗 https://meet.google.com/abc-defg-hij

Please join 5 minutes before the scheduled time.

- Mibo Mental Hospital
```

---

### Scenario 2: Payment Link (Automatic WhatsApp)

**When:** Front desk or patient triggers payment link

**What happens automatically:**

1. ✅ Razorpay payment link created
2. ✅ WhatsApp sent to patient with payment link

**Frontend code:**

```javascript
const sendPaymentLink = async (
  appointmentId,
  patientPhone,
  patientName,
  token
) => {
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
          appointmentId: appointmentId,
          patientPhone: patientPhone, // Must include country code: +91...
          patientName: patientName,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      // Backend has automatically:
      // 1. Created Razorpay payment link
      // 2. Sent WhatsApp to patient

      console.log("Payment link sent via WhatsApp!");
      console.log("Link:", data.data.paymentLink);

      // Show success message
      showSuccessMessage(
        "Payment link sent to your WhatsApp! Please check your messages."
      );

      return data.data;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**What patient receives on WhatsApp:**

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

### Scenario 3: In-Person Appointment (Automatic WhatsApp)

**When:** Patient books an IN_PERSON appointment

**What happens automatically:**

1. ✅ WhatsApp confirmation sent to patient

**Frontend code:**

```javascript
const bookInPersonAppointment = async (appointmentData, token) => {
  try {
    const response = await fetch("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clinician_id: appointmentData.doctorId,
        centre_id: appointmentData.centreId,
        appointment_type: "IN_PERSON", // ← In-person appointment
        scheduled_start_at: appointmentData.dateTime,
        duration_minutes: 30,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Backend has automatically sent WhatsApp confirmation

      console.log("Appointment created:", data.data);

      // Show success message
      showSuccessMessage(
        "Appointment booked! Check your WhatsApp for confirmation."
      );

      return data.data;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**What patient receives on WhatsApp:**

```
Hello John Doe,

Your appointment has been confirmed! 🎉

📅 Date: December 20, 2024
⏰ Time: 2:00 PM
👨‍⚕️ Doctor: Dr. Smith
🏥 Centre: Downtown Mental Health Centre

Please arrive 10 minutes before your scheduled time.

For any changes, please contact us.

- Mibo Mental Hospital
```

---

## 💡 Complete React Examples

### Example 1: Online Appointment Booking Component

```javascript
import React, { useState } from "react";

const OnlineAppointmentBooking = ({ token }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    centreId: "",
    dateTime: "",
    patientPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Book online appointment
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clinician_id: parseInt(formData.doctorId),
          centre_id: parseInt(formData.centreId),
          appointment_type: "ONLINE",
          scheduled_start_at: formData.dateTime,
          duration_minutes: 30,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);

        // Show success message
        alert(
          "✅ Appointment booked successfully!\n\n" +
            "📱 Check your WhatsApp for:\n" +
            "• Google Meet link\n" +
            "• Appointment details\n" +
            "• Doctor information"
        );
      } else {
        alert("Failed to book appointment: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="online-appointment-booking">
      <h2>Book Online Consultation</h2>

      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor</label>
            <select
              value={formData.doctorId}
              onChange={(e) =>
                setFormData({ ...formData, doctorId: e.target.value })
              }
              required
            >
              <option value="">Choose a doctor</option>
              <option value="1">Dr. Smith - Psychiatrist</option>
              <option value="2">Dr. Jones - Psychologist</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Centre</label>
            <select
              value={formData.centreId}
              onChange={(e) =>
                setFormData({ ...formData, centreId: e.target.value })
              }
              required
            >
              <option value="">Choose a centre</option>
              <option value="1">Downtown Centre</option>
              <option value="2">Uptown Centre</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) =>
                setFormData({ ...formData, dateTime: e.target.value })
              }
              required
            />
          </div>

          <div className="info-box">
            <p>
              📱 <strong>WhatsApp Notification:</strong>
            </p>
            <p>You will receive:</p>
            <ul>
              <li>Google Meet link for video consultation</li>
              <li>Appointment confirmation</li>
              <li>Doctor details</li>
            </ul>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Online Consultation"}
          </button>
        </form>
      ) : (
        <div className="success-message">
          <h3>✅ Booking Successful!</h3>
          <p>Check your WhatsApp for the meeting link</p>
          <button onClick={() => (window.location.href = "/appointments")}>
            View My Appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default OnlineAppointmentBooking;
```

---

### Example 2: Payment Link Component

```javascript
import React, { useState } from "react";

const PaymentLinkSender = ({ appointment, token }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendPaymentLink = async () => {
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
            patientPhone: appointment.patientPhone,
            patientName: appointment.patientName,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSent(true);

        alert(
          "✅ Payment link sent!\n\n" +
            "📱 Patient will receive WhatsApp with:\n" +
            "• Payment link\n" +
            "• Amount: ₹" +
            data.data.amount +
            "\n" +
            "• Payment methods (UPI, Cards, etc.)"
        );
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

  return (
    <div className="payment-link-sender">
      {!sent ? (
        <div>
          <h3>Send Payment Link</h3>
          <p>Consultation Fee: ₹{appointment.consultationFee}</p>
          <p>Patient: {appointment.patientName}</p>
          <p>Phone: {appointment.patientPhone}</p>

          <div className="info-box">
            <p>
              📱 <strong>WhatsApp will include:</strong>
            </p>
            <ul>
              <li>Payment link (valid 24 hours)</li>
              <li>Appointment details</li>
              <li>Payment methods (UPI, Cards)</li>
            </ul>
          </div>

          <button onClick={sendPaymentLink} disabled={loading}>
            {loading ? "Sending..." : "Send Payment Link via WhatsApp"}
          </button>
        </div>
      ) : (
        <div className="success-message">
          <h3>✅ Payment Link Sent!</h3>
          <p>Patient will receive WhatsApp shortly</p>
        </div>
      )}
    </div>
  );
};

export default PaymentLinkSender;
```

---

## 🔄 Complete User Flows

### Flow 1: Online Appointment with WhatsApp

```
1. Patient fills online appointment form
   ↓
2. Frontend calls: POST /api/appointments (type: ONLINE)
   ↓
3. Backend creates appointment
   ↓
4. Backend generates Google Meet link
   ↓
5. Backend sends WhatsApp to patient (with Meet link)
   ↓
6. Backend sends WhatsApp to doctor (with appointment details)
   ↓
7. Backend sends WhatsApp to admins (with summary)
   ↓
8. Frontend shows: "Appointment booked! Check WhatsApp"
   ↓
9. Patient receives WhatsApp with Meet link
   ↓
10. Doctor receives WhatsApp notification
    ↓
11. Admins receive WhatsApp notification
```

---

### Flow 2: Payment Link with WhatsApp

```
1. Patient books appointment
   ↓
2. Frontend calls: POST /api/payments/send-payment-link
   ↓
3. Backend creates Razorpay payment link
   ↓
4. Backend sends WhatsApp to patient (with payment link)
   ↓
5. Frontend shows: "Payment link sent to WhatsApp"
   ↓
6. Patient receives WhatsApp
   ↓
7. Patient clicks link in WhatsApp
   ↓
8. Patient completes payment
   ↓
9. Appointment confirmed automatically
```

---

## 📱 WhatsApp Message Templates

### 1. Online Consultation (Automatic)

```
Hello {patient_name},

Your online consultation is scheduled for:
📅 {date} at ⏰ {time}

Join the meeting using this link:
🔗 {meet_link}

Please join 5 minutes before the scheduled time.

- Mibo Mental Hospital
```

### 2. Payment Link (Automatic)

```
Hello {patient_name},

Your appointment has been booked! 🎉

📅 Date: {date}
⏰ Time: {time}
👨‍⚕️ Doctor: {doctor_name}

💰 Consultation Fee: ₹{amount}

Please complete your payment to confirm the appointment:
🔗 {payment_link}

Payment Methods: UPI, Google Pay, PhonePe, Cards

This link is valid for 24 hours.

- Mibo Mental Hospital
```

### 3. Appointment Confirmation (Automatic)

```
Hello {patient_name},

Your appointment has been confirmed! 🎉

📅 Date: {date}
⏰ Time: {time}
👨‍⚕️ Doctor: {doctor_name}
🏥 Centre: {centre_name}

Please arrive 10 minutes before your scheduled time.

For any changes, please contact us.

- Mibo Mental Hospital
```

---

## 🎨 UI/UX Recommendations

### 1. Show WhatsApp Notification Status

```javascript
const WhatsAppNotificationBadge = () => {
  return (
    <div className="whatsapp-badge">
      <img src="/icons/whatsapp.png" alt="WhatsApp" />
      <span>Notification sent to WhatsApp</span>
    </div>
  );
};
```

### 2. Inform User About WhatsApp

```javascript
const WhatsAppInfo = () => {
  return (
    <div className="info-box">
      <h4>📱 WhatsApp Notifications</h4>
      <p>You will receive important updates on WhatsApp:</p>
      <ul>
        <li>✅ Appointment confirmations</li>
        <li>✅ Meeting links (for online consultations)</li>
        <li>✅ Payment links</li>
        <li>✅ Reminders</li>
      </ul>
      <p className="note">
        Make sure your phone number is correct: {userPhone}
      </p>
    </div>
  );
};
```

### 3. Phone Number Validation

```javascript
const validatePhoneNumber = (phone) => {
  // Must start with +91 and have 10 digits
  const phoneRegex = /^\+91[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    return {
      valid: false,
      message: "Please enter a valid Indian mobile number (+91...)",
    };
  }

  return { valid: true };
};

// Usage in form
const handlePhoneChange = (e) => {
  const phone = e.target.value;
  const validation = validatePhoneNumber(phone);

  if (!validation.valid) {
    setPhoneError(validation.message);
  } else {
    setPhoneError("");
  }

  setPhone(phone);
};
```

---

## ⚠️ Important Notes

### 1. Phone Number Format

**Always use international format:**

- ✅ Correct: `+919876543210`
- ❌ Wrong: `9876543210`
- ❌ Wrong: `919876543210`

```javascript
// Format phone number
const formatPhoneNumber = (phone) => {
  // Remove spaces, dashes, parentheses
  phone = phone.replace(/[\s\-\(\)]/g, "");

  // Add +91 if not present
  if (!phone.startsWith("+91")) {
    if (phone.startsWith("91")) {
      phone = "+" + phone;
    } else {
      phone = "+91" + phone;
    }
  }

  return phone;
};
```

### 2. WhatsApp Delivery is Automatic

- You don't need to call any WhatsApp API
- Backend handles everything
- Just create appointment or send payment link
- WhatsApp is sent automatically

### 3. No Manual WhatsApp Sending

- All WhatsApp messages are triggered by backend
- Frontend cannot send custom WhatsApp messages
- Use the provided endpoints only

---

## 🧪 Testing

### Test Online Appointment

```javascript
// Test booking online appointment
const testData = {
  doctorId: 1,
  centreId: 1,
  dateTime: "2024-12-20T14:00:00Z",
  patientPhone: "+919876543210",
};

bookOnlineAppointment(testData, yourToken);

// Expected: WhatsApp sent to patient with Meet link
```

### Test Payment Link

```javascript
// Test sending payment link
const testData = {
  appointmentId: 1,
  patientPhone: "+919876543210",
  patientName: "Test Patient",
};

sendPaymentLink(
  testData.appointmentId,
  testData.patientPhone,
  testData.patientName,
  yourToken
);

// Expected: WhatsApp sent to patient with payment link
```

---

## 🔍 Checking WhatsApp Delivery Status

### Check if WhatsApp was sent

```javascript
const checkWhatsAppStatus = async (appointmentId, token) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/notifications/history?appointmentId=${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      const whatsappNotifications = data.data.filter(
        (n) => n.notification_type === "WHATSAPP"
      );

      console.log("WhatsApp notifications:", whatsappNotifications);

      // Show delivery status
      whatsappNotifications.forEach((notification) => {
        console.log(`
          To: ${notification.recipient_phone}
          Status: ${notification.status}
          Sent at: ${notification.created_at}
        `);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 📊 WhatsApp Notification Types

| Trigger               | Recipient | Message Type        | Auto-sent          |
| --------------------- | --------- | ------------------- | ------------------ |
| Online appointment    | Patient   | Meet link           | ✅ Yes             |
| Online appointment    | Doctor    | Appointment details | ✅ Yes             |
| Online appointment    | Admins    | Summary             | ✅ Yes             |
| Payment link          | Patient   | Payment link        | ✅ Yes             |
| In-person appointment | Patient   | Confirmation        | ✅ Yes             |
| Appointment reminder  | Patient   | Reminder            | ✅ Yes (scheduled) |
| Appointment cancelled | Patient   | Cancellation        | ✅ Yes             |

---

## ⚠️ Error Handling

### Common Errors

**1. Invalid phone number**

```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

**Solution:** Ensure phone is in format: +919876543210

**2. Gallabox not configured**

```json
{
  "success": false,
  "message": "Gallabox not configured"
}
```

**Solution:** Contact backend team - Gallabox API keys missing

**3. WhatsApp delivery failed**

- Backend logs the error
- Appointment still created successfully
- User should be informed to check phone number

---

## 🔒 Security Notes

1. **Phone numbers are sensitive**

   - Validate format before sending
   - Don't expose in logs or UI unnecessarily

2. **WhatsApp is one-way**

   - System sends messages to patients
   - Patients cannot reply via WhatsApp
   - For two-way communication, use phone/email

3. **No custom messages**
   - Frontend cannot send custom WhatsApp messages
   - All messages are pre-formatted by backend
   - This ensures consistency and compliance

---

## ✅ Checklist for Frontend Developer

- [ ] Implement online appointment booking
- [ ] Show "WhatsApp notification sent" message
- [ ] Validate phone number format (+91...)
- [ ] Implement payment link trigger
- [ ] Show WhatsApp delivery confirmation
- [ ] Add phone number validation
- [ ] Test with real phone numbers
- [ ] Handle errors gracefully
- [ ] Show appropriate loading states
- [ ] Add WhatsApp icon/badge in UI
- [ ] Inform users about WhatsApp notifications
- [ ] Test online appointment flow
- [ ] Test payment link flow

---

**Ready to integrate! 🚀**

For questions, refer to:

- `API_REFERENCE.md` - Complete API documentation
- `api-requests.http` - API testing examples
- `RAZORPAY_FRONTEND_INTEGRATION.md` - Payment integration
- Backend team for Gallabox configuration
