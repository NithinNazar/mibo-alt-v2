import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import ShapeTitle from "./ShapeTitle";

const ApproachSection: React.FC = () => {
  const [open, setOpen] = useState<number>(0);

  const sections = [
    {
      title: "1. Clinical Excellence",
      content:
        "At Mibo, every therapeutic approach and psychiatric plan is guided by the latest evidence-based research. Our specialists ensure that you receive high-quality care tailored to your needs.",
    },
    {
      title: "2. Personalized Care",
      content:
        "We blend data, human insight, and empathy to create care pathways unique to each individual. Your journey is yours alone — and we walk beside you every step.",
    },
    {
      title: "3. Community & Support",
      content:
        "Healing thrives in connection. Through our programs and wellness initiatives, we build a safe, inclusive community where growth and recovery go hand-in-hand.",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      className="relative py-20 px-6 md:px-20 bg-[#c5c6fc]/40" // background color
    >
      <div className="relative max-w-4xl mx-auto text-center md:text-left">
        <ShapeTitle title="The Mibo Approach" />
        <p className="text-[#2b2b2b] text-lg font-[Quicksand] mb-10">
          Our integrated care model ensures that you receive the right help at
          the right time, from the right expert.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-4"
        >
          {sections.map((sec, i) => (
            <motion.div key={i} variants={cardVariants}>
              <div className="border border-[#7aa5a0] rounded-2xl overflow-hidden bg-white relative z-10">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full text-left p-5 flex justify-between items-center font-semibold text-[#0a3d62]"
                >
                  <span>{sec.title}</span>
                  <span>{open === i ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="px-5 pb-5 text-[#2b2b2b] font-[Quicksand]"
                    >
                      {sec.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ApproachSection;

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ShapeTitle from "./ShapeTitle";

// const ApproachSection: React.FC = () => {
//   const [open, setOpen] = useState<number>(0);

//   const sections = [
//     {
//       title: "1. Clinical Excellence",
//       content:
//         "At Mibo, every therapeutic approach and psychiatric plan is guided by the latest evidence-based research. Our specialists ensure that you receive high-quality care tailored to your needs.",
//     },
//     {
//       title: "2. Personalized Care",
//       content:
//         "We blend data, human insight, and empathy to create care pathways unique to each individual. Your journey is yours alone — and we walk beside you every step.",
//     },
//     {
//       title: "3. Community & Support",
//       content:
//         "Healing thrives in connection. Through our programs and wellness initiatives, we build a safe, inclusive community where growth and recovery go hand-in-hand.",
//     },
//   ];

//   return (
//     <section className="py-20 px-6 md:px-20 bg-[#c5c6fc]/20">
//       <div className="max-w-4xl mx-auto text-center md:text-left">
//         <ShapeTitle title="The Mibo Approach" />
//         <p className="text-[#2b2b2b] text-lg font-[Quicksand] mb-10">
//           Our integrated care model ensures that you receive the right help at
//           the right time, from the right expert.
//         </p>

//         <div className="space-y-4">
//           {sections.map((sec, i) => (
//             <div
//               key={i}
//               className="border border-[#7aa5a0] rounded-2xl overflow-hidden bg-white"
//             >
//               <button
//                 onClick={() => setOpen(open === i ? -1 : i)}
//                 className="w-full text-left p-5 flex justify-between items-center font-semibold text-[#0a3d62]"
//               >
//                 <span>{sec.title}</span>
//                 <span>{open === i ? "−" : "+"}</span>
//               </button>
//               <AnimatePresence initial={false}>
//                 {open === i && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.4 }}
//                     className="px-5 pb-5 text-[#2b2b2b] font-[Quicksand]"
//                   >
//                     {sec.content}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ApproachSection;
