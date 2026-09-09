package com.livinglink.matchingservice.dto;

public class MatchingRequest {
    private Long userId;
    private String preferredLocation;
    private Double budget;
    private String preferredGender;
    private Boolean smokingAllowed;
    private Boolean petsAllowed;

    public MatchingRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public MatchingRequest(Long userId, String preferredLocation, Double budget, String preferredGender, Boolean smokingAllowed, Boolean petsAllowed) {
        this.userId = userId;
        this.preferredLocation = preferredLocation;
        this.budget = budget;
        this.preferredGender = preferredGender;
        this.smokingAllowed = smokingAllowed;
        this.petsAllowed = petsAllowed;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getPreferredGender() {
        return preferredGender;
    }

    public void setPreferredGender(String preferredGender) {
        this.preferredGender = preferredGender;
    }

    public Boolean getSmokingAllowed() {
        return smokingAllowed;
    }

    public void setSmokingAllowed(Boolean smokingAllowed) {
        this.smokingAllowed = smokingAllowed;
    }

    public Boolean getPetsAllowed() {
        return petsAllowed;
    }

    public void setPetsAllowed(Boolean petsAllowed) {
        this.petsAllowed = petsAllowed;
    }
}
