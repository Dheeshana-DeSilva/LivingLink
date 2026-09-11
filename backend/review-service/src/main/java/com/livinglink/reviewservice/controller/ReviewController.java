package com.livinglink.reviewservice.controller;

import com.livinglink.reviewservice.dto.ReviewRequestDto;
import com.livinglink.reviewservice.dto.ReviewSummaryDto;
import com.livinglink.reviewservice.entity.Review;
import com.livinglink.reviewservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review createReview(@Valid @RequestBody ReviewRequestDto request, Authentication authentication) {
        Long reviewerId = (Long) authentication.getPrincipal();
        return reviewService.createReview(reviewerId, request);
    }

    @GetMapping("/listing/{listingId}")
    public List<Review> getReviewsForListing(@PathVariable Long listingId) {
        return reviewService.getReviewsForListing(listingId);
    }

    @GetMapping("/listing/{listingId}/summary")
    public ReviewSummaryDto getListingSummary(@PathVariable Long listingId) {
        return reviewService.getListingReviewSummary(listingId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsForUser(@PathVariable Long userId) {
        return reviewService.getReviewsForUser(userId);
    }

    @GetMapping("/user/{userId}/summary")
    public ReviewSummaryDto getUserSummary(@PathVariable Long userId) {
        return reviewService.getUserReviewSummary(userId);
    }

    @PutMapping("/{id}")
    public Review updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequestDto request,
            Authentication authentication
    ) {
        Long reviewerId = (Long) authentication.getPrincipal();
        return reviewService.updateReview(id, reviewerId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id, Authentication authentication) {
        Long reviewerId = (Long) authentication.getPrincipal();
        reviewService.deleteReview(id, reviewerId);
    }
}
