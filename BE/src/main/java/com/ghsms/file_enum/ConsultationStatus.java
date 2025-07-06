package com.ghsms.file_enum;

public enum ConsultationStatus {
    PENDING("Chờ xác nhận"),           // Đang chờ staff assign consultant
    CONFIRMED("Đã xác nhận"),         // Staff đã assign consultant
    SCHEDULED("Đã lên lịch"),         // Đã sắp xếp thời gian cụ thể
    ONGOING("Đang tư vấn"),           // Đang trong quá trình tư vấn
    COMPLETED("Hoàn thành"),          // Đã hoàn thành buổi tư vấn
    CANCELED("Đã hủy"),               // Đã hủy lịch hẹn
    RESCHEDULED("Đã dời lịch");       // Đã thay đổi thời gian hẹn

    private final String description;

    ConsultationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }


}
