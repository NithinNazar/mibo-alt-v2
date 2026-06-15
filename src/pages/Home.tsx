import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import ScrollRevealWrapper from "../components/ScrollRevealWrapper";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

import HeroSection from "./HeroSection";
import CareSection from "./CareSection";
import ImpactWhoSection from "./ImpactWhoSection";
import ConcernsRealCareSection from "./ConcernsRealCareSection";

const Home = () => {
  defineElement(lottie.loadAnimation);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div
      className="flex flex-col w-full overflow-hidden bg-[#F3FBFA]"
      style={{ willChange: "scroll-position" }}
    >
      {/*  HEADER */}
      <ScrollRevealWrapper direction="fade" delay={400}>
        <Header />
      </ScrollRevealWrapper>

      {/*  HERO SECTION */}
      <HeroSection />

      {/*  CARE SECTION */}
      <CareSection />

      {/*  IMPACT WHO SECTION */}
      <ImpactWhoSection />

      {/*  CONCERNS REAL CARE SECTION */}
      <ConcernsRealCareSection />

      {/* FOOTER SECTION */}
      <div className="bg-gradient-to-b from-[#E3F7F1] via-[#D7EFFF]/60 to-[#CFEAE5] py-16">
        <ScrollRevealWrapper direction="fade" delay={700} cascade>
          <Footer />
        </ScrollRevealWrapper>
      </div>
    </div>
  );
};

export default Home;