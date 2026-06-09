import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X, Loader2 } from "lucide-react";
import authService from "../services/authService";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  phone: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export default function ProfileCompletionModal({
  isOpen,
  phone,
  onComplete,
  onSkip,
}: ProfileCompletionModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    // Validate required fields
    if (!firstName.trim()) {
      setError("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      setError("Please enter your last name");
      return;
    }
    if (!age || age < 1 || age > 150) {
      setError("Please enter a valid age (1-150)");
      return;
    }
    if (!gender) {
      setError("Please select your gender");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Update profile with completion data via backend API
      const accessToken = localStorage.getItem("mibo_access_token");
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";

      const response = await fetch(`${apiBaseUrl}/patient/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          age: Number(age),
          gender: gender,
        }),
      });

      // 🔧 FIX: Better error handling - check response before proceeding
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to update profile. Please try again.",
        );
      }

      // Update local storage with new user data
      const userData = JSON.parse(localStorage.getItem("mibo_user") || "{}");
      userData.first_name = firstName.trim();
      userData.last_name = lastName.trim();
      userData.full_name = `${firstName.trim()} ${lastName.trim()}`;
      userData.email = email.trim() || userData.email;
      userData.age = Number(age);
      userData.gender = gender;
      localStorage.setItem("mibo_user", JSON.stringify(userData));

      // 🔧 FIX: Only call onComplete after successful update
      onComplete();
    } catch (err: any) {
      console.error("Profile completion error:", err);
      setError(err.message || "Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#034B44]/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#034B44]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Complete Your Profile
                  </h2>
                  <p className="text-sm text-gray-600">
                    Help us serve you better
                  </p>
                </div>
              </div>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                We've added new fields to improve your experience. Please take a
                moment to complete your profile.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#034B44]"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#034B44]"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#034B44]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    placeholder="Enter your age"
                    min="1"
                    max="150"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-[#034B44]"
                    value={age}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAge(
                        value === ""
                          ? ""
                          : Math.min(150, Math.max(1, parseInt(value) || 0)),
                      );
                    }}
                    disabled={loading}
                  />
                  <div className="absolute right-2 flex flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        setAge((prev) => {
                          const current = typeof prev === "number" ? prev : 0;
                          return Math.min(150, current + 1);
                        })
                      }
                      className="px-2 py-0.5 text-xs bg-[#034B44] text-white rounded hover:bg-[#046e63] transition-colors"
                      disabled={loading}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAge((prev) => {
                          const current = typeof prev === "number" ? prev : 0;
                          return Math.max(1, current - 1);
                        })
                      }
                      className="px-2 py-0.5 text-xs bg-[#034B44] text-white rounded hover:bg-[#046e63] transition-colors mt-0.5"
                      disabled={loading}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#034B44] bg-white"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non-Binary</option>
                  <option value="PREFER_NOT_TO_SAY">Rather not say</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-[#034B44] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#046e63] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
              {onSkip && (
                <button
                  onClick={onSkip}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Skip for Now
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              You can update these details later in your profile settings
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
