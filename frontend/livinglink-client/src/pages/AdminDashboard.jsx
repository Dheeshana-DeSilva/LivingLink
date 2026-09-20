import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building,
  Calendar,
  Star,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    accommodations: 0,
    visits: 0,
    reviews: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // Attempt /api/admin/dashboard or /admin/dashboard
      try {
        const response = await api.get("/api/admin/dashboard");
        if (response.data) {
          setStats(response.data);
          return;
        }
      } catch {
        // Fallback: query microservices directly to aggregate statistics
        const [listingsRes, visitsRes] = await Promise.allSettled([
          api.get("/api/listings"),
          api.get("/api/visits/owner/me"),
        ]);

        const accommodationsCount =
          listingsRes.status === "fulfilled" && Array.isArray(listingsRes.value?.data)
            ? listingsRes.value.data.length
            : 0;

        const visitsCount =
          visitsRes.status === "fulfilled" && Array.isArray(visitsRes.value?.data)
            ? visitsRes.value.data.length
            : 0;

        setStats({
          users: 0,
          accommodations: accommodationsCount,
          visits: visitsCount,
          reviews: 0,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-400 p-10">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-base font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-10">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-md">
          <ShieldAlert className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            System Overview
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry and management controls for the LivingLink platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Total Users */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">
            {stats.users?.toLocaleString() ?? 0}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
            <span className="text-blue-400 font-medium flex items-center gap-0.5">
              <TrendingUp size={12} /> Active
            </span>
            <span>accounts in system</span>
          </div>
        </div>

        {/* Accommodations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Accommodations
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Building size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">
            {stats.accommodations?.toLocaleString() ?? 0}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
            <span className="text-indigo-400 font-medium flex items-center gap-0.5">
              <CheckCircle2 size={12} /> Verified
            </span>
            <span>live properties</span>
          </div>
        </div>

        {/* Visits */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Visits
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">
            {stats.visits?.toLocaleString() ?? 0}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
            <span className="text-emerald-400 font-medium flex items-center gap-0.5">
              <Activity size={12} /> Bookings
            </span>
            <span>scheduled & logged</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reviews
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Star size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">
            {stats.reviews?.toLocaleString() ?? 0}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
            <span className="text-amber-400 font-medium">Ratings</span>
            <span>and tenant feedback</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/users"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Manage Users
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View registered accounts, role permissions, and user identities.
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/accommodations"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Building size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Manage Accommodations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review listings, verify property details, and remove violations.
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/visits"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Manage Visits
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitor viewing requests, host approvals, and scheduling status.
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/reviews"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Star size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Manage Reviews
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Moderate user comments, ratings, and tenant satisfaction logs.
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
