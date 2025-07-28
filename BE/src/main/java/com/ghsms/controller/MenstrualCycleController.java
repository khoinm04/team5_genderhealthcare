package com.ghsms.controller;

import com.ghsms.DTO.MenstrualCycleDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.MenstrualCycle;
import com.ghsms.model.MenstrualCycleHistory;
import com.ghsms.service.MenstrualCycleHistoryService;
import com.ghsms.service.MenstrualCycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/menstrual-cycles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_CUSTOMER')")
public class MenstrualCycleController {
    private final MenstrualCycleService menstrualCycleService;
    private final MenstrualCycleHistoryService menstrualCycleHistoryService;

    @PostMapping("/track")
    public ResponseEntity<MenstrualCycleDTO> trackCycle(@AuthenticationPrincipal UserPrincipal user,
                                                        @Valid @RequestBody MenstrualCycleDTO menstrualCycleDTO) {
        menstrualCycleDTO.setUserId(user.getId());

        MenstrualCycle result = menstrualCycleService.trackCycle(
                menstrualCycleDTO.getUserId(),
                menstrualCycleDTO.getStartDate(),
                menstrualCycleDTO.getCycleLength(),
                menstrualCycleDTO.getMenstruationDuration(),
                menstrualCycleDTO.getNotes()
        );

        return ResponseEntity.ok(menstrualCycleService.toDTO(result));
    }


    @GetMapping("/customer/{customerId}/next-period")
    public ResponseEntity<LocalDate> getNextPeriod(@PathVariable Long customerId) {
        return ResponseEntity.ok(menstrualCycleService.getPredictedNextDate(customerId));
    }

    @GetMapping("/customer/{customerId}/ovulation")
    public ResponseEntity<LocalDate> getOvulationDate(@PathVariable Long customerId) {
        return ResponseEntity.ok(menstrualCycleService.getOvulationDate(customerId));
    }

    @GetMapping("/customer/{customerId}/current")
    public ResponseEntity<MenstrualCycleDTO> getCurrentCycle(@PathVariable Long customerId) {
        MenstrualCycle currentCycle = menstrualCycleService.getCurrentCycle(customerId);
        if (currentCycle == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(menstrualCycleService.toDTO(currentCycle));
    }

    @GetMapping("/customer/{customerId}/predicted")
    public ResponseEntity<MenstrualCycleDTO> getAllPredicted(@PathVariable Long customerId) {
        return ResponseEntity.ok(menstrualCycleService.toDTO(menstrualCycleService.getAllPredicted(customerId)));
    }

    @DeleteMapping("/customer/{customerId}/cycles/{cycleId}")
    public ResponseEntity<String> deleteMenstrualCycle(@PathVariable Long customerId, @PathVariable Long cycleId) {
        try {
            menstrualCycleService.deleteMenstrualCycle(customerId, cycleId);
            return ResponseEntity.ok("Xóa chu kỳ kinh nguyệt thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/customer/{customerId}/cycles/{cycleId}")
    public ResponseEntity<?> updateMenstrualCycle(@PathVariable Long customerId,
                                                  @PathVariable Long cycleId,
                                                  @Valid @RequestBody MenstrualCycleDTO request) {
        return ResponseEntity.ok(menstrualCycleService.toDTO(menstrualCycleService.updateCycle(
                customerId,
                cycleId,
                request.getStartDate(),
                request.getCycleLength(),
                request.getMenstruationDuration(),
                request.getNotes())));
    }

    @PostMapping("/history/save-current")
    public ResponseEntity<?> saveCurrentCycleToHistory(@AuthenticationPrincipal UserPrincipal user) {
        Long userId = user.getId();
        MenstrualCycle currentCycle = menstrualCycleService.getCurrentCycle(userId);
        if (currentCycle == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không có chu kỳ hiện tại để lưu lịch sử"));
        }

        LocalDate startDate = currentCycle.getStartDate();
        LocalDate endDate = startDate.plusDays(currentCycle.getCycleLength() - 1);
        Integer menstruationDuration = currentCycle.getMenstruationDuration();
        String notes = currentCycle.getNotes();

        try {
            MenstrualCycleHistory history = menstrualCycleHistoryService.addCycle(
                    userId, startDate, endDate, menstruationDuration, notes
            );
            return ResponseEntity.ok(Map.of("message", "Đã lưu chu kỳ hiện tại vào lịch sử", "history", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}