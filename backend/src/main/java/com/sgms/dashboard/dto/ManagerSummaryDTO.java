package com.sgms.dashboard.dto;

/**
 * Manager/Supervisor Dashboard Summary DTO
 * 
 * Provides operational metrics for supervisors managing guards
 */
public class ManagerSummaryDTO {
  
  private Long guardsOnDuty;
  private Long sitesManaged;
  private Long lateToday;
  private Long absentToday;
  
  // Constructors
  
  public ManagerSummaryDTO() {
  }
  
  public ManagerSummaryDTO(Long guardsOnDuty, Long sitesManaged, Long lateToday, Long absentToday) {
    this.guardsOnDuty = guardsOnDuty;
    this.sitesManaged = sitesManaged;
    this.lateToday = lateToday;
    this.absentToday = absentToday;
  }
  
  // Getters and Setters
  
  public Long getGuardsOnDuty() {
    return guardsOnDuty;
  }
  
  public void setGuardsOnDuty(Long guardsOnDuty) {
    this.guardsOnDuty = guardsOnDuty;
  }
  
  public Long getSitesManaged() {
    return sitesManaged;
  }
  
  public void setSitesManaged(Long sitesManaged) {
    this.sitesManaged = sitesManaged;
  }
  
  public Long getLateToday() {
    return lateToday;
  }
  
  public void setLateToday(Long lateToday) {
    this.lateToday = lateToday;
  }
  
  public Long getAbsentToday() {
    return absentToday;
  }
  
  public void setAbsentToday(Long absentToday) {
    this.absentToday = absentToday;
  }
}
