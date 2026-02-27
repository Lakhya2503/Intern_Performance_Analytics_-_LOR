import { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt, FaTachometerAlt, FaTimes, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Athenura } from "../../public/images";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/help", label: "Help" },
  ];

  const isActive = (path) => location.pathname === path;

  // Get username from email or user object
  const getUsername = () => {
    if (user?.name) return user.name;
    if (user?.email) {
      // Extract name from email (before @)
      const emailName = user.email.split('@')[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'User';
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg py-1"
          : "bg-transparent"
      }`}
    >
      {/* Logo Section - Left */}
      <Link to="/" className="flex items-center group">
        <img
          src={Athenura}
          alt="Athenura Logo"
          className="h-12 md:h-14 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Navigation Links - Centered with increased gap */}
      <div className="hidden md:flex items-center justify-center flex-1">
        <div className="flex items-center gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-[15px] font-medium transition-all duration-300 group ${
                isActive(link.path)
                  ? "text-teal-600"
                  : "text-gray-700 hover:text-teal-600"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                  isActive(link.path) ? "scale-x-100" : ""
                }`}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* User Menu / Login Button - Right End */}
      <div className="hidden md:block">
        {user ? (
          <div className="relative user-dropdown">
            {/* User Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getUsername().charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700">
                  {getUsername()}
                </div>
                {user?.role && (
                  <div className="text-xs text-teal-600 capitalize">
                    {user.role}
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 animate-fadeIn">
                {/* Dashboard Link */}
                <Link
                  to={`/dashboard/${user.role}`}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaTachometerAlt className="text-teal-500" size={16} />
                  <span>Dashboard</span>
                </Link>

                {/* Profile Link */}
                <Link
                  to={`/dashboard/${user.role}/profile`}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUser className="text-teal-500" size={16} />
                  <span>Profile</span>
                </Link>

                {/* Divider */}
                <div className="my-2 border-t border-gray-100"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                >
                  <FaSignOutAlt className="text-red-500" size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              isActive("/login")
                ? "bg-teal-600 text-white"
                : "bg-white/90 text-teal-600 hover:bg-white hover:shadow-md border border-teal-200"
            }`}
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-gray-700 hover:text-teal-600 transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {open ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-x-0 top-[72px] bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {/* User Info Section - Only shown when logged in */}
          {user && (
            <div className="mb-4 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {getUsername().charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {getUsername()}
                  </div>
                  {user?.email && (
                    <div className="text-sm text-gray-600">
                      {user.email}
                    </div>
                  )}
                  {user?.role && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded-full capitalize">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2 text-lg font-medium transition-colors ${
                isActive(link.path)
                  ? "text-teal-600 border-l-4 border-teal-600 pl-3"
                  : "text-gray-700 hover:text-teal-600 hover:pl-3"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Dashboard Link - Only for logged in users */}
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center gap-3 py-2 text-lg font-medium text-gray-700 hover:text-teal-600 hover:pl-3 transition-colors"
              onClick={() => setOpen(false)}
            >
              <FaTachometerAlt className="text-teal-500" size={18} />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Profile Link - Only for logged in users */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 py-2 text-lg font-medium text-gray-700 hover:text-teal-600 hover:pl-3 transition-colors"
              onClick={() => setOpen(false)}
            >
              <FaUser className="text-teal-500" size={18} />
              <span>Profile</span>
            </Link>
          )}

          {/* Login/Logout Button */}
          <div className="pt-4 border-t border-gray-200">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg text-center font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300"
              >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className={`block py-2.5 px-4 rounded-lg text-center font-medium transition-all duration-300 ${
                  isActive("/login")
                    ? "bg-teal-600 text-white"
                    : "bg-teal-50 text-teal-600 hover:bg-teal-100"
                }`}
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
