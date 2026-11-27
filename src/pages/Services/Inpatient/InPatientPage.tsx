import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { inPatientContent } from "./InPatientData";
import {
  BANGALORE_PHONE_DISPLAY,
  BANGALORE_TEL_LINK,
  BANGALORE_WHATSAPP_URL,
} from "../../../utils/contact";
import InPatientHeroCarousel from "./InPatientHeroCarousel";
import ExpertsHeader from "../../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../../Experts/Components/ExpertsFooter";

const InPatientPage = () => {
  return (
    <div className="bg-[#E3F7F1] min-h-screen">
      <ExpertsHeader />
      <InPatientHeroCarousel
        title={inPatientContent.title}
        subtitle={inPatientContent.subtitle}
        cta={inPatientContent.cta}
        ctaHref={BANGALORE_TEL_LINK}
        phoneDisplay={BANGALORE_PHONE_DISPLAY}
        whatsappHref={BANGALORE_WHATSAPP_URL}
      />

      <div className="text-center px-6 pt-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0b3d2e]">Our In-Patient Care</h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded bg-[#046a5d]" />
        <p className="mt-4 max-w-2xl mx-auto text-gray-700">
          A comfortable, safe and private space that supports rest, treatment and overall well-being during your recovery journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {inPatientContent.sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-[#C1DFDA]"
            >
              <Icon className="w-10 h-10 text-[#0b1180] mb-4" />
              <h3 className="text-xl font-semibold text-[#0b1180] mb-2">
                {section.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {section.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-6 pb-16">
        <a
          href={BANGALORE_TEL_LINK}
          className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
        >
          <Phone className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          Call Now: {BANGALORE_PHONE_DISPLAY}
        </a>
        <a
          href={BANGALORE_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#1fa855]"
        >
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          Chat With Us
        </a>
      </div>
      <ExpertsFooter />
    </div>
  );
};

export default InPatientPage;