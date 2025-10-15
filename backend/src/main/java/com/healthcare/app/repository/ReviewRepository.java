package com.healthcare.app.repository;

import com.healthcare.app.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewedEntityIdAndReviewedEntityType(String reviewedEntityId, Review.ReviewedEntityType reviewedEntityType);

    List<Review> findByReviewerId(String reviewerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewedEntityId = :entityId AND r.reviewedEntityType = :entityType")
    Double findAverageRatingByEntityIdAndType(@Param("entityId") String entityId, @Param("entityType") Review.ReviewedEntityType entityType);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewedEntityId = :entityId AND r.reviewedEntityType = :entityType")
    Long countByReviewedEntityIdAndReviewedEntityType(@Param("entityId") String entityId, @Param("entityType") Review.ReviewedEntityType entityType);
}
