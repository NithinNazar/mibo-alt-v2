import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Lottie from "lottie-react";
import { /* ChevronRight */ Play, Users, Heart } from "lucide-react";
import sampleVideo from "../assets/therapy and psychatry.mp4";
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Comprehensive Assessment",
      description: "Thorough evaluation to understand your unique needs"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multidisciplinary Team",
      description: "Collaborative approach with various specialists"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Personalized Treatment",
      description: "Customized plans based on your specific requirements"
    }
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariant}
      className="w-full max-w-7xl mx-auto"
    >
      {/* Desktop Layout - Horizontal */}
      <div className="hidden lg:block md:block">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column - Content */}
          <motion.div 
            variants={itemVariant}
            className="lg:w-2/5 space-y-8"
          >
            {/* Decorative Animation */}
            <div className="relative">
              <div className="w-48 h-48 opacity-80 -mb-3 -ml-8">
                <Lottie
                  animationData={offeringsAnimation}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Our Mental Healthcare <span className="text-[#34b9a5]">Offerings</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We are a mental health ecosystem that brings together multiple 
                treatment options to create an experience that makes getting help 
                easy and seamless. From assessment to treatment, we're with you 
                every step of the way.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:from-[#E3F7F1] hover:to-[#D7EFFF] transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#34b9a5] to-[#2FA19A] text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            {/* <motion.div 
              variants={itemVariant}
              className="pt-4"
            >
              <button
                onClick={() => navigate("/services")}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#18356C] to-[#040a47] text-white font-semibold py-4 px-8 rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Explore Our Services</span>
                <ChevronRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div> */}
          </motion.div>

          {/* Right Column - Video & Psychiatry Section */}
          <motion.div 
            variants={itemVariant}
            className="lg:w-3/5 space-y-12"
          >
            {/* Video Section */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <video
                  src={sampleVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl" />
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-4 py-2 rounded-full">
                    <Play size={18} />
                    Watch Introduction
                  </span>
                </div>
              </div>
            </div>

            {/* Therapy & Psychiatry Section */}
            <div className="bg-gradient-to-br from-[#E3F7F1] to-[#D7EFFF] rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#18356C] to-[#040a47] flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Therapy & <span className="text-[#34b9a5]">Psychiatry</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      Our professionals are highly qualified and trained to deliver 
                      quality and compassionate clinical treatment across ages through 
                      therapy, psychiatry, mental health support for your child and 
                      couples therapy.
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      They follow proprietary protocols & undergo peer supervision to 
                      ensure you get exceptional care, now in person too. Meet your 
                      mental health expert today.
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#18356C]">50+</div>
                      <div className="text-sm text-gray-600">Expert Clinicians</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#18356C]">10k+</div>
                      <div className="text-sm text-gray-600">Sessions Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#18356C]">95%</div>
                      <div className="text-sm text-gray-600">Patient Satisfaction</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate("/experts")}
                    className="w-full bg-gradient-to-r from-[#34b9a5] to-[#2FA19A] text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    EXPLORE OUR EXPERTS
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout - Vertical (Keep Original Design) */}
      <div className="lg:hidden md:hidden max-w-md mx-auto bg-white pb-14 relative">
        {/* Decorative Animated Icon at Top Middle */}
        <div className="absolute -top-26 left-1/2 transform -translate-x-1/2 w-40 h-28 z-0 opacity-75">
          <Lottie
            animationData={offeringsAnimation}
            loop={true}
            className="w-full h-full"
          />
        </div>

        {/* First Section - Our mental healthcare offerings */}
        <motion.div
          variants={itemVariant}
          className="text-center px-8 pt-32 pb-6 relative z-10"
        >
          <h1 className="text-[1.563rem] font-[700] text-[rgb(76,76,76)] mb-6 leading-tight">
            Our mental healthcare offerings
          </h1>
          <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
            We are a mental health ecosystem that brings together multiple
            treatment options to create an experience that makes getting help easy
            and seamless. From assessment to treatment, we're with you every step
            of the way.
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          variants={itemVariant}
          className="flex flex-col items-center text-center px-4 pb-4 pt-16 relative z-10"
        >
          <div className="w-80 h-80 rounded-full overflow-hidden flex items-center justify-center bg-black">
            <video
              src={sampleVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </motion.div>

        {/* Second Section - Therapy & Psychiatry */}
        <motion.div
          variants={itemVariant}
          className="px-8 pb-16 pt-16 relative z-10"
        >
          <h2 className="text-[1.563rem] text-center font-[700] text-[rgb(76,76,76)] mb-4">
            Therapy & Psychiatry
          </h2>

          <div className="space-y-6">
            <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
              Our professionals are highly qualified and trained to deliver
              quality and compassionate clinical treatment across ages through
              therapy, psychiatry, mental health support for your child and
              couples therapy.
            </p>

            <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.95rem] text-center font-semibold">
              They follow proprietary protocols & undergo peer supervision to
              ensure you get exceptional care, now in person too. Meet your
              mental health expert today.
            </p>
          </div>

          {/* CTA Button */}
          <motion.div variants={itemVariant} className="mt-8">
            <button
              onClick={() => navigate("/experts")}
              className="w-full bg-[#18356C] hover:bg-[#2FA19A] text-white font-semibold py-4 px-6 rounded-full text-base transition-colors duration-200 uppercase tracking-wide"
            >
              EXPLORE EXPERTS
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OfferingsAndTherapy;