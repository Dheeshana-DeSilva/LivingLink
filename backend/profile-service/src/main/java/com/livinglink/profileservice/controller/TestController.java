package com.livinglink.profileservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/profiles/test")
    public String testProfileService() {
        return "Profile Service is running";
    }
}