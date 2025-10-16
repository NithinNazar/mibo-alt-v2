import React from "react";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
import ExpertsFooter from "../Experts/Components/ExpertsFooter";

import HeroSection from "./components/HeroSection";
import StorySection from "./components/StorySection";
import ApproachSection from "./components/ApproachSection";
import DirectorsNote from "./components/DirectorsNote";
import TeamSection from "./components/TeamSection";

const AboutPage: React.FC = () => {
  return (
    <div className="w-full overflow-hidden bg-[#f7fbfa] text-[#2b2b2b]">
      {/* Header */}
      <ExpertsHeader />

      {/* Page Sections */}
      <HeroSection />
      <StorySection />
      <ApproachSection />
      <DirectorsNote />
      <TeamSection />

      {/* Footer */}
      <ExpertsFooter />
    </div>
  );
};

export default AboutPage;
