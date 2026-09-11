package com.livinglink.visitservice.controller;

import com.livinglink.visitservice.dto.VisitRequestDto;
import com.livinglink.visitservice.entity.Visit;
import com.livinglink.visitservice.service.VisitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Visit createVisit(@Valid @RequestBody VisitRequestDto request, Authentication authentication) {
        Long requesterId = (Long) authentication.getPrincipal();
        return visitService.createVisit(requesterId, request);
    }

    @GetMapping("/requester/me")
    public List<Visit> getMyVisitRequests(Authentication authentication) {
        Long requesterId = (Long) authentication.getPrincipal();
        return visitService.getVisitsByRequester(requesterId);
    }

    @GetMapping("/owner/me")
    public List<Visit> getVisitsForMyListings(Authentication authentication) {
        Long ownerId = (Long) authentication.getPrincipal();
        return visitService.getVisitsByOwner(ownerId);
    }

    @PutMapping("/{id}/accept")
    public Visit acceptVisit(@PathVariable Long id, Authentication authentication) {
        Long ownerId = (Long) authentication.getPrincipal();
        return visitService.acceptVisit(id, ownerId);
    }

    @PutMapping("/{id}/reject")
    public Visit rejectVisit(@PathVariable Long id, Authentication authentication) {
        Long ownerId = (Long) authentication.getPrincipal();
        return visitService.rejectVisit(id, ownerId);
    }

    @PutMapping("/{id}/cancel")
    public Visit cancelVisit(@PathVariable Long id, Authentication authentication) {
        Long requesterId = (Long) authentication.getPrincipal();
        return visitService.cancelVisit(id, requesterId);
    }
}
