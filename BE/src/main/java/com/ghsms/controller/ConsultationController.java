package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.Consultation;
import com.ghsms.service.ConsultationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF') or hasRole('MANAGER') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('CONSULTANT') or hasRole('STAFF') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllConsultantConsultations(
            @PathVariable @Positive(message = "Consultant ID phải là số dương") Long consultantId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            // Kiểm tra quyền: Consultant chỉ xem được lịch của mình, Staff/Manager/Admin xem được tất cả
            if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("CONSULTANT"))) {
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
    @PreAuthorize("hasRole('CONSULTANT')")
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

    @PostMapping("/create-with-meet")
    @PreAuthorize("hasRole('STAFF') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createConsultationWithMeetLink(
            @Valid @RequestBody ConsultationDTO consultationDTO,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ConsultationDTO created = consultationService.createConsultationWithMeetLink(
                    consultationDTO,
                    principal.getId()
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Tạo cuộc tư vấn thành công",
                    "consultation", created
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đã xảy ra lỗi hệ thống"));
        }
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> completeConsultation(
            @PathVariable("id") Long consultationId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        try {
            Long consultantId = principal.getId();
            ConsultationDTO updated = consultationService.markConsultationComplete(consultationId, consultantId);

            return ResponseEntity.ok(Map.of(
                    "message", "Cuộc tư vấn đã được đánh dấu hoàn thành",
                    "consultation", updated
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống khi cập nhật trạng thái cuộc tư vấn"));
        }
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> startConsultation(
            @PathVariable("id") Long consultationId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        try {
            Long consultantId = principal.getId();
            ConsultationDTO updated = consultationService.startConsultation(consultationId, consultantId);

            return ResponseEntity.ok(Map.of(
                    "message", "Bắt đầu cuộc tư vấn thành công",
                    "consultation", updated
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống khi bắt đầu tư vấn"));
        }
    }

    @GetMapping("/stats/today")
    public ResponseEntity<?> getTodayStatsForConsultant(@AuthenticationPrincipal UserPrincipal principal) {
        Long consultantId = principal.getUser().getUserId(); // 👈 lấy ID từ token giải mã sẵn
        ConsultationStatsDTO stats = consultationService.getTodayStats(consultantId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> submitFeedback(
            @PathVariable("id") Long consultationId,
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        ConsultationDTO dto = consultationService.submitFeedback(
                consultationId, user.getId(), request.getRating(), request.getFeedback());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<?> updateConsultationNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        String note = requestBody.get("note");

        try {
            Consultation consultation = consultationService.getConsultationById(id);

            if (consultation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consultation not found");
            }

            // ✅ Kiểm tra user hiện tại có phải là tư vấn viên của consultation không
            Long consultantUserId = consultation.getConsultant().getConsultant().getUserId();
            if (!consultantUserId.equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền chỉnh sửa ghi chú này.");
            }

            // ✅ Gọi service để update ghi chú
            consultationService.updateNoteOnly(id, note);

            return ResponseEntity.ok(Map.of("message", "Ghi chú đã được cập nhật"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật ghi chú: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<?> getConsultationDetails(
            @PathVariable("id") Long consultationId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        System.out.println("📥 [GET] /consultations/" + consultationId + "/details");
        System.out.println("👤 User ID: " + user.getId());

        try {
            ConsultationDetailsResponse res = consultationService.getConsultationDetails(consultationId, user.getId());
            System.out.println("✅ Trả về dữ liệu thành công.");
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            System.err.println("❌ Lỗi xảy ra trong getConsultationDetails:");
            e.printStackTrace(); // In chi tiết stack trace
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception ex) {
            System.err.println("🔥 Lỗi không xác định:");
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server nội bộ.");
        }
    }





}
