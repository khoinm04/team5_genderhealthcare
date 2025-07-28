package com.ghsms.service;

import com.ghsms.model.MenstrualCycleHistory;
import com.ghsms.model.User;
import com.ghsms.repository.MenstrualCycleHistoryRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenstrualCycleHistoryService {

    private final MenstrualCycleHistoryRepository historyRepository;
    private final UserRepository userRepository;

    @Transactional
    public MenstrualCycleHistory addCycle(Long userId, LocalDate startDate, LocalDate endDate,
                                          Integer menstruationDuration, String note) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + userId));
        int cycleLength = (int) ChronoUnit.DAYS.between(startDate, endDate);
        MenstrualCycleHistory history = new MenstrualCycleHistory();
        history.setUser(user);
        history.setStartDate(startDate);
        history.setEndDate(endDate);
        history.setCycleLength(cycleLength);
        history.setMenstruationDuration(menstruationDuration);
        history.setNote(note);
        MenstrualCycleHistory savedHistory = historyRepository.save(history);
        log.info("Đã thêm chu kỳ mới {} cho user {}", savedHistory.getHistoryId(), userId);
        return savedHistory;
    }

    @Transactional
    public MenstrualCycleHistory updateCycle(Long historyId, Long userId, LocalDate startDate,
                                             LocalDate endDate, Integer menstruationDuration, String note) {
        MenstrualCycleHistory history = historyRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử chu kỳ với ID: " + historyId));
        if (!history.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa lịch sử chu kỳ này");
        }
        int cycleLength = (int) ChronoUnit.DAYS.between(startDate, endDate);
        history.setStartDate(startDate);
        history.setEndDate(endDate);
        history.setCycleLength(cycleLength);
        history.setMenstruationDuration(menstruationDuration);
        history.setNote(note);
        MenstrualCycleHistory savedHistory = historyRepository.save(history);
        log.info("Đã cập nhật chu kỳ {} cho user {}", historyId, userId);
        return savedHistory;
    }

    public List<MenstrualCycleHistory> getCycleHistory(Long userId) {
        return historyRepository.findByUserUserIdOrderByStartDateDesc(userId);
    }

    public MenstrualCycleHistory getCycleById(Long historyId) {
        return historyRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử chu kỳ với ID: " + historyId));
    }

    @Transactional
    public void deleteCycleHistory(Long historyId, Long userId) {
        MenstrualCycleHistory history = historyRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử chu kỳ với ID: " + historyId));
        if (!history.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa lịch sử chu kỳ này");
        }
        historyRepository.delete(history);
    }
}
