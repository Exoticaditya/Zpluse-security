# SGMS ERP - Architectural Refactoring Plan

**Last Updated:** February 18, 2026  
**Objective:** Transform SGMS into a maintainable, scalable ERP system with standardized patterns  
**Scope:** Backend (Spring Boot) + Frontend (React)  
**Criticality:** ⚠️ ZERO BREAKING CHANGES TO APIs OR DATABASE

---

## 📊 CURRENT STATE ANALYSIS

### Backend Structure (Current)
```
com.sgms
 ├── assignment/          ✅ Well-structured (Phase A)
 ├── auth/                ✅ Good structure
 ├── client/              ✅ Good structure
 ├── common/              ⚠️ Incomplete (only ApiResponse)
 ├── config/              ❌ Should be under common/
 ├── exception/           ❌ Should be under common/
 ├── guard/               ✅ Good structure
 ├── security/            ❌ Should be under common/
 ├── seed/                ⚠️ Needs organization
 ├── site/                ✅ Good structure  
 └── user/                ❌ Missing service and controller
```

### Frontend Structure (Current)
```
src/
 ├── components/          ⚠️ Mixed responsibility
 ├── contexts/            ✅ Good
 ├── hooks/               ✅ Good
 ├── layouts/             ⚠️ Only 1 layout
 ├── pages/
 │    ├── admin/          ❌ DUPLICATE (has AdminDashboard + clients/ + sites/)
 │    ├── portals/        ❌ DUPLICATE (has AdminDashboard)
 │    ├── clients/        ⚠️ Unclear structure
 │    ├── guards/         ⚠️ Unclear structure
 │    └── sites/          ⚠️ Unclear structure
 ├── services/            ✅ API abstraction exists
 └── utils/               ✅ Good
```

---

## 🔍 TECHNICAL DEBT IDENTIFIED

### Backend Issues

#### 1. **No Service Interfaces** ❌ CRITICAL
- All services are concrete classes (`GuardService`, `SiteService`, etc.)
- No abstraction layer for testing and modularity
- Violates dependency inversion principle

#### 2. **Duplicate Mapping Logic** ❌ HIGH
- Every service has private `mapToResponse()` methods
- Same mapping patterns repeated across 7 services
- 200+ lines of duplicate code

#### 3. **Package Structure Violations** ❌ HIGH
- `config/`, `security/`, `exception/` at root level
- Should be under `common/` for clarity
- Inconsistent with domain-driven design

#### 4. **User Module Incomplete** ❌ MEDIUM
- Has `UserEntity`, `RoleEntity`, `UserRepository`, `RoleRepository`
- Missing `UserService` and `UserController`
- User management scattered in `AuthService`

#### 5. **No Centralized Exception Handling** ⚠️ MEDIUM
- `GlobalExceptionHandler` exists but incomplete
- Services throw `ResponseStatusException` directly
- Should use custom domain exceptions

#### 6. **No Mapper Utilities** ❌ MEDIUM
- Entity-to-DTO mapping inside services
- Violates single responsibility principle

### Frontend Issues

#### 7. **Duplicate Dashboards** ❌ CRITICAL
- `src/pages/admin/AdminDashboard.jsx` (206 lines)
- `src/pages/portals/AdminDashboard.jsx` (202 lines)
- Causes maintenance nightmare

#### 8. **Duplicate Page Directories** ❌ HIGH
- `src/pages/admin/clients/` vs `src/pages/clients/`
- `src/pages/admin/sites/` vs `src/pages/sites/`
- Unclear which is authoritative

#### 9. **No Shared UI Components** ❌ MEDIUM
- No reusable Table component
- No reusable Form components
- No Modal component
- Every page implements its own UI

#### 10. **No Module-Based Architecture** ⚠️ MEDIUM
- Pages organized by route, not domain
- No clear separation of concerns

---

## 🎯 TARGET ARCHITECTURE

### Backend Structure (Target)
```
com.sgms
 ├── common/
 │    ├── config/              (TimeZone, Railway, RequestLogging)
 │    ├── dto/                 (Pagination, SearchRequest, etc.)
 │    ├── exception/           (Custom exceptions, GlobalHandler)
 │    ├── mapper/              (EntityMapper interfaces & implementations)
 │    ├── response/            (ApiResponse, ErrorResponse)
 │    ├── security/            (JWT, SecurityConfig, UserDetails)
 │    └── util/                (DateUtil, ValidationUtil, SecurityUtil)
 │
 ├── auth/
 │    ├── dto/
 │    ├── AuthController.java
 │    └── AuthService.java
 │
 ├── user/
 │    ├── dto/                 (UserResponse, CreateUserRequest, UpdateUserRequest)
 │    ├── entity/              (UserEntity, RoleEntity)
 │    ├── repository/          (UserRepository, RoleRepository)
 │    ├── service/             (UserService interface + impl)
 │    ├── mapper/              (UserMapper)
 │    └── UserController.java
 │
 ├── client/
 │    ├── dto/
 │    ├── entity/              (ClientAccountEntity)
 │    ├── repository/
 │    ├── service/             (ClientService interface + impl)
 │    ├── mapper/
 │    └── ClientController.java
 │
 ├── site/
 │    ├── dto/
 │    ├── entity/              (SiteEntity, SitePostEntity, etc.)
 │    ├── repository/
 │    ├── service/             (SiteService, SitePostService interfaces + impls)
 │    ├── mapper/
 │    └── [Controllers]
 │
 ├── guard/
 │    ├── dto/
 │    ├── entity/
 │    ├── repository/
 │    ├── service/
 │    ├── mapper/
 │    └── GuardController.java
 │
 ├── assignment/
 │    ├── dto/
 │    ├── entity/
 │    ├── repository/
 │    ├── service/
 │    ├── mapper/
 │    └── GuardAssignmentController.java
 │
 ├── seed/                     (Database seeders only)
 │    ├── RoleSeeder.java
 │    └── DataSeederRunner.java
 │
 └── SgmsBackendApplication.java
```

### Frontend Structure (Target)
```
src/
 ├── common/
 │    ├── components/          (Shared UI components)
 │    │    ├── ui/             (Button, Input, Card, Badge, etc.)
 │    │    ├── layout/         (Navbar, Footer, Sidebar)
 │    │    ├── data/           (Table, DataGrid, Pagination)
 │    │    └── feedback/       (Modal, Toast, Loader, Alert)
 │    ├── hooks/               (useAuth, useFetch, usePagination)
 │    ├── utils/               (errorHandler, logger, formatters)
 │    └── contexts/            (AuthContext, ThemeContext)
 │
 ├── modules/
 │    ├── auth/
 │    │    ├── components/     (Login, Register, ProtectedRoute)
 │    │    ├── pages/          (LoginPage, RegisterPage)
 │    │    └── services/       (authService.js)
 │    │
 │    ├── admin/
 │    │    ├── components/     (StatCard, ActivityFeed)
 │    │    ├── pages/          (AdminDashboard)
 │    │    └── services/       (adminService.js)
 │    │
 │    ├── clients/
 │    │    ├── components/     (ClientForm, ClientTable)
 │    │    ├── pages/          (ClientsPage, ClientDetailPage)
 │    │    └── services/       (clientService.js)
 │    │
 │    ├── sites/
 │    │    ├── components/
 │    │    ├── pages/
 │    │    └── services/       (siteService.js)
 │    │
 │    ├── guards/
 │    │    ├── components/
 │    │    ├── pages/
 │    │    └── services/       (guardService.js)
 │    │
 │    └── assignments/
 │         ├── components/
 │         ├── pages/
 │         └── services/       (assignmentService.js)
 │
 ├── config/
 │    ├── api.js
 │    └── firebase.js
 │
 ├── App.jsx
 ├── main.jsx
 └── index.css
```

---

## 📋 REFACTORING TASKS

### PHASE 1: Backend Restructuring (DAY 1-2)

#### Task 1.1: Create Common Infrastructure ⏱️ 2 hours
**Priority:** CRITICAL | **Risk:** LOW

**Actions:**
1. Create `com.sgms.common.mapper` package
2. Create base mapper interface:
   ```java
   public interface EntityMapper<E, D> {
     D toResponse(E entity);
     List<D> toResponseList(List<E> entities);
   }
   ```
3. Create `com.sgms.common.exception` with custom exceptions:
   - `ResourceNotFoundException`
   - `DuplicateResourceException`
   - `InvalidRequestException`
   - `UnauthorizedAccessException`
4. Move `ErrorResponse` and `GlobalExceptionHandler` to `common.exception`
5. Create `com.sgms.common.response` package
6. Move `ApiResponse` to `common.response`
7. Create `com.sgms.common.util` package
8. Add `SecurityUtil` (extract current user logic)

**Files Affected:**
- NEW: `common/mapper/EntityMapper.java`
- NEW: `common/exception/ResourceNotFoundException.java`
- NEW: `common/exception/DuplicateResourceException.java`
- NEW: `common/exception/InvalidRequestException.java`
- MOVE: `exception/ErrorResponse.java` → `common/exception/`
- MOVE: `exception/GlobalExceptionHandler.java` → `common/exception/`
- MOVE: `common/ApiResponse.java` → `common/response/`
- NEW: `common/util/SecurityUtil.java`

**Validation:**
```bash
mvn clean compile
```

---

#### Task 1.2: Consolidate Security & Config ⏱️ 1 hour
**Priority:** HIGH | **Risk:** MEDIUM (imports will break)

**Actions:**
1. Create `com.sgms.common.security` package
2. Move all security classes:
   - `SecurityConfig`
   - `JwtService`
   - `JwtProperties`
   - `JwtAuthenticationFilter`
   - `CustomUserDetailsService`
   - `UserPrincipal`
   - `RestAuthenticationEntryPoint`
3. Create `com.sgms.common.config` package
4. Move all config classes:
   - `RailwayPostgresConfig`
   - `TimeZoneConfig`
   - `RequestLoggingFilter`
   - `DatabaseHealthIndicator`
   - `StartupValidation`
5. Update all imports across codebase

**Files to Move:**
```
security/* → common/security/*
config/* → common/config/*
```

**Validation:**
```bash
mvn clean compile
# Check for import errors
```

---

#### Task 1.3: Create User Module Service Layer ⏱️ 2 hours
**Priority:** HIGH | **Risk:** LOW

**Actions:**
1. Create `user/dto/` subdirectory
2. Move existing DTOs from `auth/dto/UserResponse.java` to `user/dto/`
3. Create new DTOs:
   - `CreateUserRequest`
   - `UpdateUserRequest`
   - `RoleResponse`
4. Create `user/mapper/UserMapper.java`
5. Create `user/service/UserService.java` interface
6. Create `user/service/UserServiceImpl.java`
7. Extract user management logic from `AuthService`
8. Create `UserController.java` with CRUD endpoints
9. Update `AuthService` to use `UserService`

**New Files:**
- `user/dto/UserResponse.java` (moved from auth)
- `user/dto/CreateUserRequest.java`
- `user/dto/UpdateUserRequest.java`
- `user/dto/RoleResponse.java`
- `user/mapper/UserMapper.java`
- `user/service/UserService.java`
- `user/service/UserServiceImpl.java`
- `user/UserController.java`

**Modified Files:**
- `auth/AuthService.java` (remove user CRUD, delegate to UserService)

**Validation:**
```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/users/{id}
```

---

#### Task 1.4: Refactor Guard Module ⏱️ 2 hours
**Priority:** HIGH | **Risk:** LOW

**Actions:**
1. Create `guard/entity/` subdirectory, move `GuardEntity.java`
2. Create `guard/repository/` subdirectory, move `GuardRepository.java`
3. Create `guard/service/` subdirectory
4. Create `GuardService.java` interface
5. Rename current `GuardService` to `GuardServiceImpl`
6. Create `guard/mapper/GuardMapper.java`
7. Move mapping logic from service to mapper
8. Update `GuardController` to use interface

**File Structure:**
```
guard/
 ├── dto/
 │    ├── CreateGuardRequest.java
 │    └── GuardResponse.java
 ├── entity/
 │    └── GuardEntity.java
 ├── repository/
 │    └── GuardRepository.java
 ├── service/
 │    ├── GuardService.java (interface)
 │    └── GuardServiceImpl.java
 ├── mapper/
 │    └── GuardMapper.java
 └── GuardController.java
```

**Validation:**
```bash
# Run existing tests
curl http://localhost:8080/api/guards
```

---

#### Task 1.5: Refactor Client Module ⏱️ 1.5 hours
**Priority:** HIGH | **Risk:** LOW

**Actions:**
1. Organize into entity/, repository/, service/, mapper/ subdirectories
2. Create `ClientService` interface
3. Rename `ClientAccountService` to `ClientServiceImpl`
4. Create `ClientMapper` (extract mapping)
5. Rename `ClientAccountController` to `ClientController`
6. Keep endpoint URLs unchanged (`/api/clients`)

**File Structure:**
```
client/
 ├── dto/
 ├── entity/
 │    └── ClientAccountEntity.java
 ├── repository/
 │    └── ClientAccountRepository.java
 ├── service/
 │    ├── ClientService.java (interface)
 │    └── ClientServiceImpl.java
 ├── mapper/
 │    └── ClientMapper.java
 └── ClientController.java
```

---

#### Task 1.6: Refactor Site Module ⏱️ 3 hours
**Priority:** HIGH | **Risk:** MEDIUM (complex module)

**Site module has 4 sub-domains:**
- Sites
- Site Posts
- Site Access (Client)
- Supervisor Assignments

**Actions:**
1. Create subdirectory structure:
   ```
   site/
    ├── dto/
    ├── entity/
    ├── repository/
    ├── service/
    ├── mapper/
    └── [4 controllers]
   ```
2. Create interfaces for each service:
   - `SiteService`
   - `SitePostService`
   - `ClientSiteAccessService`
   - `SupervisorSiteService`
3. Create mappers for each entity
4. Convert services to implementations

---

#### Task 1.7: Refactor Assignment Module ⏱️ 1.5 hours
**Priority:** MEDIUM | **Risk:** LOW (already well-structured)

**Actions:**
1. Create subdirectories (entity/, repository/, service/, mapper/)
2. Create service interfaces
3. Create `AssignmentMapper` and `ShiftTypeMapper`
4. Move mapping logic out of services

---

#### Task 1.8: Update Global Exception Handler ⏱️ 1 hour
**Priority:** HIGH | **Risk:** LOW

**Actions:**
1. Replace all `ResponseStatusException` with custom exceptions
2. Add handlers for:
   - `ResourceNotFoundException` → 404
   - `DuplicateResourceException` → 409
   - `InvalidRequestException` → 400
   - `UnauthorizedAccessException` → 403
3. Add consistent error messages

---

#### Task 1.9: Clean Up Seed Package ⏱️ 30 min
**Priority:** LOW | **Risk:** LOW

**Actions:**
1. Keep only `RoleSeeder`
2. Ensure it runs on startup (if needed)
3. Document seed data process

---

### PHASE 2: Frontend Restructuring (DAY 3-4)

#### Task 2.1: Remove Duplicate Pages ⏱️ 1 hour
**Priority:** CRITICAL | **Risk:** LOW

**Actions:**
1. **Delete duplicates:**
   - DELETE: `src/pages/admin/AdminDashboard.jsx`
   - DELETE: `src/pages/admin/clients/`
   - DELETE: `src/pages/admin/sites/`
2. **Keep authoritative versions:**
   - KEEP: `src/pages/portals/AdminDashboard.jsx`
   - KEEP: `src/pages/clients/ClientsPage.jsx`
   - KEEP: `src/pages/sites/SitesPage.jsx`
3. **Update imports** in `App.jsx` and route files

**Validation:**
- Run frontend: `npm run dev`
- Verify all routes work
- Check browser console for errors

---

#### Task 2.2: Create Common UI Components ⏱️ 3 hours
**Priority:** HIGH | **Risk:** LOW

**Actions:**
1. Create `src/common/components/ui/` directory
2. Create reusable components:
   - `Button.jsx` (primary, secondary, danger variants)
   - `Input.jsx` (text, email, password, number types)
   - `Select.jsx`
   - `Card.jsx`
   - `Badge.jsx` (status colors)
3. Create `src/common/components/data/` directory:
   - `Table.jsx` (sortable, paginated)
   - `Pagination.jsx`
   - `SearchBar.jsx`
4. Create `src/common/components/feedback/`:
   - `Modal.jsx`
   - `Loader.jsx`
   - `Alert.jsx`
   - `Toast.jsx`
5. Create `src/common/components/layout/`:
   - Move `Navbar.jsx`
   - Move `Footer.jsx`
   - Move `DashboardSidebar.jsx`

---

#### Task 2.3: Reorganize into Module Structure ⏱️ 4 hours
**Priority:** HIGH | **Risk:** MEDIUM

**Actions:**
1. Create `src/modules/` directory
2. Move pages and components by domain:

**Module: auth**
```
src/modules/auth/
 ├── components/
 │    ├── Login.jsx
 │    ├── Register.jsx
 │    └── ProtectedRoute.jsx
 ├── pages/
 │    ├── LoginPage.jsx
 │    └── RegisterPage.jsx
 └── services/
      └── authService.js
```

**Module: admin**
```
src/modules/admin/
 ├── components/
 │    ├── StatCard.jsx
 │    └── ActivityFeed.jsx
 ├── pages/
 │    └── AdminDashboard.jsx
 └── services/
      └── adminService.js
```

**Module: clients**
```
src/modules/clients/
 ├── components/
 │    ├── ClientForm.jsx
 │    ├── ClientTable.jsx
 │    └── ClientCard.jsx
 ├── pages/
 │    └── ClientsPage.jsx
 └── services/
      └── clientService.js
```

**Module: sites**
```
src/modules/sites/
 ├── components/
 │    ├── SiteForm.jsx
 │    ├── SiteTable.jsx
 │    └── SitePostForm.jsx
 ├── pages/
 │    └── SitesPage.jsx
 └── services/
      └── siteService.js
```

**Module: guards**
```
src/modules/guards/
 ├── components/
 │    ├── GuardForm.jsx
 │    └── GuardTable.jsx
 ├── pages/
 │    └── GuardsPage.jsx
 └── services/
      └── guardService.js
```

**Module: assignments**
```
src/modules/assignments/
 ├── components/
 │    ├── AssignmentForm.jsx
 │    └── AssignmentTable.jsx
 ├── pages/
 │    └── AssignmentsPage.jsx
 └── services/
      └── assignmentService.js
```

3. Update all imports in `App.jsx`
4. Update route definitions

---

#### Task 2.4: Centralize Error Handling ⏱️ 1 hour
**Priority:** MEDIUM | **Risk:** LOW

**Actions:**
1. Enhance `src/common/utils/errorHandler.js`
2. Add API error interceptor
3. Add toast notification integration
4. Standardize error display

---

#### Task 2.5: Create API Loading State Manager ⏱️ 1 hour
**Priority:** MEDIUM | **Risk:** LOW

**Actions:**
1. Create `src/common/hooks/useFetch.js`
2. Handle loading, error, success states
3. Refactor components to use hook

---

### PHASE 3: Testing & Validation (DAY 5)

#### Task 3.1: Backend Testing ⏱️ 2 hours

**Actions:**
1. Run complete Maven build
   ```bash
   cd backend
   mvn clean install
   ```
2. Test all endpoints with curl (use existing PHASE_A_TESTING_GUIDE.md)
3. Verify no regression in existing features
4. Check logs for warnings/errors

**Validation Checklist:**
- [ ] All endpoints respond correctly
- [ ] Authentication still works
- [ ] Authorization roles enforced
- [ ] Database migrations intact
- [ ] No compilation errors
- [ ] No runtime exceptions

---

#### Task 3.2: Frontend Testing ⏱️ 2 hours

**Actions:**
1. Build production bundle
   ```bash
   npm run build
   ```
2. Test all pages manually
3. Verify routing works
4. Test CRUD operations on each module
5. Test authentication flow
6. Check browser console for errors

**Validation Checklist:**
- [ ] All pages render correctly
- [ ] All forms submit successfully
- [ ] Tables display data
- [ ] Modals open/close properly
- [ ] Navigation works
- [ ] No console errors
- [ ] API calls succeed

---

#### Task 3.3: Documentation Update ⏱️ 1 hour

**Actions:**
1. Update project README with new structure
2. Create API documentation (Swagger/OpenAPI)
3. Document common components usage
4. Update deployment guides

---

## 📂 FILES TO MOVE

### Backend Moves
| Current Location | New Location | Reason |
|-----------------|--------------|--------|
| `exception/ErrorResponse.java` | `common/exception/` | Centralize |
| `exception/GlobalExceptionHandler.java` | `common/exception/` | Centralize |
| `common/ApiResponse.java` | `common/response/` | Better organization |
| `security/*.java` | `common/security/` | Centralize framework |
| `config/*.java` | `common/config/` | Centralize framework |
| `auth/dto/UserResponse.java` | `user/dto/` | Belongs to user domain |

### Frontend Moves
| Current Location | New Location | Reason |
|-----------------|--------------|--------|
| `pages/portals/AdminDashboard.jsx` | `modules/admin/pages/` | Module structure |
| `pages/clients/ClientsPage.jsx` | `modules/clients/pages/` | Module structure |
| `pages/sites/SitesPage.jsx` | `modules/sites/pages/` | Module structure |
| `pages/guards/GuardsPage.jsx` | `modules/guards/pages/` | Module structure |
| `components/auth/*` | `modules/auth/components/` | Module structure |
| `components/dashboard/*` | `common/components/layout/` | Shared components |
| `services/*` | `modules/*/services/` | Co-locate with modules |

---

## 🗑️ FILES TO DELETE

### Backend
- `exception/` directory (after moving files)
- `config/` directory (after moving files)
- `security/` directory (after moving files)

### Frontend
- `src/pages/admin/AdminDashboard.jsx` (duplicate)
- `src/pages/admin/clients/` (duplicate)
- `src/pages/admin/sites/` (duplicate)
- `src/pages/admin/` directory (if empty)

---

## 🔄 CODE MODIFICATIONS REQUIRED

### Backend Changes Per Module

#### All Services (8 services)
**Before:**
```java
@Service
public class GuardService {
  private final GuardRepository repository;
  
  public GuardResponse create(CreateGuardRequest request) {
    // business logic
    return mapToResponse(entity);
  }
  
  private GuardResponse mapToResponse(GuardEntity entity) {
    // mapping logic (20+ lines)
  }
}
```

**After:**
```java
public interface GuardService {
  GuardResponse create(CreateGuardRequest request);
  // other methods
}

@Service
public class GuardServiceImpl implements GuardService {
  private final GuardRepository repository;
  private final GuardMapper mapper;
  
  @Override
  @Transactional
  public GuardResponse create(CreateGuardRequest request) {
    // business logic only
    return mapper.toResponse(entity);
  }
}
```

#### All Controllers (8 controllers)
**Before:**
```java
throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard not found");
```

**After:**
```java
throw new ResourceNotFoundException("Guard", id);
```

#### Global Exception Handler
**Add:**
```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, WebRequest request) {
  ErrorResponse error = new ErrorResponse(
    "NOT_FOUND",
    ex.getMessage(),
    404,
    request.getDescription(false)
  );
  return ResponseEntity.status(404).body(error);
}
```

---

### Frontend Changes

#### Component Refactor Example

**Before (ClientsPage.jsx):**
```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [clients, setClients] = useState([]);

useEffect(() => {
  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchClients();
}, []);

return (
  <div>
    {loading && <div>Loading...</div>}
    {error && <div>Error: {error}</div>}
    <table>
      {/* 50 lines of table markup */}
    </table>
  </div>
);
```

**After:**
```jsx
import { useFetch } from '../../common/hooks/useFetch';
import Table from '../../common/components/data/Table';
import Loader from '../../common/components/feedback/Loader';
import Alert from '../../common/components/feedback/Alert';

const ClientsPage = () => {
  const { data: clients, loading, error } = useFetch(clientService.getAllClients);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Client Name' },
    { key: 'status', label: 'Status' },
  ];

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <Table data={clients} columns={columns} />
    </div>
  );
};
```

---

## 📈 REFACTOR EXECUTION ORDER

### Week 1: Backend
1. **Day 1 Morning:** Task 1.1 (Common Infrastructure)
2. **Day 1 Afternoon:** Task 1.2 (Security/Config consolidation)
3. **Day 2 Morning:** Task 1.3 (User Module)
4. **Day 2 Afternoon:** Task 1.4 (Guard Module)
5. **Day 3 Morning:** Task 1.5 (Client Module)
6. **Day 3 Afternoon:** Task 1.6 (Site Module)
7. **Day 4 Morning:** Task 1.7 (Assignment Module)
8. **Day 4 Afternoon:** Task 1.8 (Exception Handler) + Task 1.9 (Seed cleanup)

### Week 2: Frontend
1. **Day 1 Morning:** Task 2.1 (Delete duplicates)
2. **Day 1 Afternoon:** Task 2.2 (UI Components - Part 1)
3. **Day 2:** Task 2.2 (UI Components - Part 2)
4. **Day 3:** Task 2.3 (Module restructure)
5. **Day 4:** Task 2.4 (Error handling) + Task 2.5 (Loading states)

### Week 3: Testing
1. **Day 1:** Task 3.1 (Backend testing)
2. **Day 2:** Task 3.2 (Frontend testing)
3. **Day 3:** Task 3.3 (Documentation)

---

## 🛡️ SAFETY CHECKLIST

Before executing each task:
- [ ] Create Git branch: `refactor/<task-name>`
- [ ] Commit current working state
- [ ] Document current endpoint URLs (if applicable)
- [ ] Backup database (if testing locally)

After each task:
- [ ] Run `mvn clean compile` (backend)
- [ ] Run `npm run build` (frontend)
- [ ] Test affected endpoints
- [ ] Check for compilation errors
- [ ] Commit changes with descriptive message
- [ ] Merge to main only after validation

---

## 🎯 SUCCESS CRITERIA

### Backend
- ✅ All services have interfaces
- ✅ No mapping logic in services
- ✅ Mappers centralized in `mapper/` packages
- ✅ Common utilities in `common/` package
- ✅ Custom exceptions throughout
- ✅ Consistent package structure across modules
- ✅ Zero compilation errors
- ✅ All existing endpoints work

### Frontend
- ✅ No duplicate pages
- ✅ Module-based structure
- ✅ Reusable UI components
- ✅ Centralized API calls
- ✅ Consistent error handling
- ✅ Loading states standardized
- ✅ Zero console errors
- ✅ All features functional

---

## 📞 ROLLBACK PLAN

If any task breaks the system:
1. Stop immediately
2. Revert Git branch: `git reset --hard HEAD~1`
3. Document issue
4. Analyze root cause
5. Adjust plan before retrying

---

## 🎓 LESSONS FOR FUTURE PHASES

This refactoring establishes patterns for:
- **Phase B (Shift Scheduling)**: Use standardized module structure from day 1
- **Phase C (Attendance)**: Follow mapper pattern, service interfaces
- **Phase D-H**: Replicate domain module template

**Template for new modules:**
```
<module>/
 ├── dto/
 ├── entity/
 ├── repository/
 ├── service/
 │    ├── <Module>Service.java (interface)
 │    └── <Module>ServiceImpl.java
 ├── mapper/
 │    └── <Module>Mapper.java
 └── <Module>Controller.java
```

---

## 📊 ESTIMATED EFFORT

| Phase | Tasks | Time | Complexity |
|-------|-------|------|------------|
| Backend Refactor | 9 tasks | 15 hours | Medium-High |
| Frontend Refactor | 5 tasks | 10 hours | Medium |
| Testing & Docs | 3 tasks | 5 hours | Low |
| **TOTAL** | **17 tasks** | **30 hours** | **Medium** |

**Recommended:** Execute over 3 weeks with daily testing to ensure stability.

---

## ✅ NEXT STEPS

1. **Review this plan** with team/stakeholders
2. **Create Git branch:** `refactor/phase-1-backend`
3. **Start with Task 1.1** (Common Infrastructure)
4. **Execute one task at a time**
5. **Test after each task**
6. **Document any deviations**

---

**Document Status:** ✅ READY FOR EXECUTION  
**Risk Level:** 🟡 MEDIUM (proper testing required)  
**Business Impact:** 🟢 NO BREAKING CHANGES (backward compatible)

