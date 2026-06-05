import { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import miboIcon from "../assets/logo1.png?w=200&format=webp&quality=85";
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

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(authService.isAuthenticated());
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
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

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 flex-wrap gap-y-2">

        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          <img src={miboIcon} alt="Mibo Icon" className="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg" />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden ml-auto">
          <button onClick={() => (window.location.href = "tel:9083335000")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300">
            <Phone size={20} />
          </button>
          <button onClick={() => (window.location.href = "https://wa.me/919083335000")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
            <MessageCircle size={20} />
          </button>
          {isAuthenticated ? (
            <button onClick={() => handleNavigate("/profileDashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c0d54] text-white hover:bg-[#2a1470] transition-all duration-300">
              <User size={20} />
            </button>
          ) : (
            <button onClick={() => handleNavigate("/patientAuth")}
              className="bg-[#1c0d54] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#2a1470] transition-all duration-300">
              SIGN IN
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#18356C] hover:text-[#34b9a5] transition-colors duration-300">
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-grow justify-center gap-6 text-sm text-gray-700 font-medium">
          <span onClick={() => handleNavigate("/experts")}
            className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105 font-semibold">
            BOOK APPOINTMENT
          </span>
          <div className="relative cursor-pointer"
            onMouseEnter={() => setLocationsOpen(true)}
            onMouseLeave={() => setLocationsOpen(false)}>
            <span className="hover:text-[#34b9a5] transition-all duration-300">LOCATIONS ▾</span>
            {locationsOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-40 z-50">
                <div className="bg-white shadow-lg rounded-md text-black flex flex-col py-2">
                  <span className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => handleLocationClick("/centres/bengaluru")}>Bengaluru</span>
                  <span className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => handleLocationClick("/centres/kochi")}>Kochi</span>
                  <span className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => handleLocationClick("/centres/mumbai")}>Mumbai</span>
                </div>
              </div>
            )}
          </div>
          <div className="relative cursor-pointer"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}>
            <span className="hover:text-[#34b9a5] transition-all duration-300">SERVICES ▾</span>
            {servicesOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-44 z-50">
                <div className="bg-white shadow-lg rounded-md text-black flex flex-col py-2">
                  <span className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => handleServiceClick("/services/in-patient")}>In-Patient</span>
                  <span className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => handleServiceClick("/services/in-person")}>In-Person</span>
                  <span className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => handleServiceClick("/services/online")}>Online</span>
                </div>
              </div>
            )}
          </div>
          <span onClick={() => handleNavigate("/about")} className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105">ABOUT US</span>
          <span onClick={() => handleNavigate("/who-its-for")} className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105">WHO IT'S FOR</span>
          <span onClick={() => handleNavigate("/why-mibo")} className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105">WHY MIBO</span>
          <span onClick={() => handleNavigate("/experts")} className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105">EXPERTS</span>
          <span onClick={() => handleNavigate("/blog")} className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105">BLOG</span>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <button onClick={() => (window.location.href = "tel:9083335000")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:scale-110">
            <Phone size={18} />
          </button>
          <button onClick={() => (window.location.href = "https://wa.me/919083335000")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110">
            <MessageCircle size={18} />
          </button>
          {isAuthenticated ? (
            <button onClick={() => handleNavigate("/profileDashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c0d54] text-white hover:bg-[#2a1470] transition-all duration-300 shadow-lg hover:scale-110">
              <User size={18} />
            </button>
          ) : (
            <button onClick={() => handleNavigate("/patientAuth")}
              className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold whitespace-nowrap text-sm transition-all duration-300 shadow-lg hover:scale-105">
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] backdrop-blur-lg border-t border-white/20">
          <nav className="flex flex-col gap-4 text-[#18276c] font-medium">
            <span onClick={() => handleNavigate("/experts")}
              className="py-2 px-2 bg-[#34b9a5] text-white rounded-full text-center cursor-pointer hover:bg-[#2a857f] transition-colors duration-300">
              BOOK APPOINTMENT
            </span>
            <div className="flex flex-col">
              <span onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className="hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10">LOCATIONS ▾</span>
              {mobileLocationsOpen && (
                <div className="flex flex-col ml-4 mt-2">
                  <span className="py-1 hover:text-green-600 cursor-pointer" onClick={() => handleLocationClick("/centres/bengaluru")}>Bengaluru</span>
                  <span className="py-1 hover:text-green-600 cursor-pointer" onClick={() => handleLocationClick("/centres/kochi")}>Kochi</span>
                  <span className="py-1 hover:text-green-600 cursor-pointer" onClick={() => handleLocationClick("/centres/mumbai")}>Mumbai</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10">SERVICES ▾</span>
              {mobileServicesOpen && (
                <div className="flex flex-col ml-4 mt-2">
                  <span className="py-1 hover:text-green-600 cursor-pointer" onClick={() => handleServiceClick("/services/in-patient")}>In-Patient</span>
                  <span className="py-1 hover:text-green-600 cursor-pointer" onClick={() => handleServiceClick("/services/in-person")}>In-Person</span>
                  <span className="py-1 hover:text-green-600 cursor-pointer" onClick={() => handleServiceClick("/services/online")}>Online</span>
                </div>
              )}
            </div>
            <span onClick={() => handleNavigate("/about")}>ABOUT US</span>
            <span onClick={() => handleNavigate("/who-its-for")}>WHO IT'S FOR</span>
            <span onClick={() => handleNavigate("/why-mibo")}>WHY MIBO</span>
            <span onClick={() => handleNavigate("/experts")}>EXPERTS</span>
            <span onClick={() => handleNavigate("/blog")}>BLOG</span>
          </nav>
        </div>
      )}
    </header>
  );
};

const App = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Header />
    </div>
  );
};

export default App;