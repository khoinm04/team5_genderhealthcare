package com.ghsms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CategoryBlogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBlog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "nvarchar(100)")
    private String name;
}
