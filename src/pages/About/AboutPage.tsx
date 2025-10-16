import React from "react";
import HeroSection from "./components/HeroSection";
import StorySection from "./components/StorySection";
import ApproachSection from "./components/ApproachSection";
import DirectorsNote from "./components/DirectorsNote";
import TeamSection from "./components/TeamSection";

const AboutPage: React.FC = () => {
  return (
    <div className="w-full overflow-hidden bg-[#f7fbfa] text-[#2b2b2b]">
      <HeroSection />
      <StorySection />
      <ApproachSection />
      <DirectorsNote />
      <TeamSection />
    </div>
  );
};

export default AboutPage;
