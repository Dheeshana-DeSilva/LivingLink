import api from "./api";

/**
 * Visit Scheduling Service
 * Connects to visit-service via API Gateway at /api/visits
 */

// Helper to format date and time to LocalDateTime string required by backend
const formatToLocalDateTime = (dateStr, timeStr) => {
  if (!dateStr) return "";
  const time = timeStr ? (timeStr.length === 5 ? `${timeStr}:00` : timeStr) : "10:00:00";
  return `${dateStr}T${time}`;
};

/**
 * Create a new visit request
 * POST /api/visits
 */
export const createVisit = async (visitData) => {
  const listingId = Number(visitData.listingId || visitData.accommodationId);
  const ownerId = Number(visitData.ownerId);
  
  let visitDate = visitData.visitDate;
  if (visitData.visitDate && visitData.visitTime) {
    visitDate = formatToLocalDateTime(visitData.visitDate, visitData.visitTime);
  }

  const payload = {
    listingId,
    ownerId,
    visitDate,
  };

  const response = await api.post("/api/visits", payload);
  return response.data;
};

/**
 * Get all visits requested by current user
 * GET /api/visits/requester/me
 */
export const getMyVisits = async () => {
  const response = await api.get("/api/visits/requester/me");
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Get all incoming visit requests for the owner's listings
 * GET /api/visits/owner/me
 */
export const getOwnerVisits = async () => {
  try {
    const response = await api.get("/api/visits/owner/me");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (err) {
    console.warn("Owner visits unavailable:", err?.message);
    return [];
  }
};

/**
 * Accept a visit request (Owner only)
 * PUT /api/visits/{id}/accept
 */
export const acceptVisit = async (id) => {
  const response = await api.put(`/api/visits/${id}/accept`);
  return response.data;
};

/**
 * Reject a visit request (Owner only)
 * PUT /api/visits/{id}/reject
 */
export const rejectVisit = async (id) => {
  const response = await api.put(`/api/visits/${id}/reject`);
  return response.data;
};

/**
 * Cancel a visit request (Requester only)
 * PUT /api/visits/{id}/cancel
 */
export const cancelVisit = async (id) => {
  const response = await api.put(`/api/visits/${id}/cancel`);
  return response.data;
};

const visitService = {
  createVisit,
  getMyVisits,
  getOwnerVisits,
  acceptVisit,
  rejectVisit,
  cancelVisit,
};

export default visitService;
