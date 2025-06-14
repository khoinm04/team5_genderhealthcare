package com.ghsms.model;

import com.ghsms.file_enum.ReportFormat;
import com.ghsms.file_enum.TestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Getter
@Setter
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TestResultID")
    private Long testResultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BookingID")
    private Booking booking;

    @Column(name = "TestName", nullable = false)
    private String testName;

    @Column(name = "Result")
    private String result;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private TestStatus status;

    @Column(name = "GeneratedAt")
    private LocalDateTime generatedAt;

    @Column(name = "ScheduledTime")
    private LocalDateTime scheduledTime;

    @Column(name = "EstimatedCompletionTime")
    private LocalDateTime estimatedCompletionTime;

    @Column(name = "CurrentPhase")
    private String currentPhase;

    @Column(name = "ProgressPercentage")
    private Integer progressPercentage;

    @Column(name = "LastUpdated")
    private LocalDateTime lastUpdated;

    @Column(name = "Notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "Format")
    private ReportFormat format; // For file download type (PDF/EXCEL)

    @Lob
    @Column(name = "FileContent")
    private byte[] fileContent; // Store generated file content
}