// src/pages/Landing/PsychiatristExpertListing.tsx
//
// Backend-driven "Our Psychiatrists" listing (profile cards, filter toolbar,
// sorting, pagination, View Profile modal, Book Appointment, Share).
//
// Extracted verbatim from PsychiatristLanding so the Psychiatrist page and
// the city landing pages (e.g. /bengaluru) render ONE implementation.
// Defaults reproduce the Psychiatrist page's original behaviour exactly;
// city pages opt in via props:
//
//   defaultLocation        Location pre-selected on load (default "Bangalore").
//   requireDefaultLocation City page mode: the default location is never
//                          dropped on load, and "Clear All" restores it
//                          instead of clearing every location.
//   serverSideLocation     Send the selected city's centreId(s) with the
//                          /users/clinicians request (and refetch when the
//                          Location filter changes) instead of only
//                          filtering in the browser.
//   viewAllLink            Target of the "View All Experts" button.

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Briefcase,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Eye,
  IndianRupee,
  Languages,
  MapPin,
  Share2,
  Star,
  User,
  Video,
  X,
} from "lucide-react";

import clinicianService from "../../services/clinicianService";
import centreService from "../../services/centreService";
import { isPsychiatrist } from "../../utils/isPsychiatrist";
import type { Clinician } from "../../types";
import { EXPERT_LISTING_SECTION_ID } from "../../hooks/useScrollToExpertListing";
import ExpertiseMarquee from "../Experts/Components/ExpertiseMarquee";
import ExpertMedia from "../Experts/Components/ExpertMedia";
import PsychiatristFilterBar, {
  EMPTY_FILTERS,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  LOCATION_OPTIONS,
  PRICE_BANDS,
} from "./PsychiatristFilterBar";
import type {
  FilterKey,
  SelectedFilters,
  SortOption,
} from "./PsychiatristFilterBar";

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

/** Normalizes a centre's `city` value to the labels used by the Location filter. */
function normalizeCity(raw: string | undefined): string | null {
  const v = raw?.toLowerCase().trim();
  if (!v) return null;
  if (v === "bangalore" || v === "banglore" || v === "bengaluru") return "Bangalore";
  if (v === "kochi" || v === "cochin") return "Kochi";
  if (v === "mumbai" || v === "bombay") return "Mumbai";
  return null;
}

/**
 * `cityByCentreId` (centre id -> city) is the authoritative source, joined on
 * the clinician's primaryCentreId exactly like ExpertsPage. When it isn't
 * available (or has no match) we fall back to the centre-name heuristic.
 */
function fromClinician(
  doc: Clinician,
  cityByCentreId?: Map<string, string>,
): DisplayDoctor {
  const years = doc.yearsOfExperience || 0;
  const joinedCity =
    doc.primaryCentreId !== undefined && doc.primaryCentreId !== null
      ? cityByCentreId?.get(String(doc.primaryCentreId))
      : undefined;
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
    location: joinedCity ?? resolveCityFromCentreName(doc.primaryCentreName),
    gender: doc.gender ?? null,
    price: `₹${doc.consultationFee || 0}/session`,
    sessionTypes: getSessionTypes(doc.consultationModes),
  };
}

/** Normalizes a Clinician's specialization/expertise/qualification fields,
 * which the backend may return as either a string or a string array. */
function toList(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

/** First number in a price string like "₹1900/session" (decimal-safe). */
const parsePrice = (price: string): number => {
  const match = price.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

// Sample profiles are disabled; the fallback is intentionally empty. No
// hardcoded/dummy experts are ever rendered.
const SAMPLE_FALLBACK: DisplayDoctor[] = [];

// Landing pages show every matching expert in one continuous list (no
// pagination), so a single request asks for a limit large enough to cover them.
const EXPERTS_PAGE_SIZE = 100;

// Used only when one city maps to several centres and the per-centre
// responses must be merged client-side (no single server page exists).
const MERGE_FETCH_LIMIT = 100;

const DEFAULT_LOCATION_FALLBACK = "Bangalore";

export interface PsychiatristExpertListingProps {
  defaultLocation?: string;
  requireDefaultLocation?: boolean;
  serverSideLocation?: boolean;
  viewAllLink?: string;
  /** Router state sent with `viewAllLink` (e.g. preselected location). */
  viewAllState?: { location?: string; specialization?: string };
  /** false = list psychologists AND psychiatrists (city landing pages). */
  psychiatristsOnly?: boolean;
  title?: string;
  subtitle?: string;
}

const PsychiatristExpertListing = ({
  defaultLocation = DEFAULT_LOCATION_FALLBACK,
  requireDefaultLocation = false,
  serverSideLocation = false,
  viewAllLink = "/experts",
  viewAllState = { location: "Bangalore", specialization: "Psychiatrist" },
  psychiatristsOnly = true,
  title = "Our Psychiatrists",
  subtitle = "Compassionate professionals ready to support your mental well-being.",
}: PsychiatristExpertListingProps) => {
  const noun = psychiatristsOnly ? "psychiatrists" : "experts";
  const navigate = useNavigate();

  const [displayDoctors, setDisplayDoctors] = useState<DisplayDoctor[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [expertsPage, setExpertsPage] = useState(1);
  const hasLoadedRef = useRef(false);
  const [expertsPagination, setExpertsPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const defaultFilters: SelectedFilters = {
    ...EMPTY_FILTERS,
    Location: [defaultLocation],
  };
  const [filters, setFilters] = useState<SelectedFilters>(defaultFilters);
  const defaultLocationCheckedRef = useRef(false);
  const [sortBy, setSortBy] = useState<SortOption | null>(null);

  const cityByCentreIdRef = useRef<Map<string, string> | null>(null);

  const [selectedProfile, setSelectedProfile] = useState<DisplayDoctor | null>(
    null,
  );
  const [copiedDoctorId, setCopiedDoctorId] = useState<string | number | null>(
    null,
  );

  const openProfile = (doc: DisplayDoctor) => setSelectedProfile(doc);
  const closeProfile = () => setSelectedProfile(null);

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

  const getCityByCentreId = async (): Promise<Map<string, string> | undefined> => {
    if (cityByCentreIdRef.current) return cityByCentreIdRef.current;
    try {
      const centres = await centreService.getCentres();
      const map = new Map<string, string>();
      centres.forEach((centre) => {
        const city = normalizeCity(centre.city);
        if (city) map.set(String(centre.id), city);
      });
      cityByCentreIdRef.current = map;
      return map;
    } catch (error) {
      console.error("Failed to load centres for location filter:", error);
      return undefined;
    }
  };

  // Key of the selected locations; a change forces a refetch in
  // serverSideLocation mode.
  const locationKey = serverSideLocation ? filters.Location.join("|") : "";
  const lastLocationKeyRef = useRef(locationKey);

  /**
   * Fetches one page. In serverSideLocation mode, when exactly one city is
   * selected, the city's centreId(s) are sent to the backend:
   *  - one centre  -> a normal paged request (server pagination preserved,
   *                   page N always carries the same centreId);
   *  - many centres -> one request per centre, merged and de-duplicated,
   *                   paginated client-side (no single server page exists).
   * Otherwise (no/multiple cities selected, or centres unavailable) the
   * unfiltered list is requested and filtered in the browser as before.
   */
  const loadExpertsPage = async (
    pageNum: number,
    cancelledRef?: { current: boolean },
  ) => {
    try {
      setLoading(true);
      setFetchError(null);

      const cityByCentreId = await getCityByCentreId();

      let centreIds: number[] = [];
      if (serverSideLocation && filters.Location.length === 1 && cityByCentreId) {
        const wanted = filters.Location[0].toLowerCase();
        centreIds = Array.from(cityByCentreId.entries())
          .filter(([, city]) => city.toLowerCase() === wanted)
          .map(([id]) => Number(id))
          .filter((id) => !Number.isNaN(id));
      }

      type Result = { data: Clinician[]; pagination: typeof expertsPagination };
      const fetchFor = async (ids: number[]): Promise<Result> => {
        if (ids.length > 1) {
          const parts = await Promise.all(
            ids.map((centreId) =>
              clinicianService.getCliniciansPaged({
                page: 1,
                limit: MERGE_FETCH_LIMIT,
                centreId,
              }),
            ),
          );
          const seen = new Set<string>();
          const merged: Clinician[] = [];
          parts.forEach((p) =>
            p.data.forEach((c) => {
              if (!seen.has(String(c.id))) {
                seen.add(String(c.id));
                merged.push(c);
              }
            }),
          );
          return { data: merged, pagination: null };
        }
        return clinicianService.getCliniciansPaged({
          page: pageNum,
          limit: EXPERTS_PAGE_SIZE,
          ...(ids.length === 1 ? { centreId: ids[0] } : {}),
        });
      };
      const pick = (r: Result) =>
        r.pagination || !psychiatristsOnly ? r.data : r.data.filter(isPsychiatrist);

      let result = await fetchFor(centreIds);
      // If the centre-filtered request yields nothing (backend ignoring or
      // mis-handling centreId), retry exactly like the Psychiatrist page
      // does — unfiltered — and rely on the city filter applied below.
      if (centreIds.length > 0 && pick(result).length === 0) {
        result = await fetchFor([]);
      }
      if (cancelledRef?.current) return;

      const psychiatrists = pick(result);

      if (psychiatrists.length > 0) {
        hasLoadedRef.current = true;
        const mapped = psychiatrists.map((doc) =>
          fromClinician(doc, cityByCentreId),
        );
        setDisplayDoctors(mapped);
        // Psychiatrist page: drop the default location if nobody is in it.
        // City pages (requireDefaultLocation) keep it — an empty city must
        // show an empty state, never experts from other cities.
        if (!defaultLocationCheckedRef.current) {
          defaultLocationCheckedRef.current = true;
          if (
            !requireDefaultLocation &&
            !mapped.some((d) => d.location === defaultLocation)
          ) {
            setFilters((prev) => ({ ...prev, Location: [] }));
          }
        }
        setUsingFallback(false);
        setExpertsPagination(result.pagination);
      } else if (serverSideLocation) {
        // Genuine empty result for this location: show the empty state
        // (no sample data), keep the filter bar so the user can adjust.
        hasLoadedRef.current = true;
        defaultLocationCheckedRef.current = true;
        setDisplayDoctors([]);
        setUsingFallback(false);
        setExpertsPagination(null);
      } else {
        setDisplayDoctors(SAMPLE_FALLBACK);
        setUsingFallback(true);
        setExpertsPagination(null);
      }
    } catch (error) {
      console.error("Failed to load psychiatrists:", error);
      if (!cancelledRef?.current) {
        setDisplayDoctors(SAMPLE_FALLBACK);
        setUsingFallback(true);
        setExpertsPagination(null);
        setFetchError(
          `We couldn't load our ${noun} right now. Please try again.`,
        );
      }
    } finally {
      if (!cancelledRef?.current) setLoading(false);
    }
  };

  useEffect(() => {
    const cancelledRef = { current: false };
    const locationChanged = lastLocationKeyRef.current !== locationKey;
    lastLocationKeyRef.current = locationKey;
    if (locationChanged || !(hasLoadedRef.current && !expertsPagination)) {
      loadExpertsPage(expertsPage, cancelledRef);
    }
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expertsPage, locationKey]);

  const handleRetry = () => {
    loadExpertsPage(expertsPage);
  };

  const filterOptions = useMemo<Record<FilterKey, string[]>>(() => {
    const seen = new Map<string, string>();
    displayDoctors.forEach((doc) =>
      doc.expertise.forEach((item) => {
        const label = item.trim();
        if (label && !seen.has(label.toLowerCase())) {
          seen.set(label.toLowerCase(), label);
        }
      }),
    );
    return {
      Location: LOCATION_OPTIONS,
      Expertise: Array.from(seen.values()).sort((a, b) => a.localeCompare(b)),
      Language: LANGUAGE_OPTIONS,
      Price: PRICE_BANDS.map((band) => band.label),
      Gender: GENDER_OPTIONS,
    };
  }, [displayDoctors]);

  // On city pages the default location alone is not "an active filter".
  const hasActiveFilters = Object.entries(filters).some(([key, v]) => {
    if (key === "Location" && requireDefaultLocation) {
      return !(v.length === 1 && v[0] === defaultLocation);
    }
    return v.length > 0;
  });

  // Apply filters (AND across categories, OR within one) then sort.
  const filteredDoctors = useMemo(() => {
    if (usingFallback) return displayDoctors;
    let list = [...displayDoctors];

    if (filters.Location.length > 0) {
      list = list.filter((doc) =>
        filters.Location.some((l) => l.toLowerCase() === doc.location.toLowerCase()),
      );
    }
    if (filters.Expertise.length > 0) {
      list = list.filter((doc) =>
        filters.Expertise.some((wanted) =>
          doc.expertise.some(
            (e) => e.trim().toLowerCase() === wanted.toLowerCase(),
          ),
        ),
      );
    }
    if (filters.Language.length > 0) {
      list = list.filter((doc) =>
        filters.Language.some((wanted) =>
          doc.languages.some((l) => l.trim().toLowerCase() === wanted.toLowerCase()),
        ),
      );
    }
    if (filters.Price.length > 0) {
      list = list.filter((doc) => {
        const fee = parsePrice(doc.price);
        return filters.Price.some((label) =>
          PRICE_BANDS.find((b) => b.label === label)?.test(fee),
        );
      });
    }
    // Doctors with no gender on record never match a selected gender.
    if (filters.Gender.length > 0) {
      list = list.filter((doc) =>
        filters.Gender.includes(formatGender(doc.gender) || ""),
      );
    }

    if (sortBy) {
      list.sort((a, b) => {
        switch (sortBy) {
          case "Price: Low to High":
            return parsePrice(a.price) - parsePrice(b.price);
          case "Price: High to Low":
            return parsePrice(b.price) - parsePrice(a.price);
          case "Experience: High to Low":
            return b.yearsOfExperience - a.yearsOfExperience;
          case "Name: A-Z":
            return a.fullName.localeCompare(b.fullName);
          default:
            return 0;
        }
      });
    }
    return list;
  }, [displayDoctors, filters, sortBy, usingFallback]);

  // Changing a filter/sort returns to page 1. Skipped when the backend
  // paginates, where a page change means a new request.
  const resetToFirstPage = () => {
    if (!expertsPagination) setExpertsPage(1);
  };

  const handleToggleFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
    // A location change in serverSideLocation mode is a new request: go to
    // page 1 even when the backend paginates.
    if (key === "Location" && serverSideLocation) setExpertsPage(1);
    else resetToFirstPage();
  };

  const handleSortChange = (next: SortOption | null) => {
    setSortBy(next);
    resetToFirstPage();
  };

  const handleClearAll = () => {
    // City pages restore their default location; the Psychiatrist page
    // clears everything, as before.
    setFilters(requireDefaultLocation ? defaultFilters : EMPTY_FILTERS);
    setSortBy(null);
    if (serverSideLocation) setExpertsPage(1);
    else resetToFirstPage();
  };

  // All matching experts are shown in one continuous list (no pagination).
  const pagedDoctors = filteredDoctors;

  return (
    <>
        <section
          id={EXPERT_LISTING_SECTION_ID}
          className="scroll-mt-24 py-12 sm:py-16 md:py-20 bg-[#f7fbfa]"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="relative flex flex-col items-center text-center gap-4 mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#138158] mb-2">
                  MEET OUR EXPERTS
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212154] mb-2">
                  {title}
                </h2>
                <p className="text-miboText max-w-xl mx-auto">
                  {subtitle}
                </p>
              </div>
              <button
                onClick={() => navigate(viewAllLink, { state: viewAllState })}
                className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 border border-[#212154]/20 hover:border-[#138158] text-[#212154] font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full max-w-[240px] mx-auto sm:w-auto sm:max-w-none sm:mx-0"
              >
                View All Experts
                <span aria-hidden>→</span>
              </button>
            </div>

            {/* Filters + sort — same controls as the Experts page. Stays
                mounted while a page reloads; hidden until there is data. */}
            {(displayDoctors.length > 0 || serverSideLocation) && !usingFallback && (
              <PsychiatristFilterBar
                options={filterOptions}
                selected={filters}
                sortBy={sortBy}
                onToggle={handleToggleFilter}
                onSortChange={handleSortChange}
                onClearAll={handleClearAll}
              />
            )}

            {loading ? (
              <div className="flex justify-center items-center min-h-[420px]">
                <div className="w-10 h-10 border-4 border-[#138158]/20 border-t-[#138158] rounded-full animate-spin" />
              </div>
            ) : displayDoctors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-miboText text-base sm:text-lg">
                  {fetchError ??
                    (serverSideLocation && filters.Location.length > 0
                      ? `No ${noun} are available in ${filters.Location.join(", ")} right now.`
                      : `No ${noun} are available right now. Please check back soon.`)}
                </p>
                {fetchError && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-5 border border-[#212154]/20 hover:border-[#138158] text-[#212154] font-semibold px-5 py-2.5 rounded-full transition-colors"
                  >
                    Try again
                  </button>
                )}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-miboText text-base sm:text-lg">
                  No {noun} match your filters.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="mt-5 border border-[#212154]/20 hover:border-[#138158] text-[#212154] font-semibold px-5 py-2.5 rounded-full transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
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
                    const rating = (4.8 + ratingSeed / 20).toFixed(1);
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
                                {rating}
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
              </>
            )}
          </div>
        </section>

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
                    {selectedProfile.price.replace("/session", "")} / session
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
    </>
  );
};

export default PsychiatristExpertListing;