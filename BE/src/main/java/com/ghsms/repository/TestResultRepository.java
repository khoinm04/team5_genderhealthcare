package com.ghsms.repository;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.TestStatus;
import com.ghsms.model.Booking;
import com.ghsms.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByBooking_BookingIdAndStatus(Long booking_bookingId, TestStatus status);
    long countByStatus(TestStatus status);


}