import type { Doctor } from "../data/doctors";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const handleBook = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  // Auto-scroll animation for expertise pills
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!container || isPaused) return;

      scrollPosition += scrollSpeed;

      // Reset scroll when reaching the end
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Handle keyboard arrow keys for manual scrolling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      container.scrollBy({ left: -100, behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      container.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  return (
    <div
      className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl 
             p-6 w-full h-auto flex flex-col
             hover:shadow-xl transition-shadow duration-200"
    >
      {/* Image container */}
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-[#e9f6f4]">
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
      {/* Years of experience - improved visibility */}
      <p className="text-sm text-[#034B44]/80 mb-3">{doctor.experience}</p>

      {/* Expertise tags - Auto-scrolling carousel */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-x-auto mb-4 h-[32px] cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <style>
          {`
            /* Hide scrollbar for Chrome, Safari and Opera */
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div className="flex gap-2 w-max">
          {/* Duplicate expertise items for seamless loop */}
          {[...doctor.expertise, ...doctor.expertise].map((ex, i) => (
            <span
              key={i}
              className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>

      {/* Consultation Fee */}
      <div className="mb-3">
        <div className="text-center">
          <p className="text-base font-semibold text-[#034B44]">
            {doctor.price}
          </p>
        </div>
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
