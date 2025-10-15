package com.healthcare.app.controller;

import com.healthcare.app.entity.Review;
import com.healthcare.app.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        Review savedReview = reviewService.saveReview(review);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/entity/{entityId}")
    public ResponseEntity<List<Review>> getReviewsForEntity(
            @PathVariable String entityId,
            @RequestParam Review.ReviewedEntityType entityType) {
        List<Review> reviews = reviewService.getReviewsByEntity(entityId, entityType);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{reviewerId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable String reviewerId) {
        List<Review> reviews = reviewService.getReviewsByReviewer(reviewerId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/rating/{entityId}")
    public ResponseEntity<Map<String, Object>> getRatingSummary(
            @PathVariable String entityId,
            @RequestParam Review.ReviewedEntityType entityType) {
        Double averageRating = reviewService.getAverageRating(entityId, entityType);
        Long reviewCount = reviewService.getReviewCount(entityId, entityType);

        Map<String, Object> summary = Map.of(
            "averageRating", averageRating != null ? averageRating : 0.0,
            "reviewCount", reviewCount
        );

        return ResponseEntity.ok(summary);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
