-- =====================================================
-- SGMS PostgreSQL Database Setup Script
-- =====================================================
-- Purpose: Initialize SGMS database from scratch
-- Usage: 
--   Windows: psql -U postgres -f db_setup.sql
--   Linux/Mac: sudo -u postgres psql -f db_setup.sql
-- =====================================================

-- Database creation (run as postgres superuser)
DROP DATABASE IF EXISTS sgms;
CREATE DATABASE sgms
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

\echo 'Database "sgms" created successfully'

-- Connect to the new database
\c sgms

\echo 'Connected to sgms database'

-- Create Flyway metadata table if needed
CREATE TABLE IF NOT EXISTS flyway_schema_history (
    installed_rank INT NOT NULL,
    version VARCHAR(50),
    description VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    script VARCHAR(1000) NOT NULL,
    checksum INT,
    installed_by VARCHAR(100) NOT NULL,
    installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    execution_time INT NOT NULL,
    success BOOLEAN NOT NULL,
    CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank)
);

CREATE INDEX IF NOT EXISTS flyway_schema_history_s_idx ON flyway_schema_history (success);

\echo ''
\echo '========================================='
\echo 'DATABASE READY FOR MIGRATIONS'
\echo '========================================='
\echo ''
\echo 'Next steps:'
\echo '  1. Set environment variable: $env:DATABASE_URL="jdbc:postgresql://localhost:5432/sgms"'
\echo '  2. Run migrations: cd backend; mvn flyway:migrate'
\echo '  3. Insert seed data: psql -U postgres -d sgms -f SEED_DATA_COMPLETE.sql'
\echo '  4. Verify: psql -U postgres -d sgms -f psql_inspection.sql'
\echo ''
