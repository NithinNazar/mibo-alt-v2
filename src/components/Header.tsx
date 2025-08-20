import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X } from 'lucide-react';
import miboIcon from '../assets/logo.png.png';
import PremiumSlider from '../components/Slider';
import MentalHealthCard from './mentalhealth';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <header
            className={`w-full fixed top-0 left-0 z-50 
            bg-[rgb(255,255,255)] md:bg-transparent
            shadow-sm border-b border-gray-100 
            transition-all duration-1000 ease-out
            ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'}
   `}
        >
            <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 flex-wrap gap-y-2">
                {/* Logo */}
                <div
                    className={`flex flex-col items-start flex-shrink-0 transition-all duration-800 delay-300 ease-out ${
                        isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-8 opacity-0'
                    }`}
                >
                    <img
                        src={miboIcon}
                        alt="Mibo Icon"
                        className="w-12 h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 drop-shadow-lg"
                    />
                </div>

                {/* Mobile Header Actions (WhatsApp + Sign Up + Hamburger) */}
                <div
                    className={`flex items-center gap-2 lg:hidden ml-auto transition-all duration-600 delay-500 ease-out ${
                        isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'
                    }`}
                >
                    {/* WhatsApp */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
                        <MessageCircle size={20} />
                    </button>

                    {/* Sign Up */}
                    <button className="bg-[#1c0d54] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#2a1470] transition-all duration-300">
                        SIGN UP
                    </button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-[#18356C] hover:text-[#34b9a5] text-3xl transition-colors duration-300"
                    >
                        {menuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav
                    className={`hidden lg:flex flex-grow justify-center gap-6 text-sm text-white font-medium transition-all duration-800 delay-400 ease-out ${
                        isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'
                    }`}
                >
                    {['ABOUT US', "WHO IT'S FOR", 'SERVICES', 'WHY MIBO', 'LOCATIONS', 'EXPERTS', 'BLOG'].map(
                        (item, index) => (
                            <span
                                key={item}
                                className={`hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105 ${
                                    isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: `${600 + index * 100}ms`,
                                }}
                            >
                                {item} ▾
                            </span>
                        )
                    )}
                </nav>

                {/* Desktop Action Buttons */}
                <div
                    className={`hidden lg:flex items-center gap-3 flex-shrink-0 transition-all duration-800 delay-600 ease-out ${
                        isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-8 opacity-0'
                    }`}
                >
                    <button
                        className={`w-10 h-10 flex items-center justify-center rounded-full border border-white/30 hover:border-[#34b9a5] text-white hover:text-[#34b9a5] bg-black/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                            isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '800ms' }}
                    >
                        <Phone size={18} />
                    </button>
                    <button
                        className={`w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110 ${
                            isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '900ms' }}
                    >
                        <MessageCircle size={18} />
                    </button>
                    <button
                        className={`bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold whitespace-nowrap text-sm transition-all duration-300 shadow-lg hover:scale-105 ${
                            isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '1000ms' }}
                    >
                        SIGN UP
                    </button>
                    <button
                        className={`bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold whitespace-nowrap text-sm transition-all duration-300 shadow-lg hover:scale-105 ${
                            isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '1100ms' }}
                    >
                        SIGN IN
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] backdrop-blur-lg border-t border-white/20">
                    <nav className="flex flex-col gap-4 text-[#18276c] font-medium mb-6">
                        {['ABOUT US', "WHO IT'S FOR", 'SERVICES', 'WHY MIBO', 'LOCATIONS', 'EXPERTS', 'BLOG'].map(
                            (item, index) => (
                                <span
                                    key={item}
                                    className="hover:text-[#34b9a5] cursor-pointer transition-colors duration-300 py-2 border-b border-white/10 hover:border-[#34b9a5]/30"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'fadeInUp 0.3s ease-out forwards',
                                    }}
                                >
                                    {item}
                                </span>
                            )
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

const DesktopVideo = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
            <video autoPlay muted loop playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
                <source src="/home_vedio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-10" />
        </div>
    );
};

const App = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Header */}
            <Header /> {/* ✅ No extra fixed wrapper needed */}
            {/* Content */}
            <div className="w-full h-screen overflow-y-auto">
                {/* ⬆ add padding-top so content doesn't go under header 
                     (adjust 80px to your header height) */}
                {isMobile ? (
                    <div className="flex flex-col justify-start items-center pt-5 pb-10">
                        <PremiumSlider />
                        <div className="flex justify-center pt-8 w-full">
                            <MentalHealthCard />
                        </div>
                    </div>
                ) : (
                    <DesktopVideo />
                )}
            </div>
        </div>
    );
};

export default App;
