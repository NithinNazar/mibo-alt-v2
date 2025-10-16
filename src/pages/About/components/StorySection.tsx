import React from "react";
import { motion } from "framer-motion";
import ShapeTitle from "./ShapeTitle";

const StorySection: React.FC = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-[#f7fbfa] text-center md:text-left">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <ShapeTitle title="The Mibo Story" />
        </motion.div>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-[#2b2b2b] text-lg leading-relaxed font-[Quicksand] mt-4"
        >
          Mibo was born from a simple belief — that every individual deserves
          compassionate, accessible, and evidence-based mental healthcare. What
          began as a mission to normalize mental health conversations has
          evolved into a leading network of care that combines clinical
          expertise with empathy.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="mt-10 grid md:grid-cols-2 gap-10"
        >
          <div className="p-6 bg-[#cce3de]/50 rounded-2xl">
            <h3 className="text-xl font-semibold text-[#0a3d62] mb-2 font-[Quicksand]">
              Our Purpose
            </h3>
            <p className="text-[#2b2b2b] font-[Quicksand] leading-relaxed">
              To help individuals feel better, get better, and stay better —
              through therapy, psychiatry, and holistic wellbeing programs
              designed for every stage of your mental health journey.
            </p>
          </div>
          <div className="p-6 bg-[#7aa5a0]/20 rounded-2xl">
            <h3 className="text-xl font-semibold text-[#0a3d62] mb-2 font-[Quicksand]">
              Our Vision
            </h3>
            <p className="text-[#2b2b2b] font-[Quicksand] leading-relaxed">
              We envision a world where mental healthcare is destigmatized,
              data-driven, and personalized — empowering individuals to live
              their fullest lives with confidence and resilience.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StorySection;

// import React from "react";
// import { motion } from "framer-motion";
// import ShapeTitle from "./ShapeTitle";

// const StorySection: React.FC = () => {
//   return (
//     <section className="py-16 px-6 md:px-20 bg-[#f7fbfa] text-center md:text-left">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         viewport={{ once: true }}
//         className="max-w-4xl mx-auto"
//       >
//         <ShapeTitle title="The Mibo Story" />
//         <p className="text-[#2b2b2b] text-lg leading-relaxed font-[Quicksand] mt-4">
//           Mibo was born from a simple belief — that every individual deserves
//           compassionate, accessible, and evidence-based mental healthcare. What
//           began as a mission to normalize mental health conversations has
//           evolved into a leading network of care that combines clinical
//           expertise with empathy.
//         </p>

//         <div className="mt-10 grid md:grid-cols-2 gap-10">
//           <div className="p-6 bg-[#cce3de]/50 rounded-2xl">
//             <h3 className="text-xl font-semibold text-[#0a3d62] mb-2 font-[Quicksand]">
//               Our Purpose
//             </h3>
//             <p className="text-[#2b2b2b] font-[Quicksand] leading-relaxed">
//               To help individuals feel better, get better, and stay better —
//               through therapy, psychiatry, and holistic wellbeing programs
//               designed for every stage of your mental health journey.
//             </p>
//           </div>
//           <div className="p-6 bg-[#7aa5a0]/20 rounded-2xl">
//             <h3 className="text-xl font-semibold text-[#0a3d62] mb-2 font-[Quicksand]">
//               Our Vision
//             </h3>
//             <p className="text-[#2b2b2b] font-[Quicksand] leading-relaxed">
//               We envision a world where mental healthcare is destigmatized,
//               data-driven, and personalized — empowering individuals to live
//               their fullest lives with confidence and resilience.
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default StorySection;
