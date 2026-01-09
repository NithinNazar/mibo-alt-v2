import { useEffect, useState, useMemo } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("All Experts");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Location: [],
    Expertise: [],
    Language: [],
    Price: [],
  });

  useEffect(() => {
    // Scroll instantly to top before showing content
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Filter doctors based on category and selected filters
   */
  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    // Filter by category (role/designation)
    if (selectedCategory !== "All Experts") {
      filtered = filtered.filter((doc) => {
        const designation = doc.designation.toLowerCase();
        const qualification = doc.qualification.toLowerCase();

        switch (selectedCategory) {
          case "Therapists":
            return (
              designation.includes("therapist") ||
              designation.includes("counselling") ||
              designation.includes("counseling")
            );
          case "Psychiatrists":
            return (
              designation.includes("psychiatrist") ||
              qualification.includes("psychiatry") ||
              qualification.includes("mbbs") ||
              qualification.includes("md")
            );
          case "Clinical Psychologists":
            return (
              designation.includes("clinical psychologist") ||
              qualification.includes("clinical psychology")
            );
          case "Counsellors":
            return (
              designation.includes("counsellor") ||
              designation.includes("counselor") ||
              designation.includes("counselling psychologist")
            );
          default:
            return true;
        }
      });
    }

    // Filter by Location
    if (selectedFilters.Location.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Location.includes(doc.location)
      );
    }

    // Filter by Expertise
    if (selectedFilters.Expertise.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Expertise.some((expertise) =>
          doc.expertise.some((exp) =>
            exp.toLowerCase().includes(expertise.toLowerCase())
          )
        )
      );
    }

    // Filter by Language
    if (selectedFilters.Language.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Language.some((lang) => doc.language.includes(lang))
      );
    }

    // Filter by Price
    if (selectedFilters.Price.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Price.includes(doc.price)
      );
    }

    return filtered;
  }, [selectedCategory, selectedFilters]);

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
      <div className="mt-[100px] text-center px-6 py-8 md:py-16">
        <h1 className="text-4xl font-bold mb-4">Meet Our Experts</h1>
        <p className="text-[#034B44]/80 text-lg">
          Compassionate professionals ready to support your wellbeing.
        </p>
      </div>

      {/* --- CATEGORY & FILTERS --- */}
      <CategoryScroll
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <FilterPills
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
      />

      {/* --- DOCTOR CARDS (HORIZONTAL SCROLL) --- */}
      <section className="relative px-6 mt-6">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Our Specialists
          {filteredDoctors.length !== doctors.length && (
            <span className="text-lg text-[#034B44]/60 ml-2">
              ({filteredDoctors.length} of {doctors.length})
            </span>
          )}
        </h2>

        {filteredDoctors.length > 0 ? (
          <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-6 snap-x snap-mandatory">
            {filteredDoctors.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="snap-start flex-shrink-0"
              >
                <DoctorCard doctor={doc} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#034B44]/60 text-lg">
              No experts found matching your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Experts");
                setSelectedFilters({
                  Location: [],
                  Expertise: [],
                  Language: [],
                  Price: [],
                });
              }}
              className="mt-4 px-6 py-2 bg-[#034B44] text-white rounded-full hover:bg-[#046e63] transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* subtle gradient overlays for scroll hint */}
        {filteredDoctors.length > 0 && (
          <>
            <div className="pointer-events-none absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#e9f6f4] to-transparent z-10" />
            <div className="pointer-events-none absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#e9f6f4] to-transparent z-10" />
          </>
        )}
      </section>

      {/* --- TESTIMONIALS & FOOTER --- */}
      <Testimonials />
      <CompStatContact />
      <ExpertsFooter />
    </motion.div>
  );
}
