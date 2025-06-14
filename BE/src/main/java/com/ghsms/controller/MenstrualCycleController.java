package com.ghsms.controller;

import com.ghsms.DTO.MenstrualCycleDTO;
import com.ghsms.model.MenstrualCycle;
import com.ghsms.service.MenstrualCycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/menstrual-cycles")
@RequiredArgsConstructor
public class MenstrualCycleController {
    private final MenstrualCycleService menstrualCycleService;

    @PostMapping("/track")
    public ResponseEntity<MenstrualCycleDTO> trackCycle(@PathVariable Long customerId,
                                                        @Valid @RequestBody MenstrualCycleDTO request) {
        return ResponseEntity.ok(
                menstrualCycleService.toDTO(
                        menstrualCycleService.trackCycle(
                                customerId,
                                request.getStartDate(),
                                request.getCycleLength(),
                                request.getMenstruationDuration(),
                                request.getNotes()
                        )
                )
        );
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
        return ResponseEntity.ok(menstrualCycleService.toDTO(menstrualCycleService.getCurrentCycle(customerId)));
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


}