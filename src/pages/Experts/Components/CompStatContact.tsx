import { motion } from "framer-motion";
import isoLogo from "../assets/iso.jpeg";
import hipaaLogo from "../assets/hippa.jpeg";
import euLogo from "../assets/eu.jpeg";

export default function CompStatContact() {
  return (
    <div className="flex flex-col w-full">
      {/* --- MIBO IS COMPLIANT WITH --- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="bg-white py-8 px-6 text-center"
      >
        <h2 className="text-2xl md:text-2xl font-semibold mb-6 text-[#034B44]">
          Mibo Is Compliant With
        </h2>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <img
            src={isoLogo}
            alt="ISO Certified"
            className="h-12 w-auto object-contain border-none align-middle"
            style={{ display: "inline-block" }}
          />
          <img
            src={hipaaLogo}
            alt="HIPAA Compliant"
            className="h-12 w-auto object-contain border-none align-middle"
            style={{ display: "inline-block" }}
          />
          <img
            src={euLogo}
            alt="EU Data Protection"
            className="h-12 w-auto object-contain border-none align-middle"
            style={{ display: "inline-block" }}
          />
        </div>
      </motion.section>

      {/* --- STATS SECTION --- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white py-12 px-6"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-teal-500">200+</p>
            <p className="text-[#034B44]/80 mt-1 text-sm md:text-base">
              in-house psychologists & psychiatrists
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-teal-400">
              1 lac+
            </p>
            <p className="text-[#034B44]/80 mt-1 text-sm md:text-base">
              therapy and psychiatry sessions conducted in 2024
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">18</p>
            <p className="text-[#034B44]/80 mt-1 text-sm md:text-base">
              languages
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-teal-700">8</p>
            <p className="text-[#034B44]/80 mt-1 text-sm md:text-base">
              centers in Bengaluru, Mumbai, and Delhi NCR
            </p>
          </div>
        </div>
      </motion.section>

      {/* --- CONTACT SECTION --- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-[#050f69] text-white py-10 px-6 text-center"
      >
        <p className="text-lg max-w-2xl mx-auto leading-relaxed">
          If you didn’t find what you were looking for, please reach out to us
          at{" "}
          <a
            href="mailto:support@mibohealth.com"
            className="underline text-[#83b0f7]"
          >
            support@mibohealth.com
          </a>{" "}
          or call{" "}
          <a href="tel:+912071171501" className="underline text-[#83b0f7]">
            +91 20711 71501
          </a>
          . We’re here for you – for anything you might need.
        </p>
      </motion.section>
    </div>
  );
}
