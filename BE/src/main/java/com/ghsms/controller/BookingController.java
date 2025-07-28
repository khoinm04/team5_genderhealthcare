package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.file_enum.*;
import com.ghsms.mapper.UserMapper;
import com.ghsms.model.*;
import com.ghsms.service.BookingService;
import com.ghsms.service.CustomUserDetailsService;
import com.ghsms.service.ServiceService;
import com.ghsms.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.ghsms.config.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking", description = "Booking management APIs")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {
    private final BookingService bookingService;
    private final UserService userService;
    private final CustomUserDetailsService customUserDetailsService;
    private final ServiceService serviceService;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingDTO bookingDTO,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        try {
            bookingDTO.setUserId(user.getId());

            Booking booking = bookingService.createBooking(bookingDTO);
            BookingDTO response = convertToDTO(booking);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Booking created successfully",
                            "booking", response
                    ));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }


    @GetMapping("/payment/{paymentCode}")
    @Operation(summary = "Get booking by payment code")
    public ResponseEntity<?> getBookingByPaymentCode(
            @PathVariable String paymentCode,
            @AuthenticationPrincipal UserPrincipal user) {
        try {
            Booking booking = bookingService.findByPaymentCode(paymentCode);

            if (!booking.getCustomer().getCustomerId().equals(user.getId()) &&
                    !user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Bạn không có quyền xem thông tin booking này"));
            }

            return ResponseEntity.ok(convertToDTO(booking));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }


    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all bookings for a user (paged)")
    public ResponseEntity<Page<Booking>> getUserBookings(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingService.getUserBookings(userId, pageable);
        return ResponseEntity.ok(bookingPage);
    }


    @GetMapping("/category/{category}")
    @Operation(summary = "Get bookings by service category")
    public ResponseEntity<List<BookingDTO>> getBookingsByCategory(
            @PathVariable String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date) {
        List<Booking> bookings = date != null ?
                bookingService.getBookingsByCategoryAndDate(category, date) :
                bookingService.getBookingsByCategory(category);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @PatchMapping("/{bookingId}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        try {
            if (status == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Booking status cannot be null"));
            }

            Booking booking = bookingService.updateBookingStatus(bookingId, status);
            BookingDTO updatedBooking = convertToDTO(booking);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Booking status updated successfully",
                            "booking", updatedBooking
                    ));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating booking status: " + e.getMessage()));
        }
    }

    @PostMapping("/sti")
    @Operation(summary = "Create a new STI booking")
    public ResponseEntity<?> createStiBooking(@Valid @RequestBody BookingDTO bookingDTO,
                                              @AuthenticationPrincipal UserPrincipal user) {
        try {
            Long userId = user.getId();
            bookingDTO.setUserId(userId);


            Booking booking = bookingService.createStiBooking(bookingDTO);
            BookingDTO response = convertToDTO(booking);
            List<TestResultDTO> testResults = booking.getTestResults().stream()
                    .map(this::convertToTestResultDTO)
                    .toList();

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "STI booking created successfully",
                            "booking", response,
                            "testResults", testResults
                    ));
        } catch (ResponseStatusException e) {
            assert e.getReason() != null;
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    @GetMapping("/user")
    @Operation(summary = "Get STI bookings for current user")
    public ResponseEntity<?> getUserStiBookings(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        try {
            Long userId = user.getId();
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

            Page<Booking> allBookingsPage = bookingService.getUserBookings(userId, pageable);

            List<BookingDTO> filtered = allBookingsPage.getContent().stream()
                    .filter(booking -> booking.getServices().stream().allMatch(service -> {
                        String category = service.getCategory();
                        return "STI_HIV".equals(category) ||
                                "STI_Syphilis".equals(category) ||
                                "STI_Gonorrhea".equals(category) ||
                                "STI_Chlamydia".equals(category);
                    }))
                    .map(this::convertToDTO)
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "content", filtered,
                    "page", allBookingsPage.getNumber(),
                    "size", allBookingsPage.getSize(),
                    "totalElements", allBookingsPage.getTotalElements(),
                    "totalPages", allBookingsPage.getTotalPages()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách lịch hẹn STI"));
        }
    }



    @GetMapping("/sti/{bookingId}/test-results")
    public ResponseEntity<?> getStiTestResults(@PathVariable Long bookingId,
                                               @AuthenticationPrincipal UserPrincipal user) {
        try {
            Booking booking = bookingService.findBookingById(bookingId);

            // ✅ Chỉ cho phép nếu là chủ booking hoặc admin (nếu có role)
            if (!booking.getCustomer().getCustomerId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Không có quyền xem kết quả xét nghiệm này"));
            }

            List<TestResultDTO> testResults = booking.getTestResults().stream()
                    .map(this::convertToTestResultDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("bookingId", bookingId, "testResults", testResults));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        }
    }


    @GetMapping("/sti/test-result/{bookingId}/report")
    @Operation(summary = "Get test result report for an STI booking")
    public ResponseEntity<byte[]> getTestResultReport(@PathVariable Long bookingId,
                                                      @RequestParam ReportFormat format, @AuthenticationPrincipal UserPrincipal user) {
        try {
            byte[] report = bookingService.generateTestResultReport(bookingId, format);
            HttpHeaders headers = new HttpHeaders();
            String fileName = "test_result_" + bookingId + "." + format.name().toLowerCase();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileName);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(report);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @PatchMapping("/sti/{bookingId}/test-status")
    @Operation(summary = "Update test status for an STI booking")
    public ResponseEntity<?> updateTestStatus(@PathVariable Long bookingId,
                                              @RequestParam Long testResultId,
                                              @RequestParam TestStatus status,
                                              @RequestParam(required = false) String notes) {
        try {
            TestResult updatedResult = bookingService.updateTestStatus(bookingId, testResultId, status, notes);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Test status updated successfully",
                            "testResult", convertToTestResultDTO(updatedResult)
                    ));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    @PatchMapping("/confirm-payment")
    @Operation(summary = "Confirm payment for a booking (consultation or test)")
    public ResponseEntity<?> confirmPayment(@RequestParam String paymentCode) {
        try {
            Booking booking = bookingService.confirmPayment(paymentCode);
            BookingDTO response = convertToDTO(booking);
            return ResponseEntity.ok(Map.of(
                    "message", "Payment confirmed successfully",
                    "booking", response
            ));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    @PatchMapping("/cancel")
    @Operation(summary = "Cancel a booking by payment code")
    public ResponseEntity<?> cancelBooking(@RequestParam String paymentCode) {
        try {
            Booking booking = bookingService.cancelBooking(paymentCode);
            BookingDTO response = convertToDTO(booking);
            return ResponseEntity.ok(Map.of(
                    "message", "Booking canceled successfully",
                    "booking", response
            ));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());

        if (booking.getCustomer() != null) {
            dto.setUserId(
                    booking.getCustomer().getCustomer() != null
                            ? booking.getCustomer().getCustomerId()
                            : null
            );
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCustomerAge(booking.getCustomer().getAge());
            dto.setCustomerGender(booking.getCustomer().getGender());
        }

        if (booking.getStaff() != null && booking.getStaff().getStaff() != null) {
            dto.setStaffId(booking.getStaff().getId());
            dto.setStaffName(booking.getStaff().getStaff().getName());
        }

        if (booking.getConsultant() != null && booking.getConsultant().getConsultant() != null) {
            dto.setConsultantId(booking.getConsultant().getId());
            dto.setConsultantName(booking.getConsultant().getConsultant().getName()); // 👈 Thêm dòng này
        }


        dto.setBookingDate(booking.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        dto.setPaymentCode(booking.getPaymentCode());
        if (booking.getServices() != null && !booking.getServices().isEmpty()) {
            List<Long> serviceIds = booking.getServices().stream()
                    .map(Services::getServiceId)
                    .toList();
            dto.setServiceIds(serviceIds);
        }

        if (booking.getServices() != null && !booking.getServices().isEmpty()) {

            dto.setServiceIds(
                    booking.getServices().stream()
                            .map(Services::getServiceId)
                            .toList()
            );


            dto.setServiceName(
                    booking.getServices().stream()
                            .map(Services::getServiceName)
                            .collect(Collectors.joining(", "))
            );


            int totalAmount = booking.getServices().stream()
                    .map(Services::getPrice)
                    .mapToInt(BigDecimal::intValue)
                    .sum();
            dto.setAmount(totalAmount);

            dto.setCategoryType(
                    booking.getServices().stream()
                            .findFirst()
                            .map(service -> service.getCategoryType().name())
                            .orElse(null)
            );
        }

        ServiceCategoryType categoryType = booking.getServices().stream()
                .findFirst()
                .map(Services::getCategoryType)
                .orElse(null);

        dto.setCategoryType(categoryType != null ? categoryType.name() : null);

        if (categoryType == ServiceCategoryType.CONSULTATION && booking.getConsultation() != null) {
            dto.setConsultationStatus(booking.getConsultation().getStatus());
            dto.setNote(booking.getConsultation().getNote());


            dto.setFeedback(booking.getConsultation().getFeedback());
            dto.setRating(booking.getConsultation().getRating());
        }
        else if (categoryType == ServiceCategoryType.TEST && booking.getTestResults() != null && !booking.getTestResults().isEmpty()) {
            TestResult firstResult = booking.getTestResults().iterator().next();
            dto.setTestStatus(firstResult.getStatus());
            dto.setNote(firstResult.getNotes());
        }

        if (booking.getConsultation() != null) {
            dto.setConsultationId(booking.getConsultation().getConsultationId());
            dto.setConsultationStatus(booking.getConsultation().getStatus());
            dto.setNote(booking.getConsultation().getNote());
        }

        if (booking.getTestResults() != null && !booking.getTestResults().isEmpty()) {
            TestResult firstResult = booking.getTestResults().iterator().next();
            dto.setTestResultId(firstResult.getTestResultId());
            dto.setTestStatus(firstResult.getStatus());
            dto.setNote(firstResult.getNotes());
        }

        return dto;
    }

    @GetMapping("/{bookingId}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<?> getBookingById(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        try {
            Booking booking = bookingService.findBookingById(bookingId);


            if (!booking.getCustomer().getCustomerId().equals(user.getId()) &&
                    user.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Bạn không có quyền xem booking này"));
            }

            BookingDTO response = convertToDTO(booking);
            return ResponseEntity.ok(response);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            e.printStackTrace(); // để debug dễ hơn
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy booking: " + e.getMessage()));
        }
    }


    private TestResultDTO convertToTestResultDTO(TestResult testResult) {
        TestResultDTO dto = new TestResultDTO();
        dto.setTestResultId(testResult.getTestResultId());
        dto.setBookingId(testResult.getBooking().getBookingId());
        dto.setTestName(testResult.getTestName());
        dto.setResult(testResult.getResult());
        dto.setStatus(testResult.getStatus());
        dto.setGeneratedAt(testResult.getGeneratedAt());
        dto.setScheduledTime(testResult.getScheduledTime());
        dto.setEstimatedCompletionTime(testResult.getEstimatedCompletionTime());
        dto.setTimeSlot(testResult.getBooking().getTimeSlot());
        dto.setCurrentPhase(testResult.getCurrentPhase());
        dto.setProgressPercentage(testResult.getProgressPercentage());
        dto.setLastUpdated(testResult.getLastUpdated());
        dto.setNotes(testResult.getNotes());
        dto.setFormat(testResult.getFormat());

        CustomerDetails customer = testResult.getBooking().getCustomer();
        if (customer != null) {
            dto.setCustomerName(customer.getFullName());
            dto.setCustomerAge(customer.getAge());
            dto.setCustomerGender(customer.getGender());
            dto.setCustomerPhone(customer.getPhoneNumber());
            dto.setCustomerEmail(customer.getEmail());
        }

        StaffDetails staffDetails = testResult.getBooking().getStaff();
        if (staffDetails != null) {
            User staffUser = staffDetails.getStaff();
            if (staffUser != null) {
                dto.setStaffName(staffUser.getName());
            }

            if (staffDetails.getSpecialization() != null) {
                dto.setStaffSpecialty(staffDetails.getSpecialization());
            }
        }

        if (!testResult.getBooking().getServices().isEmpty()) {
            Services service = testResult.getBooking().getServices().iterator().next();
            dto.setServiceCategory(service.getCategory());
        }

        return dto;
    }

    @GetMapping("/profile")
    public UserInfoDTO getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId(); // 👈 Lấy từ UserPrincipal

        User user = userService.findById(userId).orElseThrow();
        CustomerDetails details = customUserDetailsService.findByCustomer(user).orElse(null);

        return (details == null) ? new UserInfoDTO() : UserMapper.fromEntity(details);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                           @RequestBody UserInfoDTO dto) {
        Long userId = userPrincipal.getId();
        customUserDetailsService.updateCustomerDetails(userId, dto);
        return ResponseEntity.ok("Cập nhật thành công");
    }

    @GetMapping("/history")
    public ResponseEntity<Page<BookingDTO>> getBookingHistory(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String type) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Booking> bookingPage = bookingService.getUserBookings(user.getId(), pageable, type);

        Page<BookingDTO> dtoPage = bookingPage.map(this::convertToDTO);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/user/sti-count")
    @Operation(summary = "Đếm tổng số booking xét nghiệm STI của người dùng hiện tại")
    public ResponseEntity<?> getTotalStiBookings(
            @AuthenticationPrincipal UserPrincipal user) {
        try {
            long total = bookingService.countStiBookingsByUserId(user.getId());
            return ResponseEntity.ok(Map.of("total", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể đếm lịch xét nghiệm"));
        }
    }

    @GetMapping("/api/services/sti-tests")
    public ResponseEntity<List<ServiceDTO>> getAvailableStiTests() {
        List<ServiceDTO> services = serviceService.getAvailableStiTests();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/api/services/consultations")
    public ResponseEntity<List<ServiceDTO>> getAvailableConsultations() {
        List<ServiceDTO> services = serviceService.getAvailableConsultations();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/test-services")
    public ResponseEntity<?> getTestServices() {
        return ResponseEntity.ok(serviceService.getTestServicesForSTI());
    }


}