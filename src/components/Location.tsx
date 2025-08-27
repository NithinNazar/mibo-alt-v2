// import { useState, useEffect } from 'react';
// import { MapPin } from 'lucide-react';

// const Location = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const centers = [
//         {
//             city: 'Bengaluru',
//             description: 'Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.',
//             locations: ['Indiranagar', 'Koramangala'],
//             image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',
//         },
//         {
//             city: 'Mumbai',
//             description:
//                 'Find peace and support in our Mumbai centers, crafted to provide professional mental health services.',
//             locations: ['Bandra', 'Andheri'],
//             image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c88788?w=400&h=200&fit=crop',
//         },
//         {
//             city: 'Delhi',
//             description: 'Experience compassionate care in our Delhi facilities, designed with your wellbeing in mind.',
//             locations: ['Connaught Place', 'South Extension'],
//             image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=200&fit=crop',
//         },
//     ];

//     // Auto-slide functionality
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentSlide((prev) => (prev + 1) % centers.length);
//         }, 4000);

//         return () => clearInterval(interval);
//     }, [centers.length]);

//     return (
//         <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
//             {/* Header */}
//             <div className="p-6 pb-4">
//                 <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-3">
//                     Find expert mental healthcare in a city close to you
//                 </h1>
//                 <p className="text-gray-600 text-sm leading-relaxed">
//                     Our centres across Bangalore, Mumbai, and Delhi bring expert care to your neighbourhood so support is
//                     always within reach.
//                 </p>
//             </div>

//             {/* Image Slider Container */}
//             <div className="relative mx-6 mb-6">
//                 <div className="relative h-48 rounded-xl overflow-hidden">
//                     {/* Images */}
//                     <div
//                         className="flex transition-transform duration-500 ease-in-out h-full"
//                         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                     >
//                         {centers.map((center, index) => (
//                             <div key={index} className="min-w-full h-full">
//                                 <img
//                                     src={center.image}
//                                     alt={`${center.city} center`}
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                         {centers.map((_, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => setCurrentSlide(index)}
//                                 className={`w-2 h-2 rounded-full transition-all duration-200 ${
//                                     index === currentSlide ? 'bg-white' : 'bg-white/50'
//                                 }`}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* City Information */}
//             <div className="px-6 pb-6">
//                 <div className="mb-4">
//                     <h2 className="text-xl font-bold text-gray-800 mb-2">{centers[currentSlide].city}</h2>
//                     <p className="text-gray-600 text-sm leading-relaxed mb-4">{centers[currentSlide].description}</p>
//                 </div>

//                 {/* Locations */}
//                 <div className="mb-6">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                         Locations in {centers[currentSlide].city.toUpperCase()}
//                     </p>
//                     <div className="flex flex-wrap gap-4">
//                         {centers[currentSlide].locations.map((location, index) => (
//                             <div key={index} className="flex items-center text-gray-700">
//                                 <MapPin className="w-4 h-4 mr-2 text-gray-500" />
//                                 <span className="text-sm">{location}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* View Centres Button */}
//                 <button className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide">
//                     View Centres
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Location;


// import { useState, useEffect } from 'react';
// import { MapPin } from 'lucide-react';

// const Location = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const centers = [
//         {
//             city: 'Bengaluru',
//             description: 'Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.',
//             locations: ['Indiranagar', 'Koramangala'],
//             image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',
//         },
//         {
//             city: 'Mumbai',
//             description:
//                 'Find peace and support in our Mumbai centers, crafted to provide professional mental health services.',
//             locations: ['Bandra', 'Andheri'],
//             image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c88788?w=400&h=200&fit=crop',
//         },
//         {
//             city: 'Delhi',
//             description: 'Experience compassionate care in our Delhi facilities, designed with your wellbeing in mind.',
//             locations: ['Connaught Place', 'South Extension'],
//             image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=200&fit=crop',
//         },
//     ];

//     // Auto-slide
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentSlide((prev) => (prev + 1) % centers.length);
//         }, 4000);
//         return () => clearInterval(interval);
//     }, [centers.length]);

//     return (
//         <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
//             {/* Header */}
//             <div className="p-6 pb-4">
//                 <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-3">
//                     Find expert mental healthcare in a city close to you
//                 </h1>
//                 <p className="text-gray-600 text-sm leading-relaxed">
//                     Our centres across Bangalore, Mumbai, and Delhi bring expert care to your neighbourhood so support is
//                     always within reach.
//                 </p>
//             </div>

//             {/* Slider */}
//             <div className="relative h-52 rounded-xl overflow-hidden mx-6 mb-6">
//                 <div
//                     className="flex transition-transform duration-500 ease-in-out h-full"
//                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                 >
//                     {centers.map((center, index) => (
//                         <div key={index} className="min-w-full h-full">
//                             <img src={center.image} alt={`${center.city} center`} className="w-full h-full object-cover" />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Slider Dots */}
//                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
//                     {centers.map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => setCurrentSlide(index)}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                                 index === currentSlide ? 'bg-white' : 'bg-white/50'
//                             }`}
//                         />
//                     ))}
//                 </div>
//             </div>

//             {/* City Info */}
//             <div className="px-6 pb-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-2">{centers[currentSlide].city}</h2>
//                 <p className="text-gray-600 text-sm leading-relaxed mb-4">{centers[currentSlide].description}</p>

//                 {/* Locations */}
//                 <div className="mb-6">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                         Locations in {centers[currentSlide].city.toUpperCase()}
//                     </p>
//                     <div className="flex flex-wrap gap-4">
//                         {centers[currentSlide].locations.map((location, index) => (
//                             <div key={index} className="flex items-center text-gray-700">
//                                 <MapPin className="w-4 h-4 mr-2 text-gray-500" />
//                                 <span className="text-sm">{location}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Button */}
//                 <button className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide">
//                     View Centres
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Location;

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import bengaluruImg from '../assets/In-patient.jpg';
import mumbaiImg from '../assets/In-patient.jpg';
import delhiImg from '../assets/online.jpg';

const LocationCardsSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const centers = [
        {
            city: 'Bengaluru',
            description: 'Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.',
            locations: ['Indiranagar', 'Koramangala'],
            image: bengaluruImg,
        },
        {
            city: 'Mumbai',
            description:
                'Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.',
            locations: ['Bandra', 'Andheri'],
            image: mumbaiImg,
        },
        {
            city: 'Kochi',
            description: 'Experience compassionate care in our Delhi facilities, designed with your wellbeing in mind.',
            locations: ['Connaught Place', 'South Extension'],
            image: delhiImg,
        },
    ];

    // Auto-slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % centers.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [centers.length]);

    return (
        <div className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100">
            <div className="mb-8">
                <h1 className="mt-6  mb-4 text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug">
                    Care and support near you
                </h1>
                <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.8rem] text-center">
                    Our centres across Bangalore, Mumbai, and Delhi bring expert care to your neighbourhood so support is
                    always within reach.
                </p>
            </div>
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {centers.map((center, index) => (
                        <div key={index} className="min-w-full">
                            <div className="bg-[#edf6f9] rounded-2xl border border-gray-300  overflow-hidden mx-2">
                                {/* Image */}
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={center.image}
                                        alt={`${center.city} center`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* City Name */}
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{center.city}</h2>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{center.description}</p>

                                    {/* Locations */}
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                            LOCATIONS IN {center.city.toUpperCase()}
                                        </p>
                                        <div className="space-y-2">
                                            {center.locations.map((location, locationIndex) => (
                                                <div key={locationIndex} className="flex items-center text-gray-700">
                                                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                                    <span className="text-sm font-medium">{location}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <button className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide">
                                        View Centres
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center mt-6 space-x-1">
                {centers.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-0.5 rounded-full transition-all duration-500 ${
                            index === currentSlide
                                ? 'w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent'
                                : 'w-6 bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default LocationCardsSlider;