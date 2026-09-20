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

// Retrieve accommodations with search and filter parameters (Step 16)
export const getAccommodations = async (filters = {}) => {
  const params = {};
  if (filters.city) params.city = filters.city;
  if (filters.minBudget) params.minBudget = filters.minBudget;
  if (filters.maxBudget) params.maxBudget = filters.maxBudget;
  if (filters.accommodationType) params.accommodationType = filters.accommodationType;
  if (filters.search) params.search = filters.search;

  const response = await api.get("/api/listings", { params });
  let data = response.data;

  if (Array.isArray(data)) {
    if (filters.city && filters.city.trim()) {
      const cityLower = filters.city.trim().toLowerCase();
      data = data.filter((item) => item.city?.toLowerCase().includes(cityLower));
    }
    if (filters.minBudget && !isNaN(parseFloat(filters.minBudget))) {
      const min = parseFloat(filters.minBudget);
      data = data.filter((item) => (item.rent ?? item.price ?? 0) >= min);
    }
    if (filters.maxBudget && !isNaN(parseFloat(filters.maxBudget))) {
      const max = parseFloat(filters.maxBudget);
      data = data.filter((item) => (item.rent ?? item.price ?? 0) <= max);
    }
    if (
      filters.accommodationType &&
      filters.accommodationType !== "" &&
      filters.accommodationType !== "All Types"
    ) {
      const typeLower = filters.accommodationType.toLowerCase();
      data = data.filter((item) => item.type?.toLowerCase().includes(typeLower));
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.city?.toLowerCase().includes(q) ||
          item.address?.toLowerCase().includes(q)
      );
    }
    return data;
  }

  return [];
};


export const getAllAccommodations = async () => {
  return getAccommodations({});
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
  getAccommodations,
  getAllAccommodations,
  getAccommodationsByCity,
  getAccommodationsByType,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};

export default accommodationService;
