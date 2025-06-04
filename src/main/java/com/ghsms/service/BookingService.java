package com.ghsms.service;

import com.ghsms.util.PaymentCodeGenerator;
import org.springframework.stereotype.Service;
import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Booking;
import com.ghsms.model.User;
import com.ghsms.repository.BookingRepository;
import com.ghsms.repository.ServiceRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PaymentCodeGenerator paymentCodeGenerator;

    public Booking createBooking(Long userId, List<Long> serviceIds, String bookingDate, String timeSlot) {
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setBookingDate(bookingDate);
        booking.setTimeSlot(timeSlot);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setPaymentCode(paymentCodeGenerator.generatePaymentCode());

        for (Long serviceId : serviceIds) {
            com.ghsms.model.Service service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Service not found with ID: " + serviceId));
            booking.addService(service);
        }

        return bookingRepository.save(booking);
    }

    public Booking findByPaymentCode(String paymentCode) {
        return bookingRepository.findByPaymentCode(paymentCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found with payment code: " + paymentCode));
    }


    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be null");
        }
        return bookingRepository.findByCustomer_UserId(userId);
    }

    public List<Booking> getBookingsByCategory(ServiceBookingCategory category) {
        return bookingRepository.findByServiceCategory(category);
    }

    public List<Booking> getBookingsByCategoryAndDate(ServiceBookingCategory category, String date) {
        return bookingRepository.findByBookingDateAndService_Category(date, category);
    }
}