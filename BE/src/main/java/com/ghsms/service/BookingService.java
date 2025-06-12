package com.ghsms.service;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.User;
import com.ghsms.repository.CustomerDetailsRepository;
import com.ghsms.util.PaymentCodeGenerator;
import org.springframework.stereotype.Service;
import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Booking;
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
    private final CustomerDetailsRepository customerDetailsRepository;

    public Booking createBooking(BookingDTO bookingDTO) {
        CustomerDetails customerDetails = null;

        User user = null;
        if (bookingDTO.getUserId() != null) {
            // Tìm user theo userId
            user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // Lấy CustomerDetails của user nếu có, nếu không thì tạo mới
            customerDetails = user.getCustomerDetails();
            if (customerDetails == null) {
                customerDetails = new CustomerDetails();
                customerDetails.setFullName(bookingDTO.getCustomerName());
                customerDetails.setEmail(bookingDTO.getCustomerEmail());
                customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
                customerDetails.setCustomer(user);
                customerDetails = customerDetailsRepository.save(customerDetails);
            }
        } else {
            // Trường hợp khách không đăng nhập, tạo mới CustomerDetails từ thông tin form
            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails = customerDetailsRepository.save(customerDetails);
        }

        Booking booking = new Booking();
        booking.setCustomer(customerDetails);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setPaymentCode(paymentCodeGenerator.generatePaymentCode());

        for (Long serviceId : bookingDTO.getServiceIds()) {
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
        return bookingRepository.findByCustomer_Customer_UserId(userId);
    }

    public List<Booking> getBookingsByCategory(ServiceBookingCategory category) {
        return bookingRepository.findByServiceCategory(category);
    }

    public List<Booking> getBookingsByCategoryAndDate(ServiceBookingCategory category, String date) {
        return bookingRepository.findByBookingDateAndService_Category(date, category);
    }
}