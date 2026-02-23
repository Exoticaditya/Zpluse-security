package com.sgms.dashboard;

import com.sgms.assignment.GuardAssignmentEntity;
import com.sgms.assignment.GuardAssignmentRepository;
import com.sgms.attendance.AttendanceEntity;
import com.sgms.attendance.AttendanceRepository;
import com.sgms.dashboard.dto.AdminSummaryDTO;
import com.sgms.dashboard.dto.GuardSummaryDTO;
import com.sgms.dashboard.dto.ManagerSummaryDTO;
import com.sgms.guard.GuardEntity;
import com.sgms.guard.GuardRepository;
import com.sgms.security.UserPrincipal;
import com.sgms.site.SiteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

/**
 * Dashboard Service
 * 
 * Provides aggregated dashboard data for different user roles
 */
@Service
public class DashboardService {
  
  private final GuardRepository guardRepository;
  private final SiteRepository siteRepository;
  private final GuardAssignmentRepository assignmentRepository;
  private final AttendanceRepository attendanceRepository;
  
  public DashboardService(
      GuardRepository guardRepository,
      SiteRepository siteRepository,
      GuardAssignmentRepository assignmentRepository,
      AttendanceRepository attendanceRepository) {
    this.guardRepository = guardRepository;
    this.siteRepository = siteRepository;
    this.assignmentRepository = assignmentRepository;
    this.attendanceRepository = attendanceRepository;
  }
  
  /**
   * Get admin dashboard summary
   * 
   * Returns:
   * - Total guards (all time)
   * - Active guards (not soft-deleted, status ACTIVE)
   * - Total sites
   * - Active assignments (effective today)
   * - Today's attendance count
   */
  @Transactional(readOnly = true)
  public AdminSummaryDTO getAdminSummary() {
    LocalDate today = LocalDate.now();
    
    long totalGuards = guardRepository.count();
    long activeGuards = guardRepository.findAllActive().size();
    long totalSites = siteRepository.count();
    
    // Count active assignments (effective today)
    long activeAssignments = assignmentRepository.findAll().stream()
        .filter(a -> Boolean.TRUE.equals(a.getActive()))
        .filter(a -> "ACTIVE".equals(a.getStatus()))
        .filter(a -> !a.getEffectiveFrom().isAfter(today))
        .filter(a -> a.getEffectiveTo() == null || !a.getEffectiveTo().isBefore(today))
        .count();
    
    // Count today's attendance records
    long todayAttendance = attendanceRepository.findAll().stream()
        .filter(a -> today.equals(a.getAttendanceDate()))
        .count();
    
    return new AdminSummaryDTO(totalGuards, activeGuards, totalSites, activeAssignments, todayAttendance);
  }
  
  /**
   * Get manager/supervisor dashboard summary
   * 
   * Returns:
   * - Guards on duty (checked in today, not checked out)
   * - Sites managed by this supervisor
   * - Late today count
   * - Absent today count
   */
  @Transactional(readOnly = true)
  public ManagerSummaryDTO getManagerSummary(UserPrincipal principal) {
    LocalDate today = LocalDate.now();
    
    // Get guards supervised by this user
    List<GuardEntity> supervisedGuards = guardRepository.findBySupervisorId(principal.getUserId());
    
    // Count guards on duty (checked in, not checked out)
    long guardsOnDuty = attendanceRepository.findAll().stream()
        .filter(a -> today.equals(a.getAttendanceDate()))
        .filter(a -> a.getCheckInTime() != null)
        .filter(a -> a.getCheckOutTime() == null)
        .filter(a -> supervisedGuards.stream().anyMatch(g -> g.getId().equals(a.getGuard().getId())))
        .count();
    
    // Count unique sites where supervised guards are assigned
    long sitesManaged = supervisedGuards.stream()
        .flatMap(guard -> assignmentRepository.findActiveAssignmentsByGuardId(guard.getId(), today).stream())
        .filter(a -> a.getSitePost() != null)
        .filter(a -> a.getSitePost().getSite() != null)
        .map(a -> a.getSitePost().getSite().getId())
        .distinct()
        .count();
    
    // Count late today
    long lateToday = attendanceRepository.findAll().stream()
        .filter(a -> today.equals(a.getAttendanceDate()))
        .filter(a -> a.getLateMinutes() != null && a.getLateMinutes() > 0)
        .filter(a -> supervisedGuards.stream().anyMatch(g -> g.getId().equals(a.getGuard().getId())))
        .count();
    
    // Count absent today (guards expected but no attendance record)
    List<Long> attendedGuardIds = attendanceRepository.findAll().stream()
        .filter(a -> today.equals(a.getAttendanceDate()))
        .map(a -> a.getGuard().getId())
        .distinct()
        .toList();
    
    long absentToday = supervisedGuards.stream()
        .filter(g -> assignmentRepository.findActiveAssignmentsByGuardId(g.getId(), today).size() > 0)
        .filter(g -> !attendedGuardIds.contains(g.getId()))
        .count();
    
    return new ManagerSummaryDTO(guardsOnDuty, sitesManaged, lateToday, absentToday);
  }
  
  /**
   * Get guard dashboard summary for authenticated guard
   * 
   * Returns:
   * - Today's shift type
   * - Site name
   * - Post name
   * - Check-in time
   * - Check-out time
   * - Status
   */
  @Transactional(readOnly = true)
  public GuardSummaryDTO getGuardSummary(UserPrincipal principal) {
    LocalDate today = LocalDate.now();
    
    // Find guard by userId
    GuardEntity guard = guardRepository.findByUserId(principal.getUserId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard profile not found"));
    
    GuardSummaryDTO summary = new GuardSummaryDTO();
    
    // Get today's active assignment
    List<GuardAssignmentEntity> activeAssignments = assignmentRepository.findActiveAssignmentsByGuardId(guard.getId(), today);
    
    if (!activeAssignments.isEmpty()) {
      GuardAssignmentEntity assignment = activeAssignments.get(0);
      
      // Set shift type
      if (assignment.getShiftType() != null) {
        summary.setTodayShift(assignment.getShiftType().getName());
      }
      
      // Set site and post names
      if (assignment.getSitePost() != null) {
        summary.setPostName(assignment.getSitePost().getPostName());
        
        if (assignment.getSitePost().getSite() != null) {
          summary.setSiteName(assignment.getSitePost().getSite().getName());
        }
      }
    }
    
    // Get today's attendance record
    List<AttendanceEntity> todayAttendance = attendanceRepository.findAll().stream()
        .filter(a -> today.equals(a.getAttendanceDate()))
        .filter(a -> guard.getId().equals(a.getGuard().getId()))
        .toList();
    
    if (!todayAttendance.isEmpty()) {
      AttendanceEntity attendance = todayAttendance.get(0);
      
      // Convert Instant to LocalTime for check-in/out times
      if (attendance.getCheckInTime() != null) {
        summary.setCheckInTime(
          attendance.getCheckInTime().atZone(ZoneId.systemDefault()).toLocalTime()
        );
      }
      
      if (attendance.getCheckOutTime() != null) {
        summary.setCheckOutTime(
          attendance.getCheckOutTime().atZone(ZoneId.systemDefault()).toLocalTime()
        );
      }
      
      summary.setStatus(attendance.getStatus().name());
    } else {
      summary.setStatus("NOT_CHECKED_IN");
    }
    
    return summary;
  }
}
