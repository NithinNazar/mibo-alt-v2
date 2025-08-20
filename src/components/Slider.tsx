import  { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PremiumSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&h=600&fit=crop',
            title: 'Individual Therapy',
            subtitle: 'Personalized mental health support',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
            title: 'Group Sessions',
            subtitle: 'Community-based healing',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
            title: 'Online Counseling',
            subtitle: 'Remote support from anywhere',
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
            title: 'Family Therapy',
            subtitle: 'Strengthening family bonds',
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
            title: 'Wellness Programs',
            subtitle: 'Holistic mental health approach',
        },
    ];

    // Auto slide + progress animation
    useEffect(() => {
        if (!isPaused) {
            const slideInterval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setProgress(0); // reset progress on each slide change
            }, 2000);

            const progressInterval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 100 : prev + 2.5));
                // 2.5 * 40 = 100 over 4s
            }, 100);

            return () => {
                clearInterval(slideInterval);
                clearInterval(progressInterval);
            };
        }
    }, [isPaused, slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setProgress(0);
    };

    return (
        <div
            className="relative w-full h-[70vh] overflow-hidden bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)} // fixed: resume on leave
        >
            {/* Slides Container */}
            <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={slide.id} className="relative w-full h-full flex-shrink-0">
                        {/* Background Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className={`w-full h-full object-cover transition-all duration-1000 ${
                                    index === currentSlide ? 'scale-105' : 'scale-100'
                                }`}
                            />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white p-4 max-w-md">
                            <h3
                                className={`text-3xl font-bold mb-2 drop-shadow-lg transition-all duration-1000 ${
                                    index === currentSlide
                                        ? 'animate-fade-in-up opacity-100 transform translate-y-0'
                                        : 'opacity-0 transform translate-y-8'
                                }`}
                            >
                                {slide.title}
                            </h3>
                            <p
                                className={`text-lg opacity-90 drop-shadow transition-all duration-1000 delay-200 ${
                                    index === currentSlide
                                        ? 'animate-fade-in-up opacity-90 transform translate-y-0'
                                        : 'opacity-0 transform translate-y-8'
                                }`}
                            >
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300 shadow-lg"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300 shadow-lg"
            >
                <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentSlide(index);
                            setProgress(0);
                        }}
                        className={`transition-all duration-300 ${
                            index === currentSlide
                                ? 'w-8 h-3 bg-[#34b9a5] rounded-full'
                                : 'w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full'
                        }`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
                <div
                    className="h-full bg-gradient-to-r from-[#34b9a5] to-[#2a9d8f] transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default PremiumSlider;
