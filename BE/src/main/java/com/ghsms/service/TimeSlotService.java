package com.ghsms.service;

import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.TestStatus;
import com.ghsms.repository.ConsultationRepository;
import com.ghsms.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private static final int MAX_SLOTS = 10;

    private final ConsultationRepository consultationRepo;
    private final TestResultRepository testResultRepo;

    private static final List<String> TIME_SLOTS = List.of(
            "08:00-08:30", "08:30-09:00", "09:00-09:30", "09:30-10:00",
            "10:00-10:30", "10:30-11:00", "14:00-14:30", "14:30-15:00",
            "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00"
    );

    public Map<String, Boolean> getConsultAvailability(String date) {
        Map<String, Boolean> map = new LinkedHashMap<>();
        for (String slot : TIME_SLOTS) {
            int cnt = consultationRepo.countActiveConsultationsByDateAndSlot(
                    date, slot, ConsultationStatus.CANCELED);
            map.put(slot, cnt < MAX_SLOTS);
        }
        return map;
    }

    public Map<String, Boolean> getTestAvailability(String date) {
        Map<String, Boolean> map = new LinkedHashMap<>();
        for (String slot : TIME_SLOTS) {
            int cnt = testResultRepo.countActiveTestResultsByDateAndSlot(
                    date, slot, TestStatus.CANCELED);
            map.put(slot, cnt < MAX_SLOTS);
        }
        return map;
    }
}

