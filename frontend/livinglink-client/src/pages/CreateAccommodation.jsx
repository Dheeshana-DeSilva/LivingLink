import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Image as ImageIcon,
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

function CreateAccommodation() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setLoading(true);
      const response = await accommodationService.createAccommodation(formData);
      setSuccess("Accommodation created successfully!");
      setTimeout(() => {
        if (response && response.id) {
          navigate(`/accommodations/${response.id}`);
        } else {
          navigate("/listings");
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to create accommodation. Please make sure the service is running and you are logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Accommodations
          </Link>
        </div>

        {/* Card Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Home size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Add Accommodation
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Create a new accommodation listing for students and young professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Notifications */}
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
              placeholder="e.g. Comfortable Single Room near City Center"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Type & Preferred Gender */}
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
                placeholder="e.g. Kandy, Colombo, Austin"
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
                placeholder="Street address or area"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Pricing: Monthly Price & Security Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monthly Price / Rent ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="35000"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Security Deposit ($)
              </label>
              <input
                type="number"
                name="deposit"
                step="0.01"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="Optional deposit (e.g. 50000)"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Facilities / Amenities */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Facilities & Amenities (comma-separated)
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="e.g. High-speed Wi-Fi, Air Conditioning, Fully Furnished, Attached Bathroom"
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
              placeholder="https://images.unsplash.com/..."
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
              placeholder="Describe the accommodation, house rules, nearby amenities..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Listing...</span>
              </>
            ) : (
              <span>Create Listing</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccommodation;
