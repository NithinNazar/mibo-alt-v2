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
        </Routes>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

//==================================================================================================

// import { StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css";

// import Home from "./pages/Home.tsx";
// import ExpertsPage from "./pages/Experts/ExpertsPage";
// import AboutPage from "./pages/About/AboutPage";
// import PremiumSplashScreen from "./components/Spalshscreen.tsx";
// import ScrollToTop from "./components/ScrollToTop";

// // 👉 Centres pages
// import Bangalore from "./pages/Centers/Bangalore";
// import Kochi from "./pages/Centers/Kochi";
// import Mumbai from "./pages/Centers/Mumbai";

// const App = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <StrictMode>
//       {showSplash ? (
//         <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
//       ) : (
//         <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
//           <ScrollToTop />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/experts" element={<ExpertsPage />} />
//             <Route path="/about" element={<AboutPage />} />

//             {/* 🆕 Centres Routes */}
//             <Route path="/centres/bengaluru" element={<Bangalore />} />
//             <Route path="/centres/kochi" element={<Kochi />} />
//             <Route path="/centres/mumbai" element={<Mumbai />} />
//           </Routes>
//         </Router>
//       )}
//     </StrictMode>
//   );
// };

// createRoot(document.getElementById("root")!).render(<App />);

//==================================================================================================

// import { StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css";

// import Home from "./pages/Home.tsx";
// import ExpertsPage from "./pages/Experts/ExpertsPage";
// import AboutPage from "./pages/About/AboutPage";
// import PremiumSplashScreen from "./components/Spalshscreen.tsx";
// import ScrollToTop from "./components/ScrollToTop";

// // 👉 NEW imports
// import Bangalore from "./pages/Centers/Bangalore";
// // import Kochi from "./pages/Centers/Kochi";
// // import Mumbai from "./pages/Centers/Mumbai";

// const App = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <StrictMode>
//       {showSplash ? (
//         <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
//       ) : (
//         <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
//           <ScrollToTop />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/experts" element={<ExpertsPage />} />
//             <Route path="/about" element={<AboutPage />} />
//             {/* 🆕 Centres */}
//             <Route path="/centers/bangalore" element={<Bangalore />} />
//             {/* <Route path="/centers/kochi" element={<Kochi />} /> */}
//             {/* <Route path="/centers/mumbai" element={<Mumbai />} /> */}
//           </Routes>
//         </Router>
//       )}
//     </StrictMode>
//   );
// };

// createRoot(document.getElementById("root")!).render(<App />);

// =================================================================================================

// import { StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css";

// import Home from "./pages/Home.tsx";
// import ExpertsPage from "./pages/Experts/ExpertsPage";
// import AboutPage from "./pages/About/AboutPage"; // 👈 NEW import
// import PremiumSplashScreen from "./components/Spalshscreen.tsx";
// import ScrollToTop from "./components/ScrollToTop"; // 👈 keeps page top on route change

// const App = () => {
//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <StrictMode>
//       {showSplash ? (
//         <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
//       ) : (
//         <Router basename={import.meta.env.VITE_BASE_PATH || "/mibo-alt-v2/"}>
//           <ScrollToTop />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/experts" element={<ExpertsPage />} />
//             <Route path="/about" element={<AboutPage />} /> {/* 👈 NEW */}
//           </Routes>
//         </Router>
//       )}
//     </StrictMode>
//   );
// };

// createRoot(document.getElementById("root")!).render(<App />);
