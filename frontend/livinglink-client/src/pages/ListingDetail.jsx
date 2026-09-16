import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  ShieldCheck,
  Building,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getListingById, deleteListing } from "../services/listingService";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, role, isLoggedIn } = useSelector((state) => state.auth);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        setError(err.response?.data?.message || "Listing not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const isOwner =
    listing &&
    (String(listing.ownerId) === String(userId) || role === "ADMIN");

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteListing(id);
      navigate("/listings");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="text-sm">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <AlertCircle size={44} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Unable to Load Listing</h2>
          <p className="text-slate-400 text-sm mb-6">{error || "This listing could not be found."}</p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to All Listings
          </Link>
        </div>
      </div>
    );
  }

  const facilitiesList = listing.facilities
    ? listing.facilities.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Breadcrumbs & Owner Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Listings
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 size={14} />
              {copied ? "Link Copied!" : "Share"}
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/edit-listing/${listing.id}`}
                  className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit size={14} /> Edit Listing
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold text-white">Delete this listing?</h3>
              </div>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete <span className="text-white font-medium">"{listing.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Gallery & Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center: Details & Gallery (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visual Cover */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-80 sm:h-96 w-full group">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950/40 flex flex-col items-center justify-center text-slate-600">
                  <Building size={64} className="mb-2 opacity-50" />
                  <span className="text-sm">No photo uploaded</span>
                </div>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-md">
                  {listing.type}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                  {listing.status || "AVAILABLE"}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <MapPin size={16} className="text-emerald-400 shrink-0" />
                  <span>{listing.address}, {listing.city}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Preferred Gender</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Users size={16} className="text-purple-400" />
                  <span>{listing.preferredGender || "ANY"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Accommodation Type</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Building size={16} className="text-blue-400" />
                  <span>{listing.type}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Status</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                  <ShieldCheck size={16} />
                  <span>Verified Available</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-3">About This Accommodation</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {listing.description || "No specific description provided by the owner."}
              </p>
            </div>

            {/* Facilities & Amenities */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Included Facilities & Amenities
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

          {/* Right Column: Pricing & Booking Sidebar */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md sticky top-24 shadow-xl">
              <div className="border-b border-slate-800 pb-5 mb-5">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                  Monthly Rent
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    ${listing.rent?.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm">/ month</span>
                </div>
                {listing.deposit && (
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-amber-400" />
                    <span>Security Deposit: </span>
                    <span className="text-slate-200 font-medium">
                      ${listing.deposit?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      alert("Schedule a Visit feature will connect to visit-service in the next stage!");
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
                    <span className="text-xs text-slate-400">Owner ID: #{listing.ownerId}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Protected by LivingLink Roommate Trust & Safety
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
