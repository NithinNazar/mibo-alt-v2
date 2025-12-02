// NOTE TO FREELANCER: This is the full Patient Dashboard page shown after login.
// It includes handling for when there is no current booking stored in localStorage,
// as well as a detailed dashboard view when a booking is present.
// Feel free to split into smaller components if needed.
// refer the back end repository for the API integration.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileHeader from "./ProfileHeader";
import {
  CalendarDays,
  MapPin,
  Stethoscope,
  Clock,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  History,
  FileText,
  Activity,
  RefreshCcw,
  Phone,
} from "lucide-react";

interface Booking {
  phone?: string;
  doctor?: string;
  centre?: string;
  date?: string;
  time?: string;
  duration?: string;
  amount?: number;
  mode?: "IN_PERSON" | "ONLINE";
}

export default function PatientDashboard() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("latestBooking");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setBooking(parsed);
    } catch {
      setBooking(null);
    }
  }, []);

  if (!booking) {
    return (
      <>
        <ProfileHeader />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#034B44]/10">
              <CalendarDays className="text-[#034B44]" size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No current appointments
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You do not have any upcoming sessions scheduled. Book a session
              with a clinician to get started.
            </p>
            <button
              onClick={() => navigate("/book-appointment")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#034B44] text-white rounded-full text-sm font-medium hover:bg-[#046e63] transition"
            >
              Book an appointment
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </>
    );
  }

  const referenceNumber = Math.floor(Math.random() * 90000) + 10000;

  return (
    <>
      <ProfileHeader />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-10 px-4">
        <div className="w-full max-w-5xl space-y-8">
          {/* Welcome + summary */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Phone size={16} className="text-[#034B44]" />
                <span>{booking.phone || "Phone number not available"}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-medium inline-flex items-center gap-2">
                <CheckCircle2 size={16} />
                Appointment confirmed
              </div>
              <div className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium inline-flex items-center gap-2">
                <Activity size={16} />
                Profile active
              </div>
            </div>
          </motion.div>

          {/* Main appointment card + side stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment details card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-2 bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#2a1470] to-[#034B44] text-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Upcoming appointment
                    </h2>
                    <p className="text-xs opacity-80">
                      Booking reference: #{referenceNumber}
                    </p>
                  </div>
                  <div className="text-right text-xs opacity-80">
                    <p>Mibo Mental Health</p>
                    <p>Your care, personalised</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 text-gray-700">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Stethoscope className="text-[#2a1470]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Clinician
                      </p>
                      <p className="font-medium">
                        {booking.doctor || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MapPin className="text-[#034B44]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Centre
                      </p>
                      <p className="font-medium">{booking.centre || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <CalendarDays className="text-[#2a1470]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="font-medium">
                        {booking.date || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <Clock className="text-[#034B44]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Time and duration
                      </p>
                      <p className="font-medium">
                        {booking.time ? `${booking.time} · ` : ""}
                        {booking.duration || "30 mins"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
                  <p className="text-gray-500">
                    Please reach the centre 10–15 minutes before your scheduled
                    time, or join the online session from a quiet space.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/book-appointment")}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Book another
                    </button>
                    <button
                      onClick={() => navigate("/book-appointment")}
                      className="inline-flex items-center justify-center rounded-lg bg-[#2a1470] px-3 py-2 text-xs font-medium text-white hover:bg-[#251061]"
                    >
                      Manage appointment
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px  -6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="text-green-600" size={16} />
                  <span>
                    Status:{" "}
                    <span className="font-medium text-green-600">
                      Confirmed
                    </span>
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Need to reschedule or cancel? Please contact our centre at
                  least 24 hours before your slot.
                </p>
              </div>
            </motion.div>

            {/* Side stats / quick cards */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Session overview
                  </p>
                  <History size={16} className="text-gray-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Current status</span>
                    <span className="rounded-full bg-green-50 text-green-700 text-xs px-2 py-1">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Mode</span>
                    <span className="text-gray-800 font-medium">
                      {booking.mode === "ONLINE"
                        ? "Online consultation"
                        : "In-person visit"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-800 font-medium">
                      {booking.duration || "30 mins"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Payment
                  </p>
                  <CreditCard size={16} className="text-gray-400" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-500">Amount due for this session:</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {booking.amount
                      ? `₹${booking.amount.toLocaleString()}`
                      : "To be confirmed"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Once integrated, your payment history and invoices will
                    appear here.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Follow-ups
                  </p>
                  <RefreshCcw size={16} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  No follow-up session has been scheduled yet.
                </p>
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-dashed border-[#034B44] px-3 py-2 text-xs font-medium text-[#034B44] hover:bg-[#034B44]/5"
                >
                  Schedule a follow-up
                </button>
              </div>
            </motion.div>
          </div>

          {/* History and documents section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="text-[#2a1470]" size={20} />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Appointment history
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  History from this device
                </span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-[#2a1470]" />
                    <span className="flex-1 w-px bg-gray-200" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Profile created and first appointment booked
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {booking.date || "Date not available"} ·{" "}
                      {booking.centre || "Centre not available"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      When you complete more sessions, they will appear here for
                      easy reference.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#034B44]" size={20} />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Session notes and documents
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                After your sessions, summaries and documents shared by your
                clinician will appear here.
              </p>
              <div className="rounded-lg border border-dashed border-gray-200 p-3 text-xs text-gray-500 flex items-center gap-2">
                <Activity size={16} className="text-gray-400" />
                <span>
                  No documents available yet. Attend your first session to see
                  your records here.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import ProfileHeader from "./ProfileHeader";
// import { CalendarDays, MapPin, Stethoscope, Clock } from "lucide-react";

// export default function PatientDashboard() {
//   const [booking, setBooking] = useState<any>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const stored = localStorage.getItem("latestBooking");
//     if (stored) setBooking(JSON.parse(stored));
//   }, []);

//   if (!booking) {
//     return (
//       <>
//         <ProfileHeader />
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
//           <p className="text-lg font-semibold mb-4">No current appointments.</p>
//           <button
//             onClick={() => navigate("/book-appointment")}
//             className="px-6 py-3 bg-[#034B44] text-white rounded-full hover:bg-[#046e63]"
//           >
//             Book Appointment
//           </button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <ProfileHeader />

//       <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-10 px-4">
//         <div className="w-full max-w-3xl">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="text-center mb-8"
//           >
//             <h1 className="text-3xl font-semibold text-gray-800">
//               New Profile Created 🎉
//             </h1>
//             <p className="text-gray-500 mt-2">
//               Welcome, <span className="font-medium">{booking.phone}</span>
//             </p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden"
//           >
//             <div className="bg-[#2a1470] text-white p-6">
//               <h2 className="text-2xl font-semibold">Appointment Confirmed</h2>
//               <p className="mt-1 text-sm opacity-80">
//                 Booking reference: #{Math.floor(Math.random() * 90000) + 10000}
//               </p>
//             </div>

//             <div className="p-6 space-y-4 text-gray-700">
//               <div className="flex items-center gap-3">
//                 <Stethoscope className="text-[#2a1470]" />
//                 <p>
//                   <span className="font-medium">Doctor:</span>{" "}
//                   {booking.doctor || "Not specified"}
//                 </p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <MapPin className="text-[#2a1470]" />
//                 <p>
//                   <span className="font-medium">Location:</span>{" "}
//                   {booking.centre || "—"}
//                 </p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <CalendarDays className="text-[#2a1470]" />
//                 <p>
//                   <span className="font-medium">Date:</span> {booking.date}
//                 </p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Clock className="text-[#2a1470]" />
//                 <p>
//                   <span className="font-medium">Duration:</span>{" "}
//                   {booking.duration}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
//               <span className="text-gray-600 text-sm">
//                 Status:{" "}
//                 <span className="text-green-600 font-medium">Confirmed</span>
//               </span>

//               {/* <button
//                 onClick={() => navigate("/book-appointment")}
//                 className="px-5 py-2 bg-[#2fbfa8] text-white rounded-lg hover:bg-[#28a895]"
//               >
//                 Book Another
//               </button> */}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </>
//   );
// }
