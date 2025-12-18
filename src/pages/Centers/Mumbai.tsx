import React from "react";
//import CentersHeader from "./components/CentersHeader";
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
import { useNavigate } from "react-router-dom";
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
const Mumbai: React.FC = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/patientAuth"); //  Redirect to your login/signup page
  };
  return (
    <div className="bg-mibo-offwhite min-h-screen">
      {/* Header */}
      <ExpertsHeader />

      {/* Hero Section */}
      <HeroSection
        title="Find The Best Therapists, Counsellors & Psychiatrists In Mumbai"
        description="Experience personalized mental health care at Mibo’s Mumbai centre — a serene space designed to help you heal, reflect, and grow."
      />

      {/* Image Carousel */}
      <ImageCarousel city="Mumbai" />

      {/* Explore Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <SectionTitle
          title="Explore Personalised Mental Health Care In Mumbai"
          subtitle="From one-on-one therapy to psychiatry and wellness programs, Mibo offers evidence-based care designed around your goals."
        />
        <ConditionPills />
      </section>

      {/* Top Rated Psychiatrists & Therapists */}
      <TopPsychiatrists city="Mumbai" />
       <TopTherapists city="Mumbai" /> 
      <BookAppointmentButton onClick={handleBookAppointment} />

      {/* Testimonials & Achievements */}
      <Testimonials />
      <Achievements />

      {/* Address Section */}
      <AddressSection city="Mumbai" />

      {/* Footer */}
      <ExpertsFooter />
    </div>
  );
};

export default Mumbai;
