# SGMS Development Roadmap

**Project**: Security Guard Management System (SGMS)  
**Status**: LIVE PRODUCTION  
**Backend URL**: https://sgms-backend-production.up.railway.app  
**Last Updated**: February 17, 2026

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack
- **Backend**: Spring Boot 3.3.5
- **Database**: PostgreSQL (Railway Production)
- **Security**: Spring Security + JWT (Stateless)
- **Frontend**: React + Vite (Netlify)
- **Deployment**: Railway (Backend), Netlify (Frontend)

### Architecture Pattern
```
Controller → Service → Repository → Entity
         ↓         ↓
        DTO   ApiResponse<T>
```

### Security Model
- **Authentication**: JWT Bearer Token
- **Roles**: ADMIN, SUPERVISOR, GUARD, CLIENT
- **Public Endpoints**: `/api/auth/login`, `/api/auth/register`
- **Protected**: All other business endpoints

---

## 📊 DATABASE STRUCTURE

### Current Tables (PHASE 1 & 2 Complete)

#### Core Authentication
- **roles** - System roles (ADMIN, SUPERVISOR, GUARD, CLIENT)
- **users** - All system users
- **user_roles** - Many-to-many role mapping

#### Guard Management
- **guards** - Guard employee records
  - Links to users table
  - Tracks: employee_code, salary, hire_date, supervisor
  
#### Client & Site Management (PHASE 2 ✅)
- **client_accounts** - Client organizations
- **sites** - Physical locations owned by clients
  - Foreign key: client_account_id
  - Geolocation: latitude, longitude
  - Status tracking

---

## 🎯 DEVELOPMENT PHASES

### ✅ PHASE 1 — Platform Stabilization (COMPLETE)
**Status**: Deployed to Production

**Features**:
- Global exception handler
- ApiResponse<T> wrapper
- Request/response logging
- Health check endpoint
- JWT authentication
- Role-based authorization
- Startup validation

**Endpoints**:
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

---

### ✅ PHASE 2 — Site Management (COMPLETE)
**Status**: Deployed to Production

**Database Tables**:
- `client_accounts`
- `sites`

**Features**:
- Create/read client accounts
- Create/read sites
- Link sites to clients
- ADMIN-only access

**Endpoints**:
- `POST /api/clients` - Create client
- `GET /api/clients` - List all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/sites` - Create site
- `GET /api/sites` - List all sites (with optional client filter)
- `GET /api/sites/{id}` - Get site by ID

**Files Created**:
- `ClientAccountEntity.java`
- `ClientAccountDTO.java`
- `ClientAccountRepository.java`
- `ClientAccountService.java`
- `ClientController.java`
- `SiteEntity.java`
- `SiteDTO.java`
- `SiteRepository.java`
- `SiteService.java`
- `SiteController.java`

---

### 🚧 PHASE 3 — Site Post Management (IN PROGRESS)
**Status**: NEXT IMPLEMENTATION

**Database Tables** (To be created via SQL migration):
```sql
-- Posts within a site (guard duty stations)
CREATE TABLE site_posts (
  id BIGSERIAL PRIMARY KEY,
  site_id BIGINT NOT NULL,
  post_name VARCHAR(255) NOT NULL,
  description TEXT,
  required_guards INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  CONSTRAINT fk_site_posts_site 
    FOREIGN KEY (site_id) 
    REFERENCES sites(id) 
    ON DELETE RESTRICT,
    
  CONSTRAINT uq_site_posts_site_post_name 
    UNIQUE (site_id, post_name)
);

-- Supervisor to site assignment
CREATE TABLE supervisor_site_mapping (
  id BIGSERIAL PRIMARY KEY,
  supervisor_user_id BIGINT NOT NULL,
  site_id BIGINT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMPTZ,
  
  CONSTRAINT fk_supervisor_site_supervisor 
    FOREIGN KEY (supervisor_user_id) 
    REFERENCES users(id) 
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_supervisor_site_site 
    FOREIGN KEY (site_id) 
    REFERENCES sites(id) 
    ON DELETE RESTRICT,
    
  CONSTRAINT uq_supervisor_site_active 
    UNIQUE (supervisor_user_id, site_id)
);

-- Client access to specific sites
CREATE TABLE client_site_access (
  id BIGSERIAL PRIMARY KEY,
  client_user_id BIGINT NOT NULL,
  site_id BIGINT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  
  CONSTRAINT fk_client_site_client 
    FOREIGN KEY (client_user_id) 
    REFERENCES users(id) 
    ON DELETE RESTRICT,
    
  CONSTRAINT fk_client_site_site 
    FOREIGN KEY (site_id) 
    REFERENCES sites(id) 
    ON DELETE RESTRICT,
    
  CONSTRAINT uq_client_site_active 
    UNIQUE (client_user_id, site_id)
);
```

**Features**:
1. **Site Post Management**
   - Create posts within a site (e.g., "Main Gate", "Lobby")
   - Define how many guards needed per post
   - Update/delete posts
   
2. **Supervisor Site Assignment**
   - Assign supervisor to oversee specific sites
   - One supervisor can manage multiple sites
   - Track assignment history
   
3. **Client Site Access**
   - Grant client users access to view specific sites
   - Revoke access when needed
   - Track access grants

**Endpoints** (To be implemented):
```
Site Posts:
POST   /api/site-posts              - Create post in a site (ADMIN, SUPERVISOR)
GET    /api/site-posts/site/{siteId} - Get all posts for a site
GET    /api/site-posts/{id}          - Get post details
PUT    /api/site-posts/{id}          - Update post
DELETE /api/site-posts/{id}          - Soft delete post

Supervisor Assignment:
POST   /api/supervisor/assign-site   - Assign supervisor to site (ADMIN)
GET    /api/supervisor/sites         - Get sites for logged-in supervisor
DELETE /api/supervisor/remove-site/{siteId} - Remove supervisor from site

Client Access:
POST   /api/client/grant-access      - Grant client access to site (ADMIN)
GET    /api/client/sites             - Get sites accessible to client
DELETE /api/client/revoke-access/{siteId} - Revoke client access
```

**Files to Create**:
- `SitePostEntity.java`
- `SupervisorSiteMappingEntity.java`
- `ClientSiteAccessEntity.java`
- `SitePostDTO.java`
- `SupervisorSiteDTO.java`
- `ClientSiteAccessDTO.java`
- `SitePostRepository.java`
- `SupervisorSiteRepository.java`
- `ClientSiteAccessRepository.java`
- `SitePostService.java`
- `SupervisorSiteService.java`
- `ClientSiteAccessService.java`
- `SitePostController.java`
- `SupervisorController.java`
- `ClientAccessController.java`

**Authorization**:
- Site Post CRUD: ADMIN, SUPERVISOR (own sites only)
- Supervisor Assignment: ADMIN only
- Client Access: ADMIN only
- View Own Sites: SUPERVISOR, CLIENT (own sites only)

---

### 🔜 PHASE 4 — Guard Post Assignment
**Status**: Planned

**Database Changes**:
Add columns to `guards` table:
```sql
ALTER TABLE guards 
ADD COLUMN current_site_post_id BIGINT,
ADD CONSTRAINT fk_guards_site_post 
  FOREIGN KEY (current_site_post_id) 
  REFERENCES site_posts(id) 
  ON DELETE SET NULL;
```

OR create separate assignment table:
```sql
CREATE TABLE guard_assignments (
  id BIGSERIAL PRIMARY KEY,
  guard_id BIGINT NOT NULL,
  site_post_id BIGINT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMPTZ,
  
  CONSTRAINT fk_guard_assignment_guard 
    FOREIGN KEY (guard_id) 
    REFERENCES guards(id),
    
  CONSTRAINT fk_guard_assignment_post 
    FOREIGN KEY (site_post_id) 
    REFERENCES site_posts(id)
);
```

**Features**:
- Assign guard to specific post
- Reassign guard to different post
- Remove guard from post
- View all guards at a site
- View guard assignment history

**Endpoints**:
```
POST   /api/guards/{guardId}/assign/{postId}  - Assign guard to post
DELETE /api/guards/{guardId}/unassign         - Remove guard from current post
GET    /api/site-posts/{postId}/guards        - Get guards at specific post
GET    /api/guards/{guardId}/assignment       - Get current assignment
```

---

### 🔜 PHASE 5 — Attendance Engine
**Status**: Planned

**Database Tables**:
```sql
CREATE TABLE attendance_logs (
  id BIGSERIAL PRIMARY KEY,
  guard_id BIGINT NOT NULL,
  site_post_id BIGINT NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_in_latitude DECIMAL(10,8),
  check_in_longitude DECIMAL(11,8),
  check_out_latitude DECIMAL(10,8),
  check_out_longitude DECIMAL(11,8),
  status VARCHAR(20) NOT NULL, -- ON_DUTY, OFF_DUTY, LATE, ABSENT
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_attendance_guard 
    FOREIGN KEY (guard_id) 
    REFERENCES guards(id),
    
  CONSTRAINT fk_attendance_post 
    FOREIGN KEY (site_post_id) 
    REFERENCES site_posts(id)
);
```

**Features**:
- Guard check-in with GPS
- Guard check-out with GPS
- Auto-detect late arrivals
- Mark absent guards
- Daily attendance reports
- Overtime calculations

**Endpoints**:
```
POST /api/attendance/check-in   - Guard checks in (GUARD)
POST /api/attendance/check-out  - Guard checks out (GUARD)
GET  /api/attendance/guard/{guardId} - Get attendance history
GET  /api/attendance/site/{siteId}   - Get site attendance report
GET  /api/attendance/today           - Today's attendance summary
```

---

### 🔜 PHASE 6 — Live Tracking Engine
**Status**: Planned

**Database Tables**:
```sql
CREATE TABLE tracking_logs (
  id BIGSERIAL PRIMARY KEY,
  guard_id BIGINT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  battery_level INT,
  is_within_geofence BOOLEAN,
  
  CONSTRAINT fk_tracking_guard 
    FOREIGN KEY (guard_id) 
    REFERENCES guards(id)
);
```

**Features**:
- Real-time GPS tracking
- Periodic location pings (every 5-15 minutes)
- Geofence violation detection
- Offline guard detection
- Live map view for supervisors

**Endpoints**:
```
POST /api/tracking/ping              - Guard sends GPS update (GUARD)
GET  /api/tracking/guard/{guardId}   - Get guard's current location
GET  /api/tracking/site/{siteId}     - Get all guards' locations at site
GET  /api/tracking/live              - Live tracking for supervisor
```

---

### 🔜 PHASE 7 — Client Portal
**Status**: Planned

**Features**:
- Client dashboard with site overview
- View guards assigned to their sites
- View attendance reports
- Download monthly reports
- View incident logs (future)

**Endpoints**:
```
GET /api/client/dashboard          - Client dashboard data
GET /api/client/sites              - Get sites accessible to client
GET /api/client/guards/{siteId}    - Get guards at specific site
GET /api/client/attendance/{siteId} - Get attendance report for site
GET /api/client/reports/monthly    - Download monthly report
```

---

### 🔜 PHASE 8 — Scheduling System
**Status**: Planned

**Database Tables**:
```sql
CREATE TABLE shifts (
  id BIGSERIAL PRIMARY KEY,
  site_post_id BIGINT NOT NULL,
  shift_name VARCHAR(100) NOT NULL, -- Morning, Evening, Night
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week VARCHAR(50), -- JSON or comma-separated
  
  CONSTRAINT fk_shifts_post 
    FOREIGN KEY (site_post_id) 
    REFERENCES site_posts(id)
);

CREATE TABLE guard_schedule (
  id BIGSERIAL PRIMARY KEY,
  guard_id BIGINT NOT NULL,
  shift_id BIGINT NOT NULL,
  schedule_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- SCHEDULED, COMPLETED, CANCELLED
  
  CONSTRAINT fk_schedule_guard 
    FOREIGN KEY (guard_id) 
    REFERENCES guards(id),
    
  CONSTRAINT fk_schedule_shift 
    FOREIGN KEY (shift_id) 
    REFERENCES shifts(id),
    
  CONSTRAINT uq_guard_schedule 
    UNIQUE (guard_id, schedule_date, shift_id)
);
```

**Features**:
- Define shift patterns
- Schedule guards to shifts
- Recurring schedules
- Shift swapping
- Schedule conflicts detection

---

### 🔜 PHASE 9 — Payroll Module
**Status**: Planned

**Features**:
- Calculate monthly salary
- Overtime pay calculation
- Deductions tracking
- Payslip generation
- Salary disbursement tracking

---

### 🔜 PHASE 10 — Reporting & Analytics
**Status**: Planned

**Features**:
- Attendance reports
- Performance reports
- Site activity reports
- Guard utilization metrics
- Client billing reports

---

## 🔒 CRITICAL RULES

### Database Migration Rules
1. **NEVER** use Hibernate auto DDL (`ddl-auto=create` or `update`)
2. **ALWAYS** use `ddl-auto=none` in production
3. **ALWAYS** write SQL migrations manually
4. **EXECUTE** migrations on Railway PostgreSQL BEFORE deploying code
5. If entity doesn't match table → **FIX THE ENTITY**, not the database

### Development Process
1. Write SQL migration script
2. Test migration on local PostgreSQL
3. Create Entity matching exact table structure
4. Create DTOs for API
5. Create Repository
6. Create Service with business logic
7. Create Controller with endpoints
8. Add @PreAuthorize for authorization
9. **VERIFY**: Application compiles
10. **VERIFY**: Application starts
11. **VERIFY**: Endpoints work
12. **VERIFY**: Database queries succeed

### Code Quality Rules
- **Controller** → Service → Repository → Entity (never skip layers)
- **Never** return Entity from API (always use DTO)
- **Always** wrap responses in `ApiResponse<T>`
- **Always** validate input using DTOs
- **@Transactional** only in Service layer
- **Proper exception handling** with meaningful messages

### Security Rules
- `/api/auth/login` and `/api/auth/register` → PUBLIC
- All other endpoints → AUTHENTICATED
- Use `@PreAuthorize("hasRole('ADMIN')")` for role restrictions
- JWT token in `Authorization: Bearer <token>` header
- Token expiration: configured in application.yml

---

## 📝 FRONTEND INTEGRATION

### Authentication Flow
```javascript
// Login
const response = await fetch('https://sgms-backend-production.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const result = await response.json();
if (result.success) {
  localStorage.setItem('token', result.data.token);
  localStorage.setItem('user', JSON.stringify(result.data));
}
```

### API Call Pattern
```javascript
const token = localStorage.getItem('token');

const response = await fetch('https://sgms-backend-production.up.railway.app/api/clients', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
if (result.success) {
  const clients = result.data; // Extract data from ApiResponse wrapper
}
```

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying any phase:

1. ✅ SQL migration script created and tested
2. ✅ Migration executed on Railway PostgreSQL
3. ✅ All entities match database tables exactly
4. ✅ Application compiles (`mvnw clean package`)
5. ✅ No compilation errors
6. ✅ StartupValidation updated to check new tables
7. ✅ All endpoints secured with @PreAuthorize
8. ✅ Health check passes
9. ✅ Documentation updated
10. ✅ Example curl tests provided

---

## 📊 PROGRESS TRACKING

| Phase | Status | Completion Date | Tables Created | Endpoints Added |
|-------|--------|----------------|----------------|-----------------|
| PHASE 1 - Platform | ✅ Complete | Feb 2026 | users, roles, user_roles, guards | 3 |
| PHASE 2 - Site Mgmt | ✅ Complete | Feb 2026 | client_accounts, sites | 6 |
| PHASE 3 - Post Mgmt | 🚧 In Progress | - | - | - |
| PHASE 4 - Guard Assignment | 🔜 Planned | - | - | - |
| PHASE 5 - Attendance | 🔜 Planned | - | - | - |
| PHASE 6 - Live Tracking | 🔜 Planned | - | - | - |
| PHASE 7 - Client Portal | 🔜 Planned | - | - | - |
| PHASE 8 - Scheduling | 🔜 Planned | - | - | - |
| PHASE 9 - Payroll | 🔜 Planned | - | - | - |
| PHASE 10 - Reporting | 🔜 Planned | - | - | - |

---

**END OF ROADMAP**

This roadmap will be updated after each phase completion.
