import api from "./api";

/**
 * Preference Service
 * Maps to backend `preference-service` via API Gateway at `/api/preferences`
 */

const normalizePreferencePayload = (data) => {
  return {
    preferredCity: data.preferredCity ? data.preferredCity.trim() : "",
    minBudget: parseFloat(data.minBudget) || 0,
    maxBudget: parseFloat(data.maxBudget) || 0,
    preferredGender: data.preferredGender || "Any",
    cleanlinessLevel: data.cleanlinessLevel || "",
    sleepSchedule: data.sleepSchedule || "",
    smokingPreference: data.smokingPreference || "",
    petPreference: data.petPreference || "",
    cookingHabit: data.cookingHabit || "",
    lifestyleType: data.lifestyleType || "",
  };
};

/**
 * Get current user's roommate preferences
 * GET /api/preferences/me
 */
export const getPreferences = async () => {
  const response = await api.get("/api/preferences/me");
  return response.data;
};

/**
 * Create new roommate preferences
 * POST /api/preferences
 */
export const savePreferences = async (data) => {
  const payload = normalizePreferencePayload(data);
  const response = await api.post("/api/preferences", payload);
  return response.data;
};

/**
 * Update existing roommate preferences
 * PUT /api/preferences/me
 */
export const updatePreferences = async (data) => {
  const payload = normalizePreferencePayload(data);
  const response = await api.put("/api/preferences/me", payload);
  return response.data;
};

const preferenceService = {
  getPreferences,
  savePreferences,
  updatePreferences,
};

export default preferenceService;
