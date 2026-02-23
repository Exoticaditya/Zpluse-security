# =====================================================
# SGMS Complete Deployment Script (Windows PowerShell)
# =====================================================
# Purpose: Deploy SGMS from scratch - Database + Backend + Frontend
# Usage: .\deploy.ps1 [-SkipDatabase] [-SkipBackend] [-SkipFrontend]
# =====================================================

param(
    [switch]$SkipDatabase,
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [string]$DatabasePassword = "postgres",
    [string]$JwtSecret = "CHANGE_ME_IN_PRODUCTION_$(Get-Random)"
)

$ErrorActionPreference = "Stop"
$WorkspaceRoot = $PSScriptRoot

# Color output helpers
function Write-Success { param($message) Write-Host "✅ $message" -ForegroundColor Green }
function Write-Info { param($message) Write-Host "💡 $message" -ForegroundColor Cyan }
function Write-Warning { param($message) Write-Host "⚠️  $message" -ForegroundColor Yellow }
function Write-Failure { param($message) Write-Host "❌ $message" -ForegroundColor Red }
function Write-Step { param($message) Write-Host "`n========================================" -ForegroundColor Magenta; Write-Host "  $message" -ForegroundColor Magenta; Write-Host "========================================`n" -ForegroundColor Magenta }

# =====================================================
# PRE-FLIGHT CHECKS
# =====================================================

Write-Step "PRE-FLIGHT CHECKS"

# Check PostgreSQL
try {
    $pgVersion = psql --version
    Write-Success "PostgreSQL installed: $pgVersion"
} catch {
    Write-Failure "PostgreSQL not found in PATH. Install from https://www.postgresql.org/download/"
    exit 1
}

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Success "Java installed: $javaVersion"
} catch {
    Write-Failure "Java not found. Install JDK 17+ from https://adoptium.net/"
    exit 1
}

# Check Maven
try {
    $mvnVersion = mvn --version | Select-Object -First 1
    Write-Success "Maven installed: $mvnVersion"
} catch {
    Write-Failure "Maven not found. Install from https://maven.apache.org/download.cgi"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js installed: $nodeVersion"
} catch {
    Write-Failure "Node.js not found. Install from https://nodejs.org/"
    exit 1
}

Write-Success "All dependencies verified"

# =====================================================
# ENVIRONMENT SETUP
# =====================================================

Write-Step "ENVIRONMENT CONFIGURATION"

$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/sgms"
$env:LOCAL_PGUSER = "postgres"
$env:LOCAL_PGPASSWORD = $DatabasePassword
$env:APP_SECURITY_JWT_SECRET = $JwtSecret
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:8080"

Write-Info "DATABASE_URL = $env:DATABASE_URL"
Write-Info "APP_SECURITY_JWT_SECRET = $JwtSecret"
Write-Info "CORS_ALLOWED_ORIGINS = $env:CORS_ALLOWED_ORIGINS"

# Set PGPASSWORD for psql commands
$env:PGPASSWORD = $DatabasePassword

# =====================================================
# DATABASE SETUP
# =====================================================

if (-not $SkipDatabase) {
    Write-Step "DATABASE SETUP"
    
    Write-Info "Creating database..."
    try {
        # Check if database exists
        $dbExists = psql -U postgres -lqt | Select-String -Pattern "sgms"
        
        if ($dbExists) {
            Write-Warning "Database 'sgms' already exists. Dropping it..."
            psql -U postgres -c "DROP DATABASE IF EXISTS sgms;"
        }
        
        # Create fresh database
        psql -U postgres -f "$WorkspaceRoot\db_setup.sql"
        Write-Success "Database 'sgms' created"
        
    } catch {
        Write-Failure "Database creation failed: $_"
        exit 1
    }
    
    # Run Flyway migrations
    Write-Info "Running Flyway migrations..."
    try {
        Push-Location "$WorkspaceRoot\backend"
        
        # Use Maven Flyway plugin
        mvn flyway:migrate -Dspring.profiles.active=local
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Migrations completed"
        } else {
            Write-Failure "Migration failed with exit code $LASTEXITCODE"
            Pop-Location
            exit 1
        }
        
        Pop-Location
    } catch {
        Write-Failure "Migration error: $_"
        Pop-Location
        exit 1
    }
    
    # Insert seed data
    Write-Info "Inserting seed data..."
    try {
        psql -U postgres -d sgms -f "$WorkspaceRoot\backend\SEED_DATA_COMPLETE.sql"
        Write-Success "Seed data inserted"
    } catch {
        Write-Failure "Seed data insertion failed: $_"
        exit 1
    }
    
    # Verify database
    Write-Info "Verifying database setup..."
    psql -U postgres -d sgms -f "$WorkspaceRoot\psql_inspection.sql" > "$WorkspaceRoot\db_inspection_report.txt"
    Write-Success "Database inspection report saved to db_inspection_report.txt"
    
} else {
    Write-Warning "Skipping database setup"
}

# =====================================================
# BACKEND BUILD & TEST
# =====================================================

if (-not $SkipBackend) {
    Write-Step "BACKEND BUILD"
    
    Push-Location "$WorkspaceRoot\backend"
    
    Write-Info "Cleaning previous builds..."
    mvn clean
    
    Write-Info "Compiling backend..."
    mvn compile -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Backend compilation failed"
        Pop-Location
        exit 1
    }
    
    Write-Success "Backend compiled successfully"
    
    Write-Info "Running backend tests..."
    mvn test
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Some tests failed, but continuing..."
    } else {
        Write-Success "All backend tests passed"
    }
    
    Write-Info "Packaging application..."
    mvn package -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Backend packaging failed"
        Pop-Location
        exit 1
    }
    
    Write-Success "Backend JAR packaged: target/*.jar"
    
    Pop-Location
    
} else {
    Write-Warning "Skipping backend build"
}

# =====================================================
# FRONTEND BUILD
# =====================================================

if (-not $SkipFrontend) {
    Write-Step "FRONTEND BUILD"
    
    Push-Location "$WorkspaceRoot"
    
    Write-Info "Installing frontend dependencies..."
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "npm install failed"
        Pop-Location
        exit 1
    }
    
    Write-Success "Dependencies installed"
    
    Write-Info "Building frontend..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Frontend build failed"
        Pop-Location
        exit 1
    }
    
    Write-Success "Frontend built successfully: dist/"
    
    Pop-Location
    
} else {
    Write-Warning "Skipping frontend build"
}

# =====================================================
# RUN AUDITOR
# =====================================================

Write-Step "RUNNING PROJECT AUDITOR"

Write-Info "Executing Python auditor..."
python "$WorkspaceRoot\sgms_auditor.py"

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Auditor reported issues - check sgms_audit_report.json"
} else {
    Write-Success "Audit completed - report saved to sgms_audit_report.json"
}

# =====================================================
# DEPLOYMENT SUMMARY
# =====================================================

Write-Step "DEPLOYMENT COMPLETE"

Write-Host @"

┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT SUMMARY                       │
└─────────────────────────────────────────────────────────────┘

Database:       postgres@localhost:5432/sgms
Backend JAR:    backend/target/sgms-*.jar
Frontend:       dist/
Audit Report:   sgms_audit_report.json

NEXT STEPS:
───────────────────────────────────────────────────────────────
1. Review audit report:
   cat sgms_audit_report.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

2. Start backend server:
   cd backend
   mvn spring-boot:run

3. Start frontend dev server:
   npm run dev

4. Access application:
   Frontend:  http://localhost:5173
   Backend:   http://localhost:8080/api

5. Default credentials (from seed data):
   Email:     admin@zpluse.com
   Password:  Admin@123

ENVIRONMENT VARIABLES:
───────────────────────────────────────────────────────────────
DATABASE_URL:            $env:DATABASE_URL
APP_SECURITY_JWT_SECRET: $env:APP_SECURITY_JWT_SECRET
CORS_ALLOWED_ORIGINS:    $env:CORS_ALLOWED_ORIGINS

For production deployment, export these environment variables
in your hosting platform (Railway, AWS, etc.)

"@

Write-Success "System ready for testing"

# Offer to start servers
$startServers = Read-Host "`nStart development servers now? (Y/N)"
if ($startServers -eq 'Y' -or $startServers -eq 'y') {
    Write-Info "Starting backend server..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot\backend'; mvn spring-boot:run"
    
    Start-Sleep -Seconds 3
    
    Write-Info "Starting frontend dev server..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot'; npm run dev"
    
    Write-Success "Servers launching in new windows"
    Write-Info "Wait 30 seconds for backend startup, then visit http://localhost:5173"
}

Write-Host "`n✨ Deployment script completed ✨`n" -ForegroundColor Green
