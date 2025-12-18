import React, { useState } from "react";
import ShapeTitle from "./ShapeTitle";
import FallbackImage from "../../../components/FallbackImage";

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      img: "https://mibocare.in/wp-content/uploads/2023/09/Irine-Andrews.png",
      name: "Irine Andrews",
      position: "Chief Executive Officer",
    },
    {
      img: "https://mibocare.in/wp-content/uploads/2023/09/Dr.-Prajwal-Devurkar.png",
      name: "Dr. Prajwal Devurkar",
      position: "Medical Director, Head of Operations",
    },
    {
      img: "https://mibocare.in/wp-content/uploads/2023/09/Rixon.png",
      name: "Dr. Rixon Jose",
      position: "Managing Director",
    },
    {
      img: "https://mibocare.in/wp-content/uploads/2023/09/Jomin-John.png",
      name: "Jomin John",
      position: "General Manager",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-[#cce3de]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <ShapeTitle title="Meet Our Leaders" />
        <p className="text-[#2b2b2b] text-lg md:text-xl mb-12 md:mb-16 font-[Quicksand] max-w-4xl mx-auto leading-relaxed">
          Our leadership team brings together clinical expertise, compassion,
          and innovation to shape the future of mental healthcare.
        </p>

        {/* Slider Container */}
        <div className="relative group">
          {/* Navigation Buttons - Visible on hover (desktop) and always on mobile */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-white text-[#0a3d62] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 opacity-70 group-hover:opacity-100 -translate-x-4 md:-translate-x-6"
            aria-label="Previous member"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-white text-[#0a3d62] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 opacity-70 group-hover:opacity-100 translate-x-4 md:translate-x-6"
            aria-label="Next member"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Responsive Grid with Smooth Carousel Effect on Larger Screens */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4 md:px-6"
                >
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div className="relative mb-6">
                      <FallbackImage
                        src={member.img}
                        alt={member.name}
                        className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-4 border-white"
                        fallbackColor="#cce3de"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#34b9a5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#0a3d62] font-[Quicksand] group-hover:text-[#1c0d54] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-base md:text-lg text-[#2b2b2b]/80 font-[Quicksand] mt-2 group-hover:text-[#34b9a5] transition-colors duration-300 max-w-xs">
                      {member.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-10">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-[#34b9a5] w-8"
                    : "bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label={`Go to member ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Background Blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 bg-[#34b9a5]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 md:w-64 md:h-64 bg-[#1c0d54]/10 rounded-full blur-3xl" />
    </section>
  );
};

export default TeamSection;