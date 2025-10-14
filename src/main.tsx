import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.tsx";
import ExpertsPage from "./pages/Experts/ExpertsPage";
import PremiumSplashScreen from "./components/Spalshscreen.tsx";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <StrictMode>
      {showSplash ? (
        <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experts" element={<ExpertsPage />} />
          </Routes>
        </Router>
      )}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

// import { StrictMode, useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import Home from './pages/Home.tsx';
// import PremiumSplashScreen from './components/Spalshscreen.tsx';

// const App = () => {
//     const [showSplash, setShowSplash] = useState(true);

//     return (
//         <StrictMode>{showSplash ? <PremiumSplashScreen onComplete={() => setShowSplash(false)} /> : <Home />}</StrictMode>
//     );
// };

// createRoot(document.getElementById('root')!).render(<App />);
