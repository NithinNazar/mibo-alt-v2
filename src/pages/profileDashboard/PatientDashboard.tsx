import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clinicians, expertiseList } from "./feedData";
import ProfileHeader from "./ProfileHeader";

export default function ProfileDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [selectedClinician, setSelectedClinician] = useState<any>(null);
  const [duration, setDuration] = useState("30 mins");

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [booking, setBooking] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const cities = [
    { id: 1, name: "Bangalore", centre: "MIBO Bangalore" },
    { id: 2, name: "Kochi", centre: "MIBO Kochi" },
    { id: 3, name: "Mumbai", centre: "MIBO Mumbai" },
  ];

  // Auto-update centre when city is selected
  useEffect(() => {
    const match = cities.find((c) => String(c.id) === selectedCity);
    setSelectedCentre(match ? match.centre : "");
  }, [selectedCity]);

  // Generate dynamic available dates
  useEffect(() => {
    const today = new Date();
    const newDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      if (Math.random() > 0.4) newDates.push(next.toDateString());
    }
    setAvailableDates(newDates);
  }, [selectedClinician]);

  // Filter clinicians by city and expertise
  const filteredClinicians = clinicians.filter(
    (c) =>
      (!selectedCity || c.city_id === Number(selectedCity)) &&
      (!selectedExpertise || c.expertise.includes(selectedExpertise))
  );

  const handleBookAppointment = () => {
    if (!selectedClinician || !selectedDate) return;
    const newBooking = {
      doctor: selectedClinician.name,
      date: selectedDate,
      duration,
      rate: selectedClinician.hourly_rate,
      centre: selectedCentre,
      city:
        cities.find((c) => String(c.id) === selectedCity)?.name || "Unknown",
    };
    setBooking(newBooking);
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelConfirmed = () => {
    setBooking({ ...booking, status: "Cancelled" });
    setShowCancelConfirm(false);
  };

  // ✅ Correct JSX structure starts here
  return (
    <>
      {/* Header Section */}
      <ProfileHeader />

      {/* Main Page Section */}
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-10 px-4">
        <div className="w-full max-w-3xl">
          {/* Appointment Confirmation / Active Booking */}
          <AnimatePresence>
            {showSuccess && booking && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 bg-white border border-gray-200 shadow-lg rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Appointment Confirmed
                  </h2>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-green-500 text-3xl"
                  >
                    ✓
                  </motion.div>
                </div>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800">
                    {booking.doctor}
                  </span>{" "}
                  — {booking.date} ({booking.duration}) <br />
                  {booking.centre}, {booking.city} <br />₹{booking.rate} per
                  hour
                </p>

                <div className="mt-5 flex gap-3">
                  {booking.status !== "Cancelled" ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                    >
                      Cancel Appointment
                    </button>
                  ) : (
                    <p className="text-red-600 font-semibold">
                      Appointment Cancelled
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cancellation Confirmation Modal */}
          <AnimatePresence>
            {showCancelConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white rounded-2xl p-6 shadow-lg w-80 text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Cancel Appointment?
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm">
                    Are you sure you want to cancel this appointment with{" "}
                    <span className="font-medium">
                      {booking?.doctor || "the clinician"}
                    </span>
                    ?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleCancelConfirmed}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                      No
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Book Your Appointment
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2a1470]"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2a1470]"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2a1470]"
              />

              {/* City */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-[#2a1470]"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              {/* Centre */}
              <input
                type="text"
                placeholder="Centre"
                value={selectedCentre}
                readOnly
                className="p-3 border rounded-xl bg-gray-100 text-gray-700"
              />

              {/* Expertise */}
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-[#2a1470]"
              >
                <option value="">Select Expertise</option>
                {expertiseList.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>

              {/* Clinician */}
              <select
                value={selectedClinician?.id || ""}
                onChange={(e) =>
                  setSelectedClinician(
                    filteredClinicians.find((c) => c.id === e.target.value) ||
                      null
                  )
                }
                className="p-3 border rounded-xl focus:ring-2 focus:ring-[#2a1470]"
              >
                <option value="">Select Doctor</option>
                {filteredClinicians.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — ₹{doc.hourly_rate}/hr
                  </option>
                ))}
              </select>

              {/* Duration */}
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-[#2a1470]"
              >
                <option>30 mins</option>
                <option>1 hour</option>
                <option>1.5 hours</option>
              </select>
            </div>

            {/* Available Dates */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-gray-700">
                Available Dates
              </h3>
              <div className="flex overflow-x-auto gap-3 pb-2">
                {availableDates.length > 0 ? (
                  availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        selectedDate === date
                          ? "bg-[#2a1470] text-white border-[#2a1470]"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {date.slice(0, 10)}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No slots available</p>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleBookAppointment}
                disabled={!selectedClinician || !selectedDate}
                className="px-8 py-3 bg-[#2fbfa8] text-white font-semibold rounded-2xl hover:bg-[#28a895] disabled:opacity-50"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
