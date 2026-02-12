import realCareImg from "../assets/mibo-real-care.jpg";
import { motion, type Variants } from "framer-motion";

export default function CareServiceComponent() {
  // Word fade in variant
  const wordVariant: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
  };

  // Paragraph/image fade in
  const fadeInVariant: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const headingWords = [
    { text: "Real care adapts to your", color: "text-gray-900" },
    { text: "life,", color: "text-[#2FA19A]" },
    { text: "your people,", color: "text-[#2FA19A]" },
    { text: "your pace.", color: "text-[#2FA19A]" },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="space-y-6"
          >
            {/* Heading */}
            <h1 className="text-2xl lg:text-5xl ml-4 font-bold leading-tight">
              {headingWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={wordVariant}
                  className={`inline-block mr-1 ${word.color}`}
                >
                  {word.text}
                </motion.span>
              ))}
            </h1>

            {/* Paragraph */}
            <motion.p
              variants={fadeInVariant}
              className="text-[0.9rem] font-semibold ml-4 text-gray-600 leading-relaxed max-w-lg"
            >
              Care doesn't happen in isolation. It works when it's rooted in
              your everyday life.
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 0.8 } },
            }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div variants={fadeInVariant} className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl flex items-center justify-center">
                <img
                  src={realCareImg}
                  alt="Woman using mobile app"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-200 rounded-full opacity-40"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
