import Header from "../components/Header";
import OfferingsAndTherapy from "../components/offerings_Therapy";
import MiboCarousel from "../components/why_mibo";
import DepartmentGraphs from "../components/Department_Graph";
import CorporateLanding from "../components/who_its_for";
import MentalHealthServices from "../components/Services";
import MentalHealthConcerns from "../components/Concerns";
import CareServiceComponent from "../components/Features";
import SupportServices from "../components/Mibo_Supports";
import Location from "../components/Location";
import Footer from "../components/Footer";
import ScrollRevealWrapper from "../components/ScrollRevealWrapper";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

const Home = () => {
  defineElement(lottie.loadAnimation);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#F8FCFB] text-[#1C3D3A]">
      {/* --- Header Section --- */}
      <ScrollRevealWrapper>
        <Header />
      </ScrollRevealWrapper>

      {/* --- Mental Health Section --- */}
      <div className="relative bg-gradient-to-br from-[#D7EFFF] via-[#BCE1EC]/70 to-[#A5C8D7]/90 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.35),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
        <ScrollRevealWrapper>
          <MentalHealthServices />
        </ScrollRevealWrapper>
      </div>

      {/* --- Why Mibo Section --- */}
      <div className="relative bg-gradient-to-tr from-[#276C72] via-[#3D8B8A]/85 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
        <ScrollRevealWrapper>
          <MiboCarousel />
        </ScrollRevealWrapper>
      </div>

      {/* --- Offerings / Department Graphs --- */}
      <div className="bg-gradient-to-t from-[#FFFFFF] via-[#E3F7F1]/70 to-[#E3F7F1]">
        <ScrollRevealWrapper>
          <OfferingsAndTherapy />
        </ScrollRevealWrapper>
        <ScrollRevealWrapper>
          <DepartmentGraphs />
        </ScrollRevealWrapper>
        <ScrollRevealWrapper>
          <CorporateLanding />
        </ScrollRevealWrapper>
      </div>

      {/* --- Support / Features Section (added bottom padding) --- */}
      <div className="bg-gradient-to-bl from-[#E3F7F1] via-[#D7EFFF]/70 to-[#D7EFFF] pb-20 sm:pb-24">
        <ScrollRevealWrapper>
          <MentalHealthConcerns />
        </ScrollRevealWrapper>
        <ScrollRevealWrapper>
          <CareServiceComponent />
        </ScrollRevealWrapper>
        <ScrollRevealWrapper>
          <SupportServices />
        </ScrollRevealWrapper>
      </div>

      {/* --- Location Section --- */}
      <div className="bg-gradient-to-t from-[#D7EFFF] via-[#B9E6EC]/70 to-[#E3F7F1]/90 pt-12 sm:pt-16 pb-16">
        <ScrollRevealWrapper>
          <Location />
        </ScrollRevealWrapper>
      </div>

      {/* --- Footer Section (Two-column structure from Footer.tsx) --- */}
      <Footer />
    </div>
  );
};

export default Home;

// import Header from "../components/Header";
// import OfferingsAndTherapy from "../components/offerings_Therapy";
// import MiboCarousel from "../components/why_mibo";
// import DepartmentGraphs from "../components/Department_Graph";
// import CorporateLanding from "../components/who_its_for";
// import MentalHealthServices from "../components/Services";
// import MentalHealthConcerns from "../components/Concerns";
// import CareServiceComponent from "../components/Features";
// import SupportServices from "../components/Mibo_Supports";
// import Location from "../components/Location";
// import ScrollRevealWrapper from "../components/ScrollRevealWrapper";
// import lottie from "lottie-web";
// import { defineElement } from "lord-icon-element";

// const Home = () => {
//   defineElement(lottie.loadAnimation);

//   return (
//     <div className="flex flex-col w-full overflow-hidden">
//       {/* --- Header Section --- */}
//       <ScrollRevealWrapper>
//         <Header />
//       </ScrollRevealWrapper>

//       {/* --- Mental Health Section with shimmer overlay --- */}
//       <div className="relative bg-gradient-to-br from-[#D7EFFF] via-[#BCE1EC]/70 to-[#A5C8D7]/90 overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.35),transparent_70%)] pointer-events-none" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
//         <ScrollRevealWrapper>
//           <MentalHealthServices />
//         </ScrollRevealWrapper>
//       </div>

//       {/* --- Why Mibo Section with shimmer overlay --- */}
//       <div className="relative bg-gradient-to-tr from-[#276C72] via-[#3D8B8A]/85 to-white overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
//         <ScrollRevealWrapper>
//           <MiboCarousel />
//         </ScrollRevealWrapper>
//       </div>

//       {/* --- Offerings / Department Graphs --- */}
//       <div className="bg-gradient-to-t from-[#FFFFFF] via-[#E3F7F1]/70 to-[#E3F7F1]">
//         <ScrollRevealWrapper>
//           <OfferingsAndTherapy />
//         </ScrollRevealWrapper>
//         <ScrollRevealWrapper>
//           <DepartmentGraphs />
//         </ScrollRevealWrapper>
//         <ScrollRevealWrapper>
//           <CorporateLanding />
//         </ScrollRevealWrapper>
//       </div>

//       {/* --- Support / Features Section (added bottom padding) --- */}
//       <div className="bg-gradient-to-bl from-[#E3F7F1] via-[#D7EFFF]/70 to-[#D7EFFF] pb-20 sm:pb-24">
//         <ScrollRevealWrapper>
//           <MentalHealthConcerns />
//         </ScrollRevealWrapper>
//         <ScrollRevealWrapper>
//           <CareServiceComponent />
//         </ScrollRevealWrapper>
//         <ScrollRevealWrapper>
//           <SupportServices />
//         </ScrollRevealWrapper>
//       </div>

//       {/* --- Location Section / Footer --- */}
//       <div className="bg-gradient-to-t from-[#D7EFFF] via-[#B9E6EC]/70 to-[#E3F7F1]/90 pt-12 sm:pt-16">
//         <ScrollRevealWrapper>
//           <Location />
//         </ScrollRevealWrapper>
//       </div>
//     </div>
//   );
// };

// export default Home;
