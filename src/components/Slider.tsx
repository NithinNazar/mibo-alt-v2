import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "../assets/mibo-individual-counselling.jpg";
import slide2 from "../assets/mibo-group-therapy.jpg";
import slide3 from "../assets/online_counselling.jpg";
import slide4 from "../assets/famlily_therapy.jpg";
import slide5 from "../assets/mibo-wellness-program.jpg";

const PremiumSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // refs for touch events + pause timeout
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 1,
      image: slide1,
      title: "Individual Therapy",
      subtitle: "Personalized mental health support",
    },
    {
      id: 2,
      image: slide2,
      title: "Group Sessions",
      subtitle: "Community-based healing",
    },
    {
      id: 3,
      image: slide3,
      title: "Online Counseling",
      subtitle: "Remote support from anywhere",
    },
    {
      id: 4,
      image: slide4,
      title: "Family Therapy",
      subtitle: "Strengthening family bonds",
    },
    {
      id: 5,
      image: slide5,
      title: "Wellness Programs",
      subtitle: "Holistic mental health approach",
    },
  ];

  // --- Auto slide + progress animation ---
  useEffect(() => {
    if (!isPaused) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
      }, 6000);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 1.7));
      }, 100);

      return () => {
        clearInterval(slideInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isPaused, slides.length]);

  // --- Navigation ---
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // --- Pause helper ---
  const pauseTemporarily = (duration = 5000) => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), duration);
  };

  // --- Touch Handlers (swipe) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // sensitivity

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0)
        nextSlide(); // swipe left → next
      else prevSlide(); // swipe right → previous
      pauseTemporarily(); // pause auto-scroll after swipe
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-[2000ms] ease-[cubic-bezier(0.7,0,0.3,1)]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${index === currentSlide ? "scale-110" : "scale-100"}`}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white p-4 max-w-md">
              <h3
                className={`text-3xl font-bold mb-2 drop-shadow-lg transition-all duration-1000 ${
                  index === currentSlide
                    ? "animate-fade-in-up opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {slide.title}
              </h3>
              <p
                className={`text-lg opacity-90 drop-shadow transition-all duration-1000 delay-200 ${
                  index === currentSlide
                    ? "animate-fade-in-up opacity-90 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide();
          pauseTemporarily();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => {
          nextSlide();
          pauseTemporarily();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setProgress(0);
              pauseTemporarily();
            }}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "w-8 h-3 bg-[#34b9a5] rounded-full"
                : "w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
        <div
          className="h-full bg-gradient-to-r from-[#34b9a5] to-[#2a9d8f] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default PremiumSlider;

// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import slide1 from "../assets/individual_therapy.jpg";
// import slide2 from "../assets/group_session.jpg";
// import slide3 from "../assets/online_counselling.jpg";
// import slide4 from "../assets/famlily_therapy.jpg";

// const PremiumSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const slides = [
//     {
//       id: 1,
//       image: slide1,
//       title: "Individual Therapy",
//       subtitle: "Personalized mental health support",
//     },
//     {
//       id: 2,
//       image: slide2,
//       title: "Group Sessions",
//       subtitle: "Community-based healing",
//     },
//     {
//       id: 3,
//       image: slide3,
//       title: "Online Counseling",
//       subtitle: "Remote support from anywhere",
//     },
//     {
//       id: 4,
//       image: slide4,
//       title: "Family Therapy",
//       subtitle: "Strengthening family bonds",
//     },
//     {
//       id: 5,
//       image:
//         "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
//       title: "Wellness Programs",
//       subtitle: "Holistic mental health approach",
//     },
//   ];

//   // Auto slide + progress animation
//   useEffect(() => {
//     if (!isPaused) {
//       const slideInterval = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % slides.length);
//         setProgress(0); // reset progress on each slide change
//       }, 6000); // ⏳ 6 seconds per slide

//       const progressInterval = setInterval(() => {
//         setProgress((prev) => (prev >= 100 ? 100 : prev + 1.7)); // slower progress
//       }, 100);

//       return () => {
//         clearInterval(slideInterval);
//         clearInterval(progressInterval);
//       };
//     }
//   }, [isPaused, slides.length]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//     setProgress(0);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     setProgress(0);
//   };

//   return (
//     <div
//       className="relative w-full h-screen overflow-hidden bg-black"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//     >
//       {/* Slides Container */}
//       <div
//         className="flex h-full transition-transform duration-[2000ms] ease-[cubic-bezier(0.7,0,0.3,1)]"
//         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//       >
//         {slides.map((slide, index) => (
//           <div key={slide.id} className="relative w-full h-full flex-shrink-0">
//             {/* Background Image */}
//             <div className="absolute inset-0 overflow-hidden">
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-[cubic-bezier(0.4,0,0.2,1)]
//                   ${index === currentSlide ? "scale-110" : "scale-100"}`}
//               />
//             </div>

//             {/* Gradient Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

//             {/* Content Overlay */}
//             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white p-4 max-w-md">
//               <h3
//                 className={`text-3xl font-bold mb-2 drop-shadow-lg transition-all duration-1000 ${
//                   index === currentSlide
//                     ? "animate-fade-in-up opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-8"
//                 }`}
//               >
//                 {slide.title}
//               </h3>
//               <p
//                 className={`text-lg opacity-90 drop-shadow transition-all duration-1000 delay-200 ${
//                   index === currentSlide
//                     ? "animate-fade-in-up opacity-90 translate-y-0"
//                     : "opacity-0 translate-y-8"
//                 }`}
//               >
//                 {slide.subtitle}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300 shadow-lg"
//       >
//         <ChevronLeft size={24} />
//       </button>

//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300 shadow-lg"
//       >
//         <ChevronRight size={24} />
//       </button>

//       {/* Slide Indicators */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => {
//               setCurrentSlide(index);
//               setProgress(0);
//             }}
//             className={`transition-all duration-300 ${
//               index === currentSlide
//                 ? "w-8 h-3 bg-[#34b9a5] rounded-full"
//                 : "w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full"
//             }`}
//           />
//         ))}
//       </div>

//       {/* Progress Bar */}
//       <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
//         <div
//           className="h-full bg-gradient-to-r from-[#34b9a5] to-[#2a9d8f] transition-all duration-100 ease-linear"
//           style={{ width: `${progress}%` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default PremiumSlider;
