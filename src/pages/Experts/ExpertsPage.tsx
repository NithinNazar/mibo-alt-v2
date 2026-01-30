import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ExpertsHeader from "./Components/ExpertsHeader";
import CategoryScroll from "./Components/CategoryScroll";
import FilterPills from "./Components/FilterPills";
import DoctorCard from "./Components/DoctorCard";
import Testimonials from "./Components/Testimonials";
import CompStatContact from "./Components/CompStatContact";
import ExpertsFooter from "./Components/ExpertsFooter";
import { doctors as staticDoctors } from "./data/doctors";
import clinicianService from "../../services/clinicianService";
import type { Doctor } from "./data/doctors";

export default function ExpertsPage() {
  const [isReady, setIsReady] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchClinicians();
  }, []);

  const fetchClinicians = async () => {
    try {
      setLoading(true);
      const clinicians = await clinicianService.getClinicians();

      if (clinicians.length === 0) {
        // Fallback to static data if no clinicians in database
        console.log("No clinicians in database, using static data");
        setDoctors(staticDoctors);
      } else {
        // Transform backend data to match Doctor interface
        const transformedDoctors: Doctor[] = clinicians.map((c: any) => ({
          id: parseInt(c.id),
          name: c.fullName || c.full_name,
          qualification: c.qualification || "",
          designation: c.designation || c.specialization,
          experience: `${c.yearsOfExperience || c.years_of_experience || 0}+ years`,
          expertise: c.expertise || [],
          image:
            c.profilePictureUrl ||
            c.profile_picture_url ||
            "/default-avatar.png",
          location: (c.centreName || c.centre_name || "Bangalore") as
            | "Bangalore"
            | "Kochi"
            | "Mumbai",
          language: c.languages || ["English"],
          price: `₹${c.consultationFee || c.consultation_fee || 0}/session`,
          sessionTypes: getSessionTypes(
            c.consultationModes || c.consultation_modes || [],
          ),
        }));

        setDoctors(transformedDoctors);
        console.log(
          `Loaded ${transformedDoctors.length} clinicians from backend`,
        );
      }
    } catch (error) {
      console.error("Failed to fetch clinicians, using static data:", error);
      // Fallback to static data on error
      setDoctors(staticDoctors);
    } finally {
      setLoading(false);
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  };

  const getSessionTypes = (modes: string[]) => {
    if (modes.includes("ONLINE") && modes.includes("IN_PERSON")) {
      return "In-person & Online sessions";
    } else if (modes.includes("ONLINE")) {
      return "Online sessions";
    } else if (modes.includes("IN_PERSON")) {
      return "In-person sessions";
    } else {
      return "In-person & Online sessions";
    }
  };

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
        selectedFilters.Location.includes(doc.location),
      );
    }

    // Filter by Expertise
    if (selectedFilters.Expertise.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Expertise.some((expertise) =>
          doc.expertise.some((exp) =>
            exp.toLowerCase().includes(expertise.toLowerCase()),
          ),
        ),
      );
    }

    // Filter by Language
    if (selectedFilters.Language.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Language.some((lang) => doc.language.includes(lang)),
      );
    }

    // Filter by Price
    if (selectedFilters.Price.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Price.includes(doc.price),
      );
    }

    return filtered;
  }, [selectedCategory, selectedFilters]);

  if (!isReady || loading) {
    return (
      <div className="w-full h-screen bg-[#e9f6f4] flex items-center justify-center">
        <div className="text-[#034B44] text-xl">Loading experts...</div>
      </div>
    );
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
