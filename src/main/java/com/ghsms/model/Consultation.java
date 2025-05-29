package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Consultations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ConsultationID")
    private Long consultationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", nullable = false)
    private User consultant;

    @Size(max = 255, message = "Topic must be less than 255 characters")
    @Column(name = "Topic", length = 255)
    private String topic;

    @Lob // For TEXT type
    @Column(name = "Description")
    private String description;

    @Column(name = "DateScheduled")
    private LocalDateTime dateScheduled;

    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(name = "Status", length = 50)
    private String status;
}

