package com.ghsms.service;

import com.ghsms.DTO.*;
import com.ghsms.exceptions.ResourceNotFoundException;
import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.Services;
import com.ghsms.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public Page<ServiceResponseDTO> getAllServicesForManager(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Services> servicePage = serviceRepository.findAll(pageable);

        List<ServiceResponseDTO> dtos = servicePage.getContent().stream().map(service -> {
            ServiceResponseDTO dto = new ServiceResponseDTO();
            dto.setServiceId(service.getServiceId());
            dto.setServiceName(service.getServiceName());
            dto.setCategory(service.getCategory());
            dto.setCategoryType(service.getCategoryType());
            dto.setDescription(service.getDescription());
            dto.setPrice(service.getPrice());
            dto.setDuration(service.getDuration());
            dto.setIsActive(service.isActive());
            return dto;
        }).toList();

        return new PageImpl<>(dtos, pageable, servicePage.getTotalElements());
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

    public long countServiceActiveTrue(){
        return serviceRepository.countByActiveTrue();
    }

    public Services createService(CreateServiceRequest request) {
        Services service = new Services();
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDuration(request.getDuration());
        service.setCategory(request.getCategory());
        service.setCategoryType(request.getCategoryType());
        service.setActive(request.getIsActive() != null ? request.getIsActive() : true);

        return serviceRepository.save(service);
    }

    public List<ServiceDTO> getAvailableStiTests() {
        return serviceRepository.findByCategoryTypeAndActive(ServiceCategoryType.TEST, true).stream()
                .map(service -> new ServiceDTO(
                        service.getServiceId(),
                        service.getServiceName(),
                        service.getDescription(),
                        service.getPrice(),
                        service.getDuration(),
                        service.getPreparation(),
                        service.getCategory() != null ? service.getCategory() : "UNKNOWN"
                ))
                .toList();
    }

    public List<ServiceDTO> getAvailableConsultations() {
        return serviceRepository.findByCategoryTypeAndActive(ServiceCategoryType.CONSULTATION, true).stream()
                .map(service -> new ServiceDTO(
                        service.getServiceId(),
                        service.getServiceName(),
                        service.getDescription(),
                        service.getPrice(),
                        service.getDuration(),
                        service.getPreparation(),
                        service.getCategory() != null ? service.getCategory() : "UNKNOWN"
                ))
                .toList();
    }


    public void deactivateService(Long serviceId) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        if (!service.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dịch vụ đã bị ngừng trước đó.");
        }

        service.setActive(false);
        serviceRepository.save(service);
    }

    public void reactivateService(Long serviceId) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        if (service.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dịch vụ đang hoạt động.");
        }

        service.setActive(true);
        serviceRepository.save(service);
    }

    public List<SimpleServiceDTO> getConsultationServices() {
        List<Services> services = serviceRepository.findByCategoryType(ServiceCategoryType.CONSULTATION);
        return services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public List<SimpleServiceDTO> getTestServices() {
        List<Services> services = serviceRepository.findByCategoryType(ServiceCategoryType.TEST);
        return services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private SimpleServiceDTO convertToDTO(Services service) {
        return new SimpleServiceDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getCategory().toString()
        );
    }

    private SimpleServicesDTO convertToDetailedDTO(Services service) {
        return new SimpleServicesDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getDescription(),
                service.getPrice(),
                service.getDuration(),
                service.getPreparation(),
                service.getCategory().toString()
        );
    }

    public List<SimpleServicesDTO> getTestServicesForSTI() {
        List<Services> services = serviceRepository.findByCategoryType(ServiceCategoryType.TEST);
        return services.stream()
                .map(this::convertToDetailedDTO)
                .collect(Collectors.toList());
    }

}

