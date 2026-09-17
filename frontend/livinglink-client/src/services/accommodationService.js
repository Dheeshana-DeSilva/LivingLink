import api from "./api";

/**
 * Accommodation Service
 * Maps to backend `listing-service` via API Gateway at `/api/listings`
 * Automatically normalizes fields to match backend `ListingRequest` DTO
 */

const normalizePayload = (data) => {
  const rentVal = parseFloat(data.rent ?? data.price ?? 0);
  const depositVal = parseFloat(data.deposit ?? data.rent ?? data.price ?? 0);

  return {
    title: data.title || "",
    description: data.description || "",
    type: data.type || data.accommodationType || "Room",
    city: data.city || "",
    address: data.address || data.city || "",
    rent: isNaN(rentVal) ? 0 : rentVal,
    deposit: isNaN(depositVal) || depositVal <= 0 ? rentVal : depositVal,
    facilities: data.facilities || "",
    preferredGender: data.preferredGender || "ANY",
    imageUrl: data.imageUrl || null,
  };
};

export const getAccommodationById = async (id) => {
  const response = await api.get(`/api/listings/${id}`);
  return response.data;
};

export const getAllAccommodations = async () => {
  const response = await api.get("/api/listings");
  return response.data;
};

export const getAccommodationsByCity = async (city) => {
  const response = await api.get(`/api/listings/city/${encodeURIComponent(city)}`);
  return response.data;
};

export const getAccommodationsByType = async (type) => {
  const response = await api.get(`/api/listings/type/${encodeURIComponent(type)}`);
  return response.data;
};

export const createAccommodation = async (data) => {
  const payload = normalizePayload(data);
  const response = await api.post("/api/listings", payload);
  return response.data;
};

export const updateAccommodation = async (id, data) => {
  const payload = normalizePayload(data);
  const response = await api.put(`/api/listings/${id}`, payload);
  return response.data;
};

export const deleteAccommodation = async (id) => {
  const response = await api.delete(`/api/listings/${id}`);
  return response.data;
};

const accommodationService = {
  getAccommodationById,
  getAllAccommodations,
  getAccommodationsByCity,
  getAccommodationsByType,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};

export default accommodationService;
