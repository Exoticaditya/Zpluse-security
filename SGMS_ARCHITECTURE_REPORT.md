# SGMS Architecture Report
**Security Guard Management System - Comprehensive Architecture Analysis**  
**Generated**: February 20, 2026  
**Version**: 1.0.0

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Database Schema](#database-schema)
5. [Security Architecture](#security-architecture)
6. [Deployment Architecture](#deployment-architecture)
7. [API Documentation](#api-documentation)

---

## System Overview

### Technology Stack

**Backend**:
- Framework: Spring Boot 3.4.2
- Language: Java 17
- Build Tool: Maven
- Database: PostgreSQL (Railway)
- ORM: Spring Data JPA + Hibernate
- Migration: Flyway
- Security: Spring Security + JWT
- Architecture: RESTful API

**Frontend**:
- Framework: React 18
- Build Tool: Vite 5.4.21
- Routing: React Router v6
- UI Library: Tailwind CSS + Framer Motion
- Deployment: Netlify
- Authentication: JWT (stateless)

**Infrastructure**:
- Database Hosting: Railway (PostgreSQL)
- Backend Hosting: Railway
- Frontend Hosting: Netlify
- CDN: Netlify CDN

---

## Backend Architecture

### Package Structure

```
com.sgms/
├── SgmsBackendApplication.java (Main)
├── assignment/
│   ├── AssignmentController.java
│   ├── AssignmentService.java
│   ├── AssignmentRepository.java
│   ├── GuardAssignmentEntity.java
│   ├── ShiftTypeEntity.java
│   └── ShiftTypeRepository.java
├── attendance/
│   ├── AttendanceController.java
│   ├── AttendanceService.java
│   ├── AttendanceRepository.java
│   ├── AttendanceEntity.java
│   └── AttendanceStatus.java (enum)
├── auth/
│   ├── AuthController.java
│   ├── AuthService.java
│   └── dto/ (LoginRequest, LoginResponse, RegisterRequest)
├── client/
│   ├── ClientController.java
│   ├── ClientService.java
│   ├── ClientRepository.java
│   └── ClientAccountEntity.java
├── config/
│   ├── RailwayPostgresConfig.java
│   ├── StartupValidator.java
│   └── WebConfig.java
├── guard/
│   ├── GuardController.java
│   ├── GuardService.java
│   ├── GuardRepository.java
│   └── GuardEntity.java
├── security/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   ├── CustomAuthenticationEntryPoint.java
│   └── SecurityUser.java
├── site/
│   ├── SiteController.java
│   ├── SiteService.java
│   ├── SiteRepository.java
│   ├── SiteEntity.java
│   ├── SitePostController.java
│   ├── SitePostService.java
│   ├── SitePostRepository.java
│   ├── SitePostEntity.java
│   ├── SupervisorSiteMappingEntity.java
│   └── ClientSiteAccessEntity.java
└── user/
    ├── UserController.java
    ├── UserService.java
    ├── UserRepository.java
    ├── UserEntity.java
    ├── RoleEntity.java
    └── RoleRepository.java
```

### Controllers (REST API Endpoints)

1. **AuthController** (`/api/auth`)
   - POST `/login` - User authentication
   - POST `/register` - User registration
   - GET `/me` - Get current user info

2. **GuardController** (`/api/guards`)
   - GET `/` - List all guards
   - GET `/{id}` - Get guard by ID
   - POST `/` - Create guard
   - PUT `/{id}` - Update guard
   - DELETE `/{id}` - Delete guard (soft)

3. **ClientController** (`/api/clients`)
   - GET `/` - List all clients
   - GET `/{id}` - Get client by ID
   - POST `/` - Create client
   - PUT `/{id}` - Update client
   - DELETE `/{id}` - Delete client (soft)

4. **SiteController** (`/api/sites`)
   - GET `/` - List all sites
   - GET `/{id}` - Get site by ID
   - GET `/client/{clientId}` - Get sites by client
   - POST `/` - Create site
   - PUT `/{id}` - Update site
   - DELETE `/{id}` - Delete site (soft)

5. **SitePostController** (`/api/site-posts`)
   - GET `/` - List all posts
   - GET `/{id}` - Get post by ID
   - GET `/site/{siteId}` - Get posts by site
   - POST `/` - Create post
   - PUT `/{id}` - Update post
   - DELETE `/{id}` - Delete post (soft)

6. **AssignmentController** (`/api/assignments`)
   - GET `/` - List all assignments
   - GET `/{id}` - Get assignment by ID
   - GET `/guard/{guardId}` - Get assignments by guard
   - GET `/site-post/{postId}` - Get assignments by post
   - GET `/shift-types` - List shift types
   - POST `/` - Create assignment
   - POST `/{id}/cancel` - Cancel assignment
   - DELETE `/{id}` - Delete assignment

7. **AttendanceController** (`/api/attendance`)
   - GET `/guard/{guardId}` - Get guard attendance history
   - GET `/today-summary` - Get today's attendance summary
   - POST `/check-in` - Record check-in
   - POST `/check-out` - Record check-out
   - GET `/date/{date}` - Get attendance by date

### Services (Business Logic Layer)

Each service implements business rules and orchestrates repository calls:

- **AuthService**: JWT generation, password validation, user authentication
- **GuardService**: Guard CRUD, supervisor assignment, status management
- **ClientService**: Client account management
- **SiteService**: Site management, client association
- **SitePostService**: Guard post management, capacity tracking
- **AssignmentService**: Guard-to-post assignment, shift scheduling, conflict detection
- **AttendanceService**: Check-in/out logic, late detection, summary generation

### Repositories (Data Access Layer)

Spring Data JPA repositories:

- UserRepository
- RoleRepository
- GuardRepository
- ClientAccountRepository
- SiteRepository
- SitePostRepository
- GuardAssignmentRepository
- ShiftTypeRepository
- AttendanceRepository
- SupervisorSiteMappingRepository
- ClientSiteAccessRepository

### Entities (Domain Model)

**Core Entities**:

1. **UserEntity** (`users` table)
   - id, email, phone, passwordHash, fullName
   - status, createdAt, updatedAt, deletedAt, active
   - ManyToMany relationship with RoleEntity

2. **RoleEntity** (`roles` table)
   - id, name, createdAt, updatedAt, active
   - Predefined: ADMIN, SUPERVISOR, GUARD, CLIENT

3. **GuardEntity** (`guards` table)
   - id, userId, supervisorUserId, employeeCode
   - firstName, lastName, phone, hireDate
   - baseSalary, perDayRate, overtimeRate
   - active, createdAt, updatedAt, deletedAt

4. **ClientAccountEntity** (`client_accounts` table)
   - id, name, status, active
   - createdAt, updatedAt, deletedAt

5. **SiteEntity** (`sites` table)
   - id, clientAccountId, name, address
   - latitude, longitude, status, active
   - createdAt, updatedAt, deletedAt

6. **SitePostEntity** (`site_posts` table)
   - id, siteId, postName, description
   - requiredGuards, active
   - createdAt, updatedAt, deletedAt

7. **GuardAssignmentEntity** (`guard_assignments` table)
   - id, guardId, sitePostId, shiftTypeId
   - effectiveFrom, effectiveTo, active, notes
   - createdByUserId, createdAt, updatedAt

8. **ShiftTypeEntity** (`shift_types` table)
   - id, name, startTime, endTime
   - Predefined: DAY, EVENING, NIGHT

9. **AttendanceEntity** (`attendance_logs` table)
   - id, guardId, assignmentId, attendanceDate
   - checkInTime, checkOutTime, status
   - lateMinutes, earlyLeaveMinutes, notes
   - createdAt, updatedAt

10. **SupervisorSiteMappingEntity** (`supervisor_site_mapping` table)
    - id, supervisorUserId, siteId
    - assignedAt, removedAt

11. **ClientSiteAccessEntity** (`client_site_access` table)
    - id, clientUserId, siteId
    - grantedAt, revokedAt

---

## Frontend Architecture

### Project Structure

```
src/
├── App.jsx (Main application routes)
├── main.jsx (Entry point)
├── index.css (Global styles)
├── components/
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── MatrixBackground.jsx
│   ├── UIComponents.jsx
│   ├── auth/
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleLogin.jsx
│   └── dashboard/
│       ├── DashboardSidebar.jsx
│       └── DashboardStats.jsx
├── config/
│   ├── api.js (API endpoints & base URL)
│   └── firebase.js (Optional storage config)
├── contexts/
│   └── AuthContext.jsx (Global auth state)
├── hooks/
│   └── useFirestore.js
├── layouts/
│   ├── AdminDashboardLayout.jsx
│   └── AdminLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Careers.jsx
│   ├── RoleSelectionPortal.jsx
│   ├── SecurityPortal.jsx
│   ├── admin/
│   │   └── AdminDashboard.jsx
│   ├── assignments/
│   │   └── AssignmentsPage.jsx
│   ├── clients/
│   │   └── ClientsPage.jsx
│   ├── dashboards/
│   │   ├── GuardDashboardMobile.jsx
│   │   └── admin/
│   │       └── AdminDashboardHome.jsx
│   ├── guards/
│   │   └── GuardsPage.jsx
│   ├── portals/
│   │   ├── ClientDashboard.jsx
│   │   └── ManagerDashboard.jsx
│   ├── sites/
│   │   └── SitesPage.jsx
│   └── siteposts/
│       └── SitePostsPage.jsx
└── services/
    ├── apiClient.js (HTTP client with JWT)
    ├── authService.js
    ├── adminService.js
    ├── assignmentService.js
    ├── attendanceService.js
    ├── clientService.js
    ├── guardService.js
    ├── siteService.js
    └── sitePostService.js
```

### Routes (from App.jsx)

**Public Routes**:
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/careers` - Careers page
- `/portal` - Role selection portal
- `/login/admin` - Admin login
- `/login/manager` - Manager/Supervisor login
- `/login/client` - Client login
- `/login/guard` - Guard login

**Protected Routes** (Require Authentication):

**ADMIN**:
- `/dashboard/admin` - Admin home
- `/dashboard/admin/guards` - Guards management
- `/dashboard/admin/sites` - Sites management
- `/dashboard/admin/clients` - Clients management
- `/dashboard/admin/assignments` - Assignments management
- `/dashboard/admin/site-posts` - Site posts management

**SUPERVISOR**:
- `/dashboard/manager` - Manager/Supervisor dashboard

**GUARD**:
- `/dashboard/guard` - Guard mobile dashboard

**CLIENT**:
- `/dashboard/client` - Client dashboard

### Services (API Integration)

All services use centralized `apiClient.js`:

**apiClient.js Features**:
- Automatic JWT token attachment
- ApiResponse<T> unwrapping
- 401 auto-logout
- Error handling
- Request/response interceptors

**Service Files**:
1. **authService.js** - login, logout, register, getCurrentUser
2. **guardService.js** - getAllGuards, getGuard, createGuard, updateGuard
3. **clientService.js** - getAllClients, getClient, createClient, updateClient
4. **siteService.js** - getAllSites, getSite, createSite, getSitesByClient
5. **sitePostService.js** - getAllSitePosts, getSitePost, createSitePost
6. **assignmentService.js** - getAllAssignments, createAssignment, cancelAssignment, getShiftTypes
7. **attendanceService.js** - checkIn, checkOut, getGuardAttendance, getTodaySummary
8. **adminService.js** - Aggregates multiple services for admin dashboard

### API Endpoints Configuration (config/api.js)

```javascript
API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

API_ENDPOINTS = {
  AUTH: { LOGIN, REGISTER, LOGOUT },
  GUARDS: { BASE, BY_ID },
  CLIENTS: { BASE, BY_ID },
  SITES: { BASE, BY_ID, BY_CLIENT },
  ASSIGNMENTS: { BASE, BY_ID, BY_GUARD, BY_SITE_POST, SHIFT_TYPES },
  SITE_POSTS: { BASE, BY_ID, BY_SITE },
  ATTENDANCE: { BASE, CHECK_IN, CHECK_OUT, TODAY_SUMMARY, BY_GUARD, BY_DATE }
}
```

---

## Database Schema

### Flyway Migrations

**Migration Files** (in `backend/src/main/resources/db/migration`):

1. **V1__rbac.sql** - RBAC foundation
   - users table
   - roles table
   - user_roles junction table
   - Seed data: ADMIN, SUPERVISOR, GUARD, CLIENT roles

2. **V2__clients_sites.sql** - Client & site management
   - client_accounts table
   - sites table
   - site_posts table

3. **V3__guards.sql** - Guard management
   - guards table
   - Links to users and supervisors

4. **V4__guard_assignments.sql** - Assignment system
   - shift_types table (DAY, EVENING, NIGHT)
   - guard_assignments table

5. **V5__attendance.sql** - Attendance tracking
   - attendance_logs table

6. **V6__admin_seed.sql** - Seed admin user

7. **V7__supervisor_site_mapping.sql** - Supervisor access control
   - supervisor_site_mapping table

8. **V8__client_site_access.sql** - Client access control
   - client_site_access table

### Entity Relationship Diagram

```
users ──┬─── guards (OneToOne via user_id)
        │
        ├─── user_roles ───── roles (ManyToMany)
        │
        ├─── supervisor_site_mapping (supervisor)
        │
        └─── client_site_access (client)

client_accounts ──── sites ──── site_posts
                                    │
guards ──── guard_assignments ──────┘
                │                   │
                └──── shift_types   │
                                    │
attendance_logs ────────────────────┘
```

### Key Database Constraints

**Foreign Keys**:
- guards.user_id → users.id (CASCADE)
- guards.supervisor_user_id → users.id (SET NULL)
- sites.client_account_id → client_accounts.id (RESTRICT)
- site_posts.site_id → sites.id (RESTRICT)
- guard_assignments.guard_id → guards.id (SET NULL)
- guard_assignments.site_post_id → site_posts.id (RESTRICT)
- guard_assignments.shift_type_id → shift_types.id (RESTRICT)
- attendance_logs.guard_id → guards.id (SET NULL)
- attendance_logs.assignment_id → guard_assignments.id (SET NULL)

**Unique Constraints**:
- users.email (case-insensitive via index)
- guards.employee_code
- roles.name
- shift_types.name
- site_posts (site_id, post_name)
- attendance_logs (assignment_id, attendance_date)

**Soft Delete Pattern**:
- users, client_accounts, sites, site_posts, guards
- Use `deleted_at` timestamp
- Use `active` boolean flag

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials → POST /api/auth/login
2. AuthService validates password (BCrypt)
3. JwtTokenProvider generates JWT token
4. Token returned in response body
5. Frontend stores token in localStorage
6. Subsequent requests include: Authorization: Bearer {token}
7. JwtAuthenticationFilter intercepts request
8. Token validated & user authenticated
9. Request proceeds to controller
```

### Authorization Model

**Role Hierarchy**:
- ADMIN - Full system access
- SUPERVISOR - Manage assigned sites & guards
- GUARD - View own schedule, check-in/out
- CLIENT - View assigned sites & reports

**Role Enforcement**:
- Controller level: `@PreAuthorize("hasRole('ADMIN')")`
- Service level: Business logic checks
- Frontend level: ProtectedRoute component

### JWT Configuration

**Token Structure**:
```json
{
  "sub": "user@example.com",
  "userId": 123,
  "roles": ["ADMIN"],
  "iss": "sgms",
  "iat": 1708459200,
  "exp": 1708545600
}
```

**Token Lifetime**: 24 hours (configurable)

**Token Storage**: 
- Frontend: localStorage (HTTPS only in production)
- Backend: Stateless (no session storage)

### CORS Policy

**Allowed Origins** (Pattern Matching):
- `https://zplusesecurity.com`
- `https://www.zplusesecurity.com`
- `https://*.netlify.app`

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**: Authorization, Content-Type

**Credentials**: true (for cookie/auth header transmission)

### Security Headers

Configured in Spring Security:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────┐
│       User's Browser (HTTPS)        │
└────────────┬────────────────────────┘
             │
             ├─── Frontend Assets ────► Netlify CDN
             │    (React SPA)           (Global Edge)
             │
             └─── API Requests ───────► Railway Backend
                  (JSON/JWT)            (Spring Boot)
                                             │
                                             ▼
                                        Railway PostgreSQL
                                        (Managed Database)
```

### Backend Deployment (Railway)

**Environment Variables**:
```bash
DATABASE_URL              # Auto-provided by Railway
APP_SECURITY_JWT_SECRET   # Manual: openssl rand -base64 64
SPRING_PROFILES_ACTIVE    # Set to: prod
APP_CORS_ALLOWED_ORIGINS  # Set to: https://*.netlify.app,https://zplusesecurity.com
JWT_ACCESS_TTL_SECONDS    # Optional: 86400
```

**Build Configuration**:
- Builder: Maven
- Start Command: `java -jar target/sgms-backend-1.0.0.jar`
- Port: $PORT (Railway provides)
- Health Check: `/actuator/health`

### Frontend Deployment (Netlify)

**Build Configuration**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables**:
```bash
VITE_API_BASE_URL=https://sgms-backend-production.up.railway.app/api
```

### Database (Railway PostgreSQL)

**Connection Pooling** (HikariCP):
- Maximum Pool Size: 10
- Minimum Idle: 5
- Connection Timeout: 30s
- Idle Timeout: 10 minutes

**Backup Strategy**:
- Railway automated daily backups
- Point-in-time recovery available

**Migration Strategy**:
- Flyway manages schema
- Migrations run on application startup
- Version control in `db/migration/`

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
**Description**: Authenticate user and receive JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresInSeconds": 86400,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "roles": ["ADMIN"]
    }
  },
  "message": "Login successful",
  "timestamp": "2026-02-20T12:00:00Z"
}
```

#### POST /api/auth/register
**Description**: Register new user

**Request**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "fullName": "Jane Smith",
  "phone": "+1234567890",
  "role": "CLIENT"
}
```

#### GET /api/auth/me
**Description**: Get current authenticated user  
**Headers**: `Authorization: Bearer {token}`

---

### Guard Management Endpoints

#### GET /api/guards
**Authorization**: ADMIN, SUPERVISOR  
**Description**: List all guards

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 10,
      "employeeCode": "GRD001",
      "firstName": "John",
      "lastName": "Guard",
      "phone": "+1234567890",
      "active": true,
      "baseSalary": 25000.00,
      "perDayRate": 1000.00,
      "overtimeRate": 150.00,
      "hireDate": "2024-01-15"
    }
  ]
}
```

#### POST /api/guards
**Authorization**: ADMIN  
**Description**: Create new guard

**Request**:
```json
{
  "email": "guard@example.com",
  "password": "SecurePass123",
  "fullName": "New Guard",
  "phone": "+1234567890",
  "employeeCode": "GRD999",
  "firstName": "New",
  "lastName": "Guard",
  "baseSalary": 25000.00,
  "perDayRate": 1000.00,
  "overtimeRate": 150.00
}
```

---

### Attendance Endpoints

#### POST /api/attendance/check-in
**Authorization**: GUARD, SUPERVISOR, ADMIN  
**Description**: Record guard check-in

**Request**:
```json
{
  "guardId": 1
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 100,
    "guardId": 1,
    "attendanceDate": "2026-02-20",
    "checkInTime": "2026-02-20T06:05:00Z",
    "status": "PRESENT",
    "lateMinutes": 5
  },
  "message": "Check-in recorded successfully"
}
```

#### POST /api/attendance/check-out
**Authorization**: GUARD, SUPERVISOR, ADMIN  
**Description**: Record guard check-out

#### GET /api/attendance/today-summary
**Authorization**: SUPERVISOR, ADMIN  
**Description**: Get today's attendance summary for all guards

---

### Assignment Endpoints

#### POST /api/assignments
**Authorization**: ADMIN, SUPERVISOR  
**Description**: Create guard assignment

**Request**:
```json
{
  "guardId": 1,
  "sitePostId": 10,
  "shiftTypeId": 1,
  "effectiveFrom": "2026-02-21",
  "effectiveTo": "2026-03-21",
  "notes": "Regular shift assignment"
}
```

#### GET /api/assignments/shift-types
**Authorization**: Authenticated  
**Description**: List available shift types

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "DAY",
      "startTime": "06:00:00",
      "endTime": "14:00:00"
    },
    {
      "id": 2,
      "name": "EVENING",
      "startTime": "14:00:00",
      "endTime": "22:00:00"
    },
    {
      "id": 3,
      "name": "NIGHT",
      "startTime": "22:00:00",
      "endTime": "06:00:00"
    }
  ]
}
```

---

## Performance Considerations

### Database Optimization
- Indexed columns: email (case-insensitive), employee_code, foreign keys
- Connection pooling via HikariCP
- Lazy loading for relationships
- Soft delete with indexed `deleted_at`

### API Response Times
- Target: < 200ms for read operations
- Target: < 500ms for write operations
- Implemented: Request timeout guards
- Monitored via QA automation

### Frontend Optimization
- Code splitting via Vite
- Bundle size: ~413 KB (gzipped: ~117 KB)
- Service worker for offline support
- CDN delivery via Netlify Edge

---

## Monitoring & Observability

### Health Checks
- Endpoint: `/actuator/health`
- Checks: Database connectivity, disk space
- Used by: Railway platform monitoring

### Logging
- Framework: SLF4J + Logback
- Levels: INFO (production), DEBUG (development)
- Logged: Authentication events, errors, API calls

### Error Tracking
- Frontend: Console errors
- Backend: Exception stack traces
- QA: Automated regression testing via qa_audit.py

---

## Appendix

### Technology Versions
- Java: 17
- Spring Boot: 3.4.2
- React: 18.3.1
- Vite: 5.4.21
- PostgreSQL: 15+
- Node.js: 18+ (recommended)
- Maven: 3.8+

### Repository Information
- Backend Source: `backend/src/main/java/com/sgms`
- Frontend Source: `src/`
- Migrations: `backend/src/main/resources/db/migration`
- Configuration: `backend/src/main/resources/application*.yml`

---

**End of Architecture Report**
