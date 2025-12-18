import React from "react";

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  image?: string;
}

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
  <div className="flex-shrink-0 w-64 bg-white shadow-md rounded-2xl overflow-hidden mx-2 border border-gray-200">
    {doctor.image ? (
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-contain object-[center_25%] p-2"
          // object-[center_25%] positions image 25% from top (focuses on face)
        />
        {/* Optional: Add a subtle overlay for better contrast */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/40 to-transparent" />
        </div>
      </div>
    ) : (
      <div className="h-40 bg-mibo-teal-light flex items-center justify-center text-mibo-green font-semibold">
        No Image
      </div>
    )}
    <div className="p-4 text-center">
      <h3 className="font-bold text-lg text-mibo-green">{doctor.name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialty}</p>
      <p className="text-xs text-gray-500 mt-1">{doctor.experience}</p>
    </div>
  </div>
);

export default DoctorCard;