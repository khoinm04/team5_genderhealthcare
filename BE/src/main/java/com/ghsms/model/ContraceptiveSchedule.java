package com.ghsms.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalTime;
import java.time.LocalDate;

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
    private boolean isActive = true; // Để dừng nhắc nhở khi người dùng không còn dùng nữa

    @Column(name = "BreakUntil")
    private LocalDate breakUntil; // null nếu không nghỉ, hoặc ngày kết thúc kỳ nghỉ nếu vỉ 21
}
