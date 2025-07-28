package com.ghsms.service;

import com.ghsms.DTO.BlogCommentRequestDTO;
import com.ghsms.DTO.BlogCommentResponseDTO;
import com.ghsms.model.BlogComment;
import com.ghsms.model.BlogPost;
import com.ghsms.model.User;
import com.ghsms.repository.BlogCommentRepository;
import com.ghsms.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogCommentService {

    private final BlogCommentRepository commentRepo;
    private final BlogPostRepository blogPostRepo;

    public void addComment(User user, BlogCommentRequestDTO request) {
        BlogPost post = blogPostRepo.findById(request.getBlogPostId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        BlogComment comment = new BlogComment();
        comment.setBlogPost(post);
        comment.setUser(user);
        comment.setCommentText(request.getCommentText());

        if (request.getParentCommentId() != null) {
            BlogComment parentComment = commentRepo.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận cha"));
            comment.setParentComment(parentComment);
        }

        commentRepo.save(comment);
    }

    public List<BlogCommentResponseDTO> getCommentsForPost(Long postId) {
        BlogPost post = blogPostRepo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        Long authorId = post.getAuthor().getUserId();

        return commentRepo.findByBlogPostOrderByCreatedAtAsc(post)
                .stream()
                .map(c -> new BlogCommentResponseDTO(
                        c.getCommentId(),
                        c.getCommentText(),
                        c.getUser() != null ? c.getUser().getName() : "Ẩn danh",
                        c.getUser() != null ? c.getUser().getImageUrl() : null,
                        c.getCreatedAt(),
                        c.getUser() != null && c.getUser().getUserId().equals(authorId),
                        c.getParentComment() != null ? c.getParentComment().getCommentId() : null,
                        c.getLikes(),
                        c.getDislikes()
                ))
                .collect(Collectors.toList());
    }

    public void likeComment(Long commentId) {
        BlogComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));

        comment.setLikes(comment.getLikes() + 1);
        commentRepo.save(comment);
    }

    public void dislikeComment(Long commentId) {
        BlogComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));

        comment.setDislikes(comment.getDislikes() + 1);
        commentRepo.save(comment);
    }

    public void deleteComment(Long commentId) {
        BlogComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận"));

        commentRepo.delete(comment);
    }

}
