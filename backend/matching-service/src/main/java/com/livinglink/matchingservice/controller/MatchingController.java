package com.livinglink.matchingservice.controller;

import com.livinglink.matchingservice.dto.MatchingResult;
import com.livinglink.matchingservice.service.MatchingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/{userId}")
    public List<MatchingResult> getMatches(
            @PathVariable Long userId) {

        return matchingService.getRankedListings(userId);
    }
}
