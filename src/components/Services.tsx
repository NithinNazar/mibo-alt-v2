import { useState } from "react";
import { ChevronDown, User, Users, Monitor } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import inPatientImg from "../assets/In-patient.jpg";
import inPersonImg from "../assets/In-person.jpg";
import onlineImg from "../assets/online.jpg";

const MentalHealthServices: React.FC = () => {
  // const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(
    "in-patient"
  );

  const getServiceImage = (serviceId: string) => {
    const images = {
      "in-patient": inPatientImg,
      "in-person": inPersonImg,
      online: onlineImg,
    };
    return images[serviceId as keyof typeof images] || images["in-person"];
  };

  const services = [
    {
      id: "in-patient",
      title: "In-Patient",
      icon: <User className="w-6 h-6" />,
      description: "Residential care for intensive treatment",
      details: "Comprehensive care in a supportive environment",
    },
    {
      id: "in-person",
      title: "In-Person",
      icon: <Users className="w-6 h-6" />,
      description: "Face-to-face therapy sessions",
      details: "Personalized therapy with professionals",
    },
    {
      id: "online",
      title: "Online Services",
      icon: <Monitor className="w-6 h-6" />,
      description: "Virtual therapy and counseling",
      details: "Virtual sessions from anywhere",
    },
  ];

  const toggleService = (id: string) =>
    setExpandedService(expandedService === id ? null : id);

  // Animation variants for container & cards
  const containerVariant: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.6 } }, // slower stagger
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, x: 120 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 5, // smooth cinematic effect
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariant}
      className="bg-[#E9F6F4]"
    >
      <div className="max-w-4xl mx-auto p-6 pb-14 pt-14">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)]">
            Mental Health Services
          </h1>
          <p className="text-[16px] text-slate-600 mx-auto leading-relaxed">
            Comprehensive care for your mental wellbeing
          </p>
        </div>

        {/* Services */}
        <motion.div variants={containerVariant} className="space-y-4">
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariant}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => toggleService(service.id)}
                className={`w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 bg-[#BDE3DE] ${
                  expandedService === service.id
                    ? "bg-white/10"
                    : "hover:bg-white/10"
                }`}
              >
                <h3 className="text-sm ml-2 font-extrabold text-slate-700">
                  {service.title}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-700 transform transition-transform duration-500 ease-in-out ${
                    expandedService === service.id
                      ? "rotate-180 scale-110"
                      : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Content */}
              <motion.div
                initial={{ maxHeight: 0, opacity: 0 }}
                animate={
                  expandedService === service.id
                    ? { maxHeight: 384, opacity: 1 }
                    : { maxHeight: 0, opacity: 0 }
                }
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // slower expansion
                className="overflow-hidden relative"
              >
                <div
                  className="relative h-48 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${getServiceImage(service.id)})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-white text-lg font-semibold mb-2">
                      {service.details}
                    </p>
                    <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/30 hover:border-white/50 transform hover:scale-105 active:scale-95 transition-all duration-300 w-fit shadow-lg">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MentalHealthServices;

// import { useState } from "react";
// import type { ReactNode } from "react";
// import { ChevronDown, User, Users, Monitor } from "lucide-react";
// import { motion, type Variants } from "framer-motion";
// import inPatientImg from "../assets/In-patient.jpg";
// import inPersonImg from "../assets/In-person.jpg";
// import onlineImg from "../assets/online.jpg";

// type Service = {
//   id: string;
//   title: string;
//   icon: ReactNode;
//   description: string;
//   details: string;
// };

// const MentalHealthServices = () => {
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   const getServiceImage = (serviceId: string) => {
//     const images = {
//       "in-patient": inPatientImg,
//       "in-person": inPersonImg,
//       online: onlineImg,
//     };
//     return images[serviceId as keyof typeof images] || images["in-person"];
//   };

//   const services: Service[] = [
//     {
//       id: "in-patient",
//       title: "In-Patient",
//       icon: <User className="w-6 h-6" />,
//       description:
//         "Comprehensive residential care for intensive mental health treatment",
//       details: "Comprehensive care in a supportive residential environment",
//     },
//     {
//       id: "in-person",
//       title: "In-Person",
//       icon: <Users className="w-6 h-6" />,
//       description:
//         "Face-to-face therapy sessions with qualified mental health professionals",
//       details: "Personalized therapy with experienced professionals",
//     },
//     {
//       id: "online",
//       title: "Online Services",
//       icon: <Monitor className="w-6 h-6" />,
//       description:
//         "Convenient virtual therapy and counseling sessions from anywhere",
//       details: "Virtual therapy sessions from anywhere you feel comfortable",
//     },
//   ];

//   const toggleService = (serviceId: string) => {
//     setExpandedService(expandedService === serviceId ? null : serviceId);
//   };

//   const containerVariant: Variants = {
//     hidden: {},
//     visible: {
//       transition: { staggerChildren: 0.4 },
//     },
//   };

//   const cardVariant: Variants = {
//     hidden: { opacity: 0, x: 60 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 3.2,
//         ease: [0.22, 1, 0.36, 1],
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.1, margin: "-50px" }}
//       variants={containerVariant}
//       className="bg-[#E9F6F4]"
//     >
//       <div className="max-w-4xl mx-auto p-6 pb-14 pt-14">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)]">
//             Mental Health Services
//           </h1>
//           <p className="text-[16px] sm:text-[16px] text-slate-600 mx-auto leading-relaxed">
//             Comprehensive care for your mental wellbeing
//           </p>
//         </div>

//         {/* Services Section */}
//         <motion.div variants={containerVariant} className="mb-14 space-y-3">
//           {services.map((service) => (
//             <motion.div
//               key={service.id}
//               variants={cardVariant}
//               className="relative rounded-2xl overflow-hidden shadow-lg"
//             >
//               <div className="relative rounded-2xl">
//                 <button
//                   onClick={() => toggleService(service.id)}
//                   className={`w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 bg-[#BDE3DE]
//                     ${
//                       expandedService === service.id
//                         ? "bg-white/10"
//                         : "hover:bg-white/10"
//                     }`}
//                 >
//                   <h3 className="text-sm ml-2 font-extrabold text-slate-700">
//                     {service.title}
//                   </h3>
//                   <ChevronDown
//                     className={`w-5 h-5 text-slate-700 transform transition-transform duration-500 ease-in-out
//                       ${
//                         expandedService === service.id
//                           ? "rotate-180 scale-110"
//                           : "rotate-0"
//                       }`}
//                   />
//                 </button>

//                 <div
//                   className={`relative transition-all duration-500 ease-in-out overflow-hidden
//                     ${
//                       expandedService === service.id
//                         ? "max-h-96 opacity-100"
//                         : "max-h-0 opacity-0"
//                     }`}
//                 >
//                   <div
//                     className="relative h-48 bg-cover bg-center bg-no-repeat"
//                     style={{
//                       backgroundImage: `url(${getServiceImage(service.id)})`,
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/50"></div>
//                     <div className="absolute inset-0 flex flex-col justify-end p-6">
//                       <p className="text-white text-lg font-semibold mb-2">
//                         {service.details}
//                       </p>
//                       <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/30 hover:border-white/50 transform hover:scale-105 active:scale-95 transition-all duration-300 w-fit shadow-lg">
//                         Learn More
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default MentalHealthServices;

// import { useState } from "react";
// import type { ReactNode } from "react";
// import { ChevronDown, User, Users, Monitor } from "lucide-react";
// import { motion } from "framer-motion";
// import type { Variants } from "framer-motion";
// import inPatientImg from "../assets/In-patient.jpg";
// import inPersonImg from "../assets/In-person.jpg";
// import onlineImg from "../assets/online.jpg";

// type Service = {
//   id: string;
//   title: string;
//   icon: ReactNode;
//   description: string;
//   details: string;
// };

// const MentalHealthServices = () => {
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   const getServiceImage = (serviceId: string) => {
//     const images = {
//       "in-patient": inPatientImg,
//       "in-person": inPersonImg,
//       online: onlineImg,
//     };
//     return images[serviceId as keyof typeof images] || images["in-person"];
//   };

//   const services: Service[] = [
//     {
//       id: "in-patient",
//       title: "In-Patient",
//       icon: <User className="w-6 h-6" />,
//       description:
//         "Comprehensive residential care for intensive mental health treatment",
//       details: "Comprehensive care in a supportive residential environment",
//     },
//     {
//       id: "in-person",
//       title: "In-Person",
//       icon: <Users className="w-6 h-6" />,
//       description:
//         "Face-to-face therapy sessions with qualified mental health professionals",
//       details: "Personalized therapy with experienced professionals",
//     },
//     {
//       id: "online",
//       title: "Online Services",
//       icon: <Monitor className="w-6 h-6" />,
//       description:
//         "Convenient virtual therapy and counseling sessions from anywhere",
//       details: "Virtual therapy sessions from anywhere you feel comfortable",
//     },
//   ];

//   const toggleService = (serviceId: string) => {
//     setExpandedService(expandedService === serviceId ? null : serviceId);
//   };

//   // Animation Variants
//   const containerVariant: Variants = {
//     hidden: {},
//     visible: {
//       transition: {
//         staggerChildren: 0.4, // stagger each card
//       },
//     },
//   };

//   const cardVariant: Variants = {
//     hidden: { opacity: 0, x: 60 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 3.2, // cinematic duration
//         ease: [0.22, 1, 0.36, 1],
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.3 }}
//       variants={containerVariant}
//       className="bg-[#E9F6F4]"
//     >
//       <div className="max-w-4xl mx-auto p-6 pb-14 pt-14">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] ">
//             Mental Health Services
//           </h1>
//           <p className="text-[16px] sm:text-[16px] text-slate-600 mx-auto leading-relaxed">
//             Comprehensive care for your mental wellbeing
//           </p>
//         </div>

//         {/* Services Section */}
//         <motion.div variants={containerVariant} className="mb-14 space-y-3">
//           {services.map((service) => (
//             <motion.div
//               key={service.id}
//               variants={cardVariant}
//               className="relative rounded-2xl overflow-hidden shadow-lg"
//             >
//               <div className="relative rounded-2xl">
//                 <button
//                   onClick={() => toggleService(service.id)}
//                   className={`w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 bg-[#BDE3DE]
//                     ${
//                       expandedService === service.id
//                         ? "bg-white/10"
//                         : "hover:bg-white/10"
//                     }`}
//                 >
//                   <div>
//                     <h3 className="text-sm ml-2 font-extrabold text-slate-700">
//                       {service.title}
//                     </h3>
//                   </div>
//                   <ChevronDown
//                     className={`w-5 h-5 text-slate-700 transform transition-transform duration-500 ease-in-out
//                       ${
//                         expandedService === service.id
//                           ? "rotate-180 scale-110"
//                           : "rotate-0"
//                       }`}
//                   />
//                 </button>

//                 <div
//                   className={`relative transition-all duration-500 ease-in-out overflow-hidden
//                     ${
//                       expandedService === service.id
//                         ? "max-h-96 opacity-100"
//                         : "max-h-0 opacity-0"
//                     }`}
//                 >
//                   <div
//                     className="relative h-48 bg-cover bg-center bg-no-repeat"
//                     style={{
//                       backgroundImage: `url(${getServiceImage(service.id)})`,
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/50"></div>
//                     <div className="absolute inset-0 flex flex-col justify-end p-6">
//                       <div className="text-white mb-4">
//                         <p className="text-lg font-semibold mb-2">
//                           {service.details}
//                         </p>
//                       </div>
//                       <button
//                         className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl font-semibold
//                               hover:bg-white/30 hover:border-white/50 transform hover:scale-105 active:scale-95 transition-all duration-300
//                               w-fit shadow-lg"
//                       >
//                         Learn More
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default MentalHealthServices;
