package com.ghsms.controller;

import com.ghsms.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingAvailabilityController {

    private final TimeSlotService timeSlotService;

    @GetMapping("/availability")
    public Map<String, Boolean> getAvailability(
            @RequestParam String date,
            @RequestParam(defaultValue = "consult") String type) {

        return switch (type.toLowerCase()) {
            case "test"    -> timeSlotService.getTestAvailability(date);
            case "consult" -> timeSlotService.getConsultAvailability(date);
            default        -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "type phải là 'consult' hoặc 'test'");
        };
    }
}

