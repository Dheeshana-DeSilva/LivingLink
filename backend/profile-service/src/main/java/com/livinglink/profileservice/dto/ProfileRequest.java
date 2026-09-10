package com.livinglink.profileservice.dto;

import jakarta.validation.constraints.NotBlank;

public class ProfileRequest {

    @NotBlank(message = "Age range is required")
    private String ageRange;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Occupation is required")
    private String occupation;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Lifestyle type is required")
    private String lifestyleType;

    @NotBlank(message = "Cleanliness level is required")
    private String cleanlinessLevel;

    @NotBlank(message = "Sleep schedule is required")
    private String sleepSchedule;

    @NotBlank(message = "Cooking habit is required")
    private String cookingHabit;

    @NotBlank(message = "Smoking preference is required")
    private String smokingPreference;

    @NotBlank(message = "Pet preference is required")
    private String petPreference;

    public ProfileRequest() {
    }

    public String getAgeRange() { return ageRange; }
    public String getGender() { return gender; }
    public String getOccupation() { return occupation; }
    public String getCity() { return city; }
    public String getLifestyleType() { return lifestyleType; }
    public String getCleanlinessLevel() { return cleanlinessLevel; }
    public String getSleepSchedule() { return sleepSchedule; }
    public String getCookingHabit() { return cookingHabit; }
    public String getSmokingPreference() { return smokingPreference; }
    public String getPetPreference() { return petPreference; }
}