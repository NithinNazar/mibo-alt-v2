import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import bengaluruImg from "../assets/In-patient.jpg";
import mumbaiImg from "../assets/In-patient.jpg";
import kochiImg from "../assets/online.jpg";

const LocationCardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const centers = [
    {
      city: "Bengaluru",
      description:
        "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.",
      locations: ["Indiranagar", "Koramangala"],
      image: bengaluruImg,
      path: "/centres/bengaluru",
    },
    {
      city: "Mumbai",
      description:
        "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.",
      locations: ["Bandra", "Andheri"],
      image: mumbaiImg,
      path: "/centres/mumbai",
    },
    {
      city: "Kochi",
      description:
        "Experience compassionate care in our Kochi facilities, designed with your wellbeing in mind.",
      locations: ["Marine Drive", "Ernakulam"],
      image: kochiImg,
      path: "/centres/kochi",
    },
  ];

  // Auto slide
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % centers.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [centers.length, isPaused]);

  const pauseTemporarily = (duration = 5000) => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), duration);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % centers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + centers.length) % centers.length);
  };

  // --- Swipe Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) nextSlide();
      else prevSlide();
      pauseTemporarily();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="mt-6 mb-4 text-[1.56rem] font-[700] text-center text-gray-800 leading-snug">
        Care and support near you
      </h1>
      <p className="text-gray-600 text-sm text-center mb-8">
        Our centres across Bengaluru, Mumbai, and Kochi bring expert care close
        to you.
      </p>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {centers.map((center, index) => (
            <div key={index} className="min-w-full">
              <div className="bg-[#edf6f9] rounded-2xl border border-gray-300 overflow-hidden mx-2">
                <div className="h-48 overflow-hidden">
                  <img
                    src={center.image}
                    alt={`${center.city} center`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {center.city}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    {center.description}
                  </p>
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      LOCATIONS IN {center.city.toUpperCase()}
                    </p>
                    <div className="space-y-2">
                      {center.locations.map((loc, i) => (
                        <div
                          key={i}
                          className="flex items-center text-gray-700"
                        >
                          <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-sm font-medium">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate(center.path);
                      pauseTemporarily();
                    }}
                    className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#223584] transition-colors"
                  >
                    View Centre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider dots */}
      <div className="flex justify-center mt-6 space-x-1">
        {centers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentSlide(idx);
              pauseTemporarily();
            }}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              idx === currentSlide
                ? "w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent"
                : "w-6 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationCardsSlider;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";
// import bengaluruImg from "../assets/In-patient.jpg";
// import mumbaiImg from "../assets/In-patient.jpg";
// import kochiImg from "../assets/online.jpg";

// const LocationCardsSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();

//   const centers = [
//     {
//       city: "Bengaluru",
//       description:
//         "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.",
//       locations: ["Indiranagar", "Koramangala"],
//       image: bengaluruImg,
//       path: "/centres/bengaluru",
//     },
//     {
//       city: "Mumbai",
//       description:
//         "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.",
//       locations: ["Bandra", "Andheri"],
//       image: mumbaiImg,
//       path: "/centres/mumbai",
//     },
//     {
//       city: "Kochi",
//       description:
//         "Experience compassionate care in our Kochi facilities, designed with your wellbeing in mind.",
//       locations: ["Marine Drive", "Ernakulam"],
//       image: kochiImg,
//       path: "/centres/kochi",
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % centers.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [centers.length]);

//   return (
//     <div className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100">
//       <h1 className="mt-6 mb-4 text-[1.56rem] font-[700] text-center text-gray-800 leading-snug">
//         Care and support near you
//       </h1>
//       <p className="text-gray-600 text-sm text-center mb-8">
//         Our centres across Bengaluru, Mumbai, and Kochi bring expert care close
//         to you.
//       </p>

//       <div className="relative overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {centers.map((center, index) => (
//             <div key={index} className="min-w-full">
//               <div className="bg-[#edf6f9] rounded-2xl border border-gray-300 overflow-hidden mx-2">
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={center.image}
//                     alt={`${center.city} center`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-3">
//                     {center.city}
//                   </h2>
//                   <p className="text-gray-600 text-sm mb-6">
//                     {center.description}
//                   </p>
//                   <div className="mb-6">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                       LOCATIONS IN {center.city.toUpperCase()}
//                     </p>
//                     <div className="space-y-2">
//                       {center.locations.map((loc, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center text-gray-700"
//                         >
//                           <MapPin className="w-4 h-4 mr-3 text-gray-400" />
//                           <span className="text-sm font-medium">{loc}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => navigate(center.path)}
//                     className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#223584] transition-colors"
//                   >
//                     View Centre
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Slider dots */}
//       <div className="flex justify-center mt-6 space-x-1">
//         {centers.map((_, idx) => (
//           <button
//             key={idx}
//             onClick={() => setCurrentSlide(idx)}
//             className={`h-0.5 rounded-full transition-all duration-500 ${
//               idx === currentSlide
//                 ? "w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent"
//                 : "w-6 bg-gray-300 hover:bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationCardsSlider;
