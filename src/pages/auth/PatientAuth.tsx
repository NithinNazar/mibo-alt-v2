import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const PatientAuth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"email" | "phone">("email");

  // Email credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone + OTP credentials
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<HTMLInputElement[]>([]);

  const handleEmailLogin = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "test.patient@gmail.com" && password === "test@123") {
        const patient = {
          name: "Test Patient",
          email,
          phone: "9876543210",
          id: "mock-patient-uuid",
        };
        localStorage.setItem("patient", JSON.stringify(patient));
        navigate("/profileDashboard");
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleSendOtp = () => {
    if (!phone) return setError("Enter your phone number first.");
    setError("");
    setOtpSent(true);
    setOtp("");
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpLogin = () => {
    setError("");
    if (otp === "1111") {
      const patient = {
        name: "Test Patient",
        phone,
        email: "test.patient@gmail.com",
        id: "mock-patient-uuid",
      };
      localStorage.setItem("patient", JSON.stringify(patient));
      navigate("/profileDashboard");
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
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
        <h2 className="text-2xl font-bold text-center text-[#2a1470] mb-6">
          Patient Sign In / Sign Up
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setTab("email")}
            className={`px-4 py-2 rounded-l-full font-semibold ${
              tab === "email"
                ? "bg-[#2a1470] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setTab("phone")}
            className={`px-4 py-2 rounded-r-full font-semibold ${
              tab === "phone"
                ? "bg-[#2a1470] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Phone + OTP
          </button>
        </div>

        {/* Email Login */}
        {tab === "email" && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              onClick={handleEmailLogin}
              disabled={loading}
              className="bg-[#2a1470] text-white py-2 rounded-lg font-semibold hover:bg-[#24105f] transition-all"
            >
              {loading ? "Signing In..." : "Sign In / Sign Up"}
            </button>
          </div>
        )}

        {/* Phone + OTP Login */}
        {tab === "phone" && (
          <div className="flex flex-col gap-4">
            <input
              type="tel"
              placeholder="Phone Number"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2fbfa8]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {otpSent && (
              <>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      maxLength={1}
                      ref={(el) => {
                        if (el) otpRefs.current[i] = el;
                      }}
                      className="w-10 h-10 border rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-[#2fbfa8]"
                      value={otp[i] || ""}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Your OTP is{" "}
                  <span className="font-bold text-[#2a1470]">1111</span>
                </p>
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex justify-between gap-3">
              <button
                onClick={handleSendOtp}
                className="bg-[#2fbfa8] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#27a693] transition-all w-1/2"
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </button>
              <button
                onClick={handleOtpLogin}
                className="bg-[#2a1470] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#24105f] transition-all w-1/2"
              >
                Sign In / Sign Up
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PatientAuth;
