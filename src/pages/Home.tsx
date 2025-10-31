import Header from "../components/Header";
import OfferingsAndTherapy from "../components/offerings_Therapy";
import MiboCarousel from "../components/why_mibo";
import ImpactSection from "../components/ImpactSection";
import DepartmentGraphs from "../components/Department_Graph";
import CorporateLanding from "../components/who_its_for";
import MentalHealthServices from "../components/Services";
import MentalHealthConcerns from "../components/Concerns";
import CareServiceComponent from "../components/Features";
import SupportServices from "../components/Mibo_Supports";
import Location from "../components/Location";
import ContactSection from "../components/ContactSection";

import Footer from "../components/Footer";
import ScrollRevealWrapper from "../components/ScrollRevealWrapper";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

const Home = () => {
  defineElement(lottie.loadAnimation);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#F3FBFA]">
      {/* --- HEADER --- */}
      <ScrollRevealWrapper direction="fade" delay={400}>
        <Header />
      </ScrollRevealWrapper>

      {/* --- SERVICES SECTION --- */}
      <div className="relative bg-gradient-to-br from-[#D7EFFF] via-[#BCE1EC]/70 to-[#A5C8D7]/90 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.35),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <ScrollRevealWrapper direction="right" delay={500} cascade>
            <MentalHealthServices />
          </ScrollRevealWrapper>
        </div>
      </div>

      {/* --- WHY MIBO SECTION (Full Width, Adjusted Spacing & Matching Color) --- */}
      <section className="w-full bg-[#040a47] py-14 overflow-hidden">
        <ScrollRevealWrapper direction="left" delay={500} cascade>
          <MiboCarousel />
        </ScrollRevealWrapper>
      </section>

      {/* --- IMPACT SECTION (Full Width, Responsive Grid Fix) --- */}
      <section className="relative w-full overflow-hidden">
        <ScrollRevealWrapper direction="fade" delay={500} cascade={false}>
          <ImpactSection />
        </ScrollRevealWrapper>
      </section>

      {/* --- OFFERINGS, GRAPHS, WHO IT'S FOR --- */}
      <div className="bg-gradient-to-t from-[#F3FBFA] via-[#E3F7F1]/80 to-[#E3F7F1] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollRevealWrapper direction="top" delay={500} cascade>
            <OfferingsAndTherapy />
          </ScrollRevealWrapper>

          <div className="mt-20">
            <ScrollRevealWrapper direction="bottom" delay={600} cascade>
              <DepartmentGraphs />
            </ScrollRevealWrapper>
          </div>

          <div className="mt-20">
            <ScrollRevealWrapper direction="right" delay={700} cascade>
              <CorporateLanding />
            </ScrollRevealWrapper>
          </div>
        </div>
      </div>

      {/* --- CONCERNS, FEATURES, SUPPORTS --- */}
      <div className="bg-gradient-to-bl from-[#E3F7F1] via-[#D7EFFF]/80 to-[#D7EFFF] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollRevealWrapper direction="fade" delay={500} cascade>
            <MentalHealthConcerns />
          </ScrollRevealWrapper>

          <div className="mt-20">
            <ScrollRevealWrapper direction="left" delay={600} cascade>
              <CareServiceComponent />
            </ScrollRevealWrapper>
          </div>

          <div className="mt-20">
            <ScrollRevealWrapper direction="right" delay={700} cascade>
              <SupportServices />
            </ScrollRevealWrapper>
          </div>
        </div>
      </div>

      {/* --- LOCATION --- */}
      <div className="bg-gradient-to-t from-[#D7EFFF] via-[#B9E6EC]/70 to-[#E3F7F1]/90 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollRevealWrapper direction="bottom" delay={600} cascade>
            <Location />
          </ScrollRevealWrapper>
        </div>
      </div>
      <ContactSection />

      {/* --- FOOTER --- */}
      <div className="bg-gradient-to-b from-[#E3F7F1] via-[#D7EFFF]/60 to-[#CFEAE5] py-16">
        <ScrollRevealWrapper direction="fade" delay={700} cascade>
          <Footer />
        </ScrollRevealWrapper>
      </div>
    </div>
  );
};

export default Home;
