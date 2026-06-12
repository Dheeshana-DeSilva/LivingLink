package com.livinglink.authservice.dto;

public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private String role;

    public RegisterRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}