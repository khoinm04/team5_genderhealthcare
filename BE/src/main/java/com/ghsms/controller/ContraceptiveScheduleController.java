package com.ghsms.controller;

import com.ghsms.DTO.ContraceptiveScheduleDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.ContraceptiveSchedule;
import com.ghsms.service.ContraceptiveScheduleService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contraceptive-schedules")
@RequiredArgsConstructor
@Validated
public class ContraceptiveScheduleController {
    private final ContraceptiveScheduleService contraceptiveScheduleService;

    // 1. Đăng ký lịch uống thuốc tránh thai
    @PostMapping
    public ResponseEntity<ContraceptiveScheduleDTO> registerSchedule(
            @RequestBody @Valid ContraceptiveScheduleDTO dto,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        try {
            dto.setUserId(principal.getId());
            return ResponseEntity.ok(contraceptiveScheduleService.registerSchedule(dto));
        } catch (Exception e) {
            e.printStackTrace(); // 💥 IN LỖI RA CONSOLE
            throw e;
        }
    }


    // 2. Lấy danh sách lịch uống thuốc active của một user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ContraceptiveScheduleDTO>> getSchedulesByUser(
            @PathVariable @Min(value = 1, message = "userId phải lớn hơn 0") Long userId) {
        return ResponseEntity.ok(contraceptiveScheduleService.getSchedulesByUser(userId));
    }

    // 3. Xác nhận đã uống thuốc hôm nay
    @PatchMapping("/{scheduleId}/confirm")
    public ResponseEntity<String> confirmTaken(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId) {
        try {
            contraceptiveScheduleService.confirmTaken(scheduleId);
            // Xác nhận thành công, không có lỗi
            return ResponseEntity.ok("Đã xác nhận bạn đã uống thuốc hôm nay!");
        } catch (RuntimeException ex) {
            // Nếu trong kỳ nghỉ 7 ngày hoặc có lỗi khác
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    //dùng để dừng nhắc nhở khi người dùng không còn dùng nữa
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,
            @RequestParam @Min(value = 1, message = "userId phải lớn hơn 0") Long userId) {
        try {
            contraceptiveScheduleService.deleteSchedule(scheduleId, userId);
            return ResponseEntity.ok("Đã xóa thành công lịch uống thuốc!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentScheduleWithHistory(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal.getId();

        ContraceptiveSchedule schedule = contraceptiveScheduleService.getActiveScheduleByUserId(userId);
        Map<String, Boolean> history = contraceptiveScheduleService.generatePillHistory(schedule);

        return ResponseEntity.ok(
                Map.of(
                        "schedule", contraceptiveScheduleService.toDTO(schedule),
                        "history", history
                )
        );
    }

    // ✅ THÊM MỚI: API lấy thống kê quên uống thuốc
    @GetMapping("/{scheduleId}/missed-stats")
    public ResponseEntity<Map<String, Object>> getMissedStats(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ContraceptiveSchedule schedule = contraceptiveScheduleService.getScheduleById(scheduleId);

            if (!schedule.getUser().getUserId().equals(principal.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bạn không có quyền xem thông tin này!"));
            }

            Map<String, Object> stats = Map.of(
                    "scheduleId", scheduleId,
                    "missedDates", schedule.getMissedPillDates(),
                    "totalMissedDays", schedule.getMissedPillDates().size(),
                    "consecutiveMissedCount", schedule.getMissedCount(),
                    "pillType", schedule.getType(),
                    "maxAllowedMissed", schedule.getType().equals("21") ? 0 : 3
            );

            return ResponseEntity.ok(stats);

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ✅ THÊM MỚI: Helper method để xác định mức độ cảnh báo
    private String getWarningLevel(ContraceptiveSchedule schedule) {
        int missed = schedule.getMissedCount();
        int maxAllowed = schedule.getType().equals("21") ? 0 : 3;

        if (missed == 0) {
            return "SAFE"; // An toàn
        } else if (missed <= maxAllowed / 2) {
            return "WARNING"; // Cảnh báo
        } else if (missed < maxAllowed) {
            return "DANGER"; // Nguy hiểm, sắp bị xóa
        } else {
            return "CRITICAL"; // Rất nguy hiểm, phải xóa ngay
        }

    }
}
