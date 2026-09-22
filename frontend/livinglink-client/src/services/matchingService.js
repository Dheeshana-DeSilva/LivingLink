import api from "./api";


export const getMatches = async () => {
  const response = await api.get("/api/matches/me");
  return Array.isArray(response.data) ? response.data : [];
};

const matchingService = {
  getMatches,
};

export default matchingService;
