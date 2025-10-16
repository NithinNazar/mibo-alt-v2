import React from "react";
import { motion } from "framer-motion";
import FallbackImage from "../../../components/FallbackImage";
import banner from "../assets/banner.jpg";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      <FallbackImage
        src={banner}
        alt="Mibo Hero Banner"
        className="absolute inset-0 w-full h-full object-cover"
        fallbackColor="#cce3de"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 text-center text-white px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl md:text-5xl font-bold mb-4 font-[Quicksand]"
        >
          About Mibo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg md:text-xl max-w-2xl mx-auto font-[Quicksand]"
        >
          Redefining premium mental healthcare with compassion, science, and
          innovation.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;

// import React from "react";
// import { motion } from "framer-motion";
// import FallbackImage from "../../../components/FallbackImage";
// import banner from "../assets/banner.jpg"; // ✅ now local to About/assets

// const HeroSection: React.FC = () => {
//   return (
//     <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
//       <FallbackImage
//         src={banner}
//         alt="Mibo Hero Banner"
//         className="absolute inset-0 w-full h-full object-cover"
//         fallbackColor="#cce3de"
//       />
//       <div className="absolute inset-0 bg-black bg-opacity-40"></div>

//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         viewport={{ once: true }}
//         className="relative z-10 text-center text-white px-6"
//       >
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[Quicksand]">
//           About Mibo
//         </h1>
//         <p className="text-lg md:text-xl max-w-2xl mx-auto font-[Quicksand]">
//           Redefining premium mental healthcare with compassion, science, and
//           innovation.
//         </p>
//       </motion.div>
//     </section>
//   );
// };

// export default HeroSection;
