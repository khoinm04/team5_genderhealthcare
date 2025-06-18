package com.ghsms.service;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.file_enum.ReportFormat;
import com.ghsms.file_enum.TestStatus;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.TestResult;
import com.ghsms.model.User;
import com.ghsms.repository.*;
import com.ghsms.util.PaymentCodeGenerator;
import com.ghsms.util.ReportGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;
import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PaymentCodeGenerator paymentCodeGenerator;
    private final CustomerDetailsRepository customerDetailsRepository;
    private final TestResultRepository testResultRepository;
    private final ReportGenerator reportGenerator;

    @PersistenceContext
    private EntityManager entityManager;

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
                customerDetails.setAge(bookingDTO.getCustomerAge());
                customerDetails.setGender(bookingDTO.getCustomerGender());
                customerDetails.setCustomer(user);
                customerDetails = customerDetailsRepository.save(customerDetails);
            }
        } else {
            // Trường hợp khách không đăng nhập, tạo mới CustomerDetails từ thông tin form
            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails.setAge(bookingDTO.getCustomerAge());
            customerDetails.setGender(bookingDTO.getCustomerGender());
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

    public Booking createStiBooking(BookingDTO bookingDTO) {
        CustomerDetails customerDetails = null;
        User user = null;

        if (bookingDTO.getUserId() != null) {
            user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            customerDetails = user.getCustomerDetails();
            if (customerDetails == null) {
                customerDetails = new CustomerDetails();
                customerDetails.setFullName(bookingDTO.getCustomerName());
                customerDetails.setEmail(bookingDTO.getCustomerEmail());
                customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
                customerDetails.setAge(bookingDTO.getCustomerAge());
                customerDetails.setGender(bookingDTO.getCustomerGender());
                customerDetails.setCustomer(user);
                customerDetails = customerDetailsRepository.save(customerDetails);
            }
        } else {
            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails.setAge(bookingDTO.getCustomerAge());
            customerDetails.setGender(bookingDTO.getCustomerGender());
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
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + serviceId));
            if (service.getCategory() != ServiceBookingCategory.STI_HIV &&
                    service.getCategory() != ServiceBookingCategory.STI_Syphilis &&
                    service.getCategory() != ServiceBookingCategory.STI_Gonorrhea &&
                    service.getCategory() != ServiceBookingCategory.STI_Chlamydia) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only STI test services are allowed");
            }
            booking.addService(service);
        }

        booking = bookingRepository.save(booking);

        // Create test results with detailed tracking
        LocalDateTime appointmentTime = LocalDateTime.parse(booking.getBookingDate() + "T" + booking.getTimeSlot().split("-")[0]);

        for (com.ghsms.model.Service service : booking.getServices()) {
            TestResult testResult = new TestResult();
            testResult.setBooking(booking);
            testResult.setTestName(service.getServiceName());
            testResult.setStatus(TestStatus.PENDING);
            testResult.setGeneratedAt(LocalDateTime.now());
            testResult.setScheduledTime(appointmentTime);
            testResult.setEstimatedCompletionTime(appointmentTime.plusHours(3)); // Estimate 3 hours for completion
            testResult.setCurrentPhase("Scheduled");
            testResult.setProgressPercentage(0);
            testResult.setLastUpdated(LocalDateTime.now());
            testResult.setNotes("Appointment scheduled. Awaiting patient arrival.");

            testResultRepository.save(testResult);
        }

        return booking;
    }

    public Booking confirmStiPayment(String paymentCode) {
        Booking booking = findByPaymentCode(paymentCode);
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public byte[] generateTestResultReport(Long bookingId, ReportFormat format) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        List<TestResult> results = findByBookingIdAndStatusCustom(bookingId, TestStatus.COMPLETED.name());

        if (results.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No completed test results available");
        }

        TestResult testResult = new TestResult();
        testResult.setBooking(booking);
        testResult.setTestName(booking.getServices().iterator().next().getServiceName());
        testResult.setResult(results.get(0).getResult());
        testResult.setStatus(TestStatus.COMPLETED);
        testResult.setGeneratedAt(LocalDateTime.now());
        testResult.setFormat(format);
        testResult.setFileContent(reportGenerator.generateReport(results, format));

        testResultRepository.save(testResult);
        return testResult.getFileContent();
    }

    // In BookingService.java
    public Booking findBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found with ID: " + bookingId));
    }

    public TestResult updateTestStatus(Long bookingId, Long testResultId, TestStatus status, String notes) {
        // Verify booking exists
        Booking booking = findBookingById(bookingId);

        // Find and update test result
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Test result not found with ID: " + testResultId));

        // Verify test result belongs to the booking
        if (!testResult.getBooking().getBookingId().equals(bookingId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Test result does not belong to the specified booking");
        }

        // Update status and related fields
        testResult.setStatus(status);
        testResult.setLastUpdated(LocalDateTime.now());

        // Update progress based on status
        switch (status) {
            case PENDING -> {
                testResult.setProgressPercentage(0);
                testResult.setCurrentPhase("Scheduled");
            }
            case IN_PROGRESS -> {
                testResult.setProgressPercentage(50);
                testResult.setCurrentPhase("Processing");
            }
            case COMPLETED -> {
                testResult.setProgressPercentage(100);
                testResult.setCurrentPhase("Completed");
            }
            case CANCELED -> {
                testResult.setProgressPercentage(0);
                testResult.setCurrentPhase("Canceled");
            }
        }

        // Update notes if provided
        if (notes != null && !notes.trim().isEmpty()) {
            testResult.setNotes(notes);
        }

        return testResultRepository.save(testResult);
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

    // Phương thức tùy chỉnh với Criteria API
    private List<TestResult> findByBookingIdAndStatusCustom(Long bookingId, String status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TestResult> cq = cb.createQuery(TestResult.class);
        Root<TestResult> root = cq.from(TestResult.class);

        cq.select(root)
                .where(
                        cb.equal(root.get("booking").get("bookingId"), bookingId),
                        cb.equal(root.get("status"), status)
                );

        return entityManager.createQuery(cq).getResultList();
    }
}