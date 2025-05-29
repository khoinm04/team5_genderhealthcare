package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ChatMessages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MessageID")
    private Integer messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SenderID", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReceiverID", nullable = false)
    private User receiver;

    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 1000, message = "Message content must be less than 1000 characters")
    @Column(name = "MessageContent", length = 1000)
    private String messageContent;

    @CreationTimestamp
    @Column(name = "SentAt", nullable = false, updatable = false)
    private LocalDateTime sentAt;
}

