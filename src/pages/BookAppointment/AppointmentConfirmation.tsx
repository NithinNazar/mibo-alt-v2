import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const AppointmentConfirmation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const formData = state?.formData;

  if (!formData) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No appointment data found.
        </h2>
        <button
          onClick={() => navigate("/book-appointment")}
          className="bg-[#34b9a5] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2a857f] transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4f6] to-[#d9f1ee] flex flex-col items-center pt-28 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 border border-gray-100"
      >
        {/* ✅ Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-4"
        >
          <CheckCircle
            className="text-[#34b9a5] drop-shadow-lg"
            size={70}
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center mb-2 text-[#1c0d54]"
        >
          Appointment Confirmed
        </motion.h2>

        <p className="text-center text-gray-600 mb-6">
          Thank you for booking your appointment with Mibo Health. We’ve
          received your details successfully.
        </p>

        <div className="space-y-3 text-gray-700 bg-[#f9fafb] rounded-xl p-4 border border-gray-200">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold capitalize">
                {key.replace(/([A-Z])/g, " $1")}:{" "}
              </span>
              <span>
                {typeof value === "string" || typeof value === "number"
                  ? value
                  : Array.isArray(value)
                  ? value.join(", ")
                  : JSON.stringify(value) || "N/A"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="bg-[#34b9a5] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2a857f] transition-all duration-300 shadow-lg"
          >
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentConfirmation;
