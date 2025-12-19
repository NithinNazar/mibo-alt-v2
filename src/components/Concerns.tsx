import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import depressionIcon from "../assets/depression.gif";
import stress from "../assets/anxiety.gif";
import doubt from "../assets/doubt.gif";

const MentalHealthConcerns = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Animation variants
  const containerVariant: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Mobile slider animation variants - smoother transitions
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const concerns = [
    {
      name: "Depression",
      stats: "Affects 5% million people worldwide",
      description:
        "Depression is more than just feeling sad. We offer compassionate care and evidence-based treatments to help you find hope and find joy again.",
      icon: depressionIcon,
      bgColor: "bg-[#FFF5E6]",
      treatments: [
        "Medication Management",
        "Lifestyle Changes",
        "Support Groups",
      ],
    },
    {
      name: "Generalized Anxiety Disorder",
      stats: "1 in 14 people affected globally",
      description:
        "Living with constant worry can be exhausting. Our specialized approaches help you manage anxiety and reclaim peace.",
      icon: stress,
      bgColor: "bg-[#E6F4FF]",
      treatments: [
        "Mindfulness Techniques",
        "Exposure Therapy",
        "Relaxation Training",
        "Stress Management",
      ],
    },
    {
      name: "Obsessive Compulsive Disorder",
      stats: "Affects 2-3% of population",
      description:
        "OCD can feel overwhelming, but you're not alone. We provide specialized therapy to break free from compulsive cycles.",
      icon: doubt,
      bgColor: "bg-[#FFE6F0]",
      treatments: [
        "ERP Therapy",
        "Medication",
        "Mindfulness",
        "Habit Reversal",
      ],
    },
  ];

  // Auto-slide for mobile with pause functionality
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % concerns.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [concerns.length, isPaused]);

  // Resume auto-slide after manual interaction
  useEffect(() => {
    if (!isPaused) return;

    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
    }, 5000); // Resume after 5 seconds

    return () => clearTimeout(resumeTimer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setIsPaused(true); // Pause auto-slide when user manually navigates
  };

  return (
    <div className="w-full py-16">
      {/* Mobile View - Horizontal Slider */}
      <div className="block lg:hidden max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2b2b2b] mb-3">
            Mental Health Concerns We Care For
          </h1>
          <p className="text-base font-medium text-[#4c4c4c] leading-relaxed">
            Mibo offers comprehensive support for 30+ mental health conditions.
            Explore some of the most common concerns below to see how we
            approach care.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden mb-6">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.4 },
              }}
              className={`${concerns[currentSlide].bgColor} rounded-2xl p-6 shadow-lg`}
            >
              {/* Icon and Title Row */}
              <div className="flex items-start gap-4 mb-4">
                {/* Icon */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={concerns[currentSlide].icon}
                    alt={concerns[currentSlide].name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Title and Stats */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#2b2b2b] mb-1">
                    {concerns[currentSlide].name}
                  </h3>
                  <p className="text-sm font-medium text-[#4c4c4c]">
                    {concerns[currentSlide].stats}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-base font-medium text-[#4c4c4c] leading-relaxed mb-4">
                {concerns[currentSlide].description}
              </p>

              {/* Treatment Approaches */}
              <div className="mb-4">
                <p className="text-sm font-bold text-[#2b2b2b] mb-2 uppercase">
                  Treatment Approaches
                </p>
                <div className="flex flex-wrap gap-2">
                  {concerns[currentSlide].treatments.map((treatment, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white/60 rounded-full text-sm font-medium text-[#4c4c4c]"
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button className="text-base text-[#2FA19A] font-bold hover:underline text-left">
                  Learn More
                </button>
                <button
                  onClick={() => navigate("/experts")}
                  className="w-full bg-[#18356C] hover:bg-[#2a4a8f] text-white font-bold py-3 px-6 rounded-full text-base transition-all"
                >
                  Book Consultation
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {concerns.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-[#18356C]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop View - Three Cards Side by Side */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2b2b2b] mb-4">
            Mental Health Concerns We Care For
          </h1>
          <p className="text-base text-[#4c4c4c] leading-relaxed max-w-3xl mx-auto">
            Mibo offers comprehensive support for 30+ mental health conditions.
            Explore some of the most common concerns below to see how we
            approach care.
          </p>
        </div>

        {/* Three Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariant}
          className="grid grid-cols-3 gap-6"
        >
          {concerns.map((concern, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className={`${concern.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col`}
            >
              {/* Icon and Title Row */}
              <div className="flex items-start gap-4 mb-6">
                {/* Icon */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={concern.icon}
                    alt={concern.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Title and Stats */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2b2b2b] mb-1">
                    {concern.name}
                  </h3>
                  <p className="text-xs text-[#4c4c4c]">{concern.stats}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4c4c4c] leading-relaxed mb-6 flex-grow">
                {concern.description}
              </p>

              {/* Treatment Approaches */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#2b2b2b] mb-3 uppercase tracking-wide">
                  Treatment Approaches
                </p>
                <div className="flex flex-wrap gap-2">
                  {concern.treatments.map((treatment, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white/60 rounded-full text-xs text-[#4c4c4c] font-medium"
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mt-auto">
                <button className="text-sm text-[#2FA19A] font-semibold hover:underline text-left">
                  Learn More
                </button>
                <button
                  onClick={() => navigate("/experts")}
                  className="w-full bg-[#18356C] hover:bg-[#2a4a8f] text-white font-semibold py-3 px-6 rounded-full text-sm transition-all shadow-md hover:shadow-lg"
                >
                  Book Consultation
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MentalHealthConcerns;
