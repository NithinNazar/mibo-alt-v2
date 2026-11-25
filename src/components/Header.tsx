import {
  DEFAULT_TEL_LINK,
  DEFAULT_WHATSAPP_URL,
  BANGALORE_TEL_LINK,
  BANGALORE_WHATSAPP_URL,
  KOCHI_TEL_LINK,
  KOCHI_WHATSAPP_URL,
} from "../utils/contact";
import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  User,
  Brain,
  Pill,
  CalendarCheck,
  MapPin,
  HeartHandshake,
  Info,
  Users,
  Sparkles,
  UserCheck,
  BookOpen,
  Stethoscope,
  BedDouble,
  ClipboardCheck,
  MessageCircleHeart,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import miboIcon from "../assets/logo1.png?w=200&format=webp&quality=85";
import authService from "../services/authService";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [expertsOpen, setExpertsOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileExpertsOpen, setMobileExpertsOpen] = useState(false);

  const navigate = useNavigate();
  const routerLocation = useLocation();

  // On a location landing page, links to the Experts / Psychiatrist pages carry
  // that location so the destination opens with the Location filter applied.
  const landingLocation = (() => {
    const path = routerLocation.pathname.replace(/\/+$/, "").toLowerCase();
    if (path === "/kochi") return "Kochi";
    if (path === "/bengaluru" || path === "/bangalore") return "Bangalore";
    return null;
  })();
  // Call / WhatsApp buttons use the number of the location landing page being
  // viewed (Kochi: 9447511479, Bangalore: 7996004444); every other page uses
  // the default Mibo number (+91 90833 35000).
  const contactTelLink =
    landingLocation === "Kochi"
      ? KOCHI_TEL_LINK
      : landingLocation === "Bangalore"
        ? BANGALORE_TEL_LINK
        : DEFAULT_TEL_LINK;
  const contactWhatsappUrl =
    landingLocation === "Kochi"
      ? KOCHI_WHATSAPP_URL
      : landingLocation === "Bangalore"
        ? BANGALORE_WHATSAPP_URL
        : DEFAULT_WHATSAPP_URL;
  const withLandingLocation = (path: string) => {
    if (!landingLocation) return path;
    const base = path.split("?")[0];
    if (base !== "/experts" && base !== "/psychiatrist") return path;
    return `${path}${path.includes("?") ? "&" : "?"}location=${landingLocation}`;
  };

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
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setMobileLocationsOpen(false);
  };

  const handleServiceClick = (path: string) => {
    navigate(withLandingLocation(path));
    setMenuOpen(false);
    setMobileServicesOpen(false);
  };

  // Handle expert click based on specialization

const handleExpertClick = (specialization: string) => {
  setMenuOpen(false);
  setMobileExpertsOpen(false);

  // if (specialization === "Psychiatrist") {
  //   window.location.href = "/experts";
  //   return;
  // }

  sessionStorage.setItem("expertsFilter", specialization);
  navigate(withLandingLocation("/experts"));
};

const handleNavigate = (path: string) => {
  navigate(withLandingLocation(path));
  setMenuOpen(false);
};

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-100 font-['Quicksand',sans-serif] transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 flex-wrap gap-y-2">
        {/* Logo */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={miboIcon}
            alt="Mibo Icon"
            className="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg"
          />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden ml-auto">
          <button
            onClick={() => (window.location.href = contactTelLink)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300"
          >
            <Phone size={20} />
          </button>
          <button
            onClick={() =>
              (window.location.href = contactWhatsappUrl)
            }
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
          >
            <MessageCircle size={20} />
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => handleNavigate("/profileDashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c0d54] text-white hover:bg-[#2a1470] transition-all duration-300"
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
            className="text-[#18356C] hover:text-[#34b9a5] transition-colors duration-300"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-grow justify-center gap-6 text-sm text-gray-700 font-medium">
          <span
            onClick={() => handleNavigate("/experts")}
            className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105 font-semibold"
          >
            <CalendarCheck size={16} className="text-[#34b9a5] flex-shrink-0" />
            BOOK APPOINTMENT
          </span>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setLocationsOpen(true)}
            onMouseLeave={() => setLocationsOpen(false)}
          >
            <span className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] transition-all duration-300">
              <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
              LOCATIONS ▾
            </span>
            {locationsOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-40 z-50">
                <div className="bg-white shadow-lg rounded-md text-black flex flex-col py-2">
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleLocationClick("/bengaluru")}
                  >
                    <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Bengaluru
                  </span>
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleLocationClick("/kochi")}
                  >
                    <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Kochi
                  </span>
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/mumbai")}
                  >
                    <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Mumbai
                  </span>
                </div>
              </div>
            )}
          </div>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <span className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] transition-all duration-300">
              <HeartHandshake size={16} className="text-[#34b9a5] flex-shrink-0" />
              SERVICES ▾
            </span>
            {servicesOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-64 z-50">
                <div className="bg-white shadow-lg rounded-md text-black flex flex-col py-2">
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/psychiatrist")}
                  >
                    <Stethoscope size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Psychiatrist
                  </span>
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/services/in-patient")}
                  >
                    <BedDouble size={16} className="text-[#34b9a5] flex-shrink-0" />
                    In-patient Care
                  </span>
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/experts?specialization=Clinical%20Psychologist")}
                  >
                    <Brain size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Clinical Psychologist
                  </span>
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/experts?specialization=Counsellor")}
                  >
                    <MessageCircleHeart size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Counselling Psychologist
                  </span>
                  <span
                    className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleServiceClick("/experts?specialization=Clinical%20Psychologist")}
                  >
                    <ClipboardCheck size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Assessment
                  </span>
                </div>
              </div>
            )}
          </div>
          <span
            onClick={() => handleNavigate("/about")}
            className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <Info size={16} className="text-[#34b9a5] flex-shrink-0" />
            ABOUT US
          </span>
          <span
            onClick={() => handleNavigate("/who-its-for")}
            className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <Users size={16} className="text-[#34b9a5] flex-shrink-0" />
            WHO IT'S FOR
          </span>
          <span
            onClick={() => handleNavigate("/why-mibo")}
            className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <Sparkles size={16} className="text-[#34b9a5] flex-shrink-0" />
            WHY MIBO
          </span>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setExpertsOpen(true)}
            onMouseLeave={() => setExpertsOpen(false)}
          >
            <span className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] transition-all duration-300">
              <UserCheck size={16} className="text-[#34b9a5] flex-shrink-0" />
              EXPERTS ▾
            </span>
            {expertsOpen && (
              <div className="absolute top-full left-0 pt-4 -mt-4 w-80 z-50">
                <div className="bg-white shadow-xl rounded-lg text-black flex flex-col py-3 border border-gray-100">
                  <div
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 group"
                    onClick={() => handleExpertClick("Clinical Psychologist")}
                  >
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-[#34b9a5] mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-bold text-gray-800 group-hover:text-[#34b9a5] transition-colors">
                          Clinical Psychologists
                        </div>
                        <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                          Find safe, compassionate care for your mental health
                          journey.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-200 group"
                    onClick={() => handleExpertClick("Psychiatrist")}
                  >
                    <div className="flex items-start gap-3">
                      <Pill className="w-5 h-5 text-[#34b9a5] mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-bold text-gray-800 group-hover:text-[#34b9a5] transition-colors">
                          Psychiatrists
                        </div>
                        <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                          Expert medical care for advanced mental health
                          conditions.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <span
            onClick={() => handleNavigate("/blog")}
            className="inline-flex items-center gap-1.5 hover:text-[#34b9a5] cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <BookOpen size={16} className="text-[#34b9a5] flex-shrink-0" />
            BLOG
          </span>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => (window.location.href = contactTelLink)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:scale-110"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={() =>
              (window.location.href = contactWhatsappUrl)
            }
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle size={18} />
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => handleNavigate("/profileDashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c0d54] text-white hover:bg-[#2a1470] transition-all duration-300 shadow-lg hover:scale-110"
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

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] backdrop-blur-lg border-t border-white/20">
          <nav className="flex flex-col gap-4 text-[#18276c] font-medium">
            <span
              onClick={() => handleNavigate("/experts")}
              className="py-2 px-2 bg-[#34b9a5] text-white rounded-full justify-center flex items-center gap-2 cursor-pointer hover:bg-[#2a857f] transition-colors duration-300"
            >
              <CalendarCheck size={16} className="flex-shrink-0" />
              BOOK APPOINTMENT
            </span>
            <div className="flex flex-col">
              <span
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className="flex items-center gap-2 hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10"
              >
                <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                LOCATIONS ▾
              </span>
              {mobileLocationsOpen && (
                <div className="flex flex-col ml-4 mt-2">
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleLocationClick("/bengaluru")}
                  >
                    <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Bengaluru
                  </span>
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleLocationClick("/kochi")}
                  >
                    <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Kochi
                  </span>
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleLocationClick("/centres/mumbai")}
                  >
                    <MapPin size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Mumbai
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center gap-2 hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10"
              >
                <HeartHandshake size={16} className="text-[#34b9a5] flex-shrink-0" />
                SERVICES ▾
              </span>
              {mobileServicesOpen && (
                <div className="flex flex-col ml-4 mt-2">
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/psychiatrist")}
                  >
                    <Stethoscope size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Psychiatrist
                  </span>
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/services/in-patient")}
                  >
                    <BedDouble size={16} className="text-[#34b9a5] flex-shrink-0" />
                    In-patient Care
                  </span>
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/experts?specialization=Clinical%20Psychologist")}
                  >
                    <Brain size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Clinical Psychologist
                  </span>
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/experts?specialization=Counsellor")}
                  >
                    <MessageCircleHeart size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Counselling Psychologist
                  </span>
                  <span
                    className="py-1 flex items-center gap-2 hover:text-green-600 cursor-pointer"
                    onClick={() => handleServiceClick("/experts?specialization=Clinical%20Psychologist")}
                  >
                    <ClipboardCheck size={16} className="text-[#34b9a5] flex-shrink-0" />
                    Assessment
                  </span>
                </div>
              )}
            </div>
            <span
              onClick={() => handleNavigate("/about")}
              className="flex items-center gap-2"
            >
              <Info size={16} className="text-[#34b9a5] flex-shrink-0" />
              ABOUT US
            </span>
            <span
              onClick={() => handleNavigate("/who-its-for")}
              className="flex items-center gap-2"
            >
              <Users size={16} className="text-[#34b9a5] flex-shrink-0" />
              WHO IT'S FOR
            </span>
            <span
              onClick={() => handleNavigate("/why-mibo")}
              className="flex items-center gap-2"
            >
              <Sparkles size={16} className="text-[#34b9a5] flex-shrink-0" />
              WHY MIBO
            </span>
            <div className="flex flex-col">
              <span
                onClick={() => setMobileExpertsOpen(!mobileExpertsOpen)}
                className="flex items-center gap-2 hover:text-[#34b9a5] cursor-pointer py-2 border-b border-white/10"
              >
                <UserCheck size={16} className="text-[#34b9a5] flex-shrink-0" />
                EXPERTS ▾
              </span>
              {mobileExpertsOpen && (
                <div className="flex flex-col ml-4 mt-2 gap-2">
                  <div
                    className="py-2 px-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
                    onClick={() => handleExpertClick("Clinical Psychologist")}
                  >
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-[#34b9a5] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-sm text-gray-800">
                          Clinical Psychologists
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Find safe, compassionate care for your mental health
                          journey.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="py-2 px-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
                    onClick={() => handleExpertClick("Psychiatrist")}
                  >
                    <div className="flex items-start gap-2">
                      <Pill className="w-4 h-4 text-[#34b9a5] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-sm text-gray-800">
                          Psychiatrists
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Expert medical care for advanced mental health
                          conditions.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span
              onClick={() => handleNavigate("/blog")}
              className="flex items-center gap-2"
            >
              <BookOpen size={16} className="text-[#34b9a5] flex-shrink-0" />
              BLOG
            </span>
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