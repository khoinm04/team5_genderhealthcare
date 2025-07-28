package com.ghsms.repository;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.TestStatus;
import com.ghsms.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByBooking_BookingIdAndStatus(Long booking_bookingId, TestStatus status);
    long countByStatus(TestStatus status);

    Optional<TestResult> findByBooking_BookingId(Long bookingBookingId);

    @Query("""
    SELECT COUNT(tr) FROM TestResult tr
    WHERE tr.booking.bookingDate = :bookingDate
      AND tr.booking.timeSlot = :timeSlot
      AND tr.status != :canceledStatus
""")
    int countActiveTestResultsByDateAndSlot(
            @Param("bookingDate") String bookingDate,
            @Param("timeSlot") String timeSlot,
            @Param("canceledStatus") TestStatus canceledStatus
    );

}