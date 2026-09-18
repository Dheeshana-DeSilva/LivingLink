import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Building,
  ArrowRight,
  ShieldCheck,
  User,
  Inbox,
  Send,
} from "lucide-react";
import visitService from "../services/visitService";

function Visits() {
  const { userId, role } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("my-visits"); // 'my-visits' or 'owner-visits'
  const [myVisits, setMyVisits] = useState([]);
  const [ownerVisits, setOwnerVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError("");

      const [myRequests, incomingRequests] = await Promise.allSettled([
        visitService.getMyVisits(),
        visitService.getOwnerVisits(),
      ]);

      if (myRequests.status === "fulfilled") {
        setMyVisits(Array.isArray(myRequests.value) ? myRequests.value : []);
      }
      if (incomingRequests.status === "fulfilled") {
        setOwnerVisits(
          Array.isArray(incomingRequests.value) ? incomingRequests.value : []
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your scheduled visits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const handleAccept = async (id) => {
    try {
      setActionLoading(id);
      await visitService.acceptVisit(id);
      setFeedback("Visit request accepted successfully!");
      await loadVisits();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept visit.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this visit request?")) return;
    try {
      setActionLoading(id);
      await visitService.rejectVisit(id);
      setFeedback("Visit request rejected.");
      await loadVisits();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject visit.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled visit?")) return;
    try {
      setActionLoading(id);
      await visitService.cancelVisit(id);
      setFeedback("Visit request cancelled.");
      await loadVisits();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel visit.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatVisitDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "Date not specified";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateTimeStr;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={13} /> Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <XCircle size={13} /> Declined
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400">
            Cancelled
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <Clock size={13} /> Pending Owner Approval
          </span>
        );
    }
  };

  const currentVisits = activeTab === "my-visits" ? myVisits : ownerVisits;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
              <Calendar size={14} /> Scheduled Visits
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Accommodation Visits
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Track in-person accommodation visits, inspect room statuses, and respond to incoming requests.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between text-sm">
            <span>{feedback}</span>
            <button onClick={() => setFeedback("")} className="text-xs underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab("my-visits")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors ${
              activeTab === "my-visits"
                ? "border-b-2 border-blue-500 text-blue-400 bg-blue-500/5"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Send size={15} />
            My Requested Visits ({myVisits.length})
          </button>

          <button
            onClick={() => setActiveTab("owner-visits")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors ${
              activeTab === "owner-visits"
                ? "border-b-2 border-blue-500 text-blue-400 bg-blue-500/5"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Inbox size={15} />
            Incoming for My Listings ({ownerVisits.length})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-blue-500" size={36} />
            <p className="text-sm">Loading visits...</p>
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-3">
            <AlertCircle size={32} className="text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Error</h3>
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={loadVisits}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && currentVisits.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <Calendar size={48} className="text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              {activeTab === "my-visits"
                ? "No Scheduled Visits"
                : "No Incoming Visit Requests"}
            </h3>
            <p className="text-sm text-slate-400">
              {activeTab === "my-visits"
                ? "You haven't requested any property visits yet. Browse accommodations to schedule a tour."
                : "You have not received any visit inquiries from prospective roommates yet."}
            </p>
            {activeTab === "my-visits" && (
              <div className="pt-2">
                <Link
                  to="/accommodations"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Browse Accommodations</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Visits List */}
        {!loading && !error && currentVisits.length > 0 && (
          <div className="space-y-4">
            {currentVisits.map((visit) => {
              const isOwnerView = activeTab === "owner-visits";
              const isActionRunning = actionLoading === visit.id;

              return (
                <div
                  key={visit.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-lg backdrop-blur-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-slate-400">
                        Visit #{visit.id}
                      </span>
                      {getStatusBadge(visit.status)}
                    </div>

                    <div className="flex items-center gap-2 text-white font-semibold text-base">
                      <Calendar size={16} className="text-blue-400 shrink-0" />
                      <span>{formatVisitDateTime(visit.visitDate)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Building size={13} className="text-slate-500" />
                        <span>Accommodation ID: #{visit.listingId}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <User size={13} className="text-slate-500" />
                        <span>
                          {isOwnerView
                            ? `Requester User ID: #${visit.requesterId}`
                            : `Owner ID: #${visit.ownerId}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800 shrink-0">
                    <Link
                      to={`/accommodations/${visit.listingId}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={14} /> View Property
                    </Link>

                    {/* Requester Actions */}
                    {!isOwnerView &&
                      (visit.status === "PENDING" || visit.status === "ACCEPTED") && (
                        <button
                          onClick={() => handleCancel(visit.id)}
                          disabled={isActionRunning}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700/80 hover:border-red-500/30 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {isActionRunning ? "Cancelling..." : "Cancel Visit"}
                        </button>
                      )}

                    {/* Owner Actions */}
                    {isOwnerView && visit.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAccept(visit.id)}
                          disabled={isActionRunning}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(visit.id)}
                          disabled={isActionRunning}
                          className="px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    )}
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

export default Visits;
