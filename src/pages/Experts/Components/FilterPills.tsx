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
        className="absolute max-h-64 overflow-y-auto bg-white rounded-xl border border-[#a7c4f2]/50 shadow-2xl p-3 z-[9999]"
      >
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 py-1 px-2 text-sm text-[#034B44] hover:bg-[#e6f5f2] rounded-md cursor-pointer"
          >
            <input
              type="checkbox"
              className="accent-[#034B44]"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function FilterPills() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Location: [],
    Expertise: [],
    Language: [],
    Price: [],
  });
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const dropdownOptions = {
    Location: ["Bangalore", "Kochi", "Mumbai"],
    Expertise: [
      "Addiction",
      "ADHD",
      "Anxiety",
      "Depression",
      "OCD",
      "PTSD",
      "Relationships",
      "Sleep Issues",
      "Stress",
      "Trauma",
    ],
    Language: [
      "English",
      "Hindi",
      "Kannada",
      "Malayalam",
      "Tamil",
      "Telugu",
      "Marathi",
      "Gujarati",
      "Bengali",
      "Punjabi",
    ],
    Price: ["₹1000–1500/hr", "₹1500–2500/hr", "₹2500–5000/hr"],
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
      // const width = rect.width;

      // ✅ prevent overflow right
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
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // ✅ close on click outside both pill buttons AND dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        openDropdown &&
        !buttonRefs.current[openDropdown]?.contains(target as Node) &&
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
      {Object.keys(dropdownOptions).map((key) => (
        <div key={key} className="flex-shrink-0 relative">
          <button
            ref={(el) => void (buttonRefs.current[key] = el)}
            onClick={() => toggleDropdown(key)}
            className="flex items-center gap-2 px-4 py-2 border border-[#a7c4f2] bg-[#d0f7e9]/60 rounded-full text-[#034B44] text-sm font-medium transition-all hover:bg-[#c0efdf]"
          >
            {key}
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
      ))}
    </div>
  );
}

// const filters = [
//   "Anxiety",
//   "Stress",
//   "Sleep",
//   "Relationships",
//   "Trauma",
//   "Addiction",
// ];

// export default function FilterPills() {
//   return (
//     <div className="flex gap-3 overflow-x-auto py-3 px-2 no-scrollbar">
//       {filters.map((f) => (
//         <div
//           key={f}
//           className="whitespace-nowrap px-4 py-2 bg-[#d0f7e9]/60 border border-[#a7c4f2] rounded-full text-[#034B44] text-sm"
//         >
//           {f}
//         </div>
//       ))}
//     </div>
//   );
// }

// // src/pages/Experts/components/FilterPills.tsx
// const filters = [
//   "Anxiety",
//   "Stress",
//   "Sleep",
//   "Relationships",
//   "Trauma",
//   "Addiction",
// ];

// export default function FilterPills() {
//   return (
//     <div className="flex gap-3 overflow-x-auto py-3 px-2 no-scrollbar">
//       {filters.map((f) => (
//         <div
//           key={f}
//           className="whitespace-nowrap px-4 py-2 bg-[#18356C]/30 border border-[#2FA19A] rounded-full text-[#2FA19A] text-sm"
//         >
//           {f}
//         </div>
//       ))}
//     </div>
//   );
// }
