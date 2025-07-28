package com.ghsms.DTO;

import com.ghsms.file_enum.TestStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookingUpdateRequestDTO {
    private Long bookingId;


    private String customerName;
    private String customerPhone;


    private List<Long> serviceIds;


    private List<TestResultUpdate> testResultUpdates;

    @Getter @Setter
    public static class TestResultUpdate {
        private Long testResultId;
        private TestStatus status;
        private String testName;
    }

}
