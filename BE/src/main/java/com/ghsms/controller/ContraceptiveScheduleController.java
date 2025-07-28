package com.ghsms.controller;

import com.ghsms.DTO.ContraceptiveScheduleDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.ContraceptiveSchedule;
import com.ghsms.service.ContraceptiveScheduleService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contraceptive-schedules")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ContraceptiveScheduleController {
    private final ContraceptiveScheduleService contraceptiveScheduleService;
    private static final Logger logger = LoggerFactory.getLogger(ContraceptiveScheduleController.class);

    private static final String SCHEDULE_KEY = "schedule";



    @PostMapping
    public ResponseEntity<ContraceptiveScheduleDTO> registerSchedule(
            @RequestBody @Valid ContraceptiveScheduleDTO dto,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        try {
            dto.setUserId(principal.getId());
            return ResponseEntity.ok(contraceptiveScheduleService.registerSchedule(dto));
        } catch (Exception e) {
            logger.error("Đã xảy ra lỗi", e);
            throw e;
        }

    }

    @PatchMapping("/{scheduleId}/confirm")
    public ResponseEntity<String> confirmTaken(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId) {
        try {
            contraceptiveScheduleService.confirmTaken(scheduleId);

            return ResponseEntity.ok("Đã xác nhận bạn đã uống thuốc hôm nay!");
        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body("Lỗi khi xác nhận uống thuốc");
        }
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<String> safeDeleteSchedule(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,
            @RequestParam @Min(value = 1, message = "userId phải lớn hơn 0") Long userId) {
        try {
            contraceptiveScheduleService.safeDeleteSchedule(scheduleId, userId);
            return ResponseEntity.ok("Đã xóa thành công lịch uống thuốc!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa lịch uống thuốc");
        }
    }

    @DeleteMapping("/delete/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            contraceptiveScheduleService.deleteSchedule(scheduleId, principal.getId());
            return ResponseEntity.ok("Đã xóa hoàn toàn lịch uống thuốc khỏi lịch sử!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa lịch uống thuốc: " + ex.getMessage());
        }
    }

    @PatchMapping("/{scheduleId}/note")
    public ResponseEntity<String> updateNote(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            String note = request.get("note");
            contraceptiveScheduleService.updateNote(scheduleId, note, principal.getId());
            return ResponseEntity.ok("Đã cập nhật ghi chú thành công!");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật ghi chú: " + ex.getMessage());
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentScheduleWithHistory(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal.getId();
        ContraceptiveSchedule schedule = contraceptiveScheduleService.getActiveScheduleByUserId(userId);
        if (schedule == null) {
            return ResponseEntity.ok(
                    Map.of(
                            SCHEDULE_KEY, Map.of(),
                            "history", Map.of()
                    )
            );
        }
        Map<String, Boolean> history = contraceptiveScheduleService.generatePillHistory(schedule);

        return ResponseEntity.ok(
                Map.of(
                        SCHEDULE_KEY, contraceptiveScheduleService.toDTO(schedule),
                        "history", history
                )
        );
    }

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
                    "pillType", schedule.getType(),
                    "maxAllowedMissed", schedule.getType().equals("21") ? 0 : 3,
                    "medicineName", schedule.getMedicineName()
            );

            return ResponseEntity.ok(stats);

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{scheduleId}/update-and-save-history")
    public ResponseEntity<?> updateScheduleAndSaveToHistory(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,

            @RequestParam @Min(value = -1, message = "Current index phải lớn hơn hoặc bằng 0")
            @Max(value = 27, message = "Current index không được vượt quá 27") Integer currentIndex,

            @RequestParam(required = false) @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự") String note,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ContraceptiveSchedule result = contraceptiveScheduleService
                    .updateScheduleAndSaveToHistory(scheduleId, currentIndex, note, principal.getId());

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật và lưu lịch sử thành công",
                    SCHEDULE_KEY, result
            ));

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<ContraceptiveSchedule>> getScheduleHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            List<ContraceptiveSchedule> history = contraceptiveScheduleService
                    .getScheduleHistory(principal.getId());

            return ResponseEntity.ok(history);

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @GetMapping("/history/{scheduleId}")
    public ResponseEntity<?> getHistoryScheduleDetail(
            @PathVariable @Min(value = 1, message = "scheduleId phải lớn hơn 0") Long scheduleId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            ContraceptiveSchedule schedule = contraceptiveScheduleService
                    .getScheduleById(scheduleId);

            if (!schedule.getUser().getUserId().equals(principal.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bạn không có quyền xem lịch này!"));
            }

            return ResponseEntity.ok(Map.of(
                    SCHEDULE_KEY, schedule,
                    "isHistory", !schedule.isActive()
            ));

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
