package com.livinglink.visitservice.service;

import com.livinglink.visitservice.client.NotificationClient;
import com.livinglink.visitservice.dto.NotificationRequestDto;
import com.livinglink.visitservice.dto.VisitRequestDto;
import com.livinglink.visitservice.entity.Visit;
import com.livinglink.visitservice.exception.BadRequestException;
import com.livinglink.visitservice.exception.DuplicateResourceException;
import com.livinglink.visitservice.exception.ResourceNotFoundException;
import com.livinglink.visitservice.exception.UnauthorizedException;
import com.livinglink.visitservice.repository.VisitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final NotificationClient notificationClient;

    public VisitService(VisitRepository visitRepository, NotificationClient notificationClient) {
        this.visitRepository = visitRepository;
        this.notificationClient = notificationClient;
    }

    public Visit createVisit(Long requesterId, VisitRequestDto request) {
        if (requesterId.equals(request.getOwnerId())) {
            throw new BadRequestException("You cannot schedule a visit for your own listing");
        }

        boolean alreadyRequested = visitRepository.existsByRequesterIdAndListingIdAndStatusIn(
                requesterId, 
                request.getListingId(), 
                Arrays.asList("PENDING", "ACCEPTED")
        );

        if (alreadyRequested) {
            throw new DuplicateResourceException("You already have an active visit request for this listing");
        }

        Visit visit = new Visit();
        visit.setRequesterId(requesterId);
        visit.setListingId(request.getListingId());
        visit.setOwnerId(request.getOwnerId());
        visit.setVisitDate(request.getVisitDate());
        visit.setStatus("PENDING");
        visit.setCreatedAt(LocalDateTime.now());
        visit.setUpdatedAt(LocalDateTime.now());

        visit = visitRepository.save(visit);
        
        // Notify the listing owner
        notificationClient.sendNotification(new NotificationRequestDto(
                visit.getOwnerId(),
                "You have a new visit request for your listing.",
                "VISIT_REQUEST"
        ));
        
        return visit;
    }

    public List<Visit> getVisitsByRequester(Long requesterId) {
        return visitRepository.findByRequesterId(requesterId);
    }

    public List<Visit> getVisitsByOwner(Long ownerId) {
        return visitRepository.findByOwnerId(ownerId);
    }

    public Visit acceptVisit(Long visitId, Long ownerId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

        if (!visit.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You are not authorized to accept this visit");
        }

        if (!visit.getStatus().equals("PENDING")) {
            throw new BadRequestException("Only PENDING visits can be accepted");
        }

        visit.setStatus("ACCEPTED");
        visit.setUpdatedAt(LocalDateTime.now());
        visit = visitRepository.save(visit);
        
        // Notify the requester
        notificationClient.sendNotification(new NotificationRequestDto(
                visit.getRequesterId(),
                "Your visit request has been accepted!",
                "VISIT_ACCEPTED"
        ));
        
        return visit;
    }

    public Visit rejectVisit(Long visitId, Long ownerId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

        if (!visit.getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("You are not authorized to reject this visit");
        }

        if (!visit.getStatus().equals("PENDING")) {
            throw new BadRequestException("Only PENDING visits can be rejected");
        }

        visit.setStatus("REJECTED");
        visit.setUpdatedAt(LocalDateTime.now());
        visit = visitRepository.save(visit);
        
        // Notify the requester
        notificationClient.sendNotification(new NotificationRequestDto(
                visit.getRequesterId(),
                "Your visit request has been rejected.",
                "VISIT_REJECTED"
        ));
        
        return visit;
    }

    public Visit cancelVisit(Long visitId, Long requesterId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

        if (!visit.getRequesterId().equals(requesterId)) {
            throw new UnauthorizedException("You are not authorized to cancel this visit");
        }

        if (visit.getStatus().equals("REJECTED") || visit.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Visit is already rejected or cancelled");
        }

        visit.setStatus("CANCELLED");
        visit.setUpdatedAt(LocalDateTime.now());
        visit = visitRepository.save(visit);
        
        // Notify the listing owner
        notificationClient.sendNotification(new NotificationRequestDto(
                visit.getOwnerId(),
                "A scheduled visit has been cancelled by the requester.",
                "VISIT_CANCELLED"
        ));
        
        return visit;
    }
}
