import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import {
  createListing,
  getListingById,
  updateListing,
} from "../services/listingService";

const ACCOMMODATION_TYPES = [
  "Apartment",
  "Single Room",
  "Shared Room",
  "Studio",
  "House",
  "Hostel / Dormitory",
];

const GENDER_OPTIONS = [
  { value: "ANY", label: "Any Gender" },
  { value: "MALE", label: "Male Only" },
  { value: "FEMALE", label: "Female Only" },
];

const COMMON_FACILITIES = [
  "High-Speed Wi-Fi",
  "Air Conditioning",
  "Fully Furnished",
  "Attached Bathroom",
  "Kitchen Access",
  "Washing Machine",
  "Refrigerator",
  "Parking Space",
  "Balcony",
  "24/7 Security",
  "Gym Access",
  "Power Backup",
];

function AddListing() {
  const { id } = useParams(); // If present, edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Apartment",
    city: "",
    address: "",
    rent: "",
    deposit: "",
    facilities: "",
    preferredGender: "ANY",
    imageUrl: "",
  });

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [customFacility, setCustomFacility] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load existing listing if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await getListingById(id);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          type: data.type || "Apartment",
          city: data.city || "",
          address: data.address || "",
          rent: data.rent ? String(data.rent) : "",
          deposit: data.deposit ? String(data.deposit) : "",
          facilities: data.facilities || "",
          preferredGender: data.preferredGender || "ANY",
          imageUrl: data.imageUrl || "",
        });

        if (data.facilities) {
          const split = data.facilities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);
          setSelectedFacilities(split);
        }
      } catch (err) {
        setServerError(
          err.response?.data?.message || "Failed to load listing details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleFacility = (facility) => {
    let updated;
    if (selectedFacilities.includes(facility)) {
      updated = selectedFacilities.filter((item) => item !== facility);
    } else {
      updated = [...selectedFacilities, facility];
    }
    setSelectedFacilities(updated);
    setFormData((prev) => ({ ...prev, facilities: updated.join(", ") }));
  };

  const handleAddCustomFacility = (e) => {
    e.preventDefault();
    const trimmed = customFacility.trim();
    if (trimmed && !selectedFacilities.includes(trimmed)) {
      const updated = [...selectedFacilities, trimmed];
      setSelectedFacilities(updated);
      setFormData((prev) => ({ ...prev, facilities: updated.join(", ") }));
      setCustomFacility("");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    const rentNum = parseFloat(formData.rent);
    if (!formData.rent || isNaN(rentNum) || rentNum <= 0) {
      newErrors.rent = "Rent must be a positive number";
    }

    const depositNum = parseFloat(formData.deposit);
    if (!formData.deposit || isNaN(depositNum) || depositNum <= 0) {
      newErrors.deposit = "Deposit must be a positive number";
    }

    if (!formData.preferredGender.trim()) {
      newErrors.preferredGender = "Preferred gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;

    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        city: formData.city.trim(),
        address: formData.address.trim(),
        rent: parseFloat(formData.rent),
        deposit: parseFloat(formData.deposit),
        facilities: selectedFacilities.join(", "),
        preferredGender: formData.preferredGender,
        imageUrl: formData.imageUrl.trim() || null,
      };

      if (isEditMode) {
        await updateListing(id, payload);
        setSuccessMessage("Listing updated successfully!");
        setTimeout(() => navigate(`/listings/${id}`), 1200);
      } else {
        const created = await createListing(payload);
        setSuccessMessage("Listing published successfully!");
        setTimeout(() => navigate(`/listings/${created.id || ""}`), 1200);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Backend validation errors map
        setErrors(err.response.data.errors);
      } else {
        setServerError(
          err.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} listing. Please try again.`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="text-sm">Loading listing details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Listings
          </Link>
        </div>

        {/* Page Title Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Home size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {isEditMode ? "Edit Accommodation Listing" : "Post a New Accommodation"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {isEditMode
                  ? "Update property details, rent, or amenities for prospective tenants."
                  : "List your room, apartment, or flat to connect with verified room-seekers."}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-400" /> Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Listing Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Spacious Master Bedroom with Attached Bath in Downtown"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border ${
                    errors.title ? "border-red-500" : "border-slate-700"
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.title && (
                  <p className="text-xs text-red-400 mt-1">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Accommodation Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Accommodation Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {ACCOMMODATION_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-slate-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Gender */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Preferred Gender <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="preferredGender"
                    value={formData.preferredGender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the space, roommate atmosphere, house rules, nearby amenities, public transit access..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Address */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-400" /> Location Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Colombo, Kandy, Austin..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border ${
                    errors.city ? "border-red-500" : "border-slate-700"
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.city && (
                  <p className="text-xs text-red-400 mt-1">{errors.city}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 42 Flower Road, Colombo 07"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border ${
                    errors.address ? "border-red-500" : "border-slate-700"
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.address && (
                  <p className="text-xs text-red-400 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Financials */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <DollarSign size={18} className="text-amber-400" /> Pricing & Deposit
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Monthly Rent (LKR / USD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                    placeholder="25000"
                    className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800/80 border ${
                      errors.rent ? "border-red-500" : "border-slate-700"
                    } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  />
                </div>
                {errors.rent && (
                  <p className="text-xs text-red-400 mt-1">{errors.rent}</p>
                )}
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Security Deposit (LKR / USD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    placeholder="50000"
                    className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800/80 border ${
                      errors.deposit ? "border-red-500" : "border-slate-700"
                    } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  />
                </div>
                {errors.deposit && (
                  <p className="text-xs text-red-400 mt-1">{errors.deposit}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Facilities & Amenities */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-400" /> Facilities & Amenities
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select all features included with this accommodation:
            </p>

            {/* Predefined chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_FACILITIES.map((facility) => {
                const isSelected = selectedFacilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {facility}
                  </button>
                );
              })}
            </div>

            {/* Custom facility input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customFacility}
                onChange={(e) => setCustomFacility(e.target.value)}
                placeholder="Add custom facility (e.g. Swimming Pool, Solar Power)..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCustomFacility(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomFacility}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Selected facilities preview */}
            {selectedFacilities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-2">
                  Included ({selectedFacilities.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFacilities.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => toggleFacility(f)}
                        className="hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Photos & Cover Image */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <ImageIcon size={18} className="text-purple-400" /> Accommodation Photo URL
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Image Web URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1">
                Provide a high quality photo URL of the bedroom, living room, or building exterior.
              </p>

              {/* Image Preview */}
              {formData.imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 max-h-64 flex items-center justify-center">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/listings")}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{isEditMode ? "Updating..." : "Publishing..."}</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Publish Listing"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;