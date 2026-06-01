import type { Doctor } from "../data/doctors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBook = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  return (
    <div
      className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl 
             p-6 w-full h-auto flex flex-col
             hover:shadow-xl transition-shadow duration-200"
    >
      {/* Image container */}
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-[#e9f6f4]">
        {/* Always render img tag, show placeholder until loaded */}
        <img
          src={doctor.image}
          alt={doctor.name}
          className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
            imageLoaded && !imageError ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="eager"
        />
        {/* Show initials placeholder while loading or on error */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#d0f7e9]/80">
            <span className="text-4xl md:text-5xl font-bold text-[#034B44]">
              {doctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Text content */}
      <h3 className="text-xl font-semibold text-[#034B44] line-clamp-2 mb-1">
        {doctor.name}
      </h3>
      <p className="text-sm text-[#034B44]/80 line-clamp-1 mb-1">
        {doctor.qualification}
      </p>
      <p className="text-sm text-[#034B44]/80 line-clamp-2 mb-1">
        {doctor.designation}
      </p>
      <p className="text-xs text-[#a7c4f2] mb-3">{doctor.experience}</p>

      {/* Expertise tags */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
        {doctor.expertise.slice(0, 4).map((ex, i) => (
          <span
            key={i}
            className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-3 py-1 rounded-full whitespace-nowrap"
          >
            {ex}
          </span>
        ))}
        {doctor.expertise.length > 4 && (
          <span className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-3 py-1 rounded-full">
            +{doctor.expertise.length - 4} more
          </span>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleBook}
        className="mt-auto w-full bg-[#a7c4f2] hover:bg-[#81b2f0] text-[#034B44] font-semibold py-2.5 rounded-full transition-colors text-base"
      >
        Book Appointment
      </button>
    </div>
  );
}
