// src/pages/Centers/components/ImageCarousel.tsx
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// Import images
import bangalore1 from "../assets/bangalore1.jpg";
import bangalore2 from "../assets/bangalore2.jpg";
import kochi1 from "../assets/kochi1.jpg";
import kochi2 from "../assets/kochi2.jpg";
import mumbai1 from "../assets/mumbai1.jpg";
import mumbai2 from "../assets/mumbai2.jpg";

interface CarouselProps {
  city: string;
  autoPlay?: boolean;
  interval?: number;
}

// Map city names to images with alt descriptions
const imagesMap: Record<string, { src: string; alt: string }[]> = {
  bangalore: [
    { src: bangalore1, alt: "MiBO Care Bangalore Center - Modern Reception Area" },
    { src: bangalore2, alt: "MiBO Care Bangalore Center - State-of-the-art Consultation Room" },
  ],
  bengaluru: [
    { src: bangalore1, alt: "MiBO Care Bengaluru Center - Modern Reception Area" },
    { src: bangalore2, alt: "MiBO Care Bengaluru Center - State-of-the-art Consultation Room" },
  ],
  kochi: [
    { src: kochi1, alt: "MiBO Care Kochi Center - Spacious Waiting Lounge" },
    { src: kochi2, alt: "MiBO Care Kochi Center - Advanced Medical Equipment Area" },
  ],
  cochin: [
    { src: kochi1, alt: "MiBO Care Cochin Center - Spacious Waiting Lounge" },
    { src: kochi2, alt: "MiBO Care Cochin Center - Advanced Medical Equipment Area" },
  ],
  mumbai: [
    { src: mumbai1, alt: "MiBO Care Mumbai Center - Premium Facility Entrance" },
    { src: mumbai2, alt: "MiBO Care Mumbai Center - Modern Treatment Room" },
  ],
};

const ImageCarousel: React.FC<CarouselProps> = ({ 
  city, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const cityKey = city.trim().toLowerCase();
  const images = imagesMap[cityKey] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle next slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [images.length, isTransitioning]);

  // Handle previous slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [images.length, isTransitioning]);

  // Go to specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!images.length || !isAutoPlaying) return;

    const slideTimer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(slideTimer);
  }, [images.length, isAutoPlaying, interval, nextSlide]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!images.length) return;
      
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextSlide();
          break;
        case " ":
          e.preventDefault();
          setIsAutoPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, prevSlide, nextSlide]);

  if (!images.length) {
    return (
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-mibo-teal-light/50 to-mibo-blue-light/30 rounded-3xl mx-4">
        <div className="text-center px-6">
          <div className="inline-block p-6 rounded-full bg-gradient-to-r from-mibo-teal-light to-mibo-blue-light mb-6">
            <div className="w-16 h-16 bg-mibo-green/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏥</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-mibo-green mb-3">
            {city} Centre
          </h3>
          <p className="text-gray-600 max-w-md">
            Professional images of our {city} centre will be available soon.
            Experience our state-of-the-art facilities in person.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      {/* <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-mibo-green mb-3">
          {city} Centre Gallery
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our modern facilities and welcoming environment
        </p>
      </div> */}

      {/* Main Carousel Container */}
      <div className="relative">
        {/* Carousel Wrapper */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-700 ease-out h-[400px] md:h-[500px] lg:h-[600px]"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full h-full relative"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                
                {/* Image */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Slide Info */}
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm mb-3">
                    <span className="w-2 h-2 rounded-full bg-mibo-teal mr-2 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1} / {images.length}
                    </span>
                  </div>
                  <p className="text-white text-lg md:text-xl font-medium max-w-xl">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-4 z-30">
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="group p-3 md:p-4 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-800 group-hover:text-mibo-green transition-colors" />
            </button>
            
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="group p-3 md:p-4 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-gray-800 group-hover:text-mibo-green transition-colors" />
            </button>
          </div>

          {/* Auto-play Toggle */}
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="group p-3 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300"
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlaying ? (
                <Pause className="w-5 h-5 text-gray-700 group-hover:text-mibo-green" />
              ) : (
                <Play className="w-5 h-5 text-gray-700 group-hover:text-mibo-green" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center items-center mt-8">
          <div className="flex space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className="group focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className="relative">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-mibo-green"
                        : "bg-gray-300 group-hover:bg-gray-400"
                    }`}
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-mibo-green/30 animate-ping" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Auto-play Progress Bar */}
       {/*  {isAutoPlaying && (
          <div className="mt-4">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mibo-teal to-mibo-green rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: isTransitioning ? "100%" : "0%",
                  animation: isTransitioning ? "none" : "progressBar 5s linear forwards",
                }}
              />
            </div>
          </div>
        )} */}
      </div>

      {/* Keyboard Hint */}
      {/* <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
            <kbd className="px-1.5 py-0.5 text-xs bg-white border rounded">←</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-white border rounded">→</kbd>
          </span>
          <span>Navigate •</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
            <kbd className="px-1.5 py-0.5 text-xs bg-white border rounded">Space</kbd>
          </span>
          <span>Play/Pause</span>
        </p>
      </div> */}

      {/* Add CSS Animation */} {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCarousel;