# 🌍 SGMS Production Deployment Reference

**Quick reference for production deployment and management**

---

## 🔗 Production URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Production Backend** | https://sgms-backend-production.up.railway.app/api | REST API endpoints |
| **Production Frontend** | https://zplusesecurity.com | React application |
| **Swagger UI** | https://sgms-backend-production.up.railway.app/swagger-ui.html | API documentation |
| **OpenAPI Spec** | https://sgms-backend-production.up.railway.app/v3/api-docs | OpenAPI JSON |
| **Railway Dashboard** | https://railway.app | Backend & database management |
| **Netlify Dashboard** | https://app.netlify.com | Frontend deployment |

---

## 🔐 Test Credentials

### Admin Account
```
Email: admin@zpluse.com
Password: Admin@123
```

### Supervisor Account
```
Email: supervisor@zpluse.com
Password: Super@123
```

### Guard Account
```
Email: guard1@zpluse.com
Password: Guard@123
```

### Client Account
```
Email: client1@zpluse.com
Password: Client@123
```

---

## 🚀 Quick Deployment Commands

### Backend (Railway)

```powershell
# Build backend locally
cd backend
mvn clean package -DskipTests

# Deploy to Railway
railway up

# View logs
railway logs

# Open Railway dashboard
railway open
```

### Frontend (Netlify)

```powershell
# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod

# View live site
netlify open:site
```

---

## 🗄️ Database Inspection

### Connect to Production Database

```powershell
# Railway CLI approach
railway run psql

# Direct connection
psql -h [RAILWAY_HOST] -U postgres -d railway -p [PORT]
```

### Run Comprehensive Inspection

```powershell
# Download and run inspection script
railway run "psql -f psql_inspection.sql"
```

### Quick Health Check

```sql
-- Check migration status
SELECT installed_rank, version, description, success 
FROM flyway_schema_history 
ORDER BY installed_rank;

-- Count records
SELECT 'users' as table_name, COUNT(*) FROM users
UNION SELECT 'guards', COUNT(*) FROM guards
UNION SELECT 'sites', COUNT(*) FROM sites
UNION SELECT 'guard_assignments', COUNT(*) FROM guard_assignments;

-- Active assignments
SELECT COUNT(*) as active_assignments 
FROM guard_assignments 
WHERE active = true;
```

---

## 🧪 Production Testing

### Test Authentication

```powershell
# Login as admin
$body = @{
    email = "admin@zpluse.com"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "https://sgms-backend-production.up.railway.app/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $response.token
Write-Output "✅ Token: $token"
```

### Test Protected Endpoint

```powershell
# Get admin dashboard
Invoke-RestMethod `
    -Uri "https://sgms-backend-production.up.railway.app/api/dashboard/admin-summary" `
    -Headers @{ "Authorization" = "Bearer $token" }
```

### Test Current Guard Endpoint

```powershell
# Login as guard first
$guardBody = @{
    email = "guard1@zpluse.com"
    password = "Guard@123"
} | ConvertTo-Json

$guardResponse = Invoke-RestMethod `
    -Uri "https://sgms-backend-production.up.railway.app/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $guardBody

# Get current guard details
Invoke-RestMethod `
    -Uri "https://sgms-backend-production.up.railway.app/api/guards/me" `
    -Headers @{ "Authorization" = "Bearer $($guardResponse.token)" }
```

---

## 📊 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/admin-summary` - Admin metrics
- `GET /api/dashboard/manager-summary` - Supervisor metrics
- `GET /api/dashboard/guard-summary` - Guard metrics

### Guards
- `GET /api/guards` - List all guards
- `GET /api/guards/{id}` - Get guard by ID
- `GET /api/guards/me` - Get current authenticated guard
- `POST /api/guards` - Create guard
- `PUT /api/guards/{id}` - Update guard

### Attendance
- `GET /api/attendance` - List attendance logs
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/guard/{guardId}` - Guard attendance history

### Sites & Assignments
- `GET /api/sites` - List sites
- `GET /api/sites/{id}/posts` - Site posts
- `GET /api/assignments` - Guard assignments
- `POST /api/assignments` - Create assignment

---

## 🔧 Environment Variables

### Railway Backend

```bash
# Database (auto-configured by Railway)
DATABASE_URL=postgresql://postgres:password@host:port/railway

# Security
APP_SECURITY_JWT_SECRET=[256-bit secret]
APP_SECURITY_JWT_EXPIRATION=86400000

# CORS
APP_CORS_ALLOWED_ORIGINS=https://zplusesecurity.com,https://www.zplusesecurity.com,https://*.netlify.app

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Netlify Frontend

```bash
# API Configuration
VITE_API_BASE_URL=https://sgms-backend-production.up.railway.app/api

# Firebase
VITE_FIREBASE_API_KEY=[your-key]
VITE_FIREBASE_AUTH_DOMAIN=[your-domain]
VITE_FIREBASE_PROJECT_ID=[your-project-id]
VITE_FIREBASE_STORAGE_BUCKET=[your-bucket]
VITE_FIREBASE_MESSAGING_SENDER_ID=[your-sender-id]
VITE_FIREBASE_APP_ID=[your-app-id]
```

---

## 🔍 Monitoring & Debugging

### View Backend Logs

```powershell
# Railway CLI
railway logs --follow

# Last 100 lines
railway logs --tail 100
```

### View Frontend Build Logs

```powershell
# Netlify CLI
netlify logs

# View deploy logs
netlify deploy --prod --json
```

### Check Database Connections

```sql
-- Active connections
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start
FROM pg_stat_activity
WHERE datname = 'railway';

-- Connection limit
SHOW max_connections;
```

---

## 🛠️ Troubleshooting

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check CORS configuration in Railway:
   ```bash
   railway variables get APP_CORS_ALLOWED_ORIGINS
   ```

2. Update if needed:
   ```bash
   railway variables set APP_CORS_ALLOWED_ORIGINS="https://zplusesecurity.com,https://www.zplusesecurity.com"
   ```

3. Restart backend:
   ```bash
   railway restart
   ```

### Authentication Failures

**Problem**: 401 Unauthorized errors

**Solutions**:
1. Check JWT secret is set:
   ```bash
   railway variables get APP_SECURITY_JWT_SECRET
   ```

2. Verify token expiration (default 24 hours)

3. Test login endpoint directly:
   ```powershell
   Invoke-RestMethod `
       -Uri "https://sgms-backend-production.up.railway.app/api/auth/login" `
       -Method POST `
       -Body '{"email":"admin@zpluse.com","password":"Admin@123"}' `
       -ContentType "application/json"
   ```

### Database Connection Issues

**Problem**: Backend can't connect to database

**Solutions**:
1. Check DATABASE_URL:
   ```bash
   railway variables get DATABASE_URL
   ```

2. Test connection:
   ```bash
   railway run psql
   ```

3. Check migrations:
   ```sql
   SELECT * FROM flyway_schema_history ORDER BY installed_rank;
   ```

### Frontend Build Errors

**Problem**: Netlify build fails

**Solutions**:
1. Check build logs:
   ```bash
   netlify logs
   ```

2. Test build locally:
   ```powershell
   npm run build
   ```

3. Verify environment variables in Netlify dashboard

---

## 📈 Performance Optimization

### Backend

1. **Connection Pooling** (Railway PostgreSQL):
   ```properties
   spring.datasource.hikari.maximum-pool-size=10
   spring.datasource.hikari.minimum-idle=5
   spring.datasource.hikari.connection-timeout=30000
   ```

2. **Enable Query Caching**:
   ```properties
   spring.jpa.properties.hibernate.cache.use_second_level_cache=true
   spring.jpa.properties.hibernate.cache.use_query_cache=true
   ```

3. **Database Indexing**:
   ```sql
   CREATE INDEX idx_guards_user_id ON guards(user_id);
   CREATE INDEX idx_attendance_guard_date ON attendance_logs(guard_id, attendance_date);
   CREATE INDEX idx_assignments_guard_active ON guard_assignments(guard_id, active);
   ```

### Frontend

1. **CDN Caching** (Netlify auto-configured)

2. **Code Splitting** (Vite default)

3. **Image Optimization**:
   - Use WebP format
   - Lazy load images
   - Compress uploads via Firebase

---

## 🔒 Security Checklist

- [x] JWT secret is 256+ bits
- [x] CORS restricted to production domains
- [x] HTTPS enforced on all endpoints
- [x] Password hashing with BCrypt (strength 12)
- [x] SQL injection protection (JPA/Hibernate)
- [x] XSS protection enabled
- [x] CSRF protection for state-changing operations
- [x] Rate limiting on authentication endpoints
- [x] Database credentials in environment variables
- [x] Firebase rules restrict file uploads

---

## 📞 Support Contacts

- **Railway Support**: https://railway.app/help
- **Netlify Support**: https://www.netlify.com/support/
- **Firebase Support**: https://firebase.google.com/support

---

## 📝 Deployment History

Track major deployments:

| Date | Version | Changes | Deployed By |
|------|---------|---------|-------------|
| 2025-01-XX | 1.0.0 | Initial production deployment | DevOps Team |
| | | Backend: Railway, Frontend: Netlify, DB: Railway PostgreSQL | |

---

## 🎯 Next Steps

1. ✅ Verify production URLs are working
2. ✅ Test all roles (Admin, Supervisor, Guard, Client)
3. ✅ Run database inspection: `railway run "psql -f psql_inspection.sql"`
4. ✅ Run Python auditor: `python sgms_auditor.py`
5. ⬜ Configure custom domain (optional)
6. ⬜ Set up monitoring/alerting
7. ⬜ Configure automated backups
8. ⬜ Load production data

---

**Last Updated**: 2025-01-XX  
**Maintained By**: ZPluse Security Team
