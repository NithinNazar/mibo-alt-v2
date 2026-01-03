import { useState, useEffect, useRef } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";
// import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import miboIcon from "../../assets/logo1.png";

const ProfileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  //  Get authenticated user from localStorage
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    // Load user data from localStorage on component mount
    const loadUserData = () => {
      const userStr = localStorage.getItem("mibo_user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser({
            name: userData.full_name || "User",
            email: userData.email || "No email provided",
            phone: userData.phone || "",
          });
        } catch (error) {
          console.error("Failed to parse user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUserData();

    // Optional: Listen for storage changes (if user logs in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mibo_user") {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("mibo_access_token");
    localStorage.removeItem("mibo_refresh_token");
    localStorage.removeItem("mibo_user");
    localStorage.removeItem("latestBooking");

    setUser(null);
    setProfileMenuOpen(false);
    navigate("/"); //  Redirect to home
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[1480px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={miboIcon}
            alt="Mibo Icon"
            className="w-12 h-12 md:w-14 md:h-14"
          />
        </Link>

        {/* Mobile Menu + Actions */}
        <div className="flex items-center gap-2 ml-auto lg:hidden">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-all">
            <MessageCircle size={20} />
          </button>

          {/* ✅ Show profile button only if user exists */}
          {user && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 bg-[#1c0d54] text-white px-4 py-2 rounded-full hover:bg-[#2a1470] text-sm font-semibold"
              >
                <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profileDashboard"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/appointments"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/profile-settings"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          {/* <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#18356C] hover:text-[#34b9a5] text-3xl transition-colors duration-300"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button> */}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 bg-[#1c0d54] text-white px-5 py-2.5 rounded-full hover:bg-[#2a1470] text-sm font-semibold transition-all"
              >
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>My Profile</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profileDashboard"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/appointments"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    All Appointments
                  </Link>
                  <Link
                    to="/profile-settings"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-6 bg-[#C2D3E4] border-t border-white/20">
          <nav className="flex flex-col gap-4 text-[#18276c] font-medium">
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

export default ProfileHeader;
