import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import authService from "../../services/authService";
import ProfileCompletionModal from "../../components/ProfileCompletionModal";

const PatientAuth = () => {
  const navigate = useNavigate();

  // Login method toggle
  const [loginMethod, setLoginMethod] = useState<"phone" | "username">("phone");

  // Phone + OTP credentials
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Username + Password credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // New user details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");

  // Profile completion modal for legacy users
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileCompletionPhone, setProfileCompletionPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const otpRefs = useRef<HTMLInputElement[]>([]);

  // Check if user is already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/profileDashboard", { replace: true });
    }
  }, [navigate]);

  /**
   * Send OTP via WhatsApp
   */
  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }

    // Validate phone format (10 digits for Indian numbers)
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Add country code 91 for India
      const phoneWithCountryCode = `91${phone}`;
      const response = await authService.sendOTP(phoneWithCountryCode);
      setIsNewUser(response.data.isNewUser);
      setOtpSent(true);
      setOtp("");
      setSuccess("OTP sent to your WhatsApp! Check your phone.");

      // Focus on first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP and login/signup
   */
  const handleOtpLogin = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    // 🔧 FIX: Validate required fields for new users ONLY if they are new
    // For new users, firstName, lastName, age, and gender are REQUIRED
    if (isNewUser) {
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
      // Email is optional for new users - no validation needed
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Add country code 91 for India
      const phoneWithCountryCode = `91${phone}`;
      const response = await authService.verifyOTP(
        phoneWithCountryCode,
        otp,
        firstName.trim() || undefined,
        lastName.trim() || undefined,
        email.trim() || undefined,
        typeof age === "number" ? age : undefined,
        gender || undefined,
      );

      // Check if legacy user requires profile completion
      if (response.data.requiresProfileCompletion) {
        setProfileCompletionPhone(phoneWithCountryCode);
        setShowProfileCompletion(true);
        setLoading(false);
        return;
      }

      setSuccess("Login successful! Redirecting...");

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/profileDashboard");
      }, 1000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Invalid OTP. Please try again.";
      setError(errorMessage);
      setOtp(""); // Clear OTP on error
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with username and password
   */
  const handleUsernameLogin = async () => {
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.loginWithPassword(username.trim(), password);

      setSuccess("Login successful! Redirecting...");

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/profileDashboard");
      }, 1000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Invalid username or password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle OTP input change
   */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle OTP input backspace
   */
  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Reset form to initial state
   */
  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setAge("");
    setGender("");
    setError("");
    setSuccess("");
    setIsNewUser(false);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#f3f5fb] px-4 overflow-hidden">
      {/* Floating Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-[#2fbfa8] hover:text-white transition-all"
      >
        <ArrowLeft size={20} />
      </motion.button>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative z-10"
      >
        <h2 className="text-2xl font-bold text-center text-[#2a1470] mb-2">
          Patient Sign In / Sign Up
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          {loginMethod === "phone"
            ? otpSent
              ? "Enter the OTP sent to your WhatsApp"
              : "Enter your phone number to receive OTP via WhatsApp"
            : "Enter your username and password to login"}
        </p>

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setLoginMethod("phone");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              loginMethod === "phone"
                ? "bg-[#2fbfa8] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Login with Phone
          </button>
          <button
            onClick={() => {
              setLoginMethod("username");
              setError("");
              setSuccess("");
              setOtpSent(false);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              loginMethod === "username"
                ? "bg-[#2fbfa8] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Login with Username
          </button>
        </div>

        {/* Phone + OTP Login */}
        {loginMethod === "phone" && (
          <div className="flex flex-col gap-4">
            {/* Phone Number Input */}
            {!otpSent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="w-full border rounded-lg pl-14 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      disabled={loading}
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your 10-digit mobile number
                  </p>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length !== 10}
                  className="bg-[#2fbfa8] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#27a693] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP via WhatsApp"
                  )}
                </button>
              </>
            )}

            {/* OTP Input */}
            {otpSent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        ref={(el) => {
                          if (el) otpRefs.current[i] = el;
                        }}
                        className="w-12 h-12 border-2 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-[#2fbfa8] focus:border-[#2fbfa8]"
                        value={otp[i] || ""}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>

                {/* New User Details */}
                {isNewUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-2"
                  >
                    <p className="text-sm text-[#2a1470] font-medium text-center">
                      Welcome! Please provide your details
                    </p>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
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
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
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
                          className="w-full border rounded-lg px-4 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
                          value={age}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAge(
                              value === ""
                                ? ""
                                : Math.min(
                                    150,
                                    Math.max(1, parseInt(value) || 0),
                                  ),
                            );
                          }}
                          disabled={loading}
                        />
                        <div className="absolute right-2 flex flex-col">
                          <button
                            type="button"
                            onClick={() =>
                              setAge((prev) => {
                                const current =
                                  typeof prev === "number" ? prev : 0;
                                return Math.min(150, current + 1);
                              })
                            }
                            className="px-2 py-0.5 text-xs bg-[#2fbfa8] text-white rounded hover:bg-[#27a693] transition-colors"
                            disabled={loading}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAge((prev) => {
                                const current =
                                  typeof prev === "number" ? prev : 0;
                                return Math.max(1, current - 1);
                              })
                            }
                            className="px-2 py-0.5 text-xs bg-[#2fbfa8] text-white rounded hover:bg-[#27a693] transition-colors mt-0.5"
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
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8] bg-white"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="NON_BINARY">Non-Binary</option>
                        <option value="PREFER_NOT_TO_SAY">
                          Rather not say
                        </option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleOtpLogin}
                    disabled={loading || otp.length !== 6}
                    className="bg-[#2a1470] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#24105f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleChangeNumber}
                      disabled={loading}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
                    >
                      Change Number
                    </button>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Username + Password Login */}
        {loginMethod === "username" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && username && password) {
                    handleUsernameLogin();
                  }
                }}
              />
            </div>

            <button
              onClick={handleUsernameLogin}
              disabled={loading || !username || !password}
              className="bg-[#2a1470] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#24105f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4"
          >
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mt-4"
          >
            {success}
          </motion.div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>

      {/* Profile Completion Modal for Legacy Users */}
      <ProfileCompletionModal
        isOpen={showProfileCompletion}
        phone={profileCompletionPhone}
        onComplete={() => {
          setShowProfileCompletion(false);
          setSuccess("Profile completed! Redirecting...");
          setTimeout(() => {
            navigate("/profileDashboard");
          }, 1000);
        }}
        onSkip={() => {
          setShowProfileCompletion(false);
          navigate("/profileDashboard");
        }}
      />
    </div>
  );
};

export default PatientAuth;
