import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import banner from "../assets/families.png";
import individual from "../assets/individual.png";
import couple from "../assets/couple.png";
import children from "../assets/children.png";
import corporate from "../assets/corporate.png";

import led100 from "../assets/led-100.png";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };
const fromLeft = (delay = 0) => ({ hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } } });
const fromRight = (delay = 0) => ({ hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } } });

const IMPACT = [
  {
    val: "92%", label: "Reported improved emotional well-being",
    accent: "#10C78A", bg: "#D6F5EE",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    val: "87%", label: "Experienced reduction in anxiety levels",
    accent: "#3B5FC0", bg: "#DDE6F5",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3B5FC0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3" />
        <path d="M12 11v4" />
        <path d="M9 17c0-1.5 1.35-2.5 3-2.5s3 1 3 2.5" />
        <path d="M8 13c-1.5.5-3 1.5-3 3" />
        <path d="M16 13c1.5.5 3 1.5 3 3" />
      </svg>
    ),
  },
  {
    val: "76%", label: "Felt more productive and focused at work",
    accent: "#10C78A", bg: "#D6F5EE",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    val: "94%", label: "Showed higher engagement in therapy",
    accent: "#3B5FC0", bg: "#DDE6F5",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3B5FC0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

const WHO = [
  {
    title: "For Families",
    desc: "Personalized programs that help families strengthen communication, build resilience, and support each other.",
    img: banner,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "For Individuals",
    desc: "Tailored experiences designed for self-growth, mental well-being, and achieving personal goals.",
    img: individual,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 10-16 0" />
      </svg>
    ),
  },
  {
    title: "For Couples",
    desc: "Guided sessions to help couples strengthen their bond, resolve challenges, and grow together.",
    img: couple,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    title: "For Children",
    desc: "Engaging and age-appropriate activities that support emotional development, creativity, and confidence.",
    img: children,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 12v4m-2 4h4" />
        <path d="M8 20c0-2.5 1.5-4 4-4s4 1.5 4 4" />
      </svg>
    ),
  },
  {
    title: "For Corporate",
    desc: "Enterprise-ready infrastructure designed to deliver real-time impact data, enabling tailored programs that drive measurable outcomes.",
    img: corporate,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
];

function WhoCard({ title, desc, img, icon, variants }: { title: string; desc: string; img: string; icon: JSX.Element; variants: any }) {
  return (
    <motion.div
      variants={variants}
      className="bg-white rounded-3xl flex flex-col overflow-hidden relative"
      style={{ boxShadow: "0 4px 28px rgba(0,0,0,0.07)", border: "1px solid #E8F0EE" }}
    >

      {/* top content */}
      <div className="p-7 pb-4 flex-1">
        <div className="relative mb-5" style={{ width: 56, height: 56 }}>
          <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid #10C78A", opacity: 0.25 }} />
          <div className="absolute rounded-full bg-[#D6F5EE] flex items-center justify-center" style={{ top: 6, right: 6, bottom: 6, left: 6 }}>
            {icon}
          </div>
        </div>

        <h3 className="font-extrabold text-[#0B1354] mb-2" style={{ fontSize: "0.9rem" }}>{title}</h3>
        <div className="rounded-full bg-[#10C78A] mb-4" style={{ width: 30, height: 3 }} />
        <p className="text-[#6B7280] leading-relaxed" style={{ fontSize: "0.88rem" }}>{desc}</p>
      </div>

      <div className="w-full px-2 pb-4">
        <img
          src={img}
          alt={title}
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

export default function ImpactWhoSection() {
  const navigate = useNavigate();
  return (
    <>
      {/* OUR MEASURABLE IMPACT */}
      <section className="w-full py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#EEF6F8 0%,#F5F8FF 50%,#EEF6F8 100%)" }}
      >
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle,#B8EDE4,transparent 70%)" }} />
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle,#C5D8F8,transparent 70%)" }} />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

          {/* header */}
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-[1.5px] bg-[#10C78A] rounded" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6 2 4 8 4 12c0 0 4-2 8-2s8 2 8 2c0-4-2-10-8-10z" />
                <path d="M12 10v12" />
              </svg>
              <div className="w-6 h-[1.5px] bg-[#10C78A] rounded" />
            </div>
            <h2 className="font-extrabold text-[#0B1354] mb-4" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
              Our Measurable <span className="text-[#10C78A]">Impact</span>
            </h2>
            <p className="text-[#555] max-w-2xl mx-auto leading-relaxed" style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}>
              At Mibo, we focus on improving emotional wellness, enhancing mental resilience,<br className="hidden sm:block" />
              and creating measurable impact for individuals and organizations alike.
            </p>
          </motion.div>

          {/* stat cards */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          >
            {IMPACT.map(({ val, label, accent, bg, icon }, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.8)" }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl" style={{ background: accent }} />

                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: bg }}>
                  {icon}
                </div>

                <p className="font-extrabold leading-none mb-2" style={{ color: accent, fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>{val}</p>

                <div className="w-7 h-[3px] rounded mb-3" style={{ background: accent }} />

                <p className="text-[0.78rem] text-[#555] leading-snug">{label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="rounded-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between"
            style={{ background: "#F0F4F8", border: "1px solid #E2EAF4", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", minHeight: 160 }}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center gap-6 p-8 sm:p-10 flex-1">
              <div className="w-16 h-16 rounded-full bg-[#D6F5EE] flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-[#10C78A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M9 21V9m6 12V5M5 21V13" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-[#0B1354] leading-none mb-1" style={{ fontSize: "clamp(2rem,4vw,2.6rem)" }}>100+</p>
                <p className="font-bold text-[#0B1354]" style={{ fontSize: "clamp(0.9rem,1.5vw,1rem)" }}>Organizations transformed</p>
                <p className="text-[0.82rem] text-[#6B7280]">through our mental wellness programs</p>
              </div>
            </div>

            <div
              className="flex-shrink-0 lg:w-[380px] h-40 lg:h-full flex items-end justify-end"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
              }}
            >
              <img
                src={led100}
                alt="City illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* WHO IT'S FOR — "Tailored for those who lead, seek, and listen" */}
      <section className="w-full py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#EEF6F8 0%,#F5F8FF 50%,#EEF6F8 100%)" }}
      >
        <div className="absolute top-8 right-8 pointer-events-none opacity-30">
          {[...Array(6)].map((_, r) => (
            <div key={r} className="flex gap-3 mb-3">
              {[...Array(6)].map((_, c) => (
                <div key={c} className="w-1.5 h-1.5 rounded-full bg-[#0B1354]/20" />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle,#B8EDE4,transparent 70%)" }} />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

          {/* header */}
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <h2 className="font-extrabold text-[#0B1354] mb-1" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>Tailored for those who</h2>
            <h2 className="font-extrabold text-[#10C78A] mb-5" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>lead, seek, and listen</h2>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-12 h-[3px] bg-[#0B1354] rounded" />
              <div className="w-2 h-2 rounded-full bg-[#10C78A]" />
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          >
            {WHO.slice(0, 3).map(({ title, desc, img, icon }, i) => (
              <WhoCard key={i} title={title} desc={desc} img={img} icon={icon} variants={fadeUp} />
            ))}
          </motion.div>

          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          >
            {WHO.slice(3).map(({ title, desc, img, icon }, i) => (
              <WhoCard key={i} title={title} desc={desc} img={img} icon={icon} variants={fadeUp} />
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
}