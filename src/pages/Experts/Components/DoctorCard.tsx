import type { Doctor } from "../data/doctors";
import { useNavigate } from "react-router-dom";
// import DoctorMediaCarousel from "./DoctorMediaCarousel";
import ExpertiseMarquee from "./ExpertiseMarquee";
import "./doctorCard.css";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  const images =
    doctor.images && doctor.images.length > 0 ? doctor.images : [doctor.image];

  return (
    <div
      className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl 
             p-6 w-full h-auto flex flex-col
             hover:shadow-xl transition-shadow duration-200"
    >
      {/* Profile media: image/video carousel */}
      {/* <DoctorMediaCarousel
        images={images}
        videoUrl={doctor.videoUrl}
        doctorName={doctor.name}
      />

      {/* Text content */}
      <h3 className="text-xl font-semibold tracking-tight text-[#034B44] line-clamp-2 mb-1">
        {doctor.name}
      </h3>
      <p className="text-sm text-[#034B44]/80 line-clamp-1 mb-1">
        {doctor.qualification}
      </p>
      <p className="text-sm text-[#034B44]/80 line-clamp-2 mb-1">
        {doctor.designation}
      </p>
      <p className="text-xs text-[#a7c4f2] mb-3">{doctor.experience}</p>

      {/* Expertise tags — continuous auto-scroll, pauses on hover */}
      <ExpertiseMarquee expertise={doctor.expertise} />

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