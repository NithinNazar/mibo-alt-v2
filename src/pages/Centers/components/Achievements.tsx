import React from "react";

const stats = [
  { value: "50+", label: "Expert Clinicians" },
  { value: "10K+", label: "Clients Supported" },
  { value: "8+", label: "Years of Care" },
];

const Achievements: React.FC = () => (
  <section className="py-12 bg-[#E3F7F9] text-center">
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="p-6 rounded-xl shadow-md hover:scale-105 transform transition duration-300 bg-white/20"
        >
          <p className="text-3xl font-bold text-[#176E8E] mb-2">{s.value}</p>
          <p className="uppercase tracking-wider text-sm text-[#0F4C5C]">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default Achievements;
