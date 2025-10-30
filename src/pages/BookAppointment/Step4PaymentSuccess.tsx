import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function Step4PaymentSuccess() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    const user = JSON.parse(localStorage.getItem("mibo_user") || "{}");
    if (Object.keys(user).length > 0) {
      localStorage.setItem("latestBooking", JSON.stringify(user));
    }
    navigate("/patientDashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6f4] text-[#034B44] px-6">
      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-center text-[#034B44]/80 mb-8">
        Your booking has been confirmed. Your profile has been created.
      </p>

      <button
        onClick={handleGoToDashboard}
        className="bg-[#1c0d54] text-white px-8 py-3 rounded-full hover:bg-[#2a1470] font-semibold transition-all shadow-md"
      >
        Go to My Profile
      </button>
    </div>
  );
}
