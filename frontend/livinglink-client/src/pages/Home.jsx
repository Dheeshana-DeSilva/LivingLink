import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building,
  DollarSign,
  Sparkles,
  Users,
  ShieldCheck,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import accommodationService from "../services/accommodationService";

function Home() {
  const navigate = useNavigate();

  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const [featuredListings, setFeaturedListings] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const data = await accommodationService.getAccommodations();
        setFeaturedListings(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error("Failed to fetch featured accommodations:", err);
        setFeaturedListings([]);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append("city", searchCity);
    if (searchType) params.append("type", searchType);
    if (searchBudget) params.append("maxBudget", searchBudget);
    navigate(`/accommodations?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow backdrop decorative elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} /> Smart Accommodation & Roommate Discovery
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Right Place</span>.
            <br />
            Live with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Right People</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            LivingLink matches students and young professionals with verified accommodations
            and compatible roommates based on lifestyle habits, budget, and location.
          </p>

          {/* ── Search Bar ────────────────────────────────────────── */}
          <div className="max-w-4xl mx-auto pt-6">
            <form
              onSubmit={handleSearch}
              className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl grid grid-cols-1 sm:grid-cols-12 gap-3"
            >
              {/* City Input */}
              <div className="sm:col-span-4 relative flex items-center">
                <MapPin className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="City (e.g. Colombo, Kandy)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Type Select */}
              <div className="sm:col-span-3 relative flex items-center">
                <Building className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="STUDIO">Studio</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="ROOM">Room</option>
                  <option value="HOUSE">House</option>
                </select>
              </div>

              {/* Max Budget Input */}
              <div className="sm:col-span-3 relative flex items-center">
                <DollarSign className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="number"
                  placeholder="Max Budget (LKR)"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* ── Trust Metrics ────────────────────────────────────────── */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-2xl font-black text-white">1,200+</span>
              <p className="text-xs text-slate-400 mt-0.5">Verified Listings</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-2xl font-black text-emerald-400">96%</span>
              <p className="text-xs text-slate-400 mt-0.5">Roommate Match Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-2xl font-black text-amber-400">4.9/5</span>
              <p className="text-xs text-slate-400 mt-0.5">Average Review</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-2xl font-black text-blue-400">0%</span>
              <p className="text-xs text-slate-400 mt-0.5">Brokerage Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Accommodations Section ───────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
              Curated Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Accommodations
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Hand-picked and verified spaces with top tenant reviews.
            </p>
          </div>

          <Link
            to="/accommodations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Explore All Accommodations <ArrowRight size={16} />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p className="text-sm">Loading featured accommodations...</p>
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <Building className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Accommodations Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              There are currently no featured accommodation listings available.
            </p>
            <Link
              to="/accommodations"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Browse All Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredListings.map((acc) => (
              <div
                key={acc.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group shadow-lg"
              >
                {/* Photo & Badges */}
                <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={acc.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                    alt={acc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/90 text-white backdrop-blur-md">
                      {acc.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-lg bg-slate-950/90 text-white font-black text-sm backdrop-blur-md">
                      Rs. {acc.rent?.toLocaleString()} <span className="text-xs font-normal text-slate-400">/mo</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {acc.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin size={14} className="text-emerald-400 shrink-0" />
                      <span>
                        {acc.address}, {acc.city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {acc.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {acc.preferredGender === "ANY" ? "Any Gender" : acc.preferredGender}
                    </span>
                    <Link
                      to={`/accommodations/${acc.id}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. How LivingLink Works ─────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Seamless Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How LivingLink Works
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Three simple steps to secure your ideal living space and roommates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold mx-auto sm:mx-0">
              <Search size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">1. Discover Spaces</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter verified accommodations by budget, city, amenities, and gender preferences. High-resolution imagery and genuine verified tenant reviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold mx-auto sm:mx-0">
              <Sparkles size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">2. Match Roommates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LivingLink’s compatibility engine compares sleep schedules, study habits, social lifestyles, and cleanliness to recommend compatible co-tenants.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mx-auto sm:mx-0">
              <Calendar size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">3. Visit & Move In</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schedule in-person or virtual property viewings directly with verified hosts. Track status updates and receive instant notifications.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Call to Action Banner ────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-950/70 to-slate-900 border border-blue-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to find your next home?
            </h2>
            <p className="text-sm text-slate-300">
              Join thousands of students and professionals discovering verified accommodations
              and trusted roommates on LivingLink.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/accommodations"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
              >
                Browse Accommodations
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;