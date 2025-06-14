package com.ghsms.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ghsms.file_enum.AuthProvider;
import com.ghsms.model.ConsultantDetails;
import com.ghsms.model.StaffDetails;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoleID",nullable = false)
    private Role role;

    @NotBlank(message = "Tên đầy đủ không được để trống")
    @Size(max = 100, message = "tên nên ít hơn 100 ký tự")
    @Column(name = "Name", columnDefinition = "nvarchar(100)")
    private String name;

    @Column(name = "ImageUrl", length = 255)
    private String imageUrl; // URL to user's profile image, can be null

    @NotBlank(message = "Email không được để trống")
    @Email(message = "email không hợp lệ")
    @Size(max = 100, message = "email nên ít hơn 100 ký tự")
    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "PasswordHash")
    @Size(min = 6, max = 255)
    private String passwordHash; // Validation depends on auth strategy

    @Column(name = "PhoneNumber", length = 20)
    @Pattern(regexp = "(84|0[3|5|7|8|9])+([0-9]{8})\\b", message = "số điện thoại không hợp lệ")
    private String phoneNumber;

    @Builder.Default
    @Column(name = "IsActive", columnDefinition = "BIT CONSTRAINT DF_User_IsActive DEFAULT 1")
    private Boolean isActive = true;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "M/d/yyyy, h:mm:ss a")
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "M/d/yyyy, h:mm:ss a")
    @Column(name = "LastLogin")
    private LocalDateTime lastLogin;

    // Relationships (e.g., OneToMany to BlogPosts, BlogComments, etc.) can be added here
    // For StaffDetails and ConsultantDetails (OneToOne)


    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StaffDetails staffDetails;

//    @Transient
//    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private ConsultantDetails consultantDetails;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CustomerDetails customerDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false)
    private AuthProvider authProvider = AuthProvider.LOCAL;


}
