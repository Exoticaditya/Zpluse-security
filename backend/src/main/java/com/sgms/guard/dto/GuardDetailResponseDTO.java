package com.sgms.guard.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Enhanced Guard Response DTO with composite data
 * 
 * Combines data from:
 * - UserEntity
 * - GuardEntity
 * - GuardAssignmentEntity (current active assignment)
 * - SitePostEntity
 * - SiteEntity
 * - ShiftTypeEntity
 * 
 * This DTO provides all necessary information for guard dashboards
 * and eliminates the need for multiple API calls.
 */
public class GuardDetailResponseDTO {
  
  // Guard Basic Info (from GuardEntity + UserEntity)
  private Long id;
  private Long userId;
  private String fullName;
  private String email;
  private String phone;
  private String employeeCode;
  private String firstName;
  private String lastName;
  private Boolean active;
  private String status;
  private LocalDate hireDate;
  
  // Supervisor Info
  private Long supervisorId;
  private String supervisorName;
  
  // Salary Info
  private BigDecimal baseSalary;
  private BigDecimal perDayRate;
  private BigDecimal overtimeRate;
  
  // Current Assignment Info (if assigned)
  private Long assignmentId;
  private Long sitePostId;
  private String currentPost;
  private Long siteId;
  private String currentSite;
  private Long clientId;
  private String clientName;
  private Long shiftTypeId;
  private String shiftType;
  private LocalDate assignmentEffectiveFrom;
  private LocalDate assignmentEffectiveTo;
  private String assignmentStatus;
  
  // License Info (if applicable)
  private String licenseNumber;

  // Getters and Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmployeeCode() {
    return employeeCode;
  }

  public void setEmployeeCode(String employeeCode) {
    this.employeeCode = employeeCode;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDate getHireDate() {
    return hireDate;
  }

  public void setHireDate(LocalDate hireDate) {
    this.hireDate = hireDate;
  }

  public Long getSupervisorId() {
    return supervisorId;
  }

  public void setSupervisorId(Long supervisorId) {
    this.supervisorId = supervisorId;
  }

  public String getSupervisorName() {
    return supervisorName;
  }

  public void setSupervisorName(String supervisorName) {
    this.supervisorName = supervisorName;
  }

  public BigDecimal getBaseSalary() {
    return baseSalary;
  }

  public void setBaseSalary(BigDecimal baseSalary) {
    this.baseSalary = baseSalary;
  }

  public BigDecimal getPerDayRate() {
    return perDayRate;
  }

  public void setPerDayRate(BigDecimal perDayRate) {
    this.perDayRate = perDayRate;
  }

  public BigDecimal getOvertimeRate() {
    return overtimeRate;
  }

  public void setOvertimeRate(BigDecimal overtimeRate) {
    this.overtimeRate = overtimeRate;
  }

  public Long getAssignmentId() {
    return assignmentId;
  }

  public void setAssignmentId(Long assignmentId) {
    this.assignmentId = assignmentId;
  }

  public Long getSitePostId() {
    return sitePostId;
  }

  public void setSitePostId(Long sitePostId) {
    this.sitePostId = sitePostId;
  }

  public String getCurrentPost() {
    return currentPost;
  }

  public void setCurrentPost(String currentPost) {
    this.currentPost = currentPost;
  }

  public Long getSiteId() {
    return siteId;
  }

  public void setSiteId(Long siteId) {
    this.siteId = siteId;
  }

  public String getCurrentSite() {
    return currentSite;
  }

  public void setCurrentSite(String currentSite) {
    this.currentSite = currentSite;
  }

  public Long getClientId() {
    return clientId;
  }

  public void setClientId(Long clientId) {
    this.clientId = clientId;
  }

  public String getClientName() {
    return clientName;
  }

  public void setClientName(String clientName) {
    this.clientName = clientName;
  }

  public Long getShiftTypeId() {
    return shiftTypeId;
  }

  public void setShiftTypeId(Long shiftTypeId) {
    this.shiftTypeId = shiftTypeId;
  }

  public String getShiftType() {
    return shiftType;
  }

  public void setShiftType(String shiftType) {
    this.shiftType = shiftType;
  }

  public LocalDate getAssignmentEffectiveFrom() {
    return assignmentEffectiveFrom;
  }

  public void setAssignmentEffectiveFrom(LocalDate assignmentEffectiveFrom) {
    this.assignmentEffectiveFrom = assignmentEffectiveFrom;
  }

  public LocalDate getAssignmentEffectiveTo() {
    return assignmentEffectiveTo;
  }

  public void setAssignmentEffectiveTo(LocalDate assignmentEffectiveTo) {
    this.assignmentEffectiveTo = assignmentEffectiveTo;
  }

  public String getAssignmentStatus() {
    return assignmentStatus;
  }

  public void setAssignmentStatus(String assignmentStatus) {
    this.assignmentStatus = assignmentStatus;
  }

  public String getLicenseNumber() {
    return licenseNumber;
  }

  public void setLicenseNumber(String licenseNumber) {
    this.licenseNumber = licenseNumber;
  }
}
