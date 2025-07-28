package com.ghsms.repository;

import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByCustomer_Customer_UserId(Long userId, Pageable pageable);

    Page<Booking> findByCustomer_Customer_UserIdAndServices_CategoryType(Long userId, ServiceCategoryType categoryType, Pageable pageable);


    @Query("SELECT DISTINCT b FROM Booking b JOIN b.services s WHERE s.category = :category")
    List<Booking> findByServiceCategory(@Param("category") String category);

    @Query("SELECT DISTINCT b FROM Booking b JOIN b.services s WHERE b.bookingDate = :date AND s.category = :category")
    List<Booking> findByBookingDateAndService_Category(
            @Param("date") String date,
            @Param("category") String category
    );

    Optional<Booking> findByPaymentCode(String paymentCode);

    @Query("SELECT DISTINCT b FROM Booking b " +
            "LEFT JOIN FETCH b.customer " +
            "LEFT JOIN FETCH b.staff " +
            "LEFT JOIN FETCH b.services s " +
            "ORDER BY b.createdAt DESC")
    List<Booking> findAllWithDetails();
@Query("SELECT b.bookingId FROM Booking b ORDER BY b.createdAt DESC")
Page<Long> findPagedBookingIds(Pageable pageable);

    @Query("SELECT DISTINCT b FROM Booking b " +
            "LEFT JOIN FETCH b.customer " +
            "LEFT JOIN FETCH b.staff " +
            "LEFT JOIN FETCH b.consultant " +
            "LEFT JOIN FETCH b.services s " +
            "WHERE b.bookingId IN :ids " +
            "ORDER BY b.createdAt DESC")
    List<Booking> findBookingsWithDetailsByIds(@Param("ids") List<Long> ids);



    List<Booking> findByBookingDateGreaterThanEqual(String bookingDate);

    @Query("SELECT b FROM Booking b " +
            "JOIN b.staff st " +
            "JOIN st.staff u " +
            "WHERE u.userId = :staffId")
    Page<Booking> findAllByStaffUserId(@Param("staffId") Long staffId, Pageable pageable);




@Query("""
    SELECT DISTINCT b FROM Booking b
    JOIN b.services s
    WHERE s.categoryType = com.ghsms.file_enum.ServiceCategoryType.CONSULTATION
""")
Page<Booking> findAllConsultingBookings(Pageable pageable);


    long count();

    @Query("SELECT b FROM Booking b JOIN b.services s " +
            "WHERE b.customer.customer.userId = :userId " +
            "AND s.category IN (:categories) " +
            "GROUP BY b " +
            "HAVING COUNT(DISTINCT s.category) = COUNT(s)")
    List<Booking> findAllStiBookingsByUserId(@Param("userId") Long userId,
                                             @Param("categories") List<String> categories);

}