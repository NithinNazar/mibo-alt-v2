import React from "react";
import { useNavigate } from "react-router-dom";

import CentersHeader from "./components/CentersHeader";
import ExpertsFooter from "./components/CentersFooter";

import HeroSection from "./components/HeroSection";
import SectionTitle from "./components/SectionTitle";
import ImageCarousel from "./components/ImageCarousel";
import ConditionPills from "./components/ConditionPills";
import TopPsychiatrists from "./components/TopPsychiatrists";
import TopTherapists from "./components/TopTherapists";
import Testimonials from "./components/Testimonials";
import Achievements from "./components/Achievements";
import AddressSection from "./components/AddressSection";
import BookAppointmentButton from "./components/BookAppointmentButton";

const Kochi: React.FC = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/patientAuth"); //  Redirect to your login/signup page
  };

  return (
    <div className="bg-mibo-offwhite min-h-screen">
      {/* Header */}
      <CentersHeader />

      {/* Hero Section */}
      <HeroSection
        title="Find The Best Therapists, Counsellors & Psychiatrists In Kochi"
        description="Experience personalized mental health care at Mibo’s Kochi centre — a serene space designed to help you heal, reflect, and grow."
      />

      {/* Image Carousel */}
      <ImageCarousel city="Kochi" />

      {/* Explore Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <SectionTitle
          title="Explore Personalised Mental Health Care In Kochi"
          subtitle="From one-on-one therapy to psychiatry and wellness programs, Mibo offers evidence-based care designed around your goals."
        />
        <ConditionPills />
      </section>

      {/* Top Rated Psychiatrists & Therapists */}
      <TopPsychiatrists city="Kochi" />
      <TopTherapists city="Kochi" />
      {/* Book Appointment Button */}
      <BookAppointmentButton onClick={handleBookAppointment} />

      {/* Testimonials & Achievements */}
      <Testimonials />
      <Achievements />

      {/* Address Section */}
      <AddressSection city="Kochi" />

      {/* Footer */}
      <ExpertsFooter />
    </div>
  );
};

export default Kochi;
