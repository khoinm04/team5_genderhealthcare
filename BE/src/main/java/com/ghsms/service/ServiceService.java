package com.ghsms.service;

import com.ghsms.DTO.ServiceResponseDTO;
import com.ghsms.DTO.ServiceUpdateDTO;
import com.ghsms.exceptions.ResourceNotFoundException;
import com.ghsms.model.Services;
import com.ghsms.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<ServiceResponseDTO> getAllServicesForManager() {
        List<Services> services = serviceRepository.findAll();

        return services.stream().map(service -> {
            ServiceResponseDTO dto = new ServiceResponseDTO();
            dto.setServiceId(service.getServiceId());
            dto.setServiceName(service.getServiceName());
            dto.setCategory(service.getCategory());
            dto.setDescription(service.getDescription());
            dto.setPrice(service.getPrice());
            dto.setDuration(service.getDuration());
            dto.setIsActive(service.isActive());
            return dto;
        }).toList();
    }

    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }

    public void updateService(Long id, ServiceUpdateDTO dto) {
        Services service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        service.setServiceName(dto.getServiceName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setDuration(dto.getDuration());
        service.setCategory(dto.getCategory());
        service.setActive(dto.getIsActive());

        serviceRepository.save(service);
    }

    // dem tong so dich vu cho manager
    public long countServiceActiveTrue(){
        return serviceRepository.countByActiveTrue();
    }
}
