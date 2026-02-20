# SGMS Production Stabilization & Refactoring Plan

**Project**: Security Guard Management System (SGMS)  
**Status**: LIVE Production System  
**Date**: February 18, 2026  
**Engineer**: Lead Production Engineer  

---

## 🎯 MISSION

Transform SGMS from a terminal-operated backend into a complete SaaS web application with proper dashboards and CRUD panels while maintaining 100% backward compatibility and zero downtime.

---

## 📊 CURRENT STATE ANALYSIS

### Infrastructure
- **Backend**: Spring Boot 3.3.5 on Railway (PostgreSQL)
- **Frontend**: React + Vite on Netlify
- **Authentication**: Mixed (JWT backend + Firebase frontend)
- **Database**: PostgreSQL on Railway
- **Status**: LIVE, serving production traffic

### Critical Issues Identified: 27 Total

| Category | Count | Severity |
|----------|-------|----------|
| Critical Security | 3 | 🔴 HIGH |
| Java Compilation Errors | 9 | 🟠 MEDIUM |
| Configuration Issues | 3 | 🟠 MEDIUM |
| Code Quality | 2 | 🟡 LOW |
| Missing Documentation | 3 | 🟡 LOW |
| Runtime Issues | 3 | 🟠 MEDIUM |
| Frontend/UX | 2 | 🟡 LOW |
| Operational | 2 | 🟡 LOW |

---

## 🚨 PHASE 0: PRODUCTION STABILIZATION (MANDATORY)

**Objective**: Fix all critical issues, ensure system stability, zero compilation errors

### 0.1 SECURITY FIXES (Priority: CRITICAL)

#### Issue #1: Exposed Firebase API Keys
**File**: `src/config/firebase.js`  
**Problem**: Hardcoded API keys in source code  
**Impact**: Public access to Firebase project  

**Fix**:
1. Create `.env` file structure
2. Move all Firebase config to `VITE_` environment variables
3. Update `firebase.js` to use `import.meta.env`
4. Add `.env` to `.gitignore` (already done)
5. Update deployment with environment variables

**Files to Modify**:
- `src/config/firebase.js`
- `.env` (create)
- `.env.example` (update)

#### Issue #2: Hardcoded API URL
**File**: `src/config/api.js`  
**Problem**: Hardcoded backend URL  
**Impact**: Cannot switch environments  

**Fix**:
1. Add `VITE_API_BASE_URL` to environment variables
2. Update `api.js` to use environment variable with fallback

**Files to Modify**:
- `src/config/api.js`
- `.env` (update)

#### Issue #3: Railway Environment Variables
**Files**: Railway Dashboard  
**Problem**: Need to verify all required variables exist  

**Required Variables**:
- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL` (auto-generated)
- `APP_SECURITY_JWT_SECRET` (256+ bits)
- `JWT_ACCESS_TTL_SECONDS=86400`

**Action**: Document verification steps for user

---

### 0.2 DEPENDENCY UPGRADE (Priority: HIGH)

#### Issue #4: Spring Boot EOL
**File**: `backend/pom.xml`  
**Current**: Spring Boot 3.3.5 (EOL: June 30, 2025)  
**Target**: Spring Boot 3.4.2 (latest stable)  
**Date**: February 18, 2026 (8 months past EOL)  

**Fix**:
1. Update Spring Boot parent version to 3.4.2
2. Test compilation
3. Test startup
4. Verify all endpoints work

**Files to Modify**:
- `backend/pom.xml`

**Testing Required**:
- Build: `mvn clean package`
- Startup: Verify logs
- Health check: `/actuator/health`

#### Issue #5: SNAPSHOT Version
**File**: `backend/pom.xml`  
**Current**: `0.0.1-SNAPSHOT`  
**Target**: `1.0.0`  

**Fix**: Update artifact version to stable release

---

### 0.3 JAVA CODE FIXES (Priority: HIGH)

#### Issue #6-14: @NonNull Annotations & Null Safety
**Files**:
1. `backend/src/main/java/com/sgms/security/JwtAuthenticationFilter.java` (4 warnings)
2. `backend/src/main/java/com/sgms/config/RequestLoggingFilter.java` (4 warnings)
3. `backend/src/main/java/com/sgms/config/StartupValidation.java` (1 warning)
4. `backend/src/main/java/com/sgms/site/ClientSiteAccessService.java` (2 warnings)
5. `backend/src/main/java/com/sgms/guard/GuardService.java` (5 warnings)
6. `backend/src/main/java/com/sgms/site/SupervisorSiteService.java` (2 warnings)
7. `backend/src/main/java/com/sgms/site/SitePostService.java` (1 warning)

**Fix Strategy**:
Add `@NonNull` annotations to inherited method parameters from Spring framework classes.

**Example**:
```java
@Override
protected void doFilterInternal(
    @NonNull HttpServletRequest request,
    @NonNull HttpServletResponse response,
    @NonNull FilterChain filterChain) throws ServletException, IOException {
```

**Dependency Required**:
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-lang</artifactId>
</dependency>
```

---

### 0.4 CONFIGURATION FIXES (Priority: MEDIUM)

#### Issue #15-17: YAML Property Escaping
**Files**:
- `backend/src/main/resources/application-local.yml`
- `backend/src/main/resources/application-prod.yml`
- `backend/src/main/resources/application.yml`

**Problems**:
- Properties with dots need escaping: `format_sql`, `time_zone`
- Unknown custom property warnings: `app.*` properties

**Fix**:
1. Add quotes around dotted properties
2. Register custom properties in `@ConfigurationProperties` class

#### Issue #18: CORS Credentials Conflict
**File**: `backend/src/main/java/com/sgms/security/SecurityConfig.java`  
**Line**: 107  
**Problem**: `setAllowCredentials(false)` blocks authenticated requests  

**Fix**: Change to `setAllowCredentials(true)` for JWT authentication

---

### 0.5 DATABASE VERIFICATION (Priority: HIGH)

#### Issue #19: Unverified Phase 3 Migration
**File**: `backend/V2__phase3_site_posts.sql`  
**Problem**: No confirmation migration was executed on Railway PostgreSQL  

**Required Tables**:
1. `site_posts`
2. `supervisor_site_mapping`
3. `client_site_access`

**Fix**:
1. Add verification to `StartupValidation.java`
2. Check for all Phase 3 tables
3. Fail startup if missing
4. Provide clear error message with migration instructions

**Files to Modify**:
- `backend/src/main/java/com/sgms/config/StartupValidation.java`

---

### 0.6 FRONTEND CLEANUP (Priority: LOW)

#### Issue #20: Console Logging in Production
**Files**:
- `src/services/firestoreService.js` (22+ console.error)
- `src/pages/ForgotPassword.jsx`

**Fix**:
1. Create centralized error logging utility
2. Replace all `console.error` with proper error handling
3. Use environment-aware logging (dev only)

#### Issue #21: Missing Favicon
**File**: `index.html`  
**Fix**: Replace Vite logo with company branded icon

---

## 🔐 PHASE 1: AUTHENTICATION STANDARDIZATION

**Objective**: Single source of truth for authentication (Backend JWT only)

### Current Architecture Problem
- **Frontend**: Uses Firebase Auth + Backend JWT
- **Backend**: JWT authentication
- **Confusion**: Two authentication systems

### Target Architecture
- **Primary**: Backend JWT (/api/auth/login, /api/auth/register)
- **Identity Store**: PostgreSQL users table
- **Firebase**: Remove from authentication flow (optional: keep for file storage only)

### Implementation Steps

#### 1.1 Remove Firebase Authentication
**Files to Remove/Modify**:
- `src/contexts/AuthContext.jsx` - Rewrite to use backend only
- `src/components/auth/Login.jsx` - Use authService.login()
- `src/components/auth/Register.jsx` - Use backend registration
- `src/services/firestoreService.js` - Remove or archive

#### 1.2 Implement Backend-Only Auth Flow
**New/Modified Files**:
- `src/contexts/AuthContext.jsx` - Use backend JWT
- `src/services/authService.js` - Already correct, enhance
- `src/services/apiClient.js` - Already correct, enhance with refresh token

#### 1.3 Token Management
**Features to Implement**:
- Store JWT in localStorage (current: ✅)
- Automatic token refresh (5 min before expiry)
- Automatic logout on 401
- Redirect to login on unauthorized

#### 1.4 Role-Based Routing
**Create**:
- `src/components/auth/ProtectedRoute.jsx` (exists, verify)
- `src/components/auth/RoleRoute.jsx` (new)

**Roles**:
- ADMIN
- SUPERVISOR
- GUARD
- CLIENT

#### 1.5 Route Guards
```jsx
<Route path="/admin/*" element={<RoleRoute allowedRoles={['ADMIN']} />}>
  <Route path="dashboard" element={<AdminDashboard />} />
</Route>
```

---

## 🎛️ PHASE 2: ADMIN DASHBOARD

**Objective**: Complete Admin Control Panel for system management

### Dashboard Structure
```
/admin
├── /dashboard          # Overview, stats
├── /users              # User management CRUD
├── /clients            # Client accounts CRUD
├── /sites              # Sites CRUD
├── /site-posts         # Posts CRUD
├── /supervisor-assign  # Supervisor → Site mapping
└── /client-access      # Client → Site access grants
```

### 2.1 Users Panel

**Features**:
- List all users (table with pagination)
- Create user (form: email, password, fullName, phone, role)
- Edit user (update details, change role)
- Activate/Deactivate user (soft delete)
- Search/Filter by role, status

**Backend APIs** (verify existence):
- `GET /api/users` - List all
- `POST /api/users` - Create
- `PUT /api/users/{id}` - Update
- `DELETE /api/users/{id}` - Soft delete
- `POST /api/users/{id}/roles` - Assign role

**UI Components**:
- UsersList.jsx
- UserForm.jsx (create/edit)
- UserRow.jsx
- UserFilters.jsx

### 2.2 Clients Panel

**Features**:
- List all client accounts
- Create client
- Edit client details
- Deactivate client
- View assigned sites

**Backend APIs**:
- `GET /api/clients` - List
- `POST /api/clients` - Create
- `PUT /api/clients/{id}` - Update
- `DELETE /api/clients/{id}` - Soft delete

**UI Components**:
- ClientsList.jsx
- ClientForm.jsx
- ClientCard.jsx

### 2.3 Sites Panel

**Features**:
- List all sites
- Filter by client
- Create site
- Edit site
- Deactivate site
- View posts in site

**Backend APIs**:
- `GET /api/sites` - List all
- `GET /api/sites?clientId={id}` - By client
- `POST /api/sites` - Create
- `PUT /api/sites/{id}` - Update
- `DELETE /api/sites/{id}` - Soft delete

### 2.4 Site Posts Panel

**Features**:
- List posts by site
- Create post
- Edit post (name, description, required_guards)
- Set post status (ACTIVE/INACTIVE)

**Backend APIs**:
- `GET /api/sites/{siteId}/posts` - List posts
- `POST /api/sites/{siteId}/posts` - Create
- `PUT /api/posts/{id}` - Update
- `DELETE /api/posts/{id}` - Soft delete

### 2.5 Supervisor Assignment Panel

**Features**:
- View supervisor → site mappings
- Assign supervisor to site
- Remove assignment

**Backend APIs**:
- `GET /api/supervisor-sites` - List assignments
- `POST /api/supervisor-sites` - Assign
- `DELETE /api/supervisor-sites/{id}` - Remove

### 2.6 Client Access Panel

**Features**:
- Grant client access to site
- Revoke client access
- View client's accessible sites

**Backend APIs**:
- `GET /api/client-site-access` - List access
- `POST /api/client-site-access` - Grant
- `DELETE /api/client-site-access/{id}` - Revoke

---

## 👔 PHASE 3: SUPERVISOR DASHBOARD

**Objective**: Supervisor site management interface

### Features
- View assigned sites (GET /api/supervisor-sites?supervisorId={id})
- View posts in assigned sites
- Assign guards to posts
- View guard attendance
- Monitor guard status

**Route**: `/supervisor/dashboard`

---

## 👮 PHASE 4: GUARD DASHBOARD

**Objective**: Guard self-service panel

### Features
- View my duty post
- Check-in to shift
- Check-out from shift
- View attendance history
- View current assignment

**APIs Needed**:
- `GET /api/guards/me` - My profile
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/history` - My attendance

**Route**: `/guard/dashboard`

---

## 👤 PHASE 5: CLIENT DASHBOARD

**Objective**: Client reporting and monitoring

### Features
- View my accessible sites
- View deployed guards at my sites
- View attendance reports
- Export reports

**APIs**:
- `GET /api/client-site-access?clientId={id}` - My sites
- `GET /api/sites/{id}/guards` - Guards at site
- `GET /api/sites/{id}/attendance` - Attendance report

**Route**: `/client/dashboard`

---

## 🏗️ FRONTEND ARCHITECTURE REQUIREMENTS

### Service Layer Structure
```
src/
├── services/
│   ├── apiClient.js        # Centralized HTTP client (exists ✅)
│   ├── authService.js      # Auth operations (exists ✅)
│   ├── userService.js      # User CRUD (create)
│   ├── clientService.js    # Client CRUD (exists)
│   ├── siteService.js      # Site CRUD (exists)
│   ├── guardService.js     # Guard CRUD (exists)
│   ├── postService.js      # Post CRUD (create)
│   └── errorHandler.js     # Centralized error handling (exists)
```

### Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.jsx    # React error boundary (create)
│   │   ├── LoadingSpinner.jsx   # Loading states (create)
│   │   └── HealthCheck.jsx      # Backend health monitor (create)
│   ├── admin/
│   │   ├── UserPanel.jsx
│   │   ├── ClientPanel.jsx
│   │   └── SitePanel.jsx
│   ├── supervisor/
│   │   └── SupervisorDashboard.jsx
│   ├── guard/
│   │   └── GuardDashboard.jsx
│   └── client/
│       └── ClientDashboard.jsx
```

### Critical Frontend Changes

#### Remove Firestore Dependency
**Action**: Remove or replace all Firestore operations

**Files to Modify**:
- `src/services/firestoreService.js` - Deprecate or remove
- Any component importing from Firestore - Refactor to use backend APIs

**Reason**: PostgreSQL backend is single source of truth

#### Add Error Boundary
```jsx
// src/components/common/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  // Catch React errors gracefully
}
```

#### Add Backend Health Check
```jsx
// src/components/common/HealthCheck.jsx
// Check /actuator/health before login
```

---

## 📋 VERIFICATION CHECKLIST

### Phase 0 Complete When:
- [ ] No compilation errors
- [ ] No Java warnings
- [ ] Spring Boot upgraded to 3.4.x
- [ ] All secrets in environment variables
- [ ] .env file structure created
- [ ] Database tables verified
- [ ] YAML warnings fixed
- [ ] CORS credentials enabled
- [ ] Console logs removed/replaced
- [ ] Build succeeds: `mvn clean package`
- [ ] Startup succeeds: `java -jar target/*.jar`
- [ ] Health check passes: `curl /actuator/health`

### Phase 1 Complete When:
- [ ] Firebase removed from auth flow
- [ ] Login uses backend JWT only
- [ ] Token refresh implemented
- [ ] Auto-logout on 401 works
- [ ] Role-based routing works
- [ ] Protected routes enforce authentication
- [ ] All roles can login and access dashboard

### Phase 2 Complete When:
- [ ] Admin can create users via UI
- [ ] Admin can assign roles via UI
- [ ] Admin can manage clients via UI
- [ ] Admin can manage sites via UI
- [ ] Admin can create posts via UI
- [ ] Admin can assign supervisors via UI
- [ ] Admin can grant client access via UI
- [ ] No terminal/Postman needed for admin tasks

### Phase 3-5 Complete When:
- [ ] Supervisor sees assigned sites
- [ ] Guard can check-in/out
- [ ] Client sees accessible sites
- [ ] All dashboards functional

---

## 🚀 DEPLOYMENT STRATEGY

### Development Workflow
1. Create feature branch
2. Make changes
3. Test locally
4. Verify build
5. Merge to main
6. Deploy to Railway (backend auto-deploy)
7. Deploy to Netlify (frontend auto-deploy)

### Rollback Plan
- Git revert capability
- Railway rollback to previous deployment
- Netlify rollback to previous deployment

### Zero-Downtime Requirements
- Database migrations are additive only
- API changes are backward compatible
- Old frontend works with new backend
- No breaking changes to contracts

---

## 📊 PROGRESS TRACKING

| Phase | Status | Completion Date |
|-------|--------|----------------|
| Phase 0: Stabilization | 🔄 IN PROGRESS | - |
| Phase 1: Auth Standardization | ⏸️ PENDING | - |
| Phase 2: Admin Dashboard | ⏸️ PENDING | - |
| Phase 3: Supervisor Dashboard | ⏸️ PENDING | - |
| Phase 4: Guard Dashboard | ⏸️ PENDING | - |
| Phase 5: Client Dashboard | ⏸️ PENDING | - |

---

## 🎯 SUCCESS CRITERIA

### Technical
- Zero compilation errors
- Zero runtime errors on startup
- 100% API endpoint coverage
- All database tables verified
- All environments configurable
- No hardcoded secrets
- Clean security audit

### Functional
- Admin can manage entire system via UI
- Supervisor can manage assigned sites via UI
- Guards can self-serve via UI
- Clients can view their data via UI
- No terminal access required for operations

### Operational
- System remains online during all changes
- Backward compatibility maintained
- Rollback capability verified
- Documentation complete

---

## 📝 NEXT STEPS

1. ✅ Create this fix plan document
2. 🔄 Execute Phase 0.1: Security fixes
3. ⏸️ Execute Phase 0.2: Spring Boot upgrade
4. ⏸️ Execute Phase 0.3: Java code fixes
5. ⏸️ Execute Phase 0.4: Configuration fixes
6. ⏸️ Execute Phase 0.5: Database verification
7. ⏸️ Execute Phase 0.6: Frontend cleanup
8. ⏸️ Verify Phase 0 complete
9. ⏸️ Begin Phase 1

---

**Document Version**: 1.0  
**Last Updated**: February 18, 2026  
**Status**: Active Development  
