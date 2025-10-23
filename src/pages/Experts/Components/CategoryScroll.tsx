import { useState } from "react";

const categories = [
  "All Experts",
  "Therapists",
  "Psychiatrists",
  "Clinical Psychologists",
  "Counsellors",
];

export default function CategoryScroll() {
  const [active, setActive] = useState("All Experts");

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-2 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`whitespace-nowrap px-5 py-2 rounded-full border transition-all ${
            active === cat
              ? "bg-[#a7c4f2] text-[#034B44] border-[#a7c4f2]"
              : "border-[#034B44]/40 text-[#034B44]/70 hover:border-[#a7c4f2] hover:text-[#034B44]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
