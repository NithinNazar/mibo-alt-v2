import { useEffect, useState } from "react";
import logo from "../assets/logo1.png"; // your PNG logo

interface PremiumSplashScreenProps {
  onComplete: () => void;
}

const PremiumSplashScreen = ({ onComplete }: PremiumSplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<"enter" | "reveal">(
    "enter"
  );

  useEffect(() => {
    const enterTimer = setTimeout(() => setAnimationPhase("reveal"), 2000);
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-transform duration-[1600ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
        animationPhase === "reveal" ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        background: "linear-gradient(160deg, #1d2e8b 0%, #2fa7a4 100%)", // Mibo palette
      }}
    >
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative flex flex-col items-center text-center space-y-6">
        {/* ✅ Logo with animated circular ring */}
        <div className="relative flex items-center justify-center">
          {/* Rotating circular gradient ring */}
          <div className="absolute w-48 h-48 rounded-full border-4 border-transparent animate-spin-slow">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "3px solid transparent",
                borderTopColor: "#abf5f1",
                borderRightColor: "#ffffff",
                opacity: 0.6,
              }}
            ></div>
          </div>

          {/* Main Logo */}
          <img
            src={logo}
            alt="Mibo Logo"
            className="h-24 md:h-28 w-auto z-10 drop-shadow-2xl"
          />
        </div>
      </div>

      <style>
        {`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default PremiumSplashScreen;

// import { useEffect, useState } from "react";

// interface PremiumSplashScreenProps {
//   onComplete: () => void;
// }

// const PremiumSplashScreen = ({ onComplete }: PremiumSplashScreenProps) => {
//   const [isVisible, setIsVisible] = useState(true);
//   const [animationPhase, setAnimationPhase] = useState<"enter" | "reveal">(
//     "enter"
//   );

//   useEffect(() => {
//     // Transition timing
//     const enterTimer = setTimeout(() => setAnimationPhase("reveal"), 2000);
//     const exitTimer = setTimeout(() => {
//       setIsVisible(false);
//       onComplete();
//     }, 3500);

//     return () => {
//       clearTimeout(enterTimer);
//       clearTimeout(exitTimer);
//     };
//   }, [onComplete]);

//   if (!isVisible) return null;

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-transform duration-[1500ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
//         animationPhase === "reveal" ? "-translate-y-full" : "translate-y-0"
//       }`}
//       style={{
//         background: "linear-gradient(160deg, #1d2e8b 0%, #2fa7a4 100%)", // dark blue → teal blue
//       }}
//     >
//       {/* --- Animated floating particles --- */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(10)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 2}s`,
//               animationDuration: `${2 + Math.random() * 3}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* --- Content --- */}
//       <div className="relative flex flex-col items-center text-center space-y-6">
//         {/* Logo circle */}
//         <div className="relative">
//           <div className="w-24 h-24 rounded-full border-4 border-white border-opacity-40 flex items-center justify-center">
//             <div
//               className="w-16 h-16 rounded-full flex items-center justify-center"
//               style={{
//                 background: "linear-gradient(45deg, #2fa7a4, #1d2e8b)",
//               }}
//             >
//               <div className="w-8 h-8 bg-white rounded-full shadow-lg"></div>
//             </div>
//           </div>

//           {/* Rotating border ring */}
//           <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin opacity-60"></div>
//         </div>

//         {/* Brand text */}
//         <div className="space-y-2">
//           <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
//             MIBO
//           </h1>
//           <p className="text-lg text-white text-opacity-90 font-light">
//             Mental Health Excellence
//           </p>
//         </div>

//         {/* Loading bar (only during entry) */}
//         {animationPhase === "enter" && (
//           <div className="flex flex-col items-center space-y-3 mt-4">
//             <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-white rounded-full animate-[loading_2s_ease-in-out_forwards]"
//                 style={{
//                   background: "linear-gradient(90deg, #2fa7a4, #ffffff)",
//                 }}
//               ></div>
//             </div>
//             <p className="text-white text-opacity-70 text-sm font-light">
//               Loading your wellness journey...
//             </p>
//           </div>
//         )}
//       </div>

//       <style>
//         {`
//           @keyframes loading {
//             0% { width: 0%; }
//             100% { width: 100%; }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default PremiumSplashScreen;
