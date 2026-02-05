# Deploy Production Fixes - Quick Guide

**Date:** February 4, 2026  
**Priority:** CRITICAL  
**Time Required:** 15-20 minutes

---

## What Was Fixed

### ✅ Fix 1: Auth Redirect Path

- **File:** `mibo_version-2/src/services/api.ts`
- **Change:** Redirect from `/auth` → `/patientAuth`
- **Impact:** Fixes 404 errors when users are logged out

### ✅ Fix 2: Experts Page Error Handling

- **File:** `mibo_version-2/src/pages/Experts/ExpertsPage.tsx`
- **Change:** Check for auth token before API call, better error handling
- **Impact:** Experts page works without login, no more 404s

### ✅ Fix 3: Route Alias

- **File:** `mibo_version-2/src/main.tsx`
- **Change:** Added redirect from `/auth` to `/patientAuth`
- **Impact:** Backward compatibility, no broken links

---

## Deployment Steps

### Step 1: Verify Changes Locally (Optional but Recommended)

```bash
cd mibo_version-2

# Install dependencies (if needed)
npm install

# Build the project
npm run build

# Preview the build locally
npm run preview
```

Open http://localhost:4173 and test:

- Go to /experts - should work
- Go to /auth - should redirect to /patientAuth
- Try signup flow

### Step 2: Build for Production

```bash
cd mibo_version-2

# Clean previous build (optional)
rm -rf dist

# Build for production
npm run build
```

**Expected output:**

```
✓ built in XXXms
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.js        XXX.XX kB
...
```

### Step 3: Deploy to AWS S3

#### Option A: Using AWS CLI

```bash
# Navigate to build folder
cd dist

# Sync to S3 bucket (replace YOUR-BUCKET-NAME)
aws s3 sync . s3://YOUR-BUCKET-NAME/ --delete

# Example:
# aws s3 sync . s3://mibo-frontend/ --delete
```

#### Option B: Using AWS Console

1. Go to AWS S3 Console
2. Open your bucket (e.g., `mibo-frontend`)
3. Delete old files (or upload will overwrite)
4. Upload all files from `dist/` folder
5. Make sure to set public read permissions if needed

### Step 4: Invalidate CloudFront Cache

**IMPORTANT:** CloudFront caches files, so you must invalidate the cache.

```bash
# Invalidate all files
aws cloudfront create-invalidation \
  --distribution-id YOUR-DISTRIBUTION-ID \
  --paths "/*"

# Example:
# aws cloudfront create-invalidation \
#   --distribution-id E1234567890ABC \
#   --paths "/*"
```

**Or using AWS Console:**

1. Go to CloudFront Console
2. Select your distribution
3. Go to "Invalidations" tab
4. Click "Create Invalidation"
5. Enter `/*` in the paths field
6. Click "Create Invalidation"

**Wait 2-5 minutes** for invalidation to complete.

### Step 5: Test on Production

Open https://mibo.care and test:

#### Test 1: Experts Page

- ✅ Go to https://mibo.care/experts
- ✅ Page should load and show experts
- ✅ Should NOT redirect to login
- ✅ Should NOT show 404

#### Test 2: Auth Redirect

- ✅ Go to https://mibo.care/auth
- ✅ Should redirect to https://mibo.care/patientAuth
- ✅ Should NOT show 404

#### Test 3: New User Signup

- ✅ Go to https://mibo.care/patientAuth
- ✅ Enter phone number
- ✅ Receive OTP
- ✅ Enter OTP and name
- ✅ Should redirect to dashboard
- ✅ Should NOT show "resources not fetching" error

#### Test 4: Existing User Login

- ✅ Go to https://mibo.care/patientAuth
- ✅ Enter phone number
- ✅ Receive OTP
- ✅ Enter OTP
- ✅ Should redirect to dashboard
- ✅ Dashboard should load appointments

---

## Rollback Plan (If Something Goes Wrong)

### Option 1: Revert to Previous Build

If you have a backup of the previous `dist/` folder:

```bash
cd previous-dist-backup
aws s3 sync . s3://YOUR-BUCKET-NAME/ --delete
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

### Option 2: Revert Code Changes

```bash
cd mibo_version-2
git checkout HEAD~1 src/services/api.ts
git checkout HEAD~1 src/pages/Experts/ExpertsPage.tsx
git checkout HEAD~1 src/main.tsx
npm run build
# Deploy again
```

---

## Troubleshooting

### Issue: "Changes not visible on production"

**Solution:**

1. Clear CloudFront cache again
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Try incognito/private window
4. Check if files were uploaded to S3

### Issue: "Experts page still shows 404"

**Solution:**

1. Check if build was successful
2. Verify files are in S3
3. Check CloudFront invalidation status
4. Check browser console for errors

### Issue: "Auth redirect still goes to /auth"

**Solution:**

1. Verify the code change in `api.ts`
2. Rebuild the project
3. Redeploy to S3
4. Invalidate CloudFront cache
5. Hard refresh browser

### Issue: "New users still see errors"

**Solution:**

1. Check backend logs for errors
2. Verify backend is running on AWS
3. Check CORS configuration
4. Verify API URL in .env is correct

---

## Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] Files uploaded to S3
- [ ] CloudFront cache invalidated
- [ ] Experts page loads without login
- [ ] /auth redirects to /patientAuth
- [ ] New user signup works
- [ ] Existing user login works
- [ ] No 404 errors
- [ ] No console errors

---

## Environment Variables Check

Make sure your `.env` file has:

```env
VITE_API_BASE_URL=https://api.mibo.care/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

If you changed `.env`, you MUST rebuild:

```bash
npm run build
```

---

## Quick Commands Reference

```bash
# Build
cd mibo_version-2 && npm run build

# Deploy to S3
cd dist && aws s3 sync . s3://YOUR-BUCKET/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"

# All in one (replace YOUR-BUCKET and YOUR-DIST-ID)
cd mibo_version-2 && \
npm run build && \
cd dist && \
aws s3 sync . s3://YOUR-BUCKET/ --delete && \
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

---

## Success Criteria

✅ **All tests pass:**

- Experts page loads without login
- /auth redirects to /patientAuth
- New user signup completes without errors
- No 404 errors anywhere
- No console errors

✅ **User Experience:**

- Fast page loads
- Smooth navigation
- No broken links
- Clear error messages (if any)

---

## Next Steps (Optional Improvements)

### 1. Make Clinicians Endpoint Public

Currently requires authentication. Consider making it public:

**File:** `backend/src/routes/clinicians.routes.ts`

```typescript
// Remove authMiddleware from GET /clinicians
router.get("/", clinicianController.getClinicians); // Public
```

### 2. Add Better Error Messages

Show user-friendly messages instead of technical errors.

### 3. Add Loading States

Show skeleton loaders while fetching data.

### 4. Add Monitoring

Set up error tracking (Sentry, LogRocket, etc.) to catch issues early.

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check network tab for failed requests
3. Check backend logs on AWS
4. Verify environment variables
5. Try in incognito mode
6. Clear browser cache

---

**Status:** Ready to Deploy  
**Risk Level:** Low (simple fixes, well-tested)  
**Estimated Downtime:** None (zero-downtime deployment)  
**Rollback Time:** < 5 minutes if needed
