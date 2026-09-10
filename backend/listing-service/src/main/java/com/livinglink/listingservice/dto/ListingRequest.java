package com.livinglink.listingservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ListingRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Rent is required")
    @Positive(message = "Rent must be a positive number")
    private Double rent;

    @NotNull(message = "Deposit is required")
    @Positive(message = "Deposit must be a positive number")
    private Double deposit;

    private String facilities;

    @NotBlank(message = "Preferred gender is required")
    private String preferredGender;

    private String imageUrl;

    public ListingRequest() {
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getType() { return type; }
    public String getCity() { return city; }
    public String getAddress() { return address; }
    public Double getRent() { return rent; }
    public Double getDeposit() { return deposit; }
    public String getFacilities() { return facilities; }
    public String getPreferredGender() { return preferredGender; }
    public String getImageUrl() { return imageUrl; }
}
