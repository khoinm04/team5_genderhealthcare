package com.ghsms.DTO;

import com.ghsms.file_enum.TestStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookingUpdateRequestDTO {
    private Long bookingId;

    // Thông tin khách hàng
    private String customerName;
    private String customerPhone;

    // Dịch vụ
    private List<Long> serviceIds;

    // Trạng thái từng xét nghiệm (test result)
    private List<TestResultUpdate> testResultUpdates;

    @Getter @Setter
    public static class TestResultUpdate {
        private Long testResultId;
        private TestStatus status;
        private String testName; // ✅ bạn đã có chưa?
    }

}
