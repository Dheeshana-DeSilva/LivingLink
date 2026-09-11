package com.livinglink.reviewservice.dto;

import lombok.Data;

@Data
public class VisitDto {
    private Long id;
    private Long requesterId;
    private Long listingId;
    private Long ownerId;
    private String status;
}
