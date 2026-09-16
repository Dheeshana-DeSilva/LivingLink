import api from "./api";

/**
 * Accommodation Listing API Service
 * Interacts with listing-service through API Gateway at /api/listings
 */

// Get all listings
export const getAllListings = async () => {
  const response = await api.get("/api/listings");
  return response.data;
};

// Get single listing by ID
export const getListingById = async (id) => {
  const response = await api.get(`/api/listings/${id}`);
  return response.data;
};

// Get listings by owner ID
export const getListingsByOwner = async (ownerId) => {
  const response = await api.get(`/api/listings/owner/${ownerId}`);
  return response.data;
};

// Get listings by city
export const getListingsByCity = async (city) => {
  const response = await api.get(`/api/listings/city/${encodeURIComponent(city)}`);
  return response.data;
};

// Get listings by accommodation type
export const getListingsByType = async (type) => {
  const response = await api.get(`/api/listings/type/${encodeURIComponent(type)}`);
  return response.data;
};

// Create a new accommodation listing (Owner/Admin)
export const createListing = async (listingData) => {
  const response = await api.post("/api/listings", listingData);
  return response.data;
};

// Update an existing accommodation listing
export const updateListing = async (id, listingData) => {
  const response = await api.put(`/api/listings/${id}`, listingData);
  return response.data;
};

// Delete an accommodation listing
export const deleteListing = async (id) => {
  const response = await api.delete(`/api/listings/${id}`);
  return response.data;
};
