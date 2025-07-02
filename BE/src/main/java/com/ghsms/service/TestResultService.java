package com.ghsms.service;

import com.ghsms.DTO.TestResultDTO;
import com.ghsms.file_enum.TestStatus;
import com.ghsms.model.Booking;
import com.ghsms.model.TestResult;
import com.ghsms.model.User;
import com.ghsms.repository.TestResultRepository;
import com.ghsms.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class TestResultService {
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    public TestResultService(TestResultRepository testResultRepository, UserRepository userRepository) {
        this.testResultRepository = testResultRepository;
        this.userRepository = userRepository;
    }

    public long countInProgressPatients() {
        return testResultRepository.countByStatus(TestStatus.IN_PROGRESS);
    }

    public TestResult updateResult(Long testResultId, TestResultDTO dto, Long staffId) {
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy kết quả xét nghiệm"));

        // Cập nhật kết quả xét nghiệm
        testResult.setResult(dto.getResult());
        testResult.setStatus(TestStatus.COMPLETED);
        testResult.setLastUpdated(LocalDateTime.now());

        return testResultRepository.save(testResult);
    }


}
