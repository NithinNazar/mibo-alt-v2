import { useState, useEffect } from "react";

interface PremiumSplashScreenProps {
  onComplete: () => void;
}

const PremiumSplashScreen = ({ onComplete }: PremiumSplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState("loading");

  useEffect(() => {
    // Simulate loading time
    const timer1 = setTimeout(() => {
      setAnimationPhase("complete");
    }, 2000);

    const timer2 = setTimeout(() => {
      setAnimationPhase("fadeout");
    }, 3800);

    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        animationPhase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "#18356C",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
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

      {/* Main content container */}
      <div className="relative flex flex-col items-center space-y-8 px-8 text-center">
        {/* Logo/Brand area with animated ring */}
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center transition-transform duration-1000 ${
              animationPhase === "complete" ? "scale-110" : "scale-100"
            }`}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(45deg, #2FA19A, #18356C)",
              }}
            >
              <div className="w-8 h-8 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* Rotating border */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin opacity-60"></div>
        </div>

        {/* Brand text */}
        <div className="space-y-2">
          <h1
            className={`text-4xl md:text-5xl font-bold text-white transition-all duration-1000 ${
              animationPhase === "complete"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            MIBO
          </h1>
          <p
            className={`text-lg text-white text-opacity-90 font-light transition-all duration-1000 delay-200 ${
              animationPhase === "complete"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Mental Health Excellence
          </p>
        </div>

        {/* Loading indicator */}
        <div
          className={`flex flex-col items-center space-y-4 transition-opacity duration-500 ${
            animationPhase === "complete" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-48 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-2000 ease-out"
              style={{
                width: animationPhase === "loading" ? "100%" : "0%",
                background: "linear-gradient(90deg, #2FA19A, #ffffff)",
              }}
            ></div>
          </div>
          <p className="text-white text-opacity-70 text-sm font-light">
            Loading your wellness journey...
          </p>
        </div>

        {/* Success check mark */}
        <div
          className={`transition-all duration-500 ${
            animationPhase === "complete"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black from-opacity-10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default PremiumSplashScreen;
