import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import bengaluruImg from "../assets/In-patient.jpg";
import mumbaiImg from "../assets/In-patient.jpg";
import kochiImg from "../assets/online.jpg";

const LocationCardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % centers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [centers.length]);

  return (
    <div className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100">
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
                    onClick={() => navigate(center.path)}
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

      {/* Slider dots */}
      <div className="flex justify-center mt-6 space-x-1">
        {centers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
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

export default LocationCardsSlider;

//==========================================================================================================
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";
// import bengaluruImg from "../assets/In-patient.jpg";
// import mumbaiImg from "../assets/In-patient.jpg";
// import kochiImg from "../assets/online.jpg";

// const LocationCardsSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();

//   const centers = [
//     {
//       city: "Bengaluru",
//       description:
//         "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.",
//       locations: ["Indiranagar", "Koramangala"],
//       image: bengaluruImg,
//       path: "/centres/bengaluru",
//     },
//     {
//       city: "Mumbai",
//       description:
//         "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.",
//       locations: ["Bandra", "Andheri"],
//       image: mumbaiImg,
//       path: "/centres/mumbai",
//     },
//     {
//       city: "Kochi",
//       description:
//         "Experience compassionate care in our Kochi facilities, designed with your wellbeing in mind.",
//       locations: ["Marine Drive", "Fort Kochi"],
//       image: kochiImg,
//       path: "/centres/kochi",
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % centers.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [centers.length]);

//   return (
//     <div className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100">
//       <div className="mb-8 text-center">
//         <h1 className="mt-6 mb-4 text-[1.56rem] font-[700] text-[rgb(76,76,76)] leading-snug">
//           Care and support near you
//         </h1>
//         <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem]">
//           Our centres across Bengaluru, Mumbai, and Kochi bring expert care to
//           your neighbourhood.
//         </p>
//       </div>

//       <div className="relative overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {centers.map((center, index) => (
//             <div key={index} className="min-w-full">
//               <div className="bg-[#edf6f9] rounded-2xl border border-gray-300 overflow-hidden mx-2">
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={center.image}
//                     alt={`${center.city} center`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-3">
//                     {center.city}
//                   </h2>
//                   <p className="text-gray-600 text-sm leading-relaxed mb-6">
//                     {center.description}
//                   </p>
//                   <div className="mb-6">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                       LOCATIONS IN {center.city.toUpperCase()}
//                     </p>
//                     <div className="space-y-2">
//                       {center.locations.map((loc, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center text-gray-700"
//                         >
//                           <MapPin className="w-4 h-4 mr-3 text-gray-400" />
//                           <span className="text-sm font-medium">{loc}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => navigate(center.path)}
//                     className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#223584] transition-colors text-sm uppercase tracking-wide"
//                   >
//                     View Centre
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-center mt-6 space-x-1">
//         {centers.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-0.5 rounded-full transition-all duration-500 ${
//               index === currentSlide
//                 ? "w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent"
//                 : "w-6 bg-gray-300 hover:bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationCardsSlider;

//==========================================================================================================

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";
// import bengaluruImg from "../assets/In-patient.jpg";
// import mumbaiImg from "../assets/In-patient.jpg";
// import delhiImg from "../assets/online.jpg";

// const LocationCardsSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate(); // 👈 add navigation hook

//   const centers = [
//     {
//       city: "Bengaluru",
//       description:
//         "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.",
//       locations: ["Indiranagar", "Koramangala"],
//       image: bengaluruImg,
//       path: "/centres/bengaluru", // 👈 route for this centre
//     },
//     {
//       city: "Mumbai",
//       description:
//         "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.",
//       locations: ["Bandra", "Andheri"],
//       image: mumbaiImg,
//       path: "/centres/mumbai",
//     },
//     {
//       city: "Kochi",
//       description:
//         "Experience compassionate care in our Delhi facilities, designed with your wellbeing in mind.",
//       locations: ["Connaught Place", "South Extension"],
//       image: delhiImg,
//       path: "/centres/kochi",
//     },
//   ];

//   // Auto-slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % centers.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [centers.length]);

//   return (
//     <div className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100">
//       <div className="mb-8">
//         <h1 className="mt-6  mb-4 text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug">
//           Care and support near you
//         </h1>
//         <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] text-center">
//           Our centres across Bangalore, Mumbai, and Delhi bring expert care to
//           your neighbourhood so support is always within reach.
//         </p>
//       </div>
//       <div className="relative overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {centers.map((center, index) => (
//             <div key={index} className="min-w-full">
//               <div className="bg-[#edf6f9] rounded-2xl border border-gray-300 overflow-hidden mx-2">
//                 {/* Image */}
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={center.image}
//                     alt={`${center.city} center`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   {/* City Name */}
//                   <h2 className="text-2xl font-bold text-gray-800 mb-3">
//                     {center.city}
//                   </h2>

//                   {/* Description */}
//                   <p className="text-gray-600 text-sm leading-relaxed mb-6">
//                     {center.description}
//                   </p>

//                   {/* Locations */}
//                   <div className="mb-6">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                       LOCATIONS IN {center.city.toUpperCase()}
//                     </p>
//                     <div className="space-y-2">
//                       {center.locations.map((location, locationIndex) => (
//                         <div
//                           key={locationIndex}
//                           className="flex items-center text-gray-700"
//                         >
//                           <MapPin className="w-4 h-4 mr-3 text-gray-400" />
//                           <span className="text-sm font-medium">
//                             {location}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Button */}
//                   <button
//                     onClick={() => navigate(center.path)} // 👈 navigate to corresponding centre
//                     className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide hover:bg-[#223584]"
//                   >
//                     View Centres
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Slider Dots */}
//       <div className="flex justify-center mt-6 space-x-1">
//         {centers.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-0.5 rounded-full transition-all duration-500 ${
//               index === currentSlide
//                 ? "w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent"
//                 : "w-6 bg-gray-300 hover:bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationCardsSlider;
//==========================================================================================================

// import { useState, useEffect } from "react";
// import { MapPin } from "lucide-react";
// import bengaluruImg from "../assets/In-patient.jpg";
// import mumbaiImg from "../assets/In-patient.jpg";
// import delhiImg from "../assets/online.jpg";

// const LocationCardsSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const centers = [
//     {
//       city: "Bengaluru",
//       description:
//         "Step into our warm, welcoming space in Bengaluru, designed for your comfort and conversations.",
//       locations: ["Indiranagar", "Koramangala"],
//       image: bengaluruImg,
//     },
//     {
//       city: "Mumbai",
//       description:
//         "Find us in the bustle of Mumbai, where you can pause, connect, and focus entirely on your mental health.",
//       locations: ["Bandra", "Andheri"],
//       image: mumbaiImg,
//     },
//     {
//       city: "Kochi",
//       description:
//         "Experience compassionate care in our Delhi facilities, designed with your wellbeing in mind.",
//       locations: ["Connaught Place", "South Extension"],
//       image: delhiImg,
//     },
//   ];

//   // Auto-slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % centers.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [centers.length]);

//   return (
//     <div className="max-w-sm mx-auto p-6 pt-6 pb-14 bg-blue-100">
//       <div className="mb-8">
//         <h1 className="mt-6  mb-4 text-[1.56rem] font-[700] text-[rgb(76,76,76)] text-center leading-snug">
//           Care and support near you
//         </h1>
//         <p className="mt-4 text-[rgb(76, 76, 76)] text-[0.9rem] text-center">
//           Our centres across Bangalore, Mumbai, and Delhi bring expert care to
//           your neighbourhood so support is always within reach.
//         </p>
//       </div>
//       <div className="relative overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {centers.map((center, index) => (
//             <div key={index} className="min-w-full">
//               <div className="bg-[#edf6f9] rounded-2xl border border-gray-300  overflow-hidden mx-2">
//                 {/* Image */}
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={center.image}
//                     alt={`${center.city} center`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   {/* City Name */}
//                   <h2 className="text-2xl font-bold text-gray-800 mb-3">
//                     {center.city}
//                   </h2>

//                   {/* Description */}
//                   <p className="text-gray-600 text-sm leading-relaxed mb-6">
//                     {center.description}
//                   </p>

//                   {/* Locations */}
//                   <div className="mb-6">
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                       LOCATIONS IN {center.city.toUpperCase()}
//                     </p>
//                     <div className="space-y-2">
//                       {center.locations.map((location, locationIndex) => (
//                         <div
//                           key={locationIndex}
//                           className="flex items-center text-gray-700"
//                         >
//                           <MapPin className="w-4 h-4 mr-3 text-gray-400" />
//                           <span className="text-sm font-medium">
//                             {location}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Button */}
//                   <button className="w-full bg-[#18276c] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide">
//                     View Centres
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Slider Dots */}
//       <div className="flex justify-center mt-6 space-x-1">
//         {centers.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-0.5 rounded-full transition-all duration-500 ${
//               index === currentSlide
//                 ? "w-12 bg-gradient-to-r from-transparent via-[#18276c] to-transparent"
//                 : "w-6 bg-gray-300 hover:bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationCardsSlider;
