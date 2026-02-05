# Production Bugs Fix - AWS Deployment

**Date:** February 4, 2026  
**Environment:** Production (AWS)  
**Status:** Issues Identified - Fixes Required

---

## Issues Identified

### 1. ❌ New User Signup - "Resources Not Fetching" Error

**Symptom:** After OTP verification, new users see "resources not fetching" error  
**Root Cause:** 401 redirect goes to `/auth` but route is `/patientAuth`

### 2. ❌ Experts Page - 404 and Display Issues

**Symptom:** `/experts` page sometimes shows 404, sometimes doesn't show experts  
**Root Cause:** Multiple issues:

- API call to `/clinicians` might be failing (401 unauthorized)
- Fallback to static data not working properly
- Redirect to `/auth` on API failure

### 3. ❌ Auth Redirect Mismatch

**Symptom:** Users redirected to `mibo.care/auth` which doesn't exist  
**Root Cause:** API interceptor redirects to `/auth` but route is `/patientAuth`

---

## Fixes Required

### Fix 1: Update API Interceptor Redirect Path ✅

**File:** `mibo_version-2/src/services/api.ts`

**Current Code (Line 98):**

```typescript
if (!window.location.pathname.includes("/auth")) {
  window.location.href = "/auth";
}
```

**Fixed Code:**

```typescript
if (!window.location.pathname.includes("/patientAuth")) {
  window.location.href = "/patientAuth";
}
```

**Why:** The route is `/patientAuth` not `/auth`, so redirects were going to a 404 page.

---

### Fix 2: Improve Experts Page Error Handling ✅

**File:** `mibo_version-2/src/pages/Experts/ExpertsPage.tsx`

**Issue:** When API fails with 401, it tries to redirect but doesn't handle the error gracefully.

**Current Code (Line 33-50):**

```typescript
const fetchClinicians = async () => {
  try {
    setLoading(true);
    const clinicians = await clinicianService.getClinicians();

    if (clinicians.length === 0) {
      console.log("No clinicians in database, using static data");
      setDoctors(staticDoctors);
    } else {
      // Transform backend data...
      setDoctors(transformedDoctors);
    }
  } catch (error) {
    console.error("Failed to fetch clinicians, using static data:", error);
    setDoctors(staticDoctors);
  } finally {
    setLoading(false);
  }
};
```

**Fixed Code:**

```typescript
const fetchClinicians = async () => {
  try {
    setLoading(true);

    // Check if user is authenticated before making API call
    const token = localStorage.getItem("mibo_access_token");

    if (!token) {
      // No token, use static data immediately
      console.log("No authentication token, using static data");
      setDoctors(staticDoctors);
      setLoading(false);
      setIsReady(true);
      return;
    }

    const clinicians = await clinicianService.getClinicians();

    if (clinicians.length === 0) {
      console.log("No clinicians in database, using static data");
      setDoctors(staticDoctors);
    } else {
      // Transform backend data...
      setDoctors(transformedDoctors);
      console.log(
        `Loaded ${transformedDoctors.length} clinicians from backend`,
      );
    }
  } catch (error: any) {
    console.error("Failed to fetch clinicians:", error);

    // Check if it's an auth error
    if (error.response?.status === 401) {
      console.log("Authentication failed, using static data");
    }

    // Always fallback to static data on error
    setDoctors(staticDoctors);
  } finally {
    setLoading(false);
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }
};
```

**Why:**

- Checks for token before making API call
- Handles 401 errors gracefully
- Always falls back to static data
- Doesn't break the page on API failure

---

### Fix 3: Make Experts Page Public (No Auth Required) ✅

**Option A: Remove Auth Requirement from Clinicians Endpoint**

**File:** `backend/src/routes/clinicians.routes.ts` (or similar)

Change from:

```typescript
router.get("/", authMiddleware, clinicianController.getClinicians);
```

To:

```typescript
router.get("/", clinicianController.getClinicians); // Public endpoint
```

**Why:** The experts page should be publicly accessible without login.

**Option B: Make API Call Optional**

Keep the experts page working with static data only, and only fetch from API if user is logged in.

---

### Fix 4: Add Route Alias for /auth ✅

**File:** `mibo_version-2/src/main.tsx`

**Add this route:**

```typescript
{/* Auth aliases - redirect /auth to /patientAuth */}
<Route path="/auth" element={<Navigate to="/patientAuth" replace />} />
<Route path="/patientAuth" element={<PatientAuth />} />
```

**Why:** Provides backward compatibility and prevents 404 errors.

---

### Fix 5: Improve New User Signup Flow ✅

**File:** `mibo_version-2/src/pages/auth/PatientAuth.tsx`

**Issue:** After successful OTP verification, if API calls fail, user sees errors.

**Add Error Boundary:**

```typescript
// After successful login (line 105)
setTimeout(() => {
  try {
    navigate("/profileDashboard");
  } catch (error) {
    console.error("Navigation error:", error);
    // Fallback: reload page
    window.location.href = "/profileDashboard";
  }
}, 1000);
```

---

## Implementation Steps

### Step 1: Fix API Interceptor Redirect

```bash
cd mibo_version-2
# Edit src/services/api.ts
# Change line 98: "/auth" -> "/patientAuth"
```

### Step 2: Fix Experts Page

```bash
# Edit src/pages/Experts/ExpertsPage.tsx
# Update fetchClinicians function with improved error handling
```

### Step 3: Add Route Alias

```bash
# Edit src/main.tsx
# Add redirect route from /auth to /patientAuth
```

### Step 4: Rebuild Frontend

```bash
npm run build
```

### Step 5: Deploy to AWS

```bash
# Upload dist/ folder to S3
# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Step 6: (Optional) Make Clinicians Endpoint Public

```bash
cd backend
# Edit routes file to remove authMiddleware from GET /clinicians
# Redeploy backend to AWS Elastic Beanstalk
```

---

## Testing Checklist

### Test 1: New User Signup

- [ ] Go to mibo.care/patientAuth
- [ ] Enter phone number
- [ ] Receive OTP via WhatsApp
- [ ] Enter OTP and name
- [ ] Should redirect to dashboard without errors
- [ ] Dashboard should load (even if empty)

### Test 2: Experts Page (Not Logged In)

- [ ] Go to mibo.care/experts
- [ ] Page should load and show experts
- [ ] Should use static data if API fails
- [ ] Should NOT redirect to login
- [ ] Should NOT show 404

### Test 3: Experts Page (Logged In)

- [ ] Login first
- [ ] Go to mibo.care/experts
- [ ] Should load experts from API
- [ ] Should show real clinician data
- [ ] Filters should work

### Test 4: Auth Redirect

- [ ] Try accessing protected page without login
- [ ] Should redirect to /patientAuth
- [ ] Should NOT redirect to /auth (404)

---

## Root Cause Analysis

### Why These Bugs Exist:

1. **Route Mismatch:**
   - Code uses `/auth` in multiple places
   - Actual route is `/patientAuth`
   - No redirect or alias configured

2. **Auth Required for Public Page:**
   - Experts page makes API call to `/clinicians`
   - Endpoint requires authentication
   - Should be public or have better fallback

3. **Poor Error Handling:**
   - API failures cause page to break
   - No graceful degradation
   - Static data fallback not working properly

4. **Inconsistent Naming:**
   - Route: `/patientAuth`
   - Redirect: `/auth`
   - No consistency across codebase

---

## Prevention Measures

### 1. Consistent Route Naming

- Use `/auth` everywhere OR `/patientAuth` everywhere
- Add route aliases for backward compatibility
- Document all routes in one place

### 2. Public vs Protected Routes

- Clearly mark which routes require auth
- Make public pages work without API calls
- Add proper fallbacks for API failures

### 3. Better Error Handling

- Catch all API errors
- Provide user-friendly messages
- Log errors for debugging
- Don't break the page on errors

### 4. Testing Before Deployment

- Test all routes
- Test with and without authentication
- Test API failures
- Test on production-like environment

---

## Quick Fix (Immediate)

If you need a quick fix right now without rebuilding:

### Option 1: Add Redirect Rule (CloudFront/S3)

Add a redirect rule in CloudFront or S3:

- From: `/auth`
- To: `/patientAuth`
- Type: 301 Permanent Redirect

### Option 2: Update Backend CORS

Ensure backend allows requests from:

- `https://mibo.care`
- `https://www.mibo.care`

### Option 3: Make Clinicians Endpoint Public

Remove auth requirement from GET `/api/clinicians` endpoint.

---

## Files to Modify

### Frontend (mibo_version-2):

1. ✅ `src/services/api.ts` - Fix redirect path
2. ✅ `src/pages/Experts/ExpertsPage.tsx` - Improve error handling
3. ✅ `src/main.tsx` - Add route alias
4. ⚠️ `src/pages/auth/PatientAuth.tsx` - Add error boundary (optional)

### Backend (optional):

1. ⚠️ `src/routes/clinicians.routes.ts` - Make endpoint public (optional)

---

## Expected Behavior After Fix

### New User Signup:

1. User goes to mibo.care/patientAuth ✅
2. Enters phone and receives OTP ✅
3. Verifies OTP with name ✅
4. Redirects to dashboard ✅
5. Dashboard loads (may be empty for new user) ✅

### Experts Page:

1. User goes to mibo.care/experts ✅
2. Page loads immediately ✅
3. Shows static experts data ✅
4. If logged in, fetches real data from API ✅
5. Never shows 404 ✅
6. Never redirects to login ✅

### Auth Redirects:

1. Accessing protected page without login ✅
2. Redirects to /patientAuth ✅
3. Never redirects to /auth (404) ✅

---

## Deployment Checklist

- [ ] Update `src/services/api.ts` redirect path
- [ ] Update `src/pages/Experts/ExpertsPage.tsx` error handling
- [ ] Add route alias in `src/main.tsx`
- [ ] Run `npm run build` in mibo_version-2
- [ ] Test locally with `npm run preview`
- [ ] Upload dist/ to S3
- [ ] Invalidate CloudFront cache
- [ ] Test on production URL
- [ ] Verify new user signup works
- [ ] Verify experts page works
- [ ] Verify no 404 errors

---

**Priority:** HIGH  
**Impact:** Critical - Affects new user signups and main experts page  
**Effort:** Low - Simple code changes, rebuild, and redeploy  
**Time Estimate:** 30 minutes to fix, test, and deploy
