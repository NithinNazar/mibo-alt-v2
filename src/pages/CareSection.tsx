import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Monitor,
  User,
  Shield,
  UserCheck,
  Calendar,
  Heart,
} from "lucide-react";
import banner from "../assets/choose-mibo.png";
import virtualsection from "../assets/virtual-section.png";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// Subtle icon animation
const iconFloat = {
  initial: { y: 0, scale: 1 },
  animate: {
    y: [-1, 1, -1],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const MH_SERVICES = [
  {
    Icon: User,
    title: "In-Patient",
    desc: "Personalized care and 24/7 support in a safe and comfortable environment.",
    path: "/services/in-patient",
  },
  {
    Icon: Users,
    title: "In-Person",
    desc: "Connect with our experts face-to-face for meaningful and effective sessions.",
    path: "/services/in-person",
  },
  {
    Icon: Monitor,
    title: "Online Services",
    desc: "Access professional support through secure and convenient online sessions.",
    path: "/services/online",
  },
];

const FEATURES = [
  {
    title: "Confidential & Secure",
    desc: "Your privacy is always protected.",
    Icon: Shield,
  },
  {
    title: "Certified Experts",
    desc: "Experienced professionals who truly care.",
    Icon: UserCheck,
  },
  {
    title: "Flexible Sessions",
    desc: "Online and offline appointments available.",
    Icon: Calendar,
  },
  {
    title: "Personalized Support",
    desc: "Care plans tailored to individual needs.",
    Icon: Heart,
  },
];

const STATS = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10C78A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    val: "10K+",
    label: "Sessions\nCompleted",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10C78A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    val: "95%",
    label: "Positive\nFeedback",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10C78A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
      </svg>
    ),
    val: "24/7",
    label: "Support\nAvailable",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10C78A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      </svg>
    ),
    val: "50+",
    label: "Experienced\nSpecialists",
  },
];

export default function CareSection() {
  const navigate = useNavigate();

  return (
    <>
      {/* HOW WE HELP  "Care Designed Around You" */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <p
            className=" font-black  tracking-[0.1em] text-[#10C78A] mb-4 uppercase"
            style={{ fontSize: "clamp(0.88rem,4.5vw,1.2rem)" }}
          >
            How We Help
          </p>
          <h2
            className="font-extrabold text-[#0B1354] leading-[1.08] mb-4"
            style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}
          >
            Care Designed
            <br />
            Around You
          </h2>
          <div className="w-[60px] h-[4px] bg-[#10C78A] rounded-full mb-5" />
          <p
            className="text-[#4B5563] mb-12 leading-relaxed"
            style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}
          >
            Personalized support to help you feel better, cope stronger, and
            live well.
          </p>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 border-t border-[#E5E7EB]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {/* Therapy Sessions */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center text-center px-4 sm:px-7 py-8 sm:py-10 border-r border-[#E5E7EB]"
            >
              <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#D1FAF0] flex items-center justify-center mb-5">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 42 42"
                  fill="none"
                  stroke="#10C78A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="10" y="6" width="18" height="13" rx="3" />
                  <path d="M14 22l-2 4 4-2" />
                  <circle cx="21" cy="30" r="3.5" />
                  <path d="M14 42c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" />
                  <circle cx="32" cy="28" r="2.5" />
                  <path d="M27.5 38c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" />
                </svg>
              </div>
              <h3 className="font-bold text-[0.9rem] mb-2 leading-snug text-[#10C78A]">
                Therapy Sessions
              </h3>
              <p
                className=" sm:text-[0.84rem] text-[#0B1354] leading-relaxed"
                style={{ fontSize: "clamp(0.88rem,1.6vw,0.94rem)" }}
              >
                One-on-one expert guidance.
              </p>
            </motion.div>

            {/* Stress Management */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center text-center px-4 sm:px-7 py-8 sm:py-10 border-r border-[#E5E7EB]"
            >
              <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#ECEAFA] flex items-center justify-center mb-5">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 42 42"
                  fill="none"
                  stroke="#6B5FE4"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="21" cy="11" r="3.5" />
                  <path d="M21 15v8" />
                  <path d="M21 28 C16 28 12 24 12 20 C15 20 18 22 21 28" />
                  <path d="M21 28 C26 28 30 24 30 20 C27 20 24 22 21 28" />
                  <path d="M21 28 C18 23 18 18 21 15 C24 18 24 23 21 28" />
                  <path d="M10 30 Q21 34 32 30" />
                  <path d="M21 20 L14 24M21 20 L28 24" />
                </svg>
              </div>
              <h3 className="font-bold text-[0.9rem] mb-2 leading-snug text-[#6B5FE4]">
                Stress Management
              </h3>
              <p
                className="text-[0.78rem] sm:text-[0.84rem] text-[#0B1354] leading-relaxed"
                style={{ fontSize: "clamp(0.88rem,1.6vw,0.94rem)" }}
              >
                Learn coping and relaxation techniques.
              </p>
            </motion.div>

            {/* Relationship Counseling */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center text-center px-4 sm:px-7 py-8 sm:py-10 border-r border-[#E5E7EB]"
            >
              <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#D1FAF0] flex items-center justify-center mb-5">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 42 42"
                  fill="none"
                  stroke="#10C78A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 14 C21 14 18 10 15 10 C12 10 10 12.5 10 15 C10 20 21 26 21 26 C21 26 32 20 32 15 C32 12.5 30 10 27 10 C24 10 21 14 21 14" />
                  <circle cx="15" cy="31" r="3" />
                  <path d="M9 42c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                  <circle cx="27" cy="31" r="3" />
                  <path d="M21 42c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-[0.9rem] mb-2 leading-snug text-[#10C78A]">
                Relationship Counseling
              </h3>
              <p
                className="text-[0.78rem] sm:text-[0.84rem] text-[#0B1354] leading-relaxed"
                style={{ fontSize: "clamp(0.88rem,1.6vw,0.94rem)" }}
              >
                Improve communication and emotional balance.
              </p>
            </motion.div>

            {/* Online Consultations */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center text-center px-4 sm:px-7 py-8 sm:py-10"
            >
              <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#E8EDFB] flex items-center justify-center mb-5">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 42 42"
                  fill="none"
                  stroke="#1E3A8A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="8" width="30" height="20" rx="2.5" />
                  <path d="M21 28v5M15 33h12" />
                  <circle cx="21" cy="15" r="3" />
                  <path d="M15 26c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-[0.9rem] mb-2 leading-snug text-[#1E3A8A]">
                Online Consultations
              </h3>
              <p
                className="text-[0.78rem] sm:text-[0.84rem] text-[#0B1354] leading-relaxed"
                style={{ fontSize: "clamp(0.88rem,1.6vw,0.94rem)" }}
              >
                Easy access from anywhere.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/*  WHY PEOPLE CHOOSE MIBO */}
      <section
        className="w-full bg-white overflow-hidden"
        style={{ background: "linear-gradient(180deg,#fff 70%,#E8F7F3 100%)" }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* LEFT: photo */}
          <motion.div
            className="relative lg:w-[36%] flex-shrink-0 min-h-[480px] sm:min-h-[540px] lg:min-h-[520px]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <img
              src={banner}
              alt="Woman relaxed"
              className="w-full h-full object-cover absolute inset-0"
              style={{ objectPosition: "center 15%" }}
            />
            <div
              className="absolute inset-y-0 right-0 w-24 pointer-events-none"
              style={{
                background: "linear-gradient(to right,transparent,#fff)",
              }}
            />

            <motion.div
              className="absolute bottom-6 left-5 bg-white rounded-2xl px-3 py-2.5 shadow-xl border border-[#E5F7F1] flex items-center gap-3"
              style={{ minWidth: 175 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="w-9 h-9 rounded-full bg-[#D1FAF0] flex items-center justify-center flex-shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10C78A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.72rem] font-bold text-[#0B1354] leading-tight">
                  Your Wellbeing,
                  <br />
                  Our Priority
                </p>
                <p className="text-[0.65rem] text-[#6B7280] mt-0.5">
                  Safe. Private. Trusted.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: content */}
          <motion.div
            className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-14 xl:px-16 py-14 lg:py-16"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <p
                className="text-[0.95rem] font-extrabold tracking-[0.22em] text-[#283B79] uppercase"
                style={{ fontSize: "clamp(0.88rem, 1.6vw, 0.94rem)" }}
              >
                Why Choose Us
              </p>
              <div className="w-8 h-[2px] bg-[#10C78A] rounded" />
            </div>

            <div className="mb-3">
              <svg
                width="18"
                height="16"
                viewBox="0 0 24 22"
                fill="none"
                stroke="#10C78A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.04 3 12 4 12 4C12 4 12.96 3 14.5 3C17.58 3 20 5.42 20 8.5C20 13.5 12 21 12 21Z" />
              </svg>
            </div>

            <h2
              className="font-extrabold text-[#0B1354] leading-[1.1] mb-3"
              style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}
            >
              Why People
              <br />
              Choose <span className="text-[#10C78A]">Mibo</span>
            </h2>
            <p
              className="text-[#6B7280] mb-10 leading-relaxed"
              style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}
            >
              Support that feels personal, professional, and accessible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {FEATURES.map(({ title, desc, Icon }, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col gap-1.5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-11 h-11 rounded-full bg-[#D6F5EE] flex items-center justify-center flex-shrink-0"
                      variants={iconFloat}
                      initial="initial"
                      animate="animate"
                    >
                      <Icon
                        className="w-6 h-6 text-[#10C78A]"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                    <p className="font-bold text-[0.9rem] text-[#0B1354]">
                      {title}
                    </p>
                  </div>
                  <div className="w-8 h-[2px] bg-[#10C78A] rounded ml-[56px]" />
                  <p
                    className="text-[#6B7280] leading-relaxed ml-[56px]"
                    style={{ fontSize: "clamp(0.88rem,1.6vw,0.94rem)" }}
                  >
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* STATS BAR */}
        <motion.div
          className="border-t border-[#E5E7EB] grid grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {STATS.map(({ icon, val, label }, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-6 sm:px-10 py-7 ${
                i < 3 ? "lg:border-r border-[#E5E7EB]" : ""
              } ${i === 0 ? "border-r border-[#E5E7EB] lg:border-r-0" : ""} ${
                i === 2 ? "border-r border-[#E5E7EB] lg:border-r-0" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-[#D6F5EE] flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-[1.7rem] sm:text-[2rem] font-extrabold text-[#0B1354] leading-none">
                  {val}
                </p>
                <p className="text-[#6B7280] text-[0.72rem] leading-snug whitespace-pre-line mt-0.5">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/*  MENTAL HEALTH SERVICES */}
      <section
        className="w-full py-16 sm:py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg,#EEF6F4 0%,#F0F4FB 50%,#EEF6F4 100%)",
        }}
      >
        <div className="absolute left-4 top-1/3 pointer-events-none opacity-40">
          {[...Array(5)].map((_, r) => (
            <div key={r} className="flex gap-2 mb-2">
              {[...Array(5)].map((_, c) => (
                <div key={c} className="w-1 h-1 rounded-full bg-[#0B1354]/25" />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute right-4 top-1/2 pointer-events-none opacity-40">
          {[...Array(5)].map((_, r) => (
            <div key={r} className="flex gap-2 mb-2">
              {[...Array(5)].map((_, c) => (
                <div key={c} className="w-1 h-1 rounded-full bg-[#0B1354]/25" />
              ))}
            </div>
          ))}
        </div>
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(circle,#10C78A,transparent 70%)",
          }}
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
          <h2
            className="font-extrabold text-[#0B1354] text-center mb-2"
            style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}
          >
            Mental Health <span className="text-[#10C78A]">Services</span>
          </h2>
          <p className="text-center text-[#6B7280] text-[0.88rem] mb-10">
            Comprehensive care for your mental wellbeing
          </p>

          {/*  service cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {MH_SERVICES.map(({ Icon, title, desc, path }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-[#E8EEF8] relative overflow-hidden"
                style={{ minHeight: 240 }}
              >
                <div
                  className="absolute bottom-0 right-0 w-24 h-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 80% 100%,#C8F0E6 0%,transparent 70%)",
                  }}
                />

                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${i === 1 ? "bg-[#DDE6F5]" : "bg-[#D6F5EE]"}`}
                >
                  <Icon
                    className={`w-6 h-6 ${i === 1 ? "text-[#3B5FC0]" : "text-[#2FA19A]"}`}
                  />
                </div>

                <h3 className="font-extrabold text-[0.9rem] text-[#0B1354] mb-2">
                  {title}
                </h3>
                <div className="w-8 h-[3px] bg-[#10C78A] rounded mb-3" />
                <p className="text-[0.88rem] text-[#888] leading-relaxed flex-1">
                  {desc}
                </p>

                <button
                  onClick={() => navigate(path)}
                  className="absolute bottom-5 right-5 text-[#2FA19A] hover:text-[#0B1354] transition-colors duration-200"
                  aria-label={`Go to ${title}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Virtual sessions banner */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row border border-[#E8EEF8] relative"
            style={{ minHeight: 200 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex-[0_0_auto] lg:w-[42%] p-8 sm:p-10 flex flex-col justify-center z-10">
              <div className="w-14 h-14 rounded-full bg-[#DDE6F5] flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-[#3B5FC0]" />
              </div>
              <h3
                className="font-extrabold text-[#0B1354] mb-2 leading-snug"
                style={{ fontSize: "clamp(0.9rem,2vw,1.1rem)" }}
              >
                Virtual sessions
                <br />
                from anywhere
              </h3>
              <div className="w-8 h-[3px] bg-[#3B5FC0] rounded mb-4" />
              <p className="text-[0.88rem] text-[#888] mb-6 leading-relaxed">
                Get the support you need, wherever you are.
              </p>
              <button
                onClick={() => navigate("/services/online")}
                className="bg-[#3B5FC0] hover:bg-[#2FA19A] text-white font-bold px-7 py-2.5 rounded-full text-[0.85rem] transition-all duration-300 self-start"
              >
                Learn More
              </button>
            </div>

            <div className="flex-1 relative min-h-[200px] lg:min-h-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="w-full h-full hidden lg:block absolute inset-0"
                  style={{
                    clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <img
                    src={virtualsection}
                    alt="Virtual therapy room"
                    className="w-full h-full object-cover"
                  />
                </div>
                <img
                  src={virtualsection}
                  alt="Virtual therapy room"
                  className="w-full h-full object-cover lg:hidden"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
