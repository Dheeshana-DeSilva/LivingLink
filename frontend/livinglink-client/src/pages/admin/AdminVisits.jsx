import { useEffect, useState } from "react";
import { Calendar, Search, RefreshCw, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import api from "../../services/api";

const AdminVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/admin/visits");
        setVisits(Array.isArray(response.data) ? response.data : []);
      } catch {
        // Fallback: try querying /api/visits/owner/me or /api/visits/requester/me
        try {
          const fallbackRes = await api.get("/api/visits/owner/me");
          setVisits(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch {
          setVisits([]);
        }
      }
    } catch (err) {
      console.error("Failed to load visits", err);
      setError(err.response?.data?.message || "Failed to load visits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "COMPLETED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "PENDING":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const filteredVisits = visits.filter((v) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const listingMatch = (v.listingTitle || v.listing?.title || "").toLowerCase().includes(q);
    const statusMatch = (v.status || "").toLowerCase().includes(q);
    return listingMatch || statusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Scheduling Moderation
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Visits
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspect accommodation viewing appointments and status records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadVisits}
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
            placeholder="Search visits by listing title or status..."
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

      {/* Visits Table */}
      <div className="mt-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">Loading visits...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="py-20 text-center px-6">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Visits Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search
                ? "No visits match your search query."
                : "No visit scheduling requests have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm text-slate-300">
              <thead className="bg-slate-850/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Listing</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Requester</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      #{visit.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-white">
                      {visit.listingTitle || visit.listing?.title || `Listing #${visit.listingId}`}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {visit.visitDate ? new Date(visit.visitDate).toLocaleString() : "—"}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                      User #{visit.requesterId}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                          visit.status
                        )}`}
                      >
                        {visit.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVisits;
