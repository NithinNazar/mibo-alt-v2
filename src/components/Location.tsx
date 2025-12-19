import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import bengaluruImg from "../assets/mibo_bangalore.jpg";
import mumbaiImg from "../assets/mibo_mumbai.jpg";
import kochiImg from "../assets/mibo_kochi.jpg";

const LocationCardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

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

  // Mobile slider animation
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

  const centers = [
    {
      city: "Bengaluru",
      rating: 4.8,
      reviews: 642,
      description:
        "Our Bengaluru centres offer professional mental health care in a serene environment.",
      locations: ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar"],
      amenities: [
        "Free Parking",
        "Wheelchair Accessible",
        "AC Consultation Rooms",
        "Waiting Lounge",
      ],
      image: bengaluruImg,
      path: "/centres/bengaluru",
    },
    {
      city: "Mumbai",
      rating: 4.7,
      reviews: 289,
      description: "Find peace and professional care at our Mumbai locations.",
      locations: ["Bandra", "Andheri", "Powai", "Lower Parel"],
      amenities: ["Metro Access", "Valet Parking", "Cafeteria", "Library"],
      image: mumbaiImg,
      path: "/centres/mumbai",
    },
    {
      city: "Kochi",
      rating: 4.9,
      reviews: 153,
      description:
        "Experience compassionate care in our Kochi facilities designed for professional care.",
      locations: ["Marine Drive", "Ernakulam", "Kakkanad", "Edappally"],
      amenities: ["Sea View", "Garden Area", "Yoga Studio", "Meditation Space"],
      image: kochiImg,
      path: "/centres/kochi",
    },
  ];

  // Auto-slide for mobile
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % centers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [centers.length, isPaused]);

  // Resume auto-slide after manual interaction
  useEffect(() => {
    if (!isPaused) return;

    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
    }, 5000);

    return () => clearTimeout(resumeTimer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setIsPaused(true);
  };

  return (
    <div className="w-full py-16">
      {/* Mobile View - Horizontal Slider */}
      <div className="block lg:hidden max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2b2b2b] mb-3">
            Care and Support Near You
          </h1>
          <p className="text-base font-medium text-[#4c4c4c] leading-relaxed">
            Our centres across India bring expert mental health care close to
            you. Each location is designed for comfort, privacy, and healing.
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
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Image with Rating Badge */}
              <div className="relative h-48">
                <img
                  src={centers[currentSlide].image}
                  alt={centers[currentSlide].city}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "crisp-edges" }}
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <span className="font-bold text-[#2b2b2b]">
                    {centers[currentSlide].city}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-[#2b2b2b]">
                    {centers[currentSlide].rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({centers[currentSlide].reviews})
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-base font-medium text-[#4c4c4c] mb-4">
                  {centers[currentSlide].description}
                </p>

                {/* Locations */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-[#2b2b2b] mb-2 uppercase">
                    Locations in {centers[currentSlide].city}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {centers[currentSlide].locations.map((loc, i) => (
                      <div key={i} className="flex items-center text-[#4c4c4c]">
                        <MapPin className="w-3 h-3 mr-2 text-[#2FA19A]" />
                        <span className="text-sm font-medium">{loc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-[#2b2b2b] mb-2 uppercase">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {centers[currentSlide].amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#E8F5F3] rounded-full text-sm font-medium text-[#2FA19A]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(centers[currentSlide].path)}
                  className="w-full bg-[#18356C] hover:bg-[#2a4a8f] text-white font-bold py-3 px-6 rounded-full text-base transition-all shadow-md"
                >
                  View Centre Details
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {centers.map((_, index) => (
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
            Care and Support Near You
          </h1>
          <p className="text-base text-[#4c4c4c] leading-relaxed max-w-3xl mx-auto">
            Our centres across India bring expert mental health care close to
            you. Each location is designed for comfort, privacy, and healing.
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
          {centers.map((center, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image with Rating Badge */}
              <div className="relative h-56">
                <img
                  src={center.image}
                  alt={center.city}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "crisp-edges" }}
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full shadow-md">
                  <span className="font-bold text-lg text-[#2b2b2b]">
                    {center.city}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-[#2b2b2b]">
                    {center.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({center.reviews})
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-[#4c4c4c] leading-relaxed mb-6">
                  {center.description}
                </p>

                {/* Locations */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-[#2b2b2b] mb-3 uppercase tracking-wide">
                    Locations in {center.city}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {center.locations.map((loc, i) => (
                      <div key={i} className="flex items-center text-[#4c4c4c]">
                        <MapPin className="w-3 h-3 mr-2 text-[#2FA19A]" />
                        <span className="text-xs font-medium">{loc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-[#2b2b2b] mb-3 uppercase tracking-wide">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {center.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#E8F5F3] rounded-full text-xs font-medium text-[#2FA19A]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(center.path)}
                  className="w-full bg-[#18356C] hover:bg-[#2a4a8f] text-white font-semibold py-3 px-6 rounded-full text-sm transition-all shadow-md hover:shadow-lg"
                >
                  View Centre Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LocationCardsSlider;
