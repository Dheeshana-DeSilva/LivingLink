import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  Trash2,
  MessageSquare,
  Loader2,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import reviewService from "../../services/reviewService";

const ReviewList = ({
  accommodationId,
  userId,
  refreshTrigger = 0,
  onReviewDeleted,
}) => {
  const currentUserId = useSelector((state) => state.auth.userId);

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let reviewData = [];
      let summaryData = { averageRating: 0, reviewCount: 0 };

      if (accommodationId) {
        const [revRes, sumRes] = await Promise.allSettled([
          reviewService.getAccommodationReviews(accommodationId),
          reviewService.getListingReviewSummary(accommodationId),
        ]);

        if (revRes.status === "fulfilled") {
          reviewData = revRes.value || [];
        } else {
          throw revRes.reason;
        }

        if (sumRes.status === "fulfilled" && sumRes.value) {
          summaryData = sumRes.value;
        }
      } else if (userId) {
        const [revRes, sumRes] = await Promise.allSettled([
          reviewService.getRoommateReviews(userId),
          reviewService.getUserReviewSummary(userId),
        ]);

        if (revRes.status === "fulfilled") {
          reviewData = revRes.value || [];
        } else {
          throw revRes.reason;
        }

        if (sumRes.status === "fulfilled" && sumRes.value) {
          summaryData = sumRes.value;
        }
      }

      setReviews(reviewData);

      // If summary API didn't return count, compute fallback
      if (!summaryData.reviewCount && reviewData.length > 0) {
        const avg =
          reviewData.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviewData.length;
        setSummary({
          averageRating: Math.round(avg * 10) / 10,
          reviewCount: reviewData.length,
        });
      } else {
        setSummary(summaryData);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load reviews. Please make sure the service is running."
      );
    } finally {
      setLoading(false);
    }
  }, [accommodationId, userId]);

  useEffect(() => {
    if (accommodationId || userId) {
      loadReviews();
    }
  }, [accommodationId, userId, refreshTrigger, loadReviews]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to remove your review?")) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await reviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      if (onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
      // Re-trigger summary calculation
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading verified reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={loadReviews}
          className="px-4 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary Score Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-amber-400 leading-none">
                {summary.averageRating > 0
                  ? summary.averageRating.toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-500/80 mt-1">
                Out of 5
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(summary.averageRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Based on{" "}
                <span className="font-semibold text-white">
                  {summary.reviewCount || reviews.length}
                </span>{" "}
                {summary.reviewCount === 1 ? "review" : "verified reviews"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              100% Verified
            </span>
            <span>Only guests with accepted visits can review</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-semibold text-white">No reviews yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Be the first verified visitor to share feedback about this accommodation!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isAuthor =
              currentUserId &&
              String(review.reviewerId) === String(currentUserId);

            return (
              <div
                key={review.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 transition-all hover:border-slate-700/80"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Reviewer Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">
                          {isAuthor
                            ? "You (Verified Visitor)"
                            : `Verified Visitor #${review.reviewerId}`}
                        </h4>
                        {isAuthor && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Your Review
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-amber-300">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="flex items-center gap-3">
                    {review.createdAt && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}

                    {isAuthor && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors focus:outline-none"
                        title="Delete your review"
                      >
                        {deletingId === review.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-300 leading-relaxed pl-13 pt-1 whitespace-pre-line">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
