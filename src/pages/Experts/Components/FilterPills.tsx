const filters = [
  "Anxiety",
  "Stress",
  "Sleep",
  "Relationships",
  "Trauma",
  "Addiction",
];

export default function FilterPills() {
  return (
    <div className="flex gap-3 overflow-x-auto py-3 px-2 no-scrollbar">
      {filters.map((f) => (
        <div
          key={f}
          className="whitespace-nowrap px-4 py-2 bg-[#d0f7e9]/60 border border-[#a7c4f2] rounded-full text-[#034B44] text-sm"
        >
          {f}
        </div>
      ))}
    </div>
  );
}

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
