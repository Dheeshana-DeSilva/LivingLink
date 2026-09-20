import api from "./api";

/**
 * Review Service
 * Connects to review-service via API Gateway at /api/reviews
 */

/**
 * Create a new review
 * POST /api/reviews
 *
 * Payload format:
 * {
 *   listingId?: number,
 *   reviewedUserId?: number,
 *   rating: number (1-5),
 *   comment: string (5-1000 chars),
 *   reviewType: "ACCOMMODATION" | "ROOMMATE"
 * }
 */
export const createReview = async (reviewData) => {
  const payload = {
    rating: Number(reviewData.rating),
    comment: reviewData.comment?.trim(),
    reviewType: reviewData.reviewType || (reviewData.accommodationId || reviewData.listingId ? "ACCOMMODATION" : "ROOMMATE"),
  };

  if (reviewData.accommodationId || reviewData.listingId) {
    payload.listingId = Number(reviewData.accommodationId || reviewData.listingId);
  }

  if (reviewData.reviewedUserId || reviewData.userId) {
    payload.reviewedUserId = Number(reviewData.reviewedUserId || reviewData.userId);
  }

  const response = await api.post("/api/reviews", payload);
  return response.data;
};

/**
 * Get all reviews for a listing/accommodation
 * GET /api/reviews/listing/{listingId}
 */
export const getAccommodationReviews = async (accommodationId) => {
  const response = await api.get(`/api/reviews/listing/${accommodationId}`);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Get review summary (average rating & count) for a listing
 * GET /api/reviews/listing/{listingId}/summary
 */
export const getListingReviewSummary = async (accommodationId) => {
  const response = await api.get(`/api/reviews/listing/${accommodationId}/summary`);
  return response.data || { targetId: Number(accommodationId), averageRating: 0, reviewCount: 0 };
};

/**
 * Get all reviews for a user (as a roommate)
 * GET /api/reviews/user/{userId}
 */
export const getRoommateReviews = async (userId) => {
  const response = await api.get(`/api/reviews/user/${userId}`);
  return response.data;
};

/**
 * Get review summary for a user
 * GET /api/reviews/user/{userId}/summary
 */
export const getUserReviewSummary = async (userId) => {
  const response = await api.get(`/api/reviews/user/${userId}/summary`);
  return response.data;
};

/**
 * Update an existing review
 * PUT /api/reviews/{id}
 */
export const updateReview = async (id, reviewData) => {
  const response = await api.put(`/api/reviews/${id}`, reviewData);
  return response.data;
};

/**
 * Delete a review by ID
 * DELETE /api/reviews/{id}
 */
export const deleteReview = async (id) => {
  const response = await api.delete(`/api/reviews/${id}`);
  return response.data;
};

const reviewService = {
  createReview,
  getAccommodationReviews,
  getListingReviewSummary,
  getRoommateReviews,
  getUserReviewSummary,
  updateReview,
  deleteReview,
};

export default reviewService;
