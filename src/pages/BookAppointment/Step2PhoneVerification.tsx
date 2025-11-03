import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface Step2PhoneVerificationProps {
  bookingData: any;
  setBookingData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function Step2PhoneVerification({
  bookingData,
  setBookingData,
  onContinue,
  onBack,
}: Step2PhoneVerificationProps) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp === "1111") {
      const updated = { ...bookingData, phone };
      setBookingData(updated);

      //  Create a local user profile
      localStorage.setItem("mibo_user", JSON.stringify(updated));

      onContinue();
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e9f6f4] text-[#034B44] relative">
      <div className="flex items-center p-4 border-b border-[#a7c4f2]/40 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-[#034B44]" />
        </button>
        <h2 className="text-lg font-semibold">Verify Your Number</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Enter your phone number
          </label>
          <input
            type="tel"
            placeholder="e.g. 9876543210"
            className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#81b2f0]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="w-full bg-[#1c0d54] text-white py-3 rounded-full font-semibold hover:bg-[#2a1470] transition-all shadow-md"
          >
            Send OTP
          </button>
        ) : (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Enter OTP (Hint: 1111)
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter 4-digit OTP"
                className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#81b2f0]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#1c0d54] text-white py-3 rounded-full font-semibold hover:bg-[#2a1470] transition-all shadow-md"
            >
              Continue
            </button>
          </>
        )}

        {error && (
          <p className="text-red-600 text-sm text-center font-medium mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
