import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// --- Main pages ---
import Home from "./pages/Home";
import ExpertsPage from "./pages/Experts/ExpertsPage";
import AboutPage from "./pages/About/AboutPage";
import Blogpage from "./pages/Blog/Blogpage";

// --- Shared components ---
import PremiumSplashScreen from "./components/Spalshscreen";
import ScrollToTop from "./components/ScrollToTop";

// --- Auth & Dashboard ---
import PatientDashboard from "./pages/profileDashboard/PatientDashboard";
import PatientAuth from "./pages/auth/PatientAuth";

// --- Centres ---
import Bangalore from "./pages/Centers/Bangalore";
import Kochi from "./pages/Centers/Kochi";
import Mumbai from "./pages/Centers/Mumbai";

// --- Booking flow (index handles multi-step using :doctorId) ---
import BookAppointment from "./pages/BookAppointment";

// --- Payment success (Step 4) ---
import Step4PaymentSuccess from "./pages/BookAppointment/Step4PaymentSuccess";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <StrictMode>
      <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
        <ScrollToTop />

        {/* Splash Screen */}
        {showSplash && (
          <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
        )}

        <Routes>
          {/* 🌐 Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<Blogpage />} />{" "}
          {/* 📰 Blog page added */}
          {/* 🏥 Centres */}
          <Route path="/centres/bengaluru" element={<Bangalore />} />
          <Route path="/centres/kochi" element={<Kochi />} />
          <Route path="/centres/mumbai" element={<Mumbai />} />
          {/* 👤 Auth & Profile */}
          <Route path="/patientAuth" element={<PatientAuth />} />
          <Route path="/profileDashboard" element={<PatientDashboard />} />
          {/* 💬 Booking Flow (book for a specific doctor) */}
          <Route
            path="/book-appointment/:doctorId"
            element={<BookAppointment />}
          />
          {/* ✅ Payment success page (Step 4) */}
          <Route path="/payment-success" element={<Step4PaymentSuccess />} />
          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-gray-600">
                404 — Page Not Found
              </div>
            }
          />
        </Routes>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

// import { StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css";

// // --- Main pages ---
// import Home from "./pages/Home";
// import ExpertsPage from "./pages/Experts/ExpertsPage";
// import AboutPage from "./pages/About/AboutPage";

// // --- Shared components ---
// import PremiumSplashScreen from "./components/Spalshscreen";
// import ScrollToTop from "./components/ScrollToTop";

// // --- Auth & Dashboard ---
// import PatientDashboard from "./pages/profileDashboard/PatientDashboard";
// import PatientAuth from "./pages/auth/PatientAuth";

// // --- Centres ---
// import Bangalore from "./pages/Centers/Bangalore";
// import Kochi from "./pages/Centers/Kochi";
// import Mumbai from "./pages/Centers/Mumbai";

// // --- Booking flow ---
// import BookAppointment from "./pages/BookAppointment";

// const App = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <StrictMode>
//       <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
//         <ScrollToTop />

//         {/* Splash Screen */}
//         {showSplash && (
//           <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
//         )}

//         <Routes>
//           {/* 🌐 Public pages */}
//           <Route path="/" element={<Home />} />
//           <Route path="/experts" element={<ExpertsPage />} />
//           <Route path="/about" element={<AboutPage />} />

//           {/* 🏥 Centres */}
//           <Route path="/centres/bengaluru" element={<Bangalore />} />
//           <Route path="/centres/kochi" element={<Kochi />} />
//           <Route path="/centres/mumbai" element={<Mumbai />} />

//           {/* 👤 Auth & Profile */}
//           <Route path="/patientAuth" element={<PatientAuth />} />
//           <Route path="/profileDashboard" element={<PatientDashboard />} />

//           {/* 💬 Booking Flow */}
//           <Route
//             path="/book-appointment/:doctorId"
//             element={<BookAppointment />}
//           />

//           {/* Fallback (optional) */}
//           <Route
//             path="*"
//             element={
//               <div className="flex items-center justify-center h-screen text-gray-600">
//                 404 — Page Not Found
//               </div>
//             }
//           />
//         </Routes>
//       </Router>
//     </StrictMode>
//   );
// };

// createRoot(document.getElementById("root")!).render(<App />);

//////////////////////////////////////////////////////////////////////////////
// import { StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css";

// import Home from "./pages/Home.tsx";
// import ExpertsPage from "./pages/Experts/ExpertsPage";
// import AboutPage from "./pages/About/AboutPage";
// import PremiumSplashScreen from "./components/Spalshscreen.tsx";
// import ScrollToTop from "./components/ScrollToTop";
// import PatientDashboard from "./pages/profileDashboard/PatientDashboard";
// import PatientAuth from "./pages/auth/PatientAuth";

// // 👉 Centres pages
// import Bangalore from "./pages/Centers/Bangalore";
// import Kochi from "./pages/Centers/Kochi";
// import Mumbai from "./pages/Centers/Mumbai";

// import BookAppointmentPage from "./pages/BookAppointment/BookAppointmentPage";
// import AppointmentConfirmation from "./pages/BookAppointment/AppointmentConfirmation";

// const App = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <StrictMode>
//       <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
//         <ScrollToTop />

//         {/* Splash Overlay */}
//         {showSplash && (
//           <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
//         )}

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/experts" element={<ExpertsPage />} />
//           <Route path="/about" element={<AboutPage />} />

//           <Route path="/centres/bengaluru" element={<Bangalore />} />
//           <Route path="/centres/kochi" element={<Kochi />} />
//           <Route path="/centres/mumbai" element={<Mumbai />} />
//           <Route path="/book-appointment" element={<BookAppointmentPage />} />
//           <Route
//             path="/appointment-confirmation"
//             element={<AppointmentConfirmation />}
//           />
//           <Route path="/patientAuth" element={<PatientAuth />} />

//           <Route path="/profileDashboard" element={<PatientDashboard />} />
//         </Routes>
//       </Router>
//     </StrictMode>
//   );
// };

// createRoot(document.getElementById("root")!).render(<App />);
