package com.example.demo.service;

import com.example.demo.dto.request.CommentRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse create(Long postId, CommentRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        return CommentResponse.fromEntities(comments);
    }

    @Transactional
    public CommentResponse update(Long id, CommentRequest request, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id));

        if (!comment.getAuthor().getId().equals(userId) && !isAdmin) {
            throw new RuntimeException("You don't have permission to update this comment");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(updatedComment);
    }

    @Transactional
    public void delete(Long id, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id));

        if (!comment.getAuthor().getId().equals(userId) && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
