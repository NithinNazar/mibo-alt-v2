import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Heart, Users, Play, UserCheck } from "lucide-react";
import Lottie from "lottie-react";
const sampleVideo =
  "https://ajadcreatives.com/wp-content/uploads/2026/02/therapy-and-psychatry.mp4";
import offeringsAnimation from "../assets/animations/healthinsurance.json";

const OfferingsAndTherapy = () => {
  const navigate = useNavigate();
  // Animation variants
  const containerVariant: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.35 } },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 3, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Card slide-in animation variants
  const cardContainerVariant: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariant}
      className="w-full bg-[#E8F5F3] py-16"
    >
      {/* Mobile View - Stacked Layout */}
      <div className="block lg:hidden max-w-md mx-auto px-6">
        {/* Mental Healthcare Offerings - Mobile */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="w-32 h-32 flex items-center justify-center mb-4">
              <Lottie
                animationData={offeringsAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#2b2b2b] mb-2">
                Our Mental Healthcare
              </h1>
              <h2 className="text-2xl font-bold text-[#2FA19A]">Offerings</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#4c4c4c] text-base leading-relaxed mb-6"
          >
            We are a mental health ecosystem that brings together multiple
            treatment options to create an experience that makes getting help
            easy and seamless. From assessment to treatment, we're with you
            every step of the way.
          </motion.p>

          {/* Offering Cards - Mobile with Animations */}
          <div className="space-y-4">
            {/* Card 1 - Slide from Right */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{
                once: true,
                amount: 0.5,
                margin: "0px 0px -100px 0px",
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-gradient-to-br from-white to-[#f0fffe] rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-3"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-[#2FA19A] to-[#25857d] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-[#2b2b2b] mb-1">
                  Comprehensive Assessment
                </h3>
                <p className="text-xs text-[#4c4c4c]">
                  Thorough evaluation to understand your unique needs
                </p>
              </div>
            </motion.div>

            {/* Card 2 - Slide from Left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{
                once: true,
                amount: 0.5,
                margin: "0px 0px -100px 0px",
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              className="bg-gradient-to-br from-white to-[#f0fffe] rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-3"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-[#2FA19A] to-[#25857d] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-[#2b2b2b] mb-1">
                  Multidisciplinary Team
                </h3>
                <p className="text-xs text-[#4c4c4c]">
                  Collaborative approach with various specialists
                </p>
              </div>
            </motion.div>

            {/* Card 3 - Slide from Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.5,
                margin: "0px 0px -100px 0px",
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.4,
              }}
              className="bg-gradient-to-br from-white to-[#f0fffe] rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-3"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-[#2FA19A] to-[#25857d] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              >
                <UserCheck className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-[#2b2b2b] mb-1">
                  Personalized Treatment
                </h3>
                <p className="text-xs text-[#4c4c4c]">
                  Tailored care plans designed for your specific journey
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Therapy & Psychiatry - Mobile */}
        <motion.div
          variants={itemVariant}
          className="bg-[#dff4f5] rounded-3xl p-6 shadow-xl"
        >
          {/* Video Section */}
          <div className="relative mb-6 rounded-2xl overflow-hidden">
            <video
              src={sampleVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
            <button className="absolute top-4 left-4 bg-white/90 hover:bg-white text-[#2b2b2b] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all">
              <Play className="w-4 h-4" />
              Watch Introduction
            </button>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-[#18356C] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2b2b2b]">
                Therapy & <span className="text-[#2FA19A]">Psychiatry</span>
              </h2>
            </div>
          </div>

          <p className="text-[#4c4c4c] text-base leading-relaxed mb-4">
            Our professionals are highly qualified and trained to deliver
            quality and compassionate clinical treatment across ages through
            therapy, psychiatry, mental health support for your child and
            couples therapy.
          </p>

          <p className="text-[#4c4c4c] text-base leading-relaxed mb-6">
            They follow proprietary protocols & undergo peer supervision to
            ensure you get exceptional care, now in person too. Meet your mental
            health expert today.
          </p>

          {/* Stats - Mobile */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#18356C]">50+</div>
              <div className="text-xs text-[#4c4c4c]">Expert Clinicians</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#18356C]">10k+</div>
              <div className="text-xs text-[#4c4c4c]">Sessions Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#18356C]">95%</div>
              <div className="text-xs text-[#4c4c4c]">Patient Satisfaction</div>
            </div>
          </div>

          <button
            onClick={() => navigate("/experts")}
            className="w-full bg-[#2FA19A] hover:bg-[#2a9d8c] text-white font-semibold py-3 px-6 rounded-full text-sm transition-all uppercase"
          >
            EXPLORE OUR EXPERTS
          </button>
        </motion.div>
      </div>

      {/* Desktop View - Side by Side Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-8 gap-8 items-stretch">
        {/* Left Side - Mental Healthcare Offerings */}
        <motion.div variants={itemVariant} className="w-[45%]">
          <div className="flex flex-col items-start mb-8">
            <div className="w-40 h-40 flex items-center justify-start mb-6">
              <Lottie
                animationData={offeringsAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-[#2b2b2b] leading-tight">
                Our Mental Healthcare
              </h1>
              <h2 className="text-4xl font-bold text-[#2FA19A]">Offerings</h2>
            </div>
          </div>

          <p className="text-[#4c4c4c] text-lg leading-relaxed mb-8">
            We are a mental health ecosystem that brings together multiple
            treatment options to create an experience that makes getting help
            easy and seamless. From assessment to treatment, we're with you
            every step of the way.
          </p>

          {/* Offering Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardContainerVariant}
            className="space-y-6"
          >
            <motion.div
              variants={cardVariant}
              className="group bg-gradient-to-r from-white via-[#f5fffe] to-[#e8f9f8] hover:from-[#e8f9f8] hover:via-[#d5f5f7] hover:to-[#c5f0f2] rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#2FA19A] to-[#25857d] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2b2b2b] mb-1">
                  Comprehensive Assessment
                </h3>
                <p className="text-sm text-[#4c4c4c]">
                  Thorough evaluation to understand your unique needs
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              className="group bg-gradient-to-r from-white via-[#f5fffe] to-[#e8f9f8] hover:from-[#e8f9f8] hover:via-[#d5f5f7] hover:to-[#c5f0f2] rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#2FA19A] to-[#25857d] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2b2b2b] mb-1">
                  Multidisciplinary Team
                </h3>
                <p className="text-sm text-[#4c4c4c]">
                  Collaborative approach with various specialists
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              className="group bg-gradient-to-r from-white via-[#f5fffe] to-[#e8f9f8] hover:from-[#e8f9f8] hover:via-[#d5f5f7] hover:to-[#c5f0f2] rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#2FA19A] to-[#25857d] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2b2b2b] mb-1">
                  Personalized Treatment
                </h3>
                <p className="text-sm text-[#4c4c4c]">
                  Tailored care plans designed for your specific journey
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Therapy & Psychiatry */}
        <motion.div variants={itemVariant} className="w-[55%] flex flex-col">
          {/* Video Section with Rounded Rectangle - Outside Card */}
          <div className="relative mb-6 rounded-3xl overflow-hidden shadow-xl">
            <video
              src={sampleVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-80 object-cover"
            />
            <button className="absolute top-6 left-6 bg-white/95 hover:bg-white text-[#2b2b2b] px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-lg">
              <Play className="w-5 h-5" />
              Watch Introduction
            </button>
          </div>

          {/* Card Content */}
          <div className="flex-1 bg-gradient-to-br from-[#dff4f5] to-[#d0eef0] rounded-3xl p-8 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-[#18356C] rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#2b2b2b]">
                  Therapy & <span className="text-[#2FA19A]">Psychiatry</span>
                </h2>
              </div>
            </div>

            <p className="text-[#4c4c4c] text-base leading-relaxed mb-3">
              Our professionals are highly qualified and trained to deliver
              quality and compassionate clinical treatment across ages through
              therapy, psychiatry, mental health support for your child and
              couples therapy.
            </p>

            <p className="text-[#4c4c4c] text-base leading-relaxed mb-6">
              They follow proprietary protocols & undergo peer supervision to
              ensure you get exceptional care, now in person too. Meet your
              mental health expert today.
            </p>

            {/* Stats Row - No Background */}
            <div className="flex justify-between items-center mb-6 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#18356C]">50+</div>
                <div className="text-xs text-[#4c4c4c] mt-1">
                  Expert Clinicians
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#18356C]">10k+</div>
                <div className="text-xs text-[#4c4c4c] mt-1">
                  Sessions Delivered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#18356C]">95%</div>
                <div className="text-xs text-[#4c4c4c] mt-1">
                  Patient Satisfaction
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/experts")}
              className="w-full bg-[#2FA19A] hover:bg-[#2a9d8c] text-white font-semibold py-4 px-6 rounded-full text-sm transition-all uppercase shadow-lg hover:shadow-xl hover:scale-105"
            >
              EXPLORE OUR EXPERTS
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OfferingsAndTherapy;
