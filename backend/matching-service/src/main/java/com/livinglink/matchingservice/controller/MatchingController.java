package com.livinglink.matchingservice.controller;

import com.livinglink.matchingservice.dto.MatchingResult;
import com.livinglink.matchingservice.service.MatchingService;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/me")
    public List<MatchingResult> getMatches(Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();
        return matchingService.getRankedListings(userId);
    }
}
