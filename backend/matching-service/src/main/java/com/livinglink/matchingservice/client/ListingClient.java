package com.livinglink.matchingservice.client;

import com.livinglink.matchingservice.dto.ListingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "listing-service")
public interface ListingClient {

    @GetMapping("/api/listings")
    List<ListingResponse> getListings();
}
