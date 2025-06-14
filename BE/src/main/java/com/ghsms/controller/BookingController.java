package com.ghsms.controller;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.DTO.TestResultDTO;
import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ReportFormat;
import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.file_enum.TestStatus;
import com.ghsms.model.Booking;
import com.ghsms.model.Service;
import com.ghsms.model.TestResult;
import com.ghsms.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.ghsms.config.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

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

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingDTO bookingDTO,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        try {
            // Gán userId từ token vào DTO thay vì nhận từ client
            bookingDTO.setUserId(user.getId());

            Booking booking = bookingService.createBooking(bookingDTO);
            BookingDTO response = convertToDTO(booking);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Booking created successfully",
                            "booking", response,
                            "paymentCode", booking.getPaymentCode()
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

            // 🔐 Kiểm tra quyền truy cập (nếu không phải chủ booking và không phải admin thì từ chối)
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
    @Operation(summary = "Get all bookings for a user")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get bookings by service category")
    public ResponseEntity<List<BookingDTO>> getBookingsByCategory(
            @PathVariable ServiceBookingCategory category,
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
            //  Gán userId từ JWT
            Long userId = user.getId();
            bookingDTO.setUserId(userId);


            Booking booking = bookingService.createStiBooking(bookingDTO);
            BookingDTO response = convertToDTO(booking);
            List<TestResultDTO> testResults = booking.getTestResults().stream()
                    .map(this::convertToTestResultDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "STI booking created successfully",
                            "booking", response,
                            "paymentCode", booking.getPaymentCode(),
                            "testResults", testResults
                    ));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
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
                                                      @RequestParam ReportFormat format) {
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

    @PostMapping("/sti/confirm-payment")
    @Operation(summary = "Confirm payment for an STI booking")
    public ResponseEntity<?> confirmStiPayment(@RequestParam String paymentCode) {
        try {
            Booking booking = bookingService.confirmStiPayment(paymentCode);
            BookingDTO response = convertToDTO(booking);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "STI payment confirmed successfully",
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

        // Fix customer related fields
        if (booking.getCustomer() != null && booking.getCustomer().getCustomer() != null) {
            dto.setUserId(booking.getCustomer().getCustomerId());
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
        }

        // Fix staff related fields
        if (booking.getStaff() != null && booking.getStaff().getStaff() != null) {
            dto.setStaffId(booking.getStaff().getStaffId());
        }

        dto.setBookingDate(booking.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        dto.setPaymentCode(booking.getPaymentCode());
        dto.setStatus(booking.getStatus());

        // Map services
        if (booking.getServices() != null && !booking.getServices().isEmpty()) {
            List<Long> serviceIds = booking.getServices().stream()
                    .map(Service::getServiceId)
                    .toList();
            dto.setServiceIds(serviceIds);
        }

        return dto;
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
        dto.setCurrentPhase(testResult.getCurrentPhase());
        dto.setProgressPercentage(testResult.getProgressPercentage());
        dto.setLastUpdated(testResult.getLastUpdated());
        dto.setNotes(testResult.getNotes());
        dto.setFormat(testResult.getFormat());

        // Additional tracking information
        if (testResult.getBooking().getCustomer() != null) {
            dto.setCustomerName(testResult.getBooking().getCustomer().getFullName());
        }
        if (!testResult.getBooking().getServices().isEmpty()) {
            Service service = testResult.getBooking().getServices().iterator().next();
            dto.setServiceCategory(service.getCategory().name());
        }

        return dto;
    }
}