import { testimonials } from "../data/testimonials";
import { motion, /* AnimatePresence */ } from "framer-motion";
import { Quote,/*  ChevronLeft, ChevronRight */ } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-play on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Auto-advance every 5 seconds on lg+ screens
    if (window.innerWidth >= 1024) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev >= testimonials.length - cardsPerView ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [cardsPerView]);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0].clientWidth;
      const gap = 24; // gap-6 = 24px
      scrollContainerRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

 

  return (
    <section className="relative py-16 px-6 overflow-hidden bg-gradient-to-b from-transparent via-[#e9f6f4]/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#034B44] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-[#034B44]/70 text-lg">
            Real stories from people who've found hope and healing
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Arrows - Visible on hover (desktop) */}
          {/* <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#34b9a5] hover:text-white"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#34b9a5] hover:text-white"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button> */}

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 scrollbar-hide"
          >
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="snap-start flex-shrink-0 w-full sm:w-[360px] lg:w-[400px] bg-white/80 backdrop-blur-md border border-[#a7c4f2]/30 rounded-3xl p-8  transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-[#34b9a5]/30" />
                </div>

                {/* Feedback */}
                <p className="text-[#034B44]/85 text-lg italic leading-relaxed mb-8">
                  “{t.feedback}”
                </p>

                {/* Name */}
               {/*  <div>
                  <p className="font-semibold text-[#034B44] text-lg">{t.name}</p>
                  {t.role && (
                    <p className="text-[#034B44]/60 text-sm mt-1">{t.role}</p>
                  )}
                </div> */}

                {/* Optional Stars (if you have rating in data) */}
                {/* <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#34b9a5] text-[#34b9a5]" />
                  ))}
                </div> */}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({
            length: Math.max(1, testimonials.length - cardsPerView + 1),
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-[#34b9a5] w-8"
                  : "bg-[#34b9a5]/30 hover:bg-[#34b9a5]/60"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
       {/*  <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: testimonials.length > 1 ? 1 : 0 }}
          className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-[#034B44]/60 bg-white/80 backdrop-blur px-4 py-2 rounded-full pointer-events-none"
        >
          <span>Swipe to see more</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div> */}
      </div>
    </section>
  );
}