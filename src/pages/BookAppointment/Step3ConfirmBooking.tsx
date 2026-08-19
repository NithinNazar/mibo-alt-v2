import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import BookingSummarySidebar from "../../components/BookingSummarySidebar";
import type { Doctor } from "../Experts/data/doctors";
import phoneVerifyBg from "../Experts/assets/phone-verify-bg.jpg";
import { loadRazorpay } from "../../utils/loadRazorpay";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  CreditCard,
  Shield,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  SquarePen,
  X,
} from "lucide-react";

type ToastType = "success" | "error";

/** Fixed top-center toast used for transient success/error feedback across
 * the payment flow. Slides + fades in, auto-dismisses, and can be closed
 * manually via the X button. */
function Toast({
  toast,
  visible,
  onDismiss,
}: {
  toast: { type: ToastType; message: string } | null;
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-md transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-3 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-2xl border shadow-[0_10px_34px_rgba(10,46,35,0.18)] backdrop-blur-sm ${
          isSuccess
            ? "bg-[#eafff5]/95 border-green-200"
            : "bg-[#fff1f1]/95 border-red-200"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-[18px] h-[18px] text-green-600" />
          ) : (
            <AlertCircle className="w-[18px] h-[18px] text-red-600" />
          )}
        </div>
        <p
          className={`flex-1 text-[13.5px] font-medium leading-snug pt-1 ${
            isSuccess ? "text-green-800" : "text-red-800"
          }`}
        >
          {toast.message}
        </p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface Step3ConfirmBookingProps {
  doctor?: Doctor | null;
  bookingData: any;
  onBack: () => void;
}

type PaymentStep = "review" | "processing" | "success" | "failed";

/** Small labeled field used in the "Your Details" grid — icon + value in a
 * soft mint-tinted box, matching the rest of the booking flow's inputs. */
function DetailField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly = false,
  suffix,
  required = false,
}: {
  icon: any;
  label: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  suffix?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#0a2e23] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex items-center gap-2.5 border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 transition-all ${
          readOnly
            ? "bg-[#f4f9f7]"
            : "bg-white focus-within:ring-2 focus-within:ring-[#0e6b4f]/30 focus-within:border-[#0e6b4f]"
        }`}
      >
        <Icon className="w-4 h-4 text-[#0e6b4f] shrink-0" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-[#0a2e23] placeholder:text-[#a8b5af]"
        />
        {suffix && (
          <span className="text-xs text-[#6b7a74] shrink-0">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default function Step3ConfirmBooking({
  doctor = null,
  bookingData,
  onBack,
}: Step3ConfirmBookingProps) {
  const navigate = useNavigate();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("review");
  const [error, setError] = useState("");
  const [razorpayLoading, setRazorpayLoading] = useState(false);

  // Top-center toast notifications (success / error)
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = () => {
    setToastVisible(false);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastHideRef.current) clearTimeout(toastHideRef.current);
    toastHideRef.current = setTimeout(() => setToast(null), 300);
  };

  const showToast = (type: ToastType, message: string, duration = 4000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastHideRef.current) clearTimeout(toastHideRef.current);
    setToast({ type, message });
    // Let the element mount first, then trigger the entrance transition
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setToastVisible(true)),
    );
    toastTimerRef.current = setTimeout(dismissToast, duration);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (toastHideRef.current) clearTimeout(toastHideRef.current);
    };
  }, []);

  // Pre-fill user data if already authenticated
  const currentUser = authService.getCurrentUser();
  const splitName = (name?: string) => {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    return {
      first: parts.slice(0, -1).join(" ") || parts[0] || "",
      last: parts.length > 1 ? parts[parts.length - 1] : "",
    };
  };
  const initialName = splitName(currentUser?.fullName);
  const [firstName, setFirstName] = useState(initialName.first);
  const [lastName, setLastName] = useState(initialName.last);
  const [email, setEmail] = useState(currentUser?.email || "");
  const [age, setAge] = useState(bookingData.age || currentUser?.age || "");
  const [gender, setGender] = useState(
    bookingData.gender || currentUser?.gender || "",
  );
  const fullName = `${firstName} ${lastName}`.trim();
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("mibo_access_token");
        if (!accessToken) {
          setUserDataLoaded(true);
          return;
        }

        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";

        const response = await fetch(`${apiBaseUrl}/patient/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.data.user;

          // Auto-fill with user's actual data
          const split = splitName(user.full_name);
          setFirstName(split.first);
          setLastName(split.last);
          setEmail(user.email || "");
          if (user.age) setAge(user.age);
          if (user.gender) setGender(user.gender);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserDataLoaded(true);
      }
    };

    fetchUserData();
  }, []);

  // Registration fee state
  const [registrationFee, setRegistrationFee] = useState<number>(0);
  const [hasPaidRegistrationFee, setHasPaidRegistrationFee] =
    useState<boolean>(true);
  const [loadingFeeStatus, setLoadingFeeStatus] = useState<boolean>(true);
  // Fee status error state (true if backend failed to return fee info)
  const [feeStatusError, setFeeStatusError] = useState<boolean>(false);

  // Patient notes state
  const [patientNotes, setPatientNotes] = useState<string>("");

  // Fetch registration fee status on mount
  useEffect(() => {
    const fetchRegistrationFeeStatus = async () => {
      try {
        setLoadingFeeStatus(true);
        setFeeStatusError(false);
        const accessToken = localStorage.getItem("mibo_access_token");

        if (!accessToken) {
          // User not logged in yet, assume new user
          setHasPaidRegistrationFee(false);
          setRegistrationFee(100);
          setLoadingFeeStatus(false);
          return;
        }

        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";

        const response = await fetch(
          `${apiBaseUrl}/payments/registration-fee-status`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setHasPaidRegistrationFee(data.data.hasPaidRegistrationFee);
          setRegistrationFee(data.data.registrationFee);
        } else if (import.meta.env.DEV) {
          // Dev-only fallback so the flow is still testable without a
          // running backend.
          setHasPaidRegistrationFee(false);
          setRegistrationFee(100);
        } else {
          // Production: don't fabricate a fee — surface a real error
          // state so the user isn't shown/charged a made-up amount.
          setFeeStatusError(true);
        }
      } catch (error) {
        console.error("Error fetching registration fee status:", error);
        if (import.meta.env.DEV) {
          setHasPaidRegistrationFee(false);
          setRegistrationFee(100);
        } else {
          setFeeStatusError(true);
        }
      } finally {
        setLoadingFeeStatus(false);
      }
    };

    fetchRegistrationFeeStatus();
  }, []);

  // Calculate total amount. consultationFee falls back to the doctor's
  // listed price only if bookingData didn't carry an amount through —
  // this is real data from earlier in the flow, not fabricated.
  const consultationFee = bookingData.amount || bookingData.price || 0;
  const totalAmount = consultationFee + registrationFee;

  /**
   * Handle payment confirmation - Real Razorpay integration with NEW booking flow
   * Step 0: Verify OTP with name and email
   * Step 1: Create appointment
   * Step 2: Create payment order
   * Step 3: Open Razorpay modal
   */

  const convertToUTC = (date: string, time: string) => {
    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");

    const localDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    );

    return localDate.toISOString();
  };

  // Helper function to parse date string (YYYY-MM-DD) without timezone issues
  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  /**
   * Convert 24-hour time format to 12-hour format with AM/PM
   * @param time24 - Time in HH:MM format (e.g., "14:00")
   * @returns Time in 12-hour format (e.g., "2:00 PM")
   */
  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleConfirmPayment = async () => {
    // Validate name and email
    if (!fullName.trim()) {
      showToast("error", "Please enter your full name");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("error", "Please enter a valid email address");
      return;
    }

    setError("");
    setPaymentStep("processing");

    try {
      // Step 0: Verify OTP with name and email to get auth token
      // Get access token from localStorage (set by authService during OTP verification on Step2)
      const accessToken = localStorage.getItem("mibo_access_token");
      if (!accessToken) {
        throw new Error(
          "Authentication failed. Please go back and verify OTP again.",
        );
      }

      // Update user profile with name and email
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";
        await fetch(`${apiBaseUrl}/patient-auth/update-profile`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName,
            email: email || undefined,
          }),
        });
        console.log("✅ User profile updated with name and email");
      } catch (profileErr) {
        console.warn(
          "Profile update failed, continuing with booking:",
          profileErr,
        );
        // Don't fail the booking if profile update fails
      }

      // Log booking data for debugging
      console.log("📋 Full booking data:", bookingData);

      const appointmentPayload = {
        clinicianId: parseInt(bookingData.clinicianId),
        centreId: parseInt(bookingData.centreId),
        appointmentDate: bookingData.date, // Already in "YYYY-MM-DD" format
        appointmentTime: bookingData.time, // "10:00"
        appointmentType: bookingData.appointmentType, // "ONLINE" or "IN_PERSON"
        appointmentDateUTC: convertToUTC(bookingData.date, bookingData.time),
        patientNotes: patientNotes.trim() || undefined, // Add patient notes
      };

      console.log("📤 Sending appointment payload:", appointmentPayload);

      // Step 1: Create appointment
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";
      const appointmentResponse = await fetch(`${apiBaseUrl}/booking/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentPayload),
      });

      const appointmentData = await appointmentResponse.json();
      if (!appointmentResponse.ok) {
        console.error("Appointment creation failed:", appointmentData);
        throw new Error(
          appointmentData.message || "Failed to create appointment",
        );
      }

      const appointmentId = appointmentData.data.appointment.id;
      console.log("✅ Appointment created:", appointmentId);

      // Step 2: Create payment order
      const paymentResponse = await fetch(
        `${apiBaseUrl}/payments/create-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: appointmentId,
          }),
        },
      );

      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message || "Failed to create payment order",
        );
      }

      console.log("✅ Payment order created");

      // Step 3: Open Razorpay with order details
      setPaymentStep("review");
      openRazorpayModal(
        paymentData.data.orderId,
        paymentData.data.amount,
        appointmentId,
        paymentData.data.razorpayKeyId,
      );
    } catch (err: any) {
      console.error("Booking error:", err);
      const message =
        err.message || "Failed to process booking. Please try again.";
      setError(message);
      showToast("error", message);
      setPaymentStep("review");
    }
  };

  /**
   * Open Razorpay payment modal
   */
  const openRazorpayModal = async (
    orderId: string,
    amount: number,
    appointmentId: number,
    razorpayKeyId: string,
  ) => {
    // Load Razorpay SDK dynamically if not already loaded
    try {
      setRazorpayLoading(true);
      await loadRazorpay();
      setRazorpayLoading(false);
    } catch (err) {
      setRazorpayLoading(false);
      setError("Failed to load payment gateway. Please refresh and try again.");
      showToast("error", "Failed to load payment gateway");
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setError("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    const reportPaymentFailure = (
      errorCode: string,
      errorDescription: string,
    ) => {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";
      const accessToken = localStorage.getItem("mibo_access_token");
      fetch(`${apiBaseUrl}/payments/failure`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          razorpayOrderId: orderId,
          errorCode,
          errorDescription,
        }),
      }).catch((err) =>
        console.error("Failed to report payment failure:", err),
      );
    };

    const options = {
      key: razorpayKeyId, // Use key from backend
      amount: amount, // Already in paise from backend
      currency: "INR",
      name: "Mibo Mental Health",
      description: "Consultation Booking",
      order_id: orderId,
      handler: async function (response: any) {
        // Payment successful - verify on backend
        setPaymentStep("processing");
        try {
          const accessToken = localStorage.getItem("mibo_access_token");
          const apiBaseUrl =
            import.meta.env.VITE_API_BASE_URL || "https://api.mibo.care/api";

          const verifyResponse = await fetch(`${apiBaseUrl}/payments/verify`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appointmentId: appointmentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok) {
            throw new Error(
              verifyData.message || "Payment verification failed",
            );
          }

          setPaymentStep("success");
          showToast("success", "Payment successful! Confirming your booking…");

          // Save booking info for dashboard
          const bookingInfo = {
            ...bookingData,
            appointmentId: appointmentId,
            status: "CONFIRMED",
            paymentStatus: "PAID",
            transactionId: response.razorpay_payment_id,
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem("latestBooking", JSON.stringify(bookingInfo));

          // Navigate to dashboard after showing success
          setTimeout(() => {
            navigate("/profileDashboard", {
              state: {
                bookingSuccess: true,
                appointmentId: appointmentId,
              },
            });
          }, 3000);
        } catch (err: any) {
          const message = err.message || "Payment verification failed";
          setError(message);
          showToast("error", message);
          setPaymentStep("failed");
        }
      },
      modal: {
        ondismiss: function () {
          reportPaymentFailure(
            "PAYMENT_CANCELLED",
            "Payment cancelled by user",
          );
          const message = "Payment cancelled. Please try again.";
          setError(message);
          showToast("error", message);
          setPaymentStep("review");
        },
      },
      prefill: {
        name: fullName,
        email: email || undefined,
        contact: bookingData.phone,
      },
      theme: {
        color: "#0e6b4f",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response: any) {
      reportPaymentFailure(
        response.error.code || "PAYMENT_FAILED",
        response.error.description || "Payment failed",
      );
      const message =
        response.error.description || "Payment failed. Please try again.";
      setError(message);
      showToast("error", message);
      setPaymentStep("failed");
    });

    razorpay.open();
  };

  // Render different views based on payment step

  // Registration-fee status couldn't be loaded from the backend in
  // production (no dev fallback applies here) — show a real error state
  // instead of letting the user proceed with a fabricated fee.
  if (feeStatusError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#eef6f2] text-[#0a2e23] p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Couldn't Load Booking Details
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't confirm the fees for this booking right now. Please
              try again in a moment.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#0e6b4f] text-white font-semibold rounded-full hover:bg-[#0b5940] transition-all"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#eef6f2] text-[#0a2e23] p-6">
        <Toast toast={toast} visible={toastVisible} onDismiss={dismissToast} />
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setPaymentStep("review");
                setError("");
              }}
              className="w-full py-3 bg-[#0e6b4f] text-white font-semibold rounded-full hover:bg-[#0b5940] transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/experts")}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all"
            >
              Back to Experts
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#eef6f2] text-[#0a2e23] p-6">
        <Toast toast={toast} visible={toastVisible} onDismiss={dismissToast} />
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 animate-spin text-[#0e6b4f] mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
          <p className="text-gray-600 mb-4">
            Please wait while we confirm your payment...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure Payment Gateway</span>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#eef6f2] text-[#0a2e23] p-6">
        <Toast toast={toast} visible={toastVisible} onDismiss={dismissToast} />
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been confirmed
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Appointment ID</span>
              <span className="font-mono font-semibold text-[#0a2e23]">
                #{bookingData.appointmentId}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Consultation Fee</span>
              <span className="font-semibold text-green-700">
                ₹{consultationFee}
              </span>
            </div>
            {!hasPaidRegistrationFee && registrationFee > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Registration Fee</span>
                <span className="font-semibold text-green-700">
                  ₹{registrationFee}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-2 pt-2 border-t border-green-200">
              <span className="text-sm text-gray-600">Total Amount Paid</span>
              <span className="font-semibold text-green-700">
                ₹{totalAmount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
                CONFIRMED
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Appointment Details
                </p>
                <p className="text-xs text-blue-700">
                  {parseLocalDate(bookingData.date).toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}{" "}
                  at {formatTime12Hour(bookingData.time)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {bookingData.clinicianName} • {bookingData.mode}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Redirecting to your dashboard...
          </p>

          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-[#0e6b4f] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#0e6b4f] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#0e6b4f] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Review and Payment step
  return (
    <div
      className="min-h-screen flex flex-col bg-[#eef6f2] bg-cover bg-center bg-no-repeat md:bg-fixed text-[#0a2e23]"
      style={{ backgroundImage: `url(${phoneVerifyBg})` }}
    >
      <Toast toast={toast} visible={toastVisible} onDismiss={dismissToast} />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-28">
        <div className="mx-auto w-full max-w-[1440px] py-2.5 sm:py-3">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(260px,300px)_1fr] lg:gap-6">
            {/* ================= LEFT: shared booking summary sidebar ================= */}
            <BookingSummarySidebar
              doctor={doctor}
              currentStep={3}
              onBack={onBack}
            />

            {/* ================= RIGHT: Review & Pay content (unchanged logic) ================= */}
            <div className="w-full max-w-[900px] space-y-3.5 sm:space-y-4">
              {/* Header */}
              {/* <div className="flex items-center gap-2.5 pt-1 pb-1">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-2xl bg-white shadow-[0_4px_14px_rgba(10,46,35,0.10)] text-[#0e6b4f] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-[17px] sm:text-lg font-bold text-[#0a2e23]">
              Review & Pay
            </h2>
            <p className="text-[12px] text-[#6b7a74]">
              Please review your details and confirm your booking
            </p>
          </div>
        </div> */}

              {/* User Details Form */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(10,46,35,0.08)] border border-[#dfe8e4]">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-10 h-10 bg-[#eaf6f1] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0e6b4f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0a2e23]">
                      Your Details
                    </h3>
                    <p className="text-xs text-[#6b7a74]">
                      Review your booking information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <DetailField
                    icon={User}
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                  <DetailField
                    icon={User}
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                  <DetailField
                    icon={Mail}
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="your.email@example.com"
                  />
                  <DetailField
                    icon={Calendar}
                    label="Age"
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="Enter your age"
                    suffix={age ? "years" : undefined}
                  />
                  <DetailField
                    icon={Phone}
                    label="Phone Number"
                    value={bookingData.phone || ""}
                    readOnly
                    required
                  />
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0a2e23] mb-1.5">
                      Gender
                    </label>
                    <div className="flex items-center gap-2.5 border border-[#dfe8e4] rounded-xl px-3.5 py-2.5 bg-white focus-within:ring-2 focus-within:ring-[#0e6b4f]/30 focus-within:border-[#0e6b4f] transition-all">
                      <User className="w-4 h-4 text-[#0e6b4f] shrink-0" />
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-[#0a2e23] appearance-none"
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
                </div>

                <p className="text-xs text-[#6b7a74] mt-2.5">
                  We'll send booking confirmation to this email
                </p>
              </div>

              {/* Patient Notes Section */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(10,46,35,0.08)] border border-[#dfe8e4]">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 bg-[#eaf6f1] rounded-full flex items-center justify-center">
                    <SquarePen className="w-5 h-5 text-[#0e6b4f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0a2e23]">
                      Additional Notes
                    </h3>
                    <p className="text-xs text-[#6b7a74]">
                      Optional: Share any special needs or conditions
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Notes <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    placeholder="E.g., First time consultation, anxiety about specific topics, preferred communication style, etc."
                    rows={3}
                    maxLength={300}
                    className="w-full px-4 py-2.5 border border-[#dfe8e4] rounded-xl focus:ring-2 focus:ring-[#0e6b4f]/30 focus:border-[#0e6b4f] focus:outline-none transition-all resize-none"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-[#6b7a74] italic">
                      Help your clinician prepare for your session
                    </p>
                    <p className="text-xs text-gray-400">
                      {patientNotes.length}/300
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary Card */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(10,46,35,0.08)] border border-[#dfe8e4]">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 bg-[#eaf6f1] rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#0e6b4f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0a2e23]">
                      Payment Summary
                    </h3>
                    <p className="text-xs text-[#6b7a74]">
                      Review your payment details
                    </p>
                  </div>
                </div>

                {loadingFeeStatus ? (
                  <div className="text-center py-3">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0e6b4f]"></div>
                    <p className="text-xs text-gray-600 mt-1.5">
                      Calculating fees...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        Consultation Fee
                      </span>
                      <span className="font-semibold">₹{consultationFee}</span>
                    </div>

                    {!hasPaidRegistrationFee && registrationFee > 0 && (
                      <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          One time registration fee (For new booking)
                        </span>
                        <span className="font-semibold">
                          ₹{registrationFee}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        Platform Fee
                      </span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>

                    <div className="flex items-center justify-between py-2.5 bg-[#eaf6f1] rounded-lg px-3">
                      <span className="font-bold text-[#0a2e23]">
                        Total Amount
                      </span>
                      <span className="font-bold text-2xl text-[#0e6b4f]">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notices */}
                <div className="space-y-1.5 mt-3">
                  {!hasPaidRegistrationFee && registrationFee > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          This is your first booking with MIBO. A one-time
                          registration fee of ₹{registrationFee} will be added
                          to your consultation fee.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">
                        Your payment is secured with 256-bit SSL encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Summary */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(10,46,35,0.08)] border border-[#dfe8e4]">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 bg-[#eaf6f1] rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#0e6b4f]" />
                  </div>
                  <h3 className="font-bold text-base text-[#0a2e23]">
                    Appointment Summary
                  </h3>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-medium text-right">
                      {bookingData.clinicianName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Centre</span>
                    <span className="font-medium text-right">
                      {bookingData.centreName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Mode</span>
                    <span className="font-medium">{bookingData.mode}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium text-right">
                      {parseLocalDate(bookingData.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}{" "}
                      • {formatTime12Hour(bookingData.time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{bookingData.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Confirm Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#dfe8e4] bg-white z-20">
        <div className="max-w-[680px] lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <button
            onClick={handleConfirmPayment}
            disabled={!fullName.trim() || loadingFeeStatus}
            className="w-full py-3 sm:py-3.5 bg-[#0e6b4f] text-white font-bold rounded-full hover:bg-[#0b5940] transition-all shadow-md flex items-center justify-center gap-2 text-[15px] sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            {loadingFeeStatus ? "Loading..." : `Confirm & Pay ₹${totalAmount}`}
          </button>
          <p className="text-xs text-center text-[#6b7a74] mt-2">
            By confirming, you agree to our{" "}
            <span className="text-[#0e6b4f] font-semibold">
              terms and conditions
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
