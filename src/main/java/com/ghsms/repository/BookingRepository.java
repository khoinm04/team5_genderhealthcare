package com.ghsms.repository;

    import com.ghsms.model.Booking;
    import com.ghsms.file_enum.ServiceBookingCategory;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;

    import java.time.LocalDate;
    import java.util.List;
    import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_UserId(Long userId);

    @Query("SELECT DISTINCT b FROM Booking b JOIN b.services s WHERE s.category = :category")
    List<Booking> findByServiceCategory(@Param("category") ServiceBookingCategory category);

    @Query("SELECT DISTINCT b FROM Booking b JOIN b.services s WHERE b.bookingDate = :date AND s.category = :category")
    List<Booking> findByBookingDateAndService_Category(
            @Param("date") String date,
            @Param("category") ServiceBookingCategory category
    );

    Optional<Booking> findByPaymentCode(String paymentCode);
}