// src/pages/BookAppointment/Step1SessionDetails.tsx
import type { Doctor } from "../Experts/data/doctors";
import { useState } from "react";
import {
  MapPin,
  Video,
  Phone,
  Clock,
  CalendarDays,
  Clock4,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  doctor: Doctor;
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    bookingData.date ? new Date(bookingData.date) : null
  );
  const [selectedTime, setSelectedTime] = useState<string>(bookingData.time);

  const modes = ["In-person", "Video call", "Phone call"];
  const durations = [
    { label: "30 mins", price: 1500 },
    { label: "60 mins", price: 2500 },
  ];
  const times = ["10:00 AM", "1:00 PM", "5:00 PM"];

  const handleContinue = () => {
    setBookingData({
      ...bookingData,
      mode: selectedMode,
      duration: selectedDuration,
      date: selectedDate ? selectedDate.toDateString() : "",
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

      {/* Body */}
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
            {modes.map((mode) => {
              const Icon =
                mode === "In-person"
                  ? MapPin
                  : mode === "Video call"
                  ? Video
                  : Phone;
              const isSelected = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                    isSelected
                      ? "bg-[#d2fafa] border-[#034B44] text-[#034B44] shadow-lg"
                      : "bg-white border-gray-300 text-gray-500 hover:shadow-lg"
                  }`}
                >
                  <Icon className="w-7 h-7 mb-1" />
                  <span className="text-sm font-medium">{mode}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-[#034B44]" />
            <h3 className="font-semibold">Location</h3>
          </div>
          <p className="text-sm text-gray-700">
            Mibo Mental Health Centre — {doctor.name.split(" ")[1] ?? "City"}
          </p>
        </div>

        {/* NEW: Date Picker (Moved Up) */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-5 h-5 text-[#034B44]" />
            <h3 className="font-semibold">Select Date</h3>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            placeholderText="click to select a date"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1425b8]"
            calendarClassName="rounded-xl shadow-lg border border-gray-200"
            dateFormat="EEE, MMM d, yyyy"
          />
        </div>

        {/* Time */}
        <div className="bg-white rounded-xl p-5 shadow-md overflow-visible">
          <div className="flex items-center gap-2 mb-3">
            <Clock4 className="w-5 h-5 text-[#034B44]" />
            <h3 className="font-semibold">Select Time</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all shadow-md hover:shadow-lg ${
                  selectedTime === t
                    ? "bg-[#d2fafa] border-[#d2fafa] text-[#034B44] shadow-lg scale-[1.02]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#034B44]" />
            <h3 className="font-semibold">Session Duration</h3>
          </div>
          <div className="flex gap-3">
            {durations.map((dur) => (
              <button
                key={dur.label}
                onClick={() => setSelectedDuration(dur.label)}
                className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 shadow-md hover:shadow-lg ${
                  selectedDuration === dur.label
                    ? "bg-[#d2fafa] border-[#034B44] text-[#034B44] shadow-lg scale-[1.02]"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                <span className="text-sm font-medium">{dur.label}</span>
                <span className="text-xs">₹{dur.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-4 sticky bottom-0 bg-white border-t">
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="w-full py-3 bg-[#0e0a73] text-white font-semibold rounded-full disabled:opacity-10"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// // src/pages/BookAppointment/Step1SessionDetails.tsx
// import type { Doctor } from "../Experts/data/doctors";
// import { useState } from "react";
// import {
//   MapPin,
//   Video,
//   Phone,
//   Clock,
//   CalendarDays,
//   Clock4,
// } from "lucide-react";

// interface Props {
//   doctor: Doctor;
//   bookingData: any;
//   setBookingData: (data: any) => void;
//   onContinue: () => void;
//   onBack: () => void;
// }

// export default function Step1SessionDetails({
//   doctor,
//   bookingData,
//   setBookingData,
//   onContinue,
//   onBack,
// }: Props) {
//   const [selectedMode, setSelectedMode] = useState<string>(bookingData.mode);
//   const [selectedDuration, setSelectedDuration] = useState<string>(
//     bookingData.duration
//   );
//   const [selectedDate, setSelectedDate] = useState<string>(bookingData.date);
//   const [selectedTime, setSelectedTime] = useState<string>(bookingData.time);

//   const modes = ["In-person", "Video call", "Phone call"];
//   const durations = [
//     { label: "30 mins", price: 1500 },
//     { label: "60 mins", price: 2500 },
//   ];
//   const dates = ["Today", "Fri 31 Oct", "Sat 01 Nov", "Sun 02 Nov"];
//   const times = ["10:00 AM", "1:00 PM", "5:00 PM"];

//   const handleContinue = () => {
//     setBookingData({
//       ...bookingData,
//       mode: selectedMode,
//       duration: selectedDuration,
//       date: selectedDate,
//       time: selectedTime,
//       price: durations.find((d) => d.label === selectedDuration)?.price ?? 1500,
//       doctorId: doctor.id,
//     });
//     onContinue();
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-20">
//         <button onClick={onBack} className="text-[#034B44] text-lg">
//           ←
//         </button>
//         <h2 className="text-lg font-semibold">Book your session</h2>
//         <div className="w-6" />
//       </div>

//       {/* Body */}
//       <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
//         {/* Doctor quick info */}
//         <div className="bg-white rounded-xl p-4 shadow-sm">
//           <div className="flex items-center gap-4">
//             <img
//               src={doctor.image}
//               alt={doctor.name}
//               className="w-16 h-16 rounded-lg object-cover"
//             />
//             <div>
//               <div className="font-semibold">{doctor.name}</div>
//               <div className="text-sm text-gray-600">{doctor.designation}</div>
//             </div>
//           </div>
//         </div>

//         {/* Mode of Session */}
//         <div>
//           <h3 className="font-semibold mb-2">Mode of Session</h3>
//           <div className="flex gap-3">
//             {modes.map((mode) => {
//               const Icon =
//                 mode === "In-person"
//                   ? MapPin
//                   : mode === "Video call"
//                   ? Video
//                   : Phone;
//               const isSelected = selectedMode === mode;
//               return (
//                 <button
//                   key={mode}
//                   onClick={() => setSelectedMode(mode)}
//                   className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
//                     isSelected
//                       ? "bg-[#d2fafa] border-[#034B44] text-[#034B44] shadow-lg"
//                       : "bg-white border-gray-300 text-gray-500 hover:shadow-lg"
//                   }`}
//                 >
//                   <Icon className="w-7 h-7 mb-1" />
//                   <span className="text-sm font-medium">{mode}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Location */}
//         <div className="bg-white rounded-xl p-4 shadow-md">
//           <div className="flex items-center gap-2 mb-2">
//             <MapPin className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Location</h3>
//           </div>
//           <p className="text-sm text-gray-700">
//             Mibo Mental Health Centre — {doctor.name.split(" ")[1] ?? "City"}
//           </p>
//         </div>

//         {/* Duration */}
//         <div className="bg-white rounded-xl p-4 shadow-md">
//           <div className="flex items-center gap-2 mb-2">
//             <Clock className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Session Duration</h3>
//           </div>
//           <div className="flex gap-3">
//             {durations.map((dur) => (
//               <button
//                 key={dur.label}
//                 onClick={() => setSelectedDuration(dur.label)}
//                 className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 shadow-md hover:shadow-lg ${
//                   selectedDuration === dur.label
//                     ? "bg-[#d2fafa] border-[#034B44] text-[#034B44] shadow-lg scale-[1.02]"
//                     : "bg-white border-gray-300 text-gray-500"
//                 }`}
//               >
//                 <span className="text-sm font-medium">{dur.label}</span>
//                 <span className="text-xs">₹{dur.price}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Date */}
//         <div className="bg-white rounded-xl p-5 shadow-md overflow-visible">
//           <div className="flex items-center gap-2 mb-3">
//             <CalendarDays className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Select Date</h3>
//           </div>
//           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
//             {dates.map((d) => (
//               <button
//                 key={d}
//                 onClick={() => setSelectedDate(d)}
//                 className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all shadow-md hover:shadow-lg ${
//                   selectedDate === d
//                     ? "bg-[#d2fafa] border-[#d2fafa] text-[#034B44] shadow-lg scale-[1.02]"
//                     : "bg-white border-gray-300 text-gray-500"
//                 }`}
//               >
//                 {d}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Time */}
//         <div className="bg-white rounded-xl p-5 shadow-md overflow-visible">
//           <div className="flex items-center gap-2 mb-3">
//             <Clock4 className="w-5 h-5 text-[#034B44]" />
//             <h3 className="font-semibold">Select Time</h3>
//           </div>
//           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
//             {times.map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setSelectedTime(t)}
//                 className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all shadow-md hover:shadow-lg ${
//                   selectedTime === t
//                     ? "bg-[#d2fafa] border-[#d2fafa] text-[#034B44] shadow-lg scale-[1.02]"
//                     : "bg-white border-gray-300 text-gray-500"
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Continue Button */}
//       <div className="p-4 sticky bottom-0 bg-white border-t">
//         <button
//           onClick={handleContinue}
//           disabled={!selectedDate || !selectedTime}
//           className="w-full py-3 bg-[#0e0a73] text-white font-semibold rounded-full disabled:opacity-10"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// }
