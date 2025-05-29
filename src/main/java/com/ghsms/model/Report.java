package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReportID")
    private Integer reportId;

    @Size(max = 50, message = "Report type must be less than 50 characters")
    @Column(name = "ReportType", length = 50)
    private String reportType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GeneratedBy", nullable = false)
    private User generatedBy;

    @CreationTimestamp
    @Column(name = "GeneratedAt", nullable = false, updatable = false)
    private LocalDateTime generatedAt;

    @Size(max = 10, message = "Export format must be less than 10 characters")
    @Column(name = "ExportFormat", length = 10)
    private String exportFormat;
}

