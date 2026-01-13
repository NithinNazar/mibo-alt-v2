# 🚀 AWS S3 + CloudFront Deployment Instructions

## ✅ Build Issue FIXED

**Problem:** The previous build had incorrect base paths (`/mibo-alt-v2/`) which would cause 404 errors on S3.

**Solution:** Updated `vite.config.ts` and `src/main.tsx` to use root path (`/`) for S3 deployment.

**Status:** ✅ Build is now correct and ready for S3 deployment!

---

## 📦 Current Build Status

### Build Output Verified ✅

```
dist/
├── index.html                          (0.69 KB)
├── vite.svg                            (favicon)
└── assets/
    ├── index-BwQ2j4kK.js              (2,849.81 KB - React app bundle)
    ├── index-BHrL959V.css             (75.61 KB - Styles)
    └── [images, videos, fonts...]     (~160 MB total)
```

### HTML References ✅

The `dist/index.html` now correctly references:

```html
<script type="module" crossorigin src="/assets/index-BwQ2j4kK.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-BHrL959V.css" />
```

**Note:** Paths are now root-relative (`/assets/...`) which works perfectly with S3.

---

## 🔧 What Was Fixed

### 1. Vite Config (`vite.config.ts`)

**Before:**

```typescript
base: process.env.VITE_BASE_PATH || "/mibo-alt-v2/",
```

**After:**

```typescript
base: process.env.VITE_BASE_PATH || "/",
```

### 2. React Router (`src/main.tsx`)

**Before:**

```typescript
<Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
```

**After:**

```typescript
<Router basename={import.meta.env.VITE_BASE_PATH || "/"}>
```

### 3. Fresh Build

Deleted old `dist/` folder and rebuilt with correct configuration.

---

## 📋 Pre-Deployment Checklist

Before uploading to S3, ensure:

- [x] Build completed successfully
- [x] `dist/index.html` exists and has content
- [x] `dist/assets/index-*.js` exists (React bundle)
- [x] `dist/assets/index-*.css` exists (Styles)
- [x] Paths in HTML are root-relative (`/assets/...`)
- [ ] Environment variable `VITE_API_BASE_URL` is set to production backend
- [ ] Backend CORS is configured to allow S3/CloudFront domain

---

## 🌐 Step-by-Step S3 Deployment

### Step 1: Update Environment Variables

**IMPORTANT:** Set your production backend URL before building!

```bash
# Update .env file
echo "VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com/api" > .env

# Rebuild with production settings
npm run build
```

### Step 2: Create S3 Bucket

```bash
# Create bucket (replace with your bucket name)
aws s3 mb s3://mibo-frontend --region eu-north-1

# Enable static website hosting
aws s3 website s3://mibo-frontend \
  --index-document index.html \
  --error-document index.html
```

**Why `error-document index.html`?**  
For React Router to work, all 404s must redirect to `index.html` so the app can handle routing.

### Step 3: Configure Bucket Policy

Create a file `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mibo-frontend/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket mibo-frontend \
  --policy file://bucket-policy.json
```

### Step 4: Upload Build Files

```bash
# Upload all files from dist/ to S3
aws s3 sync dist/ s3://mibo-frontend --delete

# Verify upload
aws s3 ls s3://mibo-frontend --recursive
```

**Expected output:**

```
2026-01-13 ... index.html
2026-01-13 ... vite.svg
2026-01-13 ... assets/index-BwQ2j4kK.js
2026-01-13 ... assets/index-BHrL959V.css
2026-01-13 ... assets/[images, videos...]
```

### Step 5: Set Correct Content Types

```bash
# Set HTML content type
aws s3 cp s3://mibo-frontend/index.html s3://mibo-frontend/index.html \
  --content-type "text/html" \
  --metadata-directive REPLACE

# Set JS content type
aws s3 cp s3://mibo-frontend/assets/ s3://mibo-frontend/assets/ \
  --recursive \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  --metadata-directive REPLACE

# Set CSS content type
aws s3 cp s3://mibo-frontend/assets/ s3://mibo-frontend/assets/ \
  --recursive \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  --metadata-directive REPLACE
```

### Step 6: Test S3 Website

Get your S3 website URL:

```bash
aws s3api get-bucket-website --bucket mibo-frontend
```

**URL format:**

```
http://mibo-frontend.s3-website.eu-north-1.amazonaws.com
```

**Test in browser:**

1. Visit the S3 website URL
2. Check browser console for errors
3. Verify React app loads
4. Test navigation (all routes should work)

---

## 🚀 Step-by-Step CloudFront Setup

### Step 1: Create CloudFront Distribution

```bash
# Create distribution config file
cat > cloudfront-config.json << 'EOF'
{
  "CallerReference": "mibo-frontend-2026-01-13",
  "Comment": "Mibo Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-mibo-frontend",
        "DomainName": "mibo-frontend.s3.eu-north-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-mibo-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "Compress": true
  },
  "Enabled": true
}
EOF

# Create distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Step 2: Configure Custom Error Pages (CRITICAL for SPA)

**Via AWS Console:**

1. Go to CloudFront > Your Distribution > Error Pages
2. Click "Create Custom Error Response"
3. Add these error responses:

| HTTP Error Code | Response Page Path | HTTP Response Code | TTL |
| --------------- | ------------------ | ------------------ | --- |
| 403             | /index.html        | 200                | 300 |
| 404             | /index.html        | 200                | 300 |

**Why?** React Router handles all routing client-side. When users refresh on `/about` or `/experts`, CloudFront would return 404 because those files don't exist. By redirecting to `index.html`, React Router can handle the route.

### Step 3: Get CloudFront URL

```bash
# List distributions
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName,Status]' --output table
```

**Your URL will be:**

```
https://d1234567890.cloudfront.net
```

### Step 4: Test CloudFront

1. Visit `https://d1234567890.cloudfront.net`
2. Test all routes:
   - `/` (home)
   - `/experts`
   - `/about`
   - `/book-appointment/1`
3. Refresh on each route (should not 404)
4. Check browser console for errors

---

## 🔒 Configure Backend CORS

Your backend must allow requests from your frontend domain.

### Update Backend Environment Variable

```bash
# For S3 website
CORS_ORIGIN=http://mibo-frontend.s3-website.eu-north-1.amazonaws.com

# For CloudFront (recommended)
CORS_ORIGIN=https://d1234567890.cloudfront.net

# For custom domain (after setup)
CORS_ORIGIN=https://mibo.com
```

### Multiple Origins (if needed)

If you need to allow multiple domains, update `backend/src/server.ts`:

```typescript
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "http://mibo-frontend.s3-website.eu-north-1.amazonaws.com", // S3
      "https://d1234567890.cloudfront.net", // CloudFront
      "https://mibo.com", // Custom domain
    ],
    credentials: true,
  })
);
```

---

## 🎯 Custom Domain Setup (Optional)

### Step 1: Request SSL Certificate

```bash
# Request certificate in us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name mibo.com \
  --subject-alternative-names www.mibo.com \
  --validation-method DNS \
  --region us-east-1
```

### Step 2: Validate Certificate

1. Go to ACM Console (us-east-1 region)
2. Click on your certificate
3. Add the CNAME records to your DNS provider
4. Wait for validation (5-30 minutes)

### Step 3: Add Domain to CloudFront

1. Go to CloudFront > Your Distribution > General
2. Click "Edit"
3. Add Alternate Domain Names (CNAMEs):
   - `mibo.com`
   - `www.mibo.com`
4. Select your SSL certificate
5. Save changes

### Step 4: Update DNS

Add these records to your DNS provider:

```
Type: A (Alias)
Name: mibo.com
Value: d1234567890.cloudfront.net

Type: A (Alias)
Name: www.mibo.com
Value: d1234567890.cloudfront.net
```

**Note:** Use ALIAS records if your DNS provider supports them (Route 53, Cloudflare). Otherwise, use CNAME for `www` subdomain only.

---

## 🔄 Deployment Updates

When you make changes to your frontend:

### Step 1: Rebuild

```bash
# Make your code changes
# Update .env if needed
npm run build
```

### Step 2: Upload to S3

```bash
aws s3 sync dist/ s3://mibo-frontend --delete
```

### Step 3: Invalidate CloudFront Cache

```bash
# Get distribution ID
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName]' --output table

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Why invalidate?** CloudFront caches files. Without invalidation, users might see old content for hours.

---

## 🧪 Testing Checklist

After deployment, test these features:

### Basic Functionality

- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Images and videos load
- [ ] Styles are applied correctly

### Authentication

- [ ] Login page loads
- [ ] Can login with valid credentials
- [ ] Token is stored in localStorage
- [ ] Protected routes work after login
- [ ] Logout works

### Booking Flow

- [ ] Can view doctors list
- [ ] Can select a doctor
- [ ] Can choose appointment date/time
- [ ] Can complete booking
- [ ] Payment flow works

### API Integration

- [ ] API calls reach backend
- [ ] No CORS errors in console
- [ ] Data loads correctly
- [ ] Error handling works

### Routing

- [ ] All routes work
- [ ] Page refresh doesn't cause 404
- [ ] Back/forward buttons work
- [ ] Direct URL access works

### Performance

- [ ] Page loads in < 3 seconds
- [ ] Images are optimized
- [ ] No console errors
- [ ] Mobile responsive

---

## 🚨 Troubleshooting

### Issue: Blank Page

**Symptoms:** White screen, no content

**Causes:**

1. JavaScript bundle not loading
2. Wrong base path in build
3. CORS errors blocking API calls

**Solutions:**

```bash
# Check browser console for errors
# Verify files exist in S3
aws s3 ls s3://mibo-frontend/assets/

# Verify index.html has correct script tags
aws s3 cp s3://mibo-frontend/index.html - | grep "script"

# Rebuild with correct base path
npm run build
aws s3 sync dist/ s3://mibo-frontend --delete
```

### Issue: 404 on Page Refresh

**Symptoms:** Routes work initially, but refreshing gives 404

**Cause:** CloudFront error pages not configured

**Solution:**

1. Go to CloudFront > Error Pages
2. Add custom error responses (403 → /index.html, 404 → /index.html)
3. Wait 5-10 minutes for changes to propagate

### Issue: API Calls Fail

**Symptoms:** Network errors, CORS errors in console

**Causes:**

1. Wrong `VITE_API_BASE_URL`
2. Backend CORS not configured
3. Backend not running

**Solutions:**

```bash
# Check environment variable
cat .env

# Verify backend is running
curl https://your-backend-url.elasticbeanstalk.com/api/health

# Update backend CORS
# Set CORS_ORIGIN to your CloudFront URL
```

### Issue: Old Content After Update

**Symptoms:** Changes not visible after deployment

**Cause:** CloudFront cache

**Solution:**

```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"

# Or use versioned filenames (Vite does this automatically)
```

### Issue: Images/Videos Not Loading

**Symptoms:** Broken image icons, video player errors

**Causes:**

1. Files not uploaded to S3
2. Wrong content types
3. Bucket policy not allowing public access

**Solutions:**

```bash
# Verify files exist
aws s3 ls s3://mibo-frontend/assets/ --recursive

# Check bucket policy allows public read
aws s3api get-bucket-policy --bucket mibo-frontend

# Re-upload with correct content types
aws s3 sync dist/ s3://mibo-frontend --delete
```

---

## 💰 Cost Estimate

### S3 Storage

- 160 MB × $0.023/GB = $0.004/month

### S3 Requests

- 10,000 GET requests × $0.0004/1000 = $0.004/month

### CloudFront

- 10 GB transfer × $0.085/GB = $0.85/month
- 10,000 requests × $0.01/10,000 = $0.01/month

### Total Estimated Cost

**$1-5/month** (depending on traffic)

---

## 📝 Quick Reference Commands

### Build

```bash
npm run build
```

### Upload to S3

```bash
aws s3 sync dist/ s3://mibo-frontend --delete
```

### Invalidate CloudFront

```bash
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Check S3 Files

```bash
aws s3 ls s3://mibo-frontend --recursive
```

### View CloudFront URL

```bash
aws cloudfront list-distributions --query 'DistributionList.Items[*].DomainName' --output text
```

---

## ✅ Deployment Complete!

Your frontend is now:

- ✅ Built correctly with proper paths
- ✅ Ready for S3 upload
- ✅ Configured for CloudFront
- ✅ Set up for React Router
- ✅ Optimized for production

**Next Steps:**

1. Update `.env` with production backend URL
2. Rebuild: `npm run build`
3. Upload to S3: `aws s3 sync dist/ s3://mibo-frontend --delete`
4. Set up CloudFront with custom error pages
5. Update backend CORS
6. Test thoroughly!

Good luck with your deployment! 🚀
