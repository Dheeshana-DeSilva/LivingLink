package com.livinglink.preferenceservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PreferenceRequest {

    @NotBlank(message = "Preferred city is required")
    private String preferredCity;

    @NotNull(message = "Minimum budget is required")
    @Positive(message = "Minimum budget must be a positive number")
    private Double minBudget;

    @NotNull(message = "Maximum budget is required")
    @Positive(message = "Maximum budget must be a positive number")
    private Double maxBudget;

    @NotBlank(message = "Preferred gender is required")
    private String preferredGender;

    private String cleanlinessLevel;
    private String sleepSchedule;
    private String smokingPreference;
    private String petPreference;
    private String cookingHabit;
    private String lifestyleType;

    public PreferenceRequest() {
    }

    public String getPreferredCity() { return preferredCity; }
    public Double getMinBudget() { return minBudget; }
    public Double getMaxBudget() { return maxBudget; }
    public String getPreferredGender() { return preferredGender; }
    public String getCleanlinessLevel() { return cleanlinessLevel; }
    public String getSleepSchedule() { return sleepSchedule; }
    public String getSmokingPreference() { return smokingPreference; }
    public String getPetPreference() { return petPreference; }
    public String getCookingHabit() { return cookingHabit; }
    public String getLifestyleType() { return lifestyleType; }
}
