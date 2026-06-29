package com.livinglink.preferenceservice.controller;

import com.livinglink.preferenceservice.dto.PreferenceRequest;
import com.livinglink.preferenceservice.entity.RoommatePreference;
import com.livinglink.preferenceservice.service.RoommatePreferenceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
public class RoommatePreferenceController {

    private final RoommatePreferenceService preferenceService;

    public RoommatePreferenceController(RoommatePreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @PostMapping
    public RoommatePreference createPreference(@RequestBody PreferenceRequest request) {
        return preferenceService.createPreference(request);
    }

    @GetMapping("/{userId}")
    public RoommatePreference getPreference(@PathVariable Long userId) {
        return preferenceService.getPreferenceByUserId(userId);
    }

    @PutMapping("/{userId}")
    public RoommatePreference updatePreference(
            @PathVariable Long userId,
            @RequestBody PreferenceRequest request
    ) {
        return preferenceService.updatePreference(userId, request);
    }
}