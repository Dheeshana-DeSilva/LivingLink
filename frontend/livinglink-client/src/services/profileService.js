import api from "./api";

/**
 * Get the current user's profile.
 * GET /api/profiles/me
 */
export const getMyProfile = async () => {
  const response = await api.get("/api/profiles/me");
  return response.data;
};

/**
 * Create a new profile for the current user.
 * POST /api/profiles
 */
export const createProfile = async (profileData) => {
  const response = await api.post("/api/profiles", profileData);
  return response.data;
};

/**
 * Update the current user's profile.
 * PUT /api/profiles/me
 */
export const updateProfile = async (profileData) => {
  const response = await api.put("/api/profiles/me", profileData);
  return response.data;
};
