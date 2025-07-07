package com.ghsms.repository;

import com.ghsms.model.CategoryBlog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryBlogRepository extends JpaRepository<CategoryBlog,Long> {
    boolean  existsByName(String name);
}
