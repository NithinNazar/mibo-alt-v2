import { useState, useRef } from "react";
import { Loader2, ShieldCheck, ArrowRight, ChevronDown, Lock, Users } from "lucide-react";
import authService from "../../services/authService";
import ProfileCompletionModal from "../../components/ProfileCompletionModal";
import BookingSummarySidebar from "../../components/BookingSummarySidebar";
import phoneVerifyBg from "../Experts/assets/phone-verify-bg.jpg";
import phoneVerifyIllustration from "../Experts/assets/phone-verify-illustration.png";
import type { Doctor } from "../Experts/data/doctors";

interface Step2PhoneVerificationProps {
  doctor?: Doctor | null;
  bookingData: any;
  setBookingData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function Step2PhoneVerification({
  doctor = null,
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

  const bumpAge = (delta: number) => {
    setAge((prev) => {
      const current = typeof prev === "number" ? prev : 0;
      return Math.min(150, Math.max(1, current + delta));
    });
  };

  return (
    <div
      className="min-h-screen w-full bg-[#eef6f2] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${phoneVerifyBg})` }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-start justify-center px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100vh-2rem)] lg:items-center lg:px-8 xl:px-10">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[30%_70%] lg:gap-8">
          {/* ================= LEFT: shared booking summary sidebar ================= */}
          <BookingSummarySidebar doctor={doctor} currentStep={2} onBack={onBack} />

          {/* ================= RIGHT: OTP verification content (unchanged logic) ================= */}
          <div className="flex min-w-0 flex-col items-center justify-center">
            <div className="w-full max-w-[640px]">
              <div className="w-full bg-white rounded-2xl sm:rounded-[24px] shadow-[0_8px_30px_rgba(10,46,35,0.08)] p-7 sm:p-10 md:p-12">
                {/* ============================================================ */}
          {/* Everything below is UNCHANGED — the page before OTP is sent  */}
          {/* ============================================================ */}
          {!otpSent && (
            <div className="flex justify-center mb-6 sm:mb-8">
              <img
                src={phoneVerifyIllustration}
                alt="Verify your phone number"
                className="w-[150px] sm:w-[180px] md:w-[190px] h-auto select-none pointer-events-none"
                draggable={false}
              />
            </div>
          )}

          {!otpSent ? (
            <>
              <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[#0a2e23] text-center mb-3 tracking-tight">
                Verify your phone number
              </h1>
              <p className="text-[#6b7a74] text-[14px] sm:text-[15.5px] text-center leading-relaxed mb-7 sm:mb-8 max-w-[420px] mx-auto">
                Enter your mobile number and we'll send you a one-time
                password (OTP) to verify your account.
              </p>

              <div className="mb-6">
                <label className="block mb-2 text-[13.5px] sm:text-sm font-semibold text-[#0e6b4f]">
                  Enter your phone number
                </label>
                <div className="w-full flex items-center border border-[#dfe8e4] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0e6b4f]/30 focus-within:border-[#0e6b4f] transition-all bg-white">
                  
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    className="flex-1 min-w-0 px-3.5 py-3 sm:py-3.5 text-[14px] sm:text-[15px] outline-none placeholder:text-[#a8b5af] text-[#0a2e23] bg-transparent"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={!phone || isLoading}
                className="w-full bg-[#0e6b4f] text-white py-3.5 sm:py-4 rounded-xl font-bold text-[15px] sm:text-[16px] hover:bg-[#0b5940] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[12px] sm:text-[13px] text-[#0e6b4f] bg-[#f0faf6] border border-[#dcefe7] rounded-xl py-3 mt-6">
                <Lock className="w-4 h-4 shrink-0" />
                We never share your number with anyone.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] sm:text-xs text-[#6b7a74] mt-6">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0e6b4f]" />
                  100% Secure
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0e6b4f]" />
                  End-to-end Encrypted
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0e6b4f]" />
                  Your Privacy Matters
                </span>
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center font-medium mt-4">
                  {error}
                </p>
              )}
            </>
          ) : (
            /* ============================================================ */
            /* OTP-sent state — restyled to match the reference image      */
            /* ============================================================ */
            <div className="flex flex-col">
              {/* Illustration stays visible in this state too, per reference */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <img
                  src={phoneVerifyIllustration}
                  alt="Verify your phone number"
                  className="w-[150px] sm:w-[180px] md:w-[190px] h-auto select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[#0a2e23] text-center mb-3 tracking-tight">
                Verify your phone number
              </h1>
              <p className="text-[#6b7a74] text-[14px] sm:text-[15.5px] text-center leading-relaxed mb-7 sm:mb-8 max-w-[420px] mx-auto">
                Enter your mobile number and we'll send you a one-time
                password (OTP) to verify your account.
              </p>

              {/* Phone number (read-only once OTP has been sent) */}
              <div className="mb-6">
                <label className="block mb-2 text-[13.5px] sm:text-sm font-semibold text-[#0e6b4f]">
                  Enter your phone number
                </label>
                <div className="w-full flex items-center border border-[#dfe8e4] rounded-xl overflow-hidden bg-white">
                  <div className="flex items-center gap-1.5 px-3.5 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-semibold text-[#0a2e23] shrink-0">
                    +91
                  </div>
                  <div className="w-px h-6 bg-[#e4ece8] shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    readOnly
                    className="flex-1 min-w-0 px-3.5 py-3 sm:py-3.5 text-[14px] sm:text-[15px] outline-none text-[#0a2e23] bg-transparent"
                  />
                </div>
              </div>

              {/* OTP */}
              <div className="mb-1">
                <label className="block mb-3 text-[13.5px] sm:text-sm font-semibold text-[#0e6b4f]">
                  Enter OTP
                </label>

                <div className="flex gap-2 sm:gap-2.5 justify-center mb-3">
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
                      className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl outline-none transition-all bg-white text-[#0a2e23] ${
                        digit ? "border-[#0e6b4f]" : "border-[#dfe8e4]"
                      } focus:ring-2 focus:ring-[#0e6b4f]/30 disabled:opacity-70`}
                    />
                  ))}
                </div>

                <p className="text-[12px] sm:text-[13px] text-center text-[#6b7a74]">
                  OTP sent to{" "}
                  <span className="font-semibold text-[#0a2e23]">
                    +91{phone}
                  </span>{" "}
                  via{" "}
                  <span className="font-semibold text-[#0e6b4f]">
                    WhatsApp
                  </span>
                </p>
              </div>

              {/* New User Details */}
              {isNewUser && (
                <div className="pt-4 sm:pt-5 mt-4 border-t border-[#eaf0ed]">
                  <p className="text-[14px] sm:text-[15px] text-[#0a2e23] font-semibold text-center mb-4 sm:mb-5">
                    Welcome! Please provide your details
                  </p>

                  <div className="space-y-3.5 sm:space-y-4">
                    {/* First Name */}
                    <div>
                      <label className="block mb-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#0a2e23]">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 sm:py-3 text-[14px] outline-none placeholder:text-[#a8b5af] text-[#0a2e23] focus:ring-2 focus:ring-[#0e6b4f]/30 focus:border-[#0e6b4f] transition-all"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block mb-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#0a2e23]">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        className="w-full border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 sm:py-3 text-[14px] outline-none placeholder:text-[#a8b5af] text-[#0a2e23] focus:ring-2 focus:ring-[#0e6b4f]/30 focus:border-[#0e6b4f] transition-all"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block mb-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#0a2e23]">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        placeholder="youremail@example.com"
                        className="w-full border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 sm:py-3 text-[14px] outline-none placeholder:text-[#a8b5af] text-[#0a2e23] focus:ring-2 focus:ring-[#0e6b4f]/30 focus:border-[#0e6b4f] transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block mb-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#0a2e23]">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          placeholder="Enter your age"
                          min={1}
                          max={150}
                          className="w-full border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 sm:py-3 pr-10 text-[14px] outline-none placeholder:text-[#a8b5af] text-[#0a2e23] focus:ring-2 focus:ring-[#0e6b4f]/30 focus:border-[#0e6b4f] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                        <div className="absolute right-2.5 flex flex-col gap-[3px]">
                          <button
                            type="button"
                            onClick={() => bumpAge(1)}
                            aria-label="Increase age"
                            className="w-4 h-3.5 flex items-center justify-center text-[#0e6b4f] hover:text-[#0b5940] transition-colors leading-none"
                            disabled={isLoading}
                          >
                            <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                              <path d="M1 5L4.5 1L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => bumpAge(-1)}
                            aria-label="Decrease age"
                            className="w-4 h-3.5 flex items-center justify-center text-[#0e6b4f] hover:text-[#0b5940] transition-colors leading-none"
                            disabled={isLoading}
                          >
                            <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
                              <path d="M1 1L4.5 5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block mb-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#0a2e23]">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 sm:py-3 pr-10 text-[14px] outline-none bg-white focus:ring-2 focus:ring-[#0e6b4f]/30 focus:border-[#0e6b4f] transition-all text-[#0a2e23]"
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
                        <ChevronDown className="w-4 h-4 text-[#6b7a74] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-600 text-[13px] text-center font-medium mt-4">
                  {error}
                </p>
              )}

              <button
                onClick={() => handleVerifyOtp()}
                disabled={otpDigits.join("").length !== 6 || isLoading}
                className="w-full mt-5 sm:mt-6 bg-[#0e6b4f] text-white py-3 sm:py-3.5 rounded-full font-bold text-[14.5px] sm:text-[15px] hover:bg-[#0b5940] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                className="w-full text-[#0e6b4f] py-3 mt-1 font-semibold text-[14px] hover:underline disabled:opacity-50"
              >
                Change Phone Number
              </button>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
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