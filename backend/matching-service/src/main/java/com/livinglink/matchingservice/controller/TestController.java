package com.livinglink.matchingservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/matches/test")
    public String testMatchingService() {
        return "Matching Service is running";
    }
}