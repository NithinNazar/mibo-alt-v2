import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import authService from "../../services/authService";

const PatientAuth = () => {
  const navigate = useNavigate();

  // Phone + OTP credentials
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // New user details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const otpRefs = useRef<HTMLInputElement[]>([]);

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

    // Validate required fields for new users
    if (isNewUser && !fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Add country code 91 for India
      const phoneWithCountryCode = `91${phone}`;
      await authService.verifyOTP(
        phoneWithCountryCode,
        otp,
        fullName.trim() || undefined,
        email.trim() || undefined
      );

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
    setFullName("");
    setEmail("");
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
          {otpSent
            ? "Enter the OTP sent to your WhatsApp"
            : "Enter your phone number to receive OTP via WhatsApp"}
        </p>

        {/* Phone + OTP Login */}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
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

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
            >
              {success}
            </motion.div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientAuth;
