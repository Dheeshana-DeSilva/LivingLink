package com.livinglink.authservice.dto;

public class AuthResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private String token;
    private String message;

    public AuthResponse(Long userId, String fullName, String email, String role, String token, String message) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.token = token;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }
}