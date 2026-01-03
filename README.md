# Mibo Frontend

React + TypeScript + Vite frontend for Mibo Mental Hospital booking system.

## Quick Start

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173` (or 5174 if port is in use)

## Key Features

- **Patient Booking Flow**: Complete appointment booking with OTP verification
- **Doctor Selection**: Browse doctors by specialization
- **Phone Verification**: OTP-based authentication (test mode available)
- **Payment Integration**: Razorpay checkout ready
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Patient Dashboard**: View appointments and profile

## Tech Stack

- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Lottie for animations

## Project Structure

```
src/
├── pages/
│   ├── BookAppointment/     # Booking flow (3 steps)
│   ├── auth/                # Patient authentication
│   └── PatientDashboard/    # Patient portal
├── services/                # API integration
├── components/              # Reusable components
├── assets/                  # Images, animations
└── App.tsx                  # Main app component
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm test` - Run tests

## Environment Setup

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Booking Flow

### Step 1: Select Doctor & Time

- Browse doctors from static data (no database needed)
- Select appointment date and time
- Choose consultation type (online/in-person)

### Step 2: Phone Verification

- Enter phone number
- Receive OTP via WhatsApp (or browser alert in test mode)
- Verify OTP to continue

### Step 3: Confirm Booking

- Review appointment details
- Proceed to payment
- Get confirmation

## Test Mode

For testing without WhatsApp:

- OTP is shown in browser alert
- Backend test endpoints used (`/api/test/send-otp`, `/api/test/verify-otp`)
- No database required

## API Integration

All API calls are in `src/services/`:

- `authService.ts` - Authentication
- `bookingService.ts` - Appointment booking
- `patientDashboardService.ts` - Patient data

Example:

```typescript
import { sendOTP, verifyOTP } from "./services/authService";

// Send OTP
await sendOTP("919876543210");

// Verify OTP
const result = await verifyOTP("919876543210", "123456");
```

## Backend Integration

Backend runs on `http://localhost:5000`

Make sure backend is running before starting frontend:

```bash
cd backend
npm run dev
```

## Current Status

✅ **Working**:

- Complete booking flow UI
- OTP verification (test mode)
- Doctor selection from static data
- Responsive design
- API integration structure

⚠️ **In Progress**:

- Payment flow completion
- Patient dashboard features
- WhatsApp OTP delivery (backend issue)

## Documentation

**Frontend**:

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete frontend integration guide with code examples

**Backend**:

- API endpoints: [backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md)
- Setup guide: [backend/SETUP_GUIDE.md](../backend/SETUP_GUIDE.md)
- Project overview: [backend/PROJECT_OVERVIEW.md](../backend/PROJECT_OVERVIEW.md)

## Deployment

Build for production:

```bash
npm run build
```

Output in `dist/` folder ready for deployment.

## Support

For issues:

1. Check backend is running on port 5000
2. Verify `.env` configuration
3. Check browser console for errors
4. Review backend logs
