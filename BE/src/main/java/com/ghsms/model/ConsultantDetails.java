

package com.ghsms.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ghsms.file_enum.ConsultantSpecialization;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "consultant_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantDetails implements Serializable {

    @Id
    @Column(name = "consultant_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "consultant_id")
    private User consultant;

    @OneToMany(mappedBy = "consultant", fetch = FetchType.LAZY)
    private Set<Booking> bookings;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialization", length = 100)
    private ConsultantSpecialization specialization;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(columnDefinition = "nvarchar(100)")
    @OneToMany(mappedBy = "consultant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Certificate> certificates = new HashSet<>();
}
