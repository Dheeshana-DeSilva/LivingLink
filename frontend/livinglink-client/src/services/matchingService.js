import api from "./api";

/**
 * Matching Service
 * Connects to matching-service via API Gateway at /api/matches
 */

/**
 * Get personalized ranked matching accommodations & roommates for the current user
 * GET /api/matches/me
 */
export const getMatches = async () => {
  const response = await api.get("/api/matches/me");
  return response.data;
};

const matchingService = {
  getMatches,
};

export default matchingService;
