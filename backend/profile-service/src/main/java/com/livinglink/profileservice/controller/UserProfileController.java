package com.livinglink.profileservice.controller;

import com.livinglink.profileservice.dto.ProfileRequest;
import com.livinglink.profileservice.entity.UserProfile;
import com.livinglink.profileservice.service.UserProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public UserProfile createProfile(@RequestBody ProfileRequest request) {
        return userProfileService.createProfile(request);
    }

    @GetMapping("/{userId}")
    public UserProfile getProfile(@PathVariable Long userId) {
        return userProfileService.getProfileByUserId(userId);
    }

    @PutMapping("/{userId}")
    public UserProfile updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileRequest request
    ) {
        return userProfileService.updateProfile(userId, request);
    }
}