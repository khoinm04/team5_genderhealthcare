package com.GenderHealthCare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ConsultantDetails")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantDetails {

    @Id
    @Column(name = "ConsultantID")
    private Long consultantId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Uses the ID of the User entity as the ID for ConsultantDetails
    @JoinColumn(name = "ConsultantID") // This is the FK column in ConsultantDetails table that references Users.UserID
    private User user;

    @Size(max = 100, message = "Chuyên môn phải ít hơn 100 ký tự")
    @Column(name = "Specialization", length = 100)
    private String specialization;

    @Size(max = 255, message = "Chứng chỉ phải ít hơn 255 ký tự")
    @Column(name = "Certification", length = 255)
    private String certification;
}
