package com.ghsms.controller;

import com.ghsms.model.MenstrualCycle;
import com.ghsms.service.MenstrualCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/menstrual-cycles")
@RequiredArgsConstructor
public class MenstrualCycleController {
    private final MenstrualCycleService cycleService;

    @PostMapping("/track")
    public ResponseEntity<MenstrualCycle> trackCycle(
            @RequestParam Long customerId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(cycleService.trackCycle(customerId, startDate, endDate, notes));
    }

    @GetMapping("/customer/{customerId}/history")
    public ResponseEntity<List<MenstrualCycle>> getCycleHistory(@PathVariable Long customerId) {
        return ResponseEntity.ok(cycleService.getCycleHistory(customerId));
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
}