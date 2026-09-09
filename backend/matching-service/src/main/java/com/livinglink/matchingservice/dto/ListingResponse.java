package com.livinglink.matchingservice.dto;

public class ListingResponse {

    private Long id;
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
    private String status;

    public ListingResponse() {
    }

    public Long getId() {
        return id;
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

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setRent(Double rent) {
        this.rent = rent;
    }

    public void setDeposit(Double deposit) {
        this.deposit = deposit;
    }

    public void setFacilities(String facilities) {
        this.facilities = facilities;
    }

    public void setPreferredGender(String preferredGender) {
        this.preferredGender = preferredGender;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
