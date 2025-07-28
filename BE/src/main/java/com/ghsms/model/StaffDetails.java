package com.ghsms.model;

import jakarta.persistence.*;
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
    @MapsId
    @JoinColumn(name = "StaffId")
    private User staff;

    @Id
    @Column(name = "StaffId")
    private Long id;

    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY)
    private Set<Booking> bookings;

    @Column(name = "Specialization", columnDefinition = "nvarchar(100)")
    private String specialization;

    @Column(name = "HireDate")
    private LocalDate hireDate;
}
