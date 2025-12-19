# Simple Integration Guide - Razorpay, Gallabox & Google Meet

## 🎯 What These Services Do

1. **Razorpay** - Handles payments for appointments
2. **Gallabox** - Sends WhatsApp messages to patients
3. **Google Meet** - Creates video call links for online appointments

---

## ✅ Good News: Frontend is 100% Ready!

All the code is already written. You just need to:

1. Get API keys
2. Configure backend
3. Use the code in your booking flow

---

## 📝 STEP 1: Get Your API Keys (15 minutes)

### A. Get Razorpay Key

1. Go to https://dashboard.razorpay.com/
2. Sign up or login
3. Go to Settings → API Keys
4. Copy your **Test Key** (starts with `rzp_test_`)
5. Paste it in `.env` file:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
   ```

### B. Backend Needs These Keys (Ask your backend developer)

- Razorpay Secret Key (for backend only)
- Gallabox API credentials
- Google Meet API credentials

---

## 🔧 STEP 2: How to Use in Your Booking Flow

### Scenario: Patient Books an Appointment

Here's what happens automatically:

```
Patient fills form → Creates appointment → 3 things happen automatically:

1. 💰 Payment Link sent to WhatsApp (Razorpay + Gallabox)
2. 📱 WhatsApp confirmation sent (Gallabox)
3. 🎥 If online appointment, Google Meet link created and sent via WhatsApp
```

---

## 💻 STEP 3: Add to Your Booking Component

Let me show you exactly where to add the code:

### In `Step3ConfirmBooking.tsx` (After appointment is created)

```typescript
import { useRazorpayPayment } from '../../hooks/useRazorpayPayment';
import { useWhatsAppNotifications } from '../../hooks/useWhatsAppNotifications';

function Step3ConfirmBooking() {
  const { sendPaymentLink, paymentStatus, loading } = useRazorpayPayment();
  const { wasNotificationSent } = useWhatsAppNotifications();

  // After appointment is created successfully
  const handleAppointmentCreated = async (appointmentId, patientPhone, patientName) => {
    try {
      // 1. Send payment link (automatically sends WhatsApp too!)
      await sendPaymentLink(appointmentId, patientPhone, patientName);

      // 2. Show success message
      alert("Payment link sent to your WhatsApp! 📱");

      // 3. Payment status updates automatically
      // When paid, paymentStatus.status will be "paid"

    } catch (error) {
      alert("Failed to send payment link");
    }
  };

  // Check payment status
  if (paymentStatus?.status === "paid") {
    // Payment successful! Show success page
    return <div>✅ Payment Successful! Appointment Confirmed!</div>;
  }

  if (paymentStatus?.status === "created") {
    // Waiting for payment
    return <div>⏳ Waiting for payment... Check your WhatsApp</div>;
  }

  return (
    // Your existing booking form
  );
}
```

---

## 🎥 STEP 4: Add Video Call Button (For Online Appointments)

### In your appointment details page:

```typescript
import videoService from "../../services/videoService";

function AppointmentCard({ appointment }) {
  const handleJoinCall = async () => {
    try {
      // Get the Google Meet link
      const videoLink = await videoService.getVideoLink(appointment.id);

      // Open in new tab
      videoService.openVideoLink(videoLink.meet_link);
    } catch (error) {
      alert("Unable to join video call");
    }
  };

  // Only show button for online appointments
  if (appointment.appointment_type === "ONLINE") {
    return <button onClick={handleJoinCall}>🎥 Join Video Call</button>;
  }

  return null;
}
```

---

## 🔄 STEP 5: Complete Flow Example

Here's the complete user journey:

### 1. Patient Books Appointment

```typescript
// In your booking component
const bookAppointment = async () => {
  // Create appointment via API
  const appointment = await appointmentService.createAppointment({
    clinician_id: doctorId,
    appointment_type: "ONLINE", // or "IN_PERSON"
    scheduled_start_at: dateTime,
  });

  // Backend automatically:
  // ✅ Creates Google Meet link (if online)
  // ✅ Sends WhatsApp with Meet link
  // ✅ Sends WhatsApp to doctor

  // Now send payment link
  await sendPaymentLink(appointment.id, patientPhone, patientName);

  // Backend automatically:
  // ✅ Creates Razorpay payment link
  // ✅ Sends WhatsApp with payment link
};
```

### 2. Patient Receives WhatsApp

```
📱 WhatsApp Message:
"Hello John,

Your appointment is booked! 🎉

📅 Date: Dec 20, 2024
⏰ Time: 2:00 PM
👨‍⚕️ Doctor: Dr. Smith

🎥 Join video call:
https://meet.google.com/abc-defg-hij

💰 Pay now:
https://rzp.io/i/xyz123

- Mibo Mental Health"
```

### 3. Patient Pays

- Clicks payment link in WhatsApp
- Pays using UPI/Card
- Your app automatically detects payment (polling every 5 seconds)
- Shows success message

### 4. Patient Joins Video Call

- At appointment time, clicks "Join Video Call" button
- Opens Google Meet in new tab
- Starts consultation

---

## 🧪 STEP 6: Testing (Before Going Live)

### Test Payment Flow:

```typescript
// Use test phone number
const testPhone = "+919876543210"; // Your phone number
const testAppointmentId = 1;

// Send payment link
await sendPaymentLink(testAppointmentId, testPhone, "Test Patient");

// Check your WhatsApp for the link
// Use Razorpay test card: 4111 1111 1111 1111
```

### Test Video Call:

```typescript
// Create online appointment
const appointment = await appointmentService.createAppointment({
  appointment_type: "ONLINE",
  // ... other details
});

// Get video link
const videoLink = await videoService.getVideoLink(appointment.id);
console.log("Meet Link:", videoLink.meet_link);
```

---

## 📋 Quick Checklist

### Before Testing:

- [ ] Added Razorpay key to `.env`
- [ ] Backend has Razorpay secret key
- [ ] Backend has Gallabox credentials
- [ ] Backend has Google Meet API enabled

### During Testing:

- [ ] Create test appointment
- [ ] Check WhatsApp received
- [ ] Click payment link
- [ ] Pay with test card
- [ ] Check payment status updates
- [ ] For online appointments, check Meet link received
- [ ] Click Meet link and join call

### Before Production:

- [ ] Replace test Razorpay key with live key
- [ ] Test with real phone numbers
- [ ] Test all payment methods (UPI, Cards)
- [ ] Test video calls work properly

---

## 🆘 Common Issues & Solutions

### Issue 1: "Payment link not received on WhatsApp"

**Solution:**

- Check phone number format: Must be `+919876543210`
- Ask backend team to check Gallabox configuration
- Check backend logs for errors

### Issue 2: "Payment status not updating"

**Solution:**

- The hook polls every 5 seconds automatically
- Wait up to 30 seconds
- Check browser console for errors

### Issue 3: "Video link not available"

**Solution:**

- Only works for `appointment_type: "ONLINE"`
- Backend must generate Meet link
- Check appointment status is CONFIRMED

### Issue 4: "Razorpay checkout not opening"

**Solution:**

- Check Razorpay key in `.env`
- Make sure Razorpay script is loaded
- Check browser console for errors

---

## 💡 Pro Tips

1. **Always use international phone format:** `+91` followed by 10 digits
2. **Test with Razorpay test mode first** before going live
3. **Payment status updates automatically** - no need to refresh
4. **WhatsApp is sent by backend** - frontend just triggers it
5. **Video links work 15 minutes before** appointment time

---

## 🎓 What You DON'T Need to Do

❌ Don't write any Razorpay integration code - it's done
❌ Don't write any WhatsApp sending code - backend does it
❌ Don't write any Google Meet code - it's done
❌ Don't create payment verification logic - it's done
❌ Don't handle webhooks - backend does it

## ✅ What You DO Need to Do

✅ Get API keys
✅ Add keys to `.env` and backend
✅ Import the hooks in your components
✅ Call the functions when booking appointments
✅ Show success/error messages to users
✅ Test everything

---

## 📞 Need Help?

1. Check the detailed docs:

   - `RAZORPAY_FRONTEND_INTEGRATION.md`
   - `GALLABOX_FRONTEND_INTEGRATION.md`
   - `API_REFERENCE.md`

2. Check the code examples:

   - `src/hooks/useRazorpayPayment.ts`
   - `src/hooks/useWhatsAppNotifications.ts`
   - `src/services/videoService.ts`

3. Test API endpoints:
   - Open `api-requests.http` in VS Code
   - Install REST Client extension
   - Click "Send Request" to test

---

## 🚀 You're Ready!

Everything is built and ready to use. Just:

1. Get your API keys
2. Add them to `.env`
3. Import the hooks
4. Call the functions
5. Test and go live!

Good luck! 🎉
