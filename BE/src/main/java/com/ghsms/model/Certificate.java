package com.ghsms.model;

import com.ghsms.file_enum.CertificateStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "Name", columnDefinition = "nvarchar(100)")
    private String name;

    @Enumerated(EnumType.STRING)
    private CertificateStatus status;

    @ManyToOne
    private ConsultantDetails consultant;
}
