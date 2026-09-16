import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  MapPin,
  DollarSign,
  Filter,
  Plus,
  Home,
  Users,
  Building,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { getAllListings, deleteListing } from "../services/listingService";

const ACCOMMODATION_TYPES = [
  "All Types",
  "Apartment",
  "Single Room",
  "Shared Room",
  "Studio",
  "House",
  "Hostel / Dormitory",
];

const GENDER_OPTIONS = [
  { value: "ALL", label: "All Genders" },
  { value: "ANY", label: "Any Gender Friendly" },
  { value: "MALE", label: "Male Only" },
  { value: "FEMALE", label: "Female Only" },
];

function Listings() {
  const navigate = useNavigate();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'my-listings'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Fetch listings on mount
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not connect to Listing Service. Make sure services are running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Handle owner deleting listing directly from list
  const handleDeleteListing = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing.");
    }
  };

  // Unique cities extracted from current listings
  const availableCities = useMemo(() => {
    const cities = listings.map((l) => l.city).filter(Boolean);
    return [...new Set(cities)];
  }, [listings]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Tab filter
      if (activeTab === "my-listings") {
        if (String(item.ownerId) !== String(userId)) return false;
      }

      // Search query (title, address, facilities, city)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesAddress = item.address?.toLowerCase().includes(query);
        const matchesCity = item.city?.toLowerCase().includes(query);
        const matchesFacilities = item.facilities?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress && !matchesCity && !matchesFacilities) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== "All Types") {
        if (item.type?.toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      // Gender filter
      if (selectedGender !== "ALL") {
        if (item.preferredGender !== selectedGender) return false;
      }

      // City filter
      if (selectedCity.trim()) {
        if (item.city?.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      // Max Rent filter
      if (maxRent && !isNaN(parseFloat(maxRent))) {
        if (item.rent && item.rent > parseFloat(maxRent)) return false;
      }

      return true;
    });
  }, [listings, activeTab, userId, searchQuery, selectedType, selectedGender, selectedCity, maxRent]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("All Types");
    setSelectedGender("ALL");
    setSelectedCity("");
    setMaxRent("");
  };

  const isOwnerUser = role === "LISTING_OWNER" || role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero / Header banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/20 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
              <Sparkles size={14} /> Verified Accommodations
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Find your ideal room or apartment.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-6">
              Browse student-friendly rooms, modern flats, and shared apartments with transparent rents and verified roommate communities.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {isLoggedIn ? (
                <Link
                  to="/add-listing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
                >
                  <Plus size={18} /> Post an Accommodation
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition-all"
                >
                  Log in to post a listing
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabs (All Listings vs My Listings) */}
        {isLoggedIn && (
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Accommodations ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab("my-listings")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "my-listings"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              My Posted Listings (
              {listings.filter((l) => String(l.ownerId) === String(userId)).length}
              )
            </button>
          </div>
        )}

        {/* Search and Filters Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, location, address, or amenities..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* City Dropdown */}
            <div className="w-full md:w-52">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {/* Secondary Filter Row (Always visible on desktop, toggle on mobile) */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 ${
              showFiltersMobile ? "block" : "hidden md:grid"
            }`}
          >
            {/* Type selector */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Accommodation Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ACCOMMODATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Gender */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Preferred Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Rent */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Max Rent ($)</label>
              <input
                type="number"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 text-xs font-medium transition-colors"
              >
                <RotateCcw size={14} /> Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between text-sm text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredListings.length}</strong> available listings
          </span>
          <button
            onClick={fetchListings}
            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-blue-500" size={36} />
            <p className="text-sm">Fetching accommodation listings...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-3">
            <AlertCircle size={32} className="text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Connection Error</h3>
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={fetchListings}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredListings.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <Building size={48} className="text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Listings Found</h3>
            <p className="text-sm text-slate-400">
              {activeTab === "my-listings"
                ? "You haven't posted any accommodations yet."
                : "No accommodation listings match your current filters. Try changing your search query or reset the filters."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
              >
                Reset All Filters
              </button>
              {isLoggedIn && (
                <Link
                  to="/add-listing"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Post a Room
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const isOwner =
                String(item.ownerId) === String(userId) || role === "ADMIN";

              const facilities = item.facilities
                ? item.facilities.split(",").map((f) => f.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col group"
                >
                  {/* Image Card Header */}
                  <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-600">
                        <Building size={40} className="mb-1 opacity-60" />
                        <span className="text-xs">No image provided</span>
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/20">
                        {item.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/20">
                        {item.preferredGender === "ANY"
                          ? "Any Gender"
                          : item.preferredGender}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white font-extrabold text-sm">
                        ${item.rent?.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400"> /mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Title */}
                      <Link to={`/listings/${item.id}`}>
                        <h3 className="font-bold text-white text-base hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Address & City */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                        <MapPin size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{item.address}, {item.city}</span>
                      </div>

                      {/* Description Snippet */}
                      {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}

                      {/* Facilities Chips */}
                      {facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {facilities.slice(0, 3).map((facility, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60"
                            >
                              {facility}
                            </span>
                          ))}
                          {facilities.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px]">
                              +{facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <Link
                        to={`/listings/${item.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye size={14} /> View Details
                      </Link>

                      {isOwner && (
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/edit-listing/${item.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={(e) => handleDeleteListing(e, item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Listings;