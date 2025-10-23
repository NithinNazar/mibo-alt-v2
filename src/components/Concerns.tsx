import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import depressionIcon from "../assets/depression.gif";
import stress from "../assets/anxiety.gif";
import doubt from "../assets/doubt.gif";
import bipolar from "../assets/bipolar.gif";
import adhd from "../assets/adhd.gif";
import Anxiety from "../assets/anxiety (1).gif";

const MentalHealthCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const conditions = [
    {
      name: "Depression",
      description:
        "Does your life feel impossible & hopeless? You don't have to manage it alone.",
      icon: depressionIcon,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Generalized Anxiety Disorder (GAD)",
      description:
        "Chronic feelings of worry and fear about everyday situations affecting your daily life.",
      icon: stress,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Obsessive Compulsive Disorder (OCD)",
      description:
        "Repetitive thoughts and behaviors that interfere with your daily routine.",
      icon: doubt,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Bipolar Disorder",
      description:
        "Extreme mood swings including emotional highs and lows affecting your energy.",
      icon: bipolar,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Adult ADHD",
      description:
        "Difficulty with attention, hyperactivity, and impulse control in adult life.",
      icon: adhd,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "Social Anxiety",
      description:
        "Intense fear of social situations and being judged by others.",
      icon: Anxiety,
      color: "from-orange-400 to-orange-600",
    },
  ];

  const nextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % conditions.length);
    setTimeout(() => setIsAnimating(false), 800); // slower animation
  };

  // Touch and mouse handlers
  const handleStart = (clientX: number) => {
    if (isAnimating) return;
    startX.current = clientX;
    currentX.current = clientX;
    isDragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current || isAnimating) return;
    currentX.current = clientX;
  };

  const handleEnd = () => {
    if (!isDragging.current || isAnimating) return;
    const diffX = startX.current - currentX.current;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextCard();
      } else {
        setIsAnimating(true);
        setCurrentIndex(
          (prev) => (prev - 1 + conditions.length) % conditions.length
        );
        setTimeout(() => setIsAnimating(false), 800);
      }
    }
    isDragging.current = false;
  };

  const handleTouchStart = (e: any) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: any) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();
  const handleMouseDown = (e: any) => handleStart(e.clientX);
  const handleMouseMove = (e: any) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();

  const goToCard = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const currentCondition = conditions[currentIndex];

  // Auto-scroll cards every 5s
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (!isDragging.current) {
      timer = setInterval(() => nextCard(), 5000);
    }
    return () => clearInterval(timer);
  }, [isDragging.current]);

  // Mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: any) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging.current) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-[#E0F2FF] pb-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mt-6 text-[1.56rem] font-[700] text-[rgb(76,76,76)] leading-snug pt-4">
          Mental health concerns we care for
        </h1>
        <p className="mt-4 text-[rgb(76,76,76)] text-[0.94rem] font-semibold">
          Mibo offers support for 30+ mental health conditions. Explore some of
          the most common ones below to see how we approach care.
        </p>
      </div>

      {/* Card Container */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-lg cursor-grab active:cursor-grabbing select-none w-full h-80 sm:h-96 mb-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex} // only content animates
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-0 flex flex-col bg-[#FAFDFF] border border-[#bfd1e5] rounded-2xl p-4 sm:p-6`}
            >
              {/* Icon */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <img
                  src={currentCondition.icon}
                  alt={currentCondition.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                />
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2">
                {currentCondition.name}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-sm sm:text-[0.875rem] leading-relaxed mb-4 sm:mb-6 flex-1 overflow-hidden line-clamp-4">
                {currentCondition.description}
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-between flex-shrink-0">
                <button className="w-30 h-5 p-4 sm:w-10 sm:h-10 rounded-lg bg-[#A7DAD3] text-[0.75rem] font-500 text-[#4c4c47] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                  Learn More
                </button>
                <button
                  onClick={nextCard}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#A7DAD3] text-[#4c4c47] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mb-6">
        {conditions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-[#18276c] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center text-sm text-gray-500">
        {currentIndex + 1} of {conditions.length}
      </div>
    </div>
  );
};

export default MentalHealthCards;
