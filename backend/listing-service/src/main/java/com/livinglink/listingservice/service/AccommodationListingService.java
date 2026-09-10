package com.livinglink.listingservice.service;

import com.livinglink.listingservice.dto.ListingRequest;
import com.livinglink.listingservice.entity.AccommodationListing;
import com.livinglink.listingservice.exception.ResourceNotFoundException;
import com.livinglink.listingservice.exception.UnauthorizedException;
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

	public AccommodationListing createListing(Long ownerId, ListingRequest request) {
		AccommodationListing listing = new AccommodationListing();

		listing.setOwnerId(ownerId);
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
				.orElseThrow(() -> new ResourceNotFoundException("Listing not found with ID: " + id));
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

	public AccommodationListing updateListing(Long id, Long ownerId, ListingRequest request) {
		AccommodationListing listing = getListingById(id);
		
		if (!listing.getOwnerId().equals(ownerId)) {
			throw new UnauthorizedException("You are not authorized to update this listing");
		}

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

	public String deleteListing(Long id, Long ownerId) {
		AccommodationListing listing = getListingById(id);
		
		if (!listing.getOwnerId().equals(ownerId)) {
			throw new UnauthorizedException("You are not authorized to delete this listing");
		}
		
		listingRepository.delete(listing);
		return "Listing deleted successfully";
	}
}
