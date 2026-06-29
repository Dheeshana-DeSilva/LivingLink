package com.livinglink.listingservice.service;

import com.livinglink.listingservice.dto.ListingRequest;
import com.livinglink.listingservice.entity.AccommodationListing;
import com.livinglink.listingservice.repository.AccommodationListingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccommodationListingService {

	private final AccommodationListingRepository listingRepository;

	public AccommodationListingService(AccommodationListingRepository listingRepository) {
		this.listingRepository = listingRepository;
	}

	public AccommodationListing createListing(ListingRequest request) {
		AccommodationListing listing = new AccommodationListing();

		listing.setOwnerId(request.getOwnerId());
		listing.setTitle(request.getTitle());
		listing.setDescription(request.getDescription());
		listing.setType(request.getType());
		listing.setCity(request.getCity());
		listing.setAddress(request.getAddress());
		listing.setRent(request.getRent());
		listing.setDeposit(request.getDeposit());
		listing.setFacilities(request.getFacilities());
		listing.setPreferredGender(request.getPreferredGender());
		listing.setImageUrl(request.getImageUrl());
		listing.setStatus("AVAILABLE");
		listing.setCreatedAt(LocalDateTime.now());
		listing.setUpdatedAt(LocalDateTime.now());

		return listingRepository.save(listing);
	}

	public List<AccommodationListing> getAllListings() {
		return listingRepository.findAll();
	}

	public AccommodationListing getListingById(Long id) {
		return listingRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Listing not found"));
	}

	public List<AccommodationListing> getListingsByOwnerId(Long ownerId) {
		return listingRepository.findByOwnerId(ownerId);
	}

	public List<AccommodationListing> getListingsByCity(String city) {
		return listingRepository.findByCityIgnoreCase(city);
	}

	public List<AccommodationListing> getListingsByType(String type) {
		return listingRepository.findByTypeIgnoreCase(type);
	}

	public AccommodationListing updateListing(Long id, ListingRequest request) {
		AccommodationListing listing = getListingById(id);

		listing.setTitle(request.getTitle());
		listing.setDescription(request.getDescription());
		listing.setType(request.getType());
		listing.setCity(request.getCity());
		listing.setAddress(request.getAddress());
		listing.setRent(request.getRent());
		listing.setDeposit(request.getDeposit());
		listing.setFacilities(request.getFacilities());
		listing.setPreferredGender(request.getPreferredGender());
		listing.setImageUrl(request.getImageUrl());
		listing.setUpdatedAt(LocalDateTime.now());

		return listingRepository.save(listing);
	}

	public String deleteListing(Long id) {
		AccommodationListing listing = getListingById(id);
		listingRepository.delete(listing);
		return "Listing deleted successfully";
	}
}
