import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home.tsx";
import ExpertsPage from "./pages/Experts/ExpertsPage";
import AboutPage from "./pages/About/AboutPage"; // 👈 NEW import
import PremiumSplashScreen from "./components/Spalshscreen.tsx";
import ScrollToTop from "./components/ScrollToTop"; // 👈 keeps page top on route change

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <StrictMode>
      {showSplash ? (
        <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/about" element={<AboutPage />} /> {/* 👈 NEW */}
          </Routes>
        </Router>
      )}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
