# 📊 Visual User Flow Diagrams

## 🔄 Complete User Journey - Profile Auto-Fill

---

## Scenario 1: New User First Time Signup

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEW USER SIGNUP                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Phone Entry
┌──────────────────┐
│  User visits     │
│  mibo.care       │
│                  │
│  Clicks "Sign Up"│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Enter Phone:     │
│ 919876543210     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Send OTP        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Enter OTP       │
│  1 2 3 4 5 6     │
└────────┬─────────┘
         │
         ▼

Step 2: Backend Check
┌──────────────────────────────────────────┐
│  Backend checks database:                │
│  SELECT * FROM users                     │
│  WHERE phone = '919876543210'            │
│                                          │
│  Result: ❌ NOT FOUND (New User)        │
└────────┬─────────────────────────────────┘
         │
         ▼

Step 3: Enhanced Form (One-Time)
┌───────────────────────────────────────────┐
│        COMPLETE YOUR PROFILE              │
│  ┌─────────────────────────────────────┐  │
│  │ First Name:  [John          ]      │  │
│  ├─────────────────────────────────────┤  │
│  │ Last Name:   [Doe           ]      │  │
│  ├─────────────────────────────────────┤  │
│  │ Email:       [john@email.com]      │  │
│  ├─────────────────────────────────────┤  │
│  │ Age:         [25]  ▲▼              │  │
│  ├─────────────────────────────────────┤  │
│  │ Gender:      [▼ Male]              │  │
│  └─────────────────────────────────────┘  │
│                                           │
│       [Verify & Continue Button]          │
└────────┬──────────────────────────────────┘
         │
         ▼

Step 4: Save to Database
┌──────────────────────────────────────────┐
│  Backend saves:                          │
│                                          │
│  users table:                            │
│  ✅ phone = '919876543210'              │
│  ✅ first_name = 'John'                 │
│  ✅ last_name = 'Doe'                   │
│  ✅ full_name = 'John Doe'              │
│  ✅ email = 'john@email.com'            │
│                                          │
│  patient_profiles table:                 │
│  ✅ user_id = 123                       │
│  ✅ age = 25                            │
│  ✅ gender = 'MALE'                     │
└────────┬─────────────────────────────────┘
         │
         ▼

Step 5: Success Response
┌──────────────────────────────────────────┐
│  Response to Frontend:                   │
│  {                                       │
│    "user": {                             │
│      "id": 123,                          │
│      "phone": "919876543210",            │
│      "firstName": "John",                │
│      "lastName": "Doe",                  │
│      "fullName": "John Doe",             │
│      "email": "john@email.com"           │
│    },                                    │
│    "patient": {                          │
│      "id": 456,                          │
│      "age": 25,                          │
│      "gender": "MALE"                    │
│    },                                    │
│    "accessToken": "eyJhbG...",           │
│    "refreshToken": "eyJhbG...",          │
│    "isNewUser": true,                    │
│    "requiresProfileCompletion": false ✅ │
│  }                                       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Frontend stores in localStorage:        │
│  - mibo_access_token                     │
│  - mibo_refresh_token                    │
│  - mibo_user (with all data)             │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  ✅ DASHBOARD    │
│                  │
│  Welcome, John!  │
└──────────────────┘
```

---

## Scenario 2: Same User Login Again (Next Day)

```
┌─────────────────────────────────────────────────────────────────┐
│                   RETURNING USER - AUTO-FETCH                   │
└─────────────────────────────────────────────────────────────────┘

Step 1: Phone Entry (Same as Before)
┌──────────────────┐
│  User visits     │
│  mibo.care       │
│                  │
│  Clicks "Sign Up"│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Enter Phone:     │
│ 919876543210     │
│                  │
│ (SAME NUMBER!)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Enter OTP       │
│  1 2 3 4 5 6     │
└────────┬─────────┘
         │
         ▼

Step 2: Backend Check
┌──────────────────────────────────────────────────────────┐
│  Backend checks database:                                │
│  SELECT * FROM users WHERE phone = '919876543210'        │
│                                                          │
│  Result: ✅ FOUND                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │ id: 123                                            │ │
│  │ phone: '919876543210'                              │ │
│  │ first_name: 'John'      ✅ EXISTS                  │ │
│  │ last_name: 'Doe'        ✅ EXISTS                  │ │
│  │ full_name: 'John Doe'   ✅ EXISTS                  │ │
│  │ email: 'john@email.com' ✅ EXISTS                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  SELECT * FROM patient_profiles WHERE user_id = 123     │
│  ┌────────────────────────────────────────────────────┐ │
│  │ id: 456                                            │ │
│  │ user_id: 123                                       │ │
│  │ age: 25              ✅ EXISTS                     │ │
│  │ gender: 'MALE'       ✅ EXISTS                     │ │
│  └────────────────────────────────────────────────────┘ │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼

Step 3: Profile Completion Check
┌──────────────────────────────────────────────┐
│  Backend Logic (patient-auth.service.ts):    │
│                                              │
│  const isLegacyUser =                        │
│    !user.first_name || !user.last_name;      │
│                                              │
│  Result: isLegacyUser = false ✅             │
│  (Because first_name='John' AND              │
│   last_name='Doe' both exist!)               │
│                                              │
│  const hasIncompleteProfile =                │
│    patient.age === null ||                   │
│    patient.gender === null;                  │
│                                              │
│  Result: hasIncompleteProfile = false ✅     │
│  (Because age=25 AND gender='MALE'           │
│   both exist!)                               │
│                                              │
│  ─────────────────────────────────────────   │
│  Final Decision:                             │
│  requiresProfileCompletion = false ✅        │
└────────┬─────────────────────────────────────┘
         │
         ▼

Step 4: Direct Login (NO FORM!)
┌──────────────────────────────────────────────┐
│  Response to Frontend:                       │
│  {                                           │
│    "user": { /* all saved data */ },         │
│    "patient": { "age": 25, "gender": "MALE" },│
│    "requiresProfileCompletion": false ✅     │
│  }                                           │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│  Frontend checks:                            │
│                                              │
│  if (requiresProfileCompletion) {            │
│    // Show modal                             │
│  } else {                                    │
│    // Direct login ← THIS PATH! ✅           │
│  }                                           │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  ❌ NO FORM SHOWN                    │
│  ✅ DIRECT LOGIN                     │
│                                      │
│  ┌────────────────────────────────┐ │
│  │     PATIENT DASHBOARD          │ │
│  │                                │ │
│  │  Welcome back, John Doe!       │ │
│  │                                │ │
│  │  [Book Appointment]            │ │
│  │  [My Appointments]             │ │
│  │  [My Profile]                  │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## Scenario 3: Appointment Booking with Auto-Fill

```
┌─────────────────────────────────────────────────────────────────┐
│              APPOINTMENT BOOKING - DATA AUTO-FILLS              │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Navigates to Booking
┌──────────────────┐
│  User logged in  │
│  as John Doe     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Clicks "Experts"│
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Clinician Card                  │
│  ┌────────────────────────────┐  │
│  │ Dr. Sarah Smith            │  │
│  │ Clinical Psychologist      │  │
│  │                            │  │
│  │ [Book Now]  ← CLICKS       │  │
│  └────────────────────────────┘  │
└────────┬─────────────────────────┘
         │
         ▼

Step 2: Booking Flow
┌─────────────────────────────────────────┐
│  Step 1: Select Date & Time             │
│  [Selected: June 10, 2026, 10:00 AM]    │
│                                         │
│  [Continue] ← CLICKS                    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Step 2: Appointment Type               │
│  [✓] Individual Therapy                 │
│  [ ] Couple Therapy                     │
│  [ ] Family Therapy                     │
│                                         │
│  [Continue] ← CLICKS                    │
└────────┬────────────────────────────────┘
         │
         ▼

Step 3: Review & Pay (Auto-Fill!)
┌─────────────────────────────────────────────────────┐
│            REVIEW & PAY                             │
│  ┌───────────────────────────────────────────────┐  │
│  │  👤 YOUR DETAILS                              │  │
│  │                                               │  │
│  │  Full Name *                                  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ 👤 John Doe              (auto-filled!) │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  Email (Optional)                             │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ ✉️ john@email.com        (auto-filled!) │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  Age                        Gender            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  │  │
│  │  │ 25 years         │  │ Male             │  │  │
│  │  │ (read-only) ✅   │  │ (read-only) ✅   │  │  │
│  │  └──────────────────┘  └──────────────────┘  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  📝 PATIENT NOTES (Optional)                        │
│  ┌───────────────────────────────────────────────┐  │
│  │ Any specific concerns or topics?              │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  💰 APPOINTMENT SUMMARY                             │
│  ┌───────────────────────────────────────────────┐  │
│  │ Clinician: Dr. Sarah Smith                    │  │
│  │ Date: June 10, 2026                           │  │
│  │ Time: 10:00 AM - 10:50 AM                     │  │
│  │ Type: Individual Therapy                      │  │
│  │ Amount: ₹500                                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│            [Confirm & Pay] ← READY!                 │
└─────────────────────────────────────────────────────┘
```

**Key Points:**

- ✅ Name auto-filled from database
- ✅ Email auto-filled from database
- ✅ Age displayed (read-only, fetched from API)
- ✅ Gender displayed (read-only, fetched from API)
- ✅ User can edit name/email if needed
- ✅ Age/gender cannot be edited here (gray background)

---

## Scenario 4: Legacy User (One-Time Profile Completion)

```
┌─────────────────────────────────────────────────────────────────┐
│         LEGACY USER - ONE-TIME PROFILE COMPLETION               │
└─────────────────────────────────────────────────────────────────┘

Initial State: User Exists Before Enhanced Form
┌────────────────────────────────────────┐
│  Database State (Old User):            │
│  ┌──────────────────────────────────┐  │
│  │ users table:                     │  │
│  │ phone: '919999999999' ✅         │  │
│  │ first_name: NULL      ❌         │  │
│  │ last_name: NULL       ❌         │  │
│  │ full_name: NULL       ❌         │  │
│  │ email: NULL           ❌         │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ patient_profiles table:          │  │
│  │ user_id: 789                     │  │
│  │ age: NULL             ❌         │  │
│  │ gender: NULL          ❌         │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘

Step 1: User Logs In
┌──────────────────┐
│ Enter Phone:     │
│ 919999999999     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Enter OTP       │
└────────┬─────────┘
         │
         ▼

Step 2: Backend Detects Legacy User
┌────────────────────────────────────────────────┐
│  Backend Logic:                                │
│                                                │
│  const isLegacyUser =                          │
│    !user.first_name || !user.last_name;        │
│                                                │
│  Result: isLegacyUser = true ⚠️                │
│  (first_name is NULL OR last_name is NULL)     │
│                                                │
│  const hasIncompleteProfile =                  │
│    patient.age === null ||                     │
│    patient.gender === null;                    │
│                                                │
│  Result: hasIncompleteProfile = true ⚠️        │
│                                                │
│  if (isLegacyUser && hasIncompleteProfile) {   │
│    requiresProfileCompletion = true; ⚠️        │
│  }                                             │
└────────┬───────────────────────────────────────┘
         │
         ▼

Step 3: ProfileCompletionModal Shown (ONE-TIME!)
┌───────────────────────────────────────────────────┐
│         ✨ COMPLETE YOUR PROFILE                  │
│  ┌─────────────────────────────────────────────┐  │
│  │  We've added new fields to improve your    │  │
│  │  experience. Please complete your profile. │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  First Name *                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ [________Empty________]                     │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Last Name *                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │ [________Empty________]                     │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Email (Optional)                                 │
│  ┌─────────────────────────────────────────────┐  │
│  │ [________Empty________]                     │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Age *          Gender *                          │
│  ┌──────────┐  ┌────────────────────────────┐    │
│  │ [__] ▲▼  │  │ [▼ Select gender]         │    │
│  └──────────┘  └────────────────────────────┘    │
│                                                   │
│      [Complete Profile]  [Skip for Now]          │
└───────────────────────────────────────────────────┘

User fills:
- First Name: Jane
- Last Name: Smith
- Email: jane@email.com
- Age: 30
- Gender: Female

Clicks: [Complete Profile]
         │
         ▼

Step 4: Save to Database
┌────────────────────────────────────────────────┐
│  Backend updates:                              │
│                                                │
│  UPDATE users SET                              │
│    first_name = 'Jane',                        │
│    last_name = 'Smith',                        │
│    full_name = 'Jane Smith',                   │
│    email = 'jane@email.com'                    │
│  WHERE id = 789;                               │
│                                                │
│  UPDATE patient_profiles SET                   │
│    age = 30,                                   │
│    gender = 'FEMALE'                           │
│  WHERE user_id = 789;                          │
│                                                │
│  ✅ SUCCESS (No 500 error!)                    │
└────────┬───────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Frontend: Modal closes              │
│  localStorage updated with new data  │
│  ✅ Redirected to Dashboard          │
└────────┬─────────────────────────────┘
         │
         ▼

Step 5: Next Login (NO MODAL!)
┌──────────────────────────────────────────────┐
│  Database State (After Completion):          │
│  ┌────────────────────────────────────────┐  │
│  │ users table:                           │  │
│  │ phone: '919999999999' ✅               │  │
│  │ first_name: 'Jane'    ✅ NOW EXISTS!   │  │
│  │ last_name: 'Smith'    ✅ NOW EXISTS!   │  │
│  │ full_name: 'Jane Smith' ✅             │  │
│  │ email: 'jane@email.com' ✅             │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ patient_profiles table:                │  │
│  │ user_id: 789                           │  │
│  │ age: 30               ✅ NOW EXISTS!   │  │
│  │ gender: 'FEMALE'      ✅ NOW EXISTS!   │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

User logs in again:
┌──────────────────────────────────────────────┐
│  Backend checks:                             │
│  isLegacyUser = false ✅                     │
│  (first_name AND last_name now exist)        │
│                                              │
│  requiresProfileCompletion = false ✅        │
└────────┬─────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  ❌ NO MODAL SHOWN                   │
│  ✅ DIRECT LOGIN                     │
│                                      │
│  Welcome back, Jane Smith!           │
└──────────────────────────────────────┘
```

---

## 🎯 Summary: When is the Form Shown?

```
┌─────────────────────────────────────────────────────────────────┐
│                   FORM DISPLAY DECISION TREE                    │
└─────────────────────────────────────────────────────────────────┘

                        User Logs In
                             │
                             ▼
                   ┌─────────────────┐
                   │ User exists in  │
                   │   database?     │
                   └────────┬────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
             NO                          YES
              │                           │
              ▼                           ▼
      ┌───────────────┐        ┌──────────────────┐
      │  NEW USER     │        │ Has first_name   │
      │               │        │ AND last_name?   │
      │ ✅ SHOW FORM  │        └────────┬─────────┘
      └───────────────┘                 │
                              ┌─────────┴─────────┐
                              │                   │
                             YES                  NO
                              │                   │
                              ▼                   ▼
                    ┌──────────────────┐  ┌──────────────────┐
                    │ Complete user    │  │ LEGACY USER      │
                    │                  │  │                  │
                    │ ❌ NO FORM       │  │ ✅ SHOW FORM     │
                    │                  │  │   (one-time)     │
                    │ Login directly   │  │                  │
                    │ to dashboard     │  │ After: No form   │
                    └──────────────────┘  └──────────────────┘
```

**Key Rule:**

```
SHOW FORM if:
  (first_name IS NULL OR last_name IS NULL)

DON'T SHOW FORM if:
  (first_name EXISTS AND last_name EXISTS)
```

**Important:** Age and gender being NULL does NOT trigger the form if the user has first_name and last_name!

---

## 🎉 Final Result

### **For ANY User (New, Legacy, or Existing):**

**First Time:**

- ✅ Fill form once

**Every Time After:**

- ❌ NO form shown
- ✅ Data auto-fetched from database
- ✅ Auto-filled in booking forms
- ✅ Displayed in confirmation steps
- ✅ Seamless user experience

**THE USER NEVER HAS TO FILL THE FORM AGAIN!** 🎊
