package com.healthcare.app.service;

import com.healthcare.app.entity.Review;
import com.healthcare.app.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByEntity(String entityId, Review.ReviewedEntityType entityType) {
        return reviewRepository.findByReviewedEntityIdAndReviewedEntityType(entityId, entityType);
    }

    public List<Review> getReviewsByReviewer(String reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId);
    }

    public Double getAverageRating(String entityId, Review.ReviewedEntityType entityType) {
        return reviewRepository.findAverageRatingByEntityIdAndType(entityId, entityType);
    }

    public Long getReviewCount(String entityId, Review.ReviewedEntityType entityType) {
        return reviewRepository.countByReviewedEntityIdAndReviewedEntityType(entityId, entityType);
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
