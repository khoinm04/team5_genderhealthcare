package com.ghsms.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ContraceptiveSchedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ContraceptiveSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "Type", nullable = false) // "21" hoặc "28"
    private String type;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "PillTime", nullable = false)
    private LocalTime pillTime; // Giờ uống thuốc mỗi ngày

    @Column(name = "CurrentIndex", nullable = false)
    private int currentIndex; // Đánh dấu đã uống tới viên số mấy (0-20 hoặc 0-27)

    @Column(name = "IsActive", nullable = false)
    private boolean active = true; // Để dừng nhắc nhở khi người dùng không còn dùng nữa

    @Column(name = "BreakUntil")
    private LocalDate breakUntil; // null nếu không nghỉ, hoặc ngày kết thúc kỳ nghỉ nếu vỉ 21

    @Column(name = "TakenToday", nullable = false)
    private boolean takenToday = false; // Đã uống thuốc hôm nay chưa

    @Column(name = "MissedCount", nullable = false)
    private int missedCount = 0; // Số lần quên uống thuốc liên tiếp

    @Column(name = "LastCheckedDate")
    private LocalDate lastCheckedDate; // Ngày kiểm tra cuối cùng

    // ✅ THÊM MỚI: Danh sách những ngày quên uống thuốc
    @ElementCollection
    @CollectionTable(name = "MissedPillDates",
            joinColumns = @JoinColumn(name = "ScheduleID"))
    @Column(name = "MissedDate")
    private List<LocalDate> missedPillDates = new ArrayList<>(); // Danh sách ngày quên uống
}
