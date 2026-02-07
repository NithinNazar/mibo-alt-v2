# Frontend Overview - Patient Application

## Project Information

**Project Name**: Mibo Mental Health - Patient Booking Application  
**Type**: Single Page Application (SPA)  
**Language**: TypeScript  
**Framework**: React 18  
**Build Tool**: Vite  
**UI Library**: Custom components + Tailwind CSS  
**State Management**: React Context API + Hooks

---

## Architecture

### Component-Based Architecture

```
┌─────────────────────────────────────────┐
│           User Interface                │
│  (React Components + Tailwind CSS)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Pages & Routes                  │
│  (React Router DOM navigation)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Services Layer                    │
│  (API calls to backend)                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Backend API                     │
│  (REST endpoints)                       │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
mibo_version-2/
├── src/
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loader.tsx
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── common/         # Common components
│   │       ├── ErrorBoundary.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   │   └── HomePage.tsx
│   │   ├── Experts/
│   │   │   └── ExpertsPage.tsx
│   │   ├── BookAppointment/
│   │   │   ├── BookAppointmentPage.tsx
│   │   │   ├── Step1SessionDetails.tsx
│   │   │   ├── Step2SelectExpert.tsx
│   │   │   ├── Step3SelectDateTime.tsx
│   │   │   └── Step4Payment.tsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AppointmentsTab.tsx
│   │   │   ├── PaymentsTab.tsx
│   │   │   └── ProfileTab.tsx
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── OTPVerification.tsx
│   │   └── About/
│   │       └── AboutPage.tsx
│   │
│   ├── services/           # API service layer
│   │   ├── api.ts         # Axios instance
│   │   ├── authService.ts
│   │   ├── bookingService.ts
│   │   ├── appointmentService.ts
│   │   ├── clinicianService.ts
│   │   ├── centreService.ts
│   │   ├── paymentService.ts
│   │   ├── patientDashboardService.ts
│   │   └── videoService.ts
│   │
│   ├── context/            # React Context
│   │   ├── AuthContext.tsx
│   │   └── BookingContext.tsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Public assets
│   ├── vite.svg
│   └── favicon.ico
│
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── README.md               # Documentation
```

---

## Core Features

### 1. Patient Authentication

- **OTP-based Login**: Phone number + OTP via WhatsApp
- **Auto-login**: Persistent authentication with refresh tokens
- **Protected Routes**: Redirect to login for authenticated pages

### 2. Clinician Directory

- **Browse Clinicians**: View all available mental health professionals
- **Filter by Specialization**: Clinical Psychologist, Therapist, Psychiatrist, etc.
- **Filter by Location**: Bangalore, Mumbai, Kochi
- **Clinician Profiles**: View detailed profiles with qualifications, experience, languages
- **Dynamic Data**: Fetches from database (no static fallback)

### 3. Appointment Booking Flow

**Step 1: Session Details**

- Select session type (Online/In-Person)
- Choose centre location (for in-person)
- View consultation fee

**Step 2: Select Expert**

- Browse filtered clinicians
- View clinician details
- Select preferred clinician

**Step 3: Select Date & Time**

- Calendar date picker
- Available time slots
- Real-time availability checking

**Step 4: Payment**

- Razorpay payment gateway integration
- Multiple payment methods (UPI, Cards, Wallets, Net Banking)
- Payment verification
- Booking confirmation

### 4. Patient Dashboard

- **Overview**: Upcoming appointments, recent payments, total appointments
- **Appointments Tab**: View all appointments (upcoming, past, cancelled)
- **Payments Tab**: Payment history with transaction details
- **Profile Tab**: Update personal information, emergency contacts

### 5. Appointment Management

- **View Appointments**: See all booked appointments
- **Join Online Sessions**: Access Google Meet links
- **Cancel Appointments**: Request cancellation with reason
- **Appointment Details**: View full appointment information

### 6. Payment Integration

- **Razorpay Checkout**: Secure payment processing
- **Payment Verification**: Server-side signature verification
- **Payment History**: Track all transactions
- **Payment Status**: Real-time status updates

### 7. Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch-Friendly**: Large tap targets for mobile

---

## Technology Stack

### Core Technologies

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6

### UI & Styling

- **CSS Framework**: Tailwind CSS 3
- **Icons**: Lucide React
- **Animations**: CSS transitions
- **Responsive**: Mobile-first approach

### State Management

- **Context API**: Global state (Auth, Booking)
- **React Hooks**: Local state management
- **Custom Hooks**: Reusable logic

### HTTP Client

- **Axios**: API requests
- **Interceptors**: Auto token refresh, error handling

### Payment

- **Razorpay**: Payment gateway integration
- **Razorpay Checkout**: Embedded checkout

### Analytics

- **Google Tag Manager**: GTM-MMZM7LR2
- **Google Analytics 4**: Automatic page tracking

### Development Tools

- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vite**: Fast development server

---

## Key Pages

### 1. Home Page (`/`)

- Hero section with call-to-action
- Features overview
- Clinician highlights
- Testimonials
- Contact information

### 2. Experts Page (`/experts`)

- Clinician directory
- Filter by specialization
- Filter by location
- Clinician cards with details
- "Book Appointment" button

### 3. Book Appointment (`/book-appointment`)

- Multi-step booking wizard
- Session type selection
- Clinician selection
- Date/time picker
- Payment integration

### 4. Login Page (`/login`)

- Phone number input
- OTP request
- OTP verification
- Auto-redirect after login

### 5. Dashboard (`/dashboard`)

- Overview tab
- Appointments tab
- Payments tab
- Profile tab
- Navigation sidebar

### 6. About Page (`/about`)

- Company information
- Mission and vision
- Team details
- Contact information

---

## API Integration

### Authentication APIs

```typescript
// Send OTP
POST /api/patient-auth/send-otp
Body: { phone: string, fullName: string }

// Verify OTP
POST /api/patient-auth/verify-otp
Body: { phone: string, otp: string }

// Refresh Token
POST /api/patient-auth/refresh-token
Body: { refreshToken: string }

// Get Current Patient
GET /api/patient-auth/me
Headers: { Authorization: Bearer <token> }
```

### Booking APIs

```typescript
// Get Available Slots
GET /api/booking/available-slots?clinicianId=5&centreId=1&date=2024-03-15

// Create Appointment
POST /api/booking/create
Body: {
  clinicianId: number,
  centreId: number,
  appointmentDate: string,
  appointmentTime: string,
  sessionType: 'ONLINE' | 'IN_PERSON',
  consultationFee: number
}

// Get My Appointments
GET /api/booking/my-appointments
Headers: { Authorization: Bearer <token> }

// Cancel Appointment
POST /api/booking/:id/cancel
Body: { reason: string }
```

### Clinician APIs

```typescript
// Get Clinicians (Public)
GET /api/clinicians?centreId=1&specialization=Clinical%20Psychologist

// Get Clinician by ID (Public)
GET /api/clinicians/:id

// Get Clinician Availability (Public)
GET /api/clinicians/:id/availability
```

### Payment APIs

```typescript
// Create Payment Order
POST /api/payments/create-order
Body: { appointmentId: number, amount: number }

// Verify Payment
POST /api/payments/verify
Body: {
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  appointmentId: number
}

// Get Payment History
GET /api/payments/history
Headers: { Authorization: Bearer <token> }
```

### Dashboard APIs

```typescript
// Get Dashboard Overview
GET /api/patient/dashboard
Headers: { Authorization: Bearer <token> }

// Get Profile
GET /api/patient/profile
Headers: { Authorization: Bearer <token> }

// Update Profile
PUT /api/patient/profile
Body: {
  fullName?: string,
  email?: string,
  dateOfBirth?: string,
  gender?: string,
  bloodGroup?: string,
  emergencyContactName?: string,
  emergencyContactPhone?: string
}
```

---

## State Management

### Auth Context

```typescript
interface AuthContextType {
  user: Patient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### Booking Context

```typescript
interface BookingContextType {
  sessionType: "ONLINE" | "IN_PERSON" | null;
  centreId: number | null;
  clinicianId: number | null;
  appointmentDate: string | null;
  appointmentTime: string | null;
  consultationFee: number | null;
  setSessionType: (type: "ONLINE" | "IN_PERSON") => void;
  setCentreId: (id: number) => void;
  setClinicianId: (id: number) => void;
  setAppointmentDate: (date: string) => void;
  setAppointmentTime: (time: string) => void;
  setConsultationFee: (fee: number) => void;
  resetBooking: () => void;
}
```

---

## Routing

### Public Routes

- `/` - Home page
- `/experts` - Clinician directory
- `/about` - About page
- `/login` - Login page

### Protected Routes (Require Authentication)

- `/book-appointment` - Booking flow
- `/dashboard` - Patient dashboard
- `/dashboard/appointments` - Appointments tab
- `/dashboard/payments` - Payments tab
- `/dashboard/profile` - Profile tab

### Route Protection

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## Environment Variables

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Environment
VITE_NODE_ENV=development
```

---

## Build & Deployment

### Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
```

### Production Build

```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment (Vercel)

- Platform: Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: Set in Vercel dashboard

---

## Styling Guidelines

### Tailwind CSS Classes

- **Colors**: Primary (blue), Secondary (gray), Success (green), Error (red)
- **Spacing**: Consistent padding and margins (p-4, m-2, etc.)
- **Typography**: Font sizes (text-sm, text-base, text-lg, etc.)
- **Responsive**: Mobile-first breakpoints (sm:, md:, lg:, xl:)

### Component Styling

```tsx
// Button Example
<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
  Book Appointment
</button>

// Card Example
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* Card content */}
</div>
```

---

## Performance Optimization

### Code Splitting

- Lazy loading for routes
- Dynamic imports for heavy components

### Image Optimization

- WebP format for images
- Lazy loading for images
- Responsive images

### Caching

- Service worker (future enhancement)
- Local storage for auth tokens
- Session storage for booking state

### Bundle Size

- Tree shaking (Vite)
- Minification (production build)
- Gzip compression

---

## Security Features

### Authentication

- JWT token storage in localStorage
- Automatic token refresh
- Secure token transmission (HTTPS)

### Input Validation

- Client-side validation
- Server-side validation (backend)
- XSS prevention

### Payment Security

- Razorpay secure checkout
- No card details stored
- PCI DSS compliant

---

## Testing

### Unit Tests (Future)

- Jest + React Testing Library
- Component testing
- Hook testing

### E2E Tests (Future)

- Cypress or Playwright
- User flow testing
- Payment flow testing

---

## Accessibility

### WCAG 2.1 Compliance

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### Best Practices

- Alt text for images
- Focus indicators
- Color contrast ratios
- Responsive text sizing

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

1. **Progressive Web App (PWA)**: Offline support, push notifications
2. **Chat Support**: Real-time chat with support team
3. **Video Consultation**: In-app video calls
4. **Prescription Management**: View and download prescriptions
5. **Medical Records**: Upload and manage medical documents
6. **Appointment Reminders**: Push notifications
7. **Multi-language Support**: Hindi, Kannada, Tamil, etc.
8. **Dark Mode**: Theme switching
9. **Social Login**: Google, Facebook login
10. **Referral Program**: Refer friends and earn rewards

---

## Support & Documentation

- **API Documentation**: See `backend/API_DOCUMENTATION.md`
- **Project Documentation**: `PROJECT_DOCUMENTATION.md`
- **Deployment Guide**: `DEPLOY_PRODUCTION_FIXES.md`

---

**Last Updated**: March 15, 2024  
**Version**: 1.0.0
