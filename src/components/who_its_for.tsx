import React from "react";
import { motion } from "framer-motion";
import familyImage from "../assets/mibo-family.jpg";
import individualImage from "../assets/mibo-individual-counselling.jpg";
import coupleImage from "../assets/mibo-couple.jpg";
import childrenImage from "../assets/mibo_children.jpg";
import corporateImage from "../assets/mibo-corporate.jpg";

const CorporateLanding: React.FC = () => {
  const cards = [
    {
      title: "For Families",
      description:
        "Personalized programs that help families strengthen communication, build resilience, and support each other.",
      image: familyImage,
    },
    {
      title: "For Individuals",
      description:
        "Tailored experiences designed for self-growth, mental well-being, and achieving personal goals.",
      image: individualImage,
    },
    {
      title: "For Couples",
      description:
        "Workshops and resources that help couples improve understanding, strengthen bonds, and grow together.",
      image: coupleImage,
    },
    {
      title: "For Children",
      description:
        "Engaging and age-appropriate activities that support emotional development, creativity, and confidence.",
      image: childrenImage,
    },
    {
      title: "For Corporates",
      description:
        "Enterprise-ready infrastructure designed to deliver real-time impact data, enabling tailored programs that drive measurable outcomes.",
      image: corporateImage,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-14 pb-14">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mt-4">
            Tailored for those who <br /> lead, seek, and listen
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => {
            // Zig-zag: 1st from right, 2nd from left, 3rd from right, etc.
            const direction = index % 2 === 0 ? 100 : -100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: direction, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 2.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.3,
                }}
                className="bg-white rounded-3xl shadow-sm overflow-hidden relative min-h-[400px]"
              >
                <div className="px-8 py-8">
                  <h2 className="text-[1.25rem] font-[700] text-[rgb(76,76,76)] mb-4">
                    {card.title}
                  </h2>
                  <p className="text-[rgb(76,76,76)] leading-[20px] text-[0.9rem]">
                    {card.description}
                  </p>
                </div>
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute bottom-0 right-0 w-60 h-auto object-cover"
                  style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CorporateLanding;
