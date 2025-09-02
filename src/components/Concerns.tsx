import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import depressionIcon from '../assets/depression.gif';
import stress from '../assets/anxiety.gif'
import doubt from '../assets/doubt.gif'
import bipolar from '../assets/bipolar.gif'
import adhd from '../assets/adhd.gif'
import Anxiety from '../assets/anxiety (1).gif'


const MentalHealthCards = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const cardRef = useRef(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const isDragging = useRef(false);

    const conditions = [
        {
            name: 'Depression',
            description: "Does your life feel impossible & hopeless? You don't have to manage it alone.",
            icon: depressionIcon,
            color: 'from-orange-400 to-orange-600',
        },
        {
            name: 'Generalized Anxiety Disorder (GAD)',
            description: 'Chronic feelings of worry and fear about everyday situations affecting your daily life.',
            icon: stress,
            color: 'from-orange-400 to-orange-600',
        },
        {
            name: 'Obsessive Compulsive Disorder (OCD)',
            description: 'Repetitive thoughts and behaviors that interfere with your daily routine.',
            icon: doubt,
            color: 'from-orange-400 to-orange-600',
        },
        {
            name: 'Bipolar Disorder',
            description: 'Extreme mood swings including emotional highs and lows affecting your energy.',
            icon: bipolar,
            color: 'from-orange-400 to-orange-600',
        },
        {
            name: 'Adult ADHD',
            description: 'Difficulty with attention, hyperactivity, and impulse control in adult life.',
            icon: adhd,
            color: 'from-orange-400 to-orange-600',
        },
        {
            name: 'Social Anxiety',
            description: 'Intense fear of social situations and being judged by others.',
            icon: Anxiety,
            color: 'from-orange-400 to-orange-600',
        },
    ];

    const nextCard = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % conditions.length);
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Touch and mouse event handlers
    const handleStart = (clientX: any) => {
        if (isAnimating) return;
        startX.current = clientX;
        currentX.current = clientX;
        isDragging.current = true;
    };

    const handleMove = (clientX: any) => {
        if (!isDragging.current || isAnimating) return;
        currentX.current = clientX;
    };

    const handleEnd = () => {
        if (!isDragging.current || isAnimating) return;

        const diffX = startX.current - currentX.current;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped left, go to next card
                nextCard();
            } else {
                // Swiped right, go to previous card
                setIsAnimating(true);
                setCurrentIndex((prev) => (prev - 1 + conditions.length) % conditions.length);
                setTimeout(() => setIsAnimating(false), 300);
            }
        }

        isDragging.current = false;
    };

    // Touch events
    const handleTouchStart = (e: any) => {
        handleStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: any) => {
        handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        handleEnd();
    };

    // Mouse events
    const handleMouseDown = (e: any) => {
        handleStart(e.clientX);
    };

    const handleMouseMove = (e: any) => {
        handleMove(e.clientX);
    };

    const handleMouseUp = () => {
        handleEnd();
    };

    const goToCard = (index: any) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const currentCondition = conditions[currentIndex];
    //   const IconComponent = currentCondition.icon;

    // Auto-advance cards every 5 seconds
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         nextCard();
    //     }, 5000);

    //     return () => clearInterval(timer);
    // }, [currentIndex]);
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;

        if (!isDragging.current) {
            timer = setInterval(() => {
                nextCard();
            }, 3000);
        }

        return () => clearInterval(timer);
    }, [isDragging.current]);

    // Mouse event listeners
    useEffect(() => {
        const handleGlobalMouseMove = (e: any) => handleMouseMove(e);
        const handleGlobalMouseUp = () => handleMouseUp();

        if (isDragging.current) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    return (
        <div className="max-w-md mx-auto p-6 bg-[#E0F2FF] pb-16">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mt-6 text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug pt-4">
                    Mental health concerns we care for
                </h1>
                <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] text-center font-semibold">
                    Mibo offers support for 30+ mental health conditions. Explore some of the most common ones below to see
                    how we approach care.
                </p>
            </div>

            {/* Main Card Container */}
            <div className="relative mb-6">
                <div
                    ref={cardRef}
                    className="relative overflow-hidden rounded-lg  cursor-grab active:cursor-grabbing select-none w-full h-80 sm:h-96"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                >
                    {/* Card Content */}
                    <div
                        className={`bg-[#FAFDFF] border border-[#bfd1e5]   rounded-2xl  p-4 sm:p-6 w-full h-full flex flex-col transition-all duration-300 ${
                            isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                        }`}
                    >
                        {/* Icon */}
                        <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 mr-2 flex-shrink-0`}
                        >
                            <img
                                src={currentCondition.icon}
                                alt={currentCondition.name}
                                className="w-10 h-10 sm:w-18 sm:h-18 mr-6 object-contain"
                            />
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 flex-shrink-0 line-clamp-2">
                            {currentCondition.name}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-sm sm:text-[0.875rem] leading-relaxed mb-4 sm:mb-6 flex-1 overflow-hidden line-clamp-4">
                            {currentCondition.description}
                        </p>

                        {/* Navigation Section */}
                        <div className="flex items-center justify-between flex-shrink-0">
                            {/* Learn More Button */}
                            <button
                                className={`w-30 h-5 p-4 sm:w-10 sm:h-10 rounded-lg bg-[#A7DAD3]  border-0.5 border-[#18276c] text-[0.75rem] font-500 text-[#4c4c47] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                            >
                                Learn More
                            </button>

                            {/* Swipe Right Button */}
                            <button
                                onClick={nextCard}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#A7DAD3]  text-[#4c4c47] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                            >
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5  text-[#4c4c47]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mb-6">
                {conditions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToCard(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentIndex ? 'bg-[#18276c] w-6' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>

            {/* Card Counter */}
            <div className="text-center text-sm text-gray-500">
                {currentIndex + 1} of {conditions.length}
            </div>
        </div>
    );
};

export default MentalHealthCards;
