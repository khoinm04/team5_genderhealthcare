package com.ghsms.service;

import com.ghsms.DTO.BlogPostRequestDTO;
import com.ghsms.DTO.BlogPostResponseDTO;
import com.ghsms.DTO.BlogPostUpdateDTO;
import com.ghsms.DTO.RatingRequestDTO;
import com.ghsms.file_enum.BlogStatus;
import com.ghsms.model.BlogPost;
import com.ghsms.model.CategoryBlog;
import com.ghsms.model.Rating;
import com.ghsms.model.User;
import com.ghsms.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final CategoryBlogRepository categoryBlogRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final BlogCommentRepository blogCommentRepository;


    public BlogPost createBlogPost(BlogPostRequestDTO request, User author) {
        CategoryBlog category = categoryBlogRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));

        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(request.getTitle());
        blogPost.setContent(request.getContent());
        blogPost.setExcerpt(request.getExcerpt());
        blogPost.setStatus(parseStatus(request.getStatus()));
        blogPost.setImageUrl(request.getImageUrl());
        blogPost.setCategory(category);
        blogPost.setAuthor(author);
        blogPost.setCreatedAt(LocalDateTime.now());

        if (blogPost.getStatus() == BlogStatus.SCHEDULED) {
            if (request.getPublishTime().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Thời gian xuất bản phải lớn hơn thời điểm hiện tại.");
            }

            blogPost.setPublishTime(request.getPublishTime());
        } else {
            blogPost.setPublishTime(null);
        }

        return blogPostRepository.save(blogPost);
    }

    public Page<BlogPostResponseDTO> getAllPosts(Pageable pageable) {
        Page<BlogPost> postsPage = blogPostRepository.findAll(pageable);

        return postsPage.map(post -> {
            long count = blogCommentRepository.countByBlogPost_BlogId(post.getBlogId());
            return new BlogPostResponseDTO(post, count);
        });
    }



    public BlogStatus parseStatus(String input) {
        return switch (input.toLowerCase()) {
            case "bản nháp" -> BlogStatus.DRAFT;
            case "đã xuất bản" -> BlogStatus.PUBLISHED;
            case "đã lên lịch" -> BlogStatus.SCHEDULED;
            default -> throw new IllegalArgumentException("Trạng thái không hợp lệ: " + input);
        };
    }

    @Transactional
    public BlogPost updateBlogPost(Long id, BlogPostUpdateDTO request) {
        try {
            BlogPost post = blogPostRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài viết với ID: " + id));

            CategoryBlog category = categoryBlogRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));

            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
            post.setExcerpt(request.getExcerpt());
            post.setImageUrl(request.getImageUrl());
            post.setCategory(category);

            post.setStatus(parseStatus(request.getStatus())); // Nếu lỗi parse, sẽ in ra

            if (post.getStatus() == BlogStatus.SCHEDULED) {
                if (request.getPublishTime() == null || request.getPublishTime().isBefore(LocalDateTime.now())) {
                    throw new IllegalArgumentException("Thời gian xuất bản không hợp lệ.");
                }
                post.setPublishTime(request.getPublishTime());
            } else {
                post.setPublishTime(null);
            }

            return blogPostRepository.save(post);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật bài viết: " + e.getMessage());
        }
    }

    public Page<BlogPostResponseDTO> getPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByStatus(BlogStatus.PUBLISHED, pageable)
                .map(post -> {
                    long commentCount = blogCommentRepository.countByBlogPost_BlogId(post.getBlogId());
                    return new BlogPostResponseDTO(post, commentCount);
                });
    }

    public void rateBlogPost(Long userId, RatingRequestDTO request) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Giá trị đánh giá phải từ 1 đến 5 sao.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));

        BlogPost post = blogPostRepository.findById(request.getBlogPostId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết."));

        Rating rating = ratingRepository.findByUserAndBlogPost(user, post)
                .orElseGet(() -> {
                    Rating r = new Rating();
                    r.setUser(user);
                    r.setBlogPost(post);
                    r.setCreatedAt(LocalDateTime.now());
                    return r;
                });

        rating.setRating(request.getRating());
        ratingRepository.save(rating);

        List<Rating> allRatings = ratingRepository.findAllByBlogPost(post);
        int count = allRatings.size();
        double avg = allRatings.stream().mapToInt(Rating::getRating).average().orElse(0);

        post.setRatingCount(count);
        post.setRating(avg);
        blogPostRepository.save(post);
    }


    public int getMyRating(User user, Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        return ratingRepository.findByUserAndBlogPost(user, post)
                .map(Rating::getRating)
                .orElse(0);
    }

    public BlogPostResponseDTO getPostDtoById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        long commentCount = blogCommentRepository.countByBlogPost_BlogId(id);

        return new BlogPostResponseDTO(post, commentCount);
    }


    public void increasePostViews(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        Integer currentViews = post.getViews() != null ? post.getViews() : 0;
        post.setViews(currentViews + 1);

        blogPostRepository.save(post);
    }

    public long countAllPosts() {
        return blogPostRepository.count();
    }

    public long sumAllViews() {
        return blogPostRepository.sumTotalViews();
    }

    public double getAverageRating() {
        Double avg = ratingRepository.getAverageRating();
        return avg != null ? avg : 0.0;
    }


}
