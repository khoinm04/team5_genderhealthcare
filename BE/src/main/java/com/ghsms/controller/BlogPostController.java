package com.ghsms.controller;

import com.ghsms.DTO.*;
import com.ghsms.config.UserPrincipal;
import com.ghsms.file_enum.BlogStatus;
import com.ghsms.model.BlogPost;
import com.ghsms.model.CategoryBlog;
import com.ghsms.model.User;
import com.ghsms.repository.BlogPostRepository;
import com.ghsms.repository.CategoryBlogRepository;
import com.ghsms.service.BlogCommentService;
import com.ghsms.service.BlogPostService;
import com.ghsms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blogposts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final UserService userService;
    private final CategoryBlogRepository categoryBlogRepository;
    private final BlogCommentService blogCommentService;

    //lay danh sach cac blog
    @GetMapping
    @PreAuthorize("hasRole=('CONSULTANT')")
    public ResponseEntity<List<BlogPostResponseDTO>> getAllBlogPosts() {
        List<BlogPostResponseDTO> posts = blogPostService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    //tạo blog
    @PostMapping("/create")
    @PreAuthorize("hasRole=('CONSULTANT')")
    public ResponseEntity<?> createBlog(@RequestBody BlogPostRequestDTO request,
                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User author = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        BlogPost createdPost = blogPostService.createBlogPost(request, author);

        // Trả về DTO
        return ResponseEntity.ok(new BlogPostResponseDTO(createdPost));
    }

    //lay danh sach cate
    @GetMapping("/category")
    public List<CategoryBlogDTO> getAllCategories() {
        return categoryBlogRepository.findAll()
                .stream()
                .map(cat -> new CategoryBlogDTO(cat.getId(), cat.getName()))
                .collect(Collectors.toList());
    }

    //api cap nhat blog
    @PutMapping("/{id}")
    @PreAuthorize("hasRole=('CONSULTANT')")
    public ResponseEntity<?> updateBlogPost(@PathVariable Long id,
                                            @RequestBody BlogPostUpdateDTO request) {
        try {
            BlogPost updated = blogPostService.updateBlogPost(id, request);
            return ResponseEntity.ok(new BlogPostResponseDTO(updated));
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

    //lay danh gia cua nguoi dung
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


    //like dislike
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
}
