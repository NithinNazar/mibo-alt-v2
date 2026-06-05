import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CalendarCheck, MapPin, Star, Mail, Phone } from "lucide-react";
import appointment from "../assets/book-appointment.png";
import careBackground from "../assets/care-and-support-background.png";
import mibo_bangalore from "../assets/mibo_bangalore.jpg";
import mibo_mumbai from "../assets/mibo_mumbai.jpg";
import mibo_kochi from "../assets/mibo_kochi.jpg";
import depressions from "../assets/depressions.png";
import anxiety from "../assets/anxiety.png";
import obsessive from "../assets/obsessive.png";
import svgIllustration from "../assets/svg.png";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };

//  CONCERNS DATA 
const CONCERNS = [
  {
    title: "Depression",
    stat: "Affects 5% million people worldwide",
    img: depressions,
    desc: "Depression is more than just feeling sad. We offer compassionate care and evidence-based treatments to help you find hope and find joy again.",
    tags: ["Medication Management", "Lifestyle Changes", "Support Groups"],
    bg: "#FFFFFF",
    border: "#F5DDD0",
    statColor: "#E07842",
  },
  {
    title: "Generalized Anxiety Disorder",
    stat: "1 in 14 people affected globally",
    img: anxiety,
    desc: "Living with constant worry can be exhausting. Our specialized approaches help you manage anxiety and reclaim peace.",
    tags: ["Mindfulness Techniques", "Exposure Therapy", "Relaxation Training", "Stress Management"],
    bg: "#FFFFFF",
    border: "#C2D8F5",
    statColor: "#3B6FE8",
  },
  {
    title: "Obsessive Compulsive Disorder",
    stat: "Affects 2-3% of population",
    img: obsessive,
    desc: "OCD can feel overwhelming, but you're not alone. We provide specialized therapy to break free from compulsive cycles.",
    tags: ["ERP Therapy", "Medication", "Mindfulness", "Habit Reversal"],
    bg: "#FFFFFF",
    border: "#EDB8CC",
    statColor: "#C0407A",
  },
];

//  SUPPORT FEATURES DATA 
const SUPPORT_FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#10C78A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Support shaped around you",
    desc: "We look at your needs and experiences to connect you with someone who truly understands your journey and what support looks like.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#10C78A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Care that includes your loved ones",
    desc: "We bring your loved ones into the process with joint sessions, updates and resources — so you get the right support, together.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#10C78A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "Care in your language, built for your life",
    desc: "We connect you with experts who understand your language and cultural context — so you can express yourself freely and feel truly understood, without over-explaining.",
  },
];

//  LOCATIONS DATA 
const LOCATIONS = [
  {
    city: "Bengaluru", rating: 4.8, reviews: 642,
    desc: "Our Bengaluru centres offer professional mental health care in a serene environment.",
    areas: ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar"],
    amenities: ["Free Parking", "Wheelchair Accessible", "AC Consultation Rooms", "Waiting Lounge"],
    img: mibo_bangalore,
    path: "/centres/bengaluru",
  },
  {
    city: "Mumbai", rating: 4.7, reviews: 289,
    desc: "Find peace and professional care at our Mumbai locations.",
    areas: ["Bandra", "Andheri", "Powai", "Lower Parel"],
    amenities: ["Metro Access", "Valet Parking", "Cafeteria", "Library"],
    img: mibo_mumbai,
    path: "/centres/mumbai",
  },
  {
    city: "Kochi", rating: 4.9, reviews: 153,
    desc: "Experience compassionate care in our Kochi facilities designed for professional care.",
    areas: ["Marine Drive", "Ernakulam", "Kakkanad", "Edappally"],
    amenities: ["Sea View", "Garden Area", "Yoga Studio", "Meditation Space"],
    img: mibo_kochi,
    path: "/centres/kochi",
  },
];

//  OFFICES 
const OFFICES = [
  { city: "Bangalore Office", address: "22, 32nd E Cross Rd, near Carmel Convent School, 4th T Block East, Jayanagar, Bengaluru, Karnataka 560041" },
  { city: "Kochi Office", address: "38/1818, Kannanthodath Road, Near Changampuzha Park Metro Station, Edappally P.O., Kochi, Ernakulam, PIN: 682024" },
  { city: "Mumbai Office", address: "Sayba Emerald, 207/208, above Burger King, opposite Bandra Railway Station, Bandra West, Mumbai 400050" },
];

//  CARD ICONS 
const CardIcon = ({ index, color }) => {
  if (index === 0) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 5 5 8.5c0 2.5 1.5 4.5 3 6l4 4.5 4-4.5c1.5-1.5 3-3.5 3-6C19 5 16 2 12 2z" />
      <circle cx="12" cy="8" r="2" fill={color} fillOpacity="0.3" />
    </svg>
  );
  if (index === 1) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      <path d="M8 15s1.5-2 4-2 4 2 4 2" />
      <circle cx="9" cy="10" r="1" fill={color} />
      <circle cx="15" cy="10" r="1" fill={color} />
    </svg>
  );
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 2.5-2.5 3-2.5 4.5" />
      <circle cx="12" cy="17.5" r=".8" fill={color} />
    </svg>
  );
};

export default function ConcernsRealCareSection() {
  const navigate = useNavigate();
  const [officeIdx, setOfficeIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setOfficeIdx(p => (p + 1) % OFFICES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* MENTAL HEALTH CONCERNS*/}
      <section className="w-full py-20 bg-[#F7F8FC]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-extrabold text-[#0B1354] mb-1" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
              Mental Health Concerns
            </h2>
            <h2 className="font-extrabold mb-4" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
              <span className="text-[#10C78A]">We </span>
              <span className="text-[#10C78A] underline decoration-[#10C78A] decoration-2 underline-offset-4">Care For</span>
            </h2>
            <p className="text-[#888] max-w-2xl mx-auto leading-relaxed" style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}>
              Mibo offers comprehensive support for 30+ mental health conditions. Explore some of the most common concerns below to see how we approach care.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            {CONCERNS.map(({ title, stat, desc, tags, bg, statColor, img }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl flex flex-col shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ background: bg }}
              >
                <div className="flex items-stretch" style={{ minHeight: 170 }}>

                  <div className="flex flex-col justify-start pt-5 pl-5 pr-2 flex-1 min-w-0">

                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-xl mb-3"
                      style={{
                        width: 56,
                        height: 56,
                        background: `${statColor}18`,
                        border: `1.5px solid ${statColor}30`,
                      }}
                    >
                      <CardIcon index={i} color={statColor} />
                    </div>

                    <h3
                      className="font-extrabold text-[#0B1354] leading-snug"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {title}
                    </h3>

                    <p
                      className="font-semibold leading-snug mt-1"
                      style={{ color: statColor, fontSize: "0.76rem" }}
                    >
                      {stat}
                    </p>

                    <div
                      className="mt-2 rounded-full"
                      style={{ width: 28, height: 3, background: statColor }}
                    />
                  </div>

                  <div
                    className="flex-shrink-0 relative"
                    style={{
                      width: "46%",
                      maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                      WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                    }}
                  >
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/*  BODY  */}
                <div className="px-5 pb-5 flex flex-col flex-1">
                  <p className="text-[0.88rem] text-[#555] leading-relaxed mb-4 flex-1">{desc}</p>

                  {/* Treatment approaches label */}
                  <p
                    className="text-[0.68rem] font-extrabold tracking-widest uppercase mb-2.5"
                    style={{ color: statColor }}
                  >
                    Treatment Approaches
                  </p>

                  {/* Tag pills */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map((t, j) => (
                      <span
                        key={j}
                        className="flex items-center gap-1.5 text-[0.72rem] font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: `${statColor}12`, color: "#444" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={statColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          {j % 4 === 0 && <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></>}
                          {j % 4 === 1 && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />}
                          {j % 4 === 2 && <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>}
                          {j % 4 === 3 && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>}
                        </svg>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Book Consultation */}
                  <button
                    onClick={() => navigate("/experts")}
                    className="w-full bg-white font-bold py-3 rounded-full text-[0.82rem] transition-all duration-300 hover:opacity-80 flex items-center justify-center gap-2"
                    style={{ border: `1.5px solid ${statColor}`, color: statColor }}
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Consultation
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* REAL CARE ADAPTS*/}
      <section className="w-full py-20 relative overflow-hidden" style={{ background: "#000D44" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle,#10C78A,transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle,#3B5FC0,transparent 70%)", transform: "translate(-30%,30%)" }} />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

          {/* LEFT */}
          <motion.div
            className="flex-1 lg:pr-12"
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <h2 className="font-extrabold text-white leading-tight mb-1" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
              Real care adapts to
            </h2>
            <h2 className="font-extrabold text-[#10C78A] leading-tight" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>your life,</h2>
            <h2 className="font-extrabold text-[#10C78A] leading-tight" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>your people,</h2>
            <h2 className="font-extrabold text-[#10C78A] leading-tight mb-5" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>your pace.</h2>
            <div className="flex items-center gap-1 mb-6">
              <div className="w-8 h-[3px] bg-[#10C78A] rounded" />
              <div className="w-2 h-[3px] bg-[#10C78A] rounded" />
            </div>
            <p className="text-white/70 leading-relaxed" style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}>Care doesn't happen in isolation.</p>
            <p className="text-white/70 leading-relaxed mb-10" style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}>It works when it's rooted in your everyday life.</p>

            <div className="grid grid-cols-3 border-t border-white/10 mt-4">
              {[
                {
                  title: "Personalized\nCare",
                  sub: "Tailored support that fits your life.",
                  icon: <svg className="w-7 h-7 text-[#10C78A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                  iconBg: "bg-[#0d2558]",
                },
                {
                  title: "For You &\nYour People",
                  sub: "Care that includes what matters most.",
                  icon: <svg className="w-7 h-7 text-[#10C78A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                  iconBg: "bg-[#0d2558]",
                },
                {
                  title: "Peace of\nMind",
                  sub: "Support that brings balance, every day.",
                  icon: <svg className="w-7 h-7 text-[#7B6FE8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2 0-5 2-5 5.5 0 2 1 3.5 2 5l3 3.5 3-3.5c1-1.5 2-3 2-5C17 5 14 3 12 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 16.5v1.5a2.5 2.5 0 005 0v-1.5" /></svg>,
                  iconBg: "bg-[#1a1458]",
                },
              ].map(({ title, sub, icon, iconBg }, i) => (
                <div key={i} className={`flex flex-col items-center text-center px-3 pt-7 pb-2 ${i < 2 ? "border-r border-white/10" : ""}`}>
                  <div className={`w-[60px] h-[60px] rounded-full ${iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                    {icon}
                  </div>
                  <div className="w-6 h-[2px] bg-[#10C78A] rounded mb-3" />
                  <p className="text-white font-bold text-[0.82rem] whitespace-pre-line leading-snug mb-2">{title}</p>
                  <p className="text-white/50 text-[0.72rem] leading-snug">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="relative flex-shrink-0 w-full lg:w-[46%] flex flex-col items-center lg:items-end"
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
          >
            <img
              src={appointment}
              alt="Woman reading"
              className="relative z-10 w-full max-w-[480px] h-auto object-contain"
            />
            <button
              onClick={() => navigate("/experts")}
              className="mt-6 bg-[#10C78A] hover:bg-[#0eb07a] text-white font-bold px-7 py-3.5 rounded-full text-[0.88rem] shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2.5"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Appointment
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* SUPPORT FEATURES */}
      <section className="w-full bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          >
            {SUPPORT_FEATURES.map(({ icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="w-12 h-12 rounded-full bg-[#D6F5EE] flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="text-[0.9rem] font-extrabold text-[#0B1354] mb-2 leading-snug">{title}</h3>
                <div className="w-7 h-[3px] bg-[#10C78A] rounded mb-3" />
                <p className="text-[0.88rem] text-[#6B7280] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LOCATIONS*/}
      <section
        className="w-full py-20 relative overflow-hidden"
        style={{
          background: "#0B1354",
          backgroundImage: `url(${careBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <MapPin className="w-5 h-5 text-[#10C78A]" />
              <MapPin className="w-5 h-5 text-[#10C78A]" />
            </div>
            <h2 className="font-extrabold text-white mb-3" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
              Care and Support Near You
            </h2>
            <p className="text-white/70 max-w-xl mx-auto leading-relaxed" style={{ fontSize: "clamp(0.98rem,1.6vw,1.2rem)" }}>
              Our centres across India bring expert mental health care close to you.<br />
              Each location is designed for comfort, privacy, and healing.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          >
            {LOCATIONS.map(({ city, rating, reviews, desc, areas, amenities, img, path }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-52 flex-shrink-0">
                  <img src={img} alt={city} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md"
                    style={{ background: "#0B1354" }}>
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span className="text-[0.8rem] font-bold text-white">{city}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[0.8rem] font-bold text-[#333]">{rating}</span>
                    <span className="text-[0.72rem] text-[#999]">({reviews})</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[0.88rem] text-[#555] leading-relaxed mb-4">{desc}</p>

                  <p className="text-[0.7rem] font-extrabold tracking-widest text-[#0B1354] uppercase mb-2.5">
                    Locations in {city}
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4">
                    {areas.map((a, j) => (
                      <div key={j} className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#10C78A] flex-shrink-0" />
                        <span className="text-[0.78rem] text-[#444] font-medium">{a}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[0.7rem] font-extrabold tracking-widest text-[#0B1354] uppercase mb-2.5">
                    Amenities
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-5 flex-1">
                    {amenities.map((a, j) => {
                      const icons = [
                        <svg key="car" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3v-4l2-5h14l2 5v4h-2m-2 0H7m10 0a2 2 0 11-4 0 2 2 0 014 0zM7 17a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                        <svg key="wc" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="6" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 22V12H6l2-6h8l2 6h-4v10" /></svg>,
                        <svg key="ac" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1011 8H2m10.59 11.41A2 2 0 1013 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>,
                        <svg key="sofa" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2M4 9a2 2 0 00-2 2v4h20v-4a2 2 0 00-2-2M4 9h16M4 15v3m16-3v3" /></svg>,
                      ];
                      return (
                        <div key={j} className="flex items-center gap-2 bg-[#F4F7FF] rounded-lg px-3 py-2">
                          <span className="text-[#3B6FE8]">{icons[j % icons.length]}</span>
                          <span className="text-[0.72rem] text-[#444] font-medium leading-tight">{a}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => navigate(path)}
                    className="w-full text-white font-bold py-3 rounded-xl text-[0.84rem] transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: "#0B1354" }}
                  >
                    View Centre Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="w-full py-16 sm:py-20" style={{ background: "linear-gradient(135deg, #EAF4FF 0%, #F0F8FF 50%, #E8F5FF 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <motion.div
            className="relative rounded-3xl shadow-xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #EEF6FF 0%, #F5FAFF 60%, #EAF4FF 100%)" }}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, #C8EDF9 0%, transparent 70%)", transform: "translate(-40%,-40%)" }} />
            <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, #C8EDF9 0%, transparent 70%)", transform: "translate(30%,30%)" }} />

            <div className="absolute top-0 right-0 pointer-events-none" style={{ width: "clamp(220px, 42%, 480px)" }}>
              <img
                src={svgIllustration}
                alt="Support illustration"
                className="w-full h-auto object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <div className="w-12 h-12 rounded-full bg-[#D6F5EE] flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10C78A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                </svg>
              </div>

              <h2
                className="font-extrabold text-[#0B1354] mb-5 leading-tight"
                style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", maxWidth: "55%" }}
              >
                Still not sure what to do?
              </h2>

              <div className="flex items-center gap-2 text-[#555] text-[0.86rem] mb-2">
                <Phone className="w-4 h-4 text-[#10C78A] flex-shrink-0" />
                <span>Please call us, we will sort it out</span>
              </div>
              <p className="font-extrabold text-[#10C78A] mb-4" style={{ fontSize: "clamp(1.3rem,3vw,1.7rem)" }}>
                +91 90833 35000
              </p>
              <div className="w-12 h-[3px] bg-gradient-to-r from-[#10C78A] to-[#3B8FE8] rounded mb-8" />

              <div className="relative overflow-hidden mb-4" style={{ height: 110, maxWidth: 520 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={officeIdx}
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 border border-[#10C78A] rounded-2xl p-5 bg-white/60 backdrop-blur-sm flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#D6F5EE] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#10C78A]" />
                    </div>
                    <div>
                      <p className="text-[0.9rem] font-bold text-[#10C78A] mb-1">{OFFICES[officeIdx].city}</p>
                      <p className="text-[0.78rem] text-[#666] leading-relaxed">{OFFICES[officeIdx].address}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-2 mb-8">
                {OFFICES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOfficeIdx(i)}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === officeIdx ? "bg-[#10C78A] scale-110" : "bg-[#B8D9F0]"}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D6F5EE] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#10C78A]" />
                </div>
                <div>
                  <p className="text-[0.75rem] font-bold text-[#0B1354]">Email Us</p>
                  <a href="mailto:reach@mibocare.com" className="text-[#10C78A] font-semibold text-[0.85rem] hover:underline">
                    reach@mibocare.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}