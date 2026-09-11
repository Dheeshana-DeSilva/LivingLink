package com.livinglink.reviewservice.service;

import com.livinglink.reviewservice.client.VisitClient;
import com.livinglink.reviewservice.dto.ReviewRequestDto;
import com.livinglink.reviewservice.dto.ReviewSummaryDto;
import com.livinglink.reviewservice.dto.VisitDto;
import com.livinglink.reviewservice.entity.Review;
import com.livinglink.reviewservice.exception.BadRequestException;
import com.livinglink.reviewservice.exception.DuplicateResourceException;
import com.livinglink.reviewservice.exception.ResourceNotFoundException;
import com.livinglink.reviewservice.exception.UnauthorizedException;
import com.livinglink.reviewservice.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final VisitClient visitClient;

    public ReviewService(ReviewRepository reviewRepository, VisitClient visitClient) {
        this.reviewRepository = reviewRepository;
        this.visitClient = visitClient;
    }

    public Review createReview(Long reviewerId, ReviewRequestDto request) {
        if ("ACCOMMODATION".equals(request.getReviewType())) {
            if (request.getListingId() == null) {
                throw new BadRequestException("listingId is required for ACCOMMODATION review");
            }
            if (reviewRepository.existsByReviewerIdAndListingIdAndReviewType(reviewerId, request.getListingId(), "ACCOMMODATION")) {
                throw new DuplicateResourceException("You have already reviewed this listing");
            }
            verifyAccommodationRelationship(request.getListingId());
        } else if ("ROOMMATE".equals(request.getReviewType())) {
            if (request.getReviewedUserId() == null) {
                throw new BadRequestException("reviewedUserId is required for ROOMMATE review");
            }
            if (reviewerId.equals(request.getReviewedUserId())) {
                throw new BadRequestException("You cannot review yourself");
            }
            if (reviewRepository.existsByReviewerIdAndReviewedUserIdAndReviewType(reviewerId, request.getReviewedUserId(), "ROOMMATE")) {
                throw new DuplicateResourceException("You have already reviewed this user");
            }
            verifyRoommateRelationship(request.getReviewedUserId());
        } else {
            throw new BadRequestException("Invalid reviewType. Must be ACCOMMODATION or ROOMMATE");
        }

        Review review = new Review();
        review.setReviewerId(reviewerId);
        review.setReviewedUserId(request.getReviewedUserId());
        review.setListingId(request.getListingId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewType(request.getReviewType());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    private void verifyAccommodationRelationship(Long listingId) {
        // Fetch visits where current user is requester
        List<VisitDto> myRequests = visitClient.getMyVisitRequests();
        
        boolean hasAcceptedVisit = myRequests.stream()
                .anyMatch(v -> v.getListingId().equals(listingId) && "ACCEPTED".equals(v.getStatus()));

        if (!hasAcceptedVisit) {
            throw new UnauthorizedException("You can only review accommodations you have an ACCEPTED visit for.");
        }
    }

    private void verifyRoommateRelationship(Long reviewedUserId) {
        List<VisitDto> myRequests = visitClient.getMyVisitRequests();
        List<VisitDto> myOwnerVisits = visitClient.getVisitsForMyListings();

        boolean sharedVisit = myRequests.stream()
                .anyMatch(v -> v.getOwnerId().equals(reviewedUserId) && "ACCEPTED".equals(v.getStatus()))
                ||
                myOwnerVisits.stream()
                .anyMatch(v -> v.getRequesterId().equals(reviewedUserId) && "ACCEPTED".equals(v.getStatus()));

        if (!sharedVisit) {
            throw new UnauthorizedException("You can only review users you have shared an ACCEPTED visit with.");
        }
    }

    public List<Review> getReviewsForListing(Long listingId) {
        return reviewRepository.findByListingId(listingId);
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByReviewedUserId(userId);
    }

    public ReviewSummaryDto getListingReviewSummary(Long listingId) {
        List<Review> reviews = getReviewsForListing(listingId);
        return calculateSummary(listingId, reviews);
    }

    public ReviewSummaryDto getUserReviewSummary(Long userId) {
        List<Review> reviews = getReviewsForUser(userId);
        return calculateSummary(userId, reviews);
    }

    private ReviewSummaryDto calculateSummary(Long targetId, List<Review> reviews) {
        if (reviews.isEmpty()) {
            return new ReviewSummaryDto(targetId, 0.0, 0);
        }
        
        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
                
        // Round to 1 decimal place
        avg = Math.round(avg * 10.0) / 10.0;
        
        return new ReviewSummaryDto(targetId, avg, reviews.size());
    }

    public Review updateReview(Long reviewId, Long reviewerId, ReviewRequestDto request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getReviewerId().equals(reviewerId)) {
            throw new UnauthorizedException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId, Long reviewerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getReviewerId().equals(reviewerId)) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }
}
