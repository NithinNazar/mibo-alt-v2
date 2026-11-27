import { motion } from "framer-motion";
import { inPatientContent } from "./InPatientData";
import { BANGALORE_PHONE_DISPLAY, BANGALORE_TEL_LINK } from "../../../utils/contact";
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

      <div className="text-center pb-16">
        <motion.a
          href={BANGALORE_TEL_LINK}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-[#0b1180] text-white px-10 py-3 rounded-xl shadow-md hover:bg-[#046a5d] transition"
        >
          {inPatientContent.cta}
        </motion.a>
        <p className="mt-4 text-gray-700">
          Or call us at{" "}
          <a
            href={BANGALORE_TEL_LINK}
            className="font-bold text-[#0b1180] hover:text-[#046a5d] transition-colors whitespace-nowrap"
          >
            {BANGALORE_PHONE_DISPLAY}
          </a>
        </p>
      </div>
      <ExpertsFooter />
    </div>
  );
};

export default InPatientPage;