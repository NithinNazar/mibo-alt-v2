import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home.tsx";
import ExpertsPage from "./pages/Experts/ExpertsPage";
import AboutPage from "./pages/About/AboutPage";
import PremiumSplashScreen from "./components/Spalshscreen.tsx";
import ScrollToTop from "./components/ScrollToTop";

// 👉 Centres pages
import Bangalore from "./pages/Centers/Bangalore";
import Kochi from "./pages/Centers/Kochi";
import Mumbai from "./pages/Centers/Mumbai";

import BookAppointmentPage from "./pages/BookAppointment/BookAppointmentPage";
import AppointmentConfirmation from "./pages/BookAppointment/AppointmentConfirmation";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <StrictMode>
      <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
        <ScrollToTop />

        {/* Splash Overlay */}
        {showSplash && (
          <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/centres/bengaluru" element={<Bangalore />} />
          <Route path="/centres/kochi" element={<Kochi />} />
          <Route path="/centres/mumbai" element={<Mumbai />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route
            path="/appointment-confirmation"
            element={<AppointmentConfirmation />}
          />
        </Routes>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
