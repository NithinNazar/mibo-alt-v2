import { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import miboIcon from "../assets/logo1.png";
import homeVideo from "../assets/home_video.mp4";
import PremiumSlider from "../components/Slider";
import MentalHealthCard from "./mentalhealth";
import authService from "../services/authService";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [locationsOpen, setLocationsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navigate = useNavigate();

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener("storage", checkAuth);

    // Custom event for same-tab auth changes
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLocationClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setMobileLocationsOpen(false);
  };

  const handleServiceClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 
        bg-white
        shadow-sm border-b border-gray-100
        transition-all duration-1000 ease-out
        ${
          isVisible
            ? "transform translate-y-0 opacity-100"
            : "transform -translate-y-full opacity-0"
        }`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 flex-wrap gap-y-2">
        {/* Logo */}
        <div
          className={`flex flex-col items-start flex-shrink-0 transition-all duration-800 delay-300 ease-out ${
            isVisible
              ? "transform translate-x-0 opacity-100"
              : "transform -translate-x-8 opacity-0"
          }`}
          onClick={() => navigate("/")}
        >
          <img
            src={miboIcon}
            alt="Mibo Icon"
            className="w-12 h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 drop-shadow-lg cursor-pointer"
          />
        </div>

        {/* Mobile Header Actions */}
        <div
          className={`flex items-center gap-2 lg:hidden ml-auto transition-all duration-600 delay-500 ease-out ${
            isVisible
              ? "transform scale-100 opacity-100"
              : "transform scale-0 opacity-0"
          }`}
        >
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
            <MessageCircle size={20} />
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => handleNavigate("/profileDashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c0d54] text-white hover:bg-[#2a1470] transition-all duration-300"
              title="Profile"
            >
              <User size={20} />
            </button>
          ) : (
            <button
              onClick={() => handleNavigate("/patientAuth")}
              className="bg-[#1c0d54] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#2a1470] transition-all duration-300"
            >
              SIGN IN
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#18356C] hover:text-[#34b9a5] text-3xl transition-colors duration-300"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          className={`hidden lg:flex flex-grow justify-center gap-6 text-sm text-gray-700 font-medium transition-all duration-800 delay-400 ease-out ${
            isVisible
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-4 opacity-0"
          }`}
        >
          {/* Book Appointment */}
          <span
            onClick={() => handleNavigate("/experts")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105 font-semibold"
          >
            BOOK APPOINTMENT
          </span>

          {/* Locations Dropdown */}
          <div
            className="relative cursor-pointer group"
            onMouseEnter={() => setLocationsOpen(true)}
            onMouseLeave={() => setLocationsOpen(false)}
          >
            <span className="hover:text-[#34b9a5] transition-all duration-300 drop-shadow-lg pb-4">
              LOCATIONS ▾
            </span>
            {locationsOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-40 z-50">
                <div className="bg-white shadow-lg rounded-md text-black flex flex-col py-2">
                  <span
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/bengaluru")}
                  >
                    Bengaluru
                  </span>
                  <span
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/kochi")}
                  >
                    Kochi
                  </span>
                  <span
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/mumbai")}
                  >
                    Mumbai
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div
            className="relative cursor-pointer group"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <span className="hover:text-[#34b9a5] transition-all duration-300 drop-shadow-lg pb-4">
              SERVICES ▾
            </span>
            {servicesOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-44 z-50">
                <div className="bg-white shadow-lg rounded-md text-black flex flex-col py-2">
                  <span
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/services/in-patient")}
                  >
                    In-Patient
                  </span>
                  <span
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/services/in-person")}
                  >
                    In-Person
                  </span>
                  <span
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/services/online")}
                  >
                    Online
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Other nav items with routing */}
          <span
            onClick={() => handleNavigate("/about")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105"
          >
            ABOUT US
          </span>
          <span
            onClick={() => handleNavigate("/who-its-for")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105"
          >
            WHO IT’S FOR
          </span>
          <span
            onClick={() => handleNavigate("/why-mibo")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105"
          >
            WHY MIBO
          </span>
          <span
            onClick={() => handleNavigate("/experts")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105"
          >
            EXPERTS
          </span>
          <span
            onClick={() => handleNavigate("/blog")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 drop-shadow-lg hover:scale-105"
          >
            BLOG
          </span>
        </nav>

        {/* Desktop Action Buttons */}
        <div
          className={`hidden lg:flex items-center gap-3 flex-shrink-0 transition-all duration-800 delay-600 ease-out ${
            isVisible
              ? "transform translate-x-0 opacity-100"
              : "transform translate-x-8 opacity-0"
          }`}
        >
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:scale-110">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110">
            <MessageCircle size={18} />
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => handleNavigate("/profileDashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c0d54] text-white hover:bg-[#2a1470] transition-all duration-300 shadow-lg hover:scale-110"
              title="Profile"
            >
              <User size={18} />
            </button>
          ) : (
            <button
              onClick={() => handleNavigate("/patientAuth")}
              className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold whitespace-nowrap text-sm transition-all duration-300 shadow-lg hover:scale-105"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] backdrop-blur-lg border-t border-white/20">
          <nav className="flex flex-col gap-4 text-[#18276c] font-medium mb-6">
            {/* Book Appointment */}
            <span
              onClick={() => handleNavigate("/experts")}
              className="py-2 px-2 bg-[#34b9a5] text-white rounded-full text-center cursor-pointer hover:bg-[#2a857f] transition-colors duration-300"
            >
              BOOK APPOINTMENT
            </span>

            {/* Mobile Locations */}
            <div className="flex flex-col">
              <span
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className="hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10 hover:border-[#34b9a5]/30 transition-colors duration-300"
              >
                LOCATIONS ▾
              </span>
              {mobileLocationsOpen && (
                <div className="flex flex-col ml-4 mt-2">
                  <span
                    className="py-1 hover:text-green-600 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/bengaluru")}
                  >
                    Bengaluru
                  </span>
                  <span
                    className="py-1 hover:text-green-600 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/kochi")}
                  >
                    Kochi
                  </span>
                  <span
                    className="py-1 hover:text-green-600 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/mumbai")}
                  >
                    Mumbai
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Services */}
            <div className="flex flex-col">
              <span
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10 hover:border-[#34b9a5]/30 transition-colors duration-300"
              >
                SERVICES ▾
              </span>
              {mobileServicesOpen && (
                <div className="flex flex-col ml-4 mt-2">
                  <span
                    className="py-1 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/services/in-patient")}
                  >
                    In-Patient
                  </span>
                  <span
                    className="py-1 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/services/in-person")}
                  >
                    In-Person
                  </span>
                  <span
                    className="py-1 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/services/online")}
                  >
                    Online
                  </span>
                </div>
              )}
            </div>

            {/* Other links */}
            <span onClick={() => handleNavigate("/about")}>ABOUT US</span>
            <span onClick={() => handleNavigate("/who-its-for")}>
              WHO IT’S FOR
            </span>
            <span onClick={() => handleNavigate("/why-mibo")}>WHY MIBO</span>
            <span onClick={() => handleNavigate("/experts")}>EXPERTS</span>
            <span onClick={() => handleNavigate("/blog")}>BLOG</span>
          </nav>
        </div>
      )}
    </header>
  );
};

const DesktopVideo = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={homeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Welcome to Mibo
        </h1>
        <p className="text-white text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl">
          Your Mental Health Companion - Professional care for your wellbeing
        </p>
        <button
          onClick={() => navigate("/experts")}
          className="bg-[#34b9a5] hover:bg-[#2a9d8c] text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 shadow-2xl hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Header />
      <div className="w-full overflow-y-auto">
        {isMobile ? (
          <div className="flex flex-col justify-start items-center">
            <PremiumSlider />
            <div className="flex justify-center">
              <MentalHealthCard />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <DesktopVideo />
            <MentalHealthCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
