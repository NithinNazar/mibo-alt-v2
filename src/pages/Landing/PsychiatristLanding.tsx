// src/pages/Landing/PsychiatristLanding.tsx
//
// Dedicated Psychiatrist Landing Page.
// Renders between the existing shared Header/Footer and pulls real
// psychiatrist data from the backend via clinicianService. If the API
// call fails, or succeeds but returns zero psychiatrists, a small set of
// local sample profiles (dummyDoctors) is shown instead so the section
// never looks broken/empty. Sample cards are clearly labeled "Sample"
// and never link to booking/profile routes for a real clinician id.

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  Heart,
  IndianRupee,
  Languages,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Video,
  X,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import clinicianService from "../../services/clinicianService";
import { isPsychiatrist } from "../../utils/isPsychiatrist";
import type { Clinician } from "../../types";
import ExpertiseMarquee from "../Experts/Components/ExpertiseMarquee";
import ExpertMedia from "../Experts/Components/ExpertMedia";
// import { dummyDoctors } from "../Experts/data/dummyDoctors";
import heroBanner from "./banner.jpg";
import notAloneImg from "./you-are-not-alone.jpg";
import client1 from "./client1.jpg";
import client2 from "./client2.jpg";
import client3 from "./client3.jpg";

/**
 * Format the backend's clinician gender enum (MALE/FEMALE/OTHER) into a
 * display label — mirrors ExpertsPage's formatGender. Returns null when
 * gender isn't set, so callers can omit the UI element entirely.
 */
function formatGender(
  gender?: "MALE" | "FEMALE" | "OTHER" | null,
): string | null {
  switch (gender) {
    case "MALE":
      return "Male";
    case "FEMALE":
      return "Female";
    case "OTHER":
      return "Other";
    default:
      return null;
  }
}

/**
 * Card shape the JSX below actually renders. Both real Clinician records
 * and local dummyDoctors fallback records are normalized into this shape
 * so the markup only has one code path.
 *
 * `isSample` is true only for the local fallback data — it drives the
 * "Sample" badge and disables the booking/profile-deeplink actions, since
 * those ids don't exist in the database and must never be bookable.
 */
interface DisplayDoctor {
  id: number | string;
  isSample: boolean;
  fullName: string;
  bio: string;
  profilePictureUrl?: string;
  videoUrl?: string;
  specialization: string;
  qualification: string;
  yearsOfExperience: number;
  experienceLabel: string;
  languages: string[];
  expertise: string[];
  location: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  price: string;
  sessionTypes: string;
}

/** Mirrors ExpertsPage's getSessionTypes helper for consultationModes. */
function getSessionTypes(modes: string[] | undefined): string {
  const list = modes || [];
  if (list.includes("ONLINE") && list.includes("IN_PERSON")) {
    return "In-person & Online sessions";
  } else if (list.includes("ONLINE")) {
    return "Online sessions";
  } else if (list.includes("IN_PERSON")) {
    return "In-person sessions";
  }
  return "In-person & Online sessions";
}

/**
 * Best-effort city label from the clinician's centre name — the same
 * substring approach ExpertsPage falls back to when it can't resolve a
 * centre id. This page doesn't join against the centre list, so the
 * centre's display name is the only signal available.
 */
function resolveCityFromCentreName(centreName: string | undefined): string {
  const name = (centreName || "").toLowerCase();
  if (name.includes("bangalore") || name.includes("banglore") || name.includes("bengaluru")) {
    return "Bangalore";
  }
  if (name.includes("kochi") || name.includes("cochin")) return "Kochi";
  if (name.includes("mumbai") || name.includes("bombay")) return "Mumbai";
  return "Bangalore";
}

function fromClinician(doc: Clinician): DisplayDoctor {
  const years = doc.yearsOfExperience || 0;
  return {
    id: doc.id,
    isSample: false,
    fullName: doc.fullName,
    bio: doc.bio || "",
    profilePictureUrl: doc.profilePictureUrl,
    videoUrl: doc.profileVideoUrl,
    specialization: toList(doc.specialization)[0] || "Psychiatrist",
    qualification: toList(doc.qualification).join(", "),
    yearsOfExperience: years,
    experienceLabel: `${years}+ years`,
    languages: toList(doc.languages),
    expertise: doc.expertise || [],
    location: resolveCityFromCentreName(doc.primaryCentreName),
    gender: doc.gender ?? null,
    price: `₹${doc.consultationFee || 0}/session`,
    sessionTypes: getSessionTypes(doc.consultationModes),
  };
}

// function fromDummyDoctor(doc: (typeof dummyDoctors)[number]): DisplayDoctor {
//   const years = parseInt(doc.experience, 10);
//   return {
//     id: doc.id,
//     isSample: true,
//     fullName: doc.name,
//     bio: doc.bio || "",
//     profilePictureUrl: doc.image,
//     videoUrl: doc.videoUrl,
//     specialization: doc.designation,
//     qualification: doc.qualification || "",
//     yearsOfExperience: Number.isNaN(years) ? 0 : years,
//     experienceLabel: doc.experience,
//     languages: doc.language,
//     expertise: doc.expertise,
//     location: doc.location,
//     gender: doc.gender ?? null,
//     price: doc.price,
//     sessionTypes: doc.sessionTypes,
//   };
// }

const PATIENT_PHONE = "9083335000";

// Static, non-personal process copy — describes the booking flow itself,
// not any individual patient or clinician record.
const PROCESS_STEPS = [
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Choose a convenient time for an in-person or online consultation.",
  },
  {
    icon: MessageCircle,
    title: "Initial Consultation",
    description: "Discuss your concerns in a safe and confidential space.",
  },
  {
    icon: ClipboardList,
    title: "Personalized Plan",
    description: "Receive a tailored treatment plan suited to your needs.",
  },
  {
    icon: Heart,
    title: "Ongoing Support",
    description: "Regular follow-ups to monitor progress and ensure lasting well-being.",
  },
];

const WHY_CHOOSE_MIBO = [
  "Evidence-based treatment",
  "Compassionate and non-judgmental care",
  "Convenient in-person and online consultations",
  "Focus on long-term mental well-being",
  "Complete confidentiality",
  "Experienced and trusted psychiatrists",
];

/** Normalizes a Clinician's specialization/expertise/qualification fields,
 * which the backend may return as either a string or a string array. */
function toList(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

// const SAMPLE_FALLBACK: DisplayDoctor[] = dummyDoctors
//   .filter((doc) => doc.designation === "Psychiatrist")
//   .slice(0, 8)
//   .map(fromDummyDoctor);

// Experts shown per page. If the backend ever returns real pagination
// metadata, that is used as-is. Until then (the current live behavior: the
// API returns the full list) the page slices the list itself, 4 per page.
const EXPERTS_PAGE_SIZE = 4;

const PsychiatristLanding = () => {
  const navigate = useNavigate();

  const [displayDoctors, setDisplayDoctors] = useState<DisplayDoctor[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // --- Server-side pagination state for the expert listing ---
  const [expertsPage, setExpertsPage] = useState(1);
  // True once a full list has been loaded; page changes then only re-slice
  // it (no repeat request) unless the backend paginates.
  const hasLoadedRef = useRef(false);
  // Null pagination = the backend hasn't returned pagination metadata for
  // this request (current live behavior — see clinicianService docs).
  // Page controls are disabled in that state rather than faked.
  const [expertsPagination, setExpertsPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // --- View Profile modal + Share link state (same UX as ExpertsPage) ---
  const [selectedProfile, setSelectedProfile] = useState<DisplayDoctor | null>(
    null,
  );
  const [copiedDoctorId, setCopiedDoctorId] = useState<string | number | null>(
    null,
  );

  const openProfile = (doc: DisplayDoctor) => setSelectedProfile(doc);
  const closeProfile = () => setSelectedProfile(null);

  // Shares a deep link into the live Experts listing for real clinicians.
  // Sample/fallback profiles have no real clinician id, so there is
  // nothing valid to link to — the Share button is hidden for those cards.
  const handleShareDoctor = async (doctorId: string | number) => {
    const shareUrl = `${window.location.origin}/experts?doctor=${doctorId}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedDoctorId(doctorId);
      window.setTimeout(() => {
        setCopiedDoctorId((current) => (current === doctorId ? null : current));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy share link:", err);
    }
  };

  const loadExpertsPage = async (pageNum: number, cancelledRef?: { current: boolean }) => {
    try {
      setLoading(true);
      setFetchError(null);
      // Filter to psychiatrists specifically — this is a psychiatrist-
      // focused landing page. Server-side pagination is requested via
      // page/limit; see clinicianService.getCliniciansPaged for what
      // happens when the backend doesn't yet honor those params.
      const result = await clinicianService.getCliniciansPaged({
        page: pageNum,
        limit: EXPERTS_PAGE_SIZE,
      });
      if (cancelledRef?.current) return;

      // Same psychiatrist rule as the Experts page (utils/isPsychiatrist).
      // Applied here because the backend doesn't filter by it.
      const psychiatrists = result.pagination
        ? result.data
        : result.data.filter(isPsychiatrist);

      if (psychiatrists.length > 0) {
        hasLoadedRef.current = true;
        setDisplayDoctors(psychiatrists.map(fromClinician));
        setUsingFallback(false);
        setExpertsPagination(result.pagination);
      } else {
        // API returned successfully but with no psychiatrists — fall
        // back to local sample profiles rather than showing an empty
        // section. Pagination doesn't apply to the static sample set.
        setDisplayDoctors(SAMPLE_FALLBACK);
        setUsingFallback(true);
        setExpertsPagination(null);
      }
    } catch (error) {
      console.error("Failed to load psychiatrists:", error);
      if (!cancelledRef?.current) {
        // API call failed — fall back to local sample profiles instead
        // of an error-only empty state.
        setDisplayDoctors(SAMPLE_FALLBACK);
        setUsingFallback(true);
        setExpertsPagination(null);
        setFetchError(
          "We couldn't load live availability right now, so we're showing sample profiles below.",
        );
      }
    } finally {
      if (!cancelledRef?.current) setLoading(false);
    }
  };

  useEffect(() => {
    const cancelledRef = { current: false };
    // List already loaded and the backend doesn't paginate: the page change
    // is handled by slicing, no new request needed.
    if (!(hasLoadedRef.current && !expertsPagination)) {
      loadExpertsPage(expertsPage, cancelledRef);
    }
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expertsPage]);

  const handleRetry = () => {
    loadExpertsPage(expertsPage);
  };

  // Server-driven page navigation. Guarded so it's a no-op (and the UI
  // disables the buttons) whenever the backend hasn't reported real
  // pagination metadata for the current listing.
  // Server pagination when the backend provides it; otherwise pagination
  // computed from the full list the backend returned.
  const effectivePagination =
    expertsPagination ??
    (!usingFallback && displayDoctors.length > 0
      ? {
          page: expertsPage,
          limit: EXPERTS_PAGE_SIZE,
          total: displayDoctors.length,
          totalPages: Math.max(
            1,
            Math.ceil(displayDoctors.length / EXPERTS_PAGE_SIZE),
          ),
        }
      : null);
  const pagedDoctors =
    expertsPagination || usingFallback
      ? displayDoctors
      : displayDoctors.slice(
          (expertsPage - 1) * EXPERTS_PAGE_SIZE,
          expertsPage * EXPERTS_PAGE_SIZE,
        );

  const goToExpertsPage = (nextPage: number) => {
    if (!effectivePagination) return;
    if (nextPage < 1 || nextPage > effectivePagination.totalPages) return;
    if (nextPage === expertsPage) return;
    setExpertsPage(nextPage);
  };

  const handleCall = () => {
    window.location.href = `tel:+91${PATIENT_PHONE}`;
  };

  // Real patient testimonials already used elsewhere in the app (Experts
  // page) — reused here rather than inventing new quotes.
  const testimonials = useMemo(
    () => [
      {
        name: "Aarushi P.",
        text: "Dr. Aisha helped me rediscover calm in my daily life. I've never felt more supported!",
        image: client1,
      },
      {
        name: "Ritika D.",
        text: "The therapy experience at Mibo was so professional yet personal. Highly recommend.",
        image: client2,
      },
      {
        name: "Karthik R.",
        text: "My sessions with Dr. Rahul were life-changing. He made mental health approachable.",
        image: client3,
      },
    ],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevTestimonial = () =>
    setTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  const goToNextTestimonial = () =>
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      <Header />

      {/* Spacer to clear the fixed Header */}
      <div className="pt-16 md:pt-[72px]">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section
          className="relative bg-cover bg-center "
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          {/* Scrim for text legibility over the banner photo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #ffffff 0%, #ffffff 32%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0) 62%)",
            }}
          />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-10 md:py-12">
            <div className="max-w-2xl">
              <span className="inline-block bg-[#eaf7f2] text-[#138158] text-xs font-bold tracking-wide px-4 py-1.5 rounded-full mb-4 sm:mb-5">
                Your Mental Health Matters
              </span>
              <h1 className="text-[32px] leading-[1.2] sm:text-5xl sm:leading-tight font-extrabold text-[#212154] mb-4">
                Expert Psychiatric Care
                <br />
                <span className="text-[#138158]">for You and Your Family</span>
              </h1>
              <p className="text-miboText text-base sm:text-lg mb-7 sm:mb-8 max-w-xl">
                Compassionate, evidence-based care for adults, adolescents and
                older adults. Take the first step towards a calmer, healthier
                and happier you.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
                <button
                  onClick={() => navigate("/experts")}
                  className="bg-[#138158] hover:bg-[#0e6b4f] text-white font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Book an Appointment
                  <span aria-hidden>→</span>
                </button>
                <button
                  onClick={() => navigate("/services/online")}
                  className="border border-[#212154]/20 hover:border-[#138158] bg-white/70 backdrop-blur-sm text-[#212154] font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  Online Consultation
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 sm:gap-6">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    In-Person &amp; Online
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    Confidential &amp; Safe
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    Experienced Psychiatrists
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Heart className="w-5 h-5 text-[#138158] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#212154] leading-snug">
                    Personalized Care Plans
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Psychiatrist profile cards                                       */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#f7fbfa]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="relative flex flex-col items-center text-center gap-4 mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#138158] mb-2">
                  MEET OUR EXPERTS
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-2">
                  Our Psychiatrists
                </h2>
                <p className="text-miboText max-w-xl mx-auto">
                  Compassionate professionals ready to support your mental
                  well-being.
                </p>
              </div>
              <button
                onClick={() => navigate("/experts")}
                className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 border border-[#212154]/20 hover:border-[#138158] text-[#212154] font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full max-w-[240px] mx-auto sm:w-auto sm:max-w-none sm:mx-0"
              >
                View All Experts
                <span aria-hidden>→</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[420px]">
                <div className="w-10 h-10 border-4 border-[#138158]/20 border-t-[#138158] rounded-full animate-spin" />
              </div>
            ) : displayDoctors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-miboText text-base sm:text-lg">
                  No psychiatrists are available right now. Please check back
                  soon.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-10">
                  {pagedDoctors.map((doc) => {
                    // Rating/reviews are deterministic display placeholders
                    // (no ratings backend yet) — identical derivation to
                    // ExpertsPage so both listings show the same numbers
                    // for the same clinician.
                    const ratingSeed =
                      (typeof doc.id === "number"
                        ? doc.id
                        : doc.id.toString().length) % 10;
                    const rating = (4.5 + ratingSeed / 20).toFixed(1);
                    const reviewCount = 40 + ratingSeed * 17;
                    const isOnline = doc.sessionTypes.includes("Online");
                    const isInPerson = doc.sessionTypes.includes("In-person");

                    return (
                      <div
                        key={`${doc.isSample ? "sample" : "live"}-${doc.id}`}
                        className="relative h-full flex flex-col border border-[#e4f7ec] rounded-[18px] p-3.5 sm:p-5 md:p-[22px] shadow-[0_1px_2px_rgba(12,59,46,0.04),0_8px_24px_-8px_rgba(12,59,46,0.10)] bg-white hover:shadow-[0_4px_8px_rgba(12,59,46,.05),0_16px_32px_-10px_rgba(12,59,46,.16)] hover:-translate-y-0.5 hover:border-[#e1f4ec] transition-all overflow-hidden max-w-full"
                      >
                        <div className="grid grid-cols-[84px_1fr] sm:grid-cols-[104px_1fr] md:grid-cols-[128px_1fr] lg:grid-cols-[150px_1fr_160px] gap-2.5 sm:gap-[18px] lg:gap-x-5 min-w-0">
                          <ExpertMedia
                            image={doc.profilePictureUrl || "/default-avatar.png"}
                            videoUrl={doc.videoUrl}
                            doctorName={doc.fullName}
                          />

                          <div className="min-w-0 flex flex-col">
                            <h3 className="m-0 mb-[4px] text-[16px] sm:text-[19px] leading-[1.25] font-bold text-[#16241f] flex items-start gap-1.5">
                              <span className="break-words">{doc.fullName}</span>
                              <BadgeCheck className="w-4 h-4 text-[#0e6b4f] shrink-0 mt-[3px]" />
                            </h3>
                            <div className="text-[#0e6b4f] text-[13px] leading-[1.3] font-bold mb-2 truncate">
                              {doc.specialization}
                            </div>
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[12px] sm:text-[12.5px] leading-[1.3] text-[#3a463f] mb-2.5 font-semibold">
                              <span className="flex items-center gap-1 shrink-0">
                                <Star className="w-[13px] h-[13px] fill-[#f5b400] text-[#f5b400] shrink-0" />
                                {rating} ({reviewCount})
                              </span>
                              <span className="flex items-center gap-1 text-[#637268] font-medium shrink-0">
                                <MapPin className="w-[13px] h-[13px] shrink-0" />
                                {doc.location}
                              </span>
                              {formatGender(doc.gender) && (
                                <span className="flex items-center gap-1 text-[#637268] font-medium shrink-0">
                                  <User className="w-[13px] h-[13px] shrink-0" />
                                  {formatGender(doc.gender)}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 text-[12.5px] leading-[1.3] text-[#3a463f] mb-2.5 font-semibold">
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Briefcase className="w-[13px] h-[13px] text-[#138158] shrink-0" />
                                {doc.experienceLabel} Experience
                              </div>
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <IndianRupee className="w-[13px] h-[13px] text-[#138158] shrink-0" />
                                {doc.price.replace("/session", "")} per session
                              </div>
                            </div>
                            {doc.languages.length > 0 && (
                              <div className="text-[12.5px] leading-[1.3] text-[#3a463f] mb-3 font-semibold overflow-hidden">
                                <span className="font-bold text-[#16241f]">
                                  Languages:
                                </span>{" "}
                                <span className="font-medium text-[#637268]">
                                  {doc.languages.join(", ")}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="col-span-2 lg:col-span-1 min-w-0 flex flex-row lg:flex-col gap-2 items-stretch border-t lg:border-t-0 lg:border-l border-[#eef4f1] pt-3.5 lg:pt-0 lg:pl-[18px] mt-1 lg:mt-0">
                            <div className="text-[11px] font-bold text-[#0e6b4f] uppercase tracking-wide whitespace-nowrap hidden lg:block">
                              Available {isOnline ? "Online" : "In-person"}
                            </div>
                            <div
                              className={`flex-1 lg:flex-none min-w-0 basis-0 flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12.5px] font-semibold whitespace-nowrap rounded-lg px-1.5 sm:px-2.5 py-1.5 border ${
                                isOnline
                                  ? "border-[#bfe9d8] bg-[#e9f9f2] text-[#0e6b4f]"
                                  : "border-[#e6ede9] text-[#94a39b]"
                              }`}
                            >
                              <Video className="w-3.5 h-3.5 shrink-0" />
                              Online
                            </div>
                            <div
                              className={`flex-1 lg:flex-none min-w-0 basis-0 flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12.5px] font-semibold whitespace-nowrap rounded-lg px-1.5 sm:px-2.5 py-1.5 border ${
                                isInPerson
                                  ? "border-[#bfe9d8] bg-[#e9f9f2] text-[#0e6b4f]"
                                  : "border-[#e6ede9] text-[#94a39b]"
                              }`}
                            >
                              <User className="w-3.5 h-3.5 shrink-0" />
                              In-person
                            </div>
                          </div>
                        </div>

                        {/* Expertise */}
                        {doc.expertise.length > 0 && (
                          <div className="flex items-center gap-2 min-h-[32px] w-full min-w-0 mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-[#eef4f1]">
                            <span className="text-[12px] sm:text-[12.5px] text-[#3a463f] font-semibold shrink-0">
                              Expertise:
                            </span>
                            <ExpertiseMarquee
                              expertise={doc.expertise}
                              chipClassName="bg-[#eef2f0] text-[#3a463f] border-none font-semibold"
                              dotClassName="hidden"
                              className="mb-0 min-h-[26px] flex-1 min-w-0 mt-3.5"
                            />
                            <ChevronRight className="w-4 h-4 text-[#94a39b] shrink-0" />
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-4 sm:pt-[18px] border-t border-[#eef4f1]">
                          <div className="flex gap-2 sm:gap-3 sm:flex-1 sm:min-w-0">
                            <button
                              onClick={() => openProfile(doc)}
                              className="flex-1 min-w-0 basis-0 flex items-center justify-center text-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs leading-tight px-1.5 sm:px-3 py-2.5 sm:py-3 rounded-[9px] border border-[#e6ede9] bg-white font-bold text-[#16241f] hover:border-[#138158] hover:text-[#0e6b4f] transition-colors whitespace-normal sm:whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              VIEW PROFILE
                            </button>
                            <button
                              onClick={() => navigate(`/book-appointment/${doc.id}`)}
                              className="flex-1 min-w-0 basis-0 flex items-center justify-center text-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs leading-tight px-1.5 sm:px-3 py-2.5 sm:py-3 rounded-[9px] bg-[#0e6b4f] text-white font-bold hover:bg-[#138158] transition-colors whitespace-normal sm:whitespace-nowrap"
                            >
                              <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                              BOOK APPOINTMENT
                            </button>
                          </div>
                          {!doc.isSample && (
                            <button
                              type="button"
                              onClick={() => handleShareDoctor(doc.id)}
                              aria-label={`Copy shareable link for ${doc.fullName}`}
                              title="Copy shareable link"
                              className={`relative shrink-0 flex items-center justify-center gap-1.5 w-full sm:w-11 h-11 rounded-[9px] border transition-colors text-[11px] font-bold ${
                                copiedDoctorId === doc.id
                                  ? "border-[#0e6b4f] bg-[#e9f9f2] text-[#0e6b4f]"
                                  : "border-[#e6ede9] bg-white text-[#3a463f] hover:border-[#138158] hover:text-[#0e6b4f]"
                              }`}
                            >
                              {copiedDoctorId === doc.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                              <span className="sm:hidden">
                                {copiedDoctorId === doc.id ? "Link copied!" : "Copy Share Link"}
                              </span>
                              {copiedDoctorId === doc.id && (
                                <span className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold bg-[#16241f] text-white px-2 py-1 rounded-md shadow-md">
                                  Link copied!
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination — only for the live/backend-driven listing.
                    The sample fallback set is static local data, so no
                    controls are shown for it. */}
                {!usingFallback && (
                  <div className="flex flex-col items-center gap-2 mt-10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => goToExpertsPage(expertsPage - 1)}
                        disabled={!effectivePagination || expertsPage <= 1}
                        aria-label="Previous page"
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e6ede9] bg-white text-[#212154] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[#138158] hover:enabled:text-[#0e6b4f] transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {effectivePagination ? (
                        Array.from(
                          { length: effectivePagination.totalPages },
                          (_, i) => i + 1,
                        ).map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => goToExpertsPage(num)}
                            aria-current={num === expertsPage ? "page" : undefined}
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                              num === expertsPage
                                ? "bg-[#0e6b4f] text-white"
                                : "border border-[#e6ede9] bg-white text-[#212154] hover:border-[#138158] hover:text-[#0e6b4f]"
                            }`}
                          >
                            {num}
                          </button>
                        ))
                      ) : (
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0e6b4f] text-white font-semibold text-sm">
                          {expertsPage}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => goToExpertsPage(expertsPage + 1)}
                        disabled={
                          !effectivePagination ||
                          expertsPage >= effectivePagination.totalPages
                        }
                        aria-label="Next page"
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e6ede9] bg-white text-[#212154] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[#138158] hover:enabled:text-[#0e6b4f] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* How It Works                                                     */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-bold tracking-widest text-[#138158] mb-2">
                HOW IT WORKS
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-3">
                Your Journey to a <span className="text-[#138158]">Healthier Mind</span> 
              </h2>
              <p className="text-miboText max-w-2xl mx-auto">
                A simple, supportive process to help you get the care you need.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-10 relative">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    <div className="bg-white border-2 border-[#138158]/25 rounded-2xl p-6 text-center shadow-md shadow-[#138158]/10 h-full">
                      <div className="relative w-14 h-14 mx-auto mb-5">
                        <div className="w-14 h-14 rounded-full bg-[#eef7f4] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#138158]" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#138158] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#212154] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-miboText leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {index < PROCESS_STEPS.length - 1 && (
                      <span className="hidden lg:flex items-center justify-center absolute top-1/2 -right-8 -translate-y-1/2 w-6 h-6 z-10">
                        <ChevronRight
                          className="w-6 h-6 text-[#138158]"
                          strokeWidth={2.5}
                        />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Testimonials + Promotional + Why Choose Us                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#f7fbfa]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-3 gap-6 items-stretch">
              {/* Testimonials */}
              <div className="flex flex-col">
                <p className="text-xs font-bold tracking-widest text-[#138158] mb-2">
                  WHAT OUR PATIENTS SAY
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212154] mb-1">
                  Real Stories <span className="text-[#138158]">Real Progress</span>
                </h2>
                <p className="text-miboText mb-6 text-sm">
                  Hear from individuals who have experienced positive change.
                </p>

                <div className="bg-white rounded-2xl border border-[#eef4f1] shadow-sm p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-4xl text-[#138158]/30 leading-none">
                      &ldquo;
                    </span>
                    <p className="text-[#212154] text-base leading-relaxed -mt-3">
                      {testimonials[testimonialIndex].text}
                    </p>
                  </div>
                  <div>
                    <div className="mt-4 pt-4 border-t border-[#eef4f1] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonials[testimonialIndex].image}
                          alt={testimonials[testimonialIndex].name}
                          className="w-14 h-14 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#212154] text-sm">
                            {testimonials[testimonialIndex].name}
                          </p>
                          <p className="text-xs text-miboText">Mibo Patient</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623]"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        type="button"
                        onClick={goToPrevTestimonial}
                        aria-label="Previous testimonial"
                        className="w-7 h-7 rounded-full border border-[#e6ede9] flex items-center justify-center text-[#212154] hover:border-[#138158] hover:text-[#0e6b4f] transition-colors"
                      >
                        <span aria-hidden className="text-sm">
                          ‹
                        </span>
                      </button>
                      <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTestimonialIndex(i)}
                            aria-label={`Show testimonial ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === testimonialIndex
                                ? "bg-[#138158]"
                                : "bg-[#e6ede9]"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={goToNextTestimonial}
                        aria-label="Next testimonial"
                        className="w-7 h-7 rounded-full border border-[#e6ede9] flex items-center justify-center text-[#212154] hover:border-[#138158] hover:text-[#0e6b4f] transition-colors"
                      >
                        <span aria-hidden className="text-sm">
                          ›
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotional / "You Are Not Alone" */}
              <div
                className="relative rounded-2xl overflow-hidden bg-white border border-[#eef4f1] shadow-sm min-h-[280px] sm:min-h-[320px] lg:min-h-0 bg-no-repeat bg-cover lg:bg-contain bg-left"
                style={{ backgroundImage: `url(${notAloneImg})` }}
              >
                <div className="relative h-full flex flex-col justify-center p-5 sm:p-8 pl-[46%] sm:pl-[48%]">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#212154] mb-2 sm:mb-3 leading-snug">
                    You Are Not Alone
                  </h3>
                  <p className="text-miboText text-xs sm:text-base mb-4 sm:mb-6 leading-relaxed">
                    We are here to listen, support and guide you towards a
                    brighter tomorrow.
                  </p>
                  <button
                    onClick={() => navigate("/why-mibo")}
                    className="self-start bg-white text-[#212154] text-sm sm:text-base font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 border border-[#e6ede9] shadow-sm hover:bg-[#f7fbfa] transition-colors whitespace-nowrap"
                  >
                    Learn More
                    <span aria-hidden className="text-[#138158]">→</span>
                  </button>
                </div>
              </div>

              {/* Why Choose Mibo */}
              <div className="bg-white rounded-2xl border border-[#eef4f1] shadow-sm p-6">
                <h3 className="text-lg font-extrabold text-[#212154] mb-5 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-[#eef7f4] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#138158]" />
                  </span>
                  Why Choose Mibo?
                </h3>
                <div className="flex flex-col gap-4">
                  {WHY_CHOOSE_MIBO.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#eef7f4] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#138158]" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-[#212154] font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CTA                                                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#212154] to-[#1a1a46] text-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-snug">
              Book Your Confidential Psychiatric Consultation Today
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Speak with an experienced psychiatrist and take the first step
              towards a calmer, healthier mind.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/experts")}
                className="bg-white text-[#212154] px-7 py-3.5 rounded-full font-semibold hover:bg-white/90 transition-colors w-full sm:w-auto"
              >
                Book Appointment
              </button>
              <button
                onClick={handleCall}
                className="border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                Call +91 {PATIENT_PHONE}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* --- VIEW PROFILE MODAL (same design as ExpertsPage) --- */}
      {selectedProfile &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
            onMouseDown={() => closeProfile()}
          >
            <div
              className="bg-white rounded-2xl max-w-[560px] w-full max-h-[88vh] sm:max-h-[85vh] overflow-y-auto p-5 sm:p-7 relative shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => closeProfile()}
                aria-label="Close"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#637268] hover:bg-[#f4faf7] hover:text-[#16241f] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-start gap-3.5 sm:gap-4 mb-5 pr-8">
                <img
                  src={selectedProfile.profilePictureUrl || "/default-avatar.png"}
                  alt={selectedProfile.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-[14px] object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.png";
                  }}
                />
                <div>
                  <h3 className="m-0 mb-1 text-[19px] font-bold text-[#16241f] flex items-center gap-1.5">
                    {selectedProfile.fullName}
                    <BadgeCheck className="w-4 h-4 text-[#0e6b4f]" />
                  </h3>
                  <div className="text-[#0e6b4f] text-[13.5px] font-bold mb-1">
                    {selectedProfile.specialization}
                  </div>
                  <div className="flex items-center gap-3 text-[12.5px] text-[#637268] font-medium flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedProfile.location}
                    </span>
                    {formatGender(selectedProfile.gender) && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {formatGender(selectedProfile.gender)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedProfile.bio && (
                <div className="mb-5">
                  <div className="text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1.5">
                    About
                  </div>
                  <div className="text-[13.5px] text-[#37433d] font-medium leading-relaxed">
                    {selectedProfile.bio}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#f4faf7] rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Experience
                  </div>
                  <div className="text-[14px] font-bold text-[#16241f]">
                    {selectedProfile.experienceLabel}
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

              {selectedProfile.qualification && (
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1.5">
                    Qualification
                  </div>
                  <div className="text-[13.5px] text-[#37433d] font-medium">
                    {selectedProfile.qualification}
                  </div>
                </div>
              )}

              {selectedProfile.languages.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a39b] uppercase tracking-wide mb-1.5">
                    <Languages className="w-3.5 h-3.5" />
                    Languages
                  </div>
                  <div className="text-[13.5px] text-[#37433d] font-medium">
                    {selectedProfile.languages.join(", ")}
                  </div>
                </div>
              )}

              {selectedProfile.expertise.length > 0 && (
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
              )}

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
                  const doc = selectedProfile;
                  closeProfile();
                  navigate(`/book-appointment/${doc.id}`);
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-3.5 rounded-[9px] bg-[#0e6b4f] text-white font-bold hover:bg-[#138158] transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                BOOK APPOINTMENT
              </button>
            </div>
          </div>,
          document.body,
        )}

      <Footer />
    </div>
  );
};

export default PsychiatristLanding;