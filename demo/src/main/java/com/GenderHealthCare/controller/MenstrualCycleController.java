package com.GenderHealthCare.controller;

import com.GenderHealthCare.model.MenstrualCycle;
import com.GenderHealthCare.service.MenstrualCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/menstrual-cycles")
@RequiredArgsConstructor
public class MenstrualCycleController {
    private final MenstrualCycleService cycleService;

    @PostMapping("/track")
    public ResponseEntity<MenstrualCycle> trackCycle(
            @RequestParam Long customerId,
            @RequestParam LocalDate startDate,
            @RequestParam Integer cycleLength,
            @RequestParam Integer menstruationDuration,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(cycleService.trackCycle(customerId, startDate, cycleLength, menstruationDuration, notes));
    }


    @GetMapping("/customer/{customerId}/next-period")
    public ResponseEntity<LocalDate> getNextPeriod(@PathVariable Long customerId) {
        return ResponseEntity.ok(cycleService.getPredictedNextDate(customerId));
    }

    @GetMapping("/customer/{customerId}/ovulation")
    public ResponseEntity<LocalDate> getOvulationDate(@PathVariable Long customerId) {
        return ResponseEntity.ok(cycleService.getOvulationDate(customerId));
    }

    @GetMapping("/customer/{customerId}/current")
    public ResponseEntity<MenstrualCycle> getCurrentCycle(@PathVariable Long customerId) {
        return ResponseEntity.ok(cycleService.getCurrentCycle(customerId));
    }

    @GetMapping("/customer/{customerId}/predicted")
    public ResponseEntity<MenstrualCycle> getAllPredicted(@PathVariable Long customerId) {
        return ResponseEntity.ok(cycleService.getCurrentCycle(customerId));
    }

    @DeleteMapping("/customer/{customerId}/cycles/{cycleId}")
    public ResponseEntity<String> deleteMenstrualCycle(
            @PathVariable Long customerId,
            @PathVariable Long cycleId) {
        try {
            cycleService.deleteMenstrualCycle(customerId, cycleId);
            return ResponseEntity.ok("Xóa chu kỳ kinh nguyệt thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/customer/{customerId}/cycles/{cycleId}")
    public ResponseEntity<?> updateMenstrualCycle(
            @PathVariable Long customerId,
            @PathVariable Long cycleId,
            @RequestParam LocalDate startDate,
            @RequestParam Integer cycleLength,
            @RequestParam Integer menstruationDuration,
            @RequestParam(required = false) String notes) {
        try {
            MenstrualCycle updatedCycle = cycleService.updateCycle(
                    customerId,
                    cycleId,
                    startDate,
                    cycleLength,
                    menstruationDuration,
                    notes);
            return ResponseEntity.ok(updatedCycle);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}