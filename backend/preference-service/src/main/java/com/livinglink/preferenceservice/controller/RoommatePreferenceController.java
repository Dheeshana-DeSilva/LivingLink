package com.livinglink.preferenceservice.controller;

import com.livinglink.preferenceservice.dto.PreferenceRequest;
import com.livinglink.preferenceservice.entity.RoommatePreference;
import com.livinglink.preferenceservice.service.RoommatePreferenceService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/preferences")
public class RoommatePreferenceController {

    private final RoommatePreferenceService preferenceService;

    public RoommatePreferenceController(RoommatePreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @PostMapping
    public RoommatePreference createPreference(@Valid @RequestBody PreferenceRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return preferenceService.createPreference(userId, request);
    }

    @GetMapping("/me")
    public RoommatePreference getPreference(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return preferenceService.getPreferenceByUserId(userId);
    }

    @PutMapping("/me")
    public RoommatePreference updatePreference(
            @Valid @RequestBody PreferenceRequest request,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        return preferenceService.updatePreference(userId, request);
    }
}