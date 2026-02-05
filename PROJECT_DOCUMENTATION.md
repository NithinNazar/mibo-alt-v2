# Mibo Mental Health - Project Documentation

**Last Updated:** February 4, 2026  
**Status:** Production Ready

---

## 📚 Documentation Index

### Essential Documents

1. **README.md** - Project overview and setup instructions
2. **DEPLOY_PRODUCTION_FIXES.md** - Latest deployment guide with bug fixes
3. **PRODUCTION_BUGS_FIX.md** - Current production issues and solutions
4. **URL_AUDIT_AND_FIX_COMPLETE.md** - URL configuration and API endpoints

---

## 🚀 Quick Start

### Frontend (mibo_version-2)

```bash
cd mibo_version-2
npm install
npm run dev          # Development
npm run build        # Production build
```

### Backend

```bash
cd backend
npm install
npm start            # Development
npm run build        # Production build
```

### Admin Panel (mibo-admin)

```bash
cd mibo-admin
npm install
npm run dev          # Development
npm run build        # Production build
```

---

## 🌐 Production URLs

- **Frontend:** https://mibo.care
- **Admin Panel:** https://mibo.care/admin
- **Backend API:** https://api.mibo.care/api

---

## 📖 Key Documentation

### For Developers

- **Backend API:** See `backend/API_DOCUMENTATION.md`
- **Environment Setup:** See `backend/ENVIRONMENT_VARIABLES_GUIDE.md`
- **Booking Flow:** See `backend/GALLABOX_BOOKING_AUDIT_COMPLETE.md`

### For DevOps

- **AWS Deployment:** See `backend/AWS_DEPLOYMENT_GUIDE.md`
- **Frontend Deploy:** See `DEPLOY_PRODUCTION_FIXES.md`
- **Admin Deploy:** See `mibo-admin/DEPLOY_NOW.md`

### For Troubleshooting

- **Production Bugs:** See `PRODUCTION_BUGS_FIX.md`
- **URL Issues:** See `URL_AUDIT_AND_FIX_COMPLETE.md`

---

## 🔧 Recent Fixes (Feb 4, 2026)

### Fixed Issues:

1. ✅ Auth redirect 404 error (redirected to wrong path)
2. ✅ Experts page not loading (API auth issue)
3. ✅ New user signup errors (resource fetching)
4. ✅ URL configuration (localhost → production)

### Files Modified:

- `src/services/api.ts` - Fixed redirect path
- `src/pages/Experts/ExpertsPage.tsx` - Better error handling
- `src/main.tsx` - Added route alias

---

## 📁 Project Structure

```
mibo-v2/
├── mibo_version-2/          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── components/      # Reusable components
│   │   └── types/           # TypeScript types
│   └── dist/                # Production build
│
├── backend/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database layer
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utilities
│   └── dist/                # Production build
│
└── mibo-admin/              # Admin Panel (React + TypeScript)
    ├── src/
    │   ├── modules/         # Feature modules
    │   ├── services/        # API services
    │   └── components/      # Reusable components
    └── dist/                # Production build
```

---

## 🔑 Environment Variables

### Frontend (.env)

```env
VITE_API_BASE_URL=https://api.mibo.care/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### Backend (.env)

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
GALLABOX_API_KEY=...
RAZORPAY_KEY_ID=...
CORS_ORIGIN=https://mibo.care,https://www.mibo.care
```

### Admin Panel (.env)

```env
VITE_API_BASE_URL=https://api.mibo.care/api
```

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd mibo_version-2
npm test
```

---

## 📦 Deployment

### Quick Deploy

```bash
# Build all projects
cd mibo_version-2 && npm run build
cd ../backend && npm run build
cd ../mibo-admin && npm run build

# Deploy to AWS (see deployment guides for details)
```

### Detailed Instructions

- Frontend: See `DEPLOY_PRODUCTION_FIXES.md`
- Backend: See `backend/AWS_DEPLOYMENT_GUIDE.md`
- Admin: See `mibo-admin/DEPLOY_NOW.md`

---

## 🐛 Known Issues

None currently. All production bugs have been fixed.

For historical issues, see `PRODUCTION_BUGS_FIX.md`.

---

## 📞 Support

For issues or questions:

1. Check the relevant documentation above
2. Review error logs in browser console or backend logs
3. Verify environment variables are correct
4. Check AWS CloudWatch logs for backend issues

---

## 📝 Change Log

### 2026-02-04

- Fixed auth redirect 404 error
- Fixed experts page loading issues
- Improved error handling
- Updated URL configuration
- Cleaned up redundant documentation

### Previous Changes

See git commit history for detailed changes.

---

**Project Status:** ✅ Production Ready  
**Last Deployment:** February 4, 2026  
**Next Review:** As needed
