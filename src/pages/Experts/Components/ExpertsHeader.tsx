// src/components/ExpertsHeader.tsx
import { useState, useEffect } from "react";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import miboIcon from "../../../assets/logo1.png?w=200&format=webp&quality=85";

const ExpertsHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
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
      transition-all duration-500 ease-out
      ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[1480px] mx-auto h-16 md:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          className={`flex items-center flex-shrink-0 transition-all duration-400 delay-100 ease-out ${
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

        {/* Mobile Menu — kept to a single row (WhatsApp + hamburger only) so header height stays fixed and never wraps */}
        <div
          className={`flex items-center gap-2 lg:hidden ml-auto flex-shrink-0 transition-all duration-300 delay-150 ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <button
            onClick={() =>
              (window.location.href = "https://wa.me/919083335000")
            }
            aria-label="Chat on WhatsApp"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="w-10 h-10 flex items-center justify-center text-[#18356C] hover:text-[#34b9a5] transition-colors duration-300"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav
          className={`hidden lg:flex flex-grow justify-center gap-6 text-sm font-medium transition-all duration-400 delay-150 ease-out ${
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
                <div className="absolute top-full left-0 pt-2 -mt-2 w-40 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
                  <div className="bg-white shadow-lg rounded-md">
                    {item.dropdown.map((drop) => (
                      <Link
                        key={drop.label}
                        to={drop.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div
          className={`hidden lg:flex items-center gap-3 flex-shrink-0 transition-all duration-400 delay-200 ease-out ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          <button
            onClick={() => (window.location.href = "tel:9083335000")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 hover:border-[#34b9a5] text-white hover:text-[#34b9a5] bg-black/20 backdrop-blur-sm"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={() =>
              (window.location.href = "https://wa.me/919083335000")
            }
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            <MessageCircle size={18} />
          </button>

          {/* New Book Appointment Button */}
          <Link to="/experts">
            <button className="bg-[#34b9a5] text-white px-6 py-2 rounded-full hover:bg-[#2fa18f] font-semibold text-sm">
              BOOK APPOINTMENT
            </button>
          </Link>

          <Link to="/patientAuth">
            <button className="bg-[#1c0d54] text-white px-6 py-2 rounded-full hover:bg-[#2a1470] font-semibold text-sm">
              SIGN IN
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] border-t border-white/20 max-h-[calc(100vh-72px)] overflow-y-auto">
          {/* Quick actions row (moved here from the top bar to keep the header a fixed single-row height) */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => (window.location.href = "tel:9083335000")}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full border border-white/40 bg-white/40 text-[#18276c] font-semibold text-sm hover:border-[#34b9a5] hover:text-[#34b9a5] transition-all duration-300"
            >
              <Phone size={16} />
              Call
            </button>
            <Link to="/patientAuth" className="flex-1" onClick={() => setMenuOpen(false)}>
              <button className="w-full h-11 bg-[#1c0d54] text-white rounded-full text-sm font-semibold hover:bg-[#2a1470] transition-all duration-300">
                SIGN IN
              </button>
            </Link>
          </div>
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

            {/* Mobile Book Appointment Button */}
            <Link
              to="/experts"
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