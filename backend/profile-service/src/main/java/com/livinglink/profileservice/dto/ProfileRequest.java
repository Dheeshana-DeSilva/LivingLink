package com.livinglink.profileservice.dto;

public class ProfileRequest {

    private Long userId;
    private String ageRange;
    private String gender;
    private String occupation;
    private String city;
    private String lifestyleType;
    private String cleanlinessLevel;
    private String sleepSchedule;
    private String cookingHabit;
    private String smokingPreference;
    private String petPreference;

    public ProfileRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public String getAgeRange() {
        return ageRange;
    }

    public String getGender() {
        return gender;
    }

    public String getOccupation() {
        return occupation;
    }

    public String getCity() {
        return city;
    }

    public String getLifestyleType() {
        return lifestyleType;
    }

    public String getCleanlinessLevel() {
        return cleanlinessLevel;
    }

    public String getSleepSchedule() {
        return sleepSchedule;
    }

    public String getCookingHabit() {
        return cookingHabit;
    }

    public String getSmokingPreference() {
        return smokingPreference;
    }

    public String getPetPreference() {
        return petPreference;
    }
}