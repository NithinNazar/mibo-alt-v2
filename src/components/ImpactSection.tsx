import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const ImpactSection: React.FC = () => {
  const [text, setText] = useState("");
  const paragraph =
    "At Mibo, we focus on improving emotional wellness, enhancing mental resilience, and creating measurable impact for individuals and organizations alike.";

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setText(paragraph.slice(0, current + 1));
      current++;
      if (current === paragraph.length) clearInterval(interval);
    }, 80); // slower typing for better readability
    return () => clearInterval(interval);
  }, []);

  const cardData = [
    {
      percent: "92%",
      text: "Reported improved emotional well-being",
      from: "left",
      gradient: "from-[#E0F9F7] to-[#C0F0EA]",
    },
    {
      percent: "87%",
      text: "Experienced reduction in anxiety levels",
      from: "right",
      gradient: "from-[#D8F3FF] to-[#BDE9F7]",
    },
    {
      percent: "76%",
      text: "Felt more productive and focused at work",
      from: "left",
      gradient: "from-[#D9FFF3] to-[#B8F3E0]",
    },
    {
      percent: "94%",
      text: "Showed higher engagement in therapy",
      from: "right",
      gradient: "from-[#DFF1FF] to-[#BBDFFF]",
    },
    {
      percent: "100+",
      text: "Organizations transformed through our mental wellness programs",
      from: "bottom",
      gradient: "from-[#C4F1EE] to-[#AEE7E1]",
    },
  ];

  const cardVariants: Variants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    hiddenBottom: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full py-28 bg-gradient-to-tr from-[#E6FAF7] via-[#D9F3FF] to-[#E1FBF4] overflow-hidden">
      {/* Full-width background */}
      <div className="w-full absolute inset-0 -z-10"></div>

      <div className="px-6 text-center w-full">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[#085c56]">
          Our Measurable Impact
        </h2>

        {/* Smooth color transition paragraph */}
        <p className="max-w-3xl mx-auto text-lg leading-relaxed mb-16">
          {paragraph.split("").map((char, i) => (
            <span
              key={i}
              style={{
                color: i < text.length ? "#111" : "#9ca3af",
                fontWeight: i < text.length ? "700" : "400",
                transition: "color 0.25s linear, font-weight 0.25s linear",
                transitionDelay: `${i * 0.03}s`, // gradual fade per character
              }}
            >
              {char}
            </span>
          ))}
        </p>

        {/* Grid layout */}
        <div className="grid grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          {/* Small cards */}
          {cardData.slice(0, 4).map((card, index) => (
            <motion.div
              key={index}
              className={`rounded-2xl p-8 md:p-10 shadow-lg bg-gradient-to-br ${card.gradient} 
              border border-white/60 backdrop-blur-md flex flex-col justify-center min-h-[220px]`}
              variants={cardVariants}
              initial={
                card.from === "left"
                  ? "hiddenLeft"
                  : card.from === "right"
                  ? "hiddenRight"
                  : "hiddenBottom"
              }
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: index * 0.2,
                duration: 0.9,
                ease: "easeOut",
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#0b4b46] drop-shadow-sm">
                {card.percent}
              </h2>
              <p className="text-sm md:text-base font-medium text-gray-700 break-words leading-relaxed">
                {card.text}
              </p>
            </motion.div>
          ))}

          {/* Big card */}
          <motion.div
            className={`rounded-2xl p-10 shadow-lg bg-gradient-to-br ${cardData[4].gradient} 
              border border-white/60 backdrop-blur-md flex flex-col justify-center col-span-2 min-h-[180px]`}
            variants={cardVariants}
            initial="hiddenBottom"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-[#0b4b46] drop-shadow-sm">
              {cardData[4].percent}
            </h2>
            <p className="text-base md:text-lg font-medium text-gray-700 break-words leading-relaxed">
              {cardData[4].text}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;

// import React, { useEffect, useState } from "react";
// import { motion, type Variants } from "framer-motion";

// const ImpactSection: React.FC = () => {
//   const [text, setText] = useState("");
//   const paragraph =
//     "At Mibo, we focus on improving emotional wellness, enhancing mental resilience, and creating measurable impact for individuals and organizations alike.";

//   useEffect(() => {
//     let current = 0;
//     const interval = setInterval(() => {
//       setText(paragraph.slice(0, current + 1));
//       current++;
//       if (current === paragraph.length) clearInterval(interval);
//     }, 30);
//     return () => clearInterval(interval);
//   }, []);

//   const cardData = [
//     {
//       percent: "92%",
//       text: "Reported improved emotional well-being",
//       from: "left",
//       gradient: "from-[#E0F9F7] to-[#C0F0EA]",
//     },
//     {
//       percent: "87%",
//       text: "Experienced reduction in anxiety levels",
//       from: "right",
//       gradient: "from-[#D8F3FF] to-[#BDE9F7]",
//     },
//     {
//       percent: "76%",
//       text: "Felt more productive and focused at work",
//       from: "left",
//       gradient: "from-[#D9FFF3] to-[#B8F3E0]",
//     },
//     {
//       percent: "94%",
//       text: "Showed higher engagement in therapy",
//       from: "right",
//       gradient: "from-[#DFF1FF] to-[#BBDFFF]",
//     },
//     {
//       percent: "100+",
//       text: "Organizations transformed through our mental wellness programs",
//       from: "bottom",
//       gradient: "from-[#C4F1EE] to-[#AEE7E1]",
//     },
//   ];

//   const cardVariants: Variants = {
//     hiddenLeft: { opacity: 0, x: -100 },
//     hiddenRight: { opacity: 0, x: 100 },
//     hiddenBottom: { opacity: 0, y: 100 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       y: 0,
//       transition: { duration: 1, ease: "easeOut" },
//     },
//   };

//   return (
//     <section className="relative w-full py-28 bg-gradient-to-tr from-[#E6FAF7] via-[#D9F3FF] to-[#E1FBF4] overflow-hidden">
//       {/* Full-width background */}
//       <div className="w-full absolute inset-0 -z-10"></div>

//       <div className="px-6 text-center w-full">
//         {/* Heading */}
//         <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[#085c56]">
//           Our Measurable Impact
//         </h2>

//         {/* Typing animation paragraph */}
//         <p className="max-w-3xl mx-auto text-lg leading-relaxed mb-16">
//           {paragraph.split("").map((char, i) => (
//             <span
//               key={i}
//               style={{
//                 color: i < text.length ? "#111" : "#9ca3af",
//                 fontWeight: i < text.length ? "700" : "400",
//                 transition: "color 0.04s linear, font-weight 0.04s linear",
//               }}
//             >
//               {char}
//             </span>
//           ))}
//         </p>

//         {/* Grid layout */}
//         <div className="grid grid-cols-2 gap-8 max-w-[1200px] mx-auto">
//           {/* Small cards */}
//           {cardData.slice(0, 4).map((card, index) => (
//             <motion.div
//               key={index}
//               className={`rounded-2xl p-8 md:p-10 shadow-lg bg-gradient-to-br ${card.gradient}
//               border border-white/60 backdrop-blur-md flex flex-col justify-center min-h-[220px]`}
//               variants={cardVariants}
//               initial={
//                 card.from === "left"
//                   ? "hiddenLeft"
//                   : card.from === "right"
//                   ? "hiddenRight"
//                   : "hiddenBottom"
//               }
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{
//                 delay: index * 0.2,
//                 duration: 0.9,
//                 ease: "easeOut",
//               }}
//             >
//               <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#0b4b46] drop-shadow-sm">
//                 {card.percent}
//               </h2>
//               <p className="text-sm md:text-base font-medium text-gray-700 break-words leading-relaxed">
//                 {card.text}
//               </p>
//             </motion.div>
//           ))}

//           {/* Big card */}
//           <motion.div
//             className={`rounded-2xl p-10 shadow-lg bg-gradient-to-br ${cardData[4].gradient}
//               border border-white/60 backdrop-blur-md flex flex-col justify-center col-span-2 min-h-[180px]`}
//             variants={cardVariants}
//             initial="hiddenBottom"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
//           >
//             <h2 className="text-4xl md:text-5xl font-bold mb-3 text-[#0b4b46] drop-shadow-sm">
//               {cardData[4].percent}
//             </h2>
//             <p className="text-base md:text-lg font-medium text-gray-700 break-words leading-relaxed">
//               {cardData[4].text}
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ImpactSection;
