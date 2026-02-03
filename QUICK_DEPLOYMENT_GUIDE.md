# Quick Deployment Guide 🚀

## ✅ Status: READY TO DEPLOY

All projects are built and configured for production!

---

## 📦 What to Deploy

### 1. Frontend (mibo_version-2)

- **Folder to deploy**: `mibo_version-2/dist/`
- **Domain**: https://mibo.care
- **API URL**: https://api.mibo.care/api ✅

### 2. Admin Panel (mibo-admin)

- **Folder to deploy**: `mibo-admin/dist/`
- **Domain**: https://mibo.care/admin
- **API URL**: https://api.mibo.care/api ✅

### 3. Backend

- **Already deployed**: https://api.mibo.care/api ✅
- No action needed

---

## 🎯 Deployment Steps

### Option A: AWS S3 + CloudFront

```bash
# Frontend
aws s3 sync mibo_version-2/dist/ s3://your-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# Admin Panel
aws s3 sync mibo-admin/dist/ s3://your-admin-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_ADMIN_DIST_ID --paths "/*"
```

### Option B: Vercel

```bash
# Frontend
cd mibo_version-2
vercel --prod

# Admin Panel
cd mibo-admin
vercel --prod
```

### Option C: Netlify

```bash
# Frontend
cd mibo_version-2
netlify deploy --prod --dir=dist

# Admin Panel
cd mibo-admin
netlify deploy --prod --dir=dist
```

---

## ✅ Verification Checklist

After deployment, verify:

### Frontend (https://mibo.care)

- [ ] Website loads
- [ ] Can browse clinicians
- [ ] Can start booking process
- [ ] Check browser console - API calls go to `https://api.mibo.care/api`
- [ ] No `ERR_CONNECTION_REFUSED` errors

### Admin Panel (https://mibo.care/admin)

- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard loads after login
- [ ] Check browser console - API calls go to `https://api.mibo.care/api`
- [ ] No `ERR_CONNECTION_REFUSED` errors

---

## 🔑 Admin Login Credentials

Use the admin credentials already in your database to test login.

---

## 🐛 Troubleshooting

### Issue: Still seeing localhost errors

**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: API calls failing

**Solution**: Verify backend is running at https://api.mibo.care/api

### Issue: Changes not appearing

**Solution**: Rebuild and redeploy

```bash
npm run build
# Then redeploy dist/ folder
```

---

## 📝 Important Notes

1. **Environment variables are embedded at build time** - If you change `.env`, you must rebuild
2. **Both projects now use production API** - No more localhost issues
3. **Razorpay keys** - Update to live keys in `.env.production` before deploying
4. **CORS** - Backend must allow requests from your frontend domains

---

## 🎉 You're Ready!

Everything is configured and built. Just deploy the `dist/` folders and you're live!
