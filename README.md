# Mibo Mental Health - Patient Booking Portal

A modern, user-friendly web application for booking mental health consultations at Mibo Mental Health centres across India. Built with React, TypeScript, and Vite.

## Features

- 🔐 **Phone OTP Authentication** - Secure login using mobile number verification
- 👨‍⚕️ **Doctor Selection** - Browse and select from qualified mental health professionals
- 📅 **Real-time Availability** - Check and book available appointment slots
- 💳 **Razorpay Payment Integration** - Secure online payment processing
- 🎥 **Video Consultations** - Join online appointments via Google Meet
- 📱 **Patient Dashboard** - View and manage your appointments
- 🏥 **Multi-Centre Support** - Book at Bangalore, Mumbai, or Kochi centres
- ✨ **Smooth Animations** - Beautiful UI with Framer Motion and Lottie

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Lottie
- **HTTP Client**: Axios
- **Payment Gateway**: Razorpay
- **Testing**: Vitest, React Testing Library
- **Routing**: React Router v7

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Backend API** running on `http://localhost:5000` (or configure your API URL)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mibo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Backend API Base URL
# Development: http://localhost:5000/api
# Production: Update with your production API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Razorpay Configuration
# Get your test/live keys from Razorpay Dashboard
# Test mode key format: rzp_test_xxxxx
# Live mode key format: rzp_live_xxxxx
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

#### Getting Razorpay Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate Test/Live keys
4. Copy the Key ID to your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Open Vitest UI for interactive testing

## Project Structure

```
mibo/
├── src/
│   ├── assets/          # Images, animations, and static files
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   │   ├── api.ts              # Axios client configuration
│   │   ├── authService.ts      # Authentication (OTP)
│   │   ├── clinicianService.ts # Doctor data
│   │   ├── appointmentService.ts # Appointments
│   │   ├── paymentService.ts   # Razorpay integration
│   │   ├── centreService.ts    # Hospital centres
│   │   ├── patientService.ts   # Patient profile
│   │   └── videoService.ts     # Video consultations
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   │   ├── apiRetry.ts         # Retry logic
│   │   └── dateHelpers.ts      # Date/time utilities
│   ├── ui/              # UI components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Public static assets
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Environment variables template
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── vitest.config.ts     # Vitest configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## API Integration

The application integrates with the Mibo Mental Health backend API. Ensure the backend is running before starting the frontend.

### API Endpoints Used

- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/login/phone-otp` - Verify OTP and login
- `GET /clinicians` - Fetch doctors
- `GET /appointments/availability` - Check availability
- `POST /appointments` - Create appointment
- `GET /patients/:id/appointments` - Get patient appointments
- `DELETE /appointments/:id` - Cancel appointment
- `POST /payments/create-order` - Create Razorpay order
- `POST /payments/verify` - Verify payment
- `GET /video/appointment/:id/meet-link` - Get video link
- `GET /centres` - Get hospital centres
- `GET /patients/:id` - Get patient profile
- `PUT /patients/:id` - Update patient profile

### Authentication

The application uses JWT tokens stored in localStorage:

- `mibo_access_token` - Access token for API requests
- `mibo_refresh_token` - Refresh token
- `mibo_user` - User data

Tokens are automatically added to API requests via Axios interceptors.

## Testing

The project uses Vitest and React Testing Library for testing.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Open Vitest UI
npm run test:ui
```

### Test Coverage

```bash
npm run test:run -- --coverage
```

## Deployment

### Deploy to GitHub Pages

```bash
npm run deploy
```

### Deploy to Other Platforms

1. Build the project: `npm run build`
2. Upload the `dist` directory to your hosting provider
3. Configure environment variables on your hosting platform
4. Ensure the backend API URL is correctly set

## Environment Variables

| Variable               | Description          | Example                     |
| ---------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL`    | Backend API base URL | `http://localhost:5000/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key  | `rzp_test_xxxxx`            |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the backend:

1. Verify the backend is running on the correct port
2. Check `VITE_API_BASE_URL` in your `.env` file
3. Ensure CORS is properly configured on the backend
4. Check browser console for error messages

### Payment Integration Issues

If Razorpay checkout is not working:

1. Verify `VITE_RAZORPAY_KEY_ID` is correct
2. Check that Razorpay script is loaded in `index.html`
3. Ensure you're using test keys in development
4. Check browser console for Razorpay errors

### Build Issues

If the build fails:

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Ensure all environment variables are set
4. Check for TypeScript errors: `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, please contact the Mibo Mental Health technical team.

---

Built with ❤️ by the Mibo Mental Health Team
