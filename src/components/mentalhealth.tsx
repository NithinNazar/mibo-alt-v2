import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const sampleVideo =
  "https://ajadcreatives.com/wp-content/uploads/2026/02/mental-wellness.mp4";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.6, // delay between each child
    },
  },
} as const;

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] }, // smooth, slow ease
  },
} as const;

const MentalHealthCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center w-full h-full bg-[#d7efff] text-center px-6 pt-14 pb-14"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* 🎥 Video */}
      <motion.video
        src={sampleVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-w-5xl rounded-2xl shadow-lg object-cover"
        variants={fadeIn}
      />

      {/* 🩵 Title */}
      <motion.h2
        className="mt-8 text-[1.8rem] md:text-3xl font-bold text-[#4c4c4c] leading-snug"
        style={{ fontFamily: "Quicksand, sans-serif" }}
        variants={fadeIn}
      >
        Trust Mibo with your <br /> mental health
      </motion.h2>

      {/* 💬 Subtitle */}
      <motion.p
        className="mt-4 text-[1rem] text-[#4c4c4c] max-w-md mx-auto font-semibold"
        style={{ fontFamily: "Quicksand, sans-serif" }}
        variants={fadeIn}
      >
        Our mission is simple: to help you feel better, get better and stay
        better.
      </motion.p>

      {/* 📘 Description */}
      <motion.p
        className="mt-4 text-[#4c4c4c] text-[1rem] text-center font-semibold max-w-2xl"
        style={{ fontFamily: "Quicksand, sans-serif" }}
        variants={fadeIn}
      >
        We bring together self-care, support from qualified therapists and
        psychiatrists, as well as community access to deliver the best quality
        mental healthcare for your needs.
      </motion.p>

      {/* 🔘 Button */}
      <motion.div className="mt-8 flex justify-center" variants={fadeIn}>
        <button
          onClick={() => navigate("/about")}
          className="px-10 py-3 bg-[#18356C] text-white font-bold rounded-full text-sm tracking-wider shadow-md hover:opacity-90 transition"
          style={{ fontFamily: "Quicksand, sans-serif" }}
        >
          SEE MORE ABOUT US
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MentalHealthCard;
