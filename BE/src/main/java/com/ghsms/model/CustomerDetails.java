package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Table(name="CustomerDetails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Long customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Uses the ID of the User entity as the ID for ConsultantDetails
    @JoinColumn(name = "CustomerID") // This is the FK column in ConsultantDetails table that references Users.UserID
    private User customer;

    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Size(max = 100, message = "tên nên ít hơn 100 ký tự")
    @Column(name = "fullName",columnDefinition = "nvarchar(100)")
    private String fullName;

    @Column(name = "phoneNumber",nullable = false, unique = true, length = 100)
    private String phoneNumber;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Gender", length = 20)
    private String gender; // Có thể là "MALE", "FEMALE", "OTHER"


    @NotBlank(message = "Email không được để trống")
    @Email(message = "email không hợp lệ")
    @Size(max = 100, message = "email nên ít hơn 100 ký tự")
    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private Set<Booking> bookings;
}
