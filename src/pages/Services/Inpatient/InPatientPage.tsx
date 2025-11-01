import { motion } from "framer-motion";
import { inPatientContent } from "./InPatientData";
import { useNavigate } from "react-router-dom";
import heroImage from "../../../assets/inpatientservice.jpg";
import ExpertsHeader from "../../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../../Experts/Components/ExpertsFooter";

const InPatientPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#E3F7F1] min-h-screen">
      <ExpertsHeader />
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt="In-Patient Care"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">
            {inPatientContent.title}
          </h1>
          <p className="text-lg max-w-2xl drop-shadow-md">
            {inPatientContent.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/experts")}
          className="bg-[#0b1180] text-white px-10 py-3 rounded-xl shadow-md hover:bg-[#046a5d] transition"
        >
          {inPatientContent.cta}
        </motion.button>
      </div>
      <ExpertsFooter />
    </div>
  );
};

export default InPatientPage;
