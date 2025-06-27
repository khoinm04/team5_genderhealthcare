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

    // Additional fields for better tracking
    private String customerName;
    private String serviceCategory;
    private LocalDateTime estimatedCollectionTime;
    private LocalDateTime estimatedProcessingTime;

    //staff information
    private String staffName;
    private String staffSpecialty;


    // Optional: For showing time remaining
    public Long getEstimatedMinutesRemaining() {
        if (status == TestStatus.COMPLETED || status == TestStatus.CANCELED) {
            return 0L;
        }
        if (estimatedCompletionTime == null) {
            return null;
        }
        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(now, estimatedCompletionTime).toMinutes();
    }

    // Optional: For showing progress phase description
    public String getPhaseDescription() {
        if (status == TestStatus.CANCELED) {
            return "Test canceled";
        }
        return switch (currentPhase) {
            case "Scheduled" -> "Waiting for appointment";
            case "Collection" -> "Sample collection in progress";
            case "Processing" -> "Laboratory processing";
            case "Review" -> "Results under review";
            case "Completed" -> "Test completed";
            default -> currentPhase;
        };
    }
}