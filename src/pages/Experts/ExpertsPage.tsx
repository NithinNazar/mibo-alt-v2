import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpertsHeader from "./Components/ExpertsHeader";
import CategoryScroll from "./Components/CategoryScroll";
import FilterPills from "./Components/FilterPills";
import DoctorCard from "./Components/DoctorCard";
import Testimonials from "./Components/Testimonials";
import ExpertsFooter from "./Components/ExpertsFooter";
import { doctors } from "./data/doctors";

export default function ExpertsPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Scroll instantly to top before showing content
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div className="w-full h-screen bg-[#e9f6f4]" />; // blank splash frame
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col w-full min-h-screen bg-[#e9f6f4] text-[#034B44]"
    >
      {/* --- HEADER --- */}
      <ExpertsHeader />

      {/* --- INTRO TEXT --- */}
      <div className="mt-[100px] text-center px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Meet Our Experts</h1>
        <p className="text-[#034B44]/80 text-lg">
          Compassionate professionals ready to support your wellbeing.
        </p>
      </div>

      {/* --- CATEGORY & FILTERS --- */}
      <CategoryScroll />
      <FilterPills />

      {/* --- DOCTOR CARDS (VERTICAL CENTERED SCROLL) --- */}
      <section className="relative px-4 mt-4 flex justify-center">
        {/* Centered scrollable area */}
        <div className="relative w-full max-w-[700px] flex justify-center">
          {/* Fade overlay - top */}
          <div className="pointer-events-none absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#e9f6f4] to-transparent z-10" />

          {/* Scrollable doctor cards */}
          <div className="flex flex-col items-center gap-8 overflow-y-auto no-scrollbar max-h-[75vh] pb-8 w-full">
            {doctors.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full max-w-[420px]"
              >
                <DoctorCard doctor={doc} />
              </motion.div>
            ))}
          </div>

          {/* Fade overlay - bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#e9f6f4] to-transparent z-10" />
        </div>
      </section>

      {/* --- TESTIMONIALS & FOOTER --- */}
      <Testimonials />
      <ExpertsFooter />
    </motion.div>
  );
}

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import ExpertsHeader from "./Components/ExpertsHeader";
// import CategoryScroll from "./Components/CategoryScroll";
// import FilterPills from "./Components/FilterPills";
// import DoctorCard from "./Components/DoctorCard";
// import Testimonials from "./Components/Testimonials";
// import ExpertsFooter from "./Components/ExpertsFooter";
// import { doctors } from "./data/doctors";

// export default function ExpertsPage() {
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     // Scroll instantly to top before showing content
//     window.scrollTo({ top: 0, behavior: "instant" });
//     const timer = setTimeout(() => setIsReady(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!isReady) {
//     return <div className="w-full h-screen bg-[#e9f6f4]" />; // blank splash frame
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="flex flex-col w-full min-h-screen bg-[#e9f6f4] text-[#034B44]"
//     >
//       <ExpertsHeader />

//       <div className="mt-[100px] text-center px-6 py-16">
//         <h1 className="text-4xl font-bold mb-4">Meet Our Experts</h1>
//         <p className="text-[#034B44]/80 text-lg">
//           Compassionate professionals ready to support your wellbeing.
//         </p>
//       </div>

//       <CategoryScroll />
//       <FilterPills />

//       <section className="px-4 mt-4">
//         <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6">
//           {doctors.map((doc, index) => (
//             <motion.div
//               key={doc.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.5 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="flex-shrink-0 w-[280px]"
//             >
//               <DoctorCard doctor={doc} />
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       <Testimonials />
//       <ExpertsFooter />
//     </motion.div>
//   );
// }
