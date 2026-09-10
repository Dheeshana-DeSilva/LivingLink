package com.livinglink.profileservice.controller;

import com.livinglink.profileservice.dto.ProfileRequest;
import com.livinglink.profileservice.entity.UserProfile;
import com.livinglink.profileservice.service.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserProfile createProfile(
            @Valid @RequestBody ProfileRequest request,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();

        return userProfileService.createProfile(userId, request);
    }

    @GetMapping("/me")
    public UserProfile getMyProfile(Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();

        return userProfileService.getProfileByUserId(userId);
    }

    @PutMapping("/me")
    public UserProfile updateMyProfile(
            @Valid @RequestBody ProfileRequest request,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();

        return userProfileService.updateProfile(userId, request);
    }
}