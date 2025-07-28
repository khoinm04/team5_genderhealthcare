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

    public TestResultService(TestResultRepository testResultRepository) {
        this.testResultRepository = testResultRepository;
    }

    public long countInProgressPatients() {
        return testResultRepository.countByStatus(TestStatus.IN_PROGRESS);
    }

    public TestResult updateResult(Long testResultId, TestResultDTO dto, Long staffId) {
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy kết quả xét nghiệm"));

        testResult.setResult(dto.getResult());
        testResult.setNotes(dto.getNotes());
        testResult.setStatus(TestStatus.COMPLETED);
        testResult.setLastUpdated(LocalDateTime.now());


        return testResultRepository.save(testResult);
    }

    public TestResultDTO getTestResultDetailsById(Long testResultId) {
        try {
            TestResult testResult = testResultRepository.findById(testResultId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy kết quả xét nghiệm"));

            Booking booking = testResult.getBooking();
            if (booking == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "TestResult không có booking liên kết");
            }

            TestResultDTO dto = new TestResultDTO();
            dto.setTestResultId(testResultId);
            dto.setBookingId(booking.getBookingId());
            dto.setTestName(testResult.getTestName());
            dto.setResult(testResult.getResult());
            dto.setStatus(testResult.getStatus());
            dto.setScheduledTime(testResult.getScheduledTime());
            dto.setGeneratedAt(testResult.getGeneratedAt());
            dto.setEstimatedCompletionTime(testResult.getEstimatedCompletionTime());
            dto.setCurrentPhase(testResult.getCurrentPhase());
            dto.setProgressPercentage(testResult.getProgressPercentage());
            dto.setLastUpdated(testResult.getLastUpdated());
            dto.setNotes(testResult.getNotes());

            if (booking.getCustomer() != null) {
                dto.setCustomerName(booking.getCustomer().getFullName());
                dto.setCustomerEmail(booking.getCustomer().getEmail());
                dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
                dto.setCustomerAge(booking.getCustomer().getAge());
                dto.setCustomerGender(booking.getCustomer().getGender());
            }

            if (booking.getStaff() != null && booking.getStaff().getStaff() != null) {
                dto.setStaffName(booking.getStaff().getStaff().getName());
            }

            dto.setTimeSlot(booking.getTimeSlot());
            return dto;

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xử lý dữ liệu kết quả xét nghiệm");
        }
    }


}
