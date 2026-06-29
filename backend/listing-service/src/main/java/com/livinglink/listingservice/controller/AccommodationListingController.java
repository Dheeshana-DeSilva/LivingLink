package com.livinglink.listingservice.controller;

import com.livinglink.listingservice.dto.ListingRequest;
import com.livinglink.listingservice.entity.AccommodationListing;
import com.livinglink.listingservice.service.AccommodationListingService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class AccommodationListingController {

	private final AccommodationListingService listingService;

	public AccommodationListingController(AccommodationListingService listingService) {
		this.listingService = listingService;
	}

	@PostMapping
	public AccommodationListing createListing(@RequestBody ListingRequest request) {
		return listingService.createListing(request);
	}

	@GetMapping
	public List<AccommodationListing> getAllListings() {
		return listingService.getAllListings();
	}

	@GetMapping("/{id}")
	public AccommodationListing getListingById(@PathVariable Long id) {
		return listingService.getListingById(id);
	}

	@GetMapping("/owner/{ownerId}")
	public List<AccommodationListing> getListingsByOwnerId(@PathVariable Long ownerId) {
		return listingService.getListingsByOwnerId(ownerId);
	}

	@GetMapping("/city/{city}")
	public List<AccommodationListing> getListingsByCity(@PathVariable String city) {
		return listingService.getListingsByCity(city);
	}

	@GetMapping("/type/{type}")
	public List<AccommodationListing> getListingsByType(@PathVariable String type) {
		return listingService.getListingsByType(type);
	}

	@PutMapping("/{id}")
	public AccommodationListing updateListing(
			@PathVariable Long id,
			@RequestBody ListingRequest request
	) {
		return listingService.updateListing(id, request);
	}

	@DeleteMapping("/{id}")
	public String deleteListing(@PathVariable Long id) {
		return listingService.deleteListing(id);
	}
}
