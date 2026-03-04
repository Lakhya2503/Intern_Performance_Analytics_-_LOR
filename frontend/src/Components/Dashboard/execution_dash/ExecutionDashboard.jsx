import React from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import {
  FaTasks,
  FaUsers,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaChartBar,
  FaMoon,
  FaSun,
  FaSpinner,
  FaTrophy,
  FaUserGraduate,
  FaStar,
  FaFileAlt,
  FaRocket,
  FaEye,
  FaEdit,
  FaUserPlus,
  FaAngleRight,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaClock as FaClockRegular,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaUser,
  FaCode
} from "react-icons/fa";
import { Bell, Home, User } from "lucide-react";
import { MdOutlineRateReview } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsFillCalendarCheckFill, BsGraphUpArrow } from "react-icons/bs";
import {
  getAllInterns,
  scoreRankingInterns,
} from "../../../api/index";
import { requestHandler } from "../../../utils/index";
import ExecutionHomeDashboard from './ExecutionHomeDashboard';

const ExecutionDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard state
  const [loading, setLoading] = useState(false);
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Task review pending for Alice', time: '1 hour ago', read: false },
    { id: 2, message: 'Weekly report ready', time: '2 hours ago', read: true },
  ]);

  const [stats, setStats] = useState({
    totalInterns: 0,
    pendingInterns: 0,
    approvedInterns: 0,
    rejectedInterns: 0,
    averageScore: 0,
    activeProjects: 0,
    completionRate: 0
  });

  // Fetch dashboard data
  useEffect(() => {
    if (isHomeDashboard) {
      fetchDashboardData();
    }
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Fetch all interns
    await requestHandler(
      async () => getAllInterns(),
      setLoading,
      (response) => {
        const internsData = response?.data || [];
        setInterns(Array.isArray(internsData) ? internsData : []);

        const pending = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "pending").length : 0;
        const approved = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "Approve").length : 0;
        const rejected = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "Rejected").length : 0;
        const activeProjects = Array.isArray(internsData) ? new Set(internsData.map(i => i.project)).size : 0;

        setStats(prev => ({
          ...prev,
          totalInterns: Array.isArray(internsData) ? internsData.length : 0,
          pendingInterns: pending,
          approvedInterns: approved,
          rejectedInterns: rejected,
          activeProjects
        }));
      },
      (error) => {
        console.error('Error fetching interns:', error);
        setInterns([]);
      }
    );

    // Fetch rankings
    await requestHandler(
      async () => scoreRankingInterns(),
      setLoading,
      (response) => {
        const rankings = response?.data || { gold: [], silver: [], bronze: [] };
        setRankingData({
          gold: Array.isArray(rankings.gold) ? rankings.gold : [],
          silver: Array.isArray(rankings.silver) ? rankings.silver : [],
          bronze: Array.isArray(rankings.bronze) ? rankings.bronze : []
        });

        const allRankedInterns = [
          ...(Array.isArray(rankings.gold) ? rankings.gold : []),
          ...(Array.isArray(rankings.silver) ? rankings.silver : []),
          ...(Array.isArray(rankings.bronze) ? rankings.bronze : [])
        ];

        const scores = allRankedInterns.map(item => item?.score || 0);
        const avgScore = scores.length > 0
          ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length
          : 0;

        const completedTasks = allRankedInterns.filter(i => i.completionRate > 80).length;
        const completionRate = allRankedInterns.length > 0
          ? (completedTasks / allRankedInterns.length) * 100
          : 0;

        setStats(prev => ({
          ...prev,
          averageScore: avgScore.toFixed(1),
          completionRate: Math.round(completionRate)
        }));
      },
      (error) => {
        console.error('Error fetching rankings:', error);
        setRankingData({ gold: [], silver: [], bronze: [] });
      }
    );

    setLoading(false);
  };

  // Determine active sidebar tab based on current path
  const getActiveSidebarTab = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'ExecutionTeam' || path === 'home' || path === '' || location.pathname === '/dashboard/ExecutionTeam') {
      return 'dashboard';
    }
    return path || 'dashboard';
  };

  const activeSidebarTab = getActiveSidebarTab();

  // Check if we're on the home dashboard route
  const isHomeDashboard = location.pathname === '/dashboard/ExecutionTeam' ||
                          location.pathname === '/dashboard/ExecutionTeam/';

  // Navigation handlers
  const handleViewAllInterns = () => navigate('/dashboard/ExecutionTeam/interns');
  const handleViewAnalytics = () => navigate('/dashboard/ExecutionTeam/analytics');
  const handleViewTasks = () => navigate('/dashboard/ExecutionTeam/tasks');
  const handleViewSettings = () => navigate('/dashboard/ExecutionTeam/setting');
  const handleViewProfile = () => navigate('/dashboard/ExecutionTeam/profile');

  const handleAddIntern = () => {
    navigate('/dashboard/ExecutionTeam/interns', { state: { action: 'add' } });
  };

  const handleUpdateIntern = (intern) => {
    navigate('/dashboard/ExecutionTeam/interns', {
      state: {
        action: 'edit',
        internId: intern._id || intern.id
      }
    });
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Safe array length
  const safeArrayLength = (arr) => Array.isArray(arr) ? arr.length : 0;

  // Get all ranked interns
  const getAllRankedInterns = () => [
    ...(rankingData.gold || []),
    ...(rankingData.silver || []),
    ...(rankingData.bronze || [])
  ];

  // Get interns with actual data only
  const getInternsList = () => {
    if (!Array.isArray(interns) || interns.length === 0) return [];

    return interns.slice(0, 6).map((intern) => ({
      ...intern,
      id: intern?._id || intern?.id,
      name: intern?.name || 'Unknown',
      email: intern?.email || '',
      department: intern?.department || 'General',
      course: intern?.course || 'Not Assigned',
      status: intern?.status || 'pending',
      progress: Math.min(100, Math.max(0, intern?.progress || 0)),
      skills: Array.isArray(intern?.skills) ? intern.skills : [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(intern?.name || 'Intern')}&background=0D9488&color=fff&size=128`
    }));
  };

  const recentInterns = getInternsList();

  // Quick stats with icons and colors
  const quickStats = [
    {
      id: 'stat-total-interns',
      label: 'Total Interns',
      value: stats.totalInterns,
      icon: FaUserGraduate,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      change: stats.totalInterns > 0 ? '+Active' : '0',
      changeType: 'increase'
    },
    {
      id: 'stat-pending-tasks',
      label: 'Pending Reviews',
      value: stats.pendingInterns,
      icon: MdOutlineRateReview,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: stats.pendingInterns > 0 ? 'Needs attention' : 'All clear',
      changeType: stats.pendingInterns > 0 ? 'increase' : 'neutral'
    },
    {
      id: 'stat-avg-score',
      label: 'Avg. Score',
      value: stats.averageScore,
      icon: FaStar,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: stats.averageScore > 0 ? 'Performing' : 'No data',
      changeType: stats.averageScore > 0 ? 'increase' : 'neutral',
      suffix: ''
    },
    {
      id: 'stat-active-projects',
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: FaRocket,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      change: stats.activeProjects > 0 ? 'In progress' : 'No projects',
      changeType: stats.activeProjects > 0 ? 'increase' : 'neutral'
    },
  ];

  // Upcoming tasks from actual data
  const getUpcomingTasks = () => {
    const tasks = [];
    if (Array.isArray(interns) && interns.length > 0) {
      interns.slice(0, 4).forEach((intern, index) => {
        if (intern?.pendingTasks?.length > 0) {
          tasks.push({
            id: `task-${intern._id}-${index}`,
            title: intern.pendingTasks[0]?.title || 'Review Required',
            intern: intern.name || 'Intern',
            internAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name || 'Intern')}&background=0D9488&color=fff`,
            deadline: intern.pendingTasks[0]?.deadline || 'Pending',
            priority: intern.pendingTasks[0]?.priority || 'Medium',
            type: intern.pendingTasks[0]?.type || 'Task',
            project: intern.project || 'General'
          });
        }
      });
    }
    return tasks.length > 0 ? tasks : [];
  };

  const upcomingTasks = getUpcomingTasks();

  // Top performers from actual ranking data
  const topPerformers = getAllRankedInterns().slice(0, 3).map((intern) => ({
    ...intern,
    id: intern?._id || intern?.id,
    name: intern?.name || 'Intern',
    department: intern?.department || 'General',
    score: Math.round(intern?.score || 0),
    projectsCompleted: intern?.projectsCompleted || 0
  }));

  const rankingCounts = {
    gold: safeArrayLength(rankingData.gold),
    silver: safeArrayLength(rankingData.silver),
    bronze: safeArrayLength(rankingData.bronze)
  };

  // Quick actions (removed LOR generation)
  const quickActions = [
    {
      id: 'action-add-intern',
      label: 'Add Intern',
      icon: FaUserPlus,
      gradient: 'from-teal-500 to-cyan-600',
      onClick: handleAddIntern,
      description: 'Add a new intern to the program',
      shortcut: '⌘N'
    },
    {
      id: 'action-view-interns',
      label: 'View Interns',
      icon: FaUsers,
      gradient: 'from-cyan-500 to-sky-600',
      onClick: handleViewAllInterns,
      description: 'Browse all interns',
      shortcut: '⌘I'
    },
    {
      id: 'action-view-tasks',
      label: 'View Tasks',
      icon: FaTasks,
      gradient: 'from-emerald-500 to-green-600',
      onClick: handleViewTasks,
      description: 'Manage and review tasks',
      shortcut: '⌘T'
    },
    {
      id: 'action-analytics',
      label: 'Analytics',
      icon: FaChartBar,
      gradient: 'from-purple-500 to-pink-600',
      onClick: handleViewAnalytics,
      description: 'View performance metrics',
      shortcut: '⌘A'
    },
  ];

  const deadlines = [
    { id: 'deadline-1', task: 'Intern Reviews', date: 'Today', count: stats.pendingInterns, color: 'amber', icon: FaClockRegular },
    { id: 'deadline-2', task: 'Task Submissions', date: 'Tomorrow', count: upcomingTasks.length, color: 'teal', icon: FaTasks },
    { id: 'deadline-3', task: 'Weekly Reports', date: 'Friday', count: 3, color: 'blue', icon: BsGraphUpArrow },
  ];

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-teal-600';
    if (score >= 70) return 'text-cyan-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-gray-500';
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Sidebar menu items
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaTachometerAlt,
      gradient: "from-teal-400 to-cyan-400",
      bgLight: "bg-teal-50",
      textLight: "text-teal-600",
      borderLight: "border-teal-200",
      path: "/dashboard/ExecutionTeam"
    },
    {
      id: "interns",
      label: "Interns",
      icon: FaUsers,
      gradient: "from-cyan-400 to-sky-400",
      bgLight: "bg-cyan-50",
      textLight: "text-cyan-600",
      borderLight: "border-cyan-200",
      path: "/dashboard/ExecutionTeam/interns"
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: FaTasks,
      gradient: "from-emerald-400 to-green-400",
      bgLight: "bg-emerald-50",
      textLight: "text-emerald-600",
      borderLight: "border-emerald-200",
      path: "/dashboard/ExecutionTeam/tasks"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: FaChartBar,
      gradient: "from-indigo-400 to-purple-400",
      bgLight: "bg-indigo-50",
      textLight: "text-indigo-600",
      borderLight: "border-indigo-200",
      path: "/dashboard/ExecutionTeam/analytics"
    },
     {
      id: "notification",
      label: "Notification",
      icon: FaBell,
      gradient: "from-gray-400 to-slate-400",
      bgLight: "bg-gray-50",
      textLight: "text-gray-600",
      borderLight: "border-gray-200",
      path: "/dashboard/ExecutionTeam/notification"
    },
    {
      id: "setting",
      label: "Settings",
      icon: FaCog,
      gradient: "from-amber-400 to-orange-400",
      bgLight: "bg-amber-50",
      textLight: "text-amber-600",
      borderLight: "border-amber-200",
      path: "/dashboard/ExecutionTeam/setting"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      gradient: "from-green-400 to-emerald-400",
      bgLight: "bg-green-50",
      textLight: "text-green-600",
      borderLight: "border-green-200",
      path: "/dashboard/ExecutionTeam/profile"
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

  return (
    <div className={`flex h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
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
                {user?.username?.charAt(0)?.toUpperCase() || 'E'}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <div className="animate-fadeIn">
                <h1 className="font-bold text-lg">{user?.username || 'Execution Team'}</h1>
                <p className="text-xs text-teal-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {user?.role || 'Execution Member'}
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
              const isActive = activeSidebarTab === item.id;
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
          {loading && (
            <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
              <FaSpinner className="animate-spin" />
              <span>Updating dashboard...</span>
            </div>
          )}

          {isHomeDashboard ? (
                  <ExecutionHomeDashboard/>
          ) : (
            // Render child routes for other paths
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExecutionDashboard;
