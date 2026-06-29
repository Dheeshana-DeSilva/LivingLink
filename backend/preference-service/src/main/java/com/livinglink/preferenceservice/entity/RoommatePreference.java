package com.livinglink.preferenceservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roommate_preferences")
public class RoommatePreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoommatePreference() {
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setPreferredCity(String preferredCity) {
        this.preferredCity = preferredCity;
    }

    public void setMinBudget(Double minBudget) {
        this.minBudget = minBudget;
    }

    public void setMaxBudget(Double maxBudget) {
        this.maxBudget = maxBudget;
    }

    public void setPreferredGender(String preferredGender) {
        this.preferredGender = preferredGender;
    }

    public void setCleanlinessLevel(String cleanlinessLevel) {
        this.cleanlinessLevel = cleanlinessLevel;
    }

    public void setSleepSchedule(String sleepSchedule) {
        this.sleepSchedule = sleepSchedule;
    }

    public void setSmokingPreference(String smokingPreference) {
        this.smokingPreference = smokingPreference;
    }

    public void setPetPreference(String petPreference) {
        this.petPreference = petPreference;
    }

    public void setCookingHabit(String cookingHabit) {
        this.cookingHabit = cookingHabit;
    }

    public void setLifestyleType(String lifestyleType) {
        this.lifestyleType = lifestyleType;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}