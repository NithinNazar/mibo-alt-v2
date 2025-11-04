import { useState, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Lottie from "lottie-react";

// Lottie animation imports
import integratedCareAnimation from "../assets/animations/Integrated_Care.json";
import groundedInScienceAnimation from "../assets/animations/Atomloadinganimation.json";
import personalizedSupportAnimation from "../assets/animations/PersonalizedserviceiconLottieJSONanimation.json";
import roundTheClockAnimation from "../assets/animations/round_the_clock.json";

const MiboCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      title: "Integrated Care",
      description:
        "From self-care & therapy, to peer support & medication management, we can help with it all.",
      animation: integratedCareAnimation,
    },
    {
      title: "Grounded in Science",
      description:
        "Our care options are based on scientifically proven treatments & clinically validated approaches.",
      animation: groundedInScienceAnimation,
    },
    {
      title: "Personalised Support",
      description:
        "Our treatment plans are tailored to your unique needs, so you can get the right care at the right time.",
      animation: personalizedSupportAnimation,
    },
    {
      title: "Round the clock support",
      description:
        "Our treatment options can be accessed from wherever you might be, all 7 days a week.",
      animation: roundTheClockAnimation,
    },
  ];

  // --- Swipe gesture handling ---
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
      if (deltaX > 0) nextSlide(); // Swipe left → next
      else prevSlide(); // Swipe right → previous

      // Pause auto-scroll temporarily after manual swipe
      setIsPaused(true);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
      pauseTimeout.current = setTimeout(() => setIsPaused(false), 5000); // resume after 5s
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // --- Auto-scroll effect ---
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isPaused]);

  // --- Variants ---
  const containerVariant: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.35 } },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 3.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "-50px" }}
      variants={containerVariant}
      className="w-full max-w-md mx-auto bg-[#040a47] p-8 text-white text-center"
    >
      {/* Header */}
      <motion.h2 variants={itemVariant} className="text-2xl font-semibold mb-4">
        Why Mibo?
      </motion.h2>

      <motion.p
        variants={itemVariant}
        className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold"
      >
        Our platform is built by psychiatrists, therapists and mental health
        experts with immense global experience.
      </motion.p>

      {/* Slider */}
      <div
        className="relative h-64 mb-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center"
            >
              <motion.div
                variants={itemVariant}
                className="mb-4 w-28 h-28 mx-auto bg-white bg-opacity-10 rounded-xl flex items-center justify-center border-2 border-[#2FA19A]"
              >
                <Lottie
                  animationData={slide.animation}
                  loop={true}
                  className="w-24 h-24"
                />
              </motion.div>

              <motion.div variants={itemVariant} className="text-center">
                <h3 className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] font-semibold">
                  {slide.title}
                </h3>
                <p
                  className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] font-semibold"
                  style={{ lineHeight: "20px" }}
                >
                  {slide.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <motion.div
        variants={itemVariant}
        className="flex justify-center space-x-2"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveSlide(index);
              setIsPaused(true);
              if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
              pauseTimeout.current = setTimeout(() => setIsPaused(false), 5000);
            }}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === activeSlide
                ? "bg-[#18356C]"
                : "bg-white bg-opacity-30 hover:bg-opacity-50"
            }`}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MiboCarousel;

// import { useState, useEffect } from "react";
// import { motion, type Variants } from "framer-motion";
// import Lottie from "lottie-react";

// // Lottie animation imports for each slide
// import integratedCareAnimation from "../assets/animations/Integrated_Care.json";
// import groundedInScienceAnimation from "../assets/animations/Atomloadinganimation.json";
// import personalizedSupportAnimation from "../assets/animations/PersonalizedserviceiconLottieJSONanimation.json";
// import roundTheClockAnimation from "../assets/animations/round_the_clock.json";

// const MiboCarousel = () => {
//   const [activeSlide, setActiveSlide] = useState(0);

//   const slides = [
//     {
//       title: "Integrated Care",
//       description:
//         "From self-care & therapy, to peer support & medication management, we can help with it all.",
//       animation: integratedCareAnimation,
//     },
//     {
//       title: "Grounded in Science",
//       description:
//         "Our care options are based on scientifically proven treatments & clinically validated approaches.",
//       animation: groundedInScienceAnimation,
//     },
//     {
//       title: "Personalised Support",
//       description:
//         "Our treatment plans are tailored to your unique needs, so you can get the right care at the right time.",
//       animation: personalizedSupportAnimation,
//     },
//     {
//       title: "Round the clock support",
//       description:
//         "Our treatment options can be accessed from wherever you might be, all 7 days a week.",
//       animation: roundTheClockAnimation,
//     },
//   ];

//   // Auto-scroll effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveSlide((prev) => (prev + 1) % slides.length);
//     }, 4000); // Change slide every 4 seconds

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   // Variants
//   const containerVariant: Variants = {
//     hidden: {},
//     visible: { transition: { staggerChildren: 0.35 } },
//   };

//   const itemVariant: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 3.2, ease: [0.22, 1, 0.36, 1] },
//     },
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.1, margin: "-50px" }}
//       variants={containerVariant}
//       className="w-full max-w-md mx-auto bg-[#040a47] p-8 text-white text-center"
//     >
//       {/* Fixed Header */}
//       <motion.h2 variants={itemVariant} className="text-2xl font-semibold mb-4">
//         Why Mibo?
//       </motion.h2>

//       <motion.p
//         variants={itemVariant}
//         className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold"
//       >
//         Our platform is built by psychiatrists, therapists and mental health
//         experts with immense global experience.
//       </motion.p>

//       {/* Slider */}
//       <div className="relative h-64 mb-4 overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-in-out h-full"
//           style={{ transform: `translateX(-${activeSlide * 100}%)` }}
//         >
//           {slides.map((slide, index) => (
//             <div
//               key={index}
//               className="w-full flex-shrink-0 flex flex-col items-center justify-center"
//             >
//               {/* Animated Lottie Icon */}
//               <motion.div
//                 variants={itemVariant}
//                 className="mb-4 w-28 h-28 mx-auto bg-white bg-opacity-10 rounded-xl flex items-center justify-center border-2 border-[#2FA19A] relative"
//               >
//                 <Lottie
//                   animationData={slide.animation}
//                   loop={true}
//                   className="w-24 h-24"
//                 />
//               </motion.div>

//               {/* Slide Text */}
//               <motion.div variants={itemVariant} className="text-center">
//                 <h3 className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] font-semibold">
//                   {slide.title}
//                 </h3>
//                 <p
//                   className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] font-semibold"
//                   style={{ lineHeight: "20px" }}
//                 >
//                   {slide.description}
//                 </p>
//               </motion.div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Indicators */}
//       <motion.div
//         variants={itemVariant}
//         className="flex justify-center space-x-2"
//       >
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveSlide(index)}
//             className={`w-3 h-3 rounded-full transition-colors duration-200 ${
//               index === activeSlide
//                 ? "bg-[#18356C]"
//                 : "bg-white bg-opacity-30 hover:bg-opacity-50"
//             }`}
//           />
//         ))}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default MiboCarousel;
