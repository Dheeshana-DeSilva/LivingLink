package com.livinglink.matchingservice.service;

import com.livinglink.matchingservice.client.ListingClient;
import com.livinglink.matchingservice.client.PreferenceClient;
import com.livinglink.matchingservice.dto.ListingResponse;
import com.livinglink.matchingservice.dto.MatchingResult;
import com.livinglink.matchingservice.dto.PreferenceResponse;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MatchingService {

    private final ListingClient listingClient;
    private final PreferenceClient preferenceClient;

    public MatchingService(ListingClient listingClient, PreferenceClient preferenceClient) {
        this.listingClient = listingClient;
        this.preferenceClient = preferenceClient;
    }

    public double calculateListingScore(
            ListingResponse listing,
            PreferenceResponse preference) {

        double score = 0.0;

        // 1. Location - 30 points
        if (preference.getPreferredCity() != null
                && listing.getCity() != null
                && preference.getPreferredCity()
                        .equalsIgnoreCase(listing.getCity())) {

            score += 30;
        }

        // 2. Budget - 25 points
        if (preference.getMinBudget() != null
                && preference.getMaxBudget() != null
                && listing.getRent() != null) {

            if (listing.getRent() >= preference.getMinBudget()
                    && listing.getRent() <= preference.getMaxBudget()) {

                score += 25;
            }
        }

        // 3. Preferred Gender - 20 points
        if (preference.getPreferredGender() != null
                && listing.getPreferredGender() != null) {

            if (listing.getPreferredGender().equalsIgnoreCase("Any")
                    || listing.getPreferredGender()
                            .equalsIgnoreCase(preference.getPreferredGender())) {

                score += 20;
            }
        }

        // 4. Smoking Preference - 15 points
        if (preference.getSmokingPreference() != null
                && listing.getFacilities() != null) {

            String smokingPreference =
                    preference.getSmokingPreference().toLowerCase();

            String facilities =
                    listing.getFacilities().toLowerCase();

            if (smokingPreference.contains("allow")
                    && facilities.contains("smoking")) {

                score += 15;
            }

            if (smokingPreference.contains("not")
                    && facilities.contains("non-smoking")) {

                score += 15;
            }
        }

        // 5. Pet Preference - 10 points
        if (preference.getPetPreference() != null
                && listing.getFacilities() != null) {

            String petPreference =
                    preference.getPetPreference().toLowerCase();

            String facilities =
                    listing.getFacilities().toLowerCase();

            if (petPreference.contains("allow")
                    && facilities.contains("pet")) {

                score += 10;
            }

            if (petPreference.contains("not")
                    && facilities.contains("no pet")) {

                score += 10;
            }
        }

        return score;
    }

    public List<MatchingResult> getRankedListings(Long userId) {

        PreferenceResponse preference =
                preferenceClient.getPreference();

        // Get all listings
        List<ListingResponse> listings =
                listingClient.getListings();

        // Calculate score for every listing
        List<MatchingResult> results = listings.stream()
                .map(listing -> {

                    double score =
                            calculateListingScore(listing, preference);

                    return new MatchingResult(listing, score);
                })
                .toList();

        // Sort highest score first
        results.sort(
                Comparator.comparing(
                        MatchingResult::getCompatibilityScore
                ).reversed()
        );

        return results;
    }
}
