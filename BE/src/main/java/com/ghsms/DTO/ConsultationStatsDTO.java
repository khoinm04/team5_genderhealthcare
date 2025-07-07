package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationStatsDTO {

    private int totalSessions;       // ✅ Tổng số phiên đã diễn ra
    private long totalMinutes;       // ✅ Tổng số phút đã tư vấn
    private double averageMinutes;   // ✅ Thời lượng trung bình mỗi phiên (phút, có thể làm tròn)

    // Optional: nếu bạn muốn hiển thị đẹp
    public String getFormattedAverage() {
        return String.format("%.1f phút", averageMinutes);
    }
}

