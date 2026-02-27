import { Home, User } from "lucide-react";
import { useState } from "react";
import {
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaFileAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTasks,
  FaUsers
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export default function MentorDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTabFromPath = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'Mentor' || path === 'home' || path === '') return 'dashboard';
    return path || 'dashboard';
  };

  const activeTab = getActiveTabFromPath();



  // Sidebar menu items with paths
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt, color: "teal", path: "/dashboard/Mentor" },
    { id: "interns", label: "Interns", icon: FaUsers, color: "cyan", path: "/dashboard/Mentor/interns" },
    { id: "task", label: "Tasks", icon: FaTasks, color: "emerald",path: "/dashboard/Mentor/task" },
    { id: "execution-team", label: "Execution Team", icon: FaPeopleGroup, color: "sky", path: "/dashboard/Mentor/execution-team" },
    { id: "lor-requests", label: "LOR Requests", icon: FaFileAlt, color: "purple", path: "/dashboard/Mentor/lor-requests" },
    { id: "analytics", label: "Analytics", icon: FaChartBar, color: "indigo", path: "/dashboard/Mentor/analytics" },
    { id: "setting", label: "Settings", icon: FaCog, color: "cyan", path: "/dashboard/Mentor/setting" },
    { id: "profile", label: "profile", icon: User, color: "green", path: "/dashboard/Mentor/profile" },
    { id: "home", label: "home", icon: Home, color: "gray", path: "/" },

  ];

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? "w-20" : "w-64"} bg-gradient-to-b from-teal-600 to-cyan-700 text-white transition-all duration-300 shadow-xl relative`}>
        {/* Logo */}
        <div className="p-4 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xl">
                          {user?.username?.charAt(0)?.toUpperCase() || 'J'}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">{user?.username}</h1>
                <p className="text-xs text-teal-200">{user.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-teal-600 rounded-full p-1.5 shadow-lg border border-teal-200 hover:bg-teal-50 bg-white"
          >
            {isSidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} p-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-white text-teal-600 shadow-md"
                      : "text-white hover:bg-teal-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && item.badge > 0 && (
                    <span className={`bg-${item.color}-500 text-white text-xs px-2 py-1 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} p-3 rounded-xl text-white hover:bg-red-500/30 transition-colors`}
          >
            <FaSignOutAlt className="w-5 h-5" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        {/* <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.username || 'John Mentor'}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'J'}
                </div>
              </div>
            </div>
          </div>
        </header> */}

        {/* Dynamic Content - This is where nested routes will render */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
