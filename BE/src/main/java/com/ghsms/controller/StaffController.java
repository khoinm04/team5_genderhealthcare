package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.config.UserPrincipal;
import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Booking;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.Services;
import com.ghsms.model.TestResult;
import com.ghsms.service.*;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")  // base path cho staff
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")  // Chỉ cho phép người dùng có vai trò STAFF truy cập
public class StaffController {

    private final BookingService bookingService;
    private final TestResultService testResultService;
    private final ServiceService serviceService;
    private final ConsultantDetailsService consultantDetailsService;

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(@AuthenticationPrincipal UserPrincipal user) {
        Long staffUserId = user.getId();
        return ResponseEntity.ok(bookingService.getBookingsByStaffUserId(staffUserId));
    }

    @PutMapping("/bookings/update")
    public ResponseEntity<?> updateBookingFromStaff(@RequestBody BookingUpdateRequestDTO req) {
        bookingService.updateByStaff(req);
        return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
    }

    @GetMapping("/count-in-progress")
    public ResponseEntity<Long> getInProgressPatientCount() {
        long count = testResultService.countInProgressPatients();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        try {
            return ResponseEntity.ok(serviceService.getAllServices());
        } catch (Exception e) {
            e.printStackTrace(); // 👈 sẽ thấy rõ lỗi ở console
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }


    //dung để tạo booking cho STI (xét nghiệm lây nhiễm qua đường tình dục)
    @PostMapping("/create/sti")
    @Operation(summary = "Create a new STI booking")
    public ResponseEntity<?> createStiBooking(@Valid @RequestBody BookingDTO bookingDTO,
                                              @AuthenticationPrincipal UserPrincipal user) {
        try {
            //  Gán userId từ JWT
            if (user.getUser().getRole().getName() == RoleName.ROLE_CUSTOMER) {
                bookingDTO.setUserId(user.getId());
            }



            Booking booking = bookingService.createStiBooking(bookingDTO);
            BookingDTO response = convertToDTO(booking);
            List<TestResultDTO> testResults = booking.getTestResults().stream()
                    .map(this::convertToTestResultDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "STI booking created successfully",
                            "booking", response,
                            "testResults", testResults
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
        if (booking.getCustomer() != null) {
            dto.setUserId(
                    booking.getCustomer().getCustomer() != null
                            ? booking.getCustomer().getCustomerId()
                            : null
            );
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
            dto.setCustomerEmail(booking.getCustomer().getEmail());  // Thêm nếu cần
            dto.setCustomerAge(booking.getCustomer().getAge());      // Tuổi
            dto.setCustomerGender(booking.getCustomer().getGender()); // Giới tính
        }

        // Fix staff related fields
        if (booking.getStaff() != null && booking.getStaff().getStaff() != null) {
            dto.setStaffId(booking.getStaff().getId());
        }

        dto.setBookingDate(booking.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        dto.setStatus(booking.getStatus());

        // Map services
        if (booking.getServices() != null && !booking.getServices().isEmpty()) {
            List<Long> serviceIds = booking.getServices().stream()
                    .map(Services::getServiceId)
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

        // ✅ Thêm đầy đủ thông tin khách hàng
        CustomerDetails customer = testResult.getBooking().getCustomer();
        if (customer != null) {
            dto.setCustomerName(customer.getFullName());
            dto.setCustomerAge(customer.getAge());
            dto.setCustomerGender(customer.getGender());
            dto.setCustomerPhone(customer.getPhoneNumber());
            dto.setCustomerEmail(customer.getEmail());
        }

        // ✅ Thêm thông tin dịch vụ
        if (!testResult.getBooking().getServices().isEmpty()) {
            Services service = testResult.getBooking().getServices().iterator().next();
            dto.setServiceCategory(service.getCategory().name());
        }

        return dto;
    }

    @PutMapping("/{id}/update-result")
    public ResponseEntity<?> updateResult(@PathVariable("id") Long testResultId,
                                          @Valid @RequestBody TestResultDTO dto,
                                          @AuthenticationPrincipal UserPrincipal user) {
        try {
            Long staffId = user.getId(); // Lấy từ JWT nếu cần log kiểm tra

            TestResult updated = testResultService.updateResult(testResultId, dto, staffId);

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật kết quả thành công",
                    "testResult", updated
            ));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống"));
        }
    }

    //lay thông tin lich hen tư vấn viên cho staff thay
    @GetMapping("/bookings/consulting")
    public ResponseEntity<List<BookingDTO>> getAllConsultingBookings() {
        List<BookingDTO> bookings = consultantDetailsService.getAllConsultingBookings();
        return ResponseEntity.ok(bookings);
    }

    // API gán tư vấn viên duoc thuc hien boi nhan vien
    @PutMapping("/bookings/{bookingId}")
    public ResponseEntity<?> updateConsultationBooking(
            @PathVariable Long bookingId,
            @RequestBody ConsultationBookingUpdateRequest request
    ) {
        consultantDetailsService.updateConsultationBooking(bookingId, request);
        return ResponseEntity.ok("✅ Lịch hẹn đã được cập nhật");
    }

    @GetMapping("/consultants/by-service/{serviceId}")
    public ResponseEntity<?> getConsultantsByService(@PathVariable Long serviceId) {
        List<ConsultantDetailsDTO> consultants =
                consultantDetailsService.findActiveConsultantsByServiceId(serviceId);
        return ResponseEntity.ok(consultants);
    }

    @PostMapping("/create/bookings/consultant")
    public ResponseEntity<?> createConsultationBooking(@RequestBody ConsultationBookingCreateRequest req) {
        Long newBookingId = consultantDetailsService.createConsultationBooking(req);
        return ResponseEntity.ok(Map.of("bookingId", newBookingId));
    }

    //dung de update status thanh toan chung
    @PutMapping("/bookings/update-status")
    public ResponseEntity<?> updateBookingStatusByStaff(@RequestBody StaffUpdateStatusDTO dto) {
        try {
            BookingStatus status = BookingStatus.valueOf(dto.getStatus());
            bookingService.updateStatusByStaff(dto.getBookingId(), status);
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái booking thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Trạng thái không hợp lệ"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



}
