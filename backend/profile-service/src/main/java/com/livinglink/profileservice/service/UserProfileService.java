package com.livinglink.profileservice.service;

import com.livinglink.profileservice.dto.ProfileRequest;
import com.livinglink.profileservice.entity.UserProfile;
import com.livinglink.profileservice.exception.DuplicateResourceException;
import com.livinglink.profileservice.exception.ResourceNotFoundException;
import com.livinglink.profileservice.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile createProfile(Long userId, ProfileRequest request) {

        if (userProfileRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("Profile already exists for this user");
        }

        UserProfile profile = new UserProfile();

        // Get user ID from JWT, NOT from request body
        profile.setUserId(userId);

        profile.setAgeRange(request.getAgeRange());
        profile.setGender(request.getGender());
        profile.setOccupation(request.getOccupation());
        profile.setCity(request.getCity());
        profile.setLifestyleType(request.getLifestyleType());
        profile.setCleanlinessLevel(request.getCleanlinessLevel());
        profile.setSleepSchedule(request.getSleepSchedule());
        profile.setCookingHabit(request.getCookingHabit());
        profile.setSmokingPreference(request.getSmokingPreference());
        profile.setPetPreference(request.getPetPreference());

        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());

        return userProfileRepository.save(profile);
    }

    public UserProfile getProfileByUserId(Long userId) {

        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Profile not found for user ID: " + userId));
    }

    public UserProfile updateProfile(
            Long userId,
            ProfileRequest request
    ) {

        UserProfile profile = getProfileByUserId(userId);

        profile.setAgeRange(request.getAgeRange());
        profile.setGender(request.getGender());
        profile.setOccupation(request.getOccupation());
        profile.setCity(request.getCity());
        profile.setLifestyleType(request.getLifestyleType());
        profile.setCleanlinessLevel(request.getCleanlinessLevel());
        profile.setSleepSchedule(request.getSleepSchedule());
        profile.setCookingHabit(request.getCookingHabit());
        profile.setSmokingPreference(request.getSmokingPreference());
        profile.setPetPreference(request.getPetPreference());

        profile.setUpdatedAt(LocalDateTime.now());

        return userProfileRepository.save(profile);
    }
}