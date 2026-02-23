-- =====================================================
-- SGMS PostgreSQL Database Inspection Commands
-- =====================================================
-- Purpose: Diagnose database structure, data integrity, and readiness
-- Usage: psql -U postgres -d sgms -f psql_inspection.sql
-- Or run commands individually in psql shell
-- =====================================================

\echo ''
\echo '========================================='
\echo 'SGMS DATABASE INSPECTION REPORT'
\echo '========================================='
\echo ''

-- Set nice output format
\pset border 2
\pset linestyle unicode
\pset null '(null)'

-- =====================================================
-- 1. DATABASE OVERVIEW
-- =====================================================
\echo '1. DATABASE OVERVIEW'
\echo '-------------------'

SELECT 
    current_database() as database_name,
    current_user as connected_user,
    version() as postgres_version,
    pg_size_pretty(pg_database_size(current_database())) as database_size;

\echo ''

-- =====================================================
-- 2. TABLE STRUCTURE VERIFICATION
-- =====================================================
\echo '2. ALL TABLES IN DATABASE'
\echo '-------------------------'

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = schemaname AND table_name = tablename) as column_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\echo ''

-- =====================================================
-- 3. ROW COUNTS FOR ALL TABLES
-- =====================================================
\echo '3. ROW COUNTS (Data Population Check)'
\echo '--------------------------------------'

SELECT 
    'roles' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ EMPTY'
        WHEN COUNT(*) < 4 THEN '⚠️  INCOMPLETE (Need 4: ADMIN, SUPERVISOR, GUARD, CLIENT)'
        ELSE '✅ OK'
    END as status
FROM roles
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ EMPTY - No users created'
        WHEN COUNT(*) < 2 THEN '⚠️  Need at least admin + test user'
        ELSE '✅ OK'
    END as status
FROM users
UNION ALL
SELECT 
    'guards' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '⚠️  No guards registered'
        ELSE '✅ OK'
    END as status
FROM guards
UNION ALL
SELECT 
    'client_accounts' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '⚠️  No clients registered'
        ELSE '✅ OK'
    END as status
FROM client_accounts
UNION ALL
SELECT 
    'sites' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '⚠️  No sites created'
        ELSE '✅ OK'
    END as status
FROM sites
UNION ALL
SELECT 
    'site_posts' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '⚠️  No site posts created'
        ELSE '✅ OK'
    END as status
FROM site_posts
UNION ALL
SELECT 
    'guard_assignments' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '⚠️  No guard assignments'
        ELSE '✅ OK'
    END as status
FROM guard_assignments
UNION ALL
SELECT 
    'attendance_logs' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '💡 No attendance records (OK if new system)'
        ELSE '✅ OK'
    END as status
FROM attendance_logs
UNION ALL
SELECT 
    'shift_types' as table_name,
    COUNT(*) as row_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ EMPTY - Need shift types'
        WHEN COUNT(*) < 3 THEN '⚠️  Recommend at least 3 shift types'
        ELSE '✅ OK'
    END as status
FROM shift_types;

\echo ''

-- =====================================================
-- 4. CHECK ROLES EXIST
-- =====================================================
\echo '4. ROLE VERIFICATION'
\echo '--------------------'

SELECT 
    name,
    description,
    CASE 
        WHEN name IN ('ADMIN', 'SUPERVISOR', 'GUARD', 'CLIENT') THEN '✅ Required'
        ELSE '💡 Custom'
    END as role_type
FROM roles
ORDER BY 
    CASE name
        WHEN 'ADMIN' THEN 1
        WHEN 'SUPERVISOR' THEN 2
        WHEN 'GUARD' THEN 3
        WHEN 'CLIENT' THEN 4
        ELSE 5
    END;

\echo ''

-- =====================================================
-- 5. USER ACCOUNTS AND ROLES
-- =====================================================
\echo '5. USER ACCOUNTS WITH ROLES'
\echo '----------------------------'

SELECT 
    u.id,
    u.email,
    u.full_name,
    u.status,
    STRING_AGG(r.name, ', ' ORDER BY r.name) as roles,
    u.created_at::date as created_date
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.full_name, u.status, u.created_at
ORDER BY u.id;

\echo ''

-- =====================================================
-- 6. GUARDS WITH ASSIGNMENT STATUS
-- =====================================================
\echo '6. GUARDS AND THEIR ASSIGNMENTS'
\echo '--------------------------------'

SELECT 
    g.id as guard_id,
    u.full_name as guard_name,
    g.employee_code,
    g.status as guard_status,
    COUNT(DISTINCT ga.id) as total_assignments,
    COUNT(DISTINCT CASE WHEN ga.active = true AND ga.status = 'ACTIVE' THEN ga.id END) as active_assignments,
    sp.full_name as supervisor_name
FROM guards g
JOIN users u ON g.user_id = u.id
LEFT JOIN guard_assignments ga ON g.id = ga.guard_id
LEFT JOIN users sp ON g.supervisor_id = sp.id
GROUP BY g.id, u.full_name, g.employee_code, g.status, sp.full_name
ORDER BY g.id;

\echo ''

-- =====================================================
-- 7. SITES AND THEIR POSTS
-- =====================================================
\echo '7. SITES WITH POST COUNTS'
\echo '--------------------------'

SELECT 
    s.id as site_id,
    s.name as site_name,
    ca.name as client_name,
    s.status,
    COUNT(sp.id) as total_posts,
    COUNT(CASE WHEN sp.status = 'ACTIVE' THEN 1 END) as active_posts
FROM sites s
LEFT JOIN client_accounts ca ON s.client_account_id = ca.id
LEFT JOIN site_posts sp ON s.id = sp.site_id
GROUP BY s.id, s.name, ca.name, s.status
ORDER BY s.id;

\echo ''

-- =====================================================
-- 8. ACTIVE ASSIGNMENTS TODAY
-- =====================================================
\echo '8. ACTIVE ASSIGNMENTS (Effective Today)'
\echo '----------------------------------------'

SELECT 
    ga.id,
    u.full_name as guard_name,
    s.name as site_name,
    sp.post_name,
    st.name as shift_type,
    ga.effective_from,
    ga.effective_to,
    ga.status
FROM guard_assignments ga
JOIN guards g ON ga.guard_id = g.id
JOIN users u ON g.user_id = u.id
LEFT JOIN site_posts sp ON ga.site_post_id = sp.id
LEFT JOIN sites s ON sp.site_id = s.id
LEFT JOIN shift_types st ON ga.shift_type_id = st.id
WHERE ga.effective_from <= CURRENT_DATE
  AND (ga.effective_to IS NULL OR ga.effective_to >= CURRENT_DATE)
  AND ga.active = true
ORDER BY s.name, sp.post_name;

\echo ''

-- =====================================================
-- 9. RECENT ATTENDANCE (Last 7 Days)
-- =====================================================
\echo '9. RECENT ATTENDANCE RECORDS (Last 7 Days)'
\echo '-------------------------------------------'

SELECT 
    al.attendance_date,
    u.full_name as guard_name,
    al.check_in_time::time as check_in,
    al.check_out_time::time as check_out,
    al.status,
    al.late_minutes,
    al.early_leave_minutes
FROM attendance_logs al
JOIN guards g ON al.guard_id = g.id
JOIN users u ON g.user_id = u.id
WHERE al.attendance_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY al.attendance_date DESC, u.full_name
LIMIT 50;

\echo ''

-- =====================================================
-- 10. DATA INTEGRITY CHECKS
-- =====================================================
\echo '10. DATA INTEGRITY CHECKS'
\echo '-------------------------'

\echo 'a) Users without roles:'
SELECT u.id, u.email, u.full_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

\echo ''
\echo 'b) Guards without user accounts:'
SELECT g.id, g.employee_code
FROM guards g
LEFT JOIN users u ON g.user_id = u.id
WHERE u.id IS NULL;

\echo ''
\echo 'c) Assignments with missing references:'
SELECT 
    ga.id,
    CASE WHEN g.id IS NULL THEN 'Missing Guard' END as guard_issue,
    CASE WHEN sp.id IS NULL THEN 'Missing SitePost' END as post_issue,
    CASE WHEN st.id IS NULL THEN 'Missing ShiftType' END as shift_issue
FROM guard_assignments ga
LEFT JOIN guards g ON ga.guard_id = g.id
LEFT JOIN site_posts sp ON ga.site_post_id = sp.id
LEFT JOIN shift_types st ON ga.shift_type_id = st.id
WHERE g.id IS NULL OR sp.id IS NULL OR st.id IS NULL;

\echo ''
\echo 'd) Deleted users (soft delete check):'
SELECT id, email, full_name, deleted_at
FROM users
WHERE deleted_at IS NOT NULL;

\echo ''

-- =====================================================
-- 11. MIGRATION STATUS (Flyway)
-- =====================================================
\echo '11. FLYWAY MIGRATION HISTORY'
\echo '-----------------------------'

SELECT 
    installed_rank,
    version,
    description,
    type,
    script,
    installed_on,
    execution_time,
    success
FROM flyway_schema_history
ORDER BY installed_rank;

\echo ''

-- =====================================================
-- 12. INDEX STATUS
-- =====================================================
\echo '12. DATABASE INDEXES'
\echo '--------------------'

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

\echo ''

-- =====================================================
-- 13. CONSTRAINTS VERIFICATION
-- =====================================================
\echo '13. FOREIGN KEY CONSTRAINTS'
\echo '----------------------------'

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

\echo ''

-- =====================================================
-- 14. MISSING DATA SUMMARY
-- =====================================================
\echo '14. DEPLOYMENT READINESS CHECKLIST'
\echo '-----------------------------------'

WITH checks AS (
    SELECT 'Roles defined' as check_name,
           CASE WHEN COUNT(*) >= 4 THEN '✅ PASS' ELSE '❌ FAIL' END as status
    FROM roles
    UNION ALL
    SELECT 'Admin user exists',
           CASE WHEN EXISTS (
               SELECT 1 FROM users u
               JOIN user_roles ur ON u.id = ur.user_id
               JOIN roles r ON ur.role_id = r.id
               WHERE r.name = 'ADMIN'
           ) THEN '✅ PASS' ELSE '❌ FAIL' END
    UNION ALL
    SELECT 'Shift types defined',
           CASE WHEN COUNT(*) > 0 THEN '✅ PASS' ELSE '❌ FAIL' END
    FROM shift_types
    UNION ALL
    SELECT 'Flyway migrations applied',
           CASE WHEN COUNT(*) > 0 THEN '✅ PASS' ELSE '❌ FAIL' END
    FROM flyway_schema_history WHERE success = true
)
SELECT * FROM checks;

\echo ''
\echo '========================================='
\echo 'END OF INSPECTION REPORT'
\echo '========================================='
\echo ''
\echo 'To fix issues:'
\echo '  1. Run migrations: mvn flyway:migrate'
\echo '  2. Seed data: psql -U postgres -d sgms -f SEED_DATA_COMPLETE.sql'
\echo '  3. Verify again: psql -U postgres -d sgms -f psql_inspection.sql'
\echo ''
