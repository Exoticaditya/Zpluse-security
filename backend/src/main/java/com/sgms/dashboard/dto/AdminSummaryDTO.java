package com.sgms.dashboard.dto;

/**
 * Admin Dashboard Summary DTO
 * 
 * Provides high-level metrics for administrative oversight
 */
public class AdminSummaryDTO {
  
  private Long totalGuards;
  private Long activeGuards;
  private Long totalSites;
  private Long activeAssignments;
  private Long todayAttendance;
  
  // Constructors
  
  public AdminSummaryDTO() {
  }
  
  public AdminSummaryDTO(Long totalGuards, Long activeGuards, Long totalSites, Long activeAssignments, Long todayAttendance) {
    this.totalGuards = totalGuards;
    this.activeGuards = activeGuards;
    this.totalSites = totalSites;
    this.activeAssignments = activeAssignments;
    this.todayAttendance = todayAttendance;
  }
  
  // Getters and Setters
  
  public Long getTotalGuards() {
    return totalGuards;
  }
  
  public void setTotalGuards(Long totalGuards) {
    this.totalGuards = totalGuards;
  }
  
  public Long getActiveGuards() {
    return activeGuards;
  }
  
  public void setActiveGuards(Long activeGuards) {
    this.activeGuards = activeGuards;
  }
  
  public Long getTotalSites() {
    return totalSites;
  }
  
  public void setTotalSites(Long totalSites) {
    this.totalSites = totalSites;
  }
  
  public Long getActiveAssignments() {
    return activeAssignments;
  }
  
  public void setActiveAssignments(Long activeAssignments) {
    this.activeAssignments = activeAssignments;
  }
  
  public Long getTodayAttendance() {
    return todayAttendance;
  }
  
  public void setTodayAttendance(Long todayAttendance) {
    this.todayAttendance = todayAttendance;
  }
}
