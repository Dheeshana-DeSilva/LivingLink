import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import api from "../../services/api";

const AdminAccommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadAccommodations = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/listings");
        setAccommodations(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        // Also attempt /admin/accommodations
        try {
          const fallbackRes = await api.get("/admin/accommodations");
          setAccommodations(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch {
          setAccommodations([]);
          setError(err.response?.data?.message || "Failed to load accommodations");
        }
      }
    } catch (err) {
      console.error("Failed to load accommodations", err);
      setError(err.response?.data?.message || "Failed to load accommodations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccommodations();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this accommodation listing? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      try {
        await api.delete(`/api/listings/${id}`);
      } catch (err) {
        // Fallback to /admin/accommodations/${id}
        await api.delete(`/admin/accommodations/${id}`);
      }

      setAccommodations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete accommodation", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete accommodation. Please ensure you have administrative permissions."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAccommodations = accommodations.filter((acc) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const titleMatch = (acc.title || "").toLowerCase().includes(q);
    const cityMatch = (acc.city || "").toLowerCase().includes(q);
    const typeMatch = (acc.type || "").toLowerCase().includes(q);
    return titleMatch || cityMatch || typeMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Property Moderation
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Accommodations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review listed properties, inspect details, and remove inappropriate entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAccommodations}
            className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search accommodations by title, city, or type..."
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

      {/* Listings Display */}
      <div className="mt-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">Loading accommodations...</p>
          </div>
        ) : filteredAccommodations.length === 0 ? (
          <div className="py-20 text-center px-6 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Accommodations Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search
                ? "No accommodations match your search query."
                : "No active accommodations have been listed yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAccommodations.map((acc) => {
              const rent = acc.rent ?? acc.monthlyRent ?? acc.price ?? 0;

              return (
                <div
                  key={acc.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {acc.imageUrl ? (
                      <img
                        src={acc.imageUrl}
                        alt={acc.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        <Building size={24} />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {acc.type || "Room"}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          #{acc.id}
                        </span>
                      </div>

                      <h2 className="font-bold text-base text-white hover:text-blue-400 transition-colors">
                        {acc.title}
                      </h2>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={13} className="text-emerald-400 shrink-0" />
                        <span>{acc.address ? `${acc.address}, ` : ""}{acc.city}</span>
                      </div>

                      <p className="text-xs font-semibold text-slate-200 pt-0.5">
                        LKR {Number(rent).toLocaleString()} <span className="text-slate-400 font-normal">/ month</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      to={`/accommodations/${acc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(acc.id)}
                      disabled={deletingId === acc.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      <span>{deletingId === acc.id ? "Removing..." : "Remove"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccommodations;
