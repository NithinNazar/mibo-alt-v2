/* import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import bengaluruImg from "../assets/In-patient.jpg";
import mumbaiImg from "../assets/In-patient.jpg";
import kochiImg from "../assets/online.jpg";

const LocationCardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  const centers = [
    {
      city: "Bengaluru",
      description:
        "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.",
      locations: ["Indiranagar", "Koramangala"],
      image: bengaluruImg,
      path: "/centres/bengaluru",
    },
    {
      city: "Mumbai",
      description:
        "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.",
      locations: ["Bandra", "Andheri"],
      image: mumbaiImg,
      path: "/centres/mumbai",
    },
    {
      city: "Kochi",
      description:
        "Experience compassionate care in our Kochi facilities, designed with your wellbeing in mind.",
      locations: ["Marine Drive", "Ernakulam"],
      image: kochiImg,
      path: "/centres/kochi",
    },
  ];

  // Auto slide
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % centers.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [centers.length, isPaused]);

  const pauseTemporarily = (duration = 5000) => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), duration);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % centers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + centers.length) % centers.length);
  };

  // --- Swipe Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) nextSlide();
      else prevSlide();
      pauseTemporarily();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="mt-6 mb-4 text-[1.56rem] font-[700] text-center text-gray-800 leading-snug">
        Care and support near you
      </h1>
      <p className="text-gray-600 text-sm text-center mb-8">
        Our centres across Bengaluru, Mumbai, and Kochi bring expert care close
        to you.
      </p>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {centers.map((center, index) => (
            <div key={index} className="min-w-full">
              <div className="bg-[#edf6f9] rounded-2xl border border-gray-300 overflow-hidden mx-2">
                <div className="h-48 overflow-hidden">
                  <img
                    src={center.image}
                    alt={`${center.city} center`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {center.city}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    {center.description}
                  </p>
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      LOCATIONS IN {center.city.toUpperCase()}
                    </p>
                    <div className="space-y-2">
                      {center.locations.map((loc, i) => (
                        <div
                          key={i}
                          className="flex items-center text-gray-700"
                        >
                          <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-sm font-medium">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate(center.path);
                      pauseTemporarily();
                    }}
                    className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#223584] transition-colors"
                  >
                    View Centre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

  
      <div className="flex justify-center mt-6 space-x-1">
        {centers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentSlide(idx);
              pauseTemporarily();
            }}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              idx === currentSlide
                ? "w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent"
                : "w-6 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationCardsSlider; */





import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, /* ChevronLeft, ChevronRight */ } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import bengaluruImg from "../pages/Centers/assets/bangalore2.jpg";
import mumbaiImg from "../pages/Centers/assets/mumbai2.jpg";
import kochiImg from "../pages/Centers/assets/kochi1.jpg";

const LocationCardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const touchStartX = useRef<number | null>(null);
  //const touchEndX = useRef<number | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const centers = [
    {
      city: "Bengaluru",
      description:
        "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations. Experience world-class mental health care in a serene environment.",
      locations: ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar"],
      image: bengaluruImg,
      path: "/centres/bengaluru",
      features: ["Free Parking", "Wheelchair Accessible", "AC Consultation Rooms", "Waiting Lounge"],
      rating: 4.8,
      reviews: 342
    },
    {
      city: "Mumbai",
      description:
        "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health. Our oasis in the city.",
      locations: ["Bandra", "Andheri", "Powai", "Lower Parel"],
      image: mumbaiImg,
      path: "/centres/mumbai",
      features: ["Metro Access", "Valet Parking", "Cafeteria", "Library"],
      rating: 4.7,
      reviews: 289
    },
    {
      city: "Kochi",
      description:
        "Experience compassionate care in our Kochi facilities, designed with your wellbeing in mind. Coastal serenity meets professional care.",
      locations: ["Marine Drive", "Ernakulam", "Kakkanad", "Edappally"],
      image: kochiImg,
      path: "/centres/kochi",
      features: ["Sea View", "Garden Area", "Yoga Studio", "Meditation Space"],
      rating: 4.9,
      reviews: 156
    },
    /* {
      city: "Delhi",
      description:
        "State-of-the-art mental health facility in the capital, offering comprehensive care with modern amenities and expert professionals.",
      locations: ["Connaught Place", "Saket", "Vasant Kunj", "Rajouri Garden"],
      image: bengaluruImg, // Replace with actual Delhi image
      path: "/centres/delhi",
      features: ["Central Location", "24/7 Helpline", "Group Therapy Rooms", "Childcare Services"],
      rating: 4.6,
      reviews: 198
    },
    {
      city: "Chennai",
      description:
        "Traditional hospitality meets modern psychiatry in our Chennai center, providing culturally sensitive mental health care.",
      locations: ["Anna Nagar", "Adyar", "Velachery", "T Nagar"],
      image: mumbaiImg, // Replace with actual Chennai image
      path: "/centres/chennai",
      features: ["Traditional Therapy", "Family Counseling", "Diet Consultation", "Ayurvedic Options"],
      rating: 4.7,
      reviews: 167
    } */
  ];

  // Auto slide with hover pause
  useEffect(() => {
    if (!isPaused && !isHovering) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % centers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [centers.length, isPaused, isHovering]);

  const pauseTemporarily = (duration = 5000) => {
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), duration);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % centers.length);
    pauseTemporarily(3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + centers.length) % centers.length);
    pauseTemporarily(3000);
  };

  /* const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseTemporarily(3000);
  }; */

  // --- Swipe Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) nextSlide();
      else prevSlide();
      pauseTemporarily();
    }
    
    touchStartX.current = null;
  };

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
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          Care and Support Near You
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Our centres across India bring expert mental health care close to you. 
          Each location is designed for comfort, privacy, and healing.
        </motion.p>
      </div>

      {/* Desktop Layout - Grid */}
      <div 
        className="hidden lg:block"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="grid grid-cols-3 gap-8">
          {centers.slice(0, 3).map((center, index) => (
            <motion.div
              key={center.city}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="bg-white rounded-3xl overflow-hidden  transition-all duration-500 h-full border border-gray-100 group-hover:border-[#34b9a5]/30">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={center.image}
                    alt={`${center.city} center`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* City Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-bold text-gray-900 text-lg">{center.city}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1">
                    <span className="font-bold text-yellow-600">{center.rating}</span>
                    <span className="text-xs text-gray-600">({center.reviews})</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{center.city}</h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {center.description}
                  </p>
                  
                  {/* Locations */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Locations in {center.city}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {center.locations.map((loc, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <MapPin className="w-4 h-4 text-[#34b9a5]" />
                          <span className="text-sm font-medium text-gray-700">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {center.features.map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[#E3F7F1] text-[#18356C] px-3 py-1.5 rounded-full font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Button */}
                  <button
                    onClick={() => navigate(center.path)}
                    className="w-full bg-gradient-to-r from-[#18356C] to-[#040a47] text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg group-hover:shadow-xl"
                  >
                    View Centre Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Show More Button for Desktop */}
        {/* {centers.length > 3 && (
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-[#18356C] text-[#18356C] px-8 py-3 rounded-full font-semibold hover:bg-[#18356C] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
              View All {centers.length} Locations
            </button>
          </div>
        )} */}
      </div>

      {/* Mobile & Tablet Layout - Carousel */}
      <div 
        className="lg:hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        ref={sliderRef}
      >
        {/* Navigation Buttons */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white hover:text-[#34b9a5] transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-200"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white hover:text-[#34b9a5] transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-200"
        >
          <ChevronRight size={24} />
        </button> */}

        {/* Carousel Container */}
        <div className="overflow-hidden px-2">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {centers.map((center, index) => (
              <div
                key={index}
               className="min-w-full px-2"

              >
                <div className="bg-white rounded-3xl overflow-hidden">
                  {/* Image */}
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <img
                      src={center.image}
                      alt={`${center.city} center`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* City Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-bold text-gray-900 text-lg">{center.city}</span>
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1">
                      <span className="font-bold text-yellow-600">{center.rating}</span>
                      <span className="text-xs text-gray-600">({center.reviews})</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{center.city}</h2>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {center.description.length > 150 
                        ? `${center.description.substring(0, 150)}...` 
                        : center.description
                      }
                    </p>
                    
                    {/* Locations */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Locations in {center.city}
                      </p>
                      <div className="space-y-2">
                        {center.locations.slice(0, 2).map((loc, i) => (
                          <div
                            key={i}
                            className="flex items-center text-gray-700"
                          >
                            <MapPin className="w-4 h-4 mr-3 text-[#34b9a5]" />
                            <span className="text-sm font-medium">{loc}</span>
                          </div>
                        ))}
                        {center.locations.length > 2 && (
                          <span className="text-sm text-gray-500 font-medium">
                            +{center.locations.length - 2} more locations
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate(center.path);
                        pauseTemporarily();
                      }}
                      className="w-full bg-gradient-to-r from-[#18356C] to-[#040a47] text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg"
                    >
                      View Centre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators */}
     {/*  <div className="flex justify-center items-center mt-8 md:mt-12 space-x-2">
        {centers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentSlide
                ? "w-12 bg-gradient-to-r from-[#34b9a5] to-[#18356C]"
                : "w-6 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
 */}
      {/* View All Button for Mobile */}
     {/*  <div className="lg:hidden text-center mt-8">
        <button 
          onClick={() => navigate("/locations")}
          className="inline-flex items-center gap-2 bg-white border-2 border-[#18356C] text-[#18356C] px-6 py-3 rounded-full font-semibold hover:bg-[#18356C] hover:text-white transition-all duration-300 shadow-lg"
        >
          <span>View All {centers.length} Locations</span>
          <ChevronRight size={18} />
        </button>
      </div> */}
    </div>
  );
};

export default LocationCardsSlider;