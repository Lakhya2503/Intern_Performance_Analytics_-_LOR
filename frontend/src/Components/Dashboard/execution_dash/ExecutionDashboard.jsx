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
import { Home, User } from "lucide-react";
import { MdOutlineRateReview } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsFillCalendarCheckFill, BsGraphUpArrow } from "react-icons/bs";
import {
  getAllInterns,
  scoreRankingInterns,
} from "../../../api/index";
import { requestHandler } from "../../../utils/index";

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
            // Render the enhanced dashboard directly
            <div className="max-w-7xl mx-auto">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold flex items-center gap-3 mb-3">
                      Welcome back, {user?.username || 'Team Member'}!
                      <span className="text-3xl animate-bounce">👋</span>
                    </h1>
                    <p className="text-teal-100 flex items-center gap-2 text-lg">
                      <FaRocket className="w-5 h-5" />
                      Here's what's happening with your interns today
                    </p>
                  </div>

                  <div className="flex gap-3 mt-6 md:mt-0">
                    <button
                      onClick={handleViewAnalytics}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all hover:scale-105 backdrop-blur-sm"
                    >
                      <BsGraphUpArrow className="w-5 h-5" />
                      <span>Analytics</span>
                    </button>
                    <button
                      onClick={handleAddIntern}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-xl hover:bg-teal-50 transition-all hover:scale-105 shadow-lg"
                    >
                      <FaUserPlus className="w-5 h-5" />
                      <span>Add Intern</span>
                    </button>
                  </div>
                </div>

                {/* Ranking Stats */}
                {(rankingCounts.gold > 0 || rankingCounts.silver > 0 || rankingCounts.bronze > 0) && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    {rankingCounts.gold > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                        <FaTrophy className="w-5 h-5 text-yellow-300" />
                        <span className="font-semibold">Gold: {rankingCounts.gold}</span>
                      </div>
                    )}
                    {rankingCounts.silver > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                        <FaTrophy className="w-5 h-5 text-gray-300" />
                        <span className="font-semibold">Silver: {rankingCounts.silver}</span>
                      </div>
                    )}
                    {rankingCounts.bronze > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                        <FaTrophy className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold">Bronze: {rankingCounts.bronze}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={stat.label === 'Total Interns' ? handleViewAllInterns :
                             stat.label === 'Pending Reviews' ? handleViewTasks :
                             stat.label === 'Active Projects' ? handleViewAnalytics : undefined}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          stat.changeType === 'increase' ? 'bg-green-100 text-green-700' :
                          stat.changeType === 'neutral' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                      <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-gray-800">
                          {stat.value}{stat.suffix || ''}
                        </p>
                      </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                  </div>
                ))}
              </div>



              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Recent Interns Table */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaUsers className="w-5 h-5 text-teal-600" />
                        Recent Interns
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search interns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={handleViewAllInterns}
                          className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium group"
                        >
                          View All
                          <FaAngleRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="text-gray-600 text-sm">
                            <th className="py-4 px-6 text-left font-semibold">Intern</th>
                            <th className="py-4 px-6 text-left font-semibold">Department</th>
                            <th className="py-4 px-6 text-left font-semibold">Project</th>
                            <th className="py-4 px-6 text-left font-semibold">Progress</th>
                            <th className="py-4 px-6 text-left font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentInterns.length > 0 ? (
                            recentInterns
                              .filter(intern =>
                                intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                intern.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                intern.project?.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                              .map((intern) => (
                                <tr key={intern.id} className="hover:bg-teal-50/30 border-b last:border-b-0 transition-colors group">
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={intern.avatar}
                                        alt={intern.name}
                                        className="w-10 h-10 rounded-full ring-2 ring-teal-100 group-hover:ring-teal-300 transition-all"
                                      />
                                      <div>
                                        <p className="font-medium text-gray-800">{intern.name}</p>
                                        <p className="text-xs text-gray-500">{intern.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                                      {intern.department || 'General'}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <p className="text-gray-600 text-sm">{intern.course}</p>
                                    {intern.skills?.length > 0 && (
                                      <div className="flex gap-1 mt-1">
                                        {intern.skills.slice(0, 2).map((skill, idx) => (
                                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                          className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                                          style={{ width: `${intern.progress}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium text-gray-600">{intern.progress}%</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                      ${intern.status === 'Approve' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        intern.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                      }`}>
                                      {intern.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="py-12 text-center">
                                <div className="flex flex-col items-center gap-3">
                                  <FaUsers className="w-12 h-12 text-gray-300" />
                                  <p className="text-gray-500">No interns found</p>
                                  <button
                                    onClick={handleAddIntern}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                                  >
                                    Add Your First Intern
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Upcoming Tasks */}
                  {upcomingTasks.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaTasks className="w-5 h-5 text-teal-600" />
                          Upcoming Tasks
                        </h3>
                        <button
                          onClick={handleViewTasks}
                          className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                        >
                          View All Tasks
                          <FaAngleRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {upcomingTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors group cursor-pointer"
                          >
                            <img
                              src={task.internAvatar}
                              alt={task.intern}
                              className="w-10 h-10 rounded-full ring-2 ring-white group-hover:ring-teal-200 transition-all"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-800">{task.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FaUser className="w-3 h-3" />
                                  {task.intern}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaClock className="w-3 h-3" />
                                  {task.deadline}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaCode className="w-3 h-3" />
                                  {task.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Profile Overview */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user?.username?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{user?.username || 'Team Member'}</h3>
                        <p className="text-sm text-gray-500">Execution Team</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs text-gray-500">Online</span>
                        </div>
                      </div>
                    </div>


                    {stats.completionRate > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Completion Rate</span>
                          <span className="font-semibold text-gray-800">{stats.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${stats.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Top Performers */}
                  {topPerformers.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaTrophy className="w-5 h-5 text-yellow-500" />
                          Top Performers
                        </h3>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          This Month
                        </span>
                      </div>

                      <div className="space-y-4">
                        {topPerformers.map((intern, index) => (
                          <div key={intern.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-teal-50 hover:to-cyan-50 transition-all">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                {intern.name?.charAt(0) || 'I'}
                              </div>
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{intern.name}</p>
                              <p className="text-xs text-gray-500">{intern.department}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getScoreColor(intern.score)}`}>
                                {intern.score}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleViewAnalytics}
                        className="w-full mt-6 px-4 py-2 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors text-sm font-medium"
                      >
                        View Full Rankings
                      </button>
                    </div>
                  )}


                </div>
              </div>
            </div>
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
