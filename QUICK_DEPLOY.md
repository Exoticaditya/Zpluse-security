# 🎯 SGMS Deployment Quick Reference

## Instant Deploy (Copy-Paste Commands)

### Full System Setup (5 Minutes)
```powershell
# 1. Create database and run migrations
psql -U postgres -f db_setup.sql
cd backend
mvn flyway:migrate -Dspring.profiles.active=local
cd ..
psql -U postgres -d sgms -f backend\SEED_DATA_COMPLETE.sql

# 2. Set environment variables
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/sgms"
$env:APP_SECURITY_JWT_SECRET = "dev-secret-key-change-in-production-$(Get-Random)"
$env:SPRING_PROFILES_ACTIVE = "local"

# 3. Build backend
cd backend
mvn clean package -DskipTests
cd ..

# 4. Install and build frontend
npm install
npm run build

# 5. Start servers (2 terminals)
# Terminal 1:
cd backend; mvn spring-boot:run

# Terminal 2:
npm run dev
```

---

## Even Faster: One Command Deploy
```powershell
.\deploy.ps1
```

---

## Default Login Credentials

```
Admin:      admin@zpluse.com / Admin@123
Supervisor: supervisor@zpluse.com / Supervisor@123  
Guard:      guard001@zpluse.com / Guard@123
Client:     client@techcorp.com / Client@123
```

---

## URLs After Startup

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui.html

---

## Quick Diagnostics

### Check Database
```powershell
psql -U postgres -d sgms -f psql_inspection.sql
```

### Run Project Auditor
```powershell
python sgms_auditor.py
cat AUDIT_REPORT.json
```

### Test Backend API
```powershell
# Login and get token
$body = @{ email="admin@zpluse.com"; password="Admin@123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = $response.token

# Test protected endpoint
Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/admin" -Headers @{ "Authorization"="Bearer $token" }
```

---

## Quick Fixes

### "Database does not exist"
```powershell
psql -U postgres -f db_setup.sql
```

### "Table doesn't exist"
```powershell
cd backend
mvn flyway:migrate -Dspring.profiles.active=local
cd ..
```

### "No users found"
```powershell
psql -U postgres -d sgms -f backend\SEED_DATA_COMPLETE.sql
```

### "Port 8080 in use"
```powershell
# Find process
netstat -ano | findstr :8080
# Kill it (replace <PID>)
taskkill /PID <PID> /F
```

### "Cannot connect to backend" (from frontend)
```powershell
# Check backend is running
Invoke-RestMethod http://localhost:8080/api/auth/health
```

### "JWT secret not set"
```powershell
$env:APP_SECURITY_JWT_SECRET = "my-secret-key-at-least-256-bits"
```

---

## Reset Everything
```powershell
# Nuclear option - fresh start
psql -U postgres -c "DROP DATABASE IF EXISTS sgms;"
.\deploy.ps1
```

---

## File Locations

| What | Where |
|------|-------|
| Backend JAR | `backend/target/sgms-*.jar` |
| Frontend build | `dist/` |
| Database config | `backend/src/main/resources/application*.yml` |
| Migrations | `backend/src/main/resources/db/migration/` |
| Seed data | `backend/SEED_DATA_COMPLETE.sql` |
| Audit report | `AUDIT_REPORT.json` |
| DB inspection SQL | `psql_inspection.sql` |

---

## Environment Variables Cheat Sheet

### Development
```powershell
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/sgms"
$env:APP_SECURITY_JWT_SECRET = "dev-secret-$(Get-Random)"
$env:SPRING_PROFILES_ACTIVE = "local"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173"
$env:VITE_API_BASE_URL = "http://localhost:8080/api"
```

### Production (Railway/Cloud)
```bash
APP_SECURITY_JWT_SECRET=<generate-strong-random-key>
DATABASE_URL=<provided-by-railway>
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

---

## Verification Commands

```powershell
# Database row counts
psql -U postgres -d sgms -c "SELECT 'users' as table, COUNT(*) FROM users UNION ALL SELECT 'guards', COUNT(*) FROM guards;"

# Flyway migration status
psql -U postgres -d sgms -c "SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;"

# Backend compilation
cd backend; mvn compile; cd ..

# Frontend dependencies
npm list --depth=0

# Run all checks
python sgms_auditor.py
```

---

## Production Deploy Commands

### Railway
```powershell
# Install CLI
npm install -g @railway/cli

# Backend
cd backend
railway init
railway up

# Frontend  
cd ..
npm run build
railway init
railway up
```

### Manual Server
```powershell
# Build backend JAR
cd backend
mvn clean package -DskipTests

# Run production JAR
java -jar target/sgms-*.jar

# Build frontend
npm run build

# Serve frontend (use nginx, caddy, or express)
npx serve dist -p 80
```

---

## Most Common Workflow

```powershell
# Daily development

# Start backend (Terminal 1)
cd backend
mvn spring-boot:run

# Start frontend (Terminal 2)
npm run dev

# Access at http://localhost:5173
# Login with: admin@zpluse.com / Admin@123
```

---

**TIP**: Bookmark this file for instant reference!
