// src/components/ExpertsHeader.tsx
import { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import miboIcon from "../../../assets/logo1.png";

const ExpertsHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        {/* Logo */}
        <div
          className={`flex items-center flex-shrink-0 transition-all duration-800 delay-300 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
        >
          <img
            src={miboIcon}
            alt="Mibo Icon"
            className="w-12 h-12 md:w-14 md:h-14"
          />
        </div>

        {/* Mobile Menu */}
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

        {/* Desktop Navigation */}
        <nav
          className={`hidden lg:flex flex-grow justify-center gap-6 text-sm font-medium transition-all duration-800 delay-400 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {["ABOUT US", "SERVICES", "EXPERTS", "LOCATIONS", "BLOG"].map(
            (item, index) => (
              <span
                key={item}
                className="hover:text-[#34b9a5] cursor-pointer transition-all duration-300"
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                {item}
              </span>
            )
          )}
        </nav>

        {/* Desktop Actions */}
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
          <button className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold text-sm">
            SIGN UP
          </button>
          <button className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold text-sm">
            SIGN IN
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] border-t border-white/20">
          <nav className="flex flex-col gap-4 text-[#18276c] font-medium">
            {["ABOUT US", "SERVICES", "EXPERTS", "LOCATIONS", "BLOG"].map(
              (item) => (
                <span
                  key={item}
                  className="hover:text-[#34b9a5] cursor-pointer transition-colors duration-300 py-2 border-b border-white/10 hover:border-[#34b9a5]/30"
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

export default ExpertsHeader;
