package com.ghsms.file_enum;

import lombok.Getter;

@Getter
public enum ConsultationStatus {
    PENDING("Chờ xác nhận"),
    CONFIRMED("Đã xác nhận"),
    SCHEDULED("Đã lên lịch"),
    ONGOING("Đang tư vấn"),
    COMPLETED("Hoàn thành"),
    CANCELED("Đã hủy"),
    RESCHEDULED("Đã dời lịch");

    private final String description;

    ConsultationStatus(String description) {
        this.description = description;
    }


}
