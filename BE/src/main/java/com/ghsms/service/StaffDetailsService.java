package com.ghsms.service;

import com.ghsms.DTO.StaffUpdateRequestDto;
import com.ghsms.model.StaffDetails;
import com.ghsms.model.User;
import com.ghsms.repository.StaffDetailsRepository;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffDetailsService {
    private final StaffDetailsRepository staffDetailsRepository;
    private final UserRepository userRepository;

    public List<StaffDetails> getAllStaff() {
        return staffDetailsRepository.findAll();
    }

    public Optional<StaffDetails> getById(Long staffId) {
        return staffDetailsRepository.findById(staffId);
    }

    @Transactional
    public void updateStaffAndUser(StaffUpdateRequestDto dto) {
        User user = userRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        StaffDetails details = staffDetailsRepository.findById(dto.getStaffId())
                .orElse(null);

        if (details == null) {
            details = new StaffDetails();
            details.setStaff(user);
        }

        details.setSpecialization(dto.getSpecialization());
        details.setHireDate(dto.getHireDate());

        staffDetailsRepository.save(details);
    }

}
