package com.livinglink.listingservice.repository;

import com.livinglink.listingservice.entity.AccommodationListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccommodationListingRepository extends JpaRepository<AccommodationListing, Long> {

	List<AccommodationListing> findByOwnerId(Long ownerId);

	List<AccommodationListing> findByCityIgnoreCase(String city);

	List<AccommodationListing> findByTypeIgnoreCase(String type);
}
