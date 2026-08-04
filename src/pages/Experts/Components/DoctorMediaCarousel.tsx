// import { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper/modules";
// import { Play } from "lucide-react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { getYouTubeThumbnail } from "../utils/youtube";
// import VideoModal from "./VideoModal";

// interface DoctorMediaCarouselProps {
//   images: string[];
//   videoUrl?: string;
//   doctorName: string;
// }

// export default function DoctorMediaCarousel({
//   images,
//   videoUrl,
//   doctorName,
// }: DoctorMediaCarouselProps) {
//   const [isVideoOpen, setIsVideoOpen] = useState(false);
//   const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

//   const thumbnail = videoUrl ? getYouTubeThumbnail(videoUrl) : null;
//   const slides = images.length > 0 ? images : ["__initials__"];
//   const slideCount = slides.length + (thumbnail ? 1 : 0);

//   const initials = doctorName
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <div className="relative w-full h-[260px] md:h-[280px] lg:h-[300px] mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#e9f6f4] to-[#d0f7e9]/50 shadow-[0_8px_24px_-8px_rgba(3,75,68,0.25)] group/media">
//       <Swiper
//         modules={[Pagination, Navigation]}
//         pagination={{ clickable: true }}
//         navigation={slideCount > 1}
//         loop={slideCount > 1}
//         className="w-full h-full doctor-media-swiper"
//       >
//         {slides.map((src, i) => (
//           <SwiperSlide key={`img-${i}`}>
//             <div className="relative w-full h-full overflow-hidden">
//               {src !== "__initials__" ? (
//                 <>
//                   <img
//                     src={src}
//                     alt={`${doctorName} photo ${i + 1}`}
//                     loading="lazy"
//                     className={`w-full h-full object-cover object-top transition-all duration-500 ease-out group-hover/media:scale-[1.04] ${
//                       imgLoaded[i] ? "opacity-100" : "opacity-0"
//                     }`}
//                     onLoad={() => setImgLoaded((s) => ({ ...s, [i]: true }))}
//                     onError={() => setImgLoaded((s) => ({ ...s, [i]: true }))}
//                   />
//                   {!imgLoaded[i] && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-[#d0f7e9]/80 animate-pulse">
//                       <span className="text-3xl font-bold text-[#034B44]">{initials}</span>
//                     </div>
//                   )}
//                   {/* Subtle bottom scrim for depth + legible pagination */}
//                   <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
//                 </>
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#d0f7e9] to-[#a7c4f2]/40">
//                   <span className="text-4xl md:text-5xl font-bold text-[#034B44]">{initials}</span>
//                 </div>
//               )}
//             </div>
//           </SwiperSlide>
//         ))}

//         {thumbnail && (
//           <SwiperSlide key="video">
//             <button
//               type="button"
//               onClick={() => setIsVideoOpen(true)}
//               className="group relative w-full h-full block"
//               aria-label={`Play ${doctorName} video`}
//             >
//               {/* Profile photo used as the video thumbnail (not the YouTube frame) */}
//               <img
//                 src={images[0] !== "__initials__" ? images[0] : thumbnail}
//                 alt={`${doctorName} video thumbnail`}
//                 loading="lazy"
//                 className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
//               />
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

//               {/* Bottom-left: progress dots + "Watch video" label, pill background */}
//               <span className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/35 backdrop-blur-sm pl-2 pr-3 py-1.5 rounded-full">
//                 <span className="flex items-center gap-1">
//                   <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#e94c3d]" />
//                 </span>
//                 <span className="text-white text-[11px] font-medium tracking-wide whitespace-nowrap">
//                   Watch video
//                 </span>
//               </span>

//               {/* Play button tucked into the bottom-right corner; the card's rounded
//                   overflow-hidden edge clips it, giving the "floating half off" look */}
//               <span className="absolute -bottom-3 -right-3 flex items-center justify-center">
//                 <span className="absolute w-14 h-14 rounded-full bg-white/30 animate-ping-slow" />
//                 <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-lg group-hover:scale-110 transition-transform">
//                   <Play size={18} className="text-[#e94c3d] ml-0.5" fill="currentColor" />
//                 </span>
//               </span>
//             </button>
//           </SwiperSlide>
//         )}
//       </Swiper>

//       {isVideoOpen && videoUrl && (
//         <VideoModal
//           videoUrl={videoUrl}
//           doctorName={doctorName}
//           onClose={() => setIsVideoOpen(false)}
//         />
//       )}
//     </div>
//   );
// }