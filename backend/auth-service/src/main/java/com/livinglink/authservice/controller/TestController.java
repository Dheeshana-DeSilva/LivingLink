package com.livinglink.authservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/auth/test")
    public String testAuthService() {
        return "Auth Service is running";
    }
}