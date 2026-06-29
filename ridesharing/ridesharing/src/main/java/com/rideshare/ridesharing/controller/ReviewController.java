package com.rideshare.ridesharing.controller;

import com.rideshare.ridesharing.dto.ReviewRequest;
import com.rideshare.ridesharing.entity.Review;
import com.rideshare.ridesharing.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Submit review
    @PostMapping("/submit")
    public ResponseEntity<String> submitReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication auth) {
        return ResponseEntity.ok(
                reviewService.submitReview(request, auth.getName())
        );
    }

    // Get driver reviews
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Review>> getDriverReviews(
            @PathVariable Long driverId) {
        return ResponseEntity.ok(reviewService.getDriverReviews(driverId));
    }

    // Get driver average rating
    @GetMapping("/driver/{driverId}/rating")
    public ResponseEntity<Map<String, Object>> getDriverRating(
            @PathVariable Long driverId) {
        Double avg = reviewService.getDriverAverageRating(driverId);
        return ResponseEntity.ok(Map.of(
                "driverId", driverId,
                "averageRating", avg
        ));
    }

    // Check if booking is reviewed
    @GetMapping("/check/{bookingId}")
    public ResponseEntity<Map<String, Boolean>> checkReviewed(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(Map.of(
                "reviewed", reviewService.isReviewed(bookingId)
        ));
    }
}