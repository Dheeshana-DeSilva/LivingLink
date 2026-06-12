package com.livinglink.authservice.service;

import com.livinglink.authservice.dto.RegisterRequest;
import com.livinglink.authservice.entity.AppUser;
import com.livinglink.authservice.entity.Role;
import com.livinglink.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        Role role = Role.ROOM_SEEKER;

        if (request.getRole() != null && !request.getRole().isBlank()) {
            role = Role.valueOf(request.getRole().toUpperCase());
        }

        AppUser user = new AppUser(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        userRepository.save(user);

        return "User registered successfully";
    }
}