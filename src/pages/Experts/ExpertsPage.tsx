import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserRound,
  Stethoscope,
  MessageSquare,
  User,
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
  Languages,
  Video,
  CalendarClock,
  Headphones,
  MessageCircle,
  BadgeCheck,
  ClipboardList,
  ChevronDown,
  RotateCcw,
  ArrowUpDown,
  Tag,
  Globe,
  Quote,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import ExpertsHeader from "./Components/ExpertsHeader";
import ExpertsFooter from "./Components/ExpertsFooter";
import clinicianService from "../../services/clinicianService";
import type { Doctor } from "./data/doctors";
import { dummyDoctors } from "./data/dummyDoctors";

import iso from "./assets/iso.jpeg";
import hipaa from "./assets/hippa.jpeg";
import gdpr from "./assets/eu.jpeg";

const CATEGORIES = [
  { label: "All Experts", icon: Users },
  { label: "Clinical Psychologists", icon: UserRound },
  { label: "Psychiatrists", icon: Stethoscope },
  { label: "Counsellors", icon: MessageSquare },
  { label: "Therapists", icon: User },
];

const TESTIMONIALS = [
  {
    quote:
      "Dr. Aisha helped me rediscover calm in my daily life. I've never felt more supported!",
    author: "Aarushi P.",
  },
  {
    quote:
      "The therapy experience at Mibo was so professional yet personal. Highly recommend.",
    author: "Ritika D.",
  },
  {
    quote:
      "My sessions with Dr. Rahul were life-changing. He made mental health approachable.",
    author: "Karthik R.",
  },
];

interface FilterDropdownProps {
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
  position: { top: number; left: number; width: number };
  onRequestClose: () => void;
}

function FilterDropdown({
  options,
  selected,
  onChange,
  position,
}: FilterDropdownProps) {
  return createPortal(
    <div
      className="filter-dropdown-portal fixed w-64 max-h-72 overflow-y-auto bg-white rounded-xl border border-[#e6ede9] shadow-xl p-3 z-[999] text-left"
      style={{ top: position.top, left: position.left, width: position.width }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 py-1.5 px-2 text-sm text-[#16241f] hover:bg-[#f4faf7] rounded-md cursor-pointer"
        >
          <input
            type="checkbox"
            className="accent-[#0e6b4f] cursor-pointer"
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </div>,
    document.body,
  );
}

export default function ExpertsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    "All Experts",
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Location: [],
    Expertise: [],
    Language: [],
    Price: [],
  });

  // --- Filter dropdown state ---
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 256, 
  });
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // --- Sort state ---
  type SortOption =
    | "Price: Low to High"
    | "Price: High to Low"
    | "Experience: High to Low"
    | "Name: A-Z";
  const [sortBy, setSortBy] = useState<SortOption | null>(null);
  const SORT_OPTIONS: SortOption[] = [
    "Price: Low to High",
    "Price: High to Low",
    "Experience: High to Low",
    "Name: A-Z",
  ];
  const parsePrice = (price: string) => parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
  const parseExperience = (exp: string) => parseInt(exp.replace(/[^0-9]/g, ""), 10) || 0;

  const FILTER_OPTIONS: Record<string, string[]> = {
    Location: ["Bangalore", "Kochi", "Mumbai"],
    Expertise: [
      "Anxiety",
      "Depression",
      "Stress",
      "Trauma",
      "Relationships",
      "PTSD",
      "OCD",
      "Bipolar Disorder",
      "Schizophrenia",
      "ADHD",
      "Mood Disorders",
      "Work Stress",
      "Sleep Issues",
      "Self-esteem",
      "Family Therapy",
      "Autism",
      "Child Anxiety",
      "Adolescent Issues",
    ],
    Language: ["English", "Hindi", "Kannada", "Malayalam", "Tamil", "Telugu", "Marathi"],
    Price: ["₹1600/session"],
  };

  // Maps the visible pill label to the key used in selectedFilters state
  const FILTER_KEY_MAP: Record<string, string> = {
    Location: "Location",
    Expertise: "Expertise",
    Languages: "Language",
    Price: "Price",
  };

  const toggleFilterOption = (filterKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterKey] || [];
      return {
        ...prev,
        [filterKey]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const openFilterDropdown = (label: string) => {
    if (openFilter === label) {
      setOpenFilter(null);
      return;
    }
    const btn = buttonRefs.current[label];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const dropdownWidth = 256; 
      let left = rect.left;
      const viewportWidth = window.innerWidth;
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      setDropdownPosition({
        top: rect.bottom + 8, 
        left,
        width: dropdownWidth,
      });
    }
    setOpenFilter(label);
  };

  // Close any open dropdown when clicking outside the filter bar / dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".filter-dropdown-portal")) return;
      if (
        filterBarRef.current &&
        !filterBarRef.current.contains(target)
      ) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reposition / close dropdown on resize or scroll so it never drifts from its button
  useEffect(() => {
    if (!openFilter) return;
    const reposition = () => {
      const btn = buttonRefs.current[openFilter];
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const dropdownWidth = 256;
      let left = rect.left;
      const viewportWidth = window.innerWidth;
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10;
      }
      setDropdownPosition({ top: rect.bottom + 8, left, width: dropdownWidth });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [openFilter]);

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
        // Handle specialization 
        const specialization = Array.isArray(c.specialization)
          ? c.specialization.join(", ")
          : c.specialization || "";

        // Handle qualification 
        const qualification = Array.isArray(c.qualification)
          ? c.qualification.join(", ")
          : c.qualification || "";

        const transformed = {
          id: c.id, 
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

      setDoctors(
        transformedDoctors.length > 0 ? transformedDoctors : dummyDoctors,
      );
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
      // if API failed - show dummy data instead of an empty state
      setDoctors(dummyDoctors);
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

  //  Filter doctors based on category and selected filters
   
  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    // Filter by category (role/designation)
    if (selectedCategory !== "All Experts") {
      const categoryLower = selectedCategory.toLowerCase();
      filtered = filtered.filter((doc) => {
        const designation = (doc.designation || "").toLowerCase();
        const qualification = (doc.qualification || "").toLowerCase();

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
        selectedFilters.Location.some(
          (loc) => loc.toLowerCase() === doc.location.toLowerCase(),
        ),
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
        selectedFilters.Language.some((lang) =>
          doc.language.some(
            (docLang) => docLang.toLowerCase() === lang.toLowerCase(),
          ),
        ),
      );
    }

    // Filter by Price
    if (selectedFilters.Price.length > 0) {
      filtered = filtered.filter((doc) =>
        selectedFilters.Price.includes(doc.price),
      );
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "Price: Low to High":
            return parsePrice(a.price) - parsePrice(b.price);
          case "Price: High to Low":
            return parsePrice(b.price) - parsePrice(a.price);
          case "Experience: High to Low":
            return parseExperience(b.experience) - parseExperience(a.experience);
          case "Name: A-Z":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [selectedCategory, selectedFilters, doctors, sortBy]);


  // Show skeleton only on initial load, not on filter changes
  const showSkeletons = loading && doctors.length === 0;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-[#16241f] font-['Inter',sans-serif]">
      {/* --- HEADER  --- */}
      <ExpertsHeader />

      {/* --- HERO --- */}
      <section className="relative overflow-hidden text-center pt-[120px] pb-10 bg-gradient-to-b from-[#f8fcfa] to-white">

        <h1 className="text-3xl md:text-[42px] font-extrabold text-[#0a2e23] mb-2 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Meet Our Experts
        </h1>
        <div className="w-14 h-[3px] bg-gradient-to-r from-[#138158] to-[#138158] mx-auto my-4 rounded-full" />
        <p className="text-[#637268] text-[15.5px] font-medium">
          Compassionate professionals ready to support your wellbeing.
        </p>

        {/* --- CATEGORY PILLS --- */}
        <div className="flex justify-center gap-2.5 flex-wrap mt-8">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSelectedCategory(label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] font-semibold border transition-all ${selectedCategory === label
                ? "bg-[#0e6b4f] text-white border-[#0e6b4f] shadow-[0_3px_10px_rgba(14,107,79,.22)]"
                : "bg-white text-[#3a463f] border-[#e6ede9] hover:border-[#138158] hover:text-[#0e6b4f]"
                }`}
            >
              <Icon className="w-[15px] h-[15px]" />
              {label}
            </button>
          ))}
        </div>

        {/* --- FILTER BAR --- */}
        <div
          ref={filterBarRef}
          className="relative inline-flex items-center flex-wrap justify-center gap-x-10 gap-y-3 mx-auto mt-7 px-8 py-3.5 border border-[#e6ede9] rounded-full bg-white shadow-sm"
        >
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: "Location", icon: MapPin },
              { label: "Expertise", icon: Star },
              { label: "Languages", icon: Globe },
              { label: "Price", icon: Tag },
              { label: "Gender", icon: UserRound },
            ].map(({ label, icon: Icon }) => {
              const filterKey = FILTER_KEY_MAP[label];
              const activeCount = filterKey
                ? selectedFilters[filterKey]?.length || 0
                : 0;
              const isOpen = openFilter === label;
              const options = filterKey ? FILTER_OPTIONS[filterKey] : [];

              return (
                <div key={label} className="relative">
                  <button
                    type="button"
                    ref={(el) => void (buttonRefs.current[label] = el)}
                    onClick={() => filterKey && openFilterDropdown(label)}
                    disabled={!filterKey}
                    className={`flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors ${activeCount > 0
                      ? "text-[#0e6b4f]"
                      : "text-[#3a463f] hover:text-[#0e6b4f]"
                      } ${filterKey ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                  >
                    <Icon className="w-4 h-4 text-[#0e6b4f]" />
                    {label}
                    {activeCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#0e6b4f] text-white rounded-full text-[10px] font-bold">
                        {activeCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#94a39b] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && filterKey && (
                    <FilterDropdown
                      options={options}
                      selected={selectedFilters[filterKey] || []}
                      onChange={(value) => toggleFilterOption(filterKey, value)}
                      position={dropdownPosition}
                      onRequestClose={() => setOpenFilter(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#e6ede9]" />
          <div className="flex items-center gap-5 flex-wrap">
            <span
              onClick={() => {
                setSelectedFilters({
                  Location: [],
                  Expertise: [],
                  Language: [],
                  Price: [],
                });
                setSortBy(null);
                setOpenFilter(null);
              }}
              className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#3a463f] cursor-pointer hover:text-[#0e6b4f] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear All
            </span>
            <button
              type="button"
              ref={(el) => void (buttonRefs.current["Sort By"] = el)}
              onClick={() => openFilterDropdown("Sort By")}
              className={`flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                sortBy ? "text-[#0e6b4f]" : "text-[#3a463f] hover:text-[#0e6b4f]"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortBy ? sortBy : "Sort By"}
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#94a39b] transition-transform ${openFilter === "Sort By" ? "rotate-180" : ""}`}
              />
            </button>
            {openFilter === "Sort By" &&
              createPortal(
                <div
                  className="filter-dropdown-portal fixed w-56 bg-white rounded-xl border border-[#e6ede9] shadow-xl p-2 z-[999] text-left"
                  style={{
                    top: dropdownPosition.top,
                    left: Math.min(dropdownPosition.left, window.innerWidth - 234),
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        setSortBy(sortBy === option ? null : option);
                        setOpenFilter(null);
                      }}
                      className={`w-full text-left flex items-center justify-between gap-2 py-2 px-3 text-sm rounded-md hover:bg-[#f4faf7] ${
                        sortBy === option
                          ? "text-[#0e6b4f] font-semibold"
                          : "text-[#16241f]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>,
                document.body,
              )}
          </div>
        </div>
      </section>

      {/* --- EXPERTS GRID --- */}
      <section className="max-w-[1180px] w-full mx-auto mt-9 grid grid-cols-1 md:grid-cols-2 gap-6">
        {showSkeletons ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-[#e6ede9] rounded-[18px] p-5 min-h-[220px] animate-pulse bg-[#f4faf7]"
            >
              <div className="w-[92px] h-[92px] bg-gray-200 rounded-[13px] mb-4" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => {
            const ratingSeed = (typeof doc.id === "number" ? doc.id : doc.id.toString().length) % 10;
            const rating = (4.5 + ratingSeed / 20).toFixed(1); // 4.5 - 4.9
            const reviewCount = 40 + ratingSeed * 17;
            const isOnline = doc.sessionTypes.includes("Online");
            const isInPerson = doc.sessionTypes.includes("In-person");

            return (
              <div
                key={doc.id}
                className="border border-[#e6ede9] rounded-[18px] p-[22px] shadow-[0_1px_2px_rgba(12,59,46,0.04),0_8px_24px_-8px_rgba(12,59,46,0.10)] bg-white hover:shadow-[0_4px_8px_rgba(12,59,46,.05),0_16px_32px_-10px_rgba(12,59,46,.16)] hover:-translate-y-0.5 hover:border-[#e1f4ec] transition-all"
              >
                <div className="grid grid-cols-[92px_1fr] sm:grid-cols-[92px_1fr_180px] gap-[18px]">
                  <div className="relative">
                    <span className="absolute -top-1 -left-1 w-[11px] h-[11px] rounded-full bg-[#27b673] border-[2.5px] border-white z-10" />
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-[92px] h-[92px] rounded-[13px] object-cover block"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="m-0 mb-[3px] text-[16.5px] font-bold text-[#16241f] flex items-center gap-1.5">
                      {doc.name}
                      <BadgeCheck className="w-[15px] h-[15px] text-[#0e6b4f]" />
                    </h3>
                    <div className="text-[#0e6b4f] text-[12.5px] font-bold mb-1.5">
                      {doc.designation}
                    </div>
                    <div className="flex items-center gap-3.5 text-[12.5px] text-[#3a463f] mb-2 flex-wrap font-semibold">
                      <span className="flex items-center gap-1">
                        <Star className="w-[13px] h-[13px] fill-[#f5b400] text-[#f5b400]" />
                        {rating} ({reviewCount})
                      </span>
                      <span className="flex items-center gap-1 text-[#637268] font-medium">
                        <MapPin className="w-[13px] h-[13px]" />
                        {doc.location}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-[#637268] mb-1.5 flex-wrap font-medium">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-[13px] h-[13px] text-[#138158]" />
                        {doc.experience} Experience
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-[13px] h-[13px] text-[#138158]" />
                        {doc.price.replace("/session", "")} for 50 mins
                      </div>
                    </div>
                    <div className="text-xs text-[#637268] mb-1.5 font-medium">
                      <span className="font-bold text-[#16241f]">Languages:</span>{" "}
                      {doc.language.join(", ")}
                    </div>
                    <div className="text-[11px] text-[#94a39b] mb-2 mt-2 font-bold tracking-wide uppercase">
                      Expertise
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {doc.expertise.slice(0, 4).map((ex, i) => (
                        <span
                          key={i}
                          className="bg-[#f4faf7] text-[#0e6b4f] text-[11.5px] font-semibold px-2.5 py-1 rounded-[7px] border border-[#e1f4ec]"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex flex-row sm:flex-col gap-2 items-stretch border-t sm:border-t-0 sm:border-l border-[#eef4f1] pt-3.5 sm:pt-0 sm:pl-[18px] mt-1 sm:mt-0">
                    <div className="text-[11px] font-bold text-[#0e6b4f] uppercase tracking-wide hidden sm:block">
                      Available {isOnline ? "Online" : "In-person"}
                    </div>
                    <div
                      className={`flex-1 sm:flex-none flex items-center gap-1.5 text-[12.5px] font-semibold rounded-lg px-2.5 py-1.5 border ${
                        isOnline
                          ? "border-[#bfe9d8] bg-[#e9f9f2] text-[#0e6b4f]"
                          : "border-[#e6ede9] text-[#94a39b]"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      Online
                    </div>
                    <div
                      className={`flex-1 sm:flex-none flex items-center gap-1.5 text-[12.5px] font-semibold rounded-lg px-2.5 py-1.5 border ${
                        isInPerson
                          ? "border-[#bfe9d8] bg-[#e9f9f2] text-[#0e6b4f]"
                          : "border-[#e6ede9] text-[#94a39b]"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      In-person
                    </div>
                    <div className="hidden sm:flex items-start gap-1.5 text-[12.5px] mt-2">
                      <CalendarClock className="w-3.5 h-3.5 text-[#16241f] mt-0.5" />
                      <div>
                        <div className="font-bold text-[#16241f]">Next Available</div>
                        <div className="text-[#0e6b4f] font-semibold">Today, 4:30 PM</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-[18px] border-t border-[#eef4f1]">
                  <button
                    onClick={() => setSelectedProfile(doc)}
                    className="flex-1 justify-center text-xs px-3 py-3 rounded-[9px] border border-[#e6ede9] bg-white font-bold text-[#16241f] hover:border-[#138158] hover:text-[#0e6b4f] transition-colors"
                  >
                    VIEW PROFILE
                  </button>
                  <button
                    onClick={() => navigate(`/book-appointment/${doc.id}`)}
                    className="flex-1 justify-center text-xs px-3 py-3 rounded-[9px] bg-[#0e6b4f] text-white font-bold hover:bg-[#138158] transition-colors"
                  >
                    BOOK APPOINTMENT
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-[#637268] text-lg">
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
              className="mt-4 px-6 py-2 bg-[#0e6b4f] text-white rounded-full hover:bg-[#138158] transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* --- CARE BAR --- */}
      <div className="max-w-[1180px] mx-auto mt-8 mb-[70px] py-6 px-6 rounded-[20px] flex items-center justify-between flex-wrap gap-4 bg-[#eaf6f1]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0e6b4f] flex-shrink-0">
            <Headphones className="w-[21px] h-[21px]" />
          </div>
          <div>
            <h4 className="m-0 mb-0.5 text-[15.5px] font-bold text-[#16241f]">
              Need help finding the right expert?
            </h4>
            <p className="m-0 text-[13px] text-[#637268]">
              Our care team is here to assist you.
            </p>
          </div>
        </div>
        <button
          onClick={() => window.open("https://wa.me/919083335000", "_blank", "noopener,noreferrer")}
          className="flex items-center gap-2.5 rounded-full pl-2 pr-6 py-2 text-[12.5px] font-bold text-[#0e6b4f] bg-white shadow-[0_2px_8px_rgba(12,59,46,0.08)] hover:shadow-[0_4px_14px_rgba(12,59,46,0.14)] transition-shadow"
        >
          <span className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white flex-shrink-0 transition-all duration-300">
            <MessageCircle className="w-4 h-4" />
          </span>
          TALK TO OUR CARE TEAM
        </button>
      </div>

      {/* --- TESTIMONIALS --- */}
      <section className="bg-[#eef8f3] py-16 text-center">
        <div className="text-xs font-bold text-[#0e6b4f] tracking-wide uppercase mb-2.5">
          Client Stories
        </div>
        <h2 className="text-[#0a2e23] text-[28px] md:text-[30px] mb-9 font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          What Our Clients Say
        </h2>
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 text-left shadow-[0_1px_2px_rgba(12,59,46,0.04),0_8px_24px_-8px_rgba(12,59,46,0.10)] hover:-translate-y-1 transition-transform"
            >
              <Quote className="w-6 h-6 mb-3 text-[#e1f4ec]" />
              <p className="italic text-[#37433d] text-[14.5px] leading-relaxed mb-4">
                {t.quote}
              </p>
              <div className="font-bold text-[13.5px] text-[#16241f]">
                — {t.author}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- COMPLIANCE --- */}
      <section className="py-16 text-center">
        <h2 className="text-[#0a2e23] text-[25px] mb-9 font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Mibo Is Compliant With
        </h2>
        <div className="flex justify-center items-center gap-16 flex-wrap">
          <div className="flex items-center justify-center h-14">
            <img src={iso} alt="ISO" className="h-full w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center h-14">
            <img src={hipaa} alt="HIPAA" className="h-full w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center h-14">
            <img src={gdpr} alt="GDPR" className="h-full w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="max-w-[1180px] mx-auto mb-16 p-10 border border-[#e6ede9] rounded-[20px] grid grid-cols-2 md:grid-cols-4 gap-5 text-center shadow-sm">
        <div className="flex flex-col items-center gap-2.5 px-2.5">
          <div className="w-12 h-12 rounded-full bg-[#e1f4ec] flex items-center justify-center text-[#0e6b4f]">
            <Users className="w-[21px] h-[21px]" />
          </div>
          <h3 className="m-0 text-[28px] text-[#0e6b4f] font-extrabold tracking-tight">200+</h3>
          <p className="m-0 text-[13px] text-[#637268] max-w-[170px] font-medium leading-snug">
            in-house psychologists &amp; psychiatrists
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5 px-2.5">
          <div className="w-12 h-12 rounded-full bg-[#e1f4ec] flex items-center justify-center text-[#0e6b4f]">
            <ClipboardList className="w-[21px] h-[21px]" />
          </div>
          <h3 className="m-0 text-[28px] text-[#0e6b4f] font-extrabold tracking-tight">1 lac+</h3>
          <p className="m-0 text-[13px] text-[#637268] max-w-[170px] font-medium leading-snug">
            therapy and psychiatry sessions conducted in 2024
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5 px-2.5">
          <div className="w-12 h-12 rounded-full bg-[#eaf0fd] flex items-center justify-center text-[#3b5fe0]">
            <Languages className="w-[21px] h-[21px]" />
          </div>
          <h3 className="m-0 text-[28px] text-[#3b5fe0] font-extrabold tracking-tight">18</h3>
          <p className="m-0 text-[13px] text-[#637268] max-w-[170px] font-medium leading-snug">
            languages
          </p>
        </div>
        <div className="flex flex-col items-center gap-2.5 px-2.5">
          <div className="w-12 h-12 rounded-full bg-[#e1f4ec] flex items-center justify-center text-[#0e6b4f]">
            <MapPin className="w-[21px] h-[21px]" />
          </div>
          <h3 className="m-0 text-[28px] text-[#0e6b4f] font-extrabold tracking-tight">8</h3>
          <p className="m-0 text-[13px] text-[#637268] max-w-[170px] font-medium leading-snug">
            centers in Bengaluru, Mumbai, and Delhi NCR
          </p>
        </div>
      </section>

      {/* --- CONTACT BANNER --- */}
      <div className="bg-gradient-to-br from-[#0a2e23] to-[#281a5e] text-white text-center py-7 text-[14.5px] font-medium">
        If you didn't find what you were looking for, please reach out to us
        at{" "}
        <a
          href="mailto:support@mibohealth.com"
          className="text-[#8fe0c2] font-bold underline underline-offset-2"
        >
          support@mibohealth.com
        </a>{" "}
        or call{" "}
        <a
          href="tel:+912071171501"
          className="text-[#8fe0c2] font-bold underline underline-offset-2"
        >
          +91 20711 71501
        </a>
        . We're here for you — for anything you might need.
      </div>

      {/* --- FOOTER --- */}
      <ExpertsFooter />

      {/* --- VIEW PROFILE MODAL --- */}
      {selectedProfile &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
            onMouseDown={() => setSelectedProfile(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-[560px] w-full max-h-[85vh] overflow-y-auto p-7 relative shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProfile(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#637268] hover:bg-[#f4faf7] hover:text-[#16241f] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="w-20 h-20 rounded-[14px] object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.png";
                  }}
                />
                <div>
                  <h3 className="m-0 mb-1 text-[19px] font-bold text-[#16241f] flex items-center gap-1.5">
                    {selectedProfile.name}
                    <BadgeCheck className="w-4 h-4 text-[#0e6b4f]" />
                  </h3>
                  <div className="text-[#0e6b4f] text-[13.5px] font-bold mb-1">
                    {selectedProfile.designation}
                  </div>
                  <div className="flex items-center gap-1 text-[12.5px] text-[#637268] font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedProfile.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#f4faf7] rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Experience
                  </div>
                  <div className="text-[14px] font-bold text-[#16241f]">
                    {selectedProfile.experience}
                  </div>
                </div>
                <div className="bg-[#f4faf7] rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Fee
                  </div>
                  <div className="text-[14px] font-bold text-[#16241f]">
                    {selectedProfile.price.replace("/session", "")} / 50 mins
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1.5">
                  Qualification
                </div>
                <div className="text-[13.5px] text-[#37433d] font-medium">
                  {selectedProfile.qualification}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  Languages
                </div>
                <div className="text-[13.5px] text-[#37433d] font-medium">
                  {selectedProfile.language.join(", ")}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-2">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Areas of Expertise
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedProfile.expertise.map((ex, i) => (
                    <span
                      key={i}
                      className="bg-[#f4faf7] text-[#0e6b4f] text-[12px] font-semibold px-2.5 py-1 rounded-[7px] border border-[#e1f4ec]"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1.5">
                  Session Types
                </div>
                <div className="text-[13.5px] text-[#37433d] font-medium">
                  {selectedProfile.sessionTypes}
                </div>
              </div>

              <button
                onClick={() => {
                  const id = selectedProfile.id;
                  setSelectedProfile(null);
                  navigate(`/book-appointment/${id}`);
                }}
                className="w-full justify-center text-xs px-3 py-3.5 rounded-[9px] bg-[#0e6b4f] text-white font-bold hover:bg-[#138158] transition-colors"
              >
                BOOK APPOINTMENT
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}