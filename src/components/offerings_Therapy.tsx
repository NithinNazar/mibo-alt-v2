import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import sampleVideo from "../assets/therapy and psychatry.mp4";

const OfferingsAndTherapy = () => {
  const navigate = useNavigate();
  // Animation variants
  const containerVariant: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.35 } },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 3, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariant}
      className="max-w-md mx-auto bg-white pb-14"
    >
      {/* First Section - Our mental healthcare offerings */}
      <motion.div
        variants={itemVariant}
        className="text-center px-8 pt-16 pb-6"
      >
        <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
          Our mental healthcare offerings
        </h1>
        <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
          We are a mental health ecosystem that brings together multiple
          treatment options to create an experience that makes getting help easy
          and seamless. From assessment to treatment, we're with you every step
          of the way.
        </p>
      </motion.div>

      {/* Video Section */}
      <motion.div
        variants={itemVariant}
        className="flex flex-col items-center text-center px-4 pb-4 pt-16 relative"
      >
        <div className="w-80 h-80 rounded-full overflow-hidden flex items-center justify-center bg-black">
          <video
            src={sampleVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </motion.div>

      {/* Second Section - Therapy & Psychiatry */}
      <motion.div variants={itemVariant} className="px-8 pb-16 pt-16">
        <h2 className="text-[1.563rem] text-center font-[700] text-[rgb(76,76,76)] mb-4">
          Therapy & Psychiatry
        </h2>

        <div className="space-y-6">
          <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
            Our professionals are highly qualified and trained to deliver
            quality and compassionate clinical treatment across ages through
            therapy, psychiatry, mental health support for your child and
            couples therapy.
          </p>

          <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
            They follow proprietary protocols & undergo peer supervision to
            ensure you get exceptional care, now in person too. Meet your mental
            health expert today.
          </p>
        </div>

        {/* CTA Button */}
        <motion.div variants={itemVariant} className="mt-8">
          <button
            onClick={() => navigate("/experts")}
            className="w-full bg-[#18356C] hover:bg-[#2FA19A] text-white font-semibold py-4 px-6 rounded-full text-base transition-colors duration-200 uppercase tracking-wide"
          >
            EXPLORE EXPERTS
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OfferingsAndTherapy;

// import sampleVideo from "../assets/therapy and psychatry.mp4";

// const OfferingsAndTherapy = () => {
//   return (
//     <div className="max-w-md mx-auto bg-white pb-14">
//       {/* First Section - Our mental healthcare offerings */}
//       <div className="text-center px-8 pt-16 pb-6">
//         <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
//           Our mental healthcare offerings
//         </h1>
//         <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
//           We are a mental health ecosystem that brings together multiple
//           treatment options to create an experience that makes getting help easy
//           and seamless. From assessment to treatment, we're with you every step
//           of the way.
//         </p>
//       </div>

//       <div className="flex flex-col items-center text-center px-4 pb-4 pt-16 mt-0 relative">
//         {/* Wave PNG positioned near SVG */}
//         {/* <div className="absolute top-0 left-0 w-full z-0">
//                     <img src={wavePng} alt="Wave decoration" className="w-full h-auto object-cover opacity-70" />
//                 </div>
//                 <div>
//                     <img src={sample} alt="Mental Health" className="w-full h-full object-cover" />
//                 </div> */}
//         {/* <div className="w-[400px] h-[500px] overflow-hidden rounded-lg">
//                     <video
//                         src={sampleVideo} // import your .mp4 file
//                         autoPlay
//                         loop
//                         muted
//                         playsInline
//                         className="w-full h-full object-cover"
//                     />
//                 </div> */}
//         {/* <div className="w-80 h-80 rounded-full overflow-hidden flex items-center justify-center bg-black">
//                     <video
//                         src={sampleVideo} // import your .mp4 file
//                         autoPlay
//                         loop
//                         muted
//                         playsInline
//                         className="w-full h-full object-cover rounded-full"
//                     />
//                 </div> */}
//         <div className="w-80 h-80 rounded-full overflow-hidden flex items-center justify-center bg-black animate-fadeIn">
//           <video
//             src={sampleVideo} // import your .mp4 file
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full h-full object-cover rounded-full"
//           />
//         </div>

//         {/* SVG Blob Image */}
//         {/* <svg viewBox="0 0 400 400" className="w-180 h-180  overflow-hidden">
//                     <defs>
//                         <clipPath id="blobClip">
//                             <path
//                                 d="M57.8,-68.6C74,-55.2,85.9,-36.2,89.5,-15.8C93.1,4.6,88.5,26.5,77.4,43.8C66.3,61,48.8,73.5,29.2,81.1C9.6,88.6,-12.2,91,-31.2,84.6C-50.1,78.1,-66.2,62.8,-76.3,44.5C-86.4,26.1,-90.5,4.7,-86.4,-14.7C-82.3,-34.1,-70,-51.5,-54.3,-65C-38.5,-78.5,-19.3,-88.2,0.7,-89.1C20.7,-90,41.5,-82.1,57.8,-68.6Z"
//                                 transform="translate(200 200) scale(0.9)"
//                             />
//                         </clipPath>
//                     </defs>

//                     <image
//                         href={sample}
//                         width="100%"
//                         height="100%"
//                         preserveAspectRatio="xMidYMid meet"
//                         clipPath="url(#blobClip)"
//                     />
//                 </svg> */}
//       </div>

//       {/* Second Section - Therapy & Psychiatry */}
//       <div className="px-8 pb-16 pt-16">
//         <h2 className="text-[1.563rem]  text-center font-[700] text-[rgb(76,76,76)] mb-4">
//           Therapy & Psychiatry
//         </h2>

//         <div className="space-y-6">
//           <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
//             Our professionals are highly qualified and trained to deliver
//             quality and compassionate clinical treatment across ages through
//             therapy, psychiatry, mental health support for your child and
//             couples therapy.
//           </p>

//           <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
//             They follow proprietary protocols & undergo peer supervision to
//             ensure you get exceptional care, now in person too. Meet your mental
//             health expert today.
//           </p>
//         </div>

//         {/* CTA Button */}
//         <div className="mt-8">
//           <button className="w-full bg-[#18356C] hover:bg-[#2FA19A] text-white font-semibold py-4 px-6 rounded-full text-base transition-colors duration-200 uppercase tracking-wide">
//             EXPLORE EXPERTS
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OfferingsAndTherapy;
