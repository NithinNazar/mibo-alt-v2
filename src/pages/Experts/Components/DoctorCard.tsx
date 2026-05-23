import type { Doctor } from "../data/doctors";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBook = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl 
             p-4 w-[240px] sm:w-[260px] h-[420px] mx-auto flex-shrink-0 flex flex-col
             hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
    >
      <div className="relative w-full h-40 mb-3 bg-gray-200 rounded-xl overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}
        <img
          src={doctor.image}
          alt={doctor.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`rounded-xl w-full h-full object-cover object-top transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <h3 className="text-lg font-semibold text-[#034B44] line-clamp-1">
        {doctor.name}
      </h3>
      <p className="text-sm text-[#034B44]/80 line-clamp-1">
        {doctor.qualification}
      </p>
      <p className="text-sm text-[#034B44]/80 line-clamp-1">
        {doctor.designation}
      </p>
      <p className="text-xs text-[#a7c4f2] mt-1">{doctor.experience}</p>

      <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar py-1 flex-grow min-h-[60px]">
        {doctor.expertise.map((ex, i) => (
          <span
            key={i}
            className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-2 py-1 rounded-full whitespace-nowrap h-fit"
          >
            {ex}
          </span>
        ))}
      </div>

      <button
        onClick={handleBook}
        className="mt-auto w-full bg-[#a7c4f2] hover:bg-[#81b2f0] text-[#034B44] font-semibold py-1.5 rounded-full transition text-sm"
      >
        Book
      </button>
    </motion.div>
  );
}
