import React from "react";
import { motion } from "framer-motion";
import ShapeTitle from "./ShapeTitle";

const StorySection: React.FC = () => {
  const leftCardVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0, transition: { duration: 3, delay: 1 } },
  };

  const rightCardVariants = {
    hidden: { opacity: 0, x: 150 },
    visible: { opacity: 1, x: 0, transition: { duration: 3, delay: 1.5 } },
  };

  return (
    <section className="py-16 px-6 md:px-20 bg-[#f7fbfa] text-center md:text-left">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="max-w-4xl mx-auto"
      >
        <ShapeTitle title="The Mibo Story" />
        <p className="text-[#2b2b2b] text-lg leading-relaxed font-[Quicksand] mt-4">
          Mibo was born from a simple belief — that every individual deserves
          compassionate, accessible, and evidence-based mental healthcare. What
          began as a mission to normalize mental health conversations has
          evolved into a leading network of care that combines clinical
          expertise with empathy.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={leftCardVariants}
            className="p-6 bg-[#cce3de]/50 rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-[#0a3d62] mb-2 font-[Quicksand]">
              Our Purpose
            </h3>
            <p className="text-[#2b2b2b] font-[Quicksand] leading-relaxed">
              To help individuals feel better, get better, and stay better —
              through therapy, psychiatry, and holistic wellbeing programs
              designed for every stage of your mental health journey.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={rightCardVariants}
            className="p-6 bg-[#7aa5a0]/20 rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-[#0a3d62] mb-2 font-[Quicksand]">
              Our Vision
            </h3>
            <p className="text-[#2b2b2b] font-[Quicksand] leading-relaxed">
              We envision a world where mental healthcare is destigmatized,
              data-driven, and personalized — empowering individuals to live
              their fullest lives with confidence and resilience.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default StorySection;
