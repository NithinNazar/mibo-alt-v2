import { useState, useEffect, useRef } from "react";
//import {/*  ArrowRight, ArrowLeft, */ ChevronRight, Heart } from "lucide-react";
import {  motion , type Variants} from "framer-motion";
import depressionIcon from "../assets/depression.gif";
import stress from "../assets/anxiety.gif";
import doubt from "../assets/doubt.gif";
import { Link } from "react-router-dom";
//import bipolar from "../assets/bipolar.gif";
//import adhd from "../assets/adhd.gif";
//import Anxiety from "../assets/anxiety (1).gif";

const MentalHealthConcernsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const conditions = [
    {
      name: "Depression",
      description: "Does your life feel impossible & hopeless? You don't have to manage it alone. We offer compassionate care and evidence-based treatments to help you regain hope and find joy again.",
      icon: depressionIcon,
      color: "from-orange-50 to-orange-50",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-50",
      stats: "Affects 280+ million people worldwide",
      treatments: [/* "Cognitive Behavioral Therapy", */ "Medication Management", "Lifestyle Changes", "Support Groups"]
    },
    {
      name: "Generalized Anxiety Disorder",
      description: "Chronic feelings of worry and fear about everyday situations affecting your daily life. Our specialized approaches help you manage anxiety and reclaim peace.",
      icon: stress,
      color: "from-blue-50 to-blue-50",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-50",
      stats: "1 in 14 people affected globally",
      treatments: ["Mindfulness Techniques", "Exposure Therapy", "Relaxation Training", "Stress Management"]
    },
    {
      name: "Obsessive Compulsive Disorder",
      description: "Repetitive thoughts and behaviors that interfere with your daily routine. We provide specialized therapy to break free from compulsive cycles.",
      icon: doubt,
      color: "from-purple-50 to-purple-50",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-50",
      stats: "Affects 2-3% of population",
      treatments: ["ERP Therapy", "Medication", "Mindfulness", "Habit Reversal"]
    },
   
  ];

  const nextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % conditions.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + conditions.length) % conditions.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

 /*  const goToCard = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };
 */
  // Touch and mouse handlers
  const handleStart = (clientX: number) => {
    if (isAnimating) return;
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleEnd = (endX: number) => {
    if (!isDragging.current || isAnimating) return;
    const diffX = startX.current - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextCard();
      else prevCard();
    }
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => handleEnd(e.changedTouches[0].clientX);

  // Auto-scroll only when not hovering
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isDragging.current && !isHovering) {
      timer = setInterval(() => nextCard(), 5000);
    }
    return () => clearInterval(timer);
  }, [isDragging.current, isHovering]);

  // Card animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          Mental Health Concerns We Care For
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Mibo offers comprehensive support for 30+ mental health conditions. 
          Explore some of the most common concerns below to see how we approach care.
        </motion.p>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-8">
          {conditions.slice(0, 3).map((condition, index) => (
            <motion.div
              key={condition.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`${condition.bgColor} rounded-3xl overflow-hidden  transition-all duration-500 h-full border border-gray-100 group-hover:border-opacity-30 group-hover:scale-[1.02]`}>
                {/* Icon Section */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                   <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${condition.color} p-4 flex items-center justify-center`}>
  <img
    src={condition.icon}
    alt={condition.name}
    className="w-24 h-24  object-contain"
  />
</div>




                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{condition.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{condition.stats}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {condition.description}
                  </p>

                  {/* Treatments */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Treatment Approaches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {condition.treatments.map((treatment, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/80 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200"
                        >
                          {treatment}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                 
                  <div className="flex gap-3">
                    <Link to={"/experts"}>
                   <button className="flex-1 bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300">
                      Learn More
                    </button>
                    <button className="bg-gradient-to-r from-[#18356C] to-[#040a47] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300">
                      Book Consultation
                    </button>
                  </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Second Row for Desktop */}
        <div className="grid grid-cols-3 gap-8 mt-8">
          {conditions.slice(3, 6).map((condition, index) => (
            <motion.div
              key={condition.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group relative"
            >
              <div className={`${condition.bgColor} rounded-3xl overflow-hidden transition-all duration-500 h-full border border-gray-100 group-hover:border-opacity-30 group-hover:scale-[1.02]`}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${condition.color} p-4 flex items-center justify-center`}>
  <img
    src={condition.icon}
    alt={condition.name}
    className="w-16 h-16 object-contain"
  />
</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{condition.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{condition.stats}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {condition.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Treatment Approaches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {condition.treatments.slice(0, 3).map((treatment, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/80 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200"
                        >
                          {treatment}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300">
                      Learn More
                    </button>
                    <button className="bg-gradient-to-r from-[#18356C] to-[#040a47] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300">
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button for Desktop */}
        {/* <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#34b9a5] to-[#2FA19A] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Heart size={20} />
            <span>View All 30+ Conditions</span>
            <ChevronRight size={20} />
          </button>
        </div> */}
      </div>

      {/* Mobile & Tablet Layout - Carousel */}
      <div 
        className="lg:hidden relative"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Buttons */}
       {/*  <button
          onClick={prevCard}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white hover:text-[#34b9a5] transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-200"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          onClick={nextCard}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white hover:text-[#34b9a5] transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-200"
        >
          <ArrowRight size={24} />
        </button> */}

        {/* Carousel Container */}
        <div className="overflow-hidden px-2">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {conditions.map((condition, index) => (
              <div
                key={index}
                className="min-w-full px-2 md:px-3"
              >
                <div className={`${condition.bgColor} rounded-3xl overflow-hidden  border-gray-100 h-full`}>
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${condition.color} p-4 flex items-center justify-center`}>
  <img
    src={condition.icon}
    alt={condition.name}
    className="w-24 h-24 object-contain"
  />
</div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{condition.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{condition.stats}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {condition.description.length > 150 
                        ? `${condition.description.substring(0, 150)}...` 
                        : condition.description
                      }
                    </p>

                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Key Treatments
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {condition.treatments.slice(0, 2).map((treatment, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/80 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200"
                          >
                            {treatment}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      

                      <Link to={"/experts"}>
                  <button className="flex-1 bg-white text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 text-sm">
                        Learn More
                      </button>
                      <button className="bg-gradient-to-r from-[#18356C] to-[#040a47] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-300 text-sm">
                        Book Now
                      </button>
                  </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators */}
    {/*   <div className="flex justify-center items-center mt-8 md:mt-12 space-x-2">
        {conditions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToCard(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex
                ? "w-12 bg-gradient-to-r from-[#34b9a5] to-[#18356C]"
                : "w-6 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div> */}

      {/* Counter */}
     {/*  <div className="text-center mt-4 text-gray-500 font-medium">
        <span className="text-[#18356C] font-bold">{currentIndex + 1}</span>
        <span className="mx-2">of</span>
        <span className="font-bold">{conditions.length}</span>
        <span className="ml-2">conditions</span>
      </div> */}

      {/* View All Button for Mobile */}
     {/*  <div className="lg:hidden text-center mt-8">
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#34b9a5] to-[#2FA19A] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg">
          <Heart size={18} />
          <span>View All Conditions</span>
          <ChevronRight size={18} />
        </button>
      </div> */}
    </div>
  );
};

export default MentalHealthConcernsSlider;