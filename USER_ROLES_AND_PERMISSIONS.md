# User Roles and Permissions

## 📋 Available Roles

Based on your database schema, the system supports these roles:

1. **ADMIN** - System administrator with full access
2. **MANAGER** - Hospital chain manager with broad permissions
3. **CENTRE_MANAGER** - Individual centre manager
4. **CLINICIAN** - Doctors/therapists providing care
5. **CARE_COORDINATOR** - Patient care coordination staff
6. **FRONT_DESK** - Reception/front desk staff
7. **PATIENT** - Patients using the system

---

## 🔐 Complete Permissions Matrix

### 1. Authentication (All Roles)

| Action                      | Public | All Authenticated |
| --------------------------- | ------ | ----------------- |
| Send OTP                    | ✅     | ✅                |
| Login (Phone + OTP)         | ✅     | ✅                |
| Login (Phone + Password)    | ✅     | ✅                |
| Login (Username + Password) | ✅     | ✅                |
| Refresh Token               | ✅     | ✅                |
| Logout                      | -      | ✅                |
| Get Current User            | -      | ✅                |

---

### 2. Patient Management

| Action                        | ADMIN | MANAGER | CENTRE_MGR | CARE_COORD | FRONT_DESK | CLINICIAN |
| ----------------------------- | ----- | ------- | ---------- | ---------- | ---------- | --------- |
| **View Patients List**        | ✅    | ✅      | ✅         | ✅         | ✅         | ❌        |
| **View Patient Details**      | ✅    | ✅      | ✅         | ✅         | ✅         | ✅        |
| **Create Patient**            | ✅    | ✅      | ✅         | ✅         | ✅         | ❌        |
| **Update Patient**            | ✅    | ✅      | ✅         | ✅         | ✅         | ❌        |
| **View Patient Appointments** | ✅    | ✅      | ✅         | ✅         | ✅         | ✅        |
| **Add Medical Notes**         | ✅    | ❌      | ❌         | ❌         | ❌         | ✅        |

---

### 3. Appointment Management

| Action                       | ADMIN | MANAGER | CENTRE_MGR | CARE_COORD | FRONT_DESK | CLINICIAN |
| ---------------------------- | ----- | ------- | ---------- | ---------- | ---------- | --------- |
| **View Appointments**        | ✅    | ✅      | ✅         | ✅         | ✅         | ✅ (own)  |
| **View My Appointments** 🆕  | -     | -       | -          | -          | -          | ✅        |
| **View Appointment Details** | ✅    | ✅      | ✅         | ✅         | ✅         | ✅        |
| **Check Availability**       | ✅    | ✅      | ✅         | ✅         | ✅         | ✅        |
| **Create Appointment**       | ✅    | ✅      | ✅         | ✅         | ✅         | ❌        |
| **Update Appointment**       | ✅    | ✅      | ✅         | ✅         | ❌         | ❌        |
| **Cancel Appointment**       | ✅    | ✅      | ✅         | ✅         | ✅         | ❌        |

**🆕 New Feature:** Doctors can now view their appointments categorized by:

- **Current** - Today's appointments
- **Upcoming** - Future appointments
- **Past** - Previous/completed appointments

---

### 4. Staff User Management

| Action                 | ADMIN | MANAGER | CENTRE_MGR | Others |
| ---------------------- | ----- | ------- | ---------- | ------ |
| **View Staff Users**   | ✅    | ❌      | ❌         | ❌     |
| **View Staff Details** | ✅    | ❌      | ❌         | ❌     |
| **Create Staff User**  | ✅    | ❌      | ❌         | ❌     |
| **Update Staff User**  | ✅    | ❌      | ❌         | ❌     |
| **Delete Staff User**  | ✅    | ❌      | ❌         | ❌     |

> **Note:** Only ADMIN can manage staff user accounts (create, update, delete)

---

### 5. Clinician (Doctor) Management

| Action                     | ADMIN | MANAGER | CENTRE_MGR | Others                 |
| -------------------------- | ----- | ------- | ---------- | ---------------------- |
| **View Clinicians List**   | ✅    | ✅      | ✅         | ✅ (All authenticated) |
| **View Clinician Details** | ✅    | ✅      | ✅         | ✅ (All authenticated) |
| **Create Clinician**       | ✅    | ✅      | ✅         | ❌                     |
| **Update Clinician**       | ✅    | ✅      | ✅         | ❌                     |
| **Delete Clinician**       | ✅    | ✅      | ✅         | ❌                     |
| **Update Availability**    | ✅    | ✅      | ✅         | ❌                     |

**Clinician Profile Includes:**

- Name, specialization, registration number
- Primary centre assignment
- Years of experience
- Consultation fee
- Bio/description
- Consultation modes (IN_PERSON, ONLINE)
- Default consultation duration
- Profile picture URL
- Availability schedule (per centre)

---

### 6. Centre Management

| Action                  | ADMIN | MANAGER | CENTRE_MGR | Others                 |
| ----------------------- | ----- | ------- | ---------- | ---------------------- |
| **View Centres**        | ✅    | ✅      | ✅         | ✅ (All authenticated) |
| **View Centre Details** | ✅    | ✅      | ✅         | ✅ (All authenticated) |
| **Create Centre**       | ✅    | ✅      | ❌         | ❌                     |
| **Update Centre**       | ✅    | ✅      | ✅         | ❌                     |
| **Delete Centre**       | ✅    | ❌      | ❌         | ❌                     |

---

### 7. Payment Management

| Action                    | ADMIN | MANAGER | CENTRE_MGR | CARE_COORD | FRONT_DESK | Others                 |
| ------------------------- | ----- | ------- | ---------- | ---------- | ---------- | ---------------------- |
| **Create Payment Order**  | ✅    | ✅      | ✅         | ✅         | ✅         | ✅ (All authenticated) |
| **Verify Payment**        | ✅    | ✅      | ✅         | ✅         | ✅         | ✅ (All authenticated) |
| **View Payments List**    | ✅    | ✅      | ✅         | ❌         | ❌         | ❌                     |
| **View Payment Details**  | ✅    | ✅      | ✅         | ✅         | ✅         | ❌                     |
| **View Patient Payments** | ✅    | ✅      | ✅         | ✅         | ✅         | ❌                     |
| **Create Refund**         | ✅    | ✅      | ❌         | ❌         | ❌         | ❌                     |

---

### 8. Video Consultation Management

| Action                   | ADMIN | MANAGER | CENTRE_MGR | CARE_COORD | FRONT_DESK | Others                 |
| ------------------------ | ----- | ------- | ---------- | ---------- | ---------- | ---------------------- |
| **Generate Meet Link**   | ✅    | ✅      | ✅         | ✅         | ✅         | ❌                     |
| **Get Meet Link**        | ✅    | ✅      | ✅         | ✅         | ✅         | ✅ (All authenticated) |
| **Update Meet Link**     | ✅    | ✅      | ✅         | ❌         | ❌         | ❌                     |
| **Delete Meet Link**     | ✅    | ✅      | ✅         | ❌         | ❌         | ❌                     |
| **View All Video Links** | ✅    | ✅      | ❌         | ❌         | ❌         | ❌                     |

---

### 9. Notification Management

| Action                            | ADMIN | MANAGER | CENTRE_MGR | CARE_COORD | FRONT_DESK | Others |
| --------------------------------- | ----- | ------- | ---------- | ---------- | ---------- | ------ |
| **Send Appointment Confirmation** | ✅    | ✅      | ✅         | ✅         | ✅         | ❌     |
| **Send Appointment Reminder**     | ✅    | ✅      | ❌         | ❌         | ❌         | ❌     |
| **View Notification History**     | ✅    | ✅      | ❌         | ❌         | ❌         | ❌     |
| **View Notification Stats**       | ✅    | ✅      | ❌         | ❌         | ❌         | ❌     |
| **View Notification Details**     | ✅    | ✅      | ✅         | ❌         | ❌         | ❌     |

---

### 10. Analytics & Reporting

| Action                     | ADMIN | MANAGER | CENTRE_MGR | Others |
| -------------------------- | ----- | ------- | ---------- | ------ |
| **View Dashboard Metrics** | ✅    | ✅      | ✅         | ❌     |
| **View Top Doctors**       | ✅    | ✅      | ✅         | ❌     |
| **View Revenue Data**      | ✅    | ✅      | ✅         | ❌     |
| **View Leads by Source**   | ✅    | ✅      | ✅         | ❌     |

---

## 🎯 Role Descriptions

### 1. ADMIN (System Administrator)

**Full system access** - Can manage everything including:

- All staff users and their roles
- All centres and their configurations
- All clinicians and their profiles
- System-wide analytics and reports
- Payment refunds
- All notification features

**Use Case:** IT administrators, system owners

---

### 2. MANAGER (Hospital Chain Manager)

**Broad operational access** - Can manage:

- Create and manage clinicians (doctors)
- Create and manage centres
- View and manage appointments
- View analytics and reports
- Process refunds
- Send notifications
- View all video consultation links

**Cannot:**

- Manage staff user accounts (only ADMIN)

**Use Case:** Hospital chain managers, operations heads

---

### 3. CENTRE_MANAGER (Individual Centre Manager)

**Centre-specific management** - Can manage:

- Clinicians at their centre
- Update their centre details
- View and manage appointments at their centre
- View analytics for their centre
- Manage video consultation links
- View notifications

**Cannot:**

- Create new centres
- Manage staff users
- Process refunds
- Send appointment reminders
- View system-wide analytics

**Use Case:** Individual hospital/clinic managers

---

### 4. CLINICIAN (Doctor/Therapist)

**Clinical care focus** - Can:

- View patient details and history
- View appointments (their own only)
- **🆕 View appointment dashboard** (current, upcoming, past)
- Add medical notes to patients
- View their own schedule

**Cannot:**

- Create/update appointments
- Manage other users
- Access financial data
- Access analytics
- View other doctors' appointments

**Use Case:** Doctors, psychiatrists, therapists, counselors

**🆕 Login Methods:**

- Phone + OTP
- Phone + Password
- Username + Password

---

### 5. CARE_COORDINATOR

**Patient care coordination** - Can:

- View and manage patients
- Create and manage appointments
- View patient appointments
- Cancel appointments
- Generate video consultation links
- Send appointment confirmations
- View payment details

**Cannot:**

- Update appointments (reschedule)
- Add medical notes
- Manage clinicians or centres
- Access analytics
- Process refunds

**Use Case:** Care coordinators, patient relationship managers

---

### 6. FRONT_DESK

**Reception operations** - Can:

- View and manage patients
- Create and cancel appointments
- View patient appointments
- Generate video consultation links
- Send appointment confirmations
- View payment details

**Cannot:**

- Update/reschedule appointments
- Add medical notes
- Manage clinicians or centres
- Access analytics
- Process refunds

**Use Case:** Reception staff, front desk operators

---

### 7. PATIENT

**Self-service access** - Can:

- View their own appointments
- Create payment orders
- Verify payments
- Access video consultation links

**Cannot:**

- Access other patients' data
- Manage appointments (staff does this)
- Access any administrative features

**Use Case:** Patients using the system

---

## 🔑 Key Permission Highlights

### ✅ Who Can Create Doctors (Clinicians)?

- **ADMIN** ✅
- **MANAGER** ✅
- **CENTRE_MANAGER** ✅

### ✅ Who Can Create Centres?

- **ADMIN** ✅
- **MANAGER** ✅

### ✅ Who Can Manage Staff Users?

- **ADMIN** ✅ (Only)

### ✅ Who Can Process Refunds?

- **ADMIN** ✅
- **MANAGER** ✅

### ✅ Who Can Add Medical Notes?

- **ADMIN** ✅
- **CLINICIAN** ✅

### ✅ Who Can View Analytics?

- **ADMIN** ✅
- **MANAGER** ✅
- **CENTRE_MANAGER** ✅

---

## 📊 Permission Level Summary

**Highest Access → Lowest Access:**

1. **ADMIN** - Full system control
2. **MANAGER** - Broad operational control (except staff users)
3. **CENTRE_MANAGER** - Centre-specific management
4. **CARE_COORDINATOR** - Patient care operations
5. **FRONT_DESK** - Basic reception operations
6. **CLINICIAN** - Clinical care only
7. **PATIENT** - Self-service only

---

## 🔒 Security Notes

1. **Role Assignment:** Only ADMIN can assign roles to users
2. **Multi-Role Support:** Users can have multiple roles
3. **Centre-Specific Roles:** Roles can be assigned per centre
4. **Token-Based Auth:** All endpoints use JWT authentication
5. **Role Validation:** Middleware checks roles before allowing access

---

## 🆕 Recent Updates

### December 13, 2024 - Doctor Login & Appointment Dashboard

- ✅ Doctors (CLINICIAN role) can now log in using phone/username with OTP or password
- ✅ New endpoint: `GET /api/appointments/my-appointments` for doctor dashboard
- ✅ Appointments categorized by current (today), upcoming, and past
- ✅ Automatic filtering - doctors only see their own appointments
- ✅ Includes patient details (name, phone) and centre details (name, address)

### Previous Updates

- MANAGER role added to clinician and centre management
- Fixed database column mappings for clinician profiles
- Added missing fields to match database schema

---

**Last Updated:** December 13, 2024
