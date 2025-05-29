package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoleID")
    private Role role;

    @Size(max = 100, message = "Full name must be less than 100 characters")
    @Column(name = "FullName", length = 100)
    private String fullName;

    @Column(name = "ImageUrl", length = 255)
    private String imageUrl; // URL to user's profile image, can be null

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "PasswordHash", length = 255)
    private String passwordHash; // Validation depends on auth strategy

    @Size(max = 20, message = "Phone number must be less than 20 characters")
    @Column(name = "PhoneNumber", length = 20)
    @Pattern(regexp = "(84|0[3|5|7|8|9])+([0-9]{8})\\b", message = "Phone number is not valid")
    private String phoneNumber;

    @Column(name = "IsActive", columnDefinition = "BIT DEFAULT 1")
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relationships (e.g., OneToMany to BlogPosts, BlogComments, etc.) can be added here
    // For StaffDetails and ConsultantDetails (OneToOne)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StaffDetails staffDetails;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ConsultantDetails consultantDetails;


}
