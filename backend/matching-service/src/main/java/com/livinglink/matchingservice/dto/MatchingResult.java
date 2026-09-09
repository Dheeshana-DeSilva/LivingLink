package com.livinglink.matchingservice.dto;

public class MatchingResult {

    private ListingResponse listing;
    private Double compatibilityScore;

    public MatchingResult() {
    }

    public MatchingResult(
            ListingResponse listing,
            Double compatibilityScore) {

        this.listing = listing;
        this.compatibilityScore = compatibilityScore;
    }

    public ListingResponse getListing() {
        return listing;
    }

    public void setListing(ListingResponse listing) {
        this.listing = listing;
    }

    public Double getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(Double compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }
}
