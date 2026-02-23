# SGMS Production Verification Script
# Tests all production endpoints and generates a health report

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "SGMS PRODUCTION HEALTH CHECK" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$BACKEND_URL = "https://sgms-backend-production.up.railway.app/api"
$results = @()

# Helper function to test endpoint
function Test-Endpoint {
    param (
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Add("Body", $Body)
            $params.Add("ContentType", "application/json")
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✓ $Name" -ForegroundColor Green
        return @{
            Test = $Name
            Status = "PASS"
            Response = $response
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "✗ $Name (HTTP $statusCode)" -ForegroundColor Red
        } else {
            Write-Host "✗ $Name (Connection Failed)" -ForegroundColor Red
        }
        return @{
            Test = $Name
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
}

# Test 1: Backend health check
Write-Host "`n1. Backend Health Check" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
$results += Test-Endpoint -Name "Backend API Reachable" -Method "GET" -Url "$BACKEND_URL/auth/health"

# Test 2: Authentication endpoints
Write-Host "`n2. Authentication Tests" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow

# Admin login
$adminBody = @{
    email = "admin@zpluse.com"
    password = "Admin@123"
} | ConvertTo-Json

$adminResult = Test-Endpoint -Name "Admin Login" -Method "POST" -Url "$BACKEND_URL/auth/login" -Body $adminBody
$results += $adminResult

if ($adminResult.Status -eq "PASS") {
    $adminToken = $adminResult.Response.token
    $adminHeaders = @{ "Authorization" = "Bearer $adminToken" }
    
    # Test 3: Admin dashboard
    Write-Host "`n3. Admin Dashboard Endpoints" -ForegroundColor Yellow
    Write-Host "-----------------------------" -ForegroundColor Yellow
    $results += Test-Endpoint -Name "Admin Summary" -Method "GET" -Url "$BACKEND_URL/dashboard/admin-summary" -Headers $adminHeaders
}

# Test 4: Guard endpoints
Write-Host "`n4. Guard Endpoints" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow

$guardBody = @{
    email = "guard1@zpluse.com"
    password = "Guard@123"
} | ConvertTo-Json

$guardResult = Test-Endpoint -Name "Guard Login" -Method "POST" -Url "$BACKEND_URL/auth/login" -Body $guardBody
$results += $guardResult

if ($guardResult.Status -eq "PASS") {
    $guardToken = $guardResult.Response.token
    $guardHeaders = @{ "Authorization" = "Bearer $guardToken" }
    
    $results += Test-Endpoint -Name "Guard Profile (/api/guards/me)" -Method "GET" -Url "$BACKEND_URL/guards/me" -Headers $guardHeaders
    $results += Test-Endpoint -Name "Guard Summary" -Method "GET" -Url "$BACKEND_URL/dashboard/guard-summary" -Headers $guardHeaders
}

# Test 5: Supervisor endpoints
Write-Host "`n5. Supervisor Endpoints" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow

$supervisorBody = @{
    email = "supervisor@zpluse.com"
    password = "Super@123"
} | ConvertTo-Json

$supervisorResult = Test-Endpoint -Name "Supervisor Login" -Method "POST" -Url "$BACKEND_URL/auth/login" -Body $supervisorBody
$results += $supervisorResult

if ($supervisorResult.Status -eq "PASS") {
    $supervisorToken = $supervisorResult.Response.token
    $supervisorHeaders = @{ "Authorization" = "Bearer $supervisorToken" }
    
    $results += Test-Endpoint -Name "Manager Summary" -Method "GET" -Url "$BACKEND_URL/dashboard/manager-summary" -Headers $supervisorHeaders
}

# Test 6: Client endpoints
Write-Host "`n6. Client Endpoints" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow

$clientBody = @{
    email = "client1@zpluse.com"
    password = "Client@123"
} | ConvertTo-Json

$clientResult = Test-Endpoint -Name "Client Login" -Method "POST" -Url "$BACKEND_URL/auth/login" -Body $clientBody
$results += $clientResult

# Test 7: Public endpoints (should work without auth)
Write-Host "`n7. Public Endpoints" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow
$results += Test-Endpoint -Name "Swagger UI" -Method "GET" -Url "https://sgms-backend-production.up.railway.app/swagger-ui.html"

# Generate summary
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "PRODUCTION HEALTH CHECK SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$passCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $results.Count

Write-Host "`nTotal Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red

$passPercentage = [math]::Round(($passCount / $totalCount) * 100, 2)
Write-Host "`nSuccess Rate: $passPercentage%" -ForegroundColor $(if ($passPercentage -ge 90) { "Green" } elseif ($passPercentage -ge 70) { "Yellow" } else { "Red" })

# Overall status
Write-Host "`nOverall Status: " -NoNewline
if ($failCount -eq 0) {
    Write-Host "✓ ALL SYSTEMS OPERATIONAL" -ForegroundColor Green
} elseif ($passPercentage -ge 70) {
    Write-Host "⚠ SOME ISSUES DETECTED" -ForegroundColor Yellow
} else {
    Write-Host "✗ CRITICAL FAILURES" -ForegroundColor Red
}

# Save detailed report
$reportData = @{
    Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    BackendUrl = $BACKEND_URL
    TotalTests = $totalCount
    Passed = $passCount
    Failed = $failCount
    SuccessRate = "$passPercentage%"
    Results = $results
}

$reportJson = $reportData | ConvertTo-Json -Depth 5
$reportJson | Out-File "production_health_report.json"

Write-Host "`n✓ Detailed report saved to: production_health_report.json" -ForegroundColor Cyan
Write-Host ""
