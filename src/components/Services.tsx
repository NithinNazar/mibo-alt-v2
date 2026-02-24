import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, Users, Monitor } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Lottie from "lottie-react";
import screeningAnimation from "../assets/animations/MedicalAdd.json";

import inPatientImg from "../assets/In-patient.jpg?w=800&format=webp&quality=75";
import inPersonImg from "../assets/In-person.jpg?w=800&format=webp&quality=75";
import onlineImg from "../assets/online.jpg?w=800&format=webp&quality=75";

const MentalHealthServices: React.FC = () => {
  const navigate = useNavigate();
  const [expandedService, setExpandedService] = useState<string | null>(
    "in-patient",
  );

  const getServiceImage = (serviceId: string) => {
    const images = {
      "in-patient": inPatientImg,
      "in-person": inPersonImg,
      online: onlineImg,
    };
    return images[serviceId as keyof typeof images] || images["in-person"];
  };

  const getServiceLink = (serviceId: string) => {
    const links = {
      "in-patient": "/services/in-patient",
      "in-person": "/services/in-person",
      online: "/experts",
    };
    return links[serviceId as keyof typeof links] || "/experts";
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
    visible: { transition: { staggerChildren: 0.6 } },
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, x: 120 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      id="services"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariant}
      className="relative bg-[#E9F6F4] overflow-hidden pt-28 pb-20"
    >
      <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-24 h-24 z-0 opacity-70">
        <Lottie animationData={screeningAnimation} loop={true} />
      </div>

      {/* Main content should stay above the animation */}
      <div className="max-w-4xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 mt-10">
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
              className="relative rounded-2xl overflow-hidden shadow-lg bg-[#BDE3DE] z-10"
            >
              <button
                onClick={() => toggleService(service.id)}
                className={`w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 ${
                  expandedService === service.id
                    ? "bg-white/40"
                    : "hover:bg-white/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {service.icon}
                  <h3 className="text-sm font-extrabold text-slate-700">
                    {service.title}
                  </h3>
                </div>
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
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
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
                    <button
                      onClick={() => navigate(getServiceLink(service.id))}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/30 hover:border-white/50 transform hover:scale-105 active:scale-95 transition-all duration-300 w-fit shadow-lg"
                    >
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
