import React from "react";
import { useNavigate } from "react-router-dom";
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
import ExpertsHeader from "../Experts/Components/ExpertsHeader";
const Bangalore: React.FC = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/patientAuth"); //  Redirect to your login/signup page
  };

  return (
    <div className="bg-mibo-offwhite">
      {/* Header */}
      <ExpertsHeader />

      {/* Hero Section */}
      <HeroSection
        title="Find The Best Therapists, Counsellors & Psychiatrists In Bengaluru"
        description="Experience personalized mental health care at Mibo’s Bengaluru centre — a serene space designed to help you heal, reflect, and grow."
      />

      {/* Image Carousel */}
      <ImageCarousel city="Bengaluru" />

      {/* Explore Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <SectionTitle
          title="Explore Personalised Mental Health Care In Bengaluru"
          subtitle="From one-on-one therapy to psychiatry and wellness programs, Mibo offers evidence-based care designed around your goals."
        />
        <ConditionPills />
      </section>

      {/* Top Rated Psychiatrists & Therapists */}
      <TopPsychiatrists city="Bengaluru" />
       <TopTherapists city="Bengaluru" /> 

      {/* Book Appointment Button */}
      <BookAppointmentButton onClick={handleBookAppointment} />

      {/* Testimonials */}
      <Testimonials />

      {/* Achievements */}
      <Achievements />

      {/* Address Section */}
      <AddressSection city="Bengaluru" />

      {/* Footer */}
      <ExpertsFooter />
    </div>
  );
};

export default Bangalore;

// import React from "react";
// import CentersHeader from "./components/CentersHeader";
// import ExpertsFooter from "./components/CentersFooter";

// import HeroSection from "./components/HeroSection";
// import SectionTitle from "./components/SectionTitle";
// import ImageCarousel from "./components/ImageCarousel";
// import ConditionPills from "./components/ConditionPills";
// import TopPsychiatrists from "./components/TopPsychiatrists";
// import TopTherapists from "./components/TopTherapists";
// import Testimonials from "./components/Testimonials";
// import Achievements from "./components/Achievements";
// import AddressSection from "./components/AddressSection";
// import BookAppointmentButton from "./components/BookAppointmentButton";

// const Bangalore: React.FC = () => {
//   return (
//     <div className="bg-mibo-offwhite">
//       {/* Header */}
//       <CentersHeader />

//       {/* Hero Section */}
//       <HeroSection
//         title="Find The Best Therapists, Counsellors & Psychiatrists In Bengaluru"
//         description="Experience personalized mental health care at Mibo’s Bengaluru centre — a serene space designed to help you heal, reflect, and grow."
//       />

//       {/* Image Carousel */}
//       <ImageCarousel city="Bengaluru" />

//       {/* Explore Section */}
//       <section className="max-w-6xl mx-auto px-4 py-12 text-center">
//         <SectionTitle
//           title="Explore Personalised Mental Health Care In Bengaluru"
//           subtitle="From one-on-one therapy to psychiatry and wellness programs, Mibo offers evidence-based care designed around your goals."
//         />
//         <ConditionPills />
//       </section>

//       {/* Top Rated Psychiatrists & Therapists */}
//       <TopPsychiatrists city="Bengaluru" />
//       <TopTherapists city="Bengaluru" />

//       {/* Book Appointment Button */}
//       <BookAppointmentButton
//         onClick={() => alert("Redirect to booking page")}
//       />

//       {/* Testimonials */}
//       <Testimonials />

//       {/* Achievements */}
//       <Achievements />

//       {/* Address Section */}
//       <AddressSection city="Bengaluru" />

//       {/* Footer */}
//       <ExpertsFooter />
//     </div>
//   );
// };

// export default Bangalore;
