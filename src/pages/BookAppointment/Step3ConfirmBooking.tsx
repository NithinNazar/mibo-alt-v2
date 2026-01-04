import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

interface Step3ConfirmBookingProps {
  bookingData: any;
  onBack: () => void;
}

type PaymentStep = "review" | "processing" | "success" | "failed";

export default function Step3ConfirmBooking({
  bookingData,
  onBack,
}: Step3ConfirmBookingProps) {
  const navigate = useNavigate();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("review");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  /**
   * Handle payment confirmation - Real Razorpay integration with NEW booking flow
   * Step 0: Verify OTP with name and email
   * Step 1: Create appointment
   * Step 2: Create payment order
   * Step 3: Open Razorpay modal
   */
  const handleConfirmPayment = async () => {
    // Validate name and email
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
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
          "Authentication failed. Please go back and verify OTP again."
        );
      }

      // Update user profile with name and email
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
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
          profileErr
        );
        // Don't fail the booking if profile update fails
      }

      // Log booking data for debugging
      console.log("📋 Full booking data:", bookingData);

      const appointmentPayload = {
        clinicianId: parseInt(bookingData.clinicianId),
        centreId: parseInt(bookingData.centreId),
        appointmentDate: bookingData.date.split("T")[0], // "2026-01-10"
        appointmentTime: bookingData.time, // "10:00"
        appointmentType: bookingData.appointmentType, // "ONLINE" or "IN_PERSON"
      };

      console.log("📤 Sending appointment payload:", appointmentPayload);

      // Step 1: Create appointment
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
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
          appointmentData.message || "Failed to create appointment"
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
        }
      );

      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message || "Failed to create payment order"
        );
      }

      console.log("✅ Payment order created");

      // Step 3: Open Razorpay with order details
      setPaymentStep("review");
      openRazorpayModal(
        paymentData.data.orderId,
        paymentData.data.amount,
        appointmentId,
        paymentData.data.razorpayKeyId
      );
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to process booking. Please try again.");
      setPaymentStep("review");
    }
  };

  /**
   * Open Razorpay payment modal
   */
  const openRazorpayModal = (
    orderId: string,
    amount: number,
    appointmentId: number,
    razorpayKeyId: string
  ) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setError("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

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
            import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
              verifyData.message || "Payment verification failed"
            );
          }

          setPaymentStep("success");

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
          setError(err.message || "Payment verification failed");
          setPaymentStep("failed");
        }
      },
      modal: {
        ondismiss: function () {
          // User closed the payment modal
          setError("Payment cancelled. Please try again.");
          setPaymentStep("review");
        },
      },
      prefill: {
        name: fullName,
        email: email || undefined,
        contact: bookingData.phone,
      },
      theme: {
        color: "#034B44",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response: any) {
      // Payment failed
      setError(
        response.error.description || "Payment failed. Please try again."
      );
      setPaymentStep("failed");
    });

    razorpay.open();
  };

  // Render different views based on payment step
  if (paymentStep === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6f4] text-[#034B44] p-6">
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
              className="w-full py-3 bg-[#034B44] text-white font-semibold rounded-full hover:bg-[#046e63] transition-all"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6f4] text-[#034B44] p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 animate-spin text-[#034B44] mx-auto" />
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6f4] text-[#034B44] p-6">
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
              <span className="font-mono font-semibold text-[#034B44]">
                #{bookingData.appointmentId}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Amount Paid</span>
              <span className="font-semibold text-green-700">
                ₹{bookingData.amount || bookingData.price || 1600}
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
                  {new Date(bookingData.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {bookingData.time}
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
            <div className="w-2 h-2 bg-[#034B44] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#034B44] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#034B44] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Review and Payment step
  return (
    <div className="min-h-screen flex flex-col bg-[#e9f6f4] text-[#034B44]">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-[#a7c4f2]/40 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-[#034B44]" />
        </button>
        <h2 className="text-lg font-semibold">Review & Pay</h2>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* User Details Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#034B44]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#034B44]/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#034B44]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Your Details</h3>
              <p className="text-xs text-gray-500">
                Required for booking confirmation
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#034B44] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#034B44] focus:outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send booking confirmation to this email
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#034B44]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#034B44]/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#034B44]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Payment Summary</h3>
              <p className="text-xs text-gray-500">Review before confirming</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Consultation Fee</span>
              <span className="font-semibold">
                ₹{bookingData.amount || bookingData.price || 1600}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Platform Fee</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex items-center justify-between py-3 bg-[#034B44]/5 rounded-lg px-3">
              <span className="font-bold text-[#034B44]">Total Amount</span>
              <span className="font-bold text-2xl text-[#034B44]">
                ₹{bookingData.amount || bookingData.price || 1600}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-[#a7c4f2]/40">
          <h3 className="font-semibold mb-3 text-[#034B44]">
            Appointment Summary
          </h3>
          <div className="space-y-2">
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
                {new Date(bookingData.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                • {bookingData.time}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{bookingData.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Confirm Payment Button */}
      <div className="p-4 border-t border-[#a7c4f2]/30 bg-white sticky bottom-0">
        {error && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        )}
        <button
          onClick={handleConfirmPayment}
          disabled={!fullName.trim()}
          className="w-full py-4 bg-[#034B44] text-white font-bold rounded-full hover:bg-[#046e63] transition-all shadow-lg flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-5 h-5" />
          Confirm & Pay ₹{bookingData.amount || bookingData.price || 1600}
        </button>
        <p className="text-xs text-center text-gray-500 mt-3">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
}
