import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import { CalendarDays, MapPin, Stethoscope, Clock } from "lucide-react";

export default function PatientDashboard() {
  const [booking, setBooking] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("latestBooking");
    if (stored) setBooking(JSON.parse(stored));
  }, []);

  if (!booking) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
          <p className="text-lg font-semibold mb-4">No current appointments.</p>
          <button
            onClick={() => navigate("/book-appointment")}
            className="px-6 py-3 bg-[#034B44] text-white rounded-full hover:bg-[#046e63]"
          >
            Book Appointment
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <ProfileHeader />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-10 px-4">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-semibold text-gray-800">
              New Profile Created 🎉
            </h1>
            <p className="text-gray-500 mt-2">
              Welcome, <span className="font-medium">{booking.phone}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-[#2a1470] text-white p-6">
              <h2 className="text-2xl font-semibold">Appointment Confirmed</h2>
              <p className="mt-1 text-sm opacity-80">
                Booking reference: #{Math.floor(Math.random() * 90000) + 10000}
              </p>
            </div>

            <div className="p-6 space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <Stethoscope className="text-[#2a1470]" />
                <p>
                  <span className="font-medium">Doctor:</span>{" "}
                  {booking.doctor || "Not specified"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-[#2a1470]" />
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {booking.centre || "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="text-[#2a1470]" />
                <p>
                  <span className="font-medium">Date:</span> {booking.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-[#2a1470]" />
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {booking.duration}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
              <span className="text-gray-600 text-sm">
                Status:{" "}
                <span className="text-green-600 font-medium">Confirmed</span>
              </span>

              {/* <button
                onClick={() => navigate("/book-appointment")}
                className="px-5 py-2 bg-[#2fbfa8] text-white rounded-lg hover:bg-[#28a895]"
              >
                Book Another
              </button> */}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
