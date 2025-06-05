package com.GenderHealthCare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "StaffDetails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StaffDetails implements Serializable {

    @Id
    // This ID will be the same as the User's ID due to @MapsId on the 'user' field.
    // The column name in the DB is StaffID.
    @Column(name = "StaffID")
    private Long staffId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Uses the ID of the User entity as the ID for StaffDetails
    @JoinColumn(name = "StaffID") // This is the FK column in StaffDetails table that references Users.UserID
    private User user;

    @Size(max = 50, message = "Vi trí phải ít hơn 50 ký tự")
    @Column(name = "Position", length = 50)
    private String position;

    @Size(max = 100, message = "Phòng ban phải ít hơn 100 ký tự")
    @Column(name = "Department", length = 100)
    private String department;

    @Column(name = "HireDate")
    private LocalDate hireDate;
}
