package com.livinglink.preferenceservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/preferences")
public class TestController {

    @GetMapping("/test")
    public String testPreferenceService() {
        return "Preference Service is running";
    }
}
