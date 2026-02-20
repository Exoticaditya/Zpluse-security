#!/usr/bin/env python3
"""
SGMS Automated QA Audit System
==============================
Comprehensive quality assurance testing for backend and frontend

Features:
- Tests all backend API endpoints
- Detects 500, 401, 404 errors
- Measures response times
- Validates JSON responses
- Checks frontend routes
- Generates HTML report
- Loads credentials from .env

Usage:
    python qa_audit.py
    python qa_audit.py --api-url http://localhost:8080/api
    python qa_audit.py --frontend-url http://localhost:5173
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import argparse
import sys
import os
from pathlib import Path

# Try to import python-dotenv for .env support
try:
    from dotenv import load_dotenv
    DOTENV_AVAILABLE = True
except ImportError:
    DOTENV_AVAILABLE = False

# ANSI color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


class QAResult:
    """Store test result data"""
    def __init__(self, endpoint: str, method: str, status: str, 
                 status_code: int = None, response_time: float = None, 
                 error: str = None, warning: str = None):
        self.endpoint = endpoint
        self.method = method
        self.status = status  # 'pass', 'fail', 'warning'
        self.status_code = status_code
        self.response_time = response_time
        self.error = error
        self.warning = warning
        self.timestamp = datetime.now().isoformat()


class SGMSQASystem:
    """Main QA testing system"""
    
    def __init__(self, api_base_url: str, frontend_url: str, admin_email: str = None, admin_password: str = None):
        self.api_base_url = api_base_url.rstrip('/')
        self.frontend_url = frontend_url.rstrip('/')
        self.admin_email = admin_email
        self.admin_password = admin_password
        self.results: List[QAResult] = []
        self.token: Optional[str] = None
        self.session = requests.Session()
        
    def print_header(self, text: str):
        """Print section header"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    def print_result(self, result: QAResult):
        """Print test result to terminal"""
        status_icon = {
            'pass': f"{Colors.GREEN}✔{Colors.RESET}",
            'fail': f"{Colors.RED}❌{Colors.RESET}",
            'warning': f"{Colors.YELLOW}⚠{Colors.RESET}"
        }
        
        icon = status_icon.get(result.status, '?')
        method_color = Colors.BLUE
        
        print(f"{icon} {method_color}{result.method}{Colors.RESET} {result.endpoint}", end='')
        
        if result.status_code:
            code_color = Colors.GREEN if result.status_code < 300 else Colors.RED
            print(f" - {code_color}{result.status_code}{Colors.RESET}", end='')
        
        if result.response_time:
            time_color = Colors.GREEN if result.response_time < 2000 else Colors.YELLOW if result.response_time < 5000 else Colors.RED
            print(f" - {time_color}{result.response_time:.0f}ms{Colors.RESET}", end='')
        
        if result.error:
            print(f"\n  {Colors.RED}Error: {result.error}{Colors.RESET}")
        elif result.warning:
            print(f"\n  {Colors.YELLOW}Warning: {result.warning}{Colors.RESET}")
        else:
            print()
    
    def test_endpoint(self, endpoint: str, method: str = 'GET', 
                     requires_auth: bool = True, payload: dict = None) -> QAResult:
        """Test a single endpoint"""
        url = f"{self.api_base_url}{endpoint}"
        headers = {}
        
        if requires_auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            start_time = time.time()
            
            if method == 'GET':
                response = self.session.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                headers['Content-Type'] = 'application/json'
                response = self.session.post(url, headers=headers, json=payload, timeout=10)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers, timeout=10)
            else:
                return QAResult(endpoint, method, 'fail', error='Unsupported HTTP method')
            
            response_time = (time.time() - start_time) * 1000  # Convert to ms
            
            # Check for errors
            if response.status_code == 401:
                return QAResult(endpoint, method, 'fail', response.status_code, response_time, 
                              error='Unauthorized - Check JWT token')
            
            if response.status_code == 500:
                error_msg = 'Internal Server Error'
                try:
                    error_data = response.json()
                    if 'message' in error_data:
                        error_msg += f": {error_data['message']}"
                except:
                    pass
                return QAResult(endpoint, method, 'fail', response.status_code, response_time, 
                              error=error_msg)
            
            if response.status_code >= 400:
                # Check for ErrorResponse {success: false, message, timestamp, path}
                try:
                    error_data = response.json()
                    if error_data.get('success') == False:
                        error_msg = error_data.get('message', 'Unknown error')
                        return QAResult(endpoint, method, 'fail', response.status_code, response_time, 
                                      error=f'Backend error: {error_msg}')
                except:
                    pass
                
                return QAResult(endpoint, method, 'fail', response.status_code, response_time, 
                              error=f'HTTP {response.status_code}')
            
            # Check for HTML response when expecting JSON
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' in content_type:
                return QAResult(endpoint, method, 'fail', response.status_code, response_time,
                              error='HTML response received (expected JSON) - Check CORS or server routing')
            
            # Check for 302 redirect
            if response.status_code == 302:
                return QAResult(endpoint, method, 'fail', response.status_code, response_time,
                              error='Redirect detected - API should return JSON, not redirect')
            
            # Check response time
            warning = None
            if response_time > 5000:
                warning = 'Very slow response (>5s)'
            elif response_time > 2000:
                warning = 'Slow response (>2s)'
            
            # Validate JSON
            try:
                response.json()
            except:
                return QAResult(endpoint, method, 'fail', response.status_code, response_time, 
                              error='Invalid JSON response')
            
            status = 'warning' if warning else 'pass'
            return QAResult(endpoint, method, status, response.status_code, response_time, 
                          warning=warning)
            
        except requests.exceptions.Timeout:
            return QAResult(endpoint, method, 'fail', error='Request timeout (>10s)')
        except requests.exceptions.ConnectionError:
            return QAResult(endpoint, method, 'fail', error='Connection failed - Is server running?')
        except Exception as e:
            return QAResult(endpoint, method, 'fail', error=str(e))
    
    def login_admin(self) -> bool:
        """Login as admin to get JWT token"""
        self.print_header("AUTHENTICATION TEST")
        
        # Try credentials from .env if available, then fallback to defaults
        login_payloads = []
        
        if self.admin_email and self.admin_password:
            login_payloads.append({'email': self.admin_email, 'password': self.admin_password})
            print(f"{Colors.BLUE}Using credentials from .env file{Colors.RESET}")
        else:
            print(f"{Colors.YELLOW}No .env credentials found, using defaults{Colors.RESET}")
        
        # Fallback credentials
        login_payloads.extend([
            {'email': 'admin@sgms.com', 'password': 'admin123'},
            {'email': 'admin@test.com', 'password': 'admin123'},
            {'email': 'test@admin.com', 'password': 'Test@123'},
        ])
        
        for payload in login_payloads:
            print(f"Attempting login: {payload['email']}")
            result = self.test_endpoint('/auth/login', method='POST', 
                                       requires_auth=False, payload=payload)
            self.print_result(result)
            self.results.append(result)
            
            if result.status == 'pass':
                try:
                    url = f"{self.api_base_url}/auth/login"
                    response = self.session.post(url, json=payload)
                    data = response.json()
                    
                    # Handle ApiResponse wrapper
                    if 'data' in data and 'accessToken' in data['data']:
                        self.token = data['data']['accessToken']
                    elif 'accessToken' in data:
                        self.token = data['accessToken']
                    
                    if self.token:
                        print(f"{Colors.GREEN}✓ JWT token obtained{Colors.RESET}\n")
                        return True
                except Exception as e:
                    print(f"{Colors.RED}Failed to extract token: {e}{Colors.RESET}\n")
        
        print(f"{Colors.YELLOW}⚠ Could not authenticate - Some tests will fail{Colors.RESET}\n")
        return False
    
    def test_backend_endpoints(self):
        """Test all backend API endpoints"""
        self.print_header("BACKEND API TESTS - READ OPERATIONS")
        
        # Define all endpoints to test
        endpoints = [
            # Guards
            ('/guards', 'GET', True),
            
            # Clients
            ('/clients', 'GET', True),
            
            # Sites
            ('/sites', 'GET', True),
            
            # Site Posts
            ('/site-posts', 'GET', True),
            
            # Assignments
            ('/assignments', 'GET', True),
            ('/assignments/shift-types', 'GET', True),
            
            # Attendance
            ('/attendance/today-summary', 'GET', True),
            
            # Auth (public)
            ('/auth/me', 'GET', True),
        ]
        
        for endpoint_data in endpoints:
            endpoint = endpoint_data[0]
            method = endpoint_data[1] if len(endpoint_data) > 1 else 'GET'
            requires_auth = endpoint_data[2] if len(endpoint_data) > 2 else True
            
            result = self.test_endpoint(endpoint, method, requires_auth)
            self.print_result(result)
            self.results.append(result)
    
    def test_crud_operations(self):
        """Test create, update, delete operations"""
        self.print_header("BACKEND API TESTS - CRUD OPERATIONS")
        
        # Test data for integration tests
        timestamp = int(time.time())
        created_ids = {}
        
        # 1. Create Client
        print(f"{Colors.BOLD}Testing: Create Client{Colors.RESET}")
        client_payload = {
            'name': f'QA Test Client {timestamp}',
            'status': 'ACTIVE'
        }
        result = self.test_endpoint('/clients', 'POST', True, client_payload)
        self.print_result(result)
        self.results.append(result)
        
        if result.status == 'pass':
            try:
                response = self.session.post(
                    f"{self.api_base_url}/clients",
                    headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
                    json=client_payload
                )
                data = response.json()
                created_ids['client'] = data.get('data', {}).get('id') or data.get('id')
                print(f"  {Colors.GREEN}Created client ID: {created_ids['client']}{Colors.RESET}")
            except Exception as e:
                print(f"  {Colors.RED}Failed to extract client ID: {e}{Colors.RESET}")
        
        # 2. Create Site (requires client)
        if 'client' in created_ids:
            print(f"\n{Colors.BOLD}Testing: Create Site{Colors.RESET}")
            site_payload = {
                'clientAccountId': created_ids['client'],
                'name': f'QA Test Site {timestamp}',
                'address': '123 Test Street',
                'status': 'ACTIVE'
            }
            result = self.test_endpoint('/sites', 'POST', True, site_payload)
            self.print_result(result)
            self.results.append(result)
            
            if result.status == 'pass':
                try:
                    response = self.session.post(
                        f"{self.api_base_url}/sites",
                        headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
                        json=site_payload
                    )
                    data = response.json()
                    created_ids['site'] = data.get('data', {}).get('id') or data.get('id')
                    print(f"  {Colors.GREEN}Created site ID: {created_ids['site']}{Colors.RESET}")
                except Exception as e:
                    print(f"  {Colors.RED}Failed to extract site ID: {e}{Colors.RESET}")
        
        # 3. Create Site Post (requires site)
        if 'site' in created_ids:
            print(f"\n{Colors.BOLD}Testing: Create Site Post{Colors.RESET}")
            post_payload = {
                'siteId': created_ids['site'],
                'postName': f'QA Gate {timestamp}',
                'description': 'QA Test Post',
                'requiredGuards': 1
            }
            result = self.test_endpoint('/site-posts', 'POST', True, post_payload)
            self.print_result(result)
            self.results.append(result)
            
            if result.status == 'pass':
                try:
                    response = self.session.post(
                        f"{self.api_base_url}/site-posts",
                        headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
                        json=post_payload
                    )
                    data = response.json()
                    created_ids['sitePost'] = data.get('data', {}).get('id') or data.get('id')
                    print(f"  {Colors.GREEN}Created site post ID: {created_ids['sitePost']}{Colors.RESET}")
                except Exception as e:
                    print(f"  {Colors.RED}Failed to extract site post ID: {e}{Colors.RESET}")
        
        # 4. Create Guard
        print(f"\n{Colors.BOLD}Testing: Create Guard{Colors.RESET}")
        guard_payload = {
            'email': f'qaguard{timestamp}@test.com',
            'password': 'Test@123',
            'fullName': f'QA Guard {timestamp}',
            'phone': '1234567890',
            'employeeCode': f'QAG{timestamp}',
            'firstName': 'QA',
            'lastName': 'Guard',
            'baseSalary': 25000.00,
            'perDayRate': 1000.00,
            'overtimeRate': 150.00
        }
        result = self.test_endpoint('/guards', 'POST', True, guard_payload)
        self.print_result(result)
        self.results.append(result)
        
        if result.status == 'pass':
            try:
                response = self.session.post(
                    f"{self.api_base_url}/guards",
                    headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
                    json=guard_payload
                )
                data = response.json()
                created_ids['guard'] = data.get('data', {}).get('id') or data.get('id')
                print(f"  {Colors.GREEN}Created guard ID: {created_ids['guard']}{Colors.RESET}")
            except Exception as e:
                print(f"  {Colors.RED}Failed to extract guard ID: {e}{Colors.RESET}")
        
        # 5. Get Shift Types for assignment
        shift_type_id = None
        try:
            response = self.session.get(
                f"{self.api_base_url}/assignments/shift-types",
                headers={'Authorization': f'Bearer {self.token}'}
            )
            if response.status_code == 200:
                data = response.json()
                shifts = data.get('data', data) if isinstance(data, dict) and 'data' in data else data
                if shifts and len(shifts) > 0:
                    shift_type_id = shifts[0].get('id')
        except:
            pass
        
        # 6. Create Assignment (requires guard, site post, shift type)
        if 'guard' in created_ids and 'sitePost' in created_ids and shift_type_id:
            print(f"\n{Colors.BOLD}Testing: Create Assignment{Colors.RESET}")
            from datetime import date, timedelta
            assignment_payload = {
                'guardId': created_ids['guard'],
                'sitePostId': created_ids['sitePost'],
                'shiftTypeId': shift_type_id,
                'effectiveFrom': str(date.today()),
                'effectiveTo': str(date.today() + timedelta(days=30))
            }
            result = self.test_endpoint('/assignments', 'POST', True, assignment_payload)
            self.print_result(result)
            self.results.append(result)
            
            if result.status == 'pass':
                try:
                    response = self.session.post(
                        f"{self.api_base_url}/assignments",
                        headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'},
                        json=assignment_payload
                    )
                    data = response.json()
                    created_ids['assignment'] = data.get('data', {}).get('id') or data.get('id')
                    print(f"  {Colors.GREEN}Created assignment ID: {created_ids['assignment']}{Colors.RESET}")
                except Exception as e:
                    print(f"  {Colors.RED}Failed to extract assignment ID: {e}{Colors.RESET}")
        
        # 7. Test Check-in (requires guard)
        if 'guard' in created_ids and 'assignment' in created_ids:
            print(f"\n{Colors.BOLD}Testing: Check-in{Colors.RESET}")
            checkin_payload = {'guardId': created_ids['guard']}
            result = self.test_endpoint('/attendance/check-in', 'POST', True, checkin_payload)
            self.print_result(result)
            self.results.append(result)
            
            if result.status == 'pass':
                created_ids['attendance'] = True
        
        # 8. Test Check-out (requires previous check-in)
        if created_ids.get('attendance'):
            print(f"\n{Colors.BOLD}Testing: Check-out{Colors.RESET}")
            checkout_payload = {'guardId': created_ids['guard']}
            result = self.test_endpoint('/attendance/check-out', 'POST', True, checkout_payload)
            self.print_result(result)
            self.results.append(result)
        
        # 9. Cancel Assignment
        if 'assignment' in created_ids:
            print(f"\n{Colors.BOLD}Testing: Cancel Assignment{Colors.RESET}")
            result = self.test_endpoint(f'/assignments/{created_ids["assignment"]}/cancel', 'POST', True)
            self.print_result(result)
            self.results.append(result)
        
        # 10. Delete Site Post
        if 'sitePost' in created_ids:
            print(f"\n{Colors.BOLD}Testing: Delete Site Post{Colors.RESET}")
            result = self.test_endpoint(f'/site-posts/{created_ids["sitePost"]}', 'DELETE', True)
            self.print_result(result)
            self.results.append(result)
    
    def test_frontend_routes(self):
        """Test frontend routes"""
        self.print_header("FRONTEND ROUTES TEST")
        
        routes = [
            '/portal',
            '/login/admin',
            '/login/manager',
            '/login/client',
            '/login/guard',
        ]
        
        for route in routes:
            url = f"{self.frontend_url}{route}"
            try:
                start_time = time.time()
                response = requests.get(url, timeout=10)
                response_time = (time.time() - start_time) * 1000
                
                if response.status_code == 200:
                    result = QAResult(route, 'GET', 'pass', response.status_code, response_time)
                elif response.status_code == 404:
                    result = QAResult(route, 'GET', 'fail', response.status_code, response_time,
                                    error='Route not found - Check React Router config')
                else:
                    result = QAResult(route, 'GET', 'fail', response.status_code, response_time,
                                    error=f'HTTP {response.status_code}')
                
                self.print_result(result)
                self.results.append(result)
                
            except requests.exceptions.ConnectionError:
                result = QAResult(route, 'GET', 'fail', 
                                error='Frontend server not running')
                self.print_result(result)
                self.results.append(result)
            except Exception as e:
                result = QAResult(route, 'GET', 'fail', error=str(e))
                self.print_result(result)
                self.results.append(result)
    
    def diagnose_error(self, result: QAResult) -> str:
        """Diagnose probable source of error"""
        if result.status_code == 401:
            return "AuthController → JwtAuthenticationFilter → Check JWT token validity"
        elif result.status_code == 403:
            return "SecurityConfig → @PreAuthorize → Check role-based authorization"
        elif result.status_code == 404:
            if 'api' in result.endpoint:
                return "Controller → Check @RequestMapping path"
            else:
                return "React Router → Check route configuration in App.jsx"
        elif result.status_code == 500:
            return "Service layer → Check for null pointer, database connection, or logic errors"
        elif result.error and 'timeout' in result.error.lower():
            return "Database query → Check for missing indexes or N+1 queries"
        elif result.error and 'connection' in result.error.lower():
            return "Server not running → Check if Spring Boot/Vite dev server is running"
        elif result.error and 'JSON' in result.error:
            return "Controller → DTO mapping error → Check return types"
        else:
            return "Unknown error → Check server logs"
    
    def generate_html_report(self):
        """Generate HTML report"""
        passed = sum(1 for r in self.results if r.status == 'pass')
        failed = sum(1 for r in self.results if r.status == 'fail')
        warnings = sum(1 for r in self.results if r.status == 'warning')
        total = len(self.results)
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGMS QA Audit Report</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0A0F1E 0%, #1a1f35 100%);
            color: #e0e0e0;
            padding: 20px;
            min-height: 100vh;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }}
        h1 {{
            color: #00C9FF;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-align: center;
        }}
        .timestamp {{
            text-align: center;
            color: #999;
            margin-bottom: 40px;
            font-size: 0.9em;
        }}
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }}
        .stat-card {{
            background: rgba(255, 255, 255, 0.08);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }}
        .stat-card h3 {{
            color: #999;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }}
        .stat-card .number {{
            font-size: 2.5em;
            font-weight: bold;
        }}
        .pass {{ color: #4CAF50; }}
        .fail {{ color: #f44336; }}
        .warning {{ color: #ff9800; }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            overflow: hidden;
        }}
        th {{
            background: rgba(0, 201, 255, 0.2);
            padding: 15px;
            text-align: left;
            color: #00C9FF;
            font-weight: 600;
            border-bottom: 2px solid #00C9FF;
        }}
        td {{
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }}
        tr:hover {{
            background: rgba(255, 255, 255, 0.05);
        }}
        .status-badge {{
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            text-transform: uppercase;
        }}
        .status-pass {{
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
            border: 1px solid #4CAF50;
        }}
        .status-fail {{
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
            border: 1px solid #f44336;
        }}
        .status-warning {{
            background: rgba(255, 152, 0, 0.2);
            color: #ff9800;
            border: 1px solid #ff9800;
        }}
        .error-msg {{
            color: #f44336;
            font-size: 0.85em;
            margin-top: 4px;
        }}
        .warning-msg {{
            color: #ff9800;
            font-size: 0.85em;
            margin-top: 4px;
        }}
        .diagnosis {{
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85em;
            color: #aaa;
            margin-top: 4px;
            border-left: 3px solid #00C9FF;
        }}
        .method {{
            display: inline-block;
            padding: 2px 8px;
            background: rgba(0, 201, 255, 0.2);
            border-radius: 4px;
            font-weight: bold;
            color: #00C9FF;
            font-size: 0.85em;
        }}
        .response-time {{
            font-weight: bold;
        }}
        .response-time.fast {{ color: #4CAF50; }}
        .response-time.medium {{ color: #ff9800; }}
        .response-time.slow {{ color: #f44336; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ SGMS QA Audit Report</h1>
        <div class="timestamp">Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
        
        <div class="summary">
            <div class="stat-card">
                <h3>Total Tests</h3>
                <div class="number">{total}</div>
            </div>
            <div class="stat-card">
                <h3>Passed</h3>
                <div class="number pass">✔ {passed}</div>
            </div>
            <div class="stat-card">
                <h3>Failed</h3>
                <div class="number fail">❌ {failed}</div>
            </div>
            <div class="stat-card">
                <h3>Warnings</h3>
                <div class="number warning">⚠ {warnings}</div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Response Time</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
"""
        
        for result in self.results:
            status_class = f"status-{result.status}"
            
            # Response time color
            rt_class = 'fast'
            if result.response_time:
                if result.response_time > 5000:
                    rt_class = 'slow'
                elif result.response_time > 2000:
                    rt_class = 'medium'
            
            rt_display = f'{result.response_time:.0f}ms' if result.response_time else 'N/A'
            
            html += f"""
                <tr>
                    <td><code>{result.endpoint}</code></td>
                    <td><span class="method">{result.method}</span></td>
                    <td><span class="status-badge {status_class}">{result.status}</span></td>
                    <td><span class="response-time {rt_class}">{rt_display}</span></td>
                    <td>
                        {f'<div class="error-msg">❌ {result.error}</div>' if result.error else ''}
                        {f'<div class="warning-msg">⚠ {result.warning}</div>' if result.warning else ''}
                        {f'<div class="diagnosis">💡 {self.diagnose_error(result)}</div>' if result.status == 'fail' else ''}
                    </td>
                </tr>
"""
        
        html += """
            </tbody>
        </table>
    </div>
</body>
</html>
"""
        
        with open('qa_report.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"\n{Colors.GREEN}✓ Report saved to qa_report.html{Colors.RESET}")
    
    def print_summary(self):
        """Print test summary"""
        self.print_header("TEST SUMMARY")
        
        passed = sum(1 for r in self.results if r.status == 'pass')
        failed = sum(1 for r in self.results if r.status == 'fail')
        warnings = sum(1 for r in self.results if r.status == 'warning')
        total = len(self.results)
        
        print(f"Total Tests:  {total}")
        print(f"{Colors.GREEN}✔ Passed:     {passed}{Colors.RESET}")
        print(f"{Colors.RED}❌ Failed:     {failed}{Colors.RESET}")
        print(f"{Colors.YELLOW}⚠ Warnings:   {warnings}{Colors.RESET}")
    
    def run(self):
        """Run all QA tests"""
        self.login_admin()
        self.test_backend_endpoints()
        self.test_crud_operations()
        self.test_frontend_routes()
        self.print_summary()
        self.generate_html_report()


def main():
    """Main entry point"""
    # Load .env if available
    if DOTENV_AVAILABLE:
        env_path = Path(__file__).parent / '.env'
        if env_path.exists():
            load_dotenv(env_path)
            print(f"{Colors.GREEN}✓ Loaded .env file{Colors.RESET}")
        else:
            print(f"{Colors.YELLOW}⚠ No .env file found, using defaults{Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}⚠ python-dotenv not installed. Install with: pip install python-dotenv{Colors.RESET}")
    
    parser = argparse.ArgumentParser(description='SGMS QA Audit System')
    parser.add_argument('--api-url', 
                       default=os.getenv('API_BASE_URL', 'http://localhost:8080/api'),
                       help='Backend API base URL')
    parser.add_argument('--frontend-url', 
                       default=os.getenv('FRONTEND_URL', 'http://localhost:5173'),
                       help='Frontend URL')
    parser.add_argument('--no-frontend', action='store_true',
                       help='Skip frontend tests')
    
    args = parser.parse_args()
    
    admin_email = os.getenv('QA_ADMIN_EMAIL')
    admin_password = os.getenv('QA_ADMIN_PASSWORD')
    
    qa = SGMSQASystem(args.api_url, args.frontend_url, admin_email, admin_password)
    qa.run()
    
    # Exit with error code if tests failed
    failed = sum(1 for r in qa.results if r.status == 'fail')
    sys.exit(1 if failed > 0 else 0)


if __name__ == '__main__':
    main()
