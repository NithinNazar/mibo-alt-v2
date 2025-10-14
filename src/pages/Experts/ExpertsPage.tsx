import ExpertsHeader from "./Components/ExpertsHeader";
import ExpertsFooter from "./Components/ExpertsFooter";
import CategoryScroll from "./Components/CategoryScroll";
import FilterPills from "./Components/FilterPills";
import DoctorCard from "./Components/DoctorCard";
import Testimonials from "./Components/Testimonials";
import { doctors } from "./data/doctors";
import { motion } from "framer-motion";

export default function ExpertsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#d0f7f4] text-[#034B44]">
      <ExpertsHeader />

      {/* Hero Section */}
      <div className="mt-[100px] text-center px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Meet Our Experts</h1>
        <p className="text-[#034B44]/80 text-lg">
          Compassionate professionals ready to support your wellbeing.
        </p>
      </div>

      {/* Category Scroll */}
      <CategoryScroll />

      {/* Filter Pills */}
      <FilterPills />

      {/* Doctor Cards */}
      <section className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-6"
        >
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      <ExpertsFooter />
    </div>
  );
}

// // src/pages/Experts/ExpertsPage.tsx
// import CategoryScroll from "./Components/CategoryScroll";
// import FilterPills from "./Components/FilterPills";
// import DoctorCard from "./Components/DoctorCard";
// import Testimonials from "./Components/Testimonials";
// import { doctors } from "./data/doctors";
// import { motion } from "framer-motion";

// export default function ExpertsPage() {
//   return (
//     <div className="min-h-screen bg-[#d0f7f4] text-[#034B44] flex flex-col">
//       {/* Header */}

//       <header className="py-6 px-6 border-b border-[#a7c4f2]/40">
//         <h1 className="text-3xl font-semibold">Meet Our Experts</h1>
//         <p className="text-[#034B44]/80 text-sm mt-1">
//           Compassionate professionals ready to support your wellbeing.
//         </p>
//       </header>

//       {/* Category Scroll */}
//       <CategoryScroll />

//       {/* Filter Pills */}
//       <FilterPills />

//       {/* Doctor Cards */}
//       <section className="px-4 mt-4">
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="flex gap-5 overflow-x-auto no-scrollbar pb-6"
//         >
//           {doctors.map((doc) => (
//             <DoctorCard key={doc.id} doctor={doc} />
//           ))}
//         </motion.div>
//       </section>

//       {/* Testimonials */}
//       <Testimonials />

//       {/* Footer Placeholder */}
//       <footer className="mt-16 py-6 border-t border-[#a7c4f2]/40 text-center text-[#034B44]/80 text-sm">
//         © 2025 Mibo Hospitals. All Rights Reserved.
//       </footer>
//     </div>
//   );
// }
