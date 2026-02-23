package com.sgms.dashboard;

import com.sgms.common.ApiResponse;
import com.sgms.dashboard.dto.AdminSummaryDTO;
import com.sgms.dashboard.dto.GuardSummaryDTO;
import com.sgms.dashboard.dto.ManagerSummaryDTO;
import com.sgms.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Dashboard Controller
 * 
 * Provides aggregated dashboard metrics for different user roles:
 * - Admin: System-wide statistics
 * - Manager/Supervisor: Team and site metrics
 * - Guard: Personal shift and attendance info
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
  
  private final DashboardService dashboardService;
  
  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }
  
  /**
   * Get admin dashboard summary
   * 
   * GET /api/dashboard/admin-summary
   * Requires: ADMIN role
   * 
   * Returns:
   * - totalGuards: All guards in system
   * - activeGuards: Guards with ACTIVE status
   * - totalSites: All sites
   * - activeAssignments: Assignments effective today
   * - todayAttendance: Attendance records for today
   */
  @GetMapping("/admin-summary")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiResponse<AdminSummaryDTO> getAdminSummary() {
    AdminSummaryDTO summary = dashboardService.getAdminSummary();
    return ApiResponse.success(summary);
  }
  
  /**
   * Get manager/supervisor dashboard summary
   * 
   * GET /api/dashboard/manager-summary
   * Requires: SUPERVISOR role
   * 
   * Returns:
   * - guardsOnDuty: Guards checked in but not checked out today
   * - sitesManaged: Unique sites where supervised guards are assigned
   * - lateToday: Supervised guards marked late today
   * - absentToday: Expected guards with no attendance record today
   */
  @GetMapping("/manager-summary")
  @PreAuthorize("hasRole('SUPERVISOR')")
  public ApiResponse<ManagerSummaryDTO> getManagerSummary(
      @AuthenticationPrincipal UserPrincipal principal) {
    ManagerSummaryDTO summary = dashboardService.getManagerSummary(principal);
    return ApiResponse.success(summary);
  }
  
  /**
   * Get guard dashboard summary
   * 
   * GET /api/dashboard/guard-summary
   * Requires: GUARD role
   * 
   * Returns:
   * - todayShift: Shift type name (e.g., "Day Shift", "Night Shift")
   * - siteName: Assigned site name
   * - postName: Assigned post/duty station name
   * - checkInTime: Today's check-in time (if checked in)
   * - checkOutTime: Today's check-out time (if checked out)
   * - status: Attendance status (PRESENT, LATE, ABSENT, NOT_CHECKED_IN)
   */
  @GetMapping("/guard-summary")
  @PreAuthorize("hasRole('GUARD')")
  public ApiResponse<GuardSummaryDTO> getGuardSummary(
      @AuthenticationPrincipal UserPrincipal principal) {
    GuardSummaryDTO summary = dashboardService.getGuardSummary(principal);
    return ApiResponse.success(summary);
  }
}
