import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  MapPin,
  DollarSign,
  Building,
  Sparkles,
  RotateCcw,
  Eye,
  Plus,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import accommodationService from "../services/accommodationService";

function Accommodations() {
  const navigate = useNavigate();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth);

  // 16.2 & 16.13: Filter State & Search Text
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    minBudget: "",
    maxBudget: "",
    accommodationType: "",
  });

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 16.8: Fetch accommodations with searchFilters
  const fetchAccommodations = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = {
        ...searchFilters,
        search: search.trim() || undefined,
      };
      const data = await accommodationService.getAccommodations(params);
      setAccommodations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load accommodations. Please ensure the backend listing-service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations(filters);
  }, []);

  // 16.3: Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 16.6: Handle Search click
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    fetchAccommodations(filters);
  };

  // 16.9: Clear Filters
  const handleClearFilters = () => {
    const emptyFilters = {
      city: "",
      minBudget: "",
      maxBudget: "",
      accommodationType: "",
    };
    setSearch("");
    setFilters(emptyFilters);
    fetchAccommodations(emptyFilters);
  };

  // Delete accommodation handler
  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this accommodation listing?"
    );
    if (!confirmed) return;

    try {
      await accommodationService.deleteAccommodation(id);
      setAccommodations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete accommodation.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
              <Sparkles size={14} /> Search & Filter
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Find Accommodation
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-6">
              Search student housing, annexes, and rooms across Sri Lanka by city, budget, and type.
            </p>

            {isLoggedIn && (
              <Link
                to="/accommodations/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
              >
                <Plus size={18} /> Post an Accommodation
              </Link>
            )}
          </div>
        </div>

        {/* 16.13: General Search Bar */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-3.5 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search accommodation by keyword, city, or location..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-md"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2.5 top-2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </div>

        {/* 16.4: Filter UI Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            Filter Accommodations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City */}
            <div>
              <label className="block mb-2 text-xs font-medium text-slate-300">
                City
              </label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="e.g. Kandy, Colombo"
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            {/* Minimum Budget */}
            <div>
              <label className="block mb-2 text-xs font-medium text-slate-300">
                Minimum Budget ($ / Rs.)
              </label>
              <input
                type="number"
                name="minBudget"
                value={filters.minBudget}
                onChange={handleFilterChange}
                placeholder="20000"
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            {/* Maximum Budget */}
            <div>
              <label className="block mb-2 text-xs font-medium text-slate-300">
                Maximum Budget ($ / Rs.)
              </label>
              <input
                type="number"
                name="maxBudget"
                value={filters.maxBudget}
                onChange={handleFilterChange}
                placeholder="50000"
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            {/* Accommodation Type */}
            <div>
              <label className="block mb-2 text-xs font-medium text-slate-300">
                Accommodation Type
              </label>
              <select
                name="accommodationType"
                value={filters.accommodationType}
                onChange={handleFilterChange}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="" className="bg-slate-900">
                  All Types
                </option>
                <option value="ROOM" className="bg-slate-900">
                  Room
                </option>
                <option value="BOARDING" className="bg-slate-900">
                  Boarding
                </option>
                <option value="ANNEX" className="bg-slate-900">
                  Annex
                </option>
                <option value="HOUSE" className="bg-slate-900">
                  House
                </option>
                <option value="APARTMENT" className="bg-slate-900">
                  Apartment
                </option>
              </select>
            </div>
          </div>

          {/* 16.5: Filter Action Buttons */}
          <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-800/80">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Search size={14} /> Search
            </button>
            <button
              onClick={handleClearFilters}
              className="border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Found <strong className="text-white">{accommodations.length}</strong> matching accommodations
          </span>
          <button
            onClick={() => fetchAccommodations(filters)}
            className="text-blue-400 hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-blue-500" size={36} />
            <p className="text-xs">Searching accommodations...</p>
          </div>
        )}

        {/* Error Notification */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-3">
            <AlertCircle size={32} className="text-red-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Error</h3>
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={() => fetchAccommodations(filters)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && accommodations.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <Building size={48} className="text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Results Found</h3>
            <p className="text-xs text-slate-400">
              No accommodations matched your search filters. Try clearing some filters or searching for another city.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Accommodation Cards Grid */}
        {!loading && !error && accommodations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((item) => {
              const isOwner =
                String(item.ownerId) === String(userId) || role === "ADMIN";

              const rentAmount = item.rent ?? item.price ?? 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col group"
                >
                  {/* Photo Header */}
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
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/20">
                        {item.type || item.accommodationType || "Room"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white font-extrabold text-sm">
                        Rs. {rentAmount.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400"> /mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link to={`/accommodations/${item.id}`}>
                        <h3 className="font-bold text-white text-base hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                        <MapPin size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{item.address ? `${item.address}, ` : ""}{item.city}</span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <Link
                        to={`/accommodations/${item.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye size={14} /> View Details
                      </Link>

                      {isOwner && (
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/accommodations/${item.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={(e) => handleDelete(e, item.id)}
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

export default Accommodations;
