# Vercel Deployment Guide - Frontend

## Overview

This guide explains how to deploy the Mibo Mental Health frontend to Vercel and configure it to work with the Render backend.

## Prerequisites

- Backend deployed on Render at `https://mibo-backend.onrender.com`
- Vercel account
- GitHub repository connected to Vercel

## Critical Configuration

### 1. Environment Variables in Vercel

You MUST set these environment variables in your Vercel project settings:

#### Required Variables:

**VITE_API_BASE_URL**

```
https://mibo-backend.onrender.com/api
```

⚠️ **CRITICAL**: Must include `/api` suffix because backend routes are mounted under `/api` prefix

**VITE_RAZORPAY_KEY_ID**

```
rzp_test_xxxxx  (for test mode)
rzp_live_xxxxx  (for production)
```

Get your key from: https://dashboard.razorpay.com/app/keys

### 2. How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add each variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://mibo-backend.onrender.com/api`
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Repeat for `VITE_RAZORPAY_KEY_ID`

### 3. Trigger Redeployment

After setting environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

## How It Works

### API Client Configuration

The frontend uses a centralized Axios instance (`src/services/api.ts`) that:

- Reads `VITE_API_BASE_URL` from environment variables
- Automatically adds `/api` prefix to all API calls
- Includes JWT token in Authorization header
- Handles 401 errors by redirecting to login

### Example API Calls

All service methods use relative paths:

```typescript
// authService.ts
await apiClient.post("/patient-auth/send-otp", { phone });
// Actual URL: https://mibo-backend.onrender.com/api/patient-auth/send-otp

// bookingService.ts
await apiClient.post("/booking/create", data);
// Actual URL: https://mibo-backend.onrender.com/api/booking/create

// patientDashboardService.ts
await apiClient.get("/patient/dashboard");
// Actual URL: https://mibo-backend.onrender.com/api/patient/dashboard
```

## Backend CORS Configuration

The backend must allow requests from your Vercel domain. Update backend `.env`:

```env
# Backend .env on Render
FRONTEND_URL=https://your-app.vercel.app
```

The backend CORS middleware will automatically allow:

- Credentials (cookies, authorization headers)
- All standard HTTP methods
- Requests from the specified frontend URL

## Troubleshooting

### Issue: 404 Not Found on API Calls

**Cause**: Missing `/api` prefix in `VITE_API_BASE_URL`
**Solution**: Ensure environment variable is `https://mibo-backend.onrender.com/api` (with `/api`)

### Issue: CORS Error

**Cause**: Backend not allowing requests from Vercel domain
**Solution**:

1. Check backend `FRONTEND_URL` environment variable on Render
2. Ensure it matches your Vercel deployment URL exactly
3. Redeploy backend after updating

### Issue: 401 Unauthorized

**Cause**: JWT token not being sent or invalid
**Solution**:

1. Check browser localStorage for `mibo_access_token`
2. Verify token is being added to Authorization header (check Network tab)
3. Ensure backend JWT_SECRET matches

### Issue: Environment Variables Not Working

**Cause**: Variables not set correctly or deployment not triggered
**Solution**:

1. Verify variables are set in Vercel dashboard
2. Check variable names start with `VITE_` (required for Vite)
3. Trigger a new deployment after setting variables
4. Check build logs for environment variable values

## Verification Steps

After deployment, verify everything works:

1. **Open Vercel deployment URL**

   - Should load without errors

2. **Test Authentication Flow**

   - Go to Sign In page
   - Enter phone number
   - Check Network tab: Should see POST to `https://mibo-backend.onrender.com/api/patient-auth/send-otp`
   - Should receive OTP via WhatsApp

3. **Test Booking Flow**

   - Complete authentication
   - Try to book an appointment
   - Check Network tab: All API calls should go to `https://mibo-backend.onrender.com/api/*`

4. **Check Console for Errors**
   - Open browser DevTools Console
   - Should see no CORS errors
   - Should see no 404 errors

## Local Development

For local development, use `.env` file:

```env
# .env (local development)
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

This allows you to test against local backend while production uses Render backend.

## Build Command

Vercel automatically detects Vite and uses:

```bash
npm run build
```

## Output Directory

```
dist
```

## Node Version

Ensure `package.json` specifies Node version:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Summary

✅ **What's Already Done:**

- API client configured to use environment variables
- All API calls use relative paths (no hardcoded URLs)
- Automatic JWT token injection
- Error handling and redirects

✅ **What You Need to Do:**

1. Set `VITE_API_BASE_URL=https://mibo-backend.onrender.com/api` in Vercel
2. Set `VITE_RAZORPAY_KEY_ID` in Vercel
3. Redeploy on Vercel
4. Update backend `FRONTEND_URL` to match Vercel URL
5. Test the deployment

That's it! Your frontend will now correctly communicate with the Render backend.
