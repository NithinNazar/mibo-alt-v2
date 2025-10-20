import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import screeningAnimation from "../assets/animations/ScreeningDiagnosis.json";

const AnimatedIcon: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current!,
      animationData: screeningAnimation,
      renderer: "svg",
      loop: false,
      autoplay: true,
    });

    anim.addEventListener("complete", () => {
      setTimeout(() => {
        anim.goToAndPlay(0, true);
      }, 1000); // 1s delay
    });

    return () => anim.destroy();
  }, []);

  return <div ref={container} className="w-16 h-16" />;
};

export default AnimatedIcon;
