# 🚀 SGMS Complete Deployment Guide

## Overview
This guide covers deploying the Security Guard Management System (SGMS) from database setup to running servers.

---

## 🌍 Production Status

**SGMS is currently LIVE in production!**

| Component | Production URL | Status |
|-----------|---------------|--------|
| **Backend API** | https://sgms-backend-production.up.railway.app/api | ✅ Live |
| **Frontend** | https://zplusesecurity.com | ✅ Live |
| **Database** | Railway PostgreSQL | ✅ Live |
| **Storage** | Firebase Storage | ✅ Configured |

**Test Credentials:**
- Admin: `admin@zpluse.com` / `Admin@123`
- Supervisor: `supervisor@zpluse.com` / `Super@123`
- Guard: `guard1@zpluse.com` / `Guard@123`
- Client: `client1@zpluse.com` / `Client@123`

## Prerequisites

### Required Software
- ✅ **PostgreSQL 14+**: Database server
- ✅ **Java 17+**: Backend runtime (JDK 23 recommended)
- ✅ **Maven 3.9+**: Backend build tool
- ✅ **Node.js 18+**: Frontend runtime (v22+ recommended)
- ✅ **Python 3.8+**: For audit scripts (optional)

### Verify Installations
```powershell
# Check versions
psql --version
java -version
mvn --version
node --version
npm --version
python --version
```

---

## 📋 Quick Deployment (5 Minutes)

### Option A: Automated Deployment Script
```powershell
# Run the all-in-one deployment script
.\deploy.ps1
```

This script will:
1. ✓ Create database `sgms`
2. ✓ Run all 9 Flyway migrations
3. ✓ Insert seed data (admin user, test guards, sites)
4. ✓ Build backend JAR
5. ✓ Build frontend assets
6. ✓ Run project auditor
7. ✓ Offer to start servers

### Option B: Manual Step-by-Step

#### Step 1: Database Setup (2 minutes)
```powershell
# Create database
psql -U postgres -f db_setup.sql

# Run migrations
cd backend
mvn flyway:migrate -Dspring.profiles.active=local

# Insert seed data
cd ..
psql -U postgres -d sgms -f backend\SEED_DATA_COMPLETE.sql

# Verify database
psql -U postgres -d sgms -f psql_inspection.sql
```

#### Step 2: Backend Build (3 minutes)
```powershell
cd backend

# Set environment variables
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/sgms"
$env:APP_SECURITY_JWT_SECRET = "CHANGE_ME_IN_PRODUCTION_$(Get-Random)"

# Build
mvn clean package -DskipTests

# Verify: Should see BUILD SUCCESS
```

#### Step 3: Frontend Build (2 minutes)
```powershell
cd ..  # Back to root

# Install dependencies (first time only)
npm install

# Build production assets
npm run build

# Verify: Should create dist/ folder
```

#### Step 4: Start Servers
```powershell
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend (new window)
cd ..
npm run dev
```

---

## 🔐 Default Credentials (From Seed Data)

### Admin Account
- **Email**: `admin@zpluse.com`
- **Password**: `Admin@123`
- **Role**: ADMIN
- **Access**: Full system control

### Test Supervisor
- **Email**: `supervisor@zpluse.com`
- **Password**: `Supervisor@123`
- **Role**: SUPERVISOR
- **Access**: Guard management, site oversight

### Test Guard
- **Email**: `guard001@zpluse.com`
- **Password**: `Guard@123`
- **Role**: GUARD
- **Access**: Personal dashboard, attendance check-in

### Test Client
- **Email**: `client@techcorp.com`
- **Password**: `Client@123`
- **Role**: CLIENT
- **Access**: Site and guard monitoring

---

## 🌐 Access URLs

### Production Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| **Production Frontend** | **https://zplusesecurity.com** | Live application |
| **Production Backend** | **https://sgms-backend-production.up.railway.app/api** | REST API endpoints |
| **Swagger UI** | **https://sgms-backend-production.up.railway.app/swagger-ui.html** | API documentation |
| **Database** | Railway PostgreSQL | Managed database |

### Local Development

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend (Dev) | http://localhost:5173 | React development server |
| Backend (Dev) | http://localhost:8080/api | Local API endpoints |
| Swagger (Dev) | http://localhost:8080/swagger-ui.html | Local API docs |

---

## 🔧 Environment Variables

### Required Variables

#### For Backend
```powershell
# Database connection
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/sgms"

# Security (CRITICAL - Change in production!)
$env:APP_SECURITY_JWT_SECRET = "your-super-secret-key-min-256-bits"

# Optional - Profile selection
$env:SPRING_PROFILES_ACTIVE = "local"  # or "prod"

# Optional - CORS configuration
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:8080"
```

#### For Frontend
```powershell
# Backend API URL
$env:VITE_API_BASE_URL = "http://localhost:8080/api"
```

### Production Environment Setup

#### Railway / Heroku / Cloud Platform
```bash
# Set via platform dashboard or CLI
railway variables set APP_SECURITY_JWT_SECRET="your-secret-key"
railway variables set DATABASE_URL="postgresql://user:pass@host:5432/sgms"
railway variables set SPRING_PROFILES_ACTIVE="prod"
railway variables set CORS_ALLOWED_ORIGINS="https://yourdomain.com"
```

---

## 📊 Database Inspection Commands

### Quick Health Check
```powershell
# Run comprehensive inspection
psql -U postgres -d sgms -f psql_inspection.sql > db_report.txt
cat db_report.txt
```

### Manual Queries
```sql
-- Connect to database
psql -U postgres -d sgms

-- Check migration status
SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;

-- Count records in all tables
SELECT 'users' as table, COUNT(*) FROM users
UNION ALL SELECT 'guards', COUNT(*) FROM guards
UNION ALL SELECT 'sites', COUNT(*) FROM sites
UNION ALL SELECT 'guard_assignments', COUNT(*) FROM guard_assignments;

-- List all users with roles
SELECT u.email, u.full_name, STRING_AGG(r.name, ', ') as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.full_name;

-- Check active assignments
SELECT 
    u.full_name as guard, 
    s.name as site, 
    sp.post_name, 
    ga.effective_from, 
    ga.effective_to
FROM guard_assignments ga
JOIN guards g ON ga.guard_id = g.id
JOIN users u ON g.user_id = u.id
JOIN site_posts sp ON ga.site_post_id = sp.id
JOIN sites s ON sp.site_id = s.id
WHERE ga.active = true;
```

---

## 🐍 Project Auditor

### Run Full Audit
```powershell
# Install dependencies (optional for DB connection test)
pip install psycopg2-binary

# Run auditor
python sgms_auditor.py

# View detailed report
cat AUDIT_REPORT.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Audit Report Sections
1. **Environment Variables**: Checks all required/optional vars
2. **Database Migrations**: Verifies 9 migration files exist
3. **Backend Compilation**: Tests Maven build
4. **Frontend Dependencies**: Checks npm packages
5. **API Endpoints**: Scans for controllers
6. **DTO Usage**: Detects entity exposure anti-patterns
7. **Security Configuration**: Verifies JWT/Auth setup
8. **Database Connection**: Tests PostgreSQL connectivity
9. **Code Structure**: Analyzes project organization

---

## 🧪 Testing

### Backend Tests
```powershell
cd backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=GuardServiceTest

# Run with coverage
mvn test jacoco:report
# Report: target/site/jacoco/index.html
```

### Frontend Tests
```powershell
# Run Vitest
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Manual API Testing

#### Get JWT Token
```powershell
# Login request
$body = @{
    email = "admin@zpluse.com"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $response.token
Write-Host "Token: $token"
```

#### Test Protected Endpoint
```powershell
# Get current guard info
Invoke-RestMethod -Uri "http://localhost:8080/api/guards/me" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

# Get admin dashboard
Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/admin" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }
```

---

## 🚨 Troubleshooting

### Database Issues

#### "Database sgms does not exist"
```powershell
# Create database
psql -U postgres -c "CREATE DATABASE sgms;"
```

#### "Relation does not exist"
```powershell
# Run migrations
cd backend
mvn flyway:migrate -Dspring.profiles.active=local
```

#### "Authentication failed for user postgres"
```powershell
# Set password environment variable
$env:PGPASSWORD = "your-postgres-password"
```

### Backend Issues

#### "APPLICATION_SECURITY_JWT_SECRET must be set"
```powershell
# Set JWT secret
$env:APP_SECURITY_JWT_SECRET = "my-super-secret-key-at-least-256-bits-long"
```

#### "Port 8080 already in use"
```powershell
# Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port
$env:SERVER_PORT = "8081"
```

#### Maven build fails with "Java version mismatch"
```powershell
# Check Java version
java -version  # Should be 17+

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
```

### Frontend Issues

#### "Cannot connect to backend"
```powershell
# Check backend is running
Invoke-RestMethod http://localhost:8080/api/auth/health

# Update API URL in .env
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local
```

#### "npm install fails"
```powershell
# Clear cache
npm cache clean --force
rm -r node_modules
npm install
```

#### CORS errors in browser
```powershell
# Update backend CORS configuration
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:3000"
```

---

## 📦 Production Deployment

### Build Production Artifacts

#### Backend JAR
```powershell
cd backend
mvn clean package -DskipTests

# JAR location: target/sgms-*.jar
# File size: ~50-80 MB (includes all dependencies)
```

#### Frontend Static Assets
```powershell
npm run build

# Output: dist/
# Contents: index.html, assets/ (JS/CSS bundles)
```

### Deploy to Railway

#### Prerequisites
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

#### Deploy Backend
```powershell
cd backend

# Initialize project
railway init

# Add PostgreSQL
railway add

# Set environment variables
railway variables set APP_SECURITY_JWT_SECRET="$(openssl rand -base64 32)"
railway variables set SPRING_PROFILES_ACTIVE="prod"
railway variables set CORS_ALLOWED_ORIGINS="https://your-frontend.railway.app"

# Deploy
railway up

# Get URL
railway domain
```

#### Deploy Frontend
```powershell
cd ..

# Build with production API URL
$env:VITE_API_BASE_URL = "https://your-backend.railway.app/api"
npm run build

# Deploy to Railway/Netlify/Vercel
railway init
railway up

# Or to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Health Check Endpoints
```bash
# Backend health
curl https://your-backend.railway.app/actuator/health

# Database migrations
curl https://your-backend.railway.app/actuator/flyway
```

---

## 📝 Maintenance

### Database Backups
```powershell
# Backup database
pg_dump -U postgres sgms > sgms_backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Restore database
psql -U postgres -d sgms < sgms_backup_20260223_120000.sql
```

### Log Monitoring
```powershell
# Backend logs (Spring Boot)
# Location: logs/ directory
tail -f logs/spring-boot-logger.log

# Frontend dev server logs
# Displayed in terminal running 'npm run dev'
```

### Clear All Data (Reset)
```powershell
# WARNING: Deletes all data!
psql -U postgres -c "DROP DATABASE IF EXISTS sgms;"
psql -U postgres -f db_setup.sql
cd backend
mvn flyway:migrate -Dspring.profiles.active=local
cd ..
psql -U postgres -d sgms -f backend\SEED_DATA_COMPLETE.sql
```

---

## 📚 Additional Resources

### Project Documentation
- [README.md](README.md) - Project overview
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Pre-deployment checklist
- [SGMS_ARCHITECTURE_REPORT.md](SGMS_ARCHITECTURE_REPORT.md) - System architecture
- [backend/PHASE2_DEPLOYMENT_GUIDE.md](backend/PHASE2_DEPLOYMENT_GUIDE.md) - Detailed backend guide

### API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html (when backend running)
- OpenAPI Spec: http://localhost:8080/v3/api-docs

### Database Schema
- Migration files: `backend/src/main/resources/db/migration/`
- Seed data: `backend/SEED_DATA_COMPLETE.sql`

---

## ✅ Deployment Checklist

Before going live, ensure:

- [ ] PostgreSQL database created
- [ ] All 9 migrations applied successfully
- [ ] Seed data inserted (or real data populated)
- [ ] APP_SECURITY_JWT_SECRET is a strong random value (256+ bits)
- [ ] DATABASE_URL points to production PostgreSQL
- [ ] CORS_ALLOWED_ORIGINS includes production frontend URL
- [ ] Backend builds without errors (`mvn package`)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] All tests pass (`mvn test`, `npm test`)
- [ ] No entity exposure detected (run auditor)
- [ ] Admin user can login via web interface
- [ ] Guard can access dashboard and see assignment
- [ ] HTTPS enabled on production servers
- [ ] Database backups configured
- [ ] Environment secrets secured (not in version control)

---

## 🆘 Support

### Common Commands Quick Reference
```powershell
# Start everything
.\deploy.ps1

# Database only
psql -U postgres -f db_setup.sql
cd backend; mvn flyway:migrate -Dspring.profiles.active=local; cd ..

# Backend only
cd backend; mvn spring-boot:run

# Frontend only
npm run dev

# Inspect database
psql -U postgres -d sgms -f psql_inspection.sql

# Run auditor
python sgms_auditor.py
```

### Get Help
- Check AUDIT_REPORT.json for automated diagnostics
- Review psql_inspection.sql output for database issues
- Check backend logs: `logs/spring-boot-logger.log`
- Frontend console: Browser DevTools → Console tab

---

**Last Updated**: 2026-02-23  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
