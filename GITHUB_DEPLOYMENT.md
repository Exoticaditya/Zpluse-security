# 🚀 SGMS GitHub Deployment Guide

Complete guide to deploying SGMS frontend and backend to GitHub

## 📦 Repository Structure

We'll create **2 separate repositories**:

### 1. `sgms-frontend` (React + Vite)
- Deployed on: Netlify
- Public repository (optional)

### 2. `sgms-backend` (Spring Boot)
- Deployed on: Railway
- Private repository (recommended)

## 🔐 Pre-Deployment Security Checklist

### ✅ Frontend Security

- [ ] No hardcoded API URLs (using environment variables)
- [ ] `.env` file in `.gitignore`
- [ ] `.env.production` contains production API URL
- [ ] No Firebase secrets committed (use `.env.example`)
- [ ] Service worker doesn't cache sensitive data
- [ ] PWA icons generated

### ✅ Backend Security

- [ ] JWT secret in environment variables (never committed)
- [ ] Database password in environment variables
- [ ] CORS origins whitelisted
- [ ] All secrets in `.env` (which is gitignored)
- [ ] `.env.example` created with placeholder values
- [ ] `target/` directory in `.gitignore`
- [ ] No hardcoded credentials in code

## 📋 Step 1: Prepare Frontend Repository

```powershell
# Navigate to frontend (root directory)
cd C:\Zpluse-Security

# Initialize git (if not already initialized)
git init

# Create .gitignore (if not exists)
# Already created - verify it includes:
# - node_modules/
# - dist/
# - .env
# - .env.local

# Stage files
git add .
git commit -m "Initial commit: SGMS Frontend - React + PWA"

# Create GitHub repository
# Go to github.com → New Repository → sgms-frontend

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/sgms-frontend.git
git branch -M main
git push -u origin main
```

## 📋 Step 2: Prepare Backend Repository

```powershell
# Navigate to backend directory
cd C:\Zpluse-Security\backend

# Initialize git
git init

# Create .gitignore (already created)
# Verify it includes:
# - target/
# - .env
# - .idea/
# - *.log

# Stage files
git add .
git commit -m "Initial commit: SGMS Backend - Spring Boot + PostgreSQL"

# Create GitHub repository
# Go to github.com → New Repository → sgms-backend (PRIVATE)

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/sgms-backend.git
git branch -M main
git push -u origin main
```

## 🚀 Step 3: Deploy Backend to Railway

### 3.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `sgms-backend` repository
6. Railway will auto-detect Spring Boot

### 3.2 Add PostgreSQL Database

1. In Railway project → Click "New"
2. Select "Database" → "PostgreSQL"
3. Railway auto-creates `DATABASE_URL` environment variable

### 3.3 Set Environment Variables

In Railway project → Settings → Variables:

```env
APP_SECURITY_JWT_SECRET=SGMS_SUPER_SECRET_SECURITY_KEY_2026_MINIMUM_32_CHARACTERS
APP_CORS_ALLOWED_ORIGINS=https://sgms-frontend.netlify.app,https://zplusesecurity.com
SPRING_PROFILES_ACTIVE=prod
```

**Important**: `DATABASE_URL` is auto-set by Railway, don't override it

### 3.4 Deploy

Railway auto-deploys on every push to `main` branch.

Backend URL: `https://YOUR_PROJECT.up.railway.app`

## 🌐 Step 4: Deploy Frontend to Netlify

### 4.1 Create Netlify Site

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select `sgms-frontend`

### 4.2 Configure Build Settings

```yaml
Build command: npm run build
Publish directory: dist
```

### 4.3 Set Environment Variables

In Netlify → Site settings → Environment variables:

```env
VITE_API_BASE_URL=https://YOUR_RAILWAY_PROJECT.up.railway.app/api
VITE_USE_FIREBASE_STORAGE=false
VITE_ENABLE_ANALYTICS=true
```

### 4.4 Deploy

Netlify auto-deploys on every push to `main` branch.

Frontend URL: `https://YOUR_SITE.netlify.app`

### 4.5 Update CORS in Railway

Go back to Railway → Update `APP_CORS_ALLOWED_ORIGINS`:

```env
APP_CORS_ALLOWED_ORIGINS=https://YOUR_SITE.netlify.app
```

Redeploy backend.

## 🔄 Git Workflow for Future Updates

### Frontend Updates

```powershell
cd C:\Zpluse-Security

# Make changes to code
# ...

# Commit and push
git add .
git commit -m "feat: add new dashboard feature"
git push origin main

# Netlify auto-deploys in ~2 minutes
```

### Backend Updates

```powershell
cd C:\Zpluse-Security\backend

# Make changes to code
# ...

# Test locally first
mvn test

# Commit and push
git add .
git commit -m "fix: improve attendance calculation"
git push origin main

# Railway auto-deploys in ~3-5 minutes
```

## 🧪 Testing Production Deployment

### Backend Health Check

```bash
curl https://YOUR_RAILWAY_PROJECT.up.railway.app/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### Frontend API Connection

```bash
# Open browser console on https://YOUR_SITE.netlify.app
# Try to login
# Check network tab for API calls to Railway backend
```

### Full E2E Test

1. Visit `https://YOUR_SITE.netlify.app/portal`
2. Click "Admin Portal"
3. Login with admin credentials
4. Create a guard
5. Create a site
6. Assign guard to site
7. Check-in as guard

## 📊 Monitoring

### Railway Metrics

- Dashboard → Metrics tab
- View CPU, memory, requests
- Check logs for errors

### Netlify Analytics

- Site → Analytics
- View page views, load times
- Check deploy logs

## 🔒 Security Best Practices

### Production Checklist

- [ ] Use HTTPS only (auto-enabled on Railway/Netlify)
- [ ] Rotate JWT secret every 90 days
- [ ] Enable Netlify password protection (if needed)
- [ ] Set up Railway custom domain with SSL
- [ ] Enable Railway auto-scaling
- [ ] Set up database backups on Railway
- [ ] Enable Netlify deploy previews for testing
- [ ] Use Railway environment branches (dev/staging/prod)

### Secret Rotation Process

When rotating JWT secret:

1. Update `APP_SECURITY_JWT_SECRET` in Railway
2. Redeploy backend
3. All users must re-login (existing tokens invalidated)
4. Notify users in advance

## 🐛 Troubleshooting

### CORS Errors

**Symptom**: Console shows "CORS policy blocked"

**Fix**:
1. Check Railway environment variable `APP_CORS_ALLOWED_ORIGINS`
2. Must include exact Netlify URL (with https://)
3. Redeploy backend after changing

### 500 Errors

**Symptom**: API returns 500 Internal Server Error

**Fix**:
1. Check Railway logs: Project → Deployments → Logs
2. Look for Java exceptions
3. Common causes:
   - Missing environment variables
   - Database connection issues
   - Flyway migration errors

### Build Failures

**Symptom**: Railway/Netlify deploy fails

**Fix**:
1. Check build logs
2. Ensure all dependencies in `pom.xml` / `package.json`
3. Test build locally: `mvn clean package` / `npm run build`

### Database Connection Issues

**Symptom**: "Connection refused" or "Unknown host"

**Fix**:
1. Railway auto-sets `DATABASE_URL`
2. Don't override it manually
3. Check PostgreSQL service is running
4. Verify database password hasn't changed

## 📞 Support

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- SGMS Issues: Create issue in GitHub repository

## 🎉 Success!

Your SGMS system is now live:

- **Frontend**: https://YOUR_SITE.netlify.app
- **Backend**: https://YOUR_PROJECT.up.railway.app
- **Database**: Managed PostgreSQL on Railway
- **Auto-deploy**: Enabled on both platforms

Every push to `main` branch auto-deploys to production! 🚀
