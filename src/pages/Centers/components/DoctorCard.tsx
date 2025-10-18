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
      <img
        src={doctor.image}
        alt={doctor.name}
        className="h-40 w-full object-cover"
      />
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
