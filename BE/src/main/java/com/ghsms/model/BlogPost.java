package com.ghsms.model;

import com.ghsms.file_enum.BlogStatus;
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
@Table(name = "BlogPosts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BlogID")
    private Long blogId;

    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(name = "Title", length = 255,columnDefinition = "nvarchar(100)")
    private String title;

    @NotBlank(message = "Content cannot be blank")
    @Column(name = "Content", nullable = false, columnDefinition = "nvarchar(max)")
    private String content;

    @Column(name = "Excerpt",columnDefinition = "nvarchar(100)")
    private String excerpt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryBlog category;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private BlogStatus status;

    @Column(name = "PublishTime")
    private LocalDateTime publishTime;

    @Column(name = "ImageUrl")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AuthorID")
    private User author;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "Rating")
    private Double rating = 0.0;

    @Column(name = "RatingCount")
    private Integer ratingCount = 0;

    @Column(nullable = false)
    private Integer views = 0;



}
