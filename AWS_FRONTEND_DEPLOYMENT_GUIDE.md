# 🚀 AWS Frontend Deployment Guide - Mibo Version 2

## ✅ AWS Compatibility Status: 100% COMPATIBLE

Your frontend application (`mibo_version-2`) is **fully compatible** with AWS and ready for deployment.

---

## 📋 Quick Summary

| Aspect                    | Status        | Details                                          |
| ------------------------- | ------------- | ------------------------------------------------ |
| **Build System**          | ✅ Ready      | Vite with production build                       |
| **Static Assets**         | ✅ Ready      | All assets bundled in `dist/`                    |
| **Environment Variables** | ✅ Ready      | 2 variables (both optional for basic deployment) |
| **AWS Services**          | ✅ Compatible | S3 + CloudFront, Amplify, or Elastic Beanstalk   |
| **Node.js Version**       | ✅ Compatible | Works with Node 18, 20, 22                       |
| **Build Output**          | ✅ Verified   | Successfully builds to `dist/` folder            |

---

## 🔧 Environment Variables

Your frontend uses **only 2 environment variables**, both prefixed with `VITE_`:

### 1. VITE_API_BASE_URL (Required)

**Purpose:** Backend API endpoint

**Current Value (Local):**

```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Production Value (AWS):**

```
VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com/api
```

**Important Notes:**

- ⚠️ Must include `/api` suffix
- ⚠️ Must use HTTPS in production
- ⚠️ Must match your actual backend URL
- ⚠️ No trailing slash

**Examples:**

```bash
# AWS Elastic Beanstalk
VITE_API_BASE_URL=https://mibo-backend.eu-north-1.elasticbeanstalk.com/api

# AWS API Gateway
VITE_API_BASE_URL=https://api.mibo.com/api

# Custom domain
VITE_API_BASE_URL=https://backend.mibo.com/api
```

### 2. VITE_RAZORPAY_KEY_ID (Optional)

**Purpose:** Razorpay payment integration (currently handled by backend)

**Current Value:**

```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

**Production Value:**

```
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

**Important Notes:**

- ⚠️ Currently NOT used in the frontend code
- ⚠️ All Razorpay operations are handled by backend
- ⚠️ Can be omitted for deployment
- ⚠️ If needed in future, switch to LIVE key for production

---

## 📦 Build Verification

### Build Command

```bash
npm run build
```

### Build Output

- ✅ Successfully builds in ~12 seconds
- ✅ Output directory: `dist/`
- ✅ Total size: ~160 MB (includes large images and videos)
- ✅ Main JS bundle: 2.85 MB (599 KB gzipped)
- ✅ CSS bundle: 75.61 KB (11.82 KB gzipped)

### Build Contents

```
dist/
├── index.html                 # Entry point
├── assets/
│   ├── index-DkMi-hm6.js     # Main JavaScript bundle
│   ├── index-BHrL959V.css    # Main CSS bundle
│   ├── *.png                  # Images
│   ├── *.jpg                  # Images
│   ├── *.gif                  # Animations
│   └── *.mp4                  # Videos
└── vite.svg                   # Favicon
```

---

## 🌐 AWS Deployment Options

### Option 1: AWS Amplify (Recommended - Easiest)

**Best for:** Quick deployment with CI/CD

**Steps:**

1. Push code to GitHub/GitLab/Bitbucket
2. Go to AWS Amplify Console
3. Click "New app" > "Host web app"
4. Connect your repository
5. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - "**/*"
     cache:
       paths:
         - node_modules/**/*
   ```
6. Add environment variables:
   - `VITE_API_BASE_URL` = Your backend URL
7. Deploy!

**Pros:**

- ✅ Automatic CI/CD
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Easy rollbacks
- ✅ Preview deployments for branches

**Cost:** ~$0.01 per build minute + $0.15/GB served

---

### Option 2: S3 + CloudFront (Recommended - Most Control)

**Best for:** Production with custom domain and full control

**Steps:**

#### Step 1: Build the Application

```bash
cd mibo_version-2
npm run build
```

#### Step 2: Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://mibo-frontend --region eu-north-1

# Enable static website hosting
aws s3 website s3://mibo-frontend \
  --index-document index.html \
  --error-document index.html
```

#### Step 3: Upload Build Files

```bash
# Upload dist folder
aws s3 sync dist/ s3://mibo-frontend --delete

# Set correct content types
aws s3 cp s3://mibo-frontend s3://mibo-frontend \
  --recursive \
  --metadata-directive REPLACE \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html"
```

#### Step 4: Create CloudFront Distribution

1. Go to CloudFront Console
2. Create distribution
3. Origin domain: Select your S3 bucket
4. Origin access: Origin access control (OAC)
5. Viewer protocol policy: Redirect HTTP to HTTPS
6. Allowed HTTP methods: GET, HEAD, OPTIONS
7. Cache policy: CachingOptimized
8. Custom error responses:
   - 403 → /index.html (200) - For SPA routing
   - 404 → /index.html (200) - For SPA routing

#### Step 5: Update Environment Variables

Before building, update `.env`:

```bash
VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com/api
```

Then rebuild and redeploy:

```bash
npm run build
aws s3 sync dist/ s3://mibo-frontend --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Pros:**

- ✅ Most cost-effective
- ✅ Highly scalable
- ✅ Full control
- ✅ Custom domain support

**Cost:** ~$0.023/GB + $0.01 per 10,000 requests

---

### Option 3: Elastic Beanstalk with Node.js

**Best for:** If you want backend and frontend on same platform

**Steps:**

1. Create `server.js` in `mibo_version-2/`:

```javascript
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist
app.use(express.static(path.join(__dirname, "dist")));

// Handle SPA routing - send all requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
```

2. Update `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "tsc -b && vite build"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

3. Create `.ebextensions/01_environment.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    VITE_API_BASE_URL: "https://your-backend-url.elasticbeanstalk.com/api"
```

4. Deploy:

```bash
npm install express
npm run build
eb init -p node.js-20 mibo-frontend --region eu-north-1
eb create mibo-frontend-prod
```

**Pros:**

- ✅ Same platform as backend
- ✅ Easy environment management
- ✅ Auto-scaling

**Cost:** ~$15-30/month (t3.micro instance)

---

## 🔐 Environment Variables Setup by Platform

### AWS Amplify

1. Go to App Settings > Environment variables
2. Add:
   ```
   VITE_API_BASE_URL = https://your-backend-url.elasticbeanstalk.com/api
   ```
3. Redeploy

### S3 + CloudFront

Environment variables must be set **before build**:

```bash
# Update .env file
echo "VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com/api" > .env

# Build with new variables
npm run build

# Deploy
aws s3 sync dist/ s3://mibo-frontend --delete
```

### Elastic Beanstalk

```bash
# Set via CLI
eb setenv VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com/api

# Or via Console
# Configuration > Software > Environment properties
```

---

## ⚠️ Important: Environment Variables in Vite

**CRITICAL:** Vite environment variables are **embedded at build time**, not runtime!

This means:

- ✅ Variables are read during `npm run build`
- ❌ Variables CANNOT be changed after build
- ⚠️ You must rebuild if you change environment variables

**Workflow:**

1. Set environment variables
2. Run `npm run build`
3. Deploy `dist/` folder
4. If API URL changes → Rebuild and redeploy

---

## 🔒 CORS Configuration

Your backend must allow requests from your frontend domain.

**Update backend environment variable:**

```bash
# For Amplify
CORS_ORIGIN=https://main.d1234567890.amplifyapp.com

# For CloudFront
CORS_ORIGIN=https://d1234567890.cloudfront.net

# For custom domain
CORS_ORIGIN=https://mibo.com
```

**Multiple origins (if needed):**
Update `backend/src/server.ts` to accept array:

```typescript
cors({
  origin: [
    "https://mibo.com",
    "https://www.mibo.com",
    "https://main.d1234567890.amplifyapp.com",
  ],
});
```

---

## 📊 Performance Optimization

### Current Issues

- ⚠️ Large bundle size (2.85 MB JS)
- ⚠️ Large images (some >10 MB)
- ⚠️ Large videos (some >50 MB)

### Recommendations

#### 1. Code Splitting

Update `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "chart-vendor": ["recharts"],
          "lottie-vendor": ["lottie-react", "lottie-web"],
        },
      },
    },
  },
});
```

#### 2. Image Optimization

```bash
# Install image optimization tools
npm install -D vite-plugin-imagemin

# Or use external service
# Upload images to AWS S3 or Cloudinary
# Use CDN URLs instead of bundling
```

#### 3. Lazy Loading

```typescript
// Use React.lazy for route-based code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
```

#### 4. Video Optimization

- Move videos to S3 or CloudFront
- Use streaming instead of bundling
- Consider using YouTube/Vimeo embeds

---

## ✅ Pre-Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` to production backend URL
- [ ] Switch Razorpay to LIVE keys (if using)
- [ ] Run `npm run build` successfully
- [ ] Test build locally: `npm run preview`
- [ ] Verify all API calls work with production backend
- [ ] Configure CORS on backend to allow frontend domain
- [ ] Set up SSL certificate (automatic with Amplify/CloudFront)
- [ ] Configure custom domain (optional)
- [ ] Set up CloudFront error pages for SPA routing
- [ ] Test payment flow end-to-end
- [ ] Test authentication flow
- [ ] Test all routes and navigation

---

## 🧪 Testing Before Deployment

### 1. Test Build Locally

```bash
# Build
npm run build

# Preview (runs on http://localhost:4173)
npm run preview
```

### 2. Test with Production Backend

Update `.env`:

```bash
VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com/api
```

Rebuild and test:

```bash
npm run build
npm run preview
```

### 3. Test All Features

- [ ] Login/Signup
- [ ] Book appointment
- [ ] View doctors
- [ ] Payment flow
- [ ] Dashboard
- [ ] All routes work

---

## 🚨 Common Issues & Solutions

### Issue 1: 404 on Page Refresh

**Cause:** SPA routing not configured

**Solution:**

- **Amplify:** Add redirects in console
- **CloudFront:** Add custom error responses (403/404 → /index.html)
- **S3:** Set error document to `index.html`

### Issue 2: API Calls Fail

**Cause:** CORS or wrong API URL

**Solution:**

1. Check `VITE_API_BASE_URL` is correct
2. Verify backend CORS allows frontend domain
3. Check browser console for errors

### Issue 3: Environment Variables Not Working

**Cause:** Variables not set before build

**Solution:**

1. Set variables in `.env` file
2. Rebuild: `npm run build`
3. Redeploy

### Issue 4: Large Bundle Size

**Cause:** All code in single bundle

**Solution:**

- Implement code splitting (see Performance Optimization)
- Move large assets to CDN
- Use lazy loading

---

## 📝 Deployment Commands Cheat Sheet

### AWS Amplify

```bash
# Via Console (Recommended)
# Just connect GitHub and configure

# Via CLI
amplify init
amplify add hosting
amplify publish
```

### S3 + CloudFront

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://mibo-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### Elastic Beanstalk

```bash
# Initialize
eb init -p node.js-20 mibo-frontend

# Create environment
eb create mibo-frontend-prod

# Deploy updates
npm run build
eb deploy
```

---

## 💰 Cost Estimates

### AWS Amplify

- Build: $0.01/minute × 2 minutes = $0.02 per deployment
- Hosting: $0.15/GB served
- **Estimated:** $5-20/month (depending on traffic)

### S3 + CloudFront

- S3 storage: $0.023/GB × 0.16 GB = $0.004/month
- CloudFront: $0.085/GB × 10 GB = $0.85/month
- **Estimated:** $1-10/month (depending on traffic)

### Elastic Beanstalk

- EC2 t3.micro: $0.0104/hour × 730 hours = $7.59/month
- Load balancer: $16.20/month (optional)
- **Estimated:** $8-25/month

---

## 🎉 Summary

Your frontend is **100% AWS-compatible** and ready to deploy!

**Recommended Deployment:**

1. **For quick start:** AWS Amplify
2. **For production:** S3 + CloudFront
3. **For unified platform:** Elastic Beanstalk

**Environment Variables Needed:**

1. `VITE_API_BASE_URL` - Your backend URL (REQUIRED)
2. `VITE_RAZORPAY_KEY_ID` - Razorpay key (OPTIONAL - not currently used)

**Next Steps:**

1. Choose deployment option
2. Update `VITE_API_BASE_URL` in `.env`
3. Run `npm run build`
4. Deploy to AWS
5. Update backend CORS to allow frontend domain
6. Test thoroughly!

Good luck with your deployment! 🚀
