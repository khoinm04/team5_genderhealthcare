package com.ghsms.repository;

import com.ghsms.DTO.CategoryWithCountDTO;
import com.ghsms.model.CategoryBlog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryBlogRepository extends JpaRepository<CategoryBlog,Long> {
    boolean  existsByName(String name);

}
