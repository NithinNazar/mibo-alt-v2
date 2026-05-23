import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import ExpertsHeader from "./Components/ExpertsHeader";
import CategoryScroll from "./Components/CategoryScroll";
import FilterPills from "./Components/FilterPills";
import DoctorCard from "./Components/DoctorCard";
import Testimonials from "./Components/Testimonials";
import CompStatContact from "./Components/CompStatContact";
import ExpertsFooter from "./Components/ExpertsFooter";
import clinicianService from "../../services/clinicianService";
import type { Doctor } from "./data/doctors";

export default function ExpertsPage() {
  const [isReady, setIsReady] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    "Clinical Psychologists",
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Location: [],
    Expertise: [],
    Language: [],
    Price: [],
  });

  // Ref for the scrollable container to fix initial scroll position
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll instantly to top before showing content
    window.scrollTo({ top: 0, behavior: "instant" });
    fetchClinicians();
  }, []);

  const fetchClinicians = async () => {
    try {
      setLoading(true);

      // Fetch clinicians from database (public endpoint, no auth required)
      const clinicians = await clinicianService.getClinicians();

      // Transform backend data to match Doctor interface
      const transformedDoctors: Doctor[] = clinicians.map((c: any) => {
        // Handle specialization (can be string or array)
        const specialization = Array.isArray(c.specialization)
          ? c.specialization.join(", ")
          : c.specialization || "";

        // Handle qualification (can be string or array)
        const qualification = Array.isArray(c.qualification)
          ? c.qualification.join(", ")
          : c.qualification || "";

        const transformed = {
          id: c.id, // Keep original ID format (string or number)
          name: c.name || c.fullName || c.full_name || "",
          qualification,
          designation: c.designation || specialization,
          experience: `${c.yearsOfExperience || c.years_of_experience || 0}+ years`,
          expertise: c.expertise || [],
          image:
            c.profilePictureUrl ||
            c.profile_picture_url ||
            "/default-avatar.png",
          location: (c.primaryCentreName ||
            c.primary_centre_name ||
            c.centreName ||
            c.centre_name ||
            "Bangalore") as "Bangalore" | "Kochi" | "Mumbai",
          language: c.languages || ["English"],
          price: `₹${c.consultationFee || c.consultation_fee || 0}/session`,
          sessionTypes: getSessionTypes(
            c.consultationModes || c.consultation_modes || [],
          ),
        };

        return transformed;
      });

      setDoctors(transformedDoctors);

      // Reset scroll position to start after data loads
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
        }
      }, 100);
    } catch (error: any) {
      console.error("Failed to fetch clinicians from database:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        timeout: error.config?.timeout,
      });
      // Show empty state - no fallback
      setDoctors([]);
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
   * Optimized with early returns and reduced string operations
   */
  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    // Filter by category (role/designation)
    if (selectedCategory !== "All Experts") {
      const categoryLower = selectedCategory.toLowerCase();
      filtered = filtered.filter((doc) => {
        const designation = (doc.designation || "").toLowerCase();
        const qualification = (doc.qualification || "").toLowerCase();

        // Use switch for better performance than multiple if statements
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
  }, [selectedCategory, selectedFilters, doctors]);

  // Debug: Log filtering results (only in development)
  if (import.meta.env.DEV) {
    console.log("Total doctors:", doctors.length);
    console.log("Filtered doctors:", filteredDoctors.length);
    console.log("Selected category:", selectedCategory);
    console.log("Selected filters:", selectedFilters);
  }

  // Show page immediately with skeleton loaders instead of full-screen loading
  const showSkeletons = loading && doctors.length === 0;

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
          {!showSkeletons && filteredDoctors.length !== doctors.length && (
            <span className="text-lg text-[#034B44]/60 ml-2">
              ({filteredDoctors.length} of {doctors.length})
            </span>
          )}
        </h2>

        {showSkeletons ? (
          // Show skeleton loaders while loading
          <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="w-full h-[280px] bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-6 snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth" }}
          >
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="snap-start flex-shrink-0">
                <DoctorCard doctor={doc} />
              </div>
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
        {(showSkeletons || filteredDoctors.length > 0) && (
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
