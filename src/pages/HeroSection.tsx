import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Shield, Sparkles, Calendar } from "lucide-react";
import banner from "../assets/welcome-banner.png";
import welcomebannerdesktop from "../assets/welcome-banner-desktop.png";

// Animated icon variants for subtle floating effect
const iconFloat = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const TRUST = [
  {
    Icon: Users,
    title: "Trusted Professionals",
    desc: "Experienced and certified mental health experts.",
  },
  {
    Icon: Shield,
    title: "Confidential & Secure",
    desc: "Your privacy is our top priority.",
  },
  {
    Icon: Sparkles,
    title: "Personalized Care",
    desc: "Tailored support for your unique needs.",
  },
  {
    Icon: Calendar,
    title: "Flexible & Convenient",
    desc: "Online and in-person sessions available.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const navigate = useNavigate();

  const renderIcon = (Icon, size) => {
    return (
      <motion.div variants={iconFloat} initial="initial" animate="animate">
        <Icon
          color="#10C78A"
          style={{ width: size, height: size }}
          strokeWidth={1.5}
        />
      </motion.div>
    );
  };

  return (
    <>
      {/* ── MOBILE ── */}
      <section
        className="w-full bg-[#F7FAFA] relative"
        style={{ paddingTop: "56px" }}
      >
        <div className="flex flex-col lg:hidden">
          <motion.div
            className="w-full relative"
            style={{ height: "clamp(280px, 48vw, 440px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <img
              src={banner}
              alt="Comfortable therapy room"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 10%" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, #F7FAFA)",
              }}
            />
          </motion.div>

          <motion.div
            className="flex flex-col px-6 sm:px-10 pb-6 pt-5"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="font-extrabold text-[#0B1354] leading-[1.15]"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                letterSpacing: "-0.3px",
                marginBottom: 12,
              }}
            >
              Welcome to Mibo
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#555]"
              style={{
                fontSize: "clamp(0.98rem, 1.6vw, 1.2rem)",
                lineHeight: 1.65,
                marginBottom: 24,
              }}
            >
              Professional care and support to help you feel better, every day.
            </motion.p>
            <motion.div variants={fadeUp}>
              {/* Book Appointment Button */}
              <button
                onClick={() => navigate("/experts")}
                className="inline-flex items-center gap-2.5 text-white font-bold rounded-full shadow-sm transition-all duration-300 active:scale-95"
                style={{
                  background: "#10C78A",
                  padding: "13px 26px",
                  fontSize: "0.9rem",
                }}
              >
                Book Appointment
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 24,
                    height: 24,
                    background: "rgba(255,255,255,0.28)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <div className="px-3 pb-8">
            <motion.div
              className="bg-white rounded-2xl shadow-lg grid grid-cols-2 overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {TRUST.map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5
                    ${i % 2 === 1 ? "border-l border-[#EFEFEF]" : ""}
                    ${i >= 2 ? "border-t border-[#EFEFEF]" : ""}`}
                  style={{ padding: "14px 12px" }}
                >
                  <div
                    className="flex-shrink-0 rounded-full bg-[#D1FAF0] flex items-center justify-center overflow-hidden"
                    style={{ width: 38, height: 38 }}
                  >
                    {renderIcon(Icon, 18)}
                  </div>
                  <div>
                    <p
                      className="font-bold text-[#0B1354] leading-tight"
                      style={{ fontSize: "0.9rem", marginBottom: 3 }}
                    >
                      {title}
                    </p>
                    <p
                      className="text-[#6B7280] leading-snug"
                      style={{ fontSize: "0.88rem" }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/*  DESKTOP  */}
      <section
        className="hidden lg:block w-full relative"
        style={{ paddingTop: "46px" }}
      >
        <div className="absolute inset-0 z-0" style={{ bottom: "50px" }}>
          <img
            src={welcomebannerdesktop}
            alt="Comfortable therapy room"
            className="w-full h-full object-cover"
            style={{ objectPosition: "75% center" }}
          />
        </div>

        <div
          className="relative z-10 flex items-center"
          style={{ minHeight: "clamp(400px, 52vw, 580px)" }}
        >
          <motion.div
            className="flex flex-col justify-center"
            style={{ width: "44%", minWidth: 260, padding: "48px 0 48px 64px" }}
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="font-extrabold text-[#0B1354] leading-[1.1]"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                letterSpacing: "-0.4px",
                marginBottom: 14,
              }}
            >
              Welcome to Mibo
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#555]"
              style={{
                fontSize: "clamp(0.98rem, 1.6vw, 1.2rem)",
                lineHeight: 1.65,
                marginBottom: 28,
              }}
            >
              Professional care and support to
              <br />
              help you feel better, every day.
            </motion.p>
            <motion.div variants={fadeUp}>
              {/* Book Appointment Button */}
              <button
                onClick={() => navigate("/experts")}
                className="inline-flex items-center gap-2.5 text-white font-bold rounded-full shadow-sm transition-all duration-300 hover:scale-105 hover:brightness-110"
                style={{
                  background: "#10C78A",
                  padding: "11px 22px",
                  fontSize: "0.95rem",
                }}
              >
                Book Appointment
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 22,
                    height: 22,
                    background: "rgba(255,255,255,0.28)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div
          className="relative z-20 px-12 pb-10"
          style={{ marginTop: "-28px" }}
        >
          <motion.div
            className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-lg grid grid-cols-4 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {TRUST.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 ${i > 0 ? "border-l border-[#EFEFEF]" : ""}`}
                style={{ padding: "40px 34px" }}
              >
                <div
                  className="flex-shrink-0 rounded-full bg-[#D1FAF0] flex items-center justify-center overflow-hidden"
                  style={{ width: 42, height: 42 }}
                >
                  {renderIcon(Icon, 20)}
                </div>
                <div>
                  <p
                    className="font-bold text-[#0B1354] leading-tight"
                    style={{ fontSize: "0.9rem", marginBottom: 3 }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-[#454648] leading-snug"
                    style={{ fontSize: "0.88rem" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
