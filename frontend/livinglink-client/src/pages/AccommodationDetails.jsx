import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  ArrowLeft,
  Building,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import accommodationService from "../services/accommodationService";
import reviewService from "../services/reviewService";
import ReviewForm from "../components/reviews/ReviewForm";
import ReviewList from "../components/reviews/ReviewList";

function AccommodationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, role, isLoggedIn } = useSelector((state) => state.auth);

  const [accommodation, setAccommodation] = useState(null);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, reviewCount: 0 });
  const [refreshReviewTrigger, setRefreshReviewTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchReviewSummary = async (listingId) => {
    try {
      const summary = await reviewService.getListingReviewSummary(listingId);
      if (summary) {
        setReviewSummary(summary);
      }
    } catch (err) {
      console.warn("Could not load review summary", err);
    }
  };

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await accommodationService.getAccommodationById(id);
        setAccommodation(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load accommodation. Please make sure the service is running."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
      fetchReviewSummary(id);
    }
  }, [id]);

  const isOwner =
    accommodation &&
    (String(accommodation.ownerId) === String(userId) || role === "ADMIN");

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await accommodationService.deleteAccommodation(id);
      navigate("/listings");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete accommodation.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-16">
        <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
        <p className="text-sm text-slate-400">Loading accommodation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <AlertCircle size={40} className="text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Error Loading Accommodation</h2>
          <p className="text-sm text-red-400">{error}</p>
          <div className="pt-2">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Accommodations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <Building size={40} className="text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Accommodation Not Found</h2>
          <p className="text-sm text-slate-400">
            No accommodation was found with ID: <span className="text-white font-semibold">{id}</span>.
          </p>
          <div className="pt-2">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const facilitiesList = accommodation.facilities
    ? accommodation.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Accommodations
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 size={14} />
              {copied ? "Link Copied!" : "Share"}
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/edit-listing/${accommodation.id}`}
                  className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit size={14} /> Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold text-white">Delete Accommodation</h3>
              </div>
              <p className="text-sm text-slate-300">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">"{accommodation.title}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium flex items-center gap-2"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-80 sm:h-96 w-full">
              {accommodation.imageUrl ? (
                <img
                  src={accommodation.imageUrl}
                  alt={accommodation.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950/40 flex flex-col items-center justify-center text-slate-600">
                  <Building size={56} className="mb-2 opacity-50" />
                  <span className="text-sm">No photo uploaded</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-md">
                  {accommodation.type || "Apartment"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                  {accommodation.status || "AVAILABLE"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  {reviewSummary.averageRating > 0
                    ? `${reviewSummary.averageRating.toFixed(1)} (${reviewSummary.reviewCount})`
                    : "No reviews yet"}
                </span>
              </div>

              {/* Overlay Title */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/75 backdrop-blur-md border border-slate-800/80">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {accommodation.title}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <MapPin size={16} className="text-emerald-400 shrink-0" />
                    <span>
                      {accommodation.address}, {accommodation.city}
                    </span>
                  </div>
                  {reviewSummary.reviewCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                      <span>{"⭐".repeat(Math.min(5, Math.max(1, Math.round(reviewSummary.averageRating))))}</span>
                      <span className="text-white">{reviewSummary.averageRating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">
                        ({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Accommodation Type</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Building size={16} className="text-blue-400" />
                  <span>{accommodation.type}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Preferred Gender</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Users size={16} className="text-purple-400" />
                  <span>
                    {accommodation.preferredGender === "ANY"
                      ? "Any Gender"
                      : accommodation.preferredGender}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Accommodation ID</span>
                <div className="text-sm font-semibold text-slate-300">
                  #{accommodation.id}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-3">Description</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {accommodation.description || "No description provided for this accommodation."}
              </p>
            </div>

            {/* Facilities & Amenities */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Facilities & Amenities
              </h2>
              {facilitiesList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilitiesList.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200"
                    >
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{facility}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Standard utilities included.</p>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Actions */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md sticky top-24 shadow-xl">
              <div className="border-b border-slate-800 pb-5 mb-5">
                {reviewSummary.reviewCount > 0 && (
                  <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 w-fit text-xs text-amber-300 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{reviewSummary.averageRating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">
                      ({reviewSummary.reviewCount} {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                  Monthly Rent
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    Rs. {accommodation.rent?.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm">/ month</span>
                </div>
                {accommodation.deposit && (
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-amber-400" />
                    <span>Security Deposit: </span>
                    <span className="text-slate-200 font-medium">
                      Rs. {accommodation.deposit?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      navigate(`/visits/schedule/${accommodation.id}`);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} /> Schedule a Visit
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    Log In to Request Visit
                  </Link>
                )}

                <button
                  onClick={handleShare}
                  className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={16} /> Share Property
                </button>
              </div>

              {/* Owner Trust badge */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    O
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Owner Listing</h4>
                    <span className="text-xs text-slate-400">Owner ID: #{accommodation.ownerId}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Verified on LivingLink Platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews & Ratings Section */}
        <div className="mt-12 space-y-8 pt-8 border-t border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              Reviews & Ratings
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Verified resident and visitor reviews for this accommodation.
            </p>
          </div>

          <ReviewList
            accommodationId={accommodation.id}
            refreshTrigger={refreshReviewTrigger}
            onReviewDeleted={() => {
              fetchReviewSummary(accommodation.id);
            }}
          />

          <ReviewForm
            accommodationId={accommodation.id}
            onReviewCreated={() => {
              setRefreshReviewTrigger((prev) => prev + 1);
              fetchReviewSummary(accommodation.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AccommodationDetails;
