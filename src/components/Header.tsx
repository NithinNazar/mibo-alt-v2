
import PremiumSlider from "../components/Slider";
import MentalHealthCard from "./mentalhealth";
import homeVideo from "../assets/home_video.mp4";
import { useState, useEffect, useRef } from "react";
import { Phone,/*  MessageCircle,  , ChevronUp ,*/ Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import miboIcon from "../assets/logo1.png";

const Header = () => { 
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [_activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const handleLocationClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setMobileLocationsOpen(false);
    setLocationsOpen(false);
  };

  const handleServiceClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setLocationsOpen(false);
        setServicesOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced hover effect for dropdown
  const handleDropdownHover = (dropdown: string, isHovering: boolean) => {
    setActiveDropdown(isHovering ? dropdown : null);
    if (dropdown === 'locations') {
      setLocationsOpen(isHovering);
    } else if (dropdown === 'services') {
      setServicesOpen(isHovering);
    }
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 
        transition-all duration-500 ease-out
        ${
          isScrolled
            ? "bg-white shadow-2xl border-b border-gray-100 backdrop-blur-lg bg-white/95"
            : "bg-white shadow-lg"
        }
        ${
          isVisible
            ? "transform translate-y-0 opacity-100"
            : "transform -translate-y-full opacity-0"
        }`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo with enhanced animation */}
        <div
          className={`flex items-center flex-shrink-0 transition-all duration-1000 ease-out cursor-pointer group ${
            isVisible
              ? "transform translate-x-0 opacity-100"
              : "transform -translate-x-8 opacity-0"
          }`}
          onClick={() => navigate("/")}
        >
          <img
            src={miboIcon}
            alt="Mibo Icon"
            className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg transition-all duration-500 group-hover:scale-110 "
          />
          {/* <div className="ml-3">
            <div className="text-lg font-bold bg-gradient-to-r from-[#1c0d54] to-[#34b9a5] bg-clip-text text-transparent">
              MIBO
            </div>
            <div className="text-xs text-gray-500">Mental Wellness</div>
          </div> */}
        </div>

        {/* Mobile Header Actions */}
        <div
          className={`flex items-center gap-2 lg:hidden ml-auto transition-all duration-600 delay-500 ease-out ${
            isVisible
              ? "transform scale-100 opacity-100"
              : "transform scale-0 opacity-0"
          }`}
        >
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
           <a
  href="https://wa.me/9083335000"
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
    <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
</a>
          </button>
          <button
            onClick={() => handleNavigate("/signup")}
            className="bg-gradient-to-r from-[#1c0d54] to-[#2a1470] text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-[#2a1470] hover:to-[#3a1c90] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            SIGN UP
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#18356C] hover:text-[#34b9a5] text-3xl transition-all duration-300 hover:scale-110"
          >
            {menuOpen ? (
              <X size={32} className="animate-spin-in" />
            ) : (
              <Menu size={32} className="animate-pulse-once" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          className={`hidden lg:flex flex-grow justify-center gap-8 text-sm font-medium transition-all duration-800 delay-400 ease-out
            ${
              isVisible
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-4 opacity-0"
            }`}
        >
          {/* Book Appointment */}
          {/* <span
            onClick={() => handleNavigate("/experts")}
            className="relative group cursor-pointer transition-all duration-300"
          >
            <span className="relative z-10 text-gray-800 group-hover:text-white font-semibold px-4 py-2 rounded-full group-hover:bg-gradient-to-r from-[#34b9a5] to-emerald-500 transition-all duration-300">
              BOOK APPOINTMENT
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#34b9a5]/20 to-emerald-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></span>
          </span> */}

          {/* Locations Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => handleDropdownHover('locations', true)}
            onMouseLeave={() => handleDropdownHover('locations', false)}
          >
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-gray-800 group-hover:text-[#34b9a5] font-semibold transition-all duration-300 group-hover:scale-105">
                LOCATIONS
              </span>
              <ChevronDown 
                size={16} 
                className={`transition-all duration-300 transform ${
                  locationsOpen ? 'rotate-180 text-[#34b9a5]' : 'group-hover:rotate-180 group-hover:text-[#34b9a5]'
                }`}
              />
            </div>
            
            {locationsOpen && (
              <div className="absolute top-full left-0  w-48 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 animate-dropdown-fade z-50">
                <div className="p-1">
                  <div className="relative overflow-hidden group/item">
                    <span
                      className="block px-4 py-3 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 cursor-pointer rounded-lg text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:pl-6"
                      onClick={() => handleLocationClick("/centres/bengaluru")}
                    >
                      <span className="flex items-center gap-2">
                       
                        Bengaluru
                      </span>
                    </span>
                  </div>
                  <div className="relative overflow-hidden group/item">
                    <span
                      className="block px-4 py-3 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 cursor-pointer rounded-lg text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:pl-6"
                      onClick={() => handleLocationClick("/centres/kochi")}
                    >
                      <span className="flex items-center gap-2">
                        
                        Kochi
                      </span>
                    </span>
                  </div>
                  <div className="relative overflow-hidden group/item">
                    <span
                      className="block px-4 py-3 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 cursor-pointer rounded-lg text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:pl-6"
                      onClick={() => handleLocationClick("/centres/mumbai")}
                    >
                      <span className="flex items-center gap-2">
                       
                        Mumbai
                      </span>
                    </span>
                  </div>
                </div>
                
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => handleDropdownHover('services', true)}
            onMouseLeave={() => handleDropdownHover('services', false)}
          >
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-gray-800 group-hover:text-[#34b9a5] font-semibold transition-all duration-300 group-hover:scale-105">
                SERVICES
              </span>
              <ChevronDown 
                size={16} 
                className={`transition-all duration-300 transform ${
                  servicesOpen ? 'rotate-180 text-[#34b9a5]' : 'group-hover:rotate-180 group-hover:text-[#34b9a5]'
                }`}
              />
            </div>
            
            {servicesOpen && (
              <div className="absolute top-full left-0 w-52 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 animate-dropdown-slide z-50">
                <div className="p-1">
                  <div className="relative overflow-hidden group/item">
                    <span
                      className="block px-4 py-3 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 cursor-pointer rounded-lg text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:pl-6"
                      onClick={() => handleServiceClick("/services/in-patient")}
                    >
                      <span className="flex items-center gap-2">
                      
                        In-Patient Care
                      </span>
                    </span>
                  </div>
                  <div className="relative overflow-hidden group/item">
                    <span
                      className="block px-4 py-3 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 cursor-pointer rounded-lg text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:pl-6"
                      onClick={() => handleServiceClick("/services/in-person")}
                    >
                      <span className="flex items-center gap-2">
                       
                        In-Person Therapy
                      </span>
                    </span>
                  </div>
                  <div className="relative overflow-hidden group/item">
                    <span
                      className="block px-4 py-3 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 cursor-pointer rounded-lg text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:pl-6"
                      onClick={() => handleServiceClick("/services/online")}
                    >
                      <span className="flex items-center gap-2">
                       
                        Online Sessions
                      </span>
                    </span>
                  </div>
                </div>
               
              </div>
            )}
          </div>

          {/* Other nav items with enhanced hover effects */}
          {["ABOUT US", "WHO IT'S FOR", "WHY MIBO", "EXPERTS", "BLOG"].map((item) => (
            <span
              key={item}
     onClick={() => handleNavigate(`/${item.toLowerCase().replace(" it's for", "").replace("'", "").replace(" ", "-").replace(" us", "")}`)}
              className="relative group cursor-pointer transition-all duration-300"
            >
              <span className="text-gray-800 group-hover:text-[#34b9a5] font-semibold transition-all duration-300 group-hover:scale-105">
                {item}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#34b9a5] to-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </span>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div
          className={`hidden lg:flex items-center gap-4 flex-shrink-0 transition-all duration-800 delay-600 ease-out ${
            isVisible
              ? "transform translate-x-0 opacity-100"
              : "transform translate-x-8 opacity-0"
          }`}
        >
          {/* Phone Button */}
          <a
            href="tel:9083335000"
            className="relative group"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
              <Phone size={20} />
            </div>
            
          </a>

          {/* WhatsApp Button */}
          <a
  href="https://wa.me/9083335000"
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
    <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
</a>

          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate("/signup")}
              className="bg-gradient-to-r from-[#1c0d54] to-[#2a1470] text-white px-6 py-3 rounded-full hover:from-[#2a1470] hover:to-[#3a1c90] font-semibold whitespace-nowrap text-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5"
            >
              SIGN UP
            </button>

            <button
              onClick={() => handleNavigate("/signin")}
              className="bg-gradient-to-r from-white to-gray-50 text-[#1c0d54] border-2 border-[#1c0d54] px-6 py-3 rounded-full hover:bg-gradient-to-r hover:from-[#1c0d54] hover:to-[#2a1470] hover:text-white font-semibold whitespace-nowrap text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-gradient-to-b from-white to-gray-50 backdrop-blur-xl border-t border-gray-100 animate-slide-down">
          <nav className="flex flex-col gap-3 font-medium mb-6">
            {/* Book Appointment */}
            <span
              onClick={() => handleNavigate("/experts")}
              className="py-3 px-4 bg-gradient-to-r from-[#34b9a5] to-emerald-500 text-white rounded-xl text-center cursor-pointer hover:from-[#2a857f] hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              BOOK APPOINTMENT
            </span>

            {/* Mobile Locations */}
            <div className="flex flex-col">
              <div
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className="flex items-center justify-between py-3 px-4 border-b border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-300"
              >
                <span className="text-gray-800 font-semibold">LOCATIONS</span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${mobileLocationsOpen ? 'rotate-180 text-[#34b9a5]' : ''}`}
                />
              </div>
              {mobileLocationsOpen && (
                <div className="flex flex-col ml-4 mt-2 space-y-2 animate-fade-in">
                  {["Bengaluru", "Kochi", "Mumbai"].map((city) => (
                    <span
                      key={city}
                      className="py-2 px-4 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 hover:text-[#34b9a5] cursor-pointer rounded-lg transition-all duration-300 hover:pl-6 flex items-center gap-3"
                      onClick={() => handleLocationClick(`/centres/${city.toLowerCase()}`)}
                    >
                     
                      {city}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Services */}
            <div className="flex flex-col">
              <div
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between py-3 px-4 border-b border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-300"
              >
                <span className="text-gray-800 font-semibold">SERVICES</span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180 text-[#34b9a5]' : ''}`}
                />
              </div>
              {mobileServicesOpen && (
                <div className="flex flex-col ml-4 mt-2 space-y-2 animate-fade-in">
                  {["In-Patient Care", "In-Person Therapy", "Online Sessions"].map((service) => (
                    <span
                      key={service}
                      className="py-2 px-4 hover:bg-gradient-to-r from-[#34b9a5]/10 to-emerald-500/10 hover:text-[#34b9a5] cursor-pointer rounded-lg transition-all duration-300 hover:pl-6 flex items-center gap-3"
                      onClick={() => handleServiceClick(`/services/${service.toLowerCase().replace(" ", "-").replace(" ", "-")}`)}
                    >
                     
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Other links */}
            {["About Us", "Who It's For", "Why Mibo", "Experts", "Blog"].map((item) => (
              <span 
                key={item}
               onClick={() => handleNavigate(`/${item.toLowerCase().replace(" it's for", "").replace("'", "").replace(" ", "-").replace(" us", "")}`)}
                className="py-3 px-4 border-b border-gray-200 hover:bg-gradient-to-r from-[#34b9a5]/5 to-emerald-500/5 hover:text-[#34b9a5] cursor-pointer rounded-lg transition-all duration-300 hover:pl-6"
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};


const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          console.log("Video is playing successfully");
        } catch (error) {
          console.error("Error playing video:", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.error("Muted play also failed:", e));
          }
        }
      }
    };

    playVideo();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] max-h-[800px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={homeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

      <div className="relative z-20 flex items-center justify-center h-full text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
            Welcome to Mibo
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-lg max-w-2xl mx-auto">
            Your Mental Health Companion - Professional care for your wellbeing
          </p>
          <button
            onClick={() => handleNavigate("/experts")}
            className="bg-[#34b9a5] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2a857f] transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      console.log(`Device detected as: ${mobile ? 'Mobile' : 'Desktop'}`);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <Header />
      <div className="w-full pt-16"> {/* Add padding to account for fixed header */}
        {isMobile ? (
          <>
            <div className="pt-4">
              <PremiumSlider />
            </div>
            <div className="flex justify-center mt-8">
              <MentalHealthCard />
            </div>
          </>
        ) : (
          <>
            <HeroSection />
            {/* You can add additional desktop-only content below the hero section here */}
            {/* <div className="container mx-auto px-4 py-12">
              <div className="flex justify-center">
                <MentalHealthCard />
              </div>
             
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default App;