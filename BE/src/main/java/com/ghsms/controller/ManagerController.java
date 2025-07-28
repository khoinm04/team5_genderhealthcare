package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.ConsultantDetails;
import com.ghsms.model.Services;
import com.ghsms.model.StaffDetails;
import com.ghsms.model.User;
import com.ghsms.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final BookingService bookingService;
    private final ServiceService serviceService;
    private final ConsultantDetailsService consultantDetailsService;

    @GetMapping("/staffs")
    public ResponseEntity<Page<StaffResponseDto>> getPagedStaffs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> staffUsers = userService.findByRoleName(RoleName.ROLE_STAFF, pageable);

        Page<StaffResponseDto> result = staffUsers.map(user -> {
            StaffDetails details = staffDetailsService.getById(user.getUserId()).orElse(null);
            return StaffResponseDto.from(user, details);
        });

        return ResponseEntity.ok(result);
    }


    @PutMapping("/staffs/full")
    public ResponseEntity<?> updateStaffDetails(@RequestBody StaffUpdateRequestDto request) {
        staffDetailsService.updateStaffAndUser(request);
        return ResponseEntity.ok("Cập nhật thông tin nhân viên thành công");
    }


    @PutMapping("/bookings/{bookingId}/assign-staff")
    public ResponseEntity<?> assignStaffToBooking(
            @PathVariable Long bookingId,
            @RequestParam Long staffId
    ) {
        bookingService.assignStaffToBooking(bookingId, staffId);
        return ResponseEntity.ok("Đã gán nhân viên thành công");
    }

    @GetMapping("/page/bookings")
    public ResponseEntity<Page<BookingDTO>> getPagedBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<BookingDTO> result = bookingService.getPagedBookingsForManager(page, size);
        return ResponseEntity.ok(result);
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

    @GetMapping("/consultants")
    public ResponseEntity<Page<ConsultantResponseDto>> getPagedConsultants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> consultantUsers = userService.findByRoleName(RoleName.ROLE_CONSULTANT, pageable);

        Page<ConsultantResponseDto> result = consultantUsers.map(user -> {
            ConsultantDetails details = consultantDetailsService.getByUserId(user.getUserId()).orElse(null);
            return ConsultantResponseDto.from(user, details);
        });

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

    @GetMapping("/page/services")
    public ResponseEntity<Page<ServiceResponseDTO>> getPagedServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ServiceResponseDTO> services = serviceService.getAllServicesForManager(page, size);
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

    @GetMapping("/total-services")
    public ResponseEntity<Map<String, Object>> getTotalServices() {
        long count = serviceService.countServiceActiveTrue();
        Map<String, Object> result = new HashMap<>();
        result.put("totalServices", count);
        result.put("serviceChange", "+0 từ tháng trước");
        return ResponseEntity.ok(result);
    }


    @PostMapping("/create")
    public ResponseEntity<Services> createService(@RequestBody CreateServiceRequest request) {
        Services created = serviceService.createService(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/services/{id}/deactivate")
    public ResponseEntity<?> deactivateService(@PathVariable("id") Long id) {
        serviceService.deactivateService(id);
        return ResponseEntity.ok("Dịch vụ đã được ngừng.");
    }

    @PutMapping("/services/{id}/reactivate")
    public ResponseEntity<?> reactivateService(@PathVariable("id") Long id) {
        serviceService.reactivateService(id);
        return ResponseEntity.ok("Dịch vụ đã được kích hoạt lại.");
    }

    @GetMapping("/consultation")
    public ResponseEntity<List<SimpleServiceDTO>> getConsultationServices() {
        List<SimpleServiceDTO> services = serviceService.getConsultationServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/test")
    public ResponseEntity<List<SimpleServiceDTO>> getTestServices() {
        List<SimpleServiceDTO> services = serviceService.getTestServices();
        return ResponseEntity.ok(services);
    }

}
