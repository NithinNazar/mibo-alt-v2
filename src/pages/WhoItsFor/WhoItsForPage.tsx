// src/pages/WhoItsFor/WhoItsForPage.tsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { whoItsForContent } from "./WhoItsForContent";
import whoItsForHero from "../../assets/whoitsfor.jpg";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../Experts/Components/ExpertsFooter";

const WhoItsForPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAFC] text-slate-800">
      {/* Header */}
      <ExpertsHeader />

      {/* Hero Section */}
      <div
        className="relative h-[60vh] w-full bg-cover bg-center flex items-center justify-center mt-20"
        style={{ backgroundImage: `url(${whoItsForHero})` }}
      >
        <div className="absolute inset-0 bg-[#0b1180]/10" />
        <div className="relative z-10 text-center max-w-3xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
          >
            {whoItsForContent.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-white text-lg leading-relaxed"
          >
            {whoItsForContent.hero.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {whoItsForContent.sections.map((section, index) => {
            const LucideIcon = Icons[
              section.icon as keyof typeof Icons
            ] as React.ComponentType<{
              className?: string;
            }>;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl p-8 border-t-4 border-[#1E3A8A] hover:border-[#0284C7] transition-all"
              >
                <div className="flex items-center mb-4">
                  {LucideIcon && (
                    <LucideIcon className="w-8 h-8 text-[#0284C7] mr-3 flex-shrink-0" />
                  )}
                  <h3 className="text-xl font-semibold text-[#0b1180]">
                    {section.title}
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-[15px]">
                  {section.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-slate-700 font-medium mb-6 max-w-2xl mx-auto">
            {whoItsForContent.closing.text}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/experts")}
            className="bg-[#0b1180] text-white px-8 py-3 rounded-xl shadow-md hover:bg-[#0284C7] transition"
          >
            {whoItsForContent.closing.cta}
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <ExpertsFooter />
    </div>
  );
};

export default WhoItsForPage;
