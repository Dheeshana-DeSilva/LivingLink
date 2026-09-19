import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Star, Send, Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import reviewService from "../../services/reviewService";

const RATING_LABELS = {
  1: "Poor (1/5)",
  2: "Fair (2/5)",
  3: "Good (3/5)",
  4: "Very Good (4/5)",
  5: "Excellent (5/5)",
};

const ReviewForm = ({
  accommodationId,
  userId,
  reviewType = "ACCOMMODATION",
  onReviewCreated,
}) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <Lock className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-base font-semibold text-white">Log in to leave a review</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Only verified tenants with an accepted visit are eligible to submit reviews for this accommodation.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim().length < 5) {
      setError("Please write at least 5 characters for your review comment.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        rating,
        comment: comment.trim(),
        reviewType,
        ...(accommodationId && { accommodationId }),
        ...(userId && { userId }),
      };

      const newReview = await reviewService.createReview(payload);

      setSuccess("Your review has been submitted successfully!");
      setComment("");
      setRating(5);

      if (onReviewCreated) {
        onReviewCreated(newReview);
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        (err.response?.data?.validationErrors &&
          Object.values(err.response.data.validationErrors).join(", ")) ||
        "Failed to submit review. Please try again.";

      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          Write a Review
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Share your authentic experience with the LivingLink community.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Submission Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Success</span>
            <span>{success}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors focus:outline-none"
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={`w-7 h-7 transition-all ${
                        isFilled
                          ? "text-amber-400 fill-amber-400 scale-105"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-sm font-medium text-amber-300/90 ml-2">
              {RATING_LABELS[hoverRating || rating]}
            </span>
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="review-comment"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
            >
              Review Details
            </label>
            <span
              className={`text-xs ${
                comment.length > 1000
                  ? "text-red-400"
                  : comment.length >= 5
                  ? "text-slate-400"
                  : "text-amber-400/80"
              }`}
            >
              {comment.length}/1000 (min 5 chars)
            </span>
          </div>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            required
            placeholder="Describe the accommodation, neighborhood, cleanliness, or landlord communication..."
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-y leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || comment.trim().length < 5}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
