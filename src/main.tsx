// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import Home from './pages/Home.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//       <Home />
//   </StrictMode>,
// )

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home.tsx';
import PremiumSplashScreen from './components/Spalshscreen.tsx';

const App = () => {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <StrictMode>{showSplash ? <PremiumSplashScreen onComplete={() => setShowSplash(false)} /> : <Home />}</StrictMode>
    );
};

createRoot(document.getElementById('root')!).render(<App />);
