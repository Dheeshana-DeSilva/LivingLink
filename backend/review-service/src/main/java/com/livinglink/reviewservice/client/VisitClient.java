package com.livinglink.reviewservice.client;

import com.livinglink.reviewservice.dto.VisitDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "visit-service")
public interface VisitClient {

    @GetMapping("/api/visits/requester/me")
    List<VisitDto> getMyVisitRequests();

    @GetMapping("/api/visits/owner/me")
    List<VisitDto> getVisitsForMyListings();
}
