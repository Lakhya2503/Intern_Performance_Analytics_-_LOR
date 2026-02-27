import React from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import internsData from "../../../Data/Interns.json";
import { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import {
  FaTasks,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  FaUserGraduate,
  FaFileAlt,
  FaCalendarCheck,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaChartBar,
  FaUserCircle,
  FaCommentDots,
  FaStar,
} from "react-icons/fa";
import { MdPendingActions, MdAssignment, MdFeedback } from "react-icons/md";
import { Home, User } from "lucide-react";
import { FaPeopleGroup } from "react-icons/fa6";

const ExecutionDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const getActiveTabFromPath = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'Execution' || path === 'home' || path === '') return 'dashboard';
    return path || 'dashboard';
  };

  const activeTab = getActiveTabFromPath();

  const totalIntern = internsData.length;
  const pendingIntern = internsData.filter(
    (intern) => intern.status === "pending",
  ).length;
  const approveIntern = internsData.filter(
    (intern) => intern.status === "Approve",
  ).length;
  const rejectedIntern = internsData.filter(
    (intern) => intern.status === "Rejected",
  ).length;

  // Sidebar menu items with paths
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt, color: "teal", path: "/dashboard/ExecutionTeam" },
    { id: "interns", label: "Interns", icon: FaUsers, color: "cyan", badge: pendingIntern, path: "/dashboard/ExecutionTeam/interns" },
    { id: "tasks", label: "Tasks", icon: FaTasks, color: "emerald", badge: 8, path: "/dashboard/ExecutionTeam/task" },
    { id: "submissions", label: "Submissions", icon: MdAssignment, color: "purple", badge: 12, path: "/dashboard/Execution/submissions" },
    { id: "attendance", label: "Attendance", icon: FaCalendarCheck, color: "orange", path: "/dashboard/ExecutionTeam/attendance" },
    { id: "analytics", label: "Analytics", icon: FaChartBar, color: "green", path: "/dashboard/ExecutionTeam/analytics" },
    { id: "setting", label: "Settings", icon: FaCog, color: "cyan", path: "/dashboard/ExecutionTeam/setting" },
    { id: "profile", label: "Profile", icon: User, color: "green", path: "/dashboard/ExecutionTeam/profile" },
    { id: "home", label: "Home", icon: Home, color: "gray", path: "/" },
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
      <aside className={`${isSidebarCollapsed ? "w-20" : "w-64"} bg-gradient-to-b from-orange-600 to-amber-700 text-white transition-all duration-300 shadow-xl relative`}>
        {/* Logo */}
        <div className="p-4 border-b border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xl">
                {user?.username?.charAt(0)?.toUpperCase() || 'E'}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">{user?.username || 'Execution Team'}</h1>
                <p className="text-xs text-orange-200">{user?.role || 'Execution Member'}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-orange-600 rounded-full p-1.5 shadow-lg border border-orange-200 hover:bg-orange-50 bg-white"
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
                      ? "bg-white text-orange-600 shadow-md"
                      : "text-white hover:bg-orange-500/30"
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
        {/* Dynamic Content - This is where nested routes will render */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ExecutionDashboard;
