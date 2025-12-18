// src/components/ExpertsHeader.tsx
import { useState, useEffect, useRef } from "react";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import miboIcon from "../../../assets/logo1.png";

const ExpertsHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
 // const [_resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleServiceClick = (path: string) => {
    navigate(path);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  };

  const handleLocationClick = (path: string) => {
    navigate(path);
    setLocationsOpen(false);
    setMobileLocationsOpen(false);
  };

 

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (servicesRef.current && !servicesRef.current.contains(event.target as Node)) &&
        (locationsRef.current && !locationsRef.current.contains(event.target as Node)) &&
        (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
      ) {
        setServicesOpen(false);
        setLocationsOpen(false);
       
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownHover = (dropdown: string, isHovering: boolean) => {
    if (dropdown === 'services') {
      setServicesOpen(isHovering);
    } else if (dropdown === 'locations') {
      setLocationsOpen(isHovering);
    } 
  };

  

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 
        transition-all duration-500 ease-out
        ${isScrolled 
          ? "bg-white shadow-2xl border-b border-gray-100 backdrop-blur-lg bg-white/95" 
          : "bg-white shadow-lg"
        }
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <div
          className={`flex items-center flex-shrink-0 transition-all duration-1000 ease-out cursor-pointer group ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
          onClick={() => navigate("/")}
        >
          <img
            src={miboIcon}
            alt="Mibo Icon"
            className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          />
        </div>

        {/* Mobile Header Actions */}
        <div
          className={`flex items-center gap-2 lg:hidden ml-auto transition-all duration-600 delay-500 ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/9083335000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
              <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </a>

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
          className={`hidden lg:flex flex-grow justify-center gap-8 text-sm font-medium transition-all duration-800 delay-400 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {/* About Us */}
          <span
            onClick={() => handleNavigate("/about-us")}
            className="relative group cursor-pointer transition-all duration-300"
          >
            <span className="text-gray-800 group-hover:text-[#34b9a5] font-semibold transition-all duration-300 group-hover:scale-105">
              ABOUT US
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#34b9a5] to-emerald-500 group-hover:w-full transition-all duration-300"></span>
          </span>

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
              <div className="absolute top-full left-0  w-52 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 animate-dropdown-slide z-50">
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

          {/* Experts */}
          <span
            onClick={() => handleNavigate("/experts")}
            className="relative group cursor-pointer transition-all duration-300"
          >
            <span className="text-gray-800 group-hover:text-[#34b9a5] font-semibold transition-all duration-300 group-hover:scale-105">
              EXPERTS
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#34b9a5] to-emerald-500 group-hover:w-full transition-all duration-300"></span>
          </span>

          {/* Locations Dropdown */}
          <div
            ref={locationsRef}
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

          {/* Blog */}
          <span
            onClick={() => handleNavigate("/blog")}
            className="relative group cursor-pointer transition-all duration-300"
          >
            <span className="text-gray-800 group-hover:text-[#34b9a5] font-semibold transition-all duration-300 group-hover:scale-105">
              BLOG
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#34b9a5] to-emerald-500 group-hover:w-full transition-all duration-300"></span>
          </span>

        
        </nav>

        {/* Desktop Action Buttons */}
        <div
          className={`hidden lg:flex items-center gap-4 flex-shrink-0 transition-all duration-800 delay-600 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
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
            className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
              <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </a>

          <div className="flex gap-3">
            {/* Book Appointment Button */}
            <Link to="/book-appointment">
              <button className="bg-gradient-to-r from-[#34b9a5] to-emerald-400 text-white px-8 py-3 rounded-full hover:from-[#2fa18f] hover:to-emerald-600 font-semibold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5">
                BOOK APPOINTMENT
              </button>
            </Link>

            <button
              onClick={() => handleNavigate("/signup")}
              className="bg-gradient-to-r from-[#1c0d54] to-[#2a1470] text-white px-6 py-3 rounded-full hover:from-[#2a1470] hover:to-[#3a1c90] font-semibold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5"
            >
              SIGN UP
            </button>

            <button
              onClick={() => handleNavigate("/signin")}
              className="bg-gradient-to-r from-white to-gray-50 text-[#1c0d54] border-2 border-[#1c0d54] px-6 py-3 rounded-full hover:bg-gradient-to-r hover:from-[#1c0d54] hover:to-[#2a1470] hover:text-white font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
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
            <Link
              to="/book-appointment"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              <button className="w-full py-3 px-4 bg-gradient-to-r from-[#34b9a5] to-emerald-500 text-white rounded-xl text-center cursor-pointer hover:from-[#2a857f] hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95">
                BOOK APPOINTMENT
              </button>
            </Link>

            {/* Mobile About Us */}
            <span onClick={() => handleNavigate("/about-us")} className="cursor-pointer py-3 px-4 border-b border-gray-200 hover:bg-gradient-to-r from-[#34b9a5]/5 to-emerald-500/5 hover:text-[#34b9a5] rounded-lg transition-all duration-300 hover:pl-6">
              ABOUT US
            </span>

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
                      onClick={() => handleServiceClick(`/services/${service.toLowerCase().replace(" ", "-").replace("-therapy","").replace("-sessions","").replace(" ", "-").replace("-care","")}`)}
                    >
                    
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Experts */}
            <span onClick={() => handleNavigate("/experts")} className="cursor-pointer py-3 px-4 border-b border-gray-200 hover:bg-gradient-to-r from-[#34b9a5]/5 to-emerald-500/5 hover:text-[#34b9a5] rounded-lg transition-all duration-300 hover:pl-6">
              EXPERTS
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

            {/* Mobile Blog */}
            <span onClick={() => handleNavigate("/blog")} className="cursor-pointer py-3 px-4 border-b border-gray-200 hover:bg-gradient-to-r from-[#34b9a5]/5 to-emerald-500/5 hover:text-[#34b9a5] rounded-lg transition-all duration-300 hover:pl-6">
              BLOG
            </span>

          
            

            {/* Mobile Sign Up/Sign In Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleNavigate("/signup")}
                className="bg-gradient-to-r from-[#1c0d54] to-[#2a1470] text-white px-4 py-3 rounded-lg font-semibold text-sm hover:from-[#2a1470] hover:to-[#3a1c90] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                SIGN UP
              </button>
              <button
                onClick={() => handleNavigate("/signin")}
                className="bg-gradient-to-r from-white to-gray-50 text-[#1c0d54] border-2 border-[#1c0d54] px-4 py-3 rounded-lg font-semibold text-sm hover:bg-gradient-to-r hover:from-[#1c0d54] hover:to-[#2a1470] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                SIGN IN
              </button>
            </div>

            {/* Mobile Contact Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <a
                href="tel:9083335000"
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-[#34b9a5] text-gray-700 hover:text-[#34b9a5] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone size={24} />
              </a>
              <a
                href="https://wa.me/9083335000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6">
                  <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ExpertsHeader;


/* // src/components/ExpertsHeader.tsx
import { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import miboIcon from "../../../assets/logo1.png";

const ExpertsHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: "ABOUT US", path: "/about" },
    {
      label: "SERVICES",
      dropdown: [
        { label: "In-Patient", path: "/services/in-patient" },
        { label: "In-Person", path: "/services/in-person" },
        { label: "Online", path: "/services/online" },
      ],
    },
    { label: "EXPERTS", path: "/experts" },
    {
      label: "LOCATIONS",
      dropdown: [
        { label: "Bengaluru", path: "/centres/bengaluru" },
        { label: "Kochi", path: "/centres/kochi" },
        { label: "Mumbai", path: "/centres/mumbai" },
      ],
    },
    { label: "BLOG", path: "/blog" },
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 
      bg-white shadow-sm border-b border-gray-100 
      transition-all duration-1000 ease-out
      ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 flex-wrap gap-y-2">
        
        <div
          className={`flex items-center flex-shrink-0 transition-all duration-800 delay-300 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
        >
          <Link to="/">
            <img
              src={miboIcon}
              alt="Mibo Icon"
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </Link>
        </div>

        <div
          className={`flex items-center gap-2 lg:hidden ml-auto transition-all duration-600 delay-500 ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300">
            <MessageCircle size={20} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#18356C] hover:text-[#34b9a5] text-3xl transition-colors duration-300"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

       
        <nav
          className={`hidden lg:flex flex-grow justify-center gap-6 text-sm font-medium transition-all duration-800 delay-400 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.path ? (
                <Link
                  to={item.path}
                  className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300">
                  {item.label} ▾
                </span>
              )}

              {item.dropdown && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                  {item.dropdown.map((drop) => (
                    <Link
                      key={drop.label}
                      to={drop.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {drop.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

       
        <div
          className={`hidden lg:flex items-center gap-3 flex-shrink-0 transition-all duration-800 delay-600 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 hover:border-[#34b9a5] text-white hover:text-[#34b9a5] bg-black/20 backdrop-blur-sm">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600">
            <MessageCircle size={18} />
          </button>

          <Link to="/book-appointment">
            <button className="bg-[#34b9a5] text-white px-6 py-2 rounded-full hover:bg-[#2fa18f] font-semibold text-sm">
              BOOK APPOINTMENT
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold text-sm">
              SIGN UP
            </button>
          </Link>
          <Link to="/signin">
            <button className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold text-sm">
              SIGN IN
            </button>
          </Link>
        </div>
      </div>

     
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] border-t border-white/20">
          <nav className="flex flex-col gap-4 text-[#18276c] font-medium">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className="hover:text-[#34b9a5] cursor-pointer transition-colors duration-300 py-2 border-b border-white/10 hover:border-[#34b9a5]/30 block"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="hover:text-[#34b9a5] cursor-pointer transition-colors duration-300 py-2 border-b border-white/10 hover:border-[#34b9a5]/30 block">
                    {item.label}
                  </span>
                )}

                {item.dropdown &&
                  item.dropdown.map((drop) => (
                    <Link
                      key={drop.label}
                      to={drop.path}
                      className="block pl-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {drop.label}
                    </Link>
                  ))}
              </div>
            ))}

          
            <Link
              to="/book-appointment"
              onClick={() => setMenuOpen(false)}
              className="bg-[#34b9a5] text-white px-6 py-3 mt-2 rounded-full text-center font-semibold hover:bg-[#2fa18f]"
            >
              Book Appointment
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ExpertsHeader;
 */