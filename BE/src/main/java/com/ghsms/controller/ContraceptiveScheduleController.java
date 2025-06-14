package com.ghsms.controller;

import com.ghsms.DTO.ContraceptiveScheduleDTO;
import com.ghsms.model.ContraceptiveSchedule;
import com.ghsms.service.ContraceptiveScheduleService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contraceptive-schedules")
@RequiredArgsConstructor
@Validated
public class ContraceptiveScheduleController {
    private final ContraceptiveScheduleService contraceptiveScheduleService;

    // 1. Đăng ký lịch uống thuốc tránh thai
    @PostMapping
    public ResponseEntity<ContraceptiveScheduleDTO> registerSchedule(
            @RequestBody @Valid ContraceptiveScheduleDTO dto) {
        // FE gửi dữ liệu DTO (userId, type, startDate, pillTime, ...)
        return ResponseEntity.ok(contraceptiveScheduleService.registerSchedule(dto));
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

}
