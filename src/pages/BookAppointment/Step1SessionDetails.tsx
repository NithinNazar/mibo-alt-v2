// src/pages/BookAppointment/Step1SessionDetails.tsx
import type { Doctor } from "../Experts/data/doctors"; // <-- type-only import
import { useState } from "react";

interface Props {
  doctor: Doctor; // used value passed from index.tsx
  bookingData: any;
  setBookingData: (data: any) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function Step1SessionDetails({
  doctor,
  bookingData,
  setBookingData,
  onContinue,
  onBack,
}: Props) {
  const [selectedMode, setSelectedMode] = useState<string>(bookingData.mode);
  const [selectedDuration, setSelectedDuration] = useState<string>(
    bookingData.duration
  );
  const [selectedDate, setSelectedDate] = useState<string>(bookingData.date);
  const [selectedTime, setSelectedTime] = useState<string>(bookingData.time);

  const modes = ["In-person", "Video call", "Phone call"];
  const durations = [
    { label: "30 mins", price: 1500 },
    { label: "60 mins", price: 2500 },
  ];
  // small demo lists — replace with dynamic later
  const dates = ["Today", "Fri 31 Oct", "Sat 01 Nov", "Sun 02 Nov"];
  const times = ["10:00 AM", "1:00 PM", "5:00 PM"];

  const handleContinue = () => {
    setBookingData({
      ...bookingData,
      mode: selectedMode,
      duration: selectedDuration,
      date: selectedDate,
      time: selectedTime,
      price: durations.find((d) => d.label === selectedDuration)?.price ?? 1500,
      doctorId: doctor.id,
    });
    onContinue();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="text-[#034B44] text-lg">
          ←
        </button>
        <h2 className="text-lg font-semibold">Book your session</h2>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Doctor quick info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold">{doctor.name}</div>
              <div className="text-sm text-gray-600">{doctor.designation}</div>
            </div>
          </div>
        </div>

        {/* Mode of Session */}
        <div>
          <h3 className="font-semibold mb-2">Mode of Session</h3>
          <div className="flex gap-3">
            {modes.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  selectedMode === mode
                    ? "bg-[#d2fafa] border-[#034B44] text-[#034B44]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Location (hardcoded for now) */}
        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          <p className="text-sm text-gray-700">
            Mibo Mental Health Centre — {doctor.name.split(" ")[1] ?? "City"}
          </p>
        </div>

        {/* Duration */}
        <div>
          <h3 className="font-semibold mb-2">Session Duration</h3>
          <div className="flex gap-3">
            {durations.map((dur) => (
              <button
                key={dur.label}
                onClick={() => setSelectedDuration(dur.label)}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  selectedDuration === dur.label
                    ? "bg-[#b3ffff] border-[#034B44]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {dur.label} — ₹{dur.price}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <h3 className="font-semibold mb-2">Select Date</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {dates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-4 py-2 rounded-lg border whitespace-nowrap ${
                  selectedDate === d
                    ? "bg-[#b3ffff] border-[#034B44]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div>
          <h3 className="font-semibold mb-2">Select Time</h3>
          <div className="flex gap-3">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`flex-1 py-2 rounded-lg border ${
                  selectedTime === t
                    ? "bg-[#b3ffff] border-[#034B44]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button fixed bottom */}
      <div className="p-4 sticky bottom-0 bg-white border-t">
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="w-full py-3 bg-[#0e0a73] text-white font-semibold rounded-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
