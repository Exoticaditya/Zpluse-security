package com.sgms.guard;

import com.sgms.assignment.GuardAssignmentEntity;
import com.sgms.assignment.GuardAssignmentRepository;
import com.sgms.guard.dto.CreateGuardRequest;
import com.sgms.guard.dto.GuardDetailResponseDTO;
import com.sgms.guard.dto.GuardResponse;
import com.sgms.user.RoleEntity;
import com.sgms.user.RoleRepository;
import com.sgms.user.UserEntity;
import com.sgms.user.UserRepository;
import com.sgms.security.UserPrincipal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GuardService {

  private final GuardRepository guardRepository;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final GuardAssignmentRepository assignmentRepository;
  private final Clock clock;

  public GuardService(GuardRepository guardRepository, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, GuardAssignmentRepository assignmentRepository, Clock clock) {
    this.guardRepository = guardRepository;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
    this.assignmentRepository = assignmentRepository;
    this.clock = clock;
  }

  @Transactional
  public GuardResponse createGuard(CreateGuardRequest request) {
    if (userRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(request.getEmail())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }
    if (guardRepository.existsByEmployeeCode(request.getEmployeeCode())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Employee code already exists");
    }

    RoleEntity guardRole = roleRepository.findByName("GUARD")
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "GUARD role not found"));

    // Create User
    UserEntity user = new UserEntity();
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setFullName(request.getFirstName() + (request.getLastName() != null ? " " + request.getLastName() : ""));
    user.setPhone(request.getPhone());
    user.setStatus("ACTIVE");
    user.getRoles().add(guardRole);
    user = userRepository.save(user);

    // Resolve Supervisor
    UserEntity supervisor = null;
    if (request.getSupervisorId() != null) {
      supervisor = userRepository.findById(request.getSupervisorId())
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Supervisor not found"));
      boolean isSupervisor = supervisor.getRoles().stream().anyMatch(r -> "SUPERVISOR".equals(r.getName()));
      if (!isSupervisor) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a SUPERVISOR");
      }
    }

    // Create Guard Profile
    GuardEntity guard = new GuardEntity();
    guard.setUser(user);
    guard.setSupervisor(supervisor);
    guard.setEmployeeCode(request.getEmployeeCode());
    guard.setFirstName(request.getFirstName());
    guard.setLastName(request.getLastName());
    guard.setPhone(request.getPhone());
    guard.setStatus("ACTIVE");
    guard.setHireDate(request.getHireDate());
    guard.setBaseSalary(request.getBaseSalary());
    guard.setPerDayRate(request.getPerDayRate());
    guard.setOvertimeRate(request.getOvertimeRate());

    guard = guardRepository.save(guard);
    return mapToResponse(guard);
  }

  @Transactional(readOnly = true)
  public List<GuardResponse> getAllGuards(UserPrincipal principal) {
    boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    boolean isSupervisor = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERVISOR"));

    if (isAdmin) {
      return guardRepository.findAllActive().stream()
          .map(this::mapToResponse)
          .collect(Collectors.toList());
    } else if (isSupervisor) {
      return guardRepository.findBySupervisorId(principal.getUserId()).stream()
          .map(this::mapToResponse)
          .collect(Collectors.toList());
    } else {
      return List.of();
    }
  }

  @Transactional(readOnly = true)
  public GuardResponse getGuardById(Long id, UserPrincipal principal) {
    GuardEntity guard = guardRepository.findById(id)
        .filter(g -> g.getDeletedAt() == null)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard not found"));

    boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    boolean isSupervisor = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERVISOR"));

    if (isSupervisor && !isAdmin) {
      if (guard.getSupervisor() == null || !guard.getSupervisor().getId().equals(principal.getUserId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this guard");
      }
    }

    return mapToResponse(guard);
  }

  @Transactional
  public GuardResponse updateGuard(Long id, CreateGuardRequest request, UserPrincipal principal) {
     // For simplicity using CreateGuardRequest for updates, in real app use separate DTO
    GuardEntity guard = guardRepository.findById(id)
        .filter(g -> g.getDeletedAt() == null)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard not found"));

    // Check permissions
    boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    // Supervisors typically can't update HR details like salary, only ADMIN. 
    // Assuming only ADMIN updates guards for now based on strict reqs usually found in such systems.
    if (!isAdmin) {
       throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ADMIN can update guard details");
    }

    // Validate email uniqueness if email is being changed
    if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(guard.getUser().getEmail())) {
      if (userRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(request.getEmail())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
      }
      guard.getUser().setEmail(request.getEmail());
    } else if (request.getEmail() != null) {
      // Email same as current, just update in case of case change
      guard.getUser().setEmail(request.getEmail());
    }

    guard.setFirstName(request.getFirstName());
    guard.setLastName(request.getLastName());
    guard.setPhone(request.getPhone());
    // Update User entity as well
    UserEntity user = guard.getUser();
    user.setFullName(request.getFirstName() + " " + (request.getLastName() != null ? request.getLastName() : ""));
    user.setPhone(request.getPhone());
    
    if (request.getSupervisorId() != null) {
       UserEntity supervisor = userRepository.findById(request.getSupervisorId())
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Supervisor not found"));
       
       // Validate supervisor has SUPERVISOR role
       boolean isSupervisor = supervisor.getRoles().stream()
           .anyMatch(r -> "SUPERVISOR".equals(r.getName()));
       if (!isSupervisor) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not a SUPERVISOR");
       }
       
       guard.setSupervisor(supervisor);
    }

    guard.setBaseSalary(request.getBaseSalary());
    guard.setPerDayRate(request.getPerDayRate());
    guard.setOvertimeRate(request.getOvertimeRate());
    
    return mapToResponse(guardRepository.save(guard));
  }

  @Transactional
  public void deleteGuard(Long id) {
    GuardEntity guard = guardRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard not found"));
    
    Instant now = clock.instant();
    guard.setDeletedAt(now);
    guard.getUser().setDeletedAt(now); // Soft delete the user account too
    guardRepository.save(guard);
  }

  private GuardResponse mapToResponse(GuardEntity guard) {
    GuardResponse response = new GuardResponse();
    response.setId(guard.getId());
    response.setUserId(guard.getUser().getId());
    response.setEmail(guard.getUser().getEmail());
    if (guard.getSupervisor() != null) {
      response.setSupervisorId(guard.getSupervisor().getId());
      response.setSupervisorName(guard.getSupervisor().getFullName());
    }
    response.setEmployeeCode(guard.getEmployeeCode());
    response.setFirstName(guard.getFirstName());
    response.setLastName(guard.getLastName());
    response.setPhone(guard.getPhone());
    response.setStatus(guard.getStatus());
    response.setHireDate(guard.getHireDate());
    response.setBaseSalary(guard.getBaseSalary());
    response.setPerDayRate(guard.getPerDayRate());
    response.setOvertimeRate(guard.getOvertimeRate());
    return response;
  }

  /**
   * Get all guards with detailed information including current assignments
   */
  @Transactional(readOnly = true)
  public List<GuardDetailResponseDTO> getAllGuardsDetailed(UserPrincipal principal) {
    boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    boolean isSupervisor = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERVISOR"));

    List<GuardEntity> guards;
    if (isAdmin) {
      guards = guardRepository.findAllActive();
    } else if (isSupervisor) {
      guards = guardRepository.findBySupervisorId(principal.getUserId());
    } else {
      return List.of();
    }

    return guards.stream()
        .map(this::mapToDetailedResponse)
        .collect(Collectors.toList());
  }

  /**
   * Get current guard's detailed information by authenticated user
   */
  @Transactional(readOnly = true)
  public GuardDetailResponseDTO getCurrentGuardDetails(UserPrincipal principal) {
    UserEntity user = userRepository.findById(principal.getUserId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    
    GuardEntity guard = guardRepository.findByUserId(user.getId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard profile not found"));
    
    return mapToDetailedResponse(guard);
  }

  /**
   * Get guard detailed information by guard ID
   */
  @Transactional(readOnly = true)
  public GuardDetailResponseDTO getGuardDetailedById(Long id, UserPrincipal principal) {
    GuardEntity guard = guardRepository.findById(id)
        .filter(g -> g.getDeletedAt() == null)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guard not found"));

    boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    boolean isSupervisor = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPERVISOR"));

    if (isSupervisor && !isAdmin) {
      if (guard.getSupervisor() == null || !guard.getSupervisor().getId().equals(principal.getUserId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this guard");
      }
    }

    return mapToDetailedResponse(guard);
  }

  /**
   * Map GuardEntity to GuardDetailResponseDTO with assignment information
   */
  private GuardDetailResponseDTO mapToDetailedResponse(GuardEntity guard) {
    GuardDetailResponseDTO dto = new GuardDetailResponseDTO();
    
    // Basic guard info
    dto.setId(guard.getId());
    dto.setUserId(guard.getUser().getId());
    dto.setFullName(guard.getUser().getFullName());
    dto.setEmail(guard.getUser().getEmail());
    dto.setPhone(guard.getPhone());
    dto.setEmployeeCode(guard.getEmployeeCode());
    dto.setFirstName(guard.getFirstName());
    dto.setLastName(guard.getLastName());
    dto.setActive(guard.getActive());
    dto.setStatus(guard.getStatus());
    dto.setHireDate(guard.getHireDate());
    
    // Supervisor info
    if (guard.getSupervisor() != null) {
      dto.setSupervisorId(guard.getSupervisor().getId());
      dto.setSupervisorName(guard.getSupervisor().getFullName());
    }
    
    // Salary info
    dto.setBaseSalary(guard.getBaseSalary());
    dto.setPerDayRate(guard.getPerDayRate());
    dto.setOvertimeRate(guard.getOvertimeRate());
    
    // Get current active assignment
    LocalDate today = LocalDate.now(clock);
    List<GuardAssignmentEntity> activeAssignments = assignmentRepository.findActiveAssignmentsByGuardId(guard.getId(), today);
    
    if (!activeAssignments.isEmpty()) {
      GuardAssignmentEntity assignment = activeAssignments.get(0); // Get most recent
      dto.setAssignmentId(assignment.getId());
      dto.setAssignmentStatus(assignment.getStatus());
      dto.setAssignmentEffectiveFrom(assignment.getEffectiveFrom());
      dto.setAssignmentEffectiveTo(assignment.getEffectiveTo());
      
      // Site post info
      if (assignment.getSitePost() != null) {
        dto.setSitePostId(assignment.getSitePost().getId());
        dto.setCurrentPost(assignment.getSitePost().getPostName());
        
        // Site info
        if (assignment.getSitePost().getSite() != null) {
          dto.setSiteId(assignment.getSitePost().getSite().getId());
          dto.setCurrentSite(assignment.getSitePost().getSite().getName());
          
          // Client info
          if (assignment.getSitePost().getSite().getClientAccount() != null) {
            dto.setClientId(assignment.getSitePost().getSite().getClientAccount().getId());
            dto.setClientName(assignment.getSitePost().getSite().getClientAccount().getName());
          }
        }
      }
      
      // Shift type info
      if (assignment.getShiftType() != null) {
        dto.setShiftTypeId(assignment.getShiftType().getId());
        dto.setShiftType(assignment.getShiftType().getName());
      }
    }
    
    return dto;
  }
}
