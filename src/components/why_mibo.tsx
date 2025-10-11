import { useState } from "react";
import { motion, type Variants } from "framer-motion";

const MiboCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "Integrated Care",
      description:
        "From self-care & therapy, to peer support & medication management, we can help with it all.",
    },
    {
      title: "Grounded in Science",
      description:
        "Our care options are based on scientifically proven treatments & clinically validated approaches.",
    },
    {
      title: "Personalised Support",
      description:
        "Our treatment plans are tailored to your unique needs, so you can get the right care at the right time.",
    },
    {
      title: "Round the clock support",
      description:
        "Our treatment options can be accessed from wherever you might be, all 7 days a week.",
    },
  ];

  // Variants
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
      className="w-full max-w-md mx-auto bg-[#2FA19A] p-8 text-white text-center"
    >
      {/* Fixed Header */}
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
      <div className="relative h-64 mb-4 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center"
            >
              {/* Icon Container */}
              <motion.div
                variants={itemVariant}
                className="mb-4 w-20 h-20 mx-auto bg-white bg-opacity-10 rounded-xl flex items-center justify-center border-2 border-[#18356C] relative"
              >
                {index === 0 && (
                  <div className="relative">
                    <div className="w-8 h-8 bg-white rounded-sm"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#18356C] rounded-sm"></div>
                    <div className="absolute top-3 left-3 w-3 h-3 bg-[#18356C] rounded-full"></div>
                    <div className="absolute top-1 left-1 w-2 h-2 bg-[#18356C] rounded-full"></div>
                  </div>
                )}
                {index === 1 && (
                  <div className="relative">
                    <div className="w-12 h-8 border-2 border-[#2D5987] rounded-full relative">
                      <div className="absolute top-1 left-2 w-2 h-2 bg-[#18356C] rounded-full"></div>
                      <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-[#18356C] rounded-full"></div>
                      <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#18356C] rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-4 border-l-2 border-r-2 border-b-2 border-[#2D5987] rounded-b-md"></div>
                  </div>
                )}
                {index === 2 && (
                  <div className="relative">
                    <svg
                      className="w-8 h-8 text-[#18356C] fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-3 border-2 border-[#2D5987] rounded-full bg-transparent"></div>
                    </div>
                  </div>
                )}
                {index === 3 && (
                  <div className="relative">
                    <div className="w-10 h-8 border-2 border-[#2D5987] rounded-sm relative">
                      <div className="absolute top-1 right-1">
                        <div className="w-4 h-3 bg-[#18356C] rounded-sm relative">
                          <div className="absolute top-0.5 left-1 w-0.5 h-0.5 bg-[#7798BC] rounded-full"></div>
                          <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#7798BC] rounded-full"></div>
                          <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#7798BC] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Slide Text */}
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
            onClick={() => setActiveSlide(index)}
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

// import { useState } from "react";

// const MiboCarousel = () => {
//   const [activeSlide, setActiveSlide] = useState(0);

//   const slides = [
//     {
//       title: "Integrated Care",
//       description:
//         "From self-care & therapy, to peer support & medication management, we can help with it all.",
//     },
//     {
//       title: "Grounded in Science",
//       description:
//         "Our care options are based on scientifically proven treatments & clinically validated  approaches.",
//     },
//     {
//       title: "Personalised Support",
//       description:
//         "Our treatment plans are tailored to your unique needs, so you can get the right care at the right time.",
//     },
//     {
//       title: "Round the clock support",
//       description:
//         "Our treatment options can be accessed from wherever you might be, all 7 days a week.",
//     },
//   ];

//   return (
//     <div className="w-full max-w-md mx-auto bg-[#2FA19A] p-8 text-white text-center">
//       {/* Fixed Header */}
//       <h2 className="text-2xl font-semibold mb-4">Why Mibo?</h2>
//       <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
//         Our platform is built by psychiatrists, therapists and mental health
//         experts with immense global experience.
//       </p>

//       {/* Slider Content */}
//       <div className="relative h-64 mb-4">
//         <div className="relative overflow-hidden h-full">
//           <div
//             className="flex transition-transform duration-500 ease-in-out h-full"
//             style={{ transform: `translateX(-${activeSlide * 100}%)` }}
//           >
//             {slides.map((slide, index) => (
//               <div
//                 key={index}
//                 className="w-full flex-shrink-0 flex flex-col items-center justify-center"
//               >
//                 {/* Icon Container */}
//                 <div className="mb-4">
//                   <div className="w-20 h-20 mx-auto bg-white bg-opacity-10 rounded-xl flex items-center justify-center border-2 border-[#18356C] relative">
//                     {index === 0 && (
//                       <div className="relative">
//                         <div className="w-8 h-8 bg-white rounded-sm"></div>
//                         <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#18356C] rounded-sm"></div>
//                         <div className="absolute top-3 left-3 w-3 h-3 bg-[#18356C] rounded-full"></div>
//                         <div className="absolute top-1 left-1 w-2 h-2 bg-[#18356C] rounded-full"></div>
//                       </div>
//                     )}
//                     {index === 1 && (
//                       <div className="relative">
//                         <div className="w-12 h-8 border-2 border-[#2D5987] rounded-full relative">
//                           <div className="absolute top-1 left-2 w-2 h-2 bg-[#18356C] rounded-full"></div>
//                           <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-[#18356C] rounded-full"></div>
//                           <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#18356C] rounded-full"></div>
//                         </div>
//                         <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-4 border-l-2 border-r-2 border-b-2 border-[#2D5987] rounded-b-md"></div>
//                       </div>
//                     )}
//                     {index === 2 && (
//                       <div className="relative">
//                         <svg
//                           className="w-8 h-8 text-[#18356C] fill-current"
//                           viewBox="0 0 24 24"
//                         >
//                           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                         </svg>
//                         <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
//                           <div className="w-8 h-3 border-2 border-[#2D5987] rounded-full bg-transparent"></div>
//                         </div>
//                       </div>
//                     )}
//                     {index === 3 && (
//                       <div className="relative">
//                         <div className="w-10 h-8 border-2 border-[#2D5987] rounded-sm relative">
//                           <div className="absolute top-1 right-1">
//                             <div className="w-4 h-3 bg-[#18356C] rounded-sm relative">
//                               <div className="absolute top-0.5 left-1 w-0.5 h-0.5 bg-[#7798BC] rounded-full"></div>
//                               <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#7798BC] rounded-full"></div>
//                               <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#7798BC] rounded-full"></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="text-center">
//                   <h3 className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] text-center font-semibold">
//                     {slide.title}
//                   </h3>
//                   <p
//                     className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] text-center font-semibold"
//                     style={{ lineHeight: "20px" }}
//                   >
//                     {slide.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Indicators */}
//       <div className="flex justify-center space-x-2">
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
//       </div>
//     </div>
//   );
// };

// export default MiboCarousel;
