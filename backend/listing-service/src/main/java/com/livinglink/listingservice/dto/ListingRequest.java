package com.livinglink.listingservice.dto;

public class ListingRequest {

	private Long ownerId;
	private String title;
	private String description;
	private String type;
	private String city;
	private String address;
	private Double rent;
	private Double deposit;
	private String facilities;
	private String preferredGender;
	private String imageUrl;

	public ListingRequest() {
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public String getType() {
		return type;
	}

	public String getCity() {
		return city;
	}

	public String getAddress() {
		return address;
	}

	public Double getRent() {
		return rent;
	}

	public Double getDeposit() {
		return deposit;
	}

	public String getFacilities() {
		return facilities;
	}

	public String getPreferredGender() {
		return preferredGender;
	}

	public String getImageUrl() {
		return imageUrl;
	}
}
