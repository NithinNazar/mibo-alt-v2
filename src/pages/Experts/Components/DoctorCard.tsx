import type { Doctor } from "../data/doctors";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl 
             p-4 w-[260px] mx-auto flex-shrink-0 
             hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
    >
      <img
        src={doctor.image}
        alt={doctor.name}
        className="rounded-xl w-full h-40 object-cover mb-3"
      />
      <h3 className="text-lg font-semibold text-[#034B44]">{doctor.name}</h3>
      <p className="text-sm text-[#034B44]/80">{doctor.qualification}</p>
      <p className="text-sm text-[#034B44]/80">{doctor.designation}</p>
      <p className="text-xs text-[#a7c4f2] mt-1">{doctor.experience}</p>

      <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar py-1">
        {doctor.expertise.map((ex, i) => (
          <span
            key={i}
            className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-2 py-1 rounded-full whitespace-nowrap"
          >
            {ex}
          </span>
        ))}
      </div>

      <button
        onClick={handleBook}
        className="mt-3 w-full bg-[#a7c4f2] hover:bg-[#81b2f0] text-[#034B44] font-semibold py-1.5 rounded-full transition text-sm"
      >
        Book
      </button>
    </motion.div>
  );
}

// import type { Doctor } from "../data/doctors";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   doctor: Doctor;
// }

// export default function DoctorCard({ doctor }: Props) {
//   const navigate = useNavigate();

//   const handleBook = () => {
//     navigate("/patientAuth"); //  matches your SIGN UP button route
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       viewport={{ once: true }}
//       className="bg-[#d0f7e9]/60 border border-[#a7c4f2]/40 rounded-2xl
//              p-4 w-[260px] mx-auto flex-shrink-0
//              hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
//     >
//       <img
//         src={doctor.image}
//         alt={doctor.name}
//         className="rounded-xl w-full h-40 object-cover mb-3"
//       />
//       <h3 className="text-lg font-semibold text-[#034B44]">{doctor.name}</h3>
//       <p className="text-sm text-[#034B44]/80">{doctor.qualification}</p>
//       <p className="text-sm text-[#034B44]/80">{doctor.designation}</p>
//       <p className="text-xs text-[#a7c4f2] mt-1">{doctor.experience}</p>

//       <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar py-1">
//         {doctor.expertise.map((ex, i) => (
//           <span
//             key={i}
//             className="bg-[#a7c4f2]/40 text-[#034B44] text-xs px-2 py-1 rounded-full whitespace-nowrap"
//           >
//             {ex}
//           </span>
//         ))}
//       </div>

//       <button
//         onClick={handleBook}
//         className="mt-3 w-full bg-[#a7c4f2] hover:bg-[#81b2f0] text-[#034B44] font-semibold py-1.5 rounded-full transition text-sm"
//       >
//         Book
//       </button>
//     </motion.div>
//   );
// }
