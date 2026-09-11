package com.livinglink.reviewservice.repository;

import com.livinglink.reviewservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByListingId(Long listingId);
    
    List<Review> findByReviewedUserId(Long reviewedUserId);
    
    boolean existsByReviewerIdAndListingIdAndReviewType(Long reviewerId, Long listingId, String reviewType);
    
    boolean existsByReviewerIdAndReviewedUserIdAndReviewType(Long reviewerId, Long reviewedUserId, String reviewType);
}
