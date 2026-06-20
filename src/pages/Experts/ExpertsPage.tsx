import { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    // Scroll instantly to top
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
          location: normalizeLocation(
            c.primaryCentreName ||
              c.primary_centre_name ||
              c.centreName ||
              c.centre_name ||
              "Bangalore",
          ) as "Bangalore" | "Kochi" | "Mumbai",
          language: c.languages || ["English"],
          price: `₹${c.consultationFee || c.consultation_fee || 0}/session`,
          sessionTypes: getSessionTypes(
            c.consultationModes || c.consultation_modes || [],
          ),
        };

        return transformed;
      });

      setDoctors(transformedDoctors);
    } catch (error: any) {
      // Show empty state - no fallback
      setDoctors([]);
    } finally {
      setLoading(false);
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

  // Normalize location names to match filter options
  const normalizeLocation = (location: string): string => {
    const loc = location.trim().toLowerCase();
    if (loc.includes("bangalore") || loc.includes("bengaluru")) {
      return "Bangalore";
    } else if (loc.includes("kochi") || loc.includes("cochin")) {
      return "Kochi";
    } else if (loc.includes("mumbai") || loc.includes("bombay")) {
      return "Mumbai";
    }
    // Default fallback - capitalize first letter
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
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

    // Filter by Location (case-insensitive)
    if (selectedFilters.Location.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Location.some(
          (loc) => loc.toLowerCase() === doc.location.toLowerCase(),
        ),
      );
    }

    // Filter by Expertise (case-insensitive partial match)
    if (selectedFilters.Expertise.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Expertise.some((expertise) =>
          doc.expertise.some((exp) =>
            exp.toLowerCase().includes(expertise.toLowerCase()),
          ),
        ),
      );
    }

    // Filter by Language (case-insensitive)
    if (selectedFilters.Language.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Language.some((lang) =>
          doc.language.some(
            (docLang) => docLang.toLowerCase() === lang.toLowerCase(),
          ),
        ),
      );
    }

    // Filter by Price (using price ranges)
    if (selectedFilters.Price.length > 0) {
      filtered = filtered.filter((doc) => {
        // Extract numeric price from string like "₹2000/session"
        const priceMatch = doc.price.match(/₹(\d+)/);
        if (!priceMatch) return false;

        const price = parseInt(priceMatch[1]);

        return selectedFilters.Price.some((range) => {
          if (range === "₹1000-₹1500") {
            return price >= 1000 && price <= 1500;
          } else if (range === "₹1500-₹2000") {
            return price > 1500 && price <= 2000;
          } else if (range === "₹2000-₹2500") {
            return price > 2000 && price <= 2500;
          } else if (range === "₹2500+") {
            return price > 2500;
          }
          return false;
        });
      });
    }

    return filtered;
  }, [selectedCategory, selectedFilters, doctors]);

  // Show skeleton only on initial load, not on filter changes
  const showSkeletons = loading && doctors.length === 0;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#e9f6f4] text-[#034B44]">
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

      {/* --- DOCTOR CARDS (GRID LAYOUT) --- */}
      <section className="px-6 mt-6 max-w-[1400px] mx-auto w-full">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Our Specialists
          {!showSkeletons && filteredDoctors.length !== doctors.length && (
            <span className="text-lg text-[#034B44]/60 ml-2">
              ({filteredDoctors.length} of {doctors.length})
            </span>
          )}
        </h2>

        {showSkeletons ? (
          // Show minimal skeleton loaders while loading - Grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white/50 rounded-2xl p-6 min-h-[400px]"
              >
                <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
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
      </section>

      {/* --- TESTIMONIALS & FOOTER --- */}
      <Testimonials />
      <CompStatContact />
      <ExpertsFooter />
    </div>
  );
}
