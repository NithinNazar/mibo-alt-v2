import heartIcon from "../assets/solidarity.png";
import messageIcon from "../assets/arabic.png";
import animationData from "../assets/wired-lineal-981-consultation-in-reveal.json";
import Lottie from "lottie-react";
import { motion, type Variants } from "framer-motion";

export default function SupportServices() {
  // Parent container variant to stagger sections
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5, // sections appear one after another
      },
    },
  };

  // Section children variant to fade in individually
  const childVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="max-w-md mx-auto space-y-16 p-6 pt-14 pb-14"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Section 1 */}
      <motion.div className="flex flex-col items-center space-y-4">
        <motion.div variants={childVariants}>
          <Lottie
            animationData={animationData}
            className="w-20 h-20 relative left-[-10px]"
            loop={true}
          />
        </motion.div>
        <motion.h2
          className="text-xl font-semibold text-[#3c493f] text-center"
          variants={childVariants}
        >
          Support shaped around you
        </motion.h2>
        <motion.p
          className="text-gray-900 text-[0.9rem] leading-relaxed text-center"
          variants={childVariants}
        >
          We look at your needs and experiences to connect you with someone who
          understands where you're coming from and what support looks like.
        </motion.p>
      </motion.div>

      {/* Section 2 */}
      <motion.div className="flex flex-col items-center space-y-4">
        <motion.div
          variants={childVariants}
          className="flex items-center gap-3"
        >
          <img src={heartIcon} alt="Heart" className="w-6 h-6" />
        </motion.div>
        <motion.h2
          className="text-xl font-semibold text-[#3c493f] text-center"
          variants={childVariants}
        >
          Supporting those who support you
        </motion.h2>
        <motion.p
          className="text-gray-900 text-[0.9rem] leading-relaxed text-center"
          variants={childVariants}
        >
          We bring your loved ones into the process through joint sessions when
          needed, updates and resources that show them what to expect and how to
          help without over-stepping.
        </motion.p>
      </motion.div>

      {/* Section 3 */}
      <motion.div className="flex flex-col items-center space-y-4">
        <motion.div
          variants={childVariants}
          className="flex items-center gap-3"
        >
          <img src={messageIcon} alt="Message" className="w-6 h-6" />
        </motion.div>
        <motion.h2
          className="text-xl font-semibold text-[#3c493f] text-center"
          variants={childVariants}
        >
          Care in your language, and for your context
        </motion.h2>
        <motion.p
          className="text-gray-900 text-[0.9rem] leading-relaxed text-center"
          variants={childVariants}
        >
          With fluency across 15+ Indian languages, our experts understand your
          cultural context so you don't have to over-explain and nothing is lost
          in translation.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
