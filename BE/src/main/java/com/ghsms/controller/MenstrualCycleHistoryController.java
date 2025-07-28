package com.ghsms.controller;

import com.ghsms.config.UserPrincipal;
import com.ghsms.model.MenstrualCycleHistory;
import com.ghsms.service.MenstrualCycleHistoryService;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menstrual-cycle-history")
@RequiredArgsConstructor
@Validated
public class MenstrualCycleHistoryController {

    private final MenstrualCycleHistoryService historyService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> addCycle(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Past(message = "ngày bắt đầu nên ở quá khứ") LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Past(message = "Ngày kết thúc nên ở quá khứ") LocalDate endDate,
            @RequestParam @Min(value = 1, message = "Thời gian hành kinh phải ít nhất 1 ngày")
            @Max(value = 10, message = "Thời gian hành kinh không được vượt quá 10 ngày") Integer menstruationDuration,
            @RequestParam(required = false) @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự") String note,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {

            if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Ngày kết thúc phải sau ngày bắt đầu"));
            }

            long cycleLength = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
            if (cycleLength < 15) {
                return ResponseEntity.badRequest().body(Map.of("error", "Độ dài chu kỳ phải lớn hơn 15 ngày"));
            }

            if (menstruationDuration > cycleLength) {
                return ResponseEntity.badRequest().body(Map.of("error", "Thời gian hành kinh không được dài hơn chu kỳ"));
            }

            MenstrualCycleHistory history = historyService.addCycle(
                    principal.getId(), startDate, endDate, menstruationDuration, note);

            return ResponseEntity.ok(Map.of(
                    "message", "Đã thêm chu kỳ mới thành công",
                    "history", history
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{historyId}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> updateCycle(
            @PathVariable @Positive(message = "History ID phải là số dương") Long historyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Past(message = "ngày bắt đầu nên ở quá khứ") LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Past(message = "Ngày kết thúc nên ở quá khứ") LocalDate endDate,
            @RequestParam @Min(value = 1, message = "Thời gian hành kinh phải ít nhất 1 ngày")
            @Max(value = 10, message = "Thời gian hành kinh không được vượt quá 10 ngày") Integer menstruationDuration,
            @RequestParam(required = false) @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự") String note,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {

            if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Ngày kết thúc phải sau ngày bắt đầu"));
            }

            long cycleLength = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
            if (cycleLength < 15) {
                return ResponseEntity.badRequest().body(Map.of("error", "Độ dài chu kỳ phải lớn hơn 15 ngày"));
            }

            if (menstruationDuration > cycleLength) {
                return ResponseEntity.badRequest().body(Map.of("error", "Thời gian hành kinh không được dài hơn chu kỳ"));
            }

            MenstrualCycleHistory history = historyService.updateCycle(
                    historyId, principal.getId(), startDate, endDate, menstruationDuration, note);

            return ResponseEntity.ok(Map.of(
                    "message", "Đã cập nhật chu kỳ thành công",
                    "history", history
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<List<MenstrualCycleHistory>> getCycleHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<MenstrualCycleHistory> histories = historyService.getCycleHistory(principal.getId());
        return ResponseEntity.ok(histories);
    }

    @GetMapping("/{historyId}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> getCycleById(
            @PathVariable @Positive(message = "History ID phải là số dương") Long historyId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            MenstrualCycleHistory history = historyService.getCycleById(historyId);

            if (!history.getUser().getUserId().equals(principal.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bạn không có quyền xem chu kỳ này"));
            }

            return ResponseEntity.ok(history);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{historyId}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> deleteCycleHistory(
            @PathVariable @Positive(message = "History ID phải là số dương") Long historyId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            historyService.deleteCycleHistory(historyId, principal.getId());
            return ResponseEntity.ok(Map.of("message", "Đã xóa lịch sử chu kỳ thành công"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

}
