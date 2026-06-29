package com.livinglink.preferenceservice.dto;

public class PreferenceRequest {
     private Long userId;
    private String preferredCity;
    private Double minBudget;
    private Double maxBudget;
    private String preferredGender;
    private String cleanlinessLevel;
    private String sleepSchedule;
    private String smokingPreference;
    private String petPreference;
    private String cookingHabit;
    private String lifestyleType;

    public PreferenceRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public String getPreferredCity() {
        return preferredCity;
    }

    public Double getMinBudget() {
        return minBudget;
    }

    public Double getMaxBudget() {
        return maxBudget;
    }

    public String getPreferredGender() {
        return preferredGender;
    }

    public String getCleanlinessLevel() {
        return cleanlinessLevel;
    }

    public String getSleepSchedule() {
        return sleepSchedule;
    }

    public String getSmokingPreference() {
        return smokingPreference;
    }

    public String getPetPreference() {
        return petPreference;
    }

    public String getCookingHabit() {
        return cookingHabit;
    }

    public String getLifestyleType() {
        return lifestyleType;
    }
}
