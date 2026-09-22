import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Sparkles,
  MapPin,
  DollarSign,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  ArrowRight,
  Eye,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import matchingService from "../services/matchingService";

function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsPreferences, setNeedsPreferences] = useState(false);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");
      setNeedsPreferences(false);

      const data = await matchingService.getMatches();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      // If preferences not set yet, prompt to create them
      if (
        status === 404 ||
        errorMsg.toLowerCase().includes("preference") ||
        status === 400
      ) {
        setNeedsPreferences(true);
      } else {
        setError(
          errorMsg ||
            "Failed to load matching recommendations. Please ensure backend services are running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    if (score >= 40) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-slate-400 border-slate-700 bg-slate-800/50";
  };

  const getBarColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
    if (score >= 60) return "bg-gradient-to-r from-blue-600 to-indigo-500";
    if (score >= 40) return "bg-gradient-to-r from-amber-500 to-orange-400";
    return "bg-slate-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "High Match";
    if (score >= 60) return "Great Match";
    if (score >= 40) return "Moderate Match";
    return "Basic Match";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
                <Sparkles size={14} /> AI Roommate & Accommodation Matcher
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                Your Ranked Matches
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                LivingLink's compatibility engine calculates affinity scores based on your preferred city, budget range, gender preferences, and living habits.
              </p>
            </div>

            <Link
              to="/preferences"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold self-start md:self-auto transition-colors"
            >
              <Sliders size={16} /> Edit Preferences
            </Link>
          </div>
        </div>

        {/* 18.10: Handle No Preferences Case */}
        {needsPreferences && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center max-w-lg mx-auto space-y-4 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <Sliders size={28} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Complete Your Roommate Preferences
            </h2>
            <p className="text-sm text-slate-400">
              To calculate accurate compatibility scores and discover accommodations in your budget, please tell us your location, rent range, and living preferences.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/preferences")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2"
              >
                <span>Set Preferences Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-blue-500" size={36} />
            <p className="text-sm">Calculating compatibility scores...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && !needsPreferences && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-3">
            <AlertCircle size={32} className="text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Connection Error</h3>
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={loadMatches}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* 18.7: Empty Matches State */}
        {!loading && !needsPreferences && !error && matches.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <Users size={48} className="text-slate-600 mx-auto" />
            <h2 className="text-xl font-bold text-white">No Matches Found</h2>
            <p className="text-sm text-slate-400">
              No accommodations currently match your strict criteria. Try widening your monthly budget or updating your preferred city.
            </p>
            <div className="pt-2">
              <Link
                to="/preferences"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                <Sliders size={14} /> Update Preferences
              </Link>
            </div>
          </div>
        )}

        {/* 18.4 & 18.5: Matches Grid */}
        {!loading && !needsPreferences && !error && matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Found <strong className="text-white">{matches.length}</strong> ranked matches (Highest compatibility first)
              </span>
              <button
                onClick={loadMatches}
                className="text-blue-400 hover:underline"
              >
                Refresh Rankings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => {
                // Support both backend MatchingResult ({ listing, compatibilityScore })
                // and flat structure ({ title, rent, city, ... })
                const item = match.listing || match;
                const score = Math.round(match.compatibilityScore || match.score || 0);
                const facilities = item.facilities
                  ? item.facilities.split(",").map((f) => f.trim()).filter(Boolean)
                  : [];

                return (
                  <div
                    key={item.id || index}
                    className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 flex flex-col group"
                  >
                    {/* Visual Photo & Compatibility Header */}
                    <div className="relative h-48 sm:h-56 w-full bg-slate-800 overflow-hidden">
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

                      {/* Rank Position */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-950/85 backdrop-blur-md text-slate-300 border border-slate-700">
                          #{index + 1} Rank
                        </span>
                      </div>

                      {/* 18.5: Compatibility Score Badge */}
                      <div className="absolute top-3 right-3">
                        <div
                          className={`px-3 py-1 rounded-xl backdrop-blur-md border text-xs font-bold flex items-center gap-1.5 shadow-lg ${getScoreColor(
                            score
                          )}`}
                        >
                          <Sparkles size={13} />
                          <span>{score}% Match</span>
                        </div>
                      </div>

                      {/* Price Tag */}
                      <div className="absolute bottom-3 left-3">
                        <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white font-extrabold text-sm">
                          Rs. {(item.rent || 0).toLocaleString()}
                          <span className="text-xs font-normal text-slate-400"> /mo</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* 18.6: Compatibility Progress Bar */}
                        <div className="mb-3 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                            <span>Compatibility Score</span>
                            <span className="text-slate-200 font-bold">{getScoreLabel(score)}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${getBarColor(
                                score
                              )}`}
                              style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <Link to={`/accommodations/${item.id}`}>
                          <h3 className="font-bold text-white text-base hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                            {item.title}
                          </h3>
                        </Link>

                        {/* City & Address */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                          <MapPin size={14} className="text-emerald-400 shrink-0" />
                          <span className="truncate">
                            {item.address ? `${item.address}, ` : ""}
                            {item.city}
                          </span>
                        </div>

                        {/* Badges: Type & Gender */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-medium">
                            {item.type || "Room"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium">
                            {item.preferredGender === "ANY"
                              ? "Any Gender"
                              : item.preferredGender}
                          </span>
                        </div>

                        {/* Facilities snippet */}
                        {facilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {facilities.slice(0, 3).map((f, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 18.6 & 18.7: Action Buttons */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <Link
                          to={`/accommodations/${item.id}`}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye size={14} /> View Details
                        </Link>

                        <button
                          onClick={() => {
                            navigate(`/visits/schedule/${item.id}`);
                          }}
                          className="px-3 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Schedule a Visit"
                        >
                          <Calendar size={14} /> Visit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Matches;