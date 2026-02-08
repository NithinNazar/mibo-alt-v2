import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";

// --- Main pages ---
import Home from "./pages/Home";
import ExpertsPage from "./pages/Experts/ExpertsPage";
import AboutPage from "./pages/About/AboutPage";
import Blogpage from "./pages/Blog/Blogpage";
import WhyMiboPage from "./pages/WhyMibo/WhyMibo";
import WhoItsForPage from "./pages/WhoItsFor/WhoItsForPage";
import InPatientPage from "./pages/Services/Inpatient/InPatientPage";
import InPersonPage from "./pages/Services/Inperson/InPersonPage";

// --- Shared components ---
import PremiumSplashScreen from "./components/Spalshscreen";
import ScrollToTop from "./components/ScrollToTop";

// --- Auth & Dashboard ---
import PatientDashboard from "./pages/profileDashboard/PatientDashboard";
import PatientAuth from "./pages/auth/PatientAuth";
import AllAppointments from "./pages/profileDashboard/AllAppointments";
import ProfileSettings from "./pages/profileDashboard/ProfileSettings";

// --- Centres ---
import Bangalore from "./pages/Centers/Bangalore";
import Kochi from "./pages/Centers/Kochi";
import Mumbai from "./pages/Centers/Mumbai";

// --- Landing Pages ---
import BangaloreLanding from "./pages/Landing/BangaloreLanding";
import KochiLanding from "./pages/Landing/KochiLanding";

// --- Booking flow (index handles multi-step using :doctorId) ---
import BookAppointment from "./pages/BookAppointment";

// --- Payment success (Step 4) ---
import Step4PaymentSuccess from "./pages/BookAppointment/Step4PaymentSuccess";
import OnlinePage from "./pages/Services/Online/OnlinePage";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <StrictMode>
      <Router basename={import.meta.env.VITE_BASE_PATH || "/"}>
        <ScrollToTop />

        {/* Splash Screen */}
        {showSplash && (
          <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
        )}

        <Routes>
          {/*  Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<Blogpage />} />{" "}
          <Route path="/why-mibo" element={<WhyMiboPage />} />{" "}
          <Route path="/who-its-for" element={<WhoItsForPage />} />
          <Route path="/services/in-patient" element={<InPatientPage />} />
          <Route path="/services/in-person" element={<InPersonPage />} />
          <Route path="/services/online" element={<OnlinePage />} />
          {/*  Why Mibo page */}
          {/*  Blog page added */}
          {/*  Centres */}
          <Route path="/centres/bengaluru" element={<Bangalore />} />
          <Route path="/centres/kochi" element={<Kochi />} />
          <Route path="/centres/mumbai" element={<Mumbai />} />
          {/* Landing Pages */}
          <Route path="/bangalore" element={<BangaloreLanding />} />
          <Route path="/kochi" element={<KochiLanding />} />
          {/* 👤 Auth & Profile */}
          {/* Auth route alias - redirect /auth to /patientAuth for backward compatibility */}
          <Route
            path="/auth"
            element={<Navigate to="/patientAuth" replace />}
          />
          <Route path="/patientAuth" element={<PatientAuth />} />
          <Route path="/profileDashboard" element={<PatientDashboard />} />
          <Route path="/appointments" element={<AllAppointments />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          {/*  Booking Flow (book for a specific doctor) */}
          <Route
            path="/book-appointment/:doctorId"
            element={<BookAppointment />}
          />
          {/*  Payment success page (Step 4) */}
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
