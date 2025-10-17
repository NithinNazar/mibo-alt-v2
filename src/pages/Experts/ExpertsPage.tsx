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
      <ExpertsHeader />

      <div className="mt-[100px] text-center px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Meet Our Experts</h1>
        <p className="text-[#034B44]/80 text-lg">
          Compassionate professionals ready to support your wellbeing.
        </p>
      </div>

      <CategoryScroll />
      <FilterPills />

      <section className="px-4 mt-4">
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6">
          {doctors.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px]"
            >
              <DoctorCard doctor={doc} />
            </motion.div>
          ))}
        </div>
      </section>

      <Testimonials />
      <ExpertsFooter />
    </motion.div>
  );
}

// import { useEffect } from "react";
// import { motion } from "framer-motion";
// import ExpertsHeader from "./Components/ExpertsHeader";
// import CategoryScroll from "./Components/CategoryScroll";
// import FilterPills from "./Components/FilterPills";
// import DoctorCard from "./Components/DoctorCard";
// import Testimonials from "./Components/Testimonials";
// import ExpertsFooter from "./Components/ExpertsFooter";
// import { doctors } from "./data/doctors";

// export default function ExpertsPage() {
//   useEffect(() => {
//     // delay ensures scroll happens after mount + splash fade
//     const timer = setTimeout(() => {
//       window.scrollTo({ top: 0, behavior: "instant" });
//     }, 150);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="flex flex-col w-full min-h-screen bg-[#e9f6f4] text-[#034B44]">
//       <ExpertsHeader />

//       {/* Hero Section */}
//       <div className="mt-[100px] text-center px-6 py-16">
//         <h1 className="text-4xl font-bold mb-4">Meet Our Experts</h1>
//         <p className="text-[#034B44]/80 text-lg">
//           Compassionate professionals ready to support your wellbeing.
//         </p>
//       </div>

//       {/* Category Scroll */}
//       <CategoryScroll />

//       {/* Filter Pills */}
//       <FilterPills />

//       {/* Doctor Cards */}

//       <section className="px-4 mt-4">
//         <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6">
//           {doctors.map((doc, index) => (
//             <motion.div
//               key={doc.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.5 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="flex-shrink-0 w-[280px]" // ✅ keep card width fixed
//             >
//               <DoctorCard doctor={doc} />
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Testimonials */}
//       <Testimonials />

//       <ExpertsFooter />
//     </div>
//   );
// }
