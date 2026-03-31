package com.example.demo.repository;

import com.example.demo.entity.Post;
import com.example.demo.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE " +
           "(:title IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:content IS NULL OR LOWER(p.content) LIKE LOWER(CONCAT('%', :content, '%'))) AND " +
           "(:authorId IS NULL OR p.author.id = :authorId) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<Post> findWithFilters(
            @Param("title") String title,
            @Param("content") String content,
            @Param("authorId") Long authorId,
            @Param("status") PostStatus status,
            Pageable pageable);

    Optional<Post> findByIdAndAuthorId(Long id, Long authorId);
}
