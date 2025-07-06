package com.ghsms.repository;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.model.Booking;
import com.ghsms.file_enum.ServiceBookingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_Customer_UserId(Long userId);

    @Query("SELECT DISTINCT b FROM Booking b JOIN b.services s WHERE s.category = :category")
    List<Booking> findByServiceCategory(@Param("category") ServiceBookingCategory category);

    @Query("SELECT DISTINCT b FROM Booking b JOIN b.services s WHERE b.bookingDate = :date AND s.category = :category")
    List<Booking> findByBookingDateAndService_Category(
            @Param("date") String date,
            @Param("category") ServiceBookingCategory category
    );

    Optional<Booking> findByPaymentCode(String paymentCode);

    @Query("SELECT DISTINCT b FROM Booking b " +
            "LEFT JOIN FETCH b.customer " +
            "LEFT JOIN FETCH b.staff " +
            "LEFT JOIN FETCH b.services s")
    List<Booking> findAllWithDetails();

    List<Booking> findByBookingDateGreaterThanEqual(String bookingDate);

    @Query("SELECT b FROM Booking b " +
            "LEFT JOIN FETCH b.customer c " +
            "LEFT JOIN FETCH b.services s " +
            "LEFT JOIN FETCH b.testResults tr " +
            "LEFT JOIN FETCH b.staff st " +
            "LEFT JOIN FETCH st.staff u " +  // staff là User
            "LEFT JOIN FETCH b.consultant con " +
            "WHERE u.userId = :staffId")
    List<Booking> findAllByStaffUserId(Long staffId);

    @Query("SELECT b FROM Booking b " +
            "LEFT JOIN FETCH b.customer c " +
            "LEFT JOIN FETCH b.services s " +
            "LEFT JOIN FETCH b.testResults tr " +
            "LEFT JOIN FETCH b.staff st " +
            "LEFT JOIN FETCH st.staff u " +
            "LEFT JOIN FETCH b.consultant con " +
            "LEFT JOIN FETCH con.consultant cu " +  // lấy user của consultant
            "WHERE cu.userId = :consultantUserId")
    List<Booking> findAllByConsultantUserId(Long consultantUserId);

//list all bookings with consultation services
    @Query("""
    SELECT DISTINCT b FROM Booking b
    JOIN b.services s
    WHERE s.categoryType = com.ghsms.file_enum.ServiceCategoryType.CONSULTATION
""")
    List<Booking> findAllConsultingBookings();

    long count();




}