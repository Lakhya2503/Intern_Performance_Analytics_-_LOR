import { Home, User } from "lucide-react";
import { useState, useEffect } from "react";
import {
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaFileAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTasks,
  FaUsers,
  FaBell,
  FaSearch,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function MentorDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth(); // Removed checkTokenExpiration
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTabFromPath = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'Mentor' || path === 'home' || path === '') return 'dashboard';
    return path || 'dashboard';
  };

  const activeTab = getActiveTabFromPath();

  // Sidebar menu items with enhanced styling properties
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaTachometerAlt,
      gradient: "from-teal-400 to-cyan-400",
      bgLight: "bg-teal-50",
      textLight: "text-teal-600",
      borderLight: "border-teal-200",
      path: "/dashboard/Mentor"
    },
    {
      id: "interns",
      label: "Interns",
      icon: FaUsers,
      gradient: "from-cyan-400 to-sky-400",
      bgLight: "bg-cyan-50",
      textLight: "text-cyan-600",
      borderLight: "border-cyan-200",
      path: "/dashboard/Mentor/interns"
    },
    {
      id: "task",
      label: "Tasks",
      icon: FaTasks,
      gradient: "from-emerald-400 to-green-400",
      bgLight: "bg-emerald-50",
      textLight: "text-emerald-600",
      borderLight: "border-emerald-200",
      path: "/dashboard/Mentor/task"
    },
    {
      id: "execution-team",
      label: "Execution Team",
      icon: FaPeopleGroup,
      gradient: "from-sky-400 to-blue-400",
      bgLight: "bg-sky-50",
      textLight: "text-sky-600",
      borderLight: "border-sky-200",
      path: "/dashboard/Mentor/execution-team"
    },
    {
      id: "lor-requests",
      label: "LOR Requests",
      icon: FaFileAlt,
      gradient: "from-purple-400 to-violet-400",
      bgLight: "bg-purple-50",
      textLight: "text-purple-600",
      borderLight: "border-purple-200",
      path: "/dashboard/Mentor/lor-requests"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: FaChartBar,
      gradient: "from-indigo-400 to-purple-400",
      bgLight: "bg-indigo-50",
      textLight: "text-indigo-600",
      borderLight: "border-indigo-200",
      path: "/dashboard/Mentor/analytics"
    },
    {
      id: "setting",
      label: "Settings",
      icon: FaCog,
      gradient: "from-amber-400 to-orange-400",
      bgLight: "bg-amber-50",
      textLight: "text-amber-600",
      borderLight: "border-amber-200",
      path: "/dashboard/Mentor/setting"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      gradient: "from-green-400 to-emerald-400",
      bgLight: "bg-green-50",
      textLight: "text-green-600",
      borderLight: "border-green-200",
      path: "/dashboard/Mentor/profile"
    },
    {
      id: "home",
      label: "Home",
      icon: Home,
      gradient: "from-gray-400 to-slate-400",
      bgLight: "bg-gray-50",
      textLight: "text-gray-600",
      borderLight: "border-gray-200",
      path: "/"
    },
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-30" : "w-64"
        } bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white transition-all duration-300 shadow-2xl relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>

        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-teal-50 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-teal-600 font-bold text-xl">
                {user?.username?.charAt(0)?.toUpperCase() || 'J'}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <div className="animate-fadeIn">
                <h1 className="font-bold text-lg">{user?.username || 'Mentor'}</h1>
                <p className="text-xs text-teal-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {user?.role || 'Mentor'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-teal-600 rounded-full p-2 shadow-lg border-2 border-white/30 hover:border-white bg-white/90 hover:bg-white transition-all duration-300 transform hover:scale-110"
          >
            {isSidebarCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 relative z-10">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? "justify-center" : "justify-between"
                    } p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-white text-teal-600 shadow-lg scale-105"
                        : "text-white/90 hover:bg-white/10 hover:scale-105"
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-cyan-400"></div>
                    )}

                    {/* Hover effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive ? 'bg-gradient-to-r from-teal-400/0 to-teal-400/5' : 'bg-white/5'
                    }`}></div>

                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && (
                      <span className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isActive ? 'bg-teal-600' : 'bg-white/50'
                      }`}></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? "justify-center" : "gap-3"
            } p-3 rounded-xl text-white/90 hover:text-white hover:bg-red-500/20 transition-all duration-300 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/0 transition-all duration-300"></div>
            <FaSignOutAlt className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Dynamic Content */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
