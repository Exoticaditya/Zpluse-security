#!/usr/bin/env python3
"""
SGMS Project Auditor
=====================
Comprehensive system auditor to identify missing components, errors, and required actions.

Usage: python sgms_auditor.py
"""

import os
import json
import subprocess
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

class SGMSAuditor:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_root = self.project_root / "backend"
        self.frontend_root = self.project_root / "src"
        self.issues = {
            "critical": [],
            "warning": [],
            "info": [],
            "success": []
        }
        self.stats = {
            "total_issues": 0,
            "critical_count": 0,
            "warning_count": 0,
            "backend_files": 0,
            "frontend_files": 0
        }

    def log_issue(self, level: str, category: str, message: str, fix: str = None):
        """Log an issue with optional fix suggestion"""
        issue = {
            "category": category,
            "message": message,
            "fix": fix,
            "timestamp": datetime.now().isoformat()
        }
        self.issues[level].append(issue)
        self.stats["total_issues"] += 1
        if level == "critical":
            self.stats["critical_count"] += 1
        elif level == "warning":
            self.stats["warning_count"] += 1

    def check_environment_variables(self):
        """Check required environment variables"""
        print("\n🔍 Checking Environment Variables...")
        
        required_vars = {
            "APP_SECURITY_JWT_SECRET": "JWT signing secret for authentication",
            "DATABASE_URL": "PostgreSQL connection string (for prod)",
        }
        
        optional_vars = {
            "SPRING_PROFILES_ACTIVE": "Should be 'local' or 'prod'",
            "CORS_ALLOWED_ORIGINS": "Frontend URLs for CORS",
            "JWT_ACCESS_TTL_SECONDS": "Token expiry time (default: 86400)",
            "VITE_API_BASE_URL": "Backend API URL for frontend"
        }
        
        for var, description in required_vars.items():
            if not os.getenv(var):
                self.log_issue(
                    "critical",
                    "Environment",
                    f"Missing required environment variable: {var}",
                    f"Set {var}: {description}"
                )
            else:
                self.log_issue("success", "Environment", f"✓ {var} is set")
        
        for var, description in optional_vars.items():
            if not os.getenv(var):
                self.log_issue(
                    "info",
                    "Environment",
                    f"Optional variable not set: {var}",
                    f"Consider setting {var}: {description}"
                )
            else:
                self.log_issue("success", "Environment", f"✓ {var} is set")

    def check_database_migrations(self):
        """Check Flyway migration files"""
        print("\n🔍 Checking Database Migrations...")
        
        migration_dir = self.backend_root / "src" / "main" / "resources" / "db" / "migration"
        
        if not migration_dir.exists():
            self.log_issue(
                "critical",
                "Database",
                "Migration directory not found",
                f"Create directory: {migration_dir}"
            )
            return
        
        migrations = sorted(migration_dir.glob("V*.sql"))
        
        if len(migrations) == 0:
            self.log_issue(
                "critical",
                "Database",
                "No migration files found",
                "Add Flyway migration SQL files to db/migration/"
            )
        else:
            self.log_issue("success", "Database", f"✓ Found {len(migrations)} migration files")
            
            # Check for gaps in migration versions
            versions = []
            for mig in migrations:
                match = re.match(r"V(\d+)__", mig.name)
                if match:
                    versions.append(int(match.group(1)))
            
            versions.sort()
            expected = list(range(1, max(versions) + 1))
            missing = set(expected) - set(versions)
            
            if missing:
                self.log_issue(
                    "warning",
                    "Database",
                    f"Migration version gaps detected: {sorted(missing)}",
                    "Check if migrations were accidentally deleted"
                )

    def check_backend_compilation(self):
        """Check if backend compiles"""
        print("\n🔍 Checking Backend Compilation...")
        
        if not (self.backend_root / "pom.xml").exists():
            self.log_issue(
                "critical",
                "Backend",
                "pom.xml not found",
                "Maven project file is missing"
            )
            return
        
        try:
            result = subprocess.run(
                ["mvn", "compile", "-DskipTests", "-q"],
                cwd=self.backend_root,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                self.log_issue("success", "Backend", "✓ Backend compiles successfully")
            else:
                self.log_issue(
                    "critical",
                    "Backend",
                    "Backend compilation failed",
                    f"Maven errors:\n{result.stderr}"
                )
        except subprocess.TimeoutExpired:
            self.log_issue("warning", "Backend", "Compilation timeout (>2 min)")
        except FileNotFoundError:
            self.log_issue(
                "critical",
                "Backend",
                "Maven (mvn) not found in PATH",
                "Install Maven: https://maven.apache.org/"
            )

    def check_frontend_dependencies(self):
        """Check frontend dependencies and build"""
        print("\n🔍 Checking Frontend...")
        
        package_json = self.project_root / "package.json"
        
        if not package_json.exists():
            self.log_issue(
                "critical",
                "Frontend",
                "package.json not found",
                "Node.js project file is missing"
            )
            return
        
        # Check node_modules
        if not (self.project_root / "node_modules").exists():
            self.log_issue(
                "warning",
                "Frontend",
                "node_modules not found",
                "Run: npm install"
            )
        else:
            self.log_issue("success", "Frontend", "✓ node_modules exists")
        
        # Try to build
        try:
            result = subprocess.run(
                ["npm", "run", "build"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                self.log_issue("success", "Frontend", "✓ Frontend builds successfully")
            else:
                self.log_issue(
                    "critical",
                    "Frontend",
                    "Frontend build failed",
                    f"Build errors:\n{result.stderr}"
                )
        except subprocess.TimeoutExpired:
            self.log_issue("warning", "Frontend", "Build timeout (>2 min)")
        except FileNotFoundError:
            self.log_issue(
                "critical",
                "Frontend",
                "npm not found in PATH",
                "Install Node.js: https://nodejs.org/"
            )

    def check_api_endpoints(self):
        """Check that all controllers have proper endpoints"""
        print("\n🔍 Checking API Endpoints...")
        
        controllers_dir = self.backend_root / "src" / "main" / "java" / "com" / "sgms"
        
        if not controllers_dir.exists():
            self.log_issue("critical", "API", "Source directory not found")
            return
        
        controllers = list(controllers_dir.rglob("*Controller.java"))
        
        if len(controllers) == 0:
            self.log_issue(
                "warning",
                "API",
                "No controllers found",
                "Create REST controllers for API endpoints"
            )
        else:
            self.log_issue("success", "API", f"✓ Found {len(controllers)} controllers")
            
            # Check for @RestController and @RequestMapping
            for controller in controllers:
                content = controller.read_text(encoding='utf-8')
                
                if "@RestController" not in content:
                    self.log_issue(
                        "warning",
                        "API",
                        f"{controller.name} missing @RestController annotation"
                    )
                
                if "@RequestMapping" not in content:
                    self.log_issue(
                        "warning",
                        "API",
                        f"{controller.name} missing @RequestMapping annotation"
                    )

    def check_dto_usage(self):
        """Check that controllers return DTOs, not entities"""
        print("\n🔍 Checking DTO Usage (Anti-Pattern Detection)...")
        
        controllers_dir = self.backend_root / "src" / "main" / "java" / "com" / "sgms"
        
        if not controllers_dir.exists():
            return
        
        controllers = list(controllers_dir.rglob("*Controller.java"))
        entity_exposure_count = 0
        
        for controller in controllers:
            content = controller.read_text(encoding='utf-8')
            
            # Check for Entity returns (bad pattern)
            entity_returns = re.findall(r'return\s+\w+Entity', content)
            if entity_returns:
                entity_exposure_count += len(entity_returns)
                self.log_issue(
                    "critical",
                    "Architecture",
                    f"{controller.name} returns Entity directly",
                    "Create DTO classes and map entities to DTOs"
                )
        
        if entity_exposure_count == 0:
            self.log_issue("success", "Architecture", "✓ No entity exposure detected")

    def check_security_configuration(self):
        """Check security configuration"""
        print("\n🔍 Checking Security Configuration...")
        
        security_dir = self.backend_root / "src" / "main" / "java" / "com" / "sgms" / "security"
        
        if not security_dir.exists():
            self.log_issue(
                "critical",
                "Security",
                "Security package not found",
                "Create security configuration (JWT, CORS, etc.)"
            )
            return
        
        required_files = [
            "SecurityConfig.java",
            "JwtAuthenticationFilter.java",
            "UserPrincipal.java"
        ]
        
        for file in required_files:
            if not (security_dir / file).exists():
                self.log_issue(
                    "warning",
                    "Security",
                    f"Missing security component: {file}",
                    f"Create {file} for authentication/authorization"
                )
            else:
                self.log_issue("success", "Security", f"✓ {file} exists")

    def check_database_connection(self):
        """Check if database is accessible"""
        print("\n🔍 Checking Database Connection...")
        
        db_url = os.getenv("DATABASE_URL")
        
        if not db_url:
            self.log_issue(
                "info",
                "Database",
                "DATABASE_URL not set - will use local PostgreSQL",
                "Ensure local PostgreSQL is running on localhost:5432"
            )
            db_url = "postgresql://postgres:postgres@localhost:5432/sgms"
        
        # Try to connect using psycopg2 if available
        try:
            import psycopg2
            
            # Parse DATABASE_URL
            # Format: postgresql://user:pass@host:port/db
            match = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
            if match:
                user, password, host, port, dbname = match.groups()
                
                try:
                    conn = psycopg2.connect(
                        host=host,
                        port=port,
                        user=user,
                        password=password,
                        dbname=dbname,
                        connect_timeout=5
                    )
                    conn.close()
                    self.log_issue("success", "Database", "✓ Database connection successful")
                except psycopg2.OperationalError as e:
                    self.log_issue(
                        "critical",
                        "Database",
                        f"Cannot connect to database: {e}",
                        "Check PostgreSQL is running and credentials are correct"
                    )
        except ImportError:
            self.log_issue(
                "info",
                "Database",
                "psycopg2 not installed - skipping connection test",
                "Install with: pip install psycopg2-binary"
            )

    def analyze_code_structure(self):
        """Analyze overall code structure"""
        print("\n🔍 Analyzing Code Structure...")
        
        # Count Java files
        java_files = list(self.backend_root.rglob("*.java"))
        self.stats["backend_files"] = len(java_files)
        
        # Count React files
        jsx_files = list(self.frontend_root.rglob("*.jsx")) if self.frontend_root.exists() else []
        self.stats["frontend_files"] = len(jsx_files)
        
        self.log_issue("info", "Structure", f"Backend: {len(java_files)} Java files")
        self.log_issue("info", "Structure", f"Frontend: {len(jsx_files)} JSX files")
        
        # Check for common packages
        expected_packages = [
            "controller", "service", "repository", "entity", "dto", 
            "config", "security", "exception"
        ]
        
        for package in expected_packages:
            package_dir = self.backend_root / "src" / "main" / "java" / "com" / "sgms" / package
            if package_dir.exists():
                self.log_issue("success", "Structure", f"✓ {package}/ package exists")
            else:
                self.log_issue(
                    "warning",
                    "Structure",
                    f"{package}/ package not found",
                    f"Create package for {package} layer"
                )

    def generate_report(self):
        """Generate comprehensive audit report"""
        print("\n" + "=" * 80)
        print("📊 SGMS PROJECT AUDIT REPORT")
        print("=" * 80)
        print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Project Root: {self.project_root}")
        print("=" * 80)
        
        # Statistics
        print("\n📈 STATISTICS:")
        print(f"  Total Issues Found: {self.stats['total_issues']}")
        print(f"  Critical Issues: {self.stats['critical_count']}")
        print(f"  Warnings: {self.stats['warning_count']}")
        print(f"  Backend Files: {self.stats['backend_files']} Java files")
        print(f"  Frontend Files: {self.stats['frontend_files']} JSX files")
        
        # Critical Issues
        if self.issues["critical"]:
            print("\n🔴 CRITICAL ISSUES (Must fix before deployment):")
            for i, issue in enumerate(self.issues["critical"], 1):
                print(f"\n  {i}. [{issue['category']}] {issue['message']}")
                if issue['fix']:
                    print(f"     Fix: {issue['fix']}")
        
        # Warnings
        if self.issues["warning"]:
            print("\n⚠️  WARNINGS (Should address):")
            for i, issue in enumerate(self.issues["warning"], 1):
                print(f"\n  {i}. [{issue['category']}] {issue['message']}")
                if issue['fix']:
                    print(f"     Fix: {issue['fix']}")
        
        # Info/Success
        if self.issues["info"]:
            print("\n💡 INFORMATION:")
            for issue in self.issues["info"][:5]:  # Show first 5
                print(f"  • [{issue['category']}] {issue['message']}")
        
        # Success summary
        success_count = len(self.issues["success"])
        if success_count > 0:
            print(f"\n✅ PASSED CHECKS: {success_count}")
        
        # Overall Status
        print("\n" + "=" * 80)
        if self.stats['critical_count'] == 0:
            print("✅ STATUS: READY FOR DEPLOYMENT")
            print("   No critical issues found. Review warnings and proceed.")
        else:
            print("❌ STATUS: NOT READY FOR DEPLOYMENT")
            print(f"   Fix {self.stats['critical_count']} critical issue(s) before deploying.")
        print("=" * 80)
        
        # Save to file
        report_file = self.project_root / "AUDIT_REPORT.json"
        with open(report_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "stats": self.stats,
                "issues": self.issues
            }, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {report_file}")

    def run_full_audit(self):
        """Run complete audit"""
        print("🚀 Starting SGMS Project Audit...\n")
        
        self.check_environment_variables()
        self.check_database_migrations()
        self.check_backend_compilation()
        self.check_frontend_dependencies()
        self.check_api_endpoints()
        self.check_dto_usage()
        self.check_security_configuration()
        self.check_database_connection()
        self.analyze_code_structure()
        
        self.generate_report()


if __name__ == "__main__":
    auditor = SGMSAuditor()
    auditor.run_full_audit()
