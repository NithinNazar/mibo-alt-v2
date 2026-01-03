# Frontend Integration Test Guide

## ✅ Changes Completed

### 1. Step2PhoneVerification.tsx

- ✅ Replaced test endpoints with `authService`
- ✅ Added fullName and email state
- ✅ Added name input field (required)
- ✅ Added email input field (optional)
- ✅ Updated handleSendOtp to use production endpoint
- ✅ Updated handleVerifyOtp to pass name and email
- ✅ Removed test mode alerts

### 2. Step3ConfirmBooking.tsx

- ✅ Replaced old booking flow with new 3-step flow
- ✅ Step 1: Create appointment with auth token
- ✅ Step 2: Create payment order
- ✅ Step 3: Verify payment after Razorpay success
- ✅ Updated openRazorpayModal to use backend Razorpay key
- ✅ Added proper error handling

### 3. bookingService.ts

- ✅ Removed all old methods (initiateBooking, confirmBooking, etc.)
- ✅ Added createAppointment() method
- ✅ Added createPaymentOrder() method
- ✅ Added verifyPayment() method
- ✅ Added getMyAppointments() method
- ✅ Added cancelAppointment() method

---

## 🧪 Testing Checklist

### Prerequisites

- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173 (or 5174)
- ✅ Database populated with 23 doctors and 3 centres
- ✅ Test phone: 9048810697 (has WhatsApp)

### Test 1: Authentication Flow

1. **Navigate to Booking Page**

   - Go to http://localhost:5173/experts
   - Select any doctor
   - Click "Book Appointment"

2. **Select Appointment Details**

   - Choose consultation type (Online or In-Person)
   - Select date and time
   - Click "Continue"

3. **Phone Verification**

   - Enter phone: `9048810697`
   - Click "Send OTP"
   - ✅ Should receive OTP on WhatsApp
   - ✅ Should see name and email fields

4. **Enter Details**
   - Enter OTP from WhatsApp
   - Enter full name: "Test User"
   - Enter email (optional): "test@example.com"
   - Click "Verify & Continue"
   - ✅ Should verify successfully
   - ✅ Should proceed to Step 3

### Test 2: Booking & Payment Flow

1. **Review Booking**

   - ✅ Should see appointment summary
   - ✅ Should see name and email fields pre-filled
   - ✅ Should see payment amount

2. **Confirm Payment**

   - Click "Confirm & Pay"
   - ✅ Should create appointment in database
   - ✅ Should create payment order
   - ✅ Razorpay modal should open

3. **Complete Payment**
   - Use test card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Click "Pay"
   - ✅ Payment should succeed
   - ✅ Should verify payment on backend
   - ✅ Should show success message
   - ✅ Should redirect to dashboard

### Test 3: Online Consultation (Google Meet)

1. **Book Online Consultation**

   - Select "Online" consultation type
   - Complete booking flow
   - ✅ Should create appointment successfully
   - ✅ Should NOT break if Google Meet is not configured
   - ✅ Dashboard should show "Online" mode

2. **Check Dashboard**
   - Go to patient dashboard
   - ✅ Should see appointment with "Online" type
   - ✅ If Google Meet configured: Should see meeting link
   - ✅ If Google Meet NOT configured: Should still show appointment

### Test 4: In-Person Consultation

1. **Book In-Person Consultation**
   - Select "In-Person" consultation type
   - Complete booking flow
   - ✅ Should create appointment successfully
   - ✅ Dashboard should show "In-Person" mode
   - ✅ Should show centre address

### Test 5: Dashboard Integration

1. **View Appointments**

   - Go to http://localhost:5173/profileDashboard
   - ✅ Should see newly created appointment
   - ✅ Should show correct doctor name
   - ✅ Should show correct date and time
   - ✅ Should show consultation type

2. **View Payment History**

   - Check payments section
   - ✅ Should see payment record
   - ✅ Should show correct amount
   - ✅ Should show "SUCCESS" status

3. **View Profile**
   - Check profile section
   - ✅ Should show name and email
   - ✅ Should be able to update profile

---

## 🔍 What to Check in Browser Console

### During OTP Send

```
OTP sent successfully via WhatsApp
```

### During OTP Verification

```
✅ Tokens stored in localStorage:
- mibo_access_token
- mibo_refresh_token
- mibo_user
```

### During Appointment Creation

```
POST http://localhost:5000/api/booking/create
Status: 200
Response: { success: true, data: { appointment: {...} } }
```

### During Payment Order Creation

```
POST http://localhost:5000/api/payment/create-order
Status: 200
Response: { success: true, data: { orderId: "...", amount: ..., razorpayKeyId: "..." } }
```

### During Payment Verification

```
POST http://localhost:5000/api/payment/verify
Status: 200
Response: { success: true, data: { payment: {...} } }
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Please login first"

**Cause**: Access token not found in localStorage
**Solution**: Complete OTP verification first

### Issue 2: "Failed to create appointment"

**Cause**: Invalid clinician or centre ID
**Solution**: Check that doctor and centre IDs are correct

### Issue 3: "Payment gateway not loaded"

**Cause**: Razorpay script not loaded
**Solution**: Refresh page and try again

### Issue 4: "Payment verification failed"

**Cause**: Invalid signature or network error
**Solution**: Check backend logs for details

### Issue 5: Google Meet link not showing

**Status**: ✅ Expected behavior if Google service account not configured
**Solution**: Appointment will still work, just won't have meeting link

---

## 📊 Backend Logs to Monitor

### Successful Flow

```
[info]: 🔐 OTP sent to 919048810697 via WhatsApp
[info]: ✅ OTP verified for 919048810697
[info]: 📅 Appointment created: ID 123
[info]: 💳 Payment order created: order_xyz
[info]: ✅ Payment verified: payment_abc
```

### Google Meet (if configured)

```
[info]: 📹 Google Meet link created for appointment 123
[info]: 🔗 Meeting link: https://meet.google.com/xxx-yyyy-zzz
```

### Google Meet (if NOT configured)

```
[warn]: ⚠️ Google Meet not configured - appointment created without meeting link
```

---

## ✅ Success Criteria

### Authentication

- [x] OTP sent via WhatsApp
- [x] OTP verified successfully
- [x] Tokens stored in localStorage
- [x] User data stored in localStorage

### Booking

- [x] Appointment created in database
- [x] Payment order created
- [x] Razorpay modal opens
- [x] Payment verified successfully

### Dashboard

- [x] Appointment visible in dashboard
- [x] Payment visible in payment history
- [x] Profile shows correct data

### Online Consultation

- [x] Appointment created successfully
- [x] No errors if Google Meet not configured
- [x] Dashboard shows "Online" mode

---

## 🎯 Next Steps After Testing

1. **If all tests pass**:

   - ✅ Frontend is fully integrated with backend
   - ✅ Ready for production deployment
   - ✅ Can add Google Meet credentials later

2. **If tests fail**:

   - Check browser console for errors
   - Check backend logs
   - Verify backend is running
   - Verify database has doctors and centres

3. **Optional Enhancements**:
   - Add Google Meet service account for video links
   - Add email notifications
   - Add SMS notifications
   - Add appointment reminders

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Authentication Flow:
[ ] OTP sent successfully
[ ] OTP verified successfully
[ ] Tokens stored correctly

Booking Flow:
[ ] Appointment created
[ ] Payment order created
[ ] Razorpay modal opened
[ ] Payment completed
[ ] Payment verified

Dashboard:
[ ] Appointment visible
[ ] Payment visible
[ ] Profile correct

Online Consultation:
[ ] Created successfully
[ ] No errors without Google Meet
[ ] Shows correct mode

Issues Found:
_______________________________
_______________________________

Overall Status: [ ] PASS [ ] FAIL
```

---

**Last Updated**: January 3, 2026
**Status**: Ready for Testing
