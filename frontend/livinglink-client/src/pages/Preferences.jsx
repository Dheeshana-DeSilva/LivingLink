import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  MapPin,
  DollarSign,
  Users,
  Sparkles,
  Moon,
  UtensilsCrossed,
  Cigarette,
  PawPrint,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  ArrowRight,
} from "lucide-react";
import preferenceService from "../services/preferenceService";

function Preferences() {
  const [preferences, setPreferences] = useState({
    preferredCity: "",
    minBudget: "",
    maxBudget: "",
    preferredGender: "Any",
    cleanlinessLevel: "Medium",
    sleepSchedule: "Normal",
    smokingPreference: "Non-Smoker",
    petPreference: "No Preference",
    cookingHabit: "Occasional",
    lifestyleType: "Balanced",
  });

  const [existingPreferences, setExistingPreferences] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 17.13: Load Existing Preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setInitialLoading(true);
        const data = await preferenceService.getPreferences();
        if (data) {
          setPreferences({
            preferredCity: data.preferredCity || "",
            minBudget: data.minBudget != null ? String(data.minBudget) : "",
            maxBudget: data.maxBudget != null ? String(data.maxBudget) : "",
            preferredGender: data.preferredGender || "Any",
            cleanlinessLevel: data.cleanlinessLevel || "Medium",
            sleepSchedule: data.sleepSchedule || "Normal",
            smokingPreference: data.smokingPreference || "Non-Smoker",
            petPreference: data.petPreference || "No Preference",
            cookingHabit: data.cookingHabit || "Occasional",
            lifestyleType: data.lifestyleType || "Balanced",
          });
          setExistingPreferences(true);
        }
      } catch (error) {
        // 404 means no preference record exists yet for this user; user will create one
        if (error.response && error.response.status === 404) {
          setExistingPreferences(false);
        } else {
          console.error("Failed to load preferences:", error);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!preferences.preferredCity.trim()) {
      setMessage({ type: "error", text: "Preferred city is required." });
      return;
    }

    const minNum = parseFloat(preferences.minBudget);
    const maxNum = parseFloat(preferences.maxBudget);

    if (isNaN(minNum) || minNum <= 0) {
      setMessage({ type: "error", text: "Please enter a valid positive minimum budget." });
      return;
    }
    if (isNaN(maxNum) || maxNum <= 0) {
      setMessage({ type: "error", text: "Please enter a valid positive maximum budget." });
      return;
    }
    if (maxNum < minNum) {
      setMessage({
        type: "error",
        text: "Maximum budget cannot be less than minimum budget.",
      });
      return;
    }

    try {
      setSaving(true);
      if (existingPreferences) {
        // 17.5 & 17.14: Update existing preferences (PUT)
        await preferenceService.updatePreferences(preferences);
        setMessage({
          type: "success",
          text: "Preferences updated successfully!",
        });
      } else {
        // 17.3 & 17.14: Save new preferences (POST)
        try {
          await preferenceService.savePreferences(preferences);
          setExistingPreferences(true);
          setMessage({
            type: "success",
            text: "Preferences saved successfully!",
          });
        } catch (postErr) {
          // If already exists on server, fallback to update
          if (postErr.response && postErr.response.status === 409) {
            await preferenceService.updatePreferences(preferences);
            setExistingPreferences(true);
            setMessage({
              type: "success",
              text: "Preferences updated successfully!",
            });
          } else {
            throw postErr;
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save preferences. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-16">
        <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
        <p className="text-sm text-slate-400">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
              <Sparkles size={14} /> Roommate Matching Criteria
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Roommate Preferences
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Tell us what you are looking for so LivingLink's matching engine can find compatible roommates and accommodations for you.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle2 size={20} className="shrink-0" />
              ) : (
                <AlertCircle size={20} className="shrink-0" />
              )}
              <span>{message.text}</span>
            </div>

            {message.type === "success" && (
              <Link
                to="/matches"
                className="inline-flex items-center gap-1 text-xs font-semibold underline hover:no-underline text-emerald-300"
              >
                View Matches <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}

        {/* Preferences Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Location & Budget */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
              <MapPin size={18} className="text-emerald-400" />
              <h2>Location & Budget</h2>
            </div>

            {/* 17.2: Preferred City */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Preferred City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="preferredCity"
                value={preferences.preferredCity}
                onChange={handleChange}
                placeholder="Example: Kandy, Colombo, Peradeniya"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                required
              />
            </div>

            {/* 17.3: Minimum & Maximum Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Minimum Monthly Budget (Rs. / $) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 text-xs font-semibold">Rs.</span>
                  <input
                    type="number"
                    name="minBudget"
                    value={preferences.minBudget}
                    onChange={handleChange}
                    placeholder="20000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Maximum Monthly Budget (Rs. / $) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 text-xs font-semibold">Rs.</span>
                  <input
                    type="number"
                    name="maxBudget"
                    value={preferences.maxBudget}
                    onChange={handleChange}
                    placeholder="50000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Roommate Dynamics & Gender */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
              <Users size={18} className="text-purple-400" />
              <h2>Roommate Compatibility</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 17.4: Preferred Gender */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Preferred Gender <span className="text-red-400">*</span>
                </label>
                <select
                  name="preferredGender"
                  value={preferences.preferredGender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                  required
                >
                  <option value="Any" className="bg-slate-900">
                    Any Gender Friendly
                  </option>
                  <option value="Male" className="bg-slate-900">
                    Male Only
                  </option>
                  <option value="Female" className="bg-slate-900">
                    Female Only
                  </option>
                </select>
              </div>

              {/* 17.10: Lifestyle Type */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Lifestyle Atmosphere
                </label>
                <select
                  name="lifestyleType"
                  value={preferences.lifestyleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                >
                  <option value="Quiet" className="bg-slate-900">
                    Quiet (Focus & Peaceful)
                  </option>
                  <option value="Social" className="bg-slate-900">
                    Social (Friendly & Extroverted)
                  </option>
                  <option value="Balanced" className="bg-slate-900">
                    Balanced (Easygoing)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Daily Living Habits */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
              <Sparkles size={18} className="text-cyan-400" />
              <h2>Living Habits & Daily Routine</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 17.5: Cleanliness Level */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Cleanliness Level
                </label>
                <select
                  name="cleanlinessLevel"
                  value={preferences.cleanlinessLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                >
                  <option value="High" className="bg-slate-900">
                    High (Very Clean / Tidy)
                  </option>
                  <option value="Medium" className="bg-slate-900">
                    Medium (Moderate)
                  </option>
                  <option value="Low" className="bg-slate-900">
                    Low (Relaxed)
                  </option>
                </select>
              </div>

              {/* 17.6: Sleep Schedule */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Sleep Schedule
                </label>
                <select
                  name="sleepSchedule"
                  value={preferences.sleepSchedule}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                >
                  <option value="Early" className="bg-slate-900">
                    Early Sleeper (Before 10 PM)
                  </option>
                  <option value="Normal" className="bg-slate-900">
                    Normal (10 PM - 12 AM)
                  </option>
                  <option value="Late" className="bg-slate-900">
                    Late Sleeper (Night Owl / After 12 AM)
                  </option>
                </select>
              </div>

              {/* 17.9: Cooking Habit */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Cooking Habit
                </label>
                <select
                  name="cookingHabit"
                  value={preferences.cookingHabit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                >
                  <option value="Frequent" className="bg-slate-900">
                    Cook Frequently (Daily)
                  </option>
                  <option value="Occasional" className="bg-slate-900">
                    Cook Occasionally
                  </option>
                  <option value="Rarely" className="bg-slate-900">
                    Rarely Cook / Takeout
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: House Rules & Tolerances */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
              <PawPrint size={18} className="text-amber-400" />
              <h2>House Preferences & Tolerances</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 17.7: Smoking Preference */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Smoking Policy
                </label>
                <select
                  name="smokingPreference"
                  value={preferences.smokingPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                >
                  <option value="Non-Smoker" className="bg-slate-900">
                    Non-Smoker Preferred (Strictly non-smoking)
                  </option>
                  <option value="Allowed" className="bg-slate-900">
                    Smoking Allowed (Comfortable with smokers)
                  </option>
                  <option value="No Preference" className="bg-slate-900">
                    No Preference
                  </option>
                </select>
              </div>

              {/* 17.8: Pet Preference */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Pet Policy
                </label>
                <select
                  name="petPreference"
                  value={preferences.petPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                >
                  <option value="Allowed" className="bg-slate-900">
                    Pet Friendly (Comfortable with pets)
                  </option>
                  <option value="No Pets" className="bg-slate-900">
                    No Pets Allowed
                  </option>
                  <option value="No Preference" className="bg-slate-900">
                    No Preference
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <span>{existingPreferences ? "Update Preferences" : "Save Preferences"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Preferences;