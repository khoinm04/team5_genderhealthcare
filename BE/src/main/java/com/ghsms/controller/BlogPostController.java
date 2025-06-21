package com.ghsms.controller;

import com.ghsms.DTO.BlogPostDTO;
import com.ghsms.service.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogposts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    // Tạo bài viết mới
    @PostMapping("/createPost")
    public ResponseEntity<BlogPostDTO> create(@RequestBody @Valid BlogPostDTO blogPostDTO) {
        return ResponseEntity.ok(blogPostService.create(blogPostDTO));
    }

    // Sửa bài viết
    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid BlogPostDTO blogPostDTO) {
        return ResponseEntity.ok(blogPostService.update(id, blogPostDTO));
    }

    // Xóa bài viết
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogPostService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Lấy 1 bài viết
    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getById(id));
    }

    // Lấy tất cả bài viết
    @GetMapping
    public ResponseEntity<List<BlogPostDTO>> getAll() {
        return ResponseEntity.ok(blogPostService.getAll());
    }
}
