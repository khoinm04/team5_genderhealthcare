package com.ghsms.file_enum;

public enum CertificateStatus {
    PENDING,    // Đã gửi lên, đang chờ duyệt
    APPROVED,   // Được duyệt và công nhận
    REJECTED    // Bị từ chối (không hợp lệ, thiếu thông tin...)
}
