import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Step3ConfirmBookingProps {
  bookingData: any;
  onBack: () => void;
}

export default function Step3ConfirmBooking({
  bookingData,
  onBack,
}: Step3ConfirmBookingProps) {
  const navigate = useNavigate();

  const handlePayment = () => {
    // Prepare complete booking details
    const bookingInfo = {
      ...bookingData,
      doctor: bookingData.doctor || "Dr.Aisha Mehta ",
      centre: bookingData.centre || "Mibo Care",
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for PatientDashboard to read
    localStorage.setItem("latestBooking", JSON.stringify(bookingInfo));

    // Simulate payment success + redirect
    setTimeout(() => {
      navigate("/profileDashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e9f6f4] text-[#034B44]">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-[#a7c4f2]/40 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="text-[#034B44]" />
        </button>
        <h2 className="text-lg font-semibold">Complete your booking</h2>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* ✅ New Profile Created text */}
        <div className="bg-white border border-[#a7c4f2]/40 rounded-xl p-4 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-[#034B44]">
            🎉 New Profile Created
          </h3>
          <p className="text-sm text-[#034B44]/70 mt-1">
            Your account has been successfully created.
          </p>
        </div>

        {/* Account Details */}
        <div>
          <h3 className="font-semibold mb-2 text-[#034B44]">Account Details</h3>
          <div className="bg-white p-4 rounded-xl border border-[#a7c4f2]/40 text-[#034B44]/90">
            {bookingData.phone || "N/A"}
          </div>
        </div>

        {/* Session Details */}
        <div>
          <h3 className="font-semibold mb-2 text-[#034B44]">Session Details</h3>
          <div className="bg-white p-4 rounded-xl border border-[#a7c4f2]/40">
            <p className="font-semibold">{bookingData.doctor}</p>
            <p className="text-sm text-[#034B44]/80">{bookingData.mode}</p>
            <p className="text-sm mt-1">
              {bookingData.date} — {bookingData.time}
            </p>
            <p className="text-sm mt-1">
              {bookingData.duration} | ₹{bookingData.price}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#a7c4f2]/30 bg-white">
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-[#034B44] text-white font-semibold rounded-full hover:bg-[#046e63] transition-all"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}
