import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownProps {
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
  position: { top: number; left: number; width: number };
}

function Dropdown({ options, selected, onChange, position }: DropdownProps) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
        className="filter-dropdown-content absolute max-h-64 overflow-y-auto bg-white rounded-xl border border-[#a7c4f2]/50 shadow-2xl p-3 z-[9999]"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from closing it
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 py-1 px-2 text-sm text-[#034B44] hover:bg-[#e6f5f2] rounded-md cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent label clicks from bubbling
          >
            <input
              type="checkbox"
              className="accent-[#034B44] cursor-pointer"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              onClick={(e) => e.stopPropagation()} // Prevent checkbox clicks from bubbling
            />
            {option}
          </label>
        ))}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

interface FilterPillsProps {
  selectedFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

export default function FilterPills({
  selectedFilters,
  onFiltersChange,
}: FilterPillsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Dynamic dropdown options based on actual doctor data
  const dropdownOptions = {
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
    Language: ["English", "Hindi", "Kannada", "Malayalam", "Tamil", "Marathi"],
    Price: ["₹1600/session"],
  };

  const toggleDropdown = (key: string) => {
    if (openDropdown === key) {
      setOpenDropdown(null);
      return;
    }

    const btn = buttonRefs.current[key];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      let left = rect.left + window.scrollX;

      //  prevent overflow right
      const dropdownWidth = 288; // approx w-72
      const viewportWidth = window.innerWidth;
      if (left + dropdownWidth > viewportWidth - 10) {
        left = viewportWidth - dropdownWidth - 10; // shift left a bit
      }

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left,
        width: dropdownWidth,
      });

      setOpenDropdown(key);
    }
  };

  const handleCheckboxChange = (category: string, value: string) => {
    const current = selectedFilters[category] || [];
    const updated = {
      ...selectedFilters,
      [category]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    };
    onFiltersChange(updated);
  };

  //  close on click outside both pill buttons AND dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Don't close if clicking inside the dropdown
      if (target.closest(".filter-dropdown-content")) {
        return;
      }

      // Close if clicking outside both button and dropdown
      if (
        openDropdown &&
        !buttonRefs.current[openDropdown]?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  return (
    <div
      className="flex gap-3 overflow-x-auto py-3 px-3 no-scrollbar bg-[#edf7f6]"
      style={{ whiteSpace: "nowrap" }}
    >
      {Object.keys(dropdownOptions).map((key) => {
        const activeCount = selectedFilters[key]?.length || 0;
        return (
          <div key={key} className="flex-shrink-0 relative">
            <button
              ref={(el) => void (buttonRefs.current[key] = el)}
              onClick={() => toggleDropdown(key)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                activeCount > 0
                  ? "bg-[#034B44] text-white border-[#034B44]"
                  : "border-[#a7c4f2] bg-[#d0f7e9]/60 text-[#034B44] hover:bg-[#c0efdf]"
              }`}
            >
              {key}
              {activeCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-[#034B44] rounded-full text-xs font-bold">
                  {activeCount}
                </span>
              )}
              {openDropdown === key ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openDropdown === key && (
              <div ref={dropdownRef}>
                <Dropdown
                  options={dropdownOptions[key as keyof typeof dropdownOptions]}
                  selected={selectedFilters[key]}
                  onChange={(value) => handleCheckboxChange(key, value)}
                  position={dropdownPosition}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
