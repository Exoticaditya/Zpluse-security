package com.sgms.dashboard.dto;

import java.time.LocalTime;

/**
 * Guard Dashboard Summary DTO
 * 
 * Provides today's shift and attendance information for a guard
 */
public class GuardSummaryDTO {
  
  private String todayShift;
  private String siteName;
  private String postName;
  private LocalTime checkInTime;
  private LocalTime checkOutTime;
  private String status;
  
  // Constructors
  
  public GuardSummaryDTO() {
  }
  
  public GuardSummaryDTO(String todayShift, String siteName, String postName, 
                         LocalTime checkInTime, LocalTime checkOutTime, String status) {
    this.todayShift = todayShift;
    this.siteName = siteName;
    this.postName = postName;
    this.checkInTime = checkInTime;
    this.checkOutTime = checkOutTime;
    this.status = status;
  }
  
  // Getters and Setters
  
  public String getTodayShift() {
    return todayShift;
  }
  
  public void setTodayShift(String todayShift) {
    this.todayShift = todayShift;
  }
  
  public String getSiteName() {
    return siteName;
  }
  
  public void setSiteName(String siteName) {
    this.siteName = siteName;
  }
  
  public String getPostName() {
    return postName;
  }
  
  public void setPostName(String postName) {
    this.postName = postName;
  }
  
  public LocalTime getCheckInTime() {
    return checkInTime;
  }
  
  public void setCheckInTime(LocalTime checkInTime) {
    this.checkInTime = checkInTime;
  }
  
  public LocalTime getCheckOutTime() {
    return checkOutTime;
  }
  
  public void setCheckOutTime(LocalTime checkOutTime) {
    this.checkOutTime = checkOutTime;
  }
  
  public String getStatus() {
    return status;
  }
  
  public void setStatus(String status) {
    this.status = status;
  }
}
