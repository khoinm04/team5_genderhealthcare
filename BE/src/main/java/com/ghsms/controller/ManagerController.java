package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.ConsultantDetails;
import com.ghsms.model.Services;
import com.ghsms.model.StaffDetails;
import com.ghsms.model.User;
import com.ghsms.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
@RequiredArgsConstructor
public class ManagerController {

    private final UserService userService;
    private final StaffDetailsService staffDetailsService;
    private final BookingService bookingService; // Assuming you have a BookingService for booking-related operations
    private final ServiceService serviceService; // Assuming you have a ServiceService for service-related operations
    private final ConsultantDetailsService consultantDetailsService;

    @GetMapping("/staffs")
    public ResponseEntity<List<StaffResponseDto>> getAllStaffs() {
        List<User> staffs = userService.findByRoleName(RoleName.ROLE_STAFF);

        List<StaffResponseDto> result = staffs.stream()
                .map(user -> {
                    StaffDetails details = staffDetailsService.getById(user.getUserId()).orElse(null);
                    return StaffResponseDto.from(user, details);
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @PutMapping("/staffs/full")
    public ResponseEntity<?> updateStaffDetails(@RequestBody StaffUpdateRequestDto request) {
        staffDetailsService.updateStaffAndUser(request);
        return ResponseEntity.ok("Cập nhật thông tin nhân viên thành công");
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = bookingService.getAllBookingsForManager();
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{bookingId}/assign-staff")
    public ResponseEntity<?> assignStaffToBooking(
            @PathVariable Long bookingId,
            @RequestParam Long staffId
    ) {
        bookingService.assignStaffToBooking(bookingId, staffId);
        return ResponseEntity.ok("Đã gán nhân viên thành công");
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

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Thiếu trường 'status'");
        }

        try {
            bookingService.updateStatus(id, newStatus);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ: " + newStatus);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingDTO dto
    ) {
        bookingService.updateBookingFromDTO(id, dto);
        return ResponseEntity.ok("Cập nhật lịch hẹn thành công");
    }

    @GetMapping("/total-staff")
    public ResponseEntity<?> getTotalStaff() {
        long totalStaff = userService.countByRoleName(RoleName.ROLE_STAFF);

        Map<String, Object> response = new HashMap<>();
        response.put("totalStaff", totalStaff);
        response.put("staffChange", "+2 từ tháng trước"); // giả lập

        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming-schedules")
    public ResponseEntity<?> getUpcomingSchedules() {
        List<BookingDTO> schedules = bookingService.getUpcomingSchedules();
        return ResponseEntity.ok(schedules);
    }
//======================Consultant========================
    @GetMapping("/consultants")
    public ResponseEntity<List<ConsultantResponseDto>> getAllConsultants() {
        List<User> staffs = userService.findByRoleName(RoleName.ROLE_CONSULTANT);

        List<ConsultantResponseDto> result = staffs.stream()
                .map(user -> {
                    ConsultantDetails details = consultantDetailsService.getById(user.getUserId()).orElse(null);
                    return ConsultantResponseDto.from(user, details);
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @PutMapping("/consultants/full")
    public ResponseEntity<?> updateConsultantDetails(@RequestBody ConsultantUpdateRequestDto request) {
        consultantDetailsService.updateConsultantAndUser(request);
        return ResponseEntity.ok("Cập nhật thông tin nhân viên thành công");
    }

    @PutMapping("/bookings/{bookingId}/assign-consultant")
    public ResponseEntity<?> assignConsultantToBooking(
            @PathVariable Long bookingId,
            @RequestParam Long consultantId
    ) {
        bookingService.assignConsultantToBooking(bookingId, consultantId);
        return ResponseEntity.ok("Đã gán tư vấn viên thành công");
    }

    //=======================Services========================
    @GetMapping("/services/manager")
    public ResponseEntity<List<ServiceResponseDTO>> getAllService() {
        List<ServiceResponseDTO> services = serviceService.getAllServicesForManager();
        return ResponseEntity.ok(services);
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestBody ServiceUpdateDTO dto) {
        serviceService.updateService(id, dto);
        return ResponseEntity.ok().body(Map.of("message", "Cập nhật dịch vụ thành công"));
    }

    @GetMapping("/total-consultants")
    public ResponseEntity<?> getTotalConsultant() {
        long totalConsultant = userService.countByRoleName(RoleName.ROLE_CONSULTANT);

        Map<String, Object> response = new HashMap<>();
        response.put("totalConsultant", totalConsultant);
        response.put("consultantChange", "+2 từ tháng trước"); // giả lập

        return ResponseEntity.ok(response);
    }

}
