# Mibo Care Admin Panel - Complete Implementation Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [API Integration](#api-integration)
5. [Data Models & Types](#data-models--types)
6. [Authentication System](#authentication-system)
7. [Core Features](#core-features)
8. [Service Layer](#service-layer)
9. [UI Components](#ui-components)
10. [Routing & Navigation](#routing--navigation)

---

## Project Overview

**Mibo Care Admin Panel** is a comprehensive management system for a mental hospital chain with multiple centres across India (Bangalore, Kochi, Mumbai). The admin panel enables staff to manage centres, clinicians, patients, appointments, and view analytics.

### Key Capabilities

- Multi-centre management
- Clinician scheduling with availability rules
- Patient management and medical records
- Appointment booking and management
- Real-time analytics dashboard
- Role-based access control

---

## Technology Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend Integration

- **API Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT (Access + Refresh Tokens)
- **Database**: PostgreSQL (via Express backend)

---

## Architecture

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Input, Modal, etc.)
│   ├── calendar/       # Calendar components
│   └── charts/         # Analytics charts
├── contexts/           # React contexts (Auth)
├── layouts/            # Layout components (AdminLayout)
├── modules/            # Feature modules
│   ├── auth/          # Authentication
│   ├── dashboard/     # Analytics dashboard
│   ├── patients/      # Patient management
│   ├── appointments/  # Appointment booking & management
│   ├── centres/       # Centre management
│   ├── staff/         # Staff management
│   └── settings/      # Settings & support
├── router/            # Route configuration
├── services/          # API service layer
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

---

## API Integration

### Base Configuration

**File**: `src/services/api.ts`

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
```

### Request Interceptor

Automatically adds JWT token to all requests:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles token refresh on 401 errors:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt token refresh
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      // Retry original request
    }
  }
);
```

### API Endpoints

#### Authentication

- `POST /auth/request-otp` - Request OTP for phone
- `POST /auth/verify-otp` - Verify OTP and login
- `POST /auth/login` - Login with phone/username + password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

#### Centres

- `GET /centres` - Get all centres
- `GET /centres/:id` - Get centre by ID
- `POST /centres` - Create new centre
- `PUT /centres/:id` - Update centre
- `DELETE /centres/:id` - Soft delete centre

#### Clinicians

- `GET /clinicians` - Get all clinicians
- `GET /clinicians/:id` - Get clinician by ID
- `POST /clinicians` - Create new clinician
- `PUT /clinicians/:id` - Update clinician
- `DELETE /clinicians/:id` - Soft delete clinician
- `GET /clinicians/:id/availability` - Get availability rules
- `POST /clinicians/:id/availability` - Set availability rules

#### Patients

- `GET /patients` - Get all patients (with search)
- `GET /patients/:id` - Get patient details
- `POST /patients` - Create new patient
- `PUT /patients/:id` - Update patient
- `GET /patients/:id/appointments` - Get patient appointments
- `POST /patients/:id/notes` - Add medical note

#### Appointments

- `GET /appointments` - Get all appointments
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `POST /appointments/:id/cancel` - Cancel appointment
- `GET /appointments/check-availability` - Check slot availability
- `GET /appointments/my-appointments` - Get clinician's appointments

#### Analytics

- `GET /analytics/dashboard-metrics` - Get dashboard metrics
- `GET /analytics/top-doctors` - Get top performing doctors
- `GET /analytics/revenue-data` - Get revenue trends
- `GET /analytics/leads-by-source` - Get lead sources

---

## Data Models & Types

### User Types

```typescript
type UserType = "PATIENT" | "STAFF";

type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "CENTRE_MANAGER"
  | "CLINICIAN"
  | "CARE_COORDINATOR"
  | "FRONT_DESK";
```

### User

```typescript
interface User {
  id: string;
  username: string | null;
  phone: string;
  email: string | null;
  fullName: string;
  userType: UserType;
  role: UserRole | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Centre

```typescript
interface Centre {
  id: string;
  name: string;
  city: "bangalore" | "kochi" | "mumbai";
  address: string;
  phone: string;
  email: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Clinician

```typescript
interface Clinician {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  registrationNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Patient

```typescript
interface Patient {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string | null;
  dateOfBirth: Date | null;
  gender: "male" | "female" | "other" | null;
  bloodGroup: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Appointment Types & Statuses

```typescript
type AppointmentType =
  | "IN_PERSON"
  | "ONLINE"
  | "INPATIENT_ASSESSMENT"
  | "FOLLOW_UP";

type AppointmentStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
```

### Appointment

```typescript
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  clinicianId: string;
  clinicianName: string;
  centreId: string;
  centreName: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Availability Rule

```typescript
interface AvailabilityRule {
  id: string;
  clinicianId: string;
  centreId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  slotDuration: number; // in minutes
  mode: "IN_PERSON" | "ONLINE";
  isActive: boolean;
}
```

### Time Slot

```typescript
interface TimeSlot {
  id: string;
  clinicianId: string;
  centreId: string;
  startTime: Date;
  endTime: Date;
  status: "available" | "booked" | "blocked";
  appointmentId: string | null;
  mode: "IN_PERSON" | "ONLINE";
}
```

### Dashboard Metrics

```typescript
interface DashboardMetrics {
  totalPatients: number;
  totalPatientsChange: number; // percentage
  activeDoctors: number;
  activeDoctorsChange: number;
  followUpsBooked: number;
  followUpsBookedChange: number;
  totalRevenue: number;
  totalRevenueChange: number;
}
```

---

## Authentication System

### Authentication Methods

The system supports **three authentication methods**:

1. **Phone + OTP**

   - User enters phone number
   - System sends OTP via SMS
   - User verifies OTP to login

2. **Phone + Password**

   - User enters phone number and password
   - Direct login without OTP

3. **Username + Password**
   - User enters username and password
   - Traditional login method

### Authentication Flow

```typescript
// 1. Request OTP
await authService.requestOTP(phone);

// 2. Verify OTP
const { user, accessToken, refreshToken } = await authService.verifyOTP(
  phone,
  otp
);

// 3. Store tokens
localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);
localStorage.setItem("user", JSON.stringify(user));

// 4. Login with password
const { user, accessToken, refreshToken } = await authService.login({
  phone: "1234567890",
  password: "password123",
});
```

### Token Management

**Access Token**: Short-lived (15 minutes), used for API requests
**Refresh Token**: Long-lived (7 days), used to get new access tokens

```typescript
// Automatic token refresh on 401 error
if (error.response?.status === 401) {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await axios.post("/auth/refresh", { refreshToken });
  localStorage.setItem("accessToken", response.data.accessToken);
  // Retry failed request
}
```

### Protected Routes

```typescript
// Router checks authentication
const isAuthenticated = true; // Set based on token presence

<Route
  path="/"
  element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}
>
  {/* Protected routes */}
</Route>;
```

### Role-Based Access Control

```typescript
// User roles determine access
const userRole = user.role; // ADMIN, MANAGER, CLINICIAN, etc.

// Sidebar navigation filtered by role
const canAccessCentres = ["ADMIN", "MANAGER"].includes(userRole);
const canAccessStaff = ["ADMIN", "MANAGER", "CENTRE_MANAGER"].includes(
  userRole
);
```

---

## Core Features

### 1. Dashboard (Analytics)

**Location**: `src/modules/dashboard/pages/DashboardPage.tsx`

**Features**:

- Real-time metrics (patients, doctors, follow-ups, revenue)
- Percentage change indicators
- Top performing doctors list
- Revenue trends chart (area chart)
- Leads by source chart (donut chart)
- Recent appointments list

**Key Metrics**:

```typescript
{
  totalPatients: 11238,
  totalPatientsChange: 45, // +45%
  activeDoctors: 238,
  activeDoctorsChange: 21,
  followUpsBooked: 182,
  followUpsBookedChange: 12,
  totalRevenue: 1643205,
  totalRevenueChange: 32
}
```

**API Integration**:

```typescript
const metrics = await analyticsService.getDashboardMetrics();
const topDoctors = await analyticsService.getTopDoctors();
const revenueData = await analyticsService.getRevenueData("month");
const leadsData = await analyticsService.getLeadsBySource();
```

---

### 2. Centre Management

**Location**: `src/modules/centres/pages/CentresPage.tsx`

**Features**:

- View all centres in table format
- Create new centre with modal form
- Edit existing centre
- Soft delete centre
- City validation (bangalore, kochi, mumbai only)

**Form Fields**:

```typescript
{
  name: string;           // Required
  city: "bangalore" | "kochi" | "mumbai"; // Required
  address: string;        // Required
  phone: string;          // Required
  email?: string;         // Optional
}
```

**Operations**:

```typescript
// Create
await centreService.createCentre(data);

// Update
await centreService.updateCentre(id, data);

// Delete (soft)
await centreService.deleteCentre(id);
```

---

### 3. Clinician Management

**Location**: `src/modules/staff/pages/CliniciansPage.tsx`

**Features**:

- View all clinicians
- Create/edit clinician profile
- Manage availability rules
- Set consultation fees
- Track years of experience

**Clinician Form Fields**:

```typescript
{
  name: string;
  specialization: string;
  registrationNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
}
```

**Availability Management**:
**Component**: `src/modules/staff/components/AvailabilityManager.tsx`

```typescript
{
  centreId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  slotDuration: number; // 30 minutes
  mode: "IN_PERSON" | "ONLINE";
}
```

**Slot Generation**:

```typescript
// Utility: src/utils/slotGenerator.ts
const slots = generateSlots({
  startTime: "09:00",
  endTime: "17:00",
  duration: 30,
});
// Returns: ["09:00", "09:30", "10:00", ..., "16:30"]
```

---

### 4. Calendar Components

**Purpose**: Visualize clinician availability and booked slots

#### AvailabilityCalendar

**Location**: `src/components/calendar/AvailabilityCalendar.tsx`

**Features**:

- Monthly calendar view
- Shows available/booked/blocked slots
- Click on date to view detailed slots
- Color-coded slot indicators

**Usage**:

```typescript
<AvailabilityCalendar
  clinicianId="clinician-id"
  centreId="centre-id"
  onDateSelect={(date) => console.log(date)}
/>
```

#### SlotGrid

**Location**: `src/components/calendar/SlotGrid.tsx`

**Features**:

- Displays time slots for a specific date
- Shows slot status (available/booked/blocked)
- Displays patient info for booked slots
- Click to select available slot

**Usage**:

```typescript
<SlotGrid
  date={selectedDate}
  clinicianId="clinician-id"
  centreId="centre-id"
  onSlotSelect={(slot) => console.log(slot)}
/>
```

#### WeekView

**Location**: `src/components/calendar/WeekView.tsx`

**Features**:

- Week-long schedule overview
- Compact view of availability
- Shows all slots for 7 days

**Usage**:

```typescript
<WeekView
  startDate={weekStart}
  clinicianId="clinician-id"
  centreId="centre-id"
/>
```

---

### 5. Appointment Booking

**Location**: `src/modules/appointments/pages/BookAppointmentPage.tsx`

**Multi-Step Wizard** (6 steps):

**Step 1: Select Centre**

```typescript
centres.map((centre) => <option value={centre.id}>{centre.name}</option>);
```

**Step 2: Select Clinician**

```typescript
// Filtered by selected centre
clinicians
  .filter(c => c.centreId === selectedCentre)
  .map(clinician => ...)
```

**Step 3: Select Date & Time**

```typescript
<AvailabilityCalendar />
<SlotGrid onSlotSelect={setSelectedSlot} />
```

**Step 4: Select Session Type**

```typescript
<select>
  <option value="IN_PERSON">In-Person</option>
  <option value="ONLINE">Online</option>
  <option value="FOLLOW_UP">Follow-up</option>
</select>
```

**Step 5: Patient Details**

```typescript
// Select existing patient or create new
<PatientSelector />
// OR
<CreatePatientForm />
```

**Step 6: Confirmation**

```typescript
// Review and add notes
{
  clinician: "Dr. Smith",
  centre: "Bangalore Centre",
  date: "2024-01-15",
  time: "10:00 AM",
  patient: "John Doe",
  type: "IN_PERSON",
  notes: "First consultation"
}
```

**Booking Validation**:

```typescript
// Check slot availability
const isAvailable = await appointmentService.checkAvailability({
  clinicianId,
  centreId,
  startTime,
  endTime,
});

// Create appointment
await appointmentService.createAppointment({
  patientId,
  clinicianId,
  centreId,
  appointmentType,
  scheduledStartAt,
  scheduledEndAt,
  notes,
});
```

---

### 6. Patient Management

**Location**: `src/modules/patients/pages/PatientsListPage.tsx`

**Features**:

- View all patients in table
- Search by name, phone, or email
- Create new patient
- Edit patient details
- View patient profile with appointments

**Patient Form Fields**:

```typescript
{
  fullName: string;              // Required
  phone: string;                 // Required
  email?: string;                // Optional
  dateOfBirth?: string;          // YYYY-MM-DD
  gender?: "male" | "female" | "other";
  bloodGroup?: string;           // A+, B+, O+, etc.
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
}
```

**Search Functionality**:

```typescript
const [searchTerm, setSearchTerm] = useState("");

// Filter patients
const filtered = patients.filter(
  (p) =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.email?.includes(searchTerm)
);
```

**Patient Details Page**:
**Location**: `src/modules/patients/pages/PatientDetailsPage.tsx`

Shows:

- Personal information
- Appointment history
- Medical notes
- Emergency contacts

---

### 7. Appointment Management

**Location**: `src/modules/appointments/pages/CentreAppointmentsPage.tsx`

**Features**:

- View all appointments
- Filter by centre, clinician, date, status
- Cancel appointments
- Status badges with color coding

**Filters**:

```typescript
{
  centreId?: string;
  clinicianId?: string;
  date?: string;        // YYYY-MM-DD
  status?: AppointmentStatus;
}
```

**Status Display**:

```typescript
const statusConfig = {
  BOOKED: { variant: "info", label: "Booked" },
  CONFIRMED: { variant: "success", label: "Confirmed" },
  RESCHEDULED: { variant: "warning", label: "Rescheduled" },
  COMPLETED: { variant: "success", label: "Completed" },
  CANCELLED: { variant: "danger", label: "Cancelled" },
  NO_SHOW: { variant: "danger", label: "No Show" },
};
```

**Cancel Appointment**:

```typescript
await appointmentService.cancelAppointment(id, "Cancelled by staff");
```

---

### 8. Clinician Dashboard

**Location**: `src/modules/appointments/pages/ClinicianAppointmentsPage.tsx`

**Features**:

- View clinician's own appointments
- Three categories: Current, Upcoming, Past
- Summary statistics
- Appointment cards with patient info

**Categories**:

```typescript
// Current (today)
const current = appointments.filter(
  (apt) => isToday(apt.scheduledStartAt) && apt.status !== "COMPLETED"
);

// Upcoming (future)
const upcoming = appointments.filter((apt) => isFuture(apt.scheduledStartAt));

// Past (completed)
const past = appointments.filter(
  (apt) => isPast(apt.scheduledStartAt) || apt.status === "COMPLETED"
);
```

---

## Service Layer

All API calls are abstracted into service classes for clean separation of concerns.

### Authentication Service

**File**: `src/services/authService.ts`

```typescript
class AuthService {
  async requestOTP(phone: string): Promise<void>;
  async verifyOTP(phone: string, otp: string): Promise<AuthResponse>;
  async login(credentials: LoginRequest): Promise<AuthResponse>;
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  async logout(): Promise<void>;
}
```

### Centre Service

**File**: `src/services/centreService.ts`

```typescript
class CentreService {
  async getCentres(): Promise<Centre[]>;
  async getCentreById(id: string): Promise<Centre>;
  async createCentre(data: CreateCentreRequest): Promise<Centre>;
  async updateCentre(id: string, data: UpdateCentreRequest): Promise<Centre>;
  async deleteCentre(id: string): Promise<void>;
}
```

### Clinician Service

**File**: `src/services/clinicianService.ts`

```typescript
class ClinicianService {
  async getClinicians(params?: GetCliniciansParams): Promise<Clinician[]>;
  async getClinicianById(id: string): Promise<Clinician>;
  async createClinician(data: CreateClinicianRequest): Promise<Clinician>;
  async updateClinician(
    id: string,
    data: UpdateClinicianRequest
  ): Promise<Clinician>;
  async deleteClinician(id: string): Promise<void>;
  async getAvailability(id: string): Promise<AvailabilityRule[]>;
  async setAvailability(id: string, rules: AvailabilityRule[]): Promise<void>;
}
```

### Patient Service

**File**: `src/services/patientService.ts`

```typescript
class PatientService {
  async getPatients(params?: GetPatientsParams): Promise<Patient[]>;
  async getPatientById(id: string): Promise<PatientDetailsResponse>;
  async createPatient(data: CreatePatientRequest): Promise<Patient>;
  async updatePatient(id: string, data: UpdatePatientRequest): Promise<Patient>;
  async getPatientAppointments(id: string): Promise<Appointment[]>;
  async addMedicalNote(
    patientId: string,
    noteText: string
  ): Promise<MedicalNote>;
}
```

### Appointment Service

**File**: `src/services/appointmentService.ts`

```typescript
class AppointmentService {
  async getAppointments(params?: GetAppointmentsParams): Promise<Appointment[]>;
  async getAppointmentById(id: string): Promise<Appointment>;
  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment>;
  async updateAppointment(
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<Appointment>;
  async cancelAppointment(id: string, reason: string): Promise<void>;
  async checkAvailability(params: CheckAvailabilityParams): Promise<boolean>;
  async getMyAppointments(): Promise<Appointment[]>;
}
```

### Analytics Service

**File**: `src/services/analyticsService.ts`

```typescript
class AnalyticsService {
  async getDashboardMetrics(): Promise<DashboardMetrics>;
  async getTopDoctors(limit?: number): Promise<TopDoctor[]>;
  async getRevenueData(
    period: "week" | "month" | "year"
  ): Promise<RevenueData[]>;
  async getLeadsBySource(): Promise<LeadSource[]>;
}
```

### Service Usage Example

```typescript
import patientService from "../services/patientService";

// In component
const fetchPatients = async () => {
  try {
    const patients = await patientService.getPatients({ search: "John" });
    setPatients(patients);
  } catch (error) {
    toast.error("Failed to fetch patients");
  }
};
```

---

## UI Components

### Base Components (`src/components/ui/`)

#### Button

```typescript
<Button
  variant="primary" | "secondary" | "danger" | "success"
  size="sm" | "md" | "lg"
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Input

```typescript
<Input
  label="Full Name"
  type="text"
  placeholder="Enter name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  required
  error="Error message"
/>
```

#### Select

```typescript
<Select
  label="City"
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.target.value)}
  options={[
    { value: "bangalore", label: "Bangalore" },
    { value: "kochi", label: "Kochi" },
  ]}
  required
/>
```

#### Modal

```typescript
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Patient">
  <form>{/* Form content */}</form>
</Modal>
```

#### Card

```typescript
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### Table

```typescript
<Table
  columns={[
    { key: "name", header: "Name", render: (item) => item.name },
    { key: "email", header: "Email" },
  ]}
  data={items}
  keyExtractor={(item) => item.id}
/>
```

#### Badge

```typescript
<Badge variant="success" | "danger" | "warning" | "info">
  Active
</Badge>
```

### Chart Components (`src/components/charts/`)

#### StatCard

```typescript
<StatCard
  title="Total Patients"
  value="11,238"
  icon={Users}
  trend={{ value: 45, direction: "up", period: "this month" }}
  iconColor="text-blue-400"
/>
```

#### DonutChart

```typescript
<DonutChart
  data={[
    { label: "Website", value: 400, color: "#3b82f6" },
    { label: "Phone", value: 300, color: "#2CA5A9" },
  ]}
  title="Leads by Source"
/>
```

#### AreaChartComponent

```typescript
<AreaChartComponent
  data={[
    { date: "Jan", value: 12000 },
    { date: "Feb", value: 19000 },
  ]}
  title="Revenue Analytics"
  color="#2CA5A9"
/>
```

#### TopDoctorsCard

```typescript
<TopDoctorsCard
  doctors={[
    {
      id: "1",
      name: "Dr. Smith",
      specialty: "Psychiatrist",
      avatar: "url",
      patientCount: 368,
    },
  ]}
/>
```

---

## Routing & Navigation

### Route Configuration

**File**: `src/router/index.tsx`

```typescript
<Routes>
  {/* Public route */}
  <Route path="/login" element={<LoginPage />} />

  {/* Protected routes */}
  <Route path="/" element={<AdminLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="dashboard" element={<DashboardPage />} />

    {/* Patients */}
    <Route path="patients" element={<PatientsListPage />} />
    <Route path="patients/:id" element={<PatientDetailsPage />} />

    {/* Appointments */}
    <Route path="book-appointment" element={<BookAppointmentPage />} />
    <Route
      path="centres/:centreId/appointments"
      element={<CentreAppointmentsPage />}
    />
    <Route
      path="clinicians/:clinicianId/appointments"
      element={<ClinicianAppointmentsPage />}
    />

    {/* Centres */}
    <Route path="centres" element={<CentresPage />} />

    {/* Staff */}
    <Route path="staff/managers" element={<ManagersPage />} />
    <Route path="staff/centre-managers" element={<CentreManagersPage />} />
    <Route path="staff/clinicians" element={<CliniciansPage />} />
    <Route path="staff/care-coordinators" element={<CareCoordinatorsPage />} />
    <Route path="staff/front-desk" element={<FrontDeskPage />} />

    {/* Settings */}
    <Route path="settings" element={<SettingsPage />} />
    <Route path="support" element={<SupportPage />} />
  </Route>
</Routes>
```

### Sidebar Navigation

**File**: `src/layouts/AdminLayout/Sidebar.tsx`

**Navigation Items**:

```typescript
const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/patients", icon: Users, label: "Patients" },
  { path: "/book-appointment", icon: CalendarPlus, label: "Book Appointment" },
  { path: "/centres", icon: Building2, label: "Centres" },
  {
    label: "Staff",
    icon: UserCog,
    children: [
      { path: "/staff/managers", label: "Managers" },
      { path: "/staff/centre-managers", label: "Centre Managers" },
      { path: "/staff/clinicians", label: "Clinicians" },
      { path: "/staff/care-coordinators", label: "Care Coordinators" },
      { path: "/staff/front-desk", label: "Front Desk" },
    ],
  },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/support", icon: HelpCircle, label: "Support" },
];
```

### Programmatic Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to patient details
navigate(`/patients/${patientId}`);

// Navigate with state
navigate("/book-appointment", { state: { centreId: "123" } });

// Go back
navigate(-1);
```

---

## Error Handling & Loading States

### Toast Notifications

```typescript
import toast from "react-hot-toast";

// Success
toast.success("Patient created successfully");

// Error
toast.error("Failed to fetch data");

// Loading
const toastId = toast.loading("Creating appointment...");
// Later
toast.success("Appointment created!", { id: toastId });
```

### Loading States

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await service.getData();
      setData(data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) {
  return <div>Loading...</div>;
}
```

### API Error Handling

```typescript
try {
  await appointmentService.createAppointment(data);
  toast.success("Appointment created");
} catch (error: any) {
  const message =
    error.response?.data?.message || "Failed to create appointment";
  toast.error(message);
}
```

### Timeout Protection

```typescript
// Prevent hanging on slow/failed API calls
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Request timeout")), 5000)
);

const dataPromise = service.getData();

const result = await Promise.race([dataPromise, timeoutPromise]);
```

---

## Styling & Theming

### Tailwind Configuration

**File**: `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        miboBg: "#0f172a", // Dark background
        miboTeal: "#2CA5A9", // Primary teal
        miboDeepBlue: "#1e3a8a", // Deep blue
      },
    },
  },
};
```

### Common Styles

**Background**: `bg-miboBg` (dark slate)
**Primary Color**: `text-miboTeal` or `bg-miboTeal`
**Cards**: `bg-slate-800/50 border border-white/10`
**Text**: `text-white`, `text-slate-300`, `text-slate-400`
**Hover**: `hover:bg-white/5`

### Responsive Design

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

---

## Database Schema Reference

### Key Database Constraints

**Cities**: Only `bangalore`, `kochi`, `mumbai` (lowercase)
**User Types**: `PATIENT`, `STAFF`
**Roles**: `ADMIN`, `MANAGER`, `CENTRE_MANAGER`, `CLINICIAN`, `CARE_COORDINATOR`, `FRONT_DESK`
**Appointment Types**: `IN_PERSON`, `ONLINE`, `INPATIENT_ASSESSMENT`, `FOLLOW_UP`
**Appointment Statuses**: `BOOKED`, `CONFIRMED`, `RESCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`

### Column Names (Important!)

**Clinician Table**:

- `years_of_experience` (NOT `experience_years`)
- `consultation_fee` (NOT `fee`)

**Availability Rules**:

- `day_of_week` (0-6, Sunday-Saturday)
- `start_time` (HH:MM format)
- `end_time` (HH:MM format)
- `slot_duration` (in minutes)
- `mode` (IN_PERSON or ONLINE)

**Appointments**:

- `scheduled_start_at` (timestamp)
- `scheduled_end_at` (timestamp)
- `appointment_type`
- `cancellation_reason`

### Soft Deletes

All entities use `is_active` flag for soft deletion:

```sql
UPDATE centres SET is_active = false WHERE id = ?;
```

---

## Environment Variables

Create `.env` file in project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Optional: Other configs
VITE_APP_NAME=Mibo Care Admin
VITE_APP_VERSION=1.0.0
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

- URL: `http://localhost:5173` (or next available port)
- Hot Module Replacement (HMR) enabled
- TypeScript type checking in real-time

---

## Key Implementation Patterns

### 1. Service Layer Pattern

All API calls go through service classes:

```typescript
// ❌ Don't do this
const response = await axios.get("/patients");

// ✅ Do this
const patients = await patientService.getPatients();
```

### 2. Type Safety

Always use TypeScript types:

```typescript
// ❌ Don't do this
const [data, setData] = useState<any>([]);

// ✅ Do this
const [patients, setPatients] = useState<Patient[]>([]);
```

### 3. Error Handling

Always wrap API calls in try-catch:

```typescript
try {
  const data = await service.getData();
  setData(data);
  toast.success("Success!");
} catch (error: any) {
  toast.error(error.response?.data?.message || "Failed");
}
```

### 4. Loading States

Show loading indicators during async operations:

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await service.create(data);
  } finally {
    setLoading(false);
  }
};
```

### 5. Form Validation

Validate before submission:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name) {
    toast.error("Name is required");
    return;
  }

  if (!formData.phone.match(/^\d{10}$/)) {
    toast.error("Invalid phone number");
    return;
  }

  // Submit form
};
```

### 6. Cleanup on Unmount

Clean up subscriptions and timers:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

---

## Common Issues & Solutions

### Issue 1: White Screen on Load

**Cause**: API calls hanging without timeout
**Solution**: Add timeout to API calls

```typescript
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timeout")), 5000)
);
await Promise.race([apiCall, timeoutPromise]);
```

### Issue 2: Import Errors

**Cause**: Incorrect import syntax for type exports
**Solution**: Use type imports

```typescript
// ❌ Wrong
import service, { Type } from "./service";

// ✅ Correct
import service from "./service";
import type { Type } from "./service";
```

### Issue 3: Table Column Errors

**Cause**: Using `label` instead of `header`
**Solution**: Use correct property name

```typescript
// ❌ Wrong
{ key: "name", label: "Name" }

// ✅ Correct
{ key: "name", header: "Name" }
```

### Issue 4: Missing keyExtractor

**Cause**: Table component requires keyExtractor
**Solution**: Always provide keyExtractor

```typescript
<Table columns={columns} data={data} keyExtractor={(item) => item.id} />
```

---

## Integration with Website Frontend

### Shared Components

The following components can be reused in the website:

1. **Authentication Components**

   - LoginPage with OTP/Password support
   - AuthContext for state management

2. **Booking Components**

   - AvailabilityCalendar
   - SlotGrid
   - BookAppointmentPage (simplified for patients)

3. **UI Components**
   - Button, Input, Select, Card, Modal
   - All base components are reusable

### API Endpoints for Website

**Patient-Facing Endpoints**:

```typescript
// Patient can view their own appointments
GET /appointments/my-appointments

// Patient can book appointment
POST /appointments

// Patient can view available slots
GET /clinicians/:id/availability

// Patient can view centres
GET /centres

// Patient can view clinicians
GET /clinicians
```

### Website-Specific Considerations

1. **Simplified Booking Flow**

   - Remove staff-only features
   - Auto-fill patient details from logged-in user
   - Simplified UI for public users

2. **Public Pages**

   - Home page with centre information
   - Clinician directory
   - About/Services pages
   - Contact page

3. **Patient Portal**
   - View upcoming appointments
   - View past appointments
   - Cancel appointments
   - Update profile

### Data Synchronization

Both admin panel and website use the same backend API, ensuring:

- Real-time availability updates
- Consistent appointment data
- Unified patient records
- Synchronized centre information

---

## Testing Checklist

### Authentication

- [ ] Login with phone + OTP
- [ ] Login with phone + password
- [ ] Login with username + password
- [ ] Token refresh on 401
- [ ] Logout functionality

### Centre Management

- [ ] View all centres
- [ ] Create new centre
- [ ] Edit centre
- [ ] Delete centre (soft)
- [ ] City validation

### Clinician Management

- [ ] View all clinicians
- [ ] Create clinician
- [ ] Edit clinician
- [ ] Set availability rules
- [ ] View availability calendar

### Patient Management

- [ ] View all patients
- [ ] Search patients
- [ ] Create patient
- [ ] Edit patient
- [ ] View patient details

### Appointment Booking

- [ ] Select centre
- [ ] Select clinician
- [ ] View available slots
- [ ] Select time slot
- [ ] Choose session type
- [ ] Select/create patient
- [ ] Confirm booking
- [ ] Conflict detection

### Appointment Management

- [ ] View all appointments
- [ ] Filter appointments
- [ ] Cancel appointment
- [ ] View appointment details

### Dashboard

- [ ] View metrics
- [ ] View charts
- [ ] View top doctors
- [ ] Handle API errors gracefully

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load routes
const DashboardPage = lazy(
  () => import("./modules/dashboard/pages/DashboardPage")
);
```

### Memoization

```typescript
// Memoize expensive calculations
const filteredData = useMemo(
  () => data.filter((item) => item.status === "active"),
  [data]
);
```

### Debouncing

```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchTerm(value), 300),
  []
);
```

### API Caching

```typescript
// Cache frequently accessed data
const cachedCentres = useRef<Centre[]>([]);

if (cachedCentres.current.length === 0) {
  cachedCentres.current = await centreService.getCentres();
}
```

---

## Security Best Practices

1. **Token Storage**: Store tokens in localStorage (consider httpOnly cookies for production)
2. **Input Validation**: Validate all user inputs before submission
3. **XSS Prevention**: React automatically escapes content
4. **CSRF Protection**: Backend should implement CSRF tokens
5. **Role-Based Access**: Check user role before rendering sensitive UI
6. **API Error Handling**: Don't expose sensitive error details to users

---

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set production API URL:

```env
VITE_API_BASE_URL=https://api.mibocare.com/api
```

### Hosting Options

- Vercel (recommended for Vite apps)
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

### Build Output

- Location: `dist/`
- Contains: Optimized HTML, CSS, JS
- Ready for static hosting

---

## Support & Maintenance

### Logging

```typescript
// Development logging
if (import.meta.env.DEV) {
  console.log("Debug info:", data);
}
```

### Error Tracking

Consider integrating:

- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage tracking

### Monitoring

- API response times
- Error rates
- User engagement metrics
- Performance metrics (Core Web Vitals)

---

## Conclusion

This admin panel provides a complete solution for managing a multi-centre mental health facility. The architecture is scalable, maintainable, and follows React best practices. The service layer abstraction makes it easy to swap backends or add new features.

For questions or issues, refer to:

- API documentation: `API_REFERENCE.md`
- Backend spec: `ADMIN_PANEL_BACKEND_SPEC.md`
- User roles: `USER_ROLES_AND_PERMISSIONS.md`

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained By**: Mibo Care Development Team
