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
    @Column(name = "CustomerID")
    private Long customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "CustomerID")
    private User customer;

    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Size(max = 100, message = "tên nên ít hơn 100 ký tự")
    @Column(name = "fullName",columnDefinition = "nvarchar(100)")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Column(name = "phoneNumber",nullable = false, length = 100)
    private String phoneNumber;

    @Column(name = "Age")
    private Integer age;

    @NotBlank(message = "Tuổi không được để trống")
    @Column(name = "Gender", length = 20)
    private String gender;


    @NotBlank(message = "Email không được để trống")
    @Email(message = "email không hợp lệ")
    @Size(max = 100, message = "email nên ít hơn 100 ký tự")
    @Column(name = "Email", nullable = false, length = 100)
    private String email;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<Booking> bookings;
}
