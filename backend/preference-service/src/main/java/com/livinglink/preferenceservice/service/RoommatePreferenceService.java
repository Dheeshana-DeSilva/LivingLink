package com.livinglink.preferenceservice.service;

import com.livinglink.preferenceservice.dto.PreferenceRequest;
import com.livinglink.preferenceservice.entity.RoommatePreference;
import com.livinglink.preferenceservice.repository.RoommatePreferenceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RoommatePreferenceService {

    private final RoommatePreferenceRepository preferenceRepository;

    public RoommatePreferenceService(RoommatePreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }

    public RoommatePreference createPreference(PreferenceRequest request) {
        if (preferenceRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("Preference already exists for this user");
        }

        RoommatePreference preference = new RoommatePreference();

        preference.setUserId(request.getUserId());
        preference.setPreferredCity(request.getPreferredCity());
        preference.setMinBudget(request.getMinBudget());
        preference.setMaxBudget(request.getMaxBudget());
        preference.setPreferredGender(request.getPreferredGender());
        preference.setCleanlinessLevel(request.getCleanlinessLevel());
        preference.setSleepSchedule(request.getSleepSchedule());
        preference.setSmokingPreference(request.getSmokingPreference());
        preference.setPetPreference(request.getPetPreference());
        preference.setCookingHabit(request.getCookingHabit());
        preference.setLifestyleType(request.getLifestyleType());
        preference.setCreatedAt(LocalDateTime.now());
        preference.setUpdatedAt(LocalDateTime.now());

        return preferenceRepository.save(preference);
    }

    public RoommatePreference getPreferenceByUserId(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Preference not found"));
    }

    public RoommatePreference updatePreference(Long userId, PreferenceRequest request) {
        RoommatePreference preference = getPreferenceByUserId(userId);

        preference.setPreferredCity(request.getPreferredCity());
        preference.setMinBudget(request.getMinBudget());
        preference.setMaxBudget(request.getMaxBudget());
        preference.setPreferredGender(request.getPreferredGender());
        preference.setCleanlinessLevel(request.getCleanlinessLevel());
        preference.setSleepSchedule(request.getSleepSchedule());
        preference.setSmokingPreference(request.getSmokingPreference());
        preference.setPetPreference(request.getPetPreference());
        preference.setCookingHabit(request.getCookingHabit());
        preference.setLifestyleType(request.getLifestyleType());
        preference.setUpdatedAt(LocalDateTime.now());

        return preferenceRepository.save(preference);
    }
}