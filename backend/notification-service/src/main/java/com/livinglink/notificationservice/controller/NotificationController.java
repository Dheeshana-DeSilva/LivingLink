package com.livinglink.notificationservice.controller;

import com.livinglink.notificationservice.dto.NotificationRequestDto;
import com.livinglink.notificationservice.entity.Notification;
import com.livinglink.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // internal endpoint - in real app should be secured differently, but we'll leave it simple for tutorial
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification createNotification(@Valid @RequestBody NotificationRequestDto request) {
        return notificationService.createNotification(request);
    }

    @GetMapping("/me")
    public List<Notification> getMyNotifications(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return notificationService.getNotificationsForUser(userId);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return notificationService.markAsRead(id, userId);
    }
}
