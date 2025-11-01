import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { whyMiboContent } from "./WhyMiboContent";
import * as Icons from "lucide-react";
import heroImg from "../../assets/whymibo.jpg";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../Experts/Components/ExpertsFooter";

const WhyMibo = () => {
  const { hero, intro, principles, closing } = whyMiboContent;
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white text-slate-800 overflow-hidden">
      <ExpertsHeader />
      {/* --- Hero Section --- */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl px-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{hero.title}</h1>
          <p className="text-lg md:text-xl text-white/90">{hero.subtitle}</p>
        </motion.div>
      </section>

      {/* --- Intro Section --- */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-[#034B44] mb-4"
        >
          {intro.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          {intro.text}
        </motion.p>
      </section>

      {/* --- Principles Section --- */}
      <section className="bg-[#E9F6F4] py-16 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((item, i) => {
            const IconComponent = (Icons as any)[item.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#034B44]/10 text-[#034B44] mb-4 mx-auto">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#034B44] mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- Closing CTA --- */}
      <section className="py-20 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-[#034B44] mb-4"
        >
          {closing.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-slate-600 max-w-3xl mx-auto mb-8"
        >
          {closing.text}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/experts")} // ✅ navigate to experts page
          className="bg-[#0b1180] text-white px-8 py-3 rounded-xl shadow-md hover:bg-[#94edf7] transition"
        >
          {closing.cta}
        </motion.button>
      </section>
      <ExpertsFooter />
    </div>
  );
};

export default WhyMibo;
