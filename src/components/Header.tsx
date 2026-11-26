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
  ChevronDown,
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
    // /psychiatrist?location=<City> (opened from a city landing page)
    if (path === "/psychiatrist") {
      const requested = new URLSearchParams(routerLocation.search)
        .get("location")
        ?.trim()
        .toLowerCase();
      if (requested === "kochi") return "Kochi";
      if (requested === "bangalore" || requested === "bengaluru")
        return "Bangalore";
    }
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

  // ---- Menu data (same destinations / handlers as before) -----------------
  const locationItems = [
    { label: "Bengaluru", path: "/bengaluru" },
    { label: "Kochi", path: "/kochi" },
    { label: "Mumbai", path: "/centres/mumbai" },
  ];

  const serviceItems = [
    { label: "Psychiatrist", path: "/psychiatrist", Icon: Stethoscope },
    { label: "In-patient Care", path: "/services/in-patient", Icon: BedDouble },
    {
      label: "Clinical Psychologist",
      path: "/experts?specialization=Clinical%20Psychologist",
      Icon: Brain,
    },
    {
      label: "Counselling Psychologist",
      path: "/experts?specialization=Counsellor",
      Icon: MessageCircleHeart,
    },
    {
      label: "Assessment",
      path: "/experts?specialization=Clinical%20Psychologist",
      Icon: ClipboardCheck,
    },
  ];

  const expertItems = [
    {
      label: "Clinical Psychologists",
      specialization: "Clinical Psychologist",
      description:
        "Find safe, compassionate care for your mental health journey.",
      Icon: Brain,
    },
    {
      label: "Psychiatrists",
      specialization: "Psychiatrist",
      description: "Expert medical care for advanced mental health conditions.",
      Icon: Pill,
    },
  ];

  const simpleLinks = {
    about: { label: "About Us", path: "/about", Icon: Info },
    who: { label: "Who It's For", path: "/who-its-for", Icon: Users },
    why: { label: "Why MIBO", path: "/why-mibo", Icon: Sparkles },
    blog: { label: "Blog", path: "/blog", Icon: BookOpen },
    contact: { label: "Contact Us", path: "/contact", Icon: Phone },
  };

  // ---- Shared style tokens ---------------------------------------------------
  // Icons are hidden between lg and xl so nine links never crowd the buttons.
  const navItemCls =
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-1.5 xl:px-2 py-2 text-[13px] xl:text-[14px] font-semibold leading-none text-gray-800 hover:text-[#0b7f66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7f66]/40 transition-colors duration-200 cursor-pointer";
  const navIconCls = "hidden xl:block text-[#0b7f66] flex-shrink-0";
  const dropdownPanelCls =
    "bg-white rounded-xl shadow-lg ring-1 ring-black/5 text-gray-800 flex flex-col py-2";
  const dropdownItemCls =
    "w-full px-4 py-2.5 flex items-center gap-2.5 text-left text-sm font-medium hover:bg-emerald-50 hover:text-[#0b7f66] cursor-pointer transition-colors duration-150";
  const iconBtnBase =
    "w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7f66]/40";
  const phoneBtnCls = `${iconBtnBase} border border-gray-300 bg-white text-gray-700 hover:border-[#0b7f66] hover:text-[#0b7f66]`;
  const whatsappBtnCls = `${iconBtnBase} bg-[#25b45a] text-white hover:bg-[#1f9d4e] shadow-sm`;
  const signInCls =
    "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1c0d54] px-5 text-sm font-semibold text-white whitespace-nowrap shadow-md hover:bg-[#2a1470] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c0d54]/40";
  const mobileRowCls =
    "w-full flex items-center gap-3 px-2 py-3 text-[15px] font-semibold text-gray-800 hover:text-[#0b7f66] text-left cursor-pointer";

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-100 shadow-[0_2px_12px_rgba(15,23,42,0.06)] font-['Quicksand',sans-serif] transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[1480px] mx-auto h-16 md:h-20 flex items-center gap-3 xl:gap-5 px-4 sm:px-6 lg:px-8">
        {/* ============ LEFT: Branding ============ */}
        <button
          type="button"
          aria-label="Mibo home"
          className="flex-shrink-0 flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={miboIcon}
            alt="Mibo"
            className="h-10 md:h-12 w-auto max-w-none object-contain drop-shadow-lg"
          />
        </button>

        <div
          className="hidden lg:block h-8 w-px bg-gray-200 flex-shrink-0"
          aria-hidden="true"
        />

        {/* ============ CENTRE: Navigation ============ */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex flex-1 min-w-0 items-center justify-evenly"
        >
          {[simpleLinks.about].map(({ label, path, Icon }) => (
            <button
              type="button"
              key={label}
              onClick={() => handleNavigate(path)}
              className={navItemCls}
            >
              <Icon size={16} className={navIconCls} />
              {label}
            </button>
          ))}

          {/* Locations */}
          <div
            className="relative"
            onMouseEnter={() => setLocationsOpen(true)}
            onMouseLeave={() => setLocationsOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={locationsOpen}
              onClick={() => setLocationsOpen((o) => !o)}
              className={navItemCls}
            >
              <MapPin size={16} className={navIconCls} />
              Locations
              <ChevronDown
                size={14}
                className={`flex-shrink-0 transition-transform duration-200 ${locationsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {locationsOpen && (
              <div className="absolute top-full left-0 pt-2 w-44 z-50">
                <div className={dropdownPanelCls}>
                  {locationItems.map(({ label, path }) => (
                    <button
                      type="button"
                      key={label}
                      className={dropdownItemCls}
                      onClick={() => {
                        setLocationsOpen(false);
                        handleLocationClick(path);
                      }}
                    >
                      <MapPin
                        size={16}
                        className="text-[#0b7f66] flex-shrink-0"
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((o) => !o)}
              className={navItemCls}
            >
              <HeartHandshake size={16} className={navIconCls} />
              Services
              <ChevronDown
                size={14}
                className={`flex-shrink-0 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 pt-2 w-64 z-50">
                <div className={dropdownPanelCls}>
                  {serviceItems.map(({ label, path, Icon }) => (
                    <button
                      type="button"
                      key={label}
                      className={dropdownItemCls}
                      onClick={() => {
                        setServicesOpen(false);
                        handleServiceClick(path);
                      }}
                    >
                      <Icon
                        size={16}
                        className="text-[#0b7f66] flex-shrink-0"
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Experts */}
          <div
            className="relative"
            onMouseEnter={() => setExpertsOpen(true)}
            onMouseLeave={() => setExpertsOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={expertsOpen}
              onClick={() => setExpertsOpen((o) => !o)}
              className={navItemCls}
            >
              <UserCheck size={16} className={navIconCls} />
              Experts
              <ChevronDown
                size={14}
                className={`flex-shrink-0 transition-transform duration-200 ${expertsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {expertsOpen && (
              <div className="absolute top-full right-0 xl:left-0 xl:right-auto pt-2 w-80 z-50">
                <div className={`${dropdownPanelCls} py-3`}>
                  {expertItems.map(
                    ({ label, specialization, description, Icon }, idx) => (
                      <div key={label}>
                        {idx > 0 && (
                          <div className="border-t border-gray-100 my-1" />
                        )}
                        <button
                          type="button"
                          className="group w-full px-4 py-3 text-left hover:bg-emerald-50 cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            setExpertsOpen(false);
                            handleExpertClick(specialization);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 mt-0.5 text-[#0b7f66] flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-bold text-gray-800 group-hover:text-[#0b7f66] transition-colors">
                                {label}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {description}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Who It's For / Why MIBO / Blog / Contact */}
          {[
            simpleLinks.who,
            simpleLinks.why,
            simpleLinks.blog,
            simpleLinks.contact,
          ].map(({ label, path, Icon }) => (
            <button
              type="button"
              key={label}
              onClick={() => handleNavigate(path)}
              className={navItemCls}
            >
              <Icon size={16} className={navIconCls} />
              {label}
            </button>
          ))}
          {/* Book Appointment (primary pill) */}
          <button
            type="button"
            onClick={() => handleNavigate("/experts")}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0b7f66] px-3.5 xl:px-4 h-10 text-[13px] xl:text-[14px] font-semibold text-white shadow-sm hover:bg-[#096b57] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7f66]/40 cursor-pointer"
          >
            <CalendarCheck
              size={16}
              className="hidden xl:block flex-shrink-0"
            />
            Book Appointment
          </button>
        </nav>

        <div
          className="hidden lg:block h-8 w-px bg-gray-200 flex-shrink-0"
          aria-hidden="true"
        />

        {/* ============ RIGHT: Actions (desktop) ============ */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          <button
            type="button"
            aria-label="Call Mibo"
            onClick={() => (window.location.href = contactTelLink)}
            className={phoneBtnCls}
          >
            <Phone size={18} />
          </button>
          <button
            type="button"
            aria-label="Chat on WhatsApp"
            onClick={() => (window.location.href = contactWhatsappUrl)}
            className={whatsappBtnCls}
          >
            <MessageCircle size={18} />
          </button>
          {isAuthenticated ? (
            <button
              type="button"
              aria-label="My profile"
              onClick={() => handleNavigate("/profileDashboard")}
              className={`${iconBtnBase} bg-[#1c0d54] text-white shadow-md hover:bg-[#2a1470]`}
            >
              <User size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate("/patientAuth")}
              className={signInCls}
            >
              <User size={16} className="hidden xl:block flex-shrink-0" />
              Sign In
            </button>
          )}
        </div>

        {/* ============ Mobile / tablet actions ============ */}
        <div className="flex items-center gap-2 lg:hidden ml-auto">
          <button
            type="button"
            aria-label="Call Mibo"
            onClick={() => (window.location.href = contactTelLink)}
            className={`${phoneBtnCls} !w-9 !h-9`}
          >
            <Phone size={18} />
          </button>
          <button
            type="button"
            aria-label="Chat on WhatsApp"
            onClick={() => (window.location.href = contactWhatsappUrl)}
            className={`${whatsappBtnCls} !w-9 !h-9`}
          >
            <MessageCircle size={18} />
          </button>
          {isAuthenticated ? (
            <button
              type="button"
              aria-label="My profile"
              onClick={() => handleNavigate("/profileDashboard")}
              className={`${iconBtnBase} !w-9 !h-9 bg-[#1c0d54] text-white hover:bg-[#2a1470]`}
            >
              <User size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate("/patientAuth")}
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#1c0d54] px-3.5 text-xs sm:text-sm font-semibold text-white whitespace-nowrap hover:bg-[#2a1470] transition-colors duration-200"
            >
              Sign In
            </button>
          )}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-md text-[#18356C] hover:text-[#0b7f66] transition-colors duration-200"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ============ Mobile / tablet dropdown ============ */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav aria-label="Mobile" className="flex flex-col px-4 py-4 sm:px-6">
            {[simpleLinks.about].map(({ label, path, Icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => handleNavigate(path)}
                className={`${mobileRowCls} border-b border-gray-100`}
              >
                <Icon size={18} className="text-[#0b7f66] flex-shrink-0" />
                {label}
              </button>
            ))}

            {/* Locations */}
            <div className="border-b border-gray-100">
              <button
                type="button"
                aria-expanded={mobileLocationsOpen}
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                className={mobileRowCls}
              >
                <MapPin size={18} className="text-[#0b7f66] flex-shrink-0" />
                <span className="flex-1">Locations</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 ${mobileLocationsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileLocationsOpen && (
                <div className="flex flex-col pb-2 pl-9">
                  {locationItems.map(({ label, path }) => (
                    <button
                      type="button"
                      key={label}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-[#0b7f66] text-left cursor-pointer"
                      onClick={() => handleLocationClick(path)}
                    >
                      <MapPin
                        size={16}
                        className="text-[#0b7f66] flex-shrink-0"
                      />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="border-b border-gray-100">
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={mobileRowCls}
              >
                <HeartHandshake
                  size={18}
                  className="text-[#0b7f66] flex-shrink-0"
                />
                <span className="flex-1">Services</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="flex flex-col pb-2 pl-9">
                  {serviceItems.map(({ label, path, Icon }) => (
                    <button
                      type="button"
                      key={label}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-[#0b7f66] text-left cursor-pointer"
                      onClick={() => handleServiceClick(path)}
                    >
                      <Icon
                        size={16}
                        className="text-[#0b7f66] flex-shrink-0"
                      />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experts */}
            <div className="border-b border-gray-100">
              <button
                type="button"
                aria-expanded={mobileExpertsOpen}
                onClick={() => setMobileExpertsOpen(!mobileExpertsOpen)}
                className={mobileRowCls}
              >
                <UserCheck size={18} className="text-[#0b7f66] flex-shrink-0" />
                <span className="flex-1">Experts</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 ${mobileExpertsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileExpertsOpen && (
                <div className="flex flex-col gap-2 pb-3 pl-9">
                  {expertItems.map(
                    ({ label, specialization, description, Icon }) => (
                      <button
                        type="button"
                        key={label}
                        className="w-full text-left py-2.5 px-3 bg-emerald-50/70 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                        onClick={() => handleExpertClick(specialization)}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className="w-4 h-4 text-[#0b7f66] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-sm text-gray-800">
                              {label}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {[
              simpleLinks.who,
              simpleLinks.why,
              simpleLinks.blog,
              simpleLinks.contact,
            ].map(({ label, path, Icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => handleNavigate(path)}
                className={`${mobileRowCls} border-b border-gray-100`}
              >
                <Icon size={18} className="text-[#0b7f66] flex-shrink-0" />
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNavigate("/experts")}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0b7f66] h-11 text-[15px] font-semibold text-white hover:bg-[#096b57] transition-colors duration-200 cursor-pointer"
            >
              <CalendarCheck size={18} className="flex-shrink-0" />
              Book Appointment
            </button>
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