// src/pages/Centers/components/HeroSection.tsx
import React from "react";
import { motion } from "framer-motion";
import FallbackImage from "../../../components/FallbackImage";

interface HeroProps {
  title: string;
  description: string;
  image?: string;
}

const HeroSection: React.FC<HeroProps> = ({ title, description, image }) => (
  <section className="relative w-full pt-32 pb-16 px-6 text-center bg-mibo-teal-light overflow-hidden">
    {/* Optional Hero Image */}
    {image && (
      <div className="max-w-5xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-md">
        <FallbackImage
          src={image}
          alt="Mibo Centre"
          className="w-full h-[300px] object-cover"
        />
      </div>
    )}

    <motion.h1
      className="text-3xl md:text-4xl font-bold text-mibo-green mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {title}
    </motion.h1>
    <motion.p
      className="text-gray-700 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {description}
    </motion.p>
  </section>
);

export default HeroSection;

// import React from "react";
// import { motion } from "framer-motion";

// interface HeroProps {
//   title: string;
//   description: string;
// }

// const HeroSection: React.FC<HeroProps> = ({ title, description }) => (
//   <section className="bg-mibo-teal-light py-16 px-6 text-center">
//     <motion.h1
//       className="text-3xl md:text-4xl font-bold text-mibo-green mb-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       {title}
//     </motion.h1>
//     <motion.p
//       className="text-gray-700 max-w-2xl mx-auto"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 0.3 }}
//     >
//       {description}
//     </motion.p>
//   </section>
// );

// export default HeroSection;
