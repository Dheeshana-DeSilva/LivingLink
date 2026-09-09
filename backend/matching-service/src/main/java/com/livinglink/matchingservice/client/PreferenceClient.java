package com.livinglink.matchingservice.client;

import com.livinglink.matchingservice.dto.PreferenceResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "preference-service")
public interface PreferenceClient {

    @GetMapping("/api/preferences/me")
    PreferenceResponse getPreference();
}
