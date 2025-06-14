package com.ghsms.model;

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

    // This ID will be the same as the User's ID due to @MapsId on the 'user' field.
    // The column name in the DB is StaffID.
    @Id
    @Column(name = "StaffID")
    private Long staffId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Uses the ID of the User entity as the ID for StaffDetails
    @JoinColumn(name = "StaffID") // This is the FK column in StaffDetails table that references Users.UserID
    private User staff;

    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY)
    private Set<Booking> bookings;

    @Size(max = 50, message = "Position must be less than 50 characters")
    @Column(name = "Position", columnDefinition = "nvarchar(100)")
    private String position;

    @Size(max = 100, message = "Department must be less than 100 characters")
    @Column(name = "Department", length = 100)
    private String department;

    @Column(name = "HireDate")
    private LocalDate hireDate;
}