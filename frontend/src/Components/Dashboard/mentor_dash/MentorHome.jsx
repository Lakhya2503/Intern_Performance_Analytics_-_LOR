// src/pages/Mentor/MentorHomeDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import {
  getAllInterns,
  scoreRankingInterns,
  internsWithLor,
  rejectedInternForLor,
  executionTeamMembers
} from "../../../api/index";
import { requestHandler } from "../../../utils/index";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  FaUserGraduate,
  FaFileAlt,
  FaCalendarCheck,
  FaStar,
  FaComments,
  FaRocket,
  FaAward,
  FaRegClock,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaEllipsisV,
  FaUserPlus,
  FaBell,
  FaRegCalendarAlt,
  FaRegCheckCircle,
  FaRegClock as FaRegClockOutline,
  FaCode,
  FaMobile,
  FaServer,
  FaPen,
  FaCamera,
  FaChartBar,
  FaThumbsUp,
  FaExclamationCircle,
  FaSpinner,
  FaCheckDouble,
  FaHourglassHalf,
  FaCalendarAlt,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaAngleRight,
  FaAngleLeft,
  FaTimes,
  FaUpload,
  FaTrophy
} from "react-icons/fa";
import { MdPendingActions, MdAssignment, MdFeedback, MdOutlineTask } from "react-icons/md";

export default function MentorHomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(false);
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
  const [lorRequests, setLorRequests] = useState([]);
  const [executionTeam, setExecutionTeam] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [stats, setStats] = useState({
    totalInterns: 0,
    pendingInterns: 0,
    approvedInterns: 0,
    rejectedInterns: 0,
    pendingLORRequests: 0,
    totalTasks: 45,
    completedTasks: 32,
    pendingTasks: 13,
    averageScore: 0,
    onTimeSubmissions: 85,
    delayedSubmissions: 15,
    feedbackGiven: 28,
    pendingFeedback: 12,
    activeProjects: 8,
    completedProjects: 23,
    hoursLogged: 156,
    averageAttendance: 94
  });

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Fetch all interns
    await requestHandler(
      async () => getAllInterns(),
      setLoading,
      (response) => {
        const internsData = response?.data || [];
        setInterns(Array.isArray(internsData) ? internsData : []);

        // Calculate stats from interns data
        const pending = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "pending").length : 0;
        const approved = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "Approve").length : 0;
        const rejected = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "Rejected").length : 0;

        setStats(prev => ({
          ...prev,
          totalInterns: Array.isArray(internsData) ? internsData.length : 0,
          pendingInterns: pending,
          approvedInterns: approved,
          rejectedInterns: rejected,
          pendingTasks: pending // Using pending interns as pending tasks
        }));
      },
      (error) => {
        console.error('Error fetching interns:', error);
        setInterns([]);
      }
    );

    // Fetch rankings - Updated to handle the new data structure
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

        // Calculate average score from all rankings
        const allRankedInterns = [
          ...(Array.isArray(rankings.gold) ? rankings.gold : []),
          ...(Array.isArray(rankings.silver) ? rankings.silver : []),
          ...(Array.isArray(rankings.bronze) ? rankings.bronze : [])
        ];

        const scores = allRankedInterns.map(item => item?.score || 0);
        const avgScore = scores.length > 0
          ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length
          : 0;

        setStats(prev => ({
          ...prev,
          averageScore: avgScore.toFixed(1)
        }));
      },
      (error) => {
        console.error('Error fetching rankings:', error);
        setRankingData({ gold: [], silver: [], bronze: [] });
      }
    );

    // Fetch LOR requests
    await requestHandler(
      async () => {
        const [lorResponse, rejectedResponse] = await Promise.all([
          internsWithLor({ status: 'pending' }),
          rejectedInternForLor()
        ]);
        return {
          lorData: lorResponse?.data || [],
          rejectedData: rejectedResponse?.data || []
        };
      },
      setLoading,
      (response) => {
        const lorData = Array.isArray(response?.lorData) ? response.lorData : [];
        const rejectedData = Array.isArray(response?.rejectedData) ? response.rejectedData : [];
        const allLorRequests = [...lorData, ...rejectedData];
        setLorRequests(allLorRequests);
        setStats(prev => ({
          ...prev,
          pendingLORRequests: allLorRequests.length
        }));
      },
      (error) => {
        console.error('Error fetching LOR requests:', error);
        setLorRequests([]);
      }
    );

    // Fetch execution team
    await requestHandler(
      async () => executionTeamMembers(),
      setLoading,
      (response) => {
        setExecutionTeam(Array.isArray(response?.data) ? response.data : []);
      },
      (error) => {
        console.error('Error fetching execution team:', error);
        setExecutionTeam([]);
      }
    );

    setLoading(false);
  };

  // Navigation handlers
  const handleViewAllInterns = () => {
    navigate('/dashboard/Mentor/interns');
  };

  const handleViewAnalytics = () => {
    navigate('/dashboard/Mentor/analytics');
  };

  const handleViewExecutionTeam = () => {
    navigate('/dashboard/Mentor/execution-team');
  };

  const handleViewLORRequests = () => {
    navigate('/dashboard/Mentor/lor-requests');
  };

  const handleViewTasks = () => {
    navigate('/dashboard/Mentor/task');
  };

  const handleAddIntern = () => {
    navigate('/dashboard/Mentor/task', { state: { action: 'add' } });
  };

  const handleBulkUpload = () => {
    navigate('/dashboard/Mentor/task', { state: { action: 'bulk' } });
  };

  // Safely get array length with fallback
  const safeArrayLength = (arr) => {
    return Array.isArray(arr) ? arr.length : 0;
  };

  // Combine all ranked interns for top performers
  const getAllRankedInterns = () => {
    return [
      ...(rankingData.gold || []),
      ...(rankingData.silver || []),
      ...(rankingData.bronze || [])
    ];
  };

  // Department distribution from actual interns data with safe array operations
  const departmentStats = [
    { id: 'dept-frontend', name: 'Frontend', count: Array.isArray(interns) ? interns.filter(i => i?.department === 'Frontend').length : 0, color: 'teal', icon: FaCode, progress: 75 },
    { id: 'dept-backend', name: 'Backend', count: Array.isArray(interns) ? interns.filter(i => i?.department === 'Backend').length : 0, color: 'cyan', icon: FaServer, progress: 82 },
    { id: 'dept-mobile', name: 'Mobile', count: Array.isArray(interns) ? interns.filter(i => i?.department === 'Mobile').length : 0, color: 'emerald', icon: FaMobile, progress: 68 },
    { id: 'dept-uiux', name: 'UI/UX', count: Array.isArray(interns) ? interns.filter(i => i?.department === 'UI/UX').length : 0, color: 'purple', icon: FaPen, progress: 91 },
    { id: 'dept-qa', name: 'QA', count: Array.isArray(interns) ? interns.filter(i => i?.department === 'QA').length : 0, color: 'amber', icon: FaCamera, progress: 70 },
  ];

  // Recent interns list with more details and safe array operations
  const recentInterns = Array.isArray(interns)
    ? interns.slice(0, 6).map((intern, index) => ({
        ...intern,
        id: intern?._id || intern?.id || `intern-${index}-${Date.now()}`,
        lastActive: ['Just now', '2 hours ago', 'Yesterday', '3 days ago'][index % 4],
        progress: Math.floor(Math.random() * 30) + 70,
        tasksCompleted: Math.floor(Math.random() * 15) + 10,
        totalTasks: 25,
        avatar: `https://ui-avatars.com/api/?name=${intern?.name?.replace(' ', '+') || 'Intern'}&background=0D9488&color=fff&size=128`,
        email: intern?.email || `${intern?.name?.toLowerCase().replace(' ', '.')}@example.com`,
        project: ['E-commerce App', 'Dashboard UI', 'API Gateway', 'Mobile App'][index % 4],
        mentor: user?.username || 'John Mentor'
      }))
    : [];

  // Upcoming tasks with unique IDs (mock data - replace with actual tasks API when available)
  const upcomingTasks = [
    { id: 'task-1', title: 'Review Frontend Code', intern: 'Alice Johnson', internAvatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=0D9488&color=fff', deadline: 'Today, 5:00 PM', priority: 'High', status: 'pending', type: 'code' },
    { id: 'task-2', title: 'Weekly Progress Meeting', intern: 'All Interns', internAvatar: 'https://ui-avatars.com/api/?name=All+Interns&background=0891B2&color=fff', deadline: 'Tomorrow, 10:00 AM', priority: 'Medium', status: 'scheduled', type: 'meeting' },
    { id: 'task-3', title: 'Code Review Session', intern: 'Bob Smith', internAvatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=0D9488&color=fff', deadline: 'Tomorrow, 3:00 PM', priority: 'High', status: 'pending', type: 'code' },
    { id: 'task-4', title: 'Documentation Review', intern: 'Carol Davis', internAvatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=0D9488&color=fff', deadline: 'Wed, 11:00 AM', priority: 'Low', status: 'pending', type: 'doc' },
    { id: 'task-5', title: 'Database Design Review', intern: 'David Wilson', internAvatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=0891B2&color=fff', deadline: 'Wed, 2:00 PM', priority: 'Medium', status: 'pending', type: 'database' },
  ];

  // Performance alerts from actual data with unique IDs and safe array operations
  const performanceAlerts = [
    ...(Array.isArray(interns) ? interns.filter(i => i?.status === 'pending').slice(0, 2).map((intern, idx) => ({
      id: `alert-pending-${intern?._id || intern?.id || idx}`,
      intern: intern?.name || 'Unknown',
      issue: 'Pending review',
      severity: 'medium',
      avatar: `https://ui-avatars.com/api/?name=${intern?.name?.replace(' ', '+') || 'Unknown'}&background=F59E0B&color=fff`
    })) : []),
    ...(Array.isArray(interns) ? interns.filter(i => i?.status === 'Rejected').slice(0, 2).map((intern, idx) => ({
      id: `alert-rejected-${intern?._id || intern?.id || idx}`,
      intern: intern?.name || 'Unknown',
      issue: 'Needs attention',
      severity: 'high',
      avatar: `https://ui-avatars.com/api/?name=${intern?.name?.replace(' ', '+') || 'Unknown'}&background=EF4444&color=fff`
    })) : [])
  ];

  // Notifications with unique IDs
  const notifications = [
    { id: 'notif-1', message: `${stats.pendingLORRequests} new LOR requests`, time: '5 min ago', read: false, icon: FaFileAlt },
    { id: 'notif-2', message: `${stats.pendingInterns} interns pending review`, time: '1 hour ago', read: false, icon: FaUserClock },
    { id: 'notif-3', message: 'Weekly report ready', time: '2 hours ago', read: true, icon: FaChartLine },
    { id: 'notif-4', message: `${safeArrayLength(executionTeam)} team members active`, time: 'Yesterday', read: true, icon: FaUsers },
  ];

  // Achievement badges with unique IDs and safe calculations
  const achievements = [
    { id: 'achievement-1', name: 'Review Rate', icon: FaStar, color: 'yellow', count: `${Math.round((stats.approvedInterns / (stats.totalInterns || 1)) * 100) || 0}%` },
    { id: 'achievement-2', name: 'On-time Feedback', icon: FaClock, color: 'green', count: `${stats.onTimeSubmissions}%` },
    { id: 'achievement-3', name: 'Mentor Score', icon: FaAward, color: 'purple', count: stats.averageScore },
  ];

  // Quick stats cards data with unique IDs
  const quickStats = [
    { id: 'stat-total-interns', label: 'Total Interns', value: stats.totalInterns, icon: FaUsers, color: 'teal', change: '+12%', changeType: 'increase' },
    { id: 'stat-pending-tasks', label: 'Pending Tasks', value: stats.pendingInterns, icon: FaTasks, color: 'cyan', change: '+5', changeType: 'increase' },
    { id: 'stat-avg-score', label: 'Avg. Score', value: stats.averageScore, icon: FaStar, color: 'amber', change: '+2.5%', changeType: 'increase', suffix: '' },
    { id: 'stat-lor-requests', label: 'LOR Requests', value: stats.pendingLORRequests, icon: FaFileAlt, color: 'emerald', change: '+3', changeType: 'increase' },
  ];

  // Upcoming deadlines with unique IDs
  const deadlines = [
    { id: 'deadline-1', task: 'Intern Reviews', date: 'Today', count: stats.pendingInterns, color: 'red' },
    { id: 'deadline-2', task: 'LOR Approvals', date: 'Tomorrow', count: stats.pendingLORRequests, color: 'amber' },
    { id: 'deadline-3', task: 'Monthly Report', date: 'Dec 25', count: 1, color: 'blue' },
  ];

  // Top performers from rankings - Updated to handle the new structure
  const topPerformers = getAllRankedInterns().slice(0, 3).map((intern, idx) => ({
    ...intern,
    id: intern?._id || intern?.id || `top-${idx}-${Date.now()}`,
    name: intern?.name || 'Intern',
    department: intern?.department || 'General',
    score: Math.round(intern?.score || 0),
    trend: 'up'
  }));

  // Gold, Silver, Bronze counts for display
  const rankingCounts = {
    gold: safeArrayLength(rankingData.gold),
    silver: safeArrayLength(rankingData.silver),
    bronze: safeArrayLength(rankingData.bronze)
  };

  // Quick actions with unique IDs
  const quickActions = [
    { id: 'action-add-task', label: 'Add Task', icon: MdAssignment, color: 'teal', onClick: handleViewTasks },
    { id: 'action-give-feedback', label: 'Give Feedback', icon: MdFeedback, color: 'cyan', onClick: handleViewTasks },
    { id: 'action-schedule-meeting', label: 'Schedule Meeting', icon: FaCalendarCheck, color: 'emerald', onClick: handleViewTasks },
    { id: 'action-generate-lor', label: 'Generate LOR', icon: FaFileAlt, color: 'purple', onClick: handleViewLORRequests },
    { id: 'action-add-intern', label: 'Add Intern', icon: FaUserPlus, color: 'teal', onClick: handleAddIntern },
    { id: 'action-bulk-upload', label: 'Bulk Upload', icon: FaUpload, color: 'cyan', onClick: handleBulkUpload },
    { id: 'action-execution-team', label: 'Execution Team', icon: FaUsers, color: 'emerald', onClick: handleViewExecutionTeam },
    { id: 'action-analytics', label: 'Analytics', icon: FaChartBar, color: 'purple', onClick: handleViewAnalytics },
  ];

  // Get score color based on value
  const getScoreColor = (score) => {
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'text-teal-600';
    if (roundedScore >= 70) return 'text-teal-500';
    if (roundedScore >= 50) return 'text-teal-400';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          <span>Updating dashboard...</span>
        </div>
      )}

      {/* Welcome Section with Quick Actions */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Welcome back, {user?.username || 'Mentor'}!
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-teal-100 mt-2 flex items-center gap-2">
              <FaRocket className="w-4 h-4" />
              Here's what's happening with your interns today
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={handleViewAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <FaChartLine className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </button>
            <button
              onClick={handleAddIntern}
              className="flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-xl hover:bg-teal-50 transition-colors"
            >
              <FaUserPlus className="w-4 h-4" />
              <span className="text-sm">Add Intern</span>
            </button>
          </div>
        </div>

        {/* Ranking Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <FaTrophy className="w-4 h-4 text-yellow-300" />
            <span className="text-sm">Gold: {rankingCounts.gold}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <FaTrophy className="w-4 h-4 text-gray-300" />
            <span className="text-sm">Silver: {rankingCounts.silver}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <FaTrophy className="w-4 h-4 text-amber-600" />
            <span className="text-sm">Bronze: {rankingCounts.bronze}</span>
          </div>
        </div>

        {/* Quick Date Navigation */}
        <div className="flex gap-2 mt-4">
          {['Today', 'This Week', 'This Month', 'Custom'].map((item) => (
            <button
              key={`date-${item.toLowerCase()}`}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                selectedTimeframe === item.toLowerCase()
                  ? 'bg-white text-teal-600 font-medium'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              onClick={() => setSelectedTimeframe(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-teal-500 group cursor-pointer"
            onClick={stat.label === 'LOR Requests' ? handleViewLORRequests :
                     stat.label === 'Total Interns' ? handleViewAllInterns :
                     stat.label === 'Pending Tasks' ? handleViewTasks : undefined}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-800">
                  {stat.value}{stat.suffix || ''}
                </h2>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs font-medium flex items-center gap-1 ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? <FaArrowUp /> : <FaArrowDown />}
                {stat.change}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Overview */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaChartBar className="w-5 h-5 text-teal-600" />
                Department Overview
              </h2>
              <button
                onClick={handleViewAnalytics}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                View All <FaAngleRight />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <dept.icon className={`w-4 h-4 text-${dept.color}-600`} />
                        <span className="font-medium text-gray-700">{dept.name}</span>
                        <span className="text-sm text-gray-500">({dept.count} interns)</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`bg-${dept.color}-600 h-2.5 rounded-full transition-all duration-500 group-hover:bg-${dept.color}-700`}
                        style={{ width: `${dept.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FaFilter className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={handleViewAllInterns}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="py-4 px-6 text-left">Intern</th>
                    <th className="py-4 px-6 text-left">Department</th>
                    <th className="py-4 px-6 text-left">Project</th>
                    <th className="py-4 px-6 text-left">Progress</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Last Active</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInterns.length > 0 ? (
                    recentInterns
                      .filter(intern =>
                        intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        intern.department?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((intern) => (
                        <tr key={intern.id} className="hover:bg-teal-50/30 border-b last:border-b-0">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img src={intern.avatar} alt={intern.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="font-medium text-gray-800">{intern.name}</p>
                                <p className="text-xs text-gray-500">{intern.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                              {intern.department || 'General'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{intern.project}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-teal-600 h-2 rounded-full"
                                  style={{ width: `${intern.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{intern.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                              ${intern.status === 'Approve' ? 'bg-green-100 text-green-700' :
                                intern.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                              {intern.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-600">{intern.lastActive}</span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => setSelectedIntern(intern)}
                              className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
                            >
                              <FaEye className="w-4 h-4 text-teal-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        No interns found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaTasks className="w-5 h-5 text-teal-600" />
                Upcoming Tasks
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                  {upcomingTasks.length} tasks
                </span>
                <button
                  onClick={handleViewTasks}
                  className="text-teal-600 hover:text-teal-700"
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-teal-50/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <img src={task.internAvatar} alt={task.intern} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{task.intern}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <FaRegClock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{task.deadline}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Alerts */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaExclamationTriangle className="w-5 h-5 text-amber-600" />
                Alerts & Notifications
              </h2>
              <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                {performanceAlerts.length} new
              </span>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {performanceAlerts.length > 0 ? (
                performanceAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-amber-50/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <img src={alert.avatar} alt={alert.intern} className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{alert.intern}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.issue}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No alerts at this time
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaAward className="w-5 h-5 text-purple-600" />
                Your Achievements
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center p-3 rounded-xl hover:bg-purple-50 transition-colors">
                    <div className={`w-10 h-10 bg-${achievement.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <achievement.icon className={`w-5 h-5 text-${achievement.color}-600`} />
                    </div>
                    <p className="text-xs font-medium text-gray-600">{achievement.name}</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">{achievement.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Deadlines & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaCalendarAlt className="w-4 h-4 text-teal-600" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {deadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">{deadline.task}</p>
                  <p className="text-xs text-gray-500 mt-1">{deadline.date}</p>
                </div>
                <span className={`bg-${deadline.color}-100 text-${deadline.color}-700 px-3 py-1 rounded-full text-xs font-medium`}>
                  {deadline.count} items
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaStar className="w-4 h-4 text-yellow-500" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {topPerformers.length > 0 ? topPerformers.map((intern) => (
              <div key={intern.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {intern.name?.charAt(0) || 'I'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{intern.name}</p>
                  <p className="text-xs text-gray-500">{intern.department}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getScoreColor(intern.score)}`}>
                    {intern.score}%
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <FaArrowUp /> 5%
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">No ranking data available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaRocket className="w-4 h-4 text-teal-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`p-4 bg-${action.color}-50 rounded-xl hover:bg-${action.color}-100 transition-colors text-center group`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <span className={`text-xs font-medium text-${action.color}-700`}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Intern Detail Modal */}
      {selectedIntern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 sticky top-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedIntern.avatar} alt={selectedIntern.name} className="w-16 h-16 rounded-full border-4 border-white" />
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedIntern.name}</h2>
                    <p className="text-teal-100">{selectedIntern.department} • {selectedIntern.project}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntern(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaEnvelope className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-600">{selectedIntern.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaPhone className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-600">+1 234 567 890</span>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-teal-50 rounded-xl">
                  <p className="text-2xl font-bold text-teal-600">{selectedIntern.progress}%</p>
                  <p className="text-xs text-gray-600">Overall Progress</p>
                </div>
                <div className="text-center p-3 bg-cyan-50 rounded-xl">
                  <p className="text-2xl font-bold text-cyan-600">{selectedIntern.tasksCompleted}/{selectedIntern.totalTasks}</p>
                  <p className="text-xs text-gray-600">Tasks Done</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">4.5</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                  Give Feedback
                </button>
                <button
                  onClick={() => {
                    setSelectedIntern(null);
                    navigate(`/dashboard/Mentor/interns/${selectedIntern.id}`);
                  }}
                  className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
