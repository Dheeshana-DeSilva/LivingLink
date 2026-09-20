import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit,
} from "lucide-react";
import accommodationService from "../services/accommodationService";

const ACCOMMODATION_TYPES = [
  { value: "ROOM", label: "Single Room" },
  { value: "SHARED_ROOM", label: "Shared Room" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "STUDIO", label: "Studio" },
  { value: "ANNEX", label: "Annex" },
  { value: "HOUSE", label: "House" },
  { value: "BOARDING", label: "Boarding" },
];

const GENDER_OPTIONS = [
  { value: "ANY", label: "Any Gender Friendly" },
  { value: "MALE", label: "Male Only" },
  { value: "FEMALE", label: "Female Only" },
];

function EditAccommodation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    price: "",
    deposit: "",
    accommodationType: "ROOM",
    preferredGender: "ANY",
    facilities: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await accommodationService.getAccommodationById(id);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          city: data.city || "",
          address: data.address || "",
          price: data.rent != null ? String(data.rent) : "",
          deposit: data.deposit != null ? String(data.deposit) : "",
          accommodationType: data.type || "ROOM",
          preferredGender: data.preferredGender || "ANY",
          facilities: data.facilities || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load accommodation data for editing."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAccommodation();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please provide a title.");
      return;
    }
    if (!formData.city.trim()) {
      setError("Please provide a city.");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid positive monthly price.");
      return;
    }

    try {
      setSaving(true);
      await accommodationService.updateAccommodation(id, formData);
      setSuccess("Accommodation updated successfully!");
      setTimeout(() => {
        navigate(`/accommodations/${id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to update accommodation. You might not be authorized to edit this listing."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-16">
        <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
        <p className="text-sm text-slate-400">Loading accommodation details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <div>
          <Link
            to={`/accommodations/${id}`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Accommodation
          </Link>
        </div>

        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Edit size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Edit Accommodation
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Update details for listing #{id}.
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Listing Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Type & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Accommodation Type <span className="text-red-400">*</span>
              </label>
              <select
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                required
              >
                {ACCOMMODATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-900">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Preferred Gender
              </label>
              <select
                name="preferredGender"
                value={formData.preferredGender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value} className="bg-slate-900">
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monthly Rent (LKR) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                step="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="Monthly Price"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Security Deposit (LKR)
              </label>
              <input
                type="number"
                name="deposit"
                step="0.01"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="Deposit"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Facilities & Amenities (comma-separated)
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="Facilities"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/accommodations/${id}`)}
              className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Listing</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAccommodation;
