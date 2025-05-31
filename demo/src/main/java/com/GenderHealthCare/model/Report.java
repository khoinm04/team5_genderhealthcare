package com.GenderHealthCare.model;

import com.GenderHealthCare.enums.ReportFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReportID")
    private Long reportId;

    @NotBlank(message = "Loại báo cáo không được để trống")
    @Size(max = 50, message = "Báo cáo nên ít hơn 50 ký tự")
    @Column(name = "ReportType", length = 50)
    private String reportType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GeneratedBy", nullable = false)
    private User generatedBy;

    @Builder.Default
    @Column(name = "GeneratedAt", nullable = false, updatable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Size(max = 10, message = "lỗi định dạng báo cáo")
    @Column(name = "ExportFormat", length = 10)
    private ReportFormat exportFormat;
}
