package com.livinglink.reviewservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryDto {
    private Long targetId;
    private double averageRating;
    private int reviewCount;
}
