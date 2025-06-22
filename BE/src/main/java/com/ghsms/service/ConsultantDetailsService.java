package com.ghsms.service;

import com.ghsms.DTO.ConsultantUpdateRequestDto;
import com.ghsms.model.ConsultantDetails;
import com.ghsms.model.User;
import com.ghsms.repository.ConsultantDetailsRepository;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ConsultantDetailsService {

    private final ConsultantDetailsRepository consultantDetailsRepository;
    private final UserRepository userRepository;

    public List<ConsultantDetails> getAllConsultants() {
        return consultantDetailsRepository.findAll();
    }

    public Optional<ConsultantDetails> getById(Long consultantId) {
        return consultantDetailsRepository.findById(consultantId);
    }

    public void updateConsultantAndUser(ConsultantUpdateRequestDto dto) {
        User user = userRepository.findById(dto.getConsultantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        ConsultantDetails details = consultantDetailsRepository.findById(dto.getConsultantId())
                .orElse(null);

        if (details == null) {
            details = new ConsultantDetails();
            details.setConsultant(user); // dùng @MapsId nên không cần set id
        }

        details.setSpecialization(dto.getSpecialization()); // hoặc dto.getSpecialization().toString()
        details.setHireDate(dto.getHireDate());
        details.setYearsOfExperience(dto.getYearsOfExperience());

        consultantDetailsRepository.save(details);
    }

    public void deleteById(Long consultantId) {
        consultantDetailsRepository.deleteById(consultantId);
    }
}
