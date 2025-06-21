package com.ghsms.service;

import com.ghsms.DTO.BlogPostDTO;
import com.ghsms.model.BlogPost;
import com.ghsms.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    public BlogPostDTO create(BlogPostDTO dto) {
        BlogPost post = new BlogPost();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setAuthor(dto.getAuthor());
        post.setCreatedAt(LocalDateTime.now());
        BlogPost saved = blogPostRepository.save(post);
        return toDTO(saved);
    }

    public BlogPostDTO update(Long id, BlogPostDTO dto) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setAuthor(dto.getAuthor());
        BlogPost saved = blogPostRepository.save(post);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy bài viết!");
        }
        blogPostRepository.deleteById(id);
    }

    public BlogPostDTO getById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
        return toDTO(post);
    }

    public List<BlogPostDTO> getAll() {
        return blogPostRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private BlogPostDTO toDTO(BlogPost post) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setBlogId(post.getBlogId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthor(post.getAuthor());
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }
}
