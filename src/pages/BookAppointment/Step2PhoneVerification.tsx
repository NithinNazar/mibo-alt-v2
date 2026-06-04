import { useState, useRef } from "react";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import authService from "../../services/authService";
import ProfileCompletionModal from "../../components/ProfileCompletionModal";

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
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Profile completion modal for legacy users
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileCompletionPhone, setProfileCompletionPhone] = useState("");

  // Refs for OTP input boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * Validate phone number format
   * Must be 10 digits for Indian mobile numbers
   */
  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  /**
   * Handle OTP send request - PRODUCTION MODE
   * Sends OTP via WhatsApp using production endpoint
   */
  const handleSendOtp = async () => {
    // Validate phone number format
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const formattedPhone = `91${phone}`; // Add country code

      // PRODUCTION: Call production endpoint via authService
      const response = await authService.sendOTP(formattedPhone);

      // Check if user is new and needs to provide name/email
      setIsNewUser(response.data.isNewUser);
      setOtpSent(true);
      setError("");

      // Show success message
      console.log("OTP sent successfully via WhatsApp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle OTP verification - Verify OTP and authenticate user
   * Get auth token and store it for booking
   */
  const handleVerifyOtp = async (otpValue?: string) => {
    const otpToVerify = otpValue || otpDigits.join("");

    if (otpToVerify.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    // Validate required fields for new users
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
        setError("Please enter a valid age");
        return;
      }
      if (!gender) {
        setError("Please select your gender");
        return;
      }
    }

    setError("");
    setIsLoading(true);

    try {
      const formattedPhone = `91${phone}`;

      // Verify OTP with enhanced user data for new users
      const response = await authService.verifyOTP(
        formattedPhone,
        otpToVerify,
        isNewUser ? firstName.trim() : undefined,
        isNewUser ? lastName.trim() : undefined,
        isNewUser && email.trim() ? email.trim() : undefined,
        isNewUser ? Number(age) : undefined,
        isNewUser ? gender : undefined,
      );

      // Check if legacy user requires profile completion
      if (response.data.requiresProfileCompletion) {
        setProfileCompletionPhone(formattedPhone);
        setShowProfileCompletion(true);
        setIsLoading(false);
        return;
      }

      setIsVerified(true);

      // Store phone, OTP, and auth status in booking data
      const updated = {
        ...bookingData,
        phone: `+${formattedPhone}`,
        otp: otpToVerify,
        authenticated: true,
      };
      setBookingData(updated);

      // Continue to next step after showing success
      setTimeout(() => {
        onContinue();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle OTP digit input
   */
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace in OTP input
   */
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      otpRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle paste in OTP input
   */
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char));

    if (digits.length > 0) {
      const newDigits = [...otpDigits];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newDigits[index] = digit;
        }
      });
      setOtpDigits(newDigits);

      // Focus last filled input
      const lastIndex = Math.min(digits.length - 1, 5);
      otpRefs.current[lastIndex]?.focus();
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
            disabled={!phone || isLoading}
            className="w-full bg-[#1c0d54] text-white py-3 rounded-full font-semibold hover:bg-[#2a1470] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        ) : (
          <>
            {/* Success Message */}
            {isVerified && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Verified Successfully!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Proceeding to booking confirmation...
                  </p>
                </div>
              </div>
            )}

            {/* OTP Input Section */}
            {!isVerified && (
              <>
                <div>
                  <label className="block mb-3 text-sm font-medium">
                    Enter OTP
                  </label>

                  {/* 6-Digit OTP Boxes */}
                  <div className="flex gap-2 justify-center mb-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        disabled={isLoading}
                        className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all ${
                          digit
                            ? "border-[#034B44] bg-[#d2fafa] text-[#034B44]"
                            : "border-[#a7c4f2]/50 bg-white"
                        } focus:ring-2 focus:ring-[#81b2f0] disabled:opacity-70`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-center text-gray-500 mt-2">
                    OTP sent to +91{phone} via WhatsApp
                  </p>
                </div>

                {/* New User Details - Show enhanced registration form if isNewUser */}
                {isNewUser && (
                  <div className="space-y-3 pt-2 border-t border-[#a7c4f2]/30">
                    <p className="text-sm text-[#034B44] font-medium text-center">
                      Welcome! Please provide your details
                    </p>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#81b2f0]"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#81b2f0]"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#81b2f0]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          placeholder="Enter your age"
                          min="1"
                          max="150"
                          className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 pr-16 outline-none focus:ring-2 focus:ring-[#81b2f0]"
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
                          disabled={isLoading}
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
                            className="px-2 py-0.5 text-xs bg-[#034B44] text-white rounded hover:bg-[#046e63] transition-colors"
                            disabled={isLoading}
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
                            className="px-2 py-0.5 text-xs bg-[#034B44] text-white rounded hover:bg-[#046e63] transition-colors mt-0.5"
                            disabled={isLoading}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-[#a7c4f2]/50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#81b2f0] bg-white"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={isLoading}
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
                  </div>
                )}

                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={otpDigits.join("").length !== 6 || isLoading}
                  className="w-full bg-[#1c0d54] text-white py-3 rounded-full font-semibold hover:bg-[#2a1470] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>

                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtpDigits(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  disabled={isLoading}
                  className="w-full text-[#1c0d54] py-2 rounded-full font-medium hover:underline disabled:opacity-50"
                >
                  Change Phone Number
                </button>
              </>
            )}
          </>
        )}

        {error && (
          <p className="text-red-600 text-sm text-center font-medium mt-2">
            {error}
          </p>
        )}
      </div>

      {/* Profile Completion Modal for Legacy Users */}
      <ProfileCompletionModal
        isOpen={showProfileCompletion}
        phone={profileCompletionPhone}
        onComplete={() => {
          setShowProfileCompletion(false);
          setIsVerified(true);

          // Store booking data and continue
          const updated = {
            ...bookingData,
            phone: `+${profileCompletionPhone}`,
            authenticated: true,
          };
          setBookingData(updated);

          setTimeout(() => {
            onContinue();
          }, 1000);
        }}
        onSkip={() => {
          setShowProfileCompletion(false);
          setIsVerified(true);

          // Store booking data and continue
          const updated = {
            ...bookingData,
            phone: `+${profileCompletionPhone}`,
            authenticated: true,
          };
          setBookingData(updated);

          setTimeout(() => {
            onContinue();
          }, 500);
        }}
      />
    </div>
  );
}
