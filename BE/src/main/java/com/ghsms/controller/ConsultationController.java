package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.Consultation;
import com.ghsms.service.ConsultationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

    @GetMapping("/customer/{customerId}/all")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllCustomerConsultations(
            @PathVariable @Positive(message = "Customer ID phải là số dương") Long customerId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {

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

    @GetMapping("/consultant/{consultantId}/consultations")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> getPagedConsultantConsultations(
            @PathVariable @Positive(message = "Consultant ID phải là số dương") Long consultantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CONSULTANT"))) {
                if (!principal.getId().equals(consultantId)) {
                    return ResponseEntity.status(403).body(Map.of("error", "Bạn chỉ có thể xem lịch hẹn của mình"));
                }
            }

            Page<ConsultationDTO> consultations = consultationService.getAllConsultantConsultations(consultantId, page, size);

            return ResponseEntity.ok(Map.of(
                    "message", "Lấy lịch hẹn theo trang thành công",
                    "consultations", consultations.getContent(),
                    "totalPages", consultations.getTotalPages(),
                    "totalElements", consultations.getTotalElements(),
                    "currentPage", consultations.getNumber(),
                    "consultantId", consultantId
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy lịch hẹn có phân trang"));
        }
    }

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
        Long consultantId = principal.getUser().getUserId();
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

            Long consultantUserId = consultation.getConsultant().getConsultant().getUserId();
            if (!consultantUserId.equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền chỉnh sửa ghi chú này.");
            }

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
        try {
            ConsultationDetailsResponse res = consultationService.getConsultationDetails(consultationId, user.getId());
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi server nội bộ.");
        }
    }

}
