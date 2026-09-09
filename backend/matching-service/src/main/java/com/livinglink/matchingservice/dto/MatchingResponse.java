package com.livinglink.matchingservice.dto;

public class MatchingResponse {

    private Long listingId;
    private Double compatibilityScore;

    public MatchingResponse() {
    }

    public MatchingResponse(Long listingId, Double compatibilityScore) {
        this.listingId = listingId;
        this.compatibilityScore = compatibilityScore;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public Double getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(Double compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }
}
