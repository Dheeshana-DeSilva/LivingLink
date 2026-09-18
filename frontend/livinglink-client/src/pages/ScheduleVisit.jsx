import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  ArrowLeft,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  MessageSquare,
} from "lucide-react";
import visitService from "../services/visitService";
import accommodationService from "../services/accommodationService";

function ScheduleVisit() {
  const { accommodationId } = useParams();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);

  const [accommodation, setAccommodation] = useState(null);
  const [fetchingAccommodation, setFetchingAccommodation] = useState(true);

  // Minimum date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    visitDate: minDateStr,
    visitTime: "11:00",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load accommodation details to get ownerId and display preview
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setFetchingAccommodation(true);
        const data = await accommodationService.getAccommodationById(accommodationId);
        setAccommodation(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load accommodation details.");
      } finally {
        setFetchingAccommodation(false);
      }
    };

    if (accommodationId) {
      fetchListing();
    }
  }, [accommodationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const isSelfListing =
    accommodation &&
    userId &&
    String(accommodation.ownerId) === String(userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSelfListing) {
      setError("You cannot schedule a visit for your own listing.");
      return;
    }

    if (!formData.visitDate) {
      setError("Please select a valid visit date in the future.");
      return;
    }
    if (!formData.visitTime) {
      setError("Please select a visit time.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await visitService.createVisit({
        listingId: Number(accommodationId),
        ownerId: Number(accommodation.ownerId),
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
      });

      setSuccess("Visit request submitted successfully! The owner will be notified.");
      setTimeout(() => {
        navigate("/visits");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to schedule visit. You might already have an active visit for this property."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingAccommodation) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-16">
        <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
        <p className="text-sm text-slate-400">Loading accommodation details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div>
          <Link
            to={`/accommodations/${accommodationId}`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Accommodation
          </Link>
        </div>

        {/* Accommodation Preview Card */}
        {accommodation && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
              {accommodation.imageUrl ? (
                <img
                  src={accommodation.imageUrl}
                  alt={accommodation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Building size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                {accommodation.type || "Accommodation"}
              </span>
              <h3 className="text-base font-bold text-white truncate">
                {accommodation.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">{accommodation.city}</span>
                <span className="mx-1">•</span>
                <span className="text-white font-semibold">
                  Rs. {(accommodation.rent || accommodation.price || 0).toLocaleString()} /mo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Schedule a Visit
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Choose your preferred date and time to view the property in person.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {isSelfListing ? (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-6 rounded-2xl text-center">
            <p className="font-semibold text-sm">You are the owner of this accommodation.</p>
            <p className="text-xs text-amber-400/80 mt-1">
              You cannot schedule a visit request on your own property.
            </p>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Visit Date */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-400" />
                  Visit Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="visitDate"
                  min={minDateStr}
                  value={formData.visitDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                />
              </div>

              {/* Visit Time */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-400" />
                  Visit Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  name="visitTime"
                  value={formData.visitTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-emerald-400" />
                Note to Accommodation Owner (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Let the owner know if you have any questions or specific timing preferences..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !accommodation}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Visit Request</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ScheduleVisit;
