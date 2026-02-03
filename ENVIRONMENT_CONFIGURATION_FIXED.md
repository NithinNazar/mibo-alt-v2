# Environment Configuration Fixed ✅

## Date: January 30, 2026

## Issue Identified

The admin panel was failing to connect to the backend API because the `.env` file was configured to use `http://localhost:5000/api`, which works during local development but fails when deployed to production (https://mibo.care/admin). When users accessed the deployed admin panel, their browsers tried to connect to their own local machines, resulting in `ERR_CONNECTION_REFUSED` errors.

## Solution Implemented

Both the **frontend** and **admin panel** were already properly configured to use environment variables via `import.meta.env.VITE_API_BASE_URL`. The issue was simply that the `.env` files were pointing to localhost instead of the production backend.

---

## Changes Made

### 1. Admin Panel (mibo-admin)

#### Updated Files:

- **`.env`** - Changed to production URL
- **`.env.development`** - Created for local development
- **`.env.production`** - Created for production builds

#### Configuration:

**Production (`.env` and `.env.production`):**

```env
VITE_API_BASE_URL=https://api.mibo.care/api
```

**Development (`.env.development`):**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Frontend (mibo_version-2)

#### Updated Files:

- **`.env`** - Changed to production URL
- **`.env.development`** - Created for local development
- **`.env.production`** - Created for production builds

#### Configuration:

**Production (`.env` and `.env.production`):**

```env
VITE_API_BASE_URL=https://api.mibo.care/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

**Development (`.env.development`):**

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## How It Works

### Code Implementation

Both projects use the same pattern in their `api.ts` files:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  // ... other config
});
```

This means:

1. **If `VITE_API_BASE_URL` is set** → Use that URL
2. **If not set** → Fall back to `http://localhost:5000/api`

### Environment File Priority

Vite automatically loads environment files in this order:

1. `.env.production` (when running `npm run build`)
2. `.env.development` (when running `npm run dev`)
3. `.env` (always loaded, lowest priority)

---

## Usage Instructions

### For Local Development

1. **Start backend locally:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend/admin in development mode:**

   ```bash
   # Frontend
   cd mibo_version-2
   npm run dev

   # Admin Panel
   cd mibo-admin
   npm run dev
   ```

The `.env.development` files will automatically be used, pointing to `http://localhost:5000/api`.

### For Production Deployment

1. **Build the projects:**

   ```bash
   # Frontend
   cd mibo_version-2
   npm run build

   # Admin Panel
   cd mibo-admin
   npm run build
   ```

The `.env.production` files will automatically be used, pointing to `https://api.mibo.care/api`.

2. **Deploy the `dist/` folders** to your hosting service (S3, Vercel, etc.)

---

## Backend URLs

The backend is accessible at:

- **Production API**: `https://api.mibo.care/api`
- **AWS Elastic Beanstalk**: `http://mibo-backend-env.eba-wshqpsq2.eu-north-1.elasticbeanstalk.com`
- **Local Development**: `http://localhost:5000/api`

---

## Verification

### Test Admin Panel Login

1. **Open**: https://mibo.care/admin
2. **Login with admin credentials**
3. **Check browser console** - Should see API calls to `https://api.mibo.care/api/auth/login`
4. **No more `ERR_CONNECTION_REFUSED` errors**

### Test Frontend

1. **Open**: https://mibo.care
2. **Browse clinicians or book appointment**
3. **Check browser console** - Should see API calls to `https://api.mibo.care/api`

---

## Important Notes

### Razorpay Keys

The frontend uses Razorpay for payments. Make sure to:

- Use **TEST keys** (`rzp_test_xxxxx`) in development
- Use **LIVE keys** (`rzp_live_xxxxx`) in production
- Update the keys in `.env.production` before deploying

### Rebuilding After Changes

**Important**: Environment variables are embedded at **build time**, not runtime. If you change any `.env` file, you must rebuild:

```bash
npm run build
```

Then redeploy the new `dist/` folder.

### Security

- **Never commit** `.env` files with real API keys to Git
- The `.env` files are already in `.gitignore`
- Use `.env.example` files to document required variables without exposing secrets

---

## Status

✅ **Admin Panel** - Now points to production API
✅ **Frontend** - Now points to production API
✅ **Environment Files** - Created for both development and production
✅ **Documentation** - Complete usage instructions provided

The admin panel login should now work correctly when deployed to production!
