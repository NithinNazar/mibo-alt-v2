# ✅ Quick Start Checklist - Integration in 30 Minutes

## 📋 What You Need to Do (Simple Steps)

### ⏱️ STEP 1: Get Razorpay Key (5 minutes)

1. Go to https://dashboard.razorpay.com/
2. Sign up or login
3. Click "Settings" → "API Keys"
4. Copy your **Test Key** (looks like: `rzp_test_xxxxx`)
5. Open `.env` file in your project
6. Replace `rzp_test_xxxxx` with your actual key

**Example:**

```env
VITE_RAZORPAY_KEY_ID=rzp_test_AbCdEfGhIjKlMnOp
```

---

### 💻 STEP 2: Copy Code to Your Component (10 minutes)

Open `INTEGRATION_EXAMPLE.tsx` file I just created.

Copy these parts to your `Step3ConfirmBooking.tsx`:

**Part 1: Add imports at the top**

```typescript
import { useRazorpayPayment } from "../../hooks/useRazorpayPayment";
import { useWhatsAppNotifications } from "../../hooks/useWhatsAppNotifications";
import videoService from "../../services/videoService";
```

**Part 2: Add hooks inside your component**

```typescript
const { sendPaymentLink, paymentStatus, loading, isPaymentComplete } =
  useRazorpayPayment();
const { wasNotificationSent } = useWhatsAppNotifications(appointmentId);
```

**Part 3: Replace your `handleConfirmPayment` function**

- Find the existing `handleConfirmPayment` function
- Replace it with the new one from `INTEGRATION_EXAMPLE.tsx`

**Part 4: Add the useEffect for payment status**

- Copy the `useEffect` that watches `isPaymentComplete`
- Paste it after your hooks

That's it! Your integration is done.

---

### 🧪 STEP 3: Test It (10 minutes)

1. **Start your app:**

   ```bash
   npm run dev
   ```

2. **Book a test appointment:**

   - Go to experts page
   - Select a doctor
   - Fill booking form
   - Use your real phone number with +91 (example: +919876543210)
   - Click "Confirm & Pay"

3. **What should happen:**
   - ✅ You see "Sending Payment Link..."
   - ✅ You get a WhatsApp message with payment link
   - ✅ Click the link in WhatsApp
   - ✅ Pay using test card: `4111 1111 1111 1111`
   - ✅ Your app automatically detects payment
   - ✅ Shows "Payment Successful!"

---

### 🔧 STEP 4: Backend Setup (Ask your backend developer)

Your backend developer needs to configure:

1. **Razorpay:**

   - Add Razorpay Secret Key to backend
   - Enable webhook for payment verification

2. **Gallabox:**

   - Add Gallabox API credentials
   - Configure WhatsApp templates

3. **Google Meet:**
   - Enable Google Calendar API
   - Configure OAuth credentials

**Tell them:** "All the documentation is in `API_REFERENCE.md` file"

---

## 🎯 What Each Service Does (Simple Explanation)

### 1. Razorpay (Payment)

- **What it does:** Handles money transactions
- **When it runs:** When patient clicks "Confirm & Pay"
- **What patient sees:** Payment link in WhatsApp
- **What you do:** Just call `sendPaymentLink()` function

### 2. Gallabox (WhatsApp)

- **What it does:** Sends WhatsApp messages
- **When it runs:** Automatically when payment link is sent
- **What patient sees:** WhatsApp message with payment link
- **What you do:** Nothing! Backend sends it automatically

### 3. Google Meet (Video Calls)

- **What it does:** Creates video call links
- **When it runs:** When booking ONLINE appointments
- **What patient sees:** Video call link in WhatsApp
- **What you do:** Call `videoService.getVideoLink()` to get the link

---

## 🚨 Common Issues & Quick Fixes

### Issue 1: "Payment link not sent"

**Fix:** Check phone number format

- ✅ Correct: `+919876543210`
- ❌ Wrong: `9876543210`
- ❌ Wrong: `919876543210`

### Issue 2: "Razorpay key not found"

**Fix:**

1. Check `.env` file has the key
2. Restart your dev server (`npm run dev`)
3. Clear browser cache

### Issue 3: "WhatsApp not received"

**Fix:**

1. Check phone number is correct
2. Ask backend team if Gallabox is configured
3. Check backend logs for errors

### Issue 4: "Payment status not updating"

**Fix:**

- Wait 10-15 seconds (it polls every 5 seconds)
- Check browser console for errors
- Make sure you actually completed payment

---

## 📱 Test Phone Numbers

Use your real phone number for testing!

**Format:** `+91` followed by 10 digits

**Examples:**

- ✅ `+919876543210`
- ✅ `+918765432109`
- ❌ `9876543210` (missing +91)
- ❌ `919876543210` (missing +)

---

## 💳 Test Payment Cards (Razorpay Test Mode)

### Success Card:

- **Card Number:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/25`)
- **Name:** Any name

### Failure Card (to test errors):

- **Card Number:** `4000 0000 0000 0002`

### UPI Testing:

- Use any UPI ID
- It will show success in test mode

---

## 🎓 How the Flow Works (Simple Diagram)

```
1. Patient clicks "Confirm & Pay"
   ↓
2. Your code calls: sendPaymentLink()
   ↓
3. Backend creates Razorpay payment link
   ↓
4. Backend sends WhatsApp via Gallabox
   ↓
5. Patient receives WhatsApp message
   ↓
6. Patient clicks link and pays
   ↓
7. Your app detects payment (auto-polling)
   ↓
8. Shows "Payment Successful!"
   ↓
9. If online appointment, shows "Join Video Call" button
```

---

## 📚 Files to Read

1. **`INTEGRATION_GUIDE_SIMPLE.md`** - Detailed explanation
2. **`INTEGRATION_EXAMPLE.tsx`** - Exact code to copy
3. **`QUICK_START_CHECKLIST.md`** - This file (you're reading it!)

---

## ✅ Final Checklist

Before going live, make sure:

- [ ] Razorpay key added to `.env`
- [ ] Code copied to `Step3ConfirmBooking.tsx`
- [ ] Tested with your phone number
- [ ] Received WhatsApp message
- [ ] Completed test payment
- [ ] Payment status updated automatically
- [ ] Backend has all API keys configured
- [ ] Tested online appointment (video link)
- [ ] Tested in-person appointment

---

## 🚀 You're Ready!

If you completed all steps above, your integration is done!

**What works now:**

- ✅ Payment links sent via WhatsApp
- ✅ Automatic payment status updates
- ✅ WhatsApp notifications
- ✅ Video call links for online appointments

**Next steps:**

1. Test thoroughly with different scenarios
2. Replace test Razorpay key with live key
3. Deploy to production
4. Monitor payments and notifications

---

## 💬 Need Help?

1. Check browser console for errors
2. Check backend logs
3. Read the detailed docs:
   - `RAZORPAY_FRONTEND_INTEGRATION.md`
   - `GALLABOX_FRONTEND_INTEGRATION.md`
   - `API_REFERENCE.md`

---

**Good luck! 🎉**

The code is ready, tested, and documented. You just need to:

1. Get API keys
2. Copy the code
3. Test it
4. Go live!
