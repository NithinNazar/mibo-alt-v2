import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Lottie from "lottie-react";
import sampleVideo from "../assets/therapy and psychatry.mp4";
import offeringsAnimation from "../assets/animations/Recharge.json";

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
      className="max-w-md mx-auto bg-white pb-14 relative"
    >
      {/* Decorative Animated Icon at Top Middle */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-80 h-50 z-0 opacity-20">
        <Lottie
          animationData={offeringsAnimation}
          loop={true}
          className="w-full h-full"
        />
      </div>

      {/* First Section - Our mental healthcare offerings */}
      <motion.div
        variants={itemVariant}
        className="text-center px-8 pt-16 pb-6 relative z-10"
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
        className="flex flex-col items-center text-center px-4 pb-4 pt-16 relative z-10"
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
      <motion.div
        variants={itemVariant}
        className="px-8 pb-16 pt-16 relative z-10"
      >
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

// import { useNavigate } from "react-router-dom";
// import { motion, type Variants } from "framer-motion";
// import sampleVideo from "../assets/therapy and psychatry.mp4";

// const OfferingsAndTherapy = () => {
//   const navigate = useNavigate();
//   // Animation variants
//   const containerVariant: Variants = {
//     hidden: {},
//     visible: { transition: { staggerChildren: 0.35 } },
//   };

//   const itemVariant: Variants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 3, ease: [0.22, 1, 0.36, 1] },
//     },
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.15 }}
//       variants={containerVariant}
//       className="max-w-md mx-auto bg-white pb-14"
//     >
//       {/* First Section - Our mental healthcare offerings */}
//       <motion.div
//         variants={itemVariant}
//         className="text-center px-8 pt-16 pb-6"
//       >
//         <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
//           Our mental healthcare offerings
//         </h1>
//         <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
//           We are a mental health ecosystem that brings together multiple
//           treatment options to create an experience that makes getting help easy
//           and seamless. From assessment to treatment, we're with you every step
//           of the way.
//         </p>
//       </motion.div>

//       {/* Video Section */}
//       <motion.div
//         variants={itemVariant}
//         className="flex flex-col items-center text-center px-4 pb-4 pt-16 relative"
//       >
//         <div className="w-80 h-80 rounded-full overflow-hidden flex items-center justify-center bg-black">
//           <video
//             src={sampleVideo}
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full h-full object-cover rounded-full"
//           />
//         </div>
//       </motion.div>

//       {/* Second Section - Therapy & Psychiatry */}
//       <motion.div variants={itemVariant} className="px-8 pb-16 pt-16">
//         <h2 className="text-[1.563rem] text-center font-[700] text-[rgb(76,76,76)] mb-4">
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
//         <motion.div variants={itemVariant} className="mt-8">
//           <button
//             onClick={() => navigate("/experts")}
//             className="w-full bg-[#18356C] hover:bg-[#2FA19A] text-white font-semibold py-4 px-6 rounded-full text-base transition-colors duration-200 uppercase tracking-wide"
//           >
//             EXPLORE EXPERTS
//           </button>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default OfferingsAndTherapy;
