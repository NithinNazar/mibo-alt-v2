import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpertsHeader from "./Components/ExpertsHeader";
import CategoryScroll from "./Components/CategoryScroll";
import FilterPills from "./Components/FilterPills";
import DoctorCard from "./Components/DoctorCard";
import Testimonials from "./Components/Testimonials";
import CompStatContact from "./Components/CompStatContact";
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

      {/* --- DOCTOR CARDS (HORIZONTAL SCROLL) --- */}
      <section className="relative px-6 mt-6">
        <h2 className="text-center text-3xl font-semibold mb-6">
          Our Specialists
        </h2>

        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-6 snap-x snap-mandatory">
          {doctors.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="snap-start flex-shrink-0"
            >
              <DoctorCard doctor={doc} />
            </motion.div>
          ))}
        </div>

        {/* subtle gradient overlays for scroll hint */}
        <div className="pointer-events-none absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#e9f6f4] to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#e9f6f4] to-transparent z-10" />
      </section>

      {/* --- TESTIMONIALS & FOOTER --- */}
      <Testimonials />
      <CompStatContact />
      <ExpertsFooter />
    </motion.div>
  );
}
