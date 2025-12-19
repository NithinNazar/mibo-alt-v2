/**
 * INTEGRATION EXAMPLE
 *
 * This file shows you EXACTLY how to add Razorpay, Gallabox, and Google Meet
 * to your existing Step3ConfirmBooking.tsx component.
 *
 * Copy the relevant parts to your actual component.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";

// ✅ STEP 1: Import the hooks (ADD THESE IMPORTS)
import { useRazorpayPayment } from "../../hooks/useRazorpayPayment";
import { useWhatsAppNotifications } from "../../hooks/useWhatsAppNotifications";
import videoService from "../../services/videoService";

interface Step3ConfirmBookingProps {
  bookingData: any;
  onBack: () => void;
}

type PaymentStep = "review" | "processing" | "success";

export default function Step3ConfirmBooking({
  bookingData,
  onBack,
}: Step3ConfirmBookingProps) {
  const navigate = useNavigate();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("review");
  const [appointmentId] = useState<number>(
    Math.floor(100000 + Math.random() * 900000)
  );

  // ✅ STEP 2: Use the payment hook (ADD THIS)
  const {
    sendPaymentLink,
    paymentStatus,
    loading: paymentLoading,
    error: paymentError,
    isPaymentComplete,
  } = useRazorpayPayment();

  // ✅ STEP 3: Use WhatsApp notifications hook (ADD THIS)
  const { wasNotificationSent } = useWhatsAppNotifications(appointmentId);

  // ✅ STEP 4: Watch for payment status changes (ADD THIS)
  useEffect(() => {
    if (isPaymentComplete) {
      // Payment successful!
      setPaymentStep("success");

      // Save booking info
      const bookingInfo = {
        ...bookingData,
        appointmentId: appointmentId,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        transactionId: paymentStatus?.paymentId || `TXN${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("latestBooking", JSON.stringify(bookingInfo));

      // Navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/profileDashboard", {
          state: { bookingSuccess: true, appointmentId },
        });
      }, 3000);
    }
  }, [isPaymentComplete, paymentStatus, appointmentId, bookingData, navigate]);

  /**
   * ✅ STEP 5: Replace the mock payment handler with real integration
   *
   * BEFORE (Mock):
   * const handleConfirmPayment = () => {
   *   setPaymentStep("processing");
   *   setTimeout(() => setPaymentStep("success"), 2000);
   * };
   *
   * AFTER (Real Integration):
   */
  const handleConfirmPayment = async () => {
    try {
      setPaymentStep("processing");

      // Get patient details from bookingData
      const patientPhone = bookingData.phone || bookingData.userPhone;
      const patientName = bookingData.userName || bookingData.name;

      // Validate phone number format
      if (!patientPhone || !patientPhone.startsWith("+91")) {
        alert("Please provide a valid phone number with +91 country code");
        setPaymentStep("review");
        return;
      }

      // Send payment link (this also sends WhatsApp automatically!)
      await sendPaymentLink(appointmentId, patientPhone, patientName);

      // Show success message
      alert(
        "✅ Payment link sent to your WhatsApp!\n\n" +
          "📱 Check your WhatsApp messages\n" +
          "💰 Click the link to complete payment\n\n" +
          "Payment methods: UPI, Cards, Net Banking"
      );

      // Payment status will update automatically via polling
      // When paid, the useEffect above will handle success
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(
        "Failed to send payment link. Please try again.\n\n" +
          "Error: " +
          (error.message || "Unknown error")
      );
      setPaymentStep("review");
    }
  };

  /**
   * ✅ STEP 6: Add video call button (for online appointments)
   *
   * Add this function to handle joining video calls
   */
  const handleJoinVideoCall = async () => {
    try {
      // Get the Google Meet link
      const videoLink = await videoService.getVideoLink(appointmentId);

      // Open in new tab
      videoService.openVideoLink(videoLink.meet_link);

      alert("✅ Opening video call in new tab!");
    } catch (error) {
      console.error("Video call error:", error);
      alert("Unable to join video call. Please try again or contact support.");
    }
  };

  // ✅ STEP 7: Show payment status in processing view
  if (paymentStep === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6f4] text-[#034B44] p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 animate-spin text-[#034B44] mx-auto" />
          </div>

          {/* Show current status */}
          {paymentStatus?.status === "created" && (
            <>
              <h2 className="text-2xl font-bold mb-2">Payment Link Sent! 📱</h2>
              <p className="text-gray-600 mb-4">
                Check your WhatsApp for the payment link
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  ⏳ Waiting for payment...
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Payment status updates automatically
                </p>
              </div>
            </>
          )}

          {!paymentStatus && (
            <>
              <h2 className="text-2xl font-bold mb-2">Sending Payment Link</h2>
              <p className="text-gray-600 mb-4">
                Please wait while we send the payment link to your WhatsApp...
              </p>
            </>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure Payment Gateway</span>
          </div>

          {/* Show error if any */}
          {paymentError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{paymentError}</p>
            </div>
          )}
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
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been confirmed
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Appointment ID</span>
              <span className="font-mono font-semibold text-[#034B44]">
                #{appointmentId}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Amount Paid</span>
              <span className="font-semibold text-green-700">
                ₹{bookingData.price || 1600}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
                CONFIRMED
              </span>
            </div>
          </div>

          {/* ✅ STEP 8: Show video call button for online appointments */}
          {bookingData.mode === "ONLINE" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Online Consultation
                  </p>
                  <p className="text-xs text-blue-700">
                    Video call link sent to your WhatsApp
                  </p>
                </div>
              </div>
              <button
                onClick={handleJoinVideoCall}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                🎥 Join Video Call
              </button>
            </div>
          )}

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

          {/* ✅ STEP 9: Show WhatsApp notification status */}
          {wasNotificationSent("PAYMENT_LINK") && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-green-800">
                ✅ WhatsApp confirmation sent
              </p>
            </div>
          )}

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
        {/* Welcome Message */}
        {bookingData.userName && (
          <div className="bg-white border border-[#a7c4f2]/40 rounded-xl p-4 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-[#034B44]">
              🎉 Welcome, {bookingData.userName}!
            </h3>
            <p className="text-sm text-[#034B44]/70 mt-1">
              Review your booking details and confirm payment
            </p>
          </div>
        )}

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
                ₹{bookingData.price || 1600}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Platform Fee</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex items-center justify-between py-3 bg-[#034B44]/5 rounded-lg px-3">
              <span className="font-bold text-[#034B44]">Total Amount</span>
              <span className="font-bold text-2xl text-[#034B44]">
                ₹{bookingData.price || 1600}
              </span>
            </div>
          </div>

          {/* ✅ STEP 10: Add WhatsApp notification info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">📱</span>
              <div className="text-left">
                <p className="text-xs font-semibold text-green-800 mb-1">
                  Payment via WhatsApp
                </p>
                <p className="text-xs text-green-700">
                  We'll send a secure payment link to your WhatsApp. Pay using
                  UPI, Cards, or Net Banking.
                </p>
              </div>
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
        <button
          onClick={handleConfirmPayment}
          disabled={paymentLoading}
          className="w-full py-4 bg-[#034B44] text-white font-bold rounded-full hover:bg-[#046e63] transition-all shadow-lg flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Payment Link...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Send Payment Link via WhatsApp
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-500 mt-3">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
}

/**
 * ✅ SUMMARY OF CHANGES:
 *
 * 1. Added 3 imports at the top
 * 2. Added 2 hooks (useRazorpayPayment, useWhatsAppNotifications)
 * 3. Added useEffect to watch payment status
 * 4. Replaced mock payment handler with real integration
 * 5. Added video call button handler
 * 6. Updated UI to show payment status
 * 7. Added WhatsApp notification info
 * 8. Added video call button for online appointments
 * 9. Added loading states
 *
 * That's it! Copy these changes to your actual Step3ConfirmBooking.tsx file.
 */
