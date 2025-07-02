package com.ghsms.controller;

import com.ghsms.DTO.ConsultationDTO;
import com.ghsms.DTO.ConsultationNoteStatusUpdateDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.service.ConsultationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@Validated
public class ConsultationController {

    private final ConsultationService consultationService;

    /**
     * 1. API lấy tất cả lịch hẹn của customer cụ thể
     */
    @GetMapping("/customer/{customerId}/all")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_STAFF') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllCustomerConsultations(
            @PathVariable @Positive(message = "Customer ID phải là số dương") Long customerId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            // Kiểm tra quyền: Customer chỉ xem được lịch của mình, Staff/Manager/Admin xem được tất cả
            if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"))) {
                if (!principal.getId().equals(customerId)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Bạn chỉ có thể xem lịch hẹn của mình"));
                }
            }

            List<ConsultationDTO> consultations = consultationService.getAllCustomerConsultations(customerId);
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy tất cả lịch hẹn của customer thành công",
                    "consultations", consultations,
                    "total", consultations.size(),
                    "customerId", customerId
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy lịch hẹn getAllCustomerConsultations" ));
        }
    }

    /**
     * 2. API lấy tất cả lịch hẹn của consultant cụ thể
     */
    @GetMapping("/consultant/{consultantId}/all")
    @PreAuthorize("hasRole('ROLE_CONSULTANT') or hasRole('ROLE_STAFF') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllConsultantConsultations(
            @PathVariable @Positive(message = "Consultant ID phải là số dương") Long consultantId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            // Kiểm tra quyền: Consultant chỉ xem được lịch của mình, Staff/Manager/Admin xem được tất cả
            if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CONSULTANT"))) {
                if (!principal.getId().equals(consultantId)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Bạn chỉ có thể xem lịch hẹn của mình"));
                }
            }

            List<ConsultationDTO> consultations = consultationService.getAllConsultantConsultations(consultantId);
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy tất cả lịch hẹn của consultant thành công",
                    "consultations", consultations,
                    "total", consultations.size(),
                    "consultantId", consultantId
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy lịch hẹn getAllConsultantConsultations"));
        }
    }

    /**
     * 3. API chỉnh sửa note và status của Consultant (giữ nguyên signature cũ)
     */
    @PutMapping("/{consultationId}/consultant/update")
    @PreAuthorize("hasRole('ROLE_CONSULTANT')")
    public ResponseEntity<?> updateConsultantNoteAndStatus(
            @PathVariable Long consultationId,
            @RequestBody @Valid ConsultationNoteStatusUpdateDTO dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            if ((dto.getNote() == null || dto.getNote().trim().isEmpty()) && dto.getStatus() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phải cung cấp ít nhất note hoặc status để cập nhật"));
            }

            ConsultationDTO updated = consultationService.updateConsultantNoteAndStatus(consultationId, dto, principal.getId());

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật thông tin consultation thành công",
                    "consultation", updated
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }


    /**
     * 4. API chỉnh sửa rating và feedback của Customer
     */
    @PutMapping("/{consultationId}/customer/rating")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> updateCustomerRatingAndFeedback(
            @PathVariable @Positive(message = "Consultation ID phải là số dương") Long consultationId,
            @RequestBody @Valid ConsultationDTO consultationDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            // Validation: Ít nhất một trong hai phải có giá trị
            if (consultationDTO.getRating() == null &&
                    (consultationDTO.getFeedback() == null || consultationDTO.getFeedback().trim().isEmpty())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phải cung cấp ít nhất rating hoặc feedback"));
            }

            // Set consultationId từ path parameter
            consultationDTO.setConsultationId(consultationId);

            ConsultationDTO consultation = consultationService.updateCustomerRatingAndFeedback(
                    consultationDTO, principal.getId());

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật đánh giá thành công",
                    "consultation", consultation
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi cập nhật đánh giá updateCustomerRatingAndFeedback"));
        }
    }

    /**
     * 5. API chỉnh sửa TimeSlot của Staff
     */
    @PutMapping("/{consultationId}/staff/timeslot")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateTimeSlotByStaff(
            @PathVariable @Positive(message = "Consultation ID phải là số dương") Long consultationId,
            @RequestBody @Valid ConsultationDTO consultationDTO) {
        try {
            // Validation: TimeSlot không được null hoặc empty
            if (consultationDTO.getTimeSlot() == null || consultationDTO.getTimeSlot().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Time slot không được để trống"));
            }

            // Set consultationId từ path parameter
            consultationDTO.setConsultationId(consultationId);

            ConsultationDTO consultation = consultationService.updateTimeSlotByStaff(consultationDTO);

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật time slot thành công",
                    "consultation", consultation,
                    "newTimeSlot", consultationDTO.getTimeSlot()
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "error khi cập nhật time slot updateTimeSlotByStaff"));
        }
    }

    /**
     * 6. API chỉnh sửa Status của Staff
     */
    @PutMapping("/{consultationId}/staff/status")
    @PreAuthorize("hasRole('ROLE_STAFF') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateStatusByStaff(
            @PathVariable @Positive(message = "Consultation ID phải là số dương") Long consultationId,
            @RequestBody @Valid ConsultationDTO consultationDTO) {
        try {
            // Validation: Status không được null
            if (consultationDTO.getStatus() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status không được để trống"));
            }

            // Set consultationId từ path parameter
            consultationDTO.setConsultationId(consultationId);

            ConsultationDTO consultation = consultationService.updateStatusByStaff(consultationDTO);

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật trạng thái thành công",
                    "consultation", consultation,
                    "newStatus", consultationDTO.getStatus().getDescription()
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "error khi cập nhật status updateStatusByStaff"));
        }
    }
    /**
     * 7.API lấy tất cả consultation cho Manager
     * Chỉ Manager và Admin được phép truy cập
     */
    @GetMapping("/manager/all")
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllConsultationsForManager(
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            List<ConsultationDTO> consultations = consultationService.getAllConsultationsForManager();

            return ResponseEntity.ok(Map.of(
                    "consultations", consultations,
                    "total", consultations.size(),
                    "message", "Lấy tất cả consultation thành công",
                    "managerId", principal.getId()
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy tất cả consultation cho Manager getAllConsultationsForManager"));
        }
    }

}
