// src/pages/Landing/PsychiatristFilterBar.tsx
//
// Filter + sort bar for the "Our Psychiatrists" listing. Visually and
// behaviorally mirrors the filter bar on the Experts page (Location,
// Expertise, Languages, Price, Gender, Clear All, Sort By) so both listings
// feel identical. It is purely presentational/controlled: the parent owns
// the selected values and does the actual filtering/sorting.
//
// Kept as its own component (rather than importing from ExpertsPage, where
// this UI is defined inline) so the Experts page is left untouched.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpDown,
  ChevronDown,
  Globe,
  MapPin,
  RotateCcw,
  Star,
  Tag,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared definitions (identical values to ExpertsPage so behavior matches)
// ---------------------------------------------------------------------------

export type FilterKey =
  | "Location"
  | "Expertise"
  | "Language"
  | "Price"
  | "Gender";

export type SelectedFilters = Record<FilterKey, string[]>;

export const EMPTY_FILTERS: SelectedFilters = {
  Location: [],
  Expertise: [],
  Language: [],
  Price: [],
  Gender: [],
};

export const SORT_OPTIONS = [
  "Price: Low to High",
  "Price: High to Low",
  "Experience: High to Low",
  "Name: A-Z",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

// Fixed price bands rather than one option per exact fee — fees vary
// continuously from the backend, so bucketing gives a usable filter.
export const PRICE_BANDS: { label: string; test: (price: number) => boolean }[] =
  [
    { label: "Under ₹1,000", test: (p) => p < 1000 },
    { label: "₹1,000 - ₹2,000", test: (p) => p >= 1000 && p <= 2000 },
    { label: "₹2,000 - ₹3,000", test: (p) => p > 2000 && p <= 3000 },
    { label: "Above ₹3,000", test: (p) => p > 3000 },
  ];

export const LOCATION_OPTIONS = ["Bangalore", "Kochi", "Mumbai"];
export const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Kannada",
  "Malayalam",
  "Tamil",
  "Telugu",
  "Marathi",
];
export const GENDER_OPTIONS = ["Male", "Female", "Other"];

// Visible pill label -> key used in the selected-filters state
const PILLS: { label: string; key: FilterKey; icon: LucideIcon }[] = [
  { label: "Location", key: "Location", icon: MapPin },
  { label: "Expertise", key: "Expertise", icon: Star },
  { label: "Languages", key: "Language", icon: Globe },
  { label: "Price", key: "Price", icon: Tag },
  { label: "Gender", key: "Gender", icon: User },
];

const SORT_MENU_ID = "Sort By";
const DROPDOWN_WIDTH = 256;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface PsychiatristFilterBarProps {
  /** Options per filter. Expertise is supplied by the parent (real data). */
  options: Record<FilterKey, string[]>;
  selected: SelectedFilters;
  sortBy: SortOption | null;
  onToggle: (key: FilterKey, value: string) => void;
  onSortChange: (sort: SortOption | null) => void;
  onClearAll: () => void;
}

export default function PsychiatristFilterBar({
  options,
  selected,
  sortBy,
  onToggle,
  onSortChange,
  onClearAll,
}: PsychiatristFilterBarProps) {
  // Label of the open menu ("Location", ..., or "Sort By"), or null.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: DROPDOWN_WIDTH,
  });

  const barRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const computePosition = (label: string) => {
    const btn = buttonRefs.current[label];
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const width = Math.min(DROPDOWN_WIDTH, viewportWidth - 20);
    let left = rect.left;
    if (left + width > viewportWidth - 10) left = viewportWidth - width - 10;
    if (left < 10) left = 10;
    return { top: rect.bottom + 8, left, width };
  };

  const toggleMenu = (label: string) => {
    if (openMenu === label) {
      setOpenMenu(null);
      return;
    }
    const next = computePosition(label);
    if (next) setPosition(next);
    setOpenMenu(label);
  };

  // Close when clicking outside the bar and its (portaled) dropdown.
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".psy-filter-dropdown")) return;
      if (barRef.current && !barRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Keep the open dropdown anchored to its button on scroll/resize.
  useEffect(() => {
    if (!openMenu) return;
    const reposition = () => {
      const next = computePosition(openMenu);
      if (next) setPosition(next);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [openMenu]);

  const handleClearAll = () => {
    onClearAll();
    setOpenMenu(null);
  };

  return (
    <div className="pb-6 sm:pb-8 text-center">
      <div
        ref={barRef}
        className="relative flex md:inline-flex items-center flex-nowrap md:flex-wrap justify-start md:justify-center gap-x-4 sm:gap-x-8 md:gap-x-10 gap-y-3 mx-auto px-4 sm:px-8 py-3 sm:py-3.5 border border-[#e6ede9] rounded-2xl md:rounded-full bg-white shadow-sm max-w-full md:max-w-[95vw] overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-4 sm:gap-6 flex-nowrap md:flex-wrap shrink-0">
          {PILLS.map(({ label, key, icon: Icon }) => {
            const activeCount = selected[key].length;
            const isOpen = openMenu === label;

            return (
              <div key={label} className="relative">
                <button
                  type="button"
                  ref={(el) => void (buttonRefs.current[label] = el)}
                  onClick={() => toggleMenu(label)}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  className={`flex items-center gap-1.5 text-[12.5px] sm:text-[13.5px] font-semibold whitespace-nowrap transition-colors py-2 -my-2 min-h-[36px] cursor-pointer ${
                    activeCount > 0
                      ? "text-[#0e6b4f]"
                      : "text-[#3a463f] hover:text-[#0e6b4f]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#0e6b4f]" />
                  {label}
                  {activeCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#0e6b4f] text-white rounded-full text-[10px] font-bold">
                      {activeCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#94a39b] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen &&
                  createPortal(
                    <div
                      className="psy-filter-dropdown fixed max-h-72 overflow-y-auto bg-white rounded-xl border border-[#e6ede9] shadow-xl p-3 z-[999] text-left"
                      style={{
                        top: position.top,
                        left: position.left,
                        width: position.width,
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {options[key].length === 0 ? (
                        <p className="py-1.5 px-2 text-sm text-[#637268]">
                          No options available
                        </p>
                      ) : (
                        options[key].map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 py-1.5 px-2 text-sm text-[#16241f] hover:bg-[#f4faf7] rounded-md cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="accent-[#0e6b4f] cursor-pointer"
                              checked={selected[key].includes(option)}
                              onChange={() => onToggle(key, option)}
                            />
                            {option}
                          </label>
                        ))
                      )}
                    </div>,
                    document.body,
                  )}
              </div>
            );
          })}
        </div>

        <div className="w-px h-4 bg-[#e6ede9] shrink-0" />

        <div className="flex items-center gap-4 sm:gap-5 flex-nowrap md:flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-[12.5px] sm:text-[13.5px] font-semibold whitespace-nowrap text-[#3a463f] cursor-pointer hover:text-[#0e6b4f] transition-colors py-2 -my-2 min-h-[36px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>

          <button
            type="button"
            ref={(el) => void (buttonRefs.current[SORT_MENU_ID] = el)}
            onClick={() => toggleMenu(SORT_MENU_ID)}
            aria-haspopup="listbox"
            aria-expanded={openMenu === SORT_MENU_ID}
            className={`flex items-center gap-1.5 text-[12.5px] sm:text-[13.5px] font-semibold whitespace-nowrap transition-colors cursor-pointer py-2 -my-2 min-h-[36px] ${
              sortBy ? "text-[#0e6b4f]" : "text-[#3a463f] hover:text-[#0e6b4f]"
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy ?? "Sort By"}
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#94a39b] transition-transform ${
                openMenu === SORT_MENU_ID ? "rotate-180" : ""
              }`}
            />
          </button>

          {openMenu === SORT_MENU_ID &&
            createPortal(
              <div
                className="psy-filter-dropdown fixed w-56 max-w-[calc(100vw-20px)] bg-white rounded-xl border border-[#e6ede9] shadow-xl p-2 z-[999] text-left"
                style={{
                  top: position.top,
                  left: Math.max(
                    10,
                    Math.min(position.left, window.innerWidth - 234),
                  ),
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => {
                      onSortChange(sortBy === option ? null : option);
                      setOpenMenu(null);
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
    </div>
  );
}