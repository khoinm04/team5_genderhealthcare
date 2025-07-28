package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.BlogPost;
import com.ghsms.model.User;
import com.ghsms.repository.BlogCommentRepository;
import com.ghsms.repository.CategoryBlogRepository;
import com.ghsms.service.BlogCommentService;
import com.ghsms.service.BlogPostService;
import com.ghsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blogposts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final UserService userService;
    private final CategoryBlogRepository categoryBlogRepository;
    private final BlogCommentService blogCommentService;
    private final BlogCommentRepository blogCommentRepository;

    @GetMapping
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<Page<BlogPostResponseDTO>> getAllBlogPosts(Pageable pageable) {
        Page<BlogPostResponseDTO> posts = blogPostService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole=('CONSULTANT')")
    public ResponseEntity<?> createBlog(@RequestBody BlogPostRequestDTO request,
                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User author = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        BlogPost createdPost = blogPostService.createBlogPost(request, author);

        return ResponseEntity.ok(new BlogPostResponseDTO(createdPost, 0L));
    }

    @GetMapping("/category")
    public List<CategoryBlogDTO> getAllCategories() {
        return categoryBlogRepository.findAll()
                .stream()
                .map(cat -> new CategoryBlogDTO(cat.getId(), cat.getName()))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> updateBlogPost(@PathVariable Long id,
                                            @RequestBody BlogPostUpdateDTO request) {
        try {
            BlogPost updated = blogPostService.updateBlogPost(id, request);

            long commentCount = blogCommentRepository.countByBlogPost_BlogId(updated.getBlogId());

            return ResponseEntity.ok(new BlogPostResponseDTO(updated, commentCount));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/public")
    public ResponseEntity<Page<BlogPostResponseDTO>> getPublicPosts(Pageable pageable) {
        return ResponseEntity.ok(blogPostService.getPublishedPosts(pageable));
    }

    @PostMapping("/rate")
    public ResponseEntity<?> rateBlogPost(
            @RequestBody RatingRequestDTO request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        blogPostService.rateBlogPost(user.getUser().getUserId(), request);
        return ResponseEntity.ok("Đánh giá thành công");
    }

    @GetMapping("/{postId}/my-rating")
    public ResponseEntity<?> getMyRating(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        int rating = blogPostService.getMyRating(user.getUser(), postId);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("public/{id}")
    public ResponseEntity<?> getBlogPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getPostDtoById(id));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> increaseView(@PathVariable Long id) {
        blogPostService.increasePostViews(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @RequestBody BlogCommentRequestDTO request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        System.out.println("🧑‍💻 Đã gọi API bình luận, người dùng: " + user);

        request.setBlogPostId(postId);
        blogCommentService.addComment(user.getUser(), request);
        return ResponseEntity.ok("Đã thêm bình luận");
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(blogCommentService.getCommentsForPost(postId));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeComment(@PathVariable Long id) {
        blogCommentService.likeComment(id);
        return ResponseEntity.ok("Liked");
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<?> dislikeComment(@PathVariable Long id) {
        blogCommentService.dislikeComment(id);
        return ResponseEntity.ok("Disliked");
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            blogCommentService.deleteComment(commentId);
            return ResponseEntity.ok("Xóa bình luận thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Xóa thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/posts/statistics")
    public ResponseEntity<Map<String, Object>> getPostStatistics() {
        long totalPosts = blogPostService.countAllPosts();
        long totalViews = blogPostService.sumAllViews();
        double averageRating = blogPostService.getAverageRating();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("totalViews", totalViews);
        stats.put("averageRating", averageRating);

        return ResponseEntity.ok(stats);
    }


}
