package com.livinglink.visitservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VisitRequestDto {

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotNull(message = "Visit date is required")
    @Future(message = "Visit date must be in the future")
    private LocalDateTime visitDate;
}
