package com.example.demo.service;

import com.example.demo.dto.request.PostRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.enums.PostStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostResponse create(PostRequest request, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(author)
                .status(request.getStatus() != null ? request.getStatus() : PostStatus.PUBLISHED)
                .build();

        Post savedPost = postRepository.save(post);
        return PostResponse.fromEntity(savedPost);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getAll(int page, int size, String sortBy, String sortDir,
                                            String title, String content, Long authorId, PostStatus status) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Post> posts = postRepository.findWithFilters(title, content, authorId, status, pageable);
        Page<PostResponse> responsePage = posts.map(PostResponse::fromEntity);

        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public PostResponse getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
        return PostResponse.fromEntity(post);
    }

    @Transactional
    public PostResponse update(Long id, PostRequest request, Long userId, boolean isAdmin) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        if (!post.getAuthor().getId().equals(userId) && !isAdmin) {
            throw new RuntimeException("You don't have permission to update this post");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        if (request.getStatus() != null) {
            post.setStatus(request.getStatus());
        }

        Post updatedPost = postRepository.save(post);
        return PostResponse.fromEntity(updatedPost);
    }

    @Transactional
    public void delete(Long id, Long userId, boolean isAdmin) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        if (!post.getAuthor().getId().equals(userId) && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public PostResponse incrementViews(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

        post.incrementViews();
        Post updatedPost = postRepository.save(post);
        return PostResponse.fromEntity(updatedPost);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByAuthorId(userId, pageable);
        Page<PostResponse> responsePage = posts.map(PostResponse::fromEntity);
        return PageResponse.from(responsePage);
    }
}
