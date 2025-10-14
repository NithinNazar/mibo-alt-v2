import type { Doctor } from "../data/doctors";
import { motion } from "framer-motion";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl p-4 w-[280px] flex-shrink-0 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    >
      <img
        src={`/assets/${doctor.image}.jpg`}
        alt={doctor.name}
        className="rounded-xl w-full h-48 object-cover mb-4"
      />
      <h3 className="text-lg font-semibold text-[#034B44]">{doctor.name}</h3>
      <p className="text-sm text-[#034B44]/80">{doctor.qualification}</p>
      <p className="text-sm text-[#034B44]/80">{doctor.designation}</p>
      <p className="text-xs text-[#a7c4f2] mt-2">{doctor.experience}</p>

      {/* Expertise Auto Scroll */}
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
        {doctor.expertise.map((ex, i) => (
          <span
            key={i}
            className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-3 py-1 rounded-full whitespace-nowrap"
          >
            {ex}
          </span>
        ))}
      </div>

      <button className="mt-4 w-full bg-[#a7c4f2] hover:bg-[#81b2f0] text-[#034B44] font-semibold py-2 rounded-full transition">
        Book
      </button>
    </motion.div>
  );
}

// // src/pages/Experts/components/DoctorCard.tsx
// import type { Doctor } from "../data/doctors";
// import { motion } from "framer-motion";

// interface Props {
//   doctor: Doctor;
// }

// export default function DoctorCard({ doctor }: Props) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       viewport={{ once: true }}
//       className="bg-[#0B162A]/60 border border-[#2FA19A]/30 rounded-2xl p-4 w-[280px] flex-shrink-0 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
//     >
//       <img
//         src={`/assets/${doctor.image}.jpg`}
//         alt={doctor.name}
//         className="rounded-xl w-full h-48 object-cover mb-4"
//       />
//       <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
//       <p className="text-sm text-gray-400">{doctor.qualification}</p>
//       <p className="text-sm text-gray-400">{doctor.designation}</p>
//       <p className="text-xs text-[#2FA19A] mt-2">{doctor.experience}</p>

//       {/* Expertise Auto Scroll */}
//       <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
//         {doctor.expertise.map((ex, i) => (
//           <span
//             key={i}
//             className="bg-[#2FA19A]/20 text-[#2FA19A] text-xs px-3 py-1 rounded-full whitespace-nowrap"
//           >
//             {ex}
//           </span>
//         ))}
//       </div>

//       <button className="mt-4 w-full bg-[#2FA19A] hover:bg-[#238D87] text-white font-semibold py-2 rounded-full transition">
//         Book
//       </button>
//     </motion.div>
//   );
// }
