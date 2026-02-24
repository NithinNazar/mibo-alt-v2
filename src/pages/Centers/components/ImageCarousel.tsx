// src/pages/Centers/components/ImageCarousel.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import images
import bangalore1 from "../assets/bangalore1.jpg?w=800&format=webp&quality=75";
import bangalore2 from "../assets/bangalore2.jpg?w=800&format=webp&quality=75";
import kochi1 from "../assets/kochi1.jpg?w=800&format=webp&quality=75";
import kochi2 from "../assets/kochi2.jpg?w=800&format=webp&quality=75";
import mumbai1 from "../assets/mumbai1.jpg?w=800&format=webp&quality=75";
import mumbai2 from "../assets/mumbai2.jpg?w=800&format=webp&quality=75";

interface CarouselProps {
  city: string;
}

// Map city names to images
const imagesMap: Record<string, string[]> = {
  bangalore: [bangalore1, bangalore2],
  bengaluru: [bangalore1, bangalore2],
  kochi: [kochi1, kochi2],
  cochin: [kochi1, kochi2],
  mumbai: [mumbai1, mumbai2],
};

const ImageCarousel: React.FC<CarouselProps> = ({ city }) => {
  const cityKey = city.trim().toLowerCase();
  const images = imagesMap[cityKey] || [];

  const [current, setCurrent] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="h-[50vh] md:h-[60vh] flex items-center justify-center bg-mibo-teal-light">
        <h2 className="text-mibo-green text-xl font-semibold">
          {city} Centre Images Coming Soon
        </h2>
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center py-8 md:py-12">
      {/* Carousel container */}
      <div className="w-[80%] md:w-[70%] lg:w-[60%] h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden relative flex items-center justify-center">
        {/* Slides wrapper */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${current * 100}%)`, // full-slide per image
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full h-full flex items-center justify-center"
            >
              {/* Circular image */}
              <div className="w-[90%] h-[90%] rounded-full overflow-hidden shadow-lg">
                <img
                  src={src}
                  alt={`${city} centre ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={() =>
            setCurrent((current - 1 + images.length) % images.length)
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-md z-10"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => setCurrent((current + 1) % images.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-md z-10"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
