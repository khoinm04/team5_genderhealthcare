package com.ghsms.DTO;

import com.ghsms.file_enum.ReportFormat;
import com.ghsms.file_enum.TestStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TestResultDTO implements Serializable {
    private Long testResultId;
    private Long bookingId;
    private String testName;
    private String result;
    private TestStatus status;
    private LocalDateTime generatedAt;
    private LocalDateTime scheduledTime;
    private LocalDateTime estimatedCompletionTime;
    private String currentPhase;
    private Integer progressPercentage;
    private LocalDateTime lastUpdated;
    private String notes;
    private ReportFormat format;
    private Integer customerAge;
    private String customerGender;
    private String customerPhone;
    private String customerEmail;

    private String timeSlot;

    private String customerName;
    private String serviceCategory;
    private LocalDateTime estimatedCollectionTime;
    private LocalDateTime estimatedProcessingTime;

    private String staffName;
    private String staffSpecialty;


}