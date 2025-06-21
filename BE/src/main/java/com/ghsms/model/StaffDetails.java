package com.ghsms.model;

import com.ghsms.file_enum.StaffSpecialization;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "StaffDetails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffDetails implements Serializable {

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Dùng ID từ User
    @JoinColumn(name = "StaffId")
    private User staff;

    @Id
    @Column(name = "StaffId")
    private Long id; // Đây là bắt buộc nếu bạn muốn @Id ánh xạ vào FK — nhưng dùng `@MapsId` thì có thể bỏ luôn

    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY)
    private Set<Booking> bookings;

    @Enumerated(EnumType.STRING)
    @Column(name = "Specialization", nullable = false)
    private StaffSpecialization specialization;

    @Column(name = "HireDate")
    private LocalDate hireDate;
}
