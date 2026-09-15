import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  User,
  MapPin,
  Briefcase,
  Moon,
  Sparkles,
  UtensilsCrossed,
  CigaretteOff,
  PawPrint,
  Heart,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { getMyProfile, createProfile, updateProfile } from "../services/profileService";

/* ── Dropdown options matching backend validation ────────────── */
const OPTIONS = {
  ageRange: ["18-24", "25-30", "31-35", "36-40", "40+"],
  gender: ["Male", "Female", "Non-Binary", "Prefer not to say"],
  lifestyleType: ["Early Bird", "Night Owl", "Flexible"],
  cleanlinessLevel: ["Very Clean", "Clean", "Moderate", "Relaxed"],
  sleepSchedule: ["Before 10PM", "10PM-12AM", "After 12AM", "Irregular"],
  cookingHabit: ["Daily", "Often", "Sometimes", "Rarely", "Never"],
  smokingPreference: ["Non-Smoker", "Smoker", "Outdoor Only", "No Preference"],
  petPreference: ["Love Pets", "Okay with Pets", "No Pets", "No Preference"],
};

const INITIAL_FORM = {
  ageRange: "",
  gender: "",
  occupation: "",
  city: "",
  lifestyleType: "",
  cleanlinessLevel: "",
  sleepSchedule: "",
  cookingHabit: "",
  smokingPreference: "",
  petPreference: "",
};

function Profile() {
  const { fullName, email, role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ── Load profile on mount ─────────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setFormData({
          ageRange: profile.ageRange || "",
          gender: profile.gender || "",
          occupation: profile.occupation || "",
          city: profile.city || "",
          lifestyleType: profile.lifestyleType || "",
          cleanlinessLevel: profile.cleanlinessLevel || "",
          sleepSchedule: profile.sleepSchedule || "",
          cookingHabit: profile.cookingHabit || "",
          smokingPreference: profile.smokingPreference || "",
          petPreference: profile.petPreference || "",
        });
        setHasProfile(true);
        setIsEditing(false);
      } catch (error) {
        if (error.response?.status === 404) {
          // No profile yet → show the create form
          setHasProfile(false);
          setIsEditing(true);
        } else {
          setMessage({ type: "error", text: "Failed to load profile." });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      if (hasProfile) {
        await updateProfile(formData);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        await createProfile(formData);
        setHasProfile(true);
        setMessage({ type: "success", text: "Profile created successfully!" });
      }
      setIsEditing(false);
    } catch (error) {
      const validationErrors = error.response?.data?.validationErrors;
      if (validationErrors) {
        const msgs = Object.values(validationErrors).join(", ");
        setMessage({ type: "error", text: msgs });
      } else {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Something went wrong.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ type: "", text: "" });
    // Reload data to discard changes – or restore from last known state
    // We'll refetch for simplicity
    window.location.reload();
  };

  /* ── Loading state ────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={36} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  /* ── Helper: render a select dropdown ──────────────────────── */
  const SelectField = ({ name, label, icon: Icon, options }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        <Icon size={16} className="text-blue-400" />
        {label}
      </label>
      {isEditing ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          required
        >
          <option value="" disabled>
            Select {label.toLowerCase()}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <p className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200">
          {formData[name] || <span className="text-slate-500 italic">Not set</span>}
        </p>
      )}
    </div>
  );

  /* ── Helper: render a text input ───────────────────────────── */
  const TextField = ({ name, label, icon: Icon, placeholder }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        <Icon size={16} className="text-blue-400" />
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          required
        />
      ) : (
        <p className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200">
          {formData[name] || <span className="text-slate-500 italic">Not set</span>}
        </p>
      )}
    </div>
  );

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* ── Header Card ───────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white text-3xl font-bold shrink-0">
              {fullName ? fullName.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{fullName}</h1>
              <p className="text-slate-400 text-sm">{email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                {role?.replace("_", " ")}
              </span>
            </div>

            {/* Edit / Cancel buttons */}
            {hasProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all duration-200"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Message ─────────────────────────────────────── */}
        {message.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl mb-6 border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* ── Profile Form / View ──────────────────────────── */}
        <form onSubmit={handleSave}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            {/* Section: Personal Info */}
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SelectField
                  name="ageRange"
                  label="Age Range"
                  icon={User}
                  options={OPTIONS.ageRange}
                />
                <SelectField
                  name="gender"
                  label="Gender"
                  icon={User}
                  options={OPTIONS.gender}
                />
                <TextField
                  name="occupation"
                  label="Occupation"
                  icon={Briefcase}
                  placeholder="e.g. Software Engineer"
                />
                <TextField
                  name="city"
                  label="City"
                  icon={MapPin}
                  placeholder="e.g. Colombo"
                />
              </div>
            </div>

            {/* Section: Lifestyle */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Heart size={20} className="text-blue-400" />
                Lifestyle & Habits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SelectField
                  name="lifestyleType"
                  label="Lifestyle Type"
                  icon={Sparkles}
                  options={OPTIONS.lifestyleType}
                />
                <SelectField
                  name="cleanlinessLevel"
                  label="Cleanliness Level"
                  icon={Sparkles}
                  options={OPTIONS.cleanlinessLevel}
                />
                <SelectField
                  name="sleepSchedule"
                  label="Sleep Schedule"
                  icon={Moon}
                  options={OPTIONS.sleepSchedule}
                />
                <SelectField
                  name="cookingHabit"
                  label="Cooking Habit"
                  icon={UtensilsCrossed}
                  options={OPTIONS.cookingHabit}
                />
                <SelectField
                  name="smokingPreference"
                  label="Smoking Preference"
                  icon={CigaretteOff}
                  options={OPTIONS.smokingPreference}
                />
                <SelectField
                  name="petPreference"
                  label="Pet Preference"
                  icon={PawPrint}
                  options={OPTIONS.petPreference}
                />
              </div>
            </div>
          </div>

          {/* ── Action Buttons ─────────────────────────────── */}
          {isEditing && (
            <div className="flex items-center justify-end gap-3 mt-6">
              {hasProfile && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {hasProfile ? "Save Changes" : "Create Profile"}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;