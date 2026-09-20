import { useEffect, useState } from "react";
import { Star, Search, RefreshCw, AlertCircle, Trash2, MessageSquare } from "lucide-react";
import api from "../../services/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/admin/reviews");
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch {
        // Fallback: if backend doesn't have an admin aggregate, check /admin/reviews
        try {
          const fallbackRes = await api.get("/admin/reviews");
          setReviews(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch {
          setReviews([]);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this review? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      try {
        await api.delete(`/api/reviews/${id}`);
      } catch {
        await api.delete(`/admin/reviews/${id}`);
      }

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
      alert(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const commentMatch = (r.comment || "").toLowerCase().includes(q);
    const typeMatch = (r.reviewType || "").toLowerCase().includes(q);
    return commentMatch || typeMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Feedback Moderation
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Reviews
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Moderate submitted accommodation ratings and tenant comments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadReviews}
            className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reviews by comment keyword or review type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reviews Content */}
      <div className="mt-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center px-6 bg-slate-900/40 rounded-2xl border border-slate-800">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Reviews Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search
                ? "No reviews match your search query."
                : "No reviews have been recorded in the review service yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-400 text-xs font-bold">
                      <Star size={12} className="fill-amber-400" />
                      <span>{review.rating} / 5</span>
                    </div>

                    <span className="text-xs font-mono text-slate-500">
                      #{review.id}
                    </span>

                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                      {review.reviewType || "ACCOMMODATION"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>
                      Target: {review.listingId ? `Listing #${review.listingId}` : `User #${review.reviewedUserId}`}
                    </span>
                    <span>•</span>
                    <span>Reviewer: User #{review.reviewerId}</span>
                    {review.createdAt && (
                      <>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    <span>{deletingId === review.id ? "Removing..." : "Remove"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
