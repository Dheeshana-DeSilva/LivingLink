package com.livinglink.reviewservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reviewerId;

    private Long reviewedUserId; // Nullable (if it's an accommodation review)

    private Long listingId;      // Nullable (if it's a roommate review)

    @Column(nullable = false)
    private Integer rating;      // 1-5

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private String reviewType;   // ACCOMMODATION or ROOMMATE

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
