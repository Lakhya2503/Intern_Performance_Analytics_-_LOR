import { useEffect, useState } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import {
  FaAngleRight,
  FaArrowDown,
  FaArrowUp,
  FaDatabase,
  FaEdit,
  FaEnvelope,
  FaFileAlt,
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaRocket,
  FaSearch,
  FaSpinner,
  FaStar,
  FaTasks,
  FaTimes,
  FaTrophy,
  FaUpload,
  FaUserEdit,
  FaUserGraduate,
  FaUserPlus,
  FaUsers
} from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import {
  getAllInterns,
  internsWithLor,
  scoreRankingInterns
} from "../../../api/index";
import { requestHandler } from "../../../utils/index";

export default function MentorHomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(false);
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
  const [lorRequests, setLorRequests] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New LOR request from John Doe', time: '5 min ago', read: false },
    { id: 2, message: 'Task review pending for Alice', time: '1 hour ago', read: false },
    { id: 3, message: 'Weekly report ready', time: '2 hours ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [stats, setStats] = useState({
    totalInterns: 0,
    pendingInterns: 0,
    approvedInterns: 0,
    rejectedInterns: 0,
    pendingLORRequests: 0,
    averageScore: 0,
    activeProjects: 0,
    completionRate: 0
  });

  // Fetch dashboard data
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

    // Fetch LOR requests
    await requestHandler(
      async () => internsWithLor({ status: 'pending' }),
      setLoading,
      (response) => {
        const lorData = Array.isArray(response?.data) ? response.data : [];
        setLorRequests(lorData);
        setStats(prev => ({
          ...prev,
          pendingLORRequests: lorData.length
        }));
      },
      (error) => {
        console.error('Error fetching LOR requests:', error);
        setLorRequests([]);
      }
    );

    setLoading(false);
  };

  // Navigation handlers
  const handleViewAllInterns = () => navigate('/dashboard/Mentor/interns');
  const handleViewAnalytics = () => navigate('/dashboard/Mentor/analytics');
  const handleViewLORRequests = () => navigate('/dashboard/Mentor/lor-requests');
  const handleViewTasks = () => navigate('/dashboard/Mentor/task');
  const handleAddIntern = () => {
    navigate('/dashboard/Mentor/interns', { state: { action: 'add' } });
  };

  const handleUpdateIntern = (intern) => {
    navigate('/dashboard/Mentor/interns', {
      state: {
        action: 'edit',
        internId: intern._id || intern.id
      }
    });
  };

  const handleGenerateLOR = (intern) => {
    navigate('/dashboard/Mentor/lor-requests', {
      state: {
        action: 'generate',
        internId: intern._id || intern.id,
        internName: intern.name
      }
    });
  };

  // Safe array length
  const safeArrayLength = (arr) => Array.isArray(arr) ? arr.length : 0;

  // Get all ranked interns
  const getAllRankedInterns = () => [
    ...(rankingData.gold || []),
    ...(rankingData.silver || []),
    ...(rankingData.bronze || [])
  ];

  // Enhanced recent interns list
  const recentInterns = Array.isArray(interns)
    ? interns.slice(0, 6).map((intern, index) => ({
        ...intern,
        id: intern?._id || intern?.id || `intern-${index}`,
        lastActive: ['Just now', '2 hours ago', 'Yesterday', '3 days ago'][index % 4],
        progress: Math.floor(Math.random() * 30) + 70,
        tasksCompleted: Math.floor(Math.random() * 15) + 10,
        totalTasks: 25,
        avatar: `https://ui-avatars.com/api/?name=${intern?.name?.replace(' ', '+') || 'Intern'}&background=0D9488&color=fff&size=128`,
        email: intern?.email || `${intern?.name?.toLowerCase().replace(' ', '.')}@example.com`,
        project: ['E-commerce Platform', 'Dashboard UI', 'API Gateway', 'Mobile App', 'Cloud Service', 'AI Integration'][index % 6],
        github: `https://github.com/${intern?.name?.toLowerCase().replace(' ', '')}`,
        linkedin: `https://linkedin.com/in/${intern?.name?.toLowerCase().replace(' ', '')}`
      }))
    : [];

  // Enhanced quick stats with icons and colors
  const quickStats = [
    {
      id: 'stat-total-interns',
      label: 'Total Interns',
      value: stats.totalInterns,
      icon: FaUserGraduate,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      change: '+12%',
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
      change: '+5',
      changeType: 'increase'
    },
    {
      id: 'stat-avg-score',
      label: 'Avg. Score',
      value: stats.averageScore,
      icon: FaStar,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+2.5%',
      changeType: 'increase',
      suffix: ''
    },
    {
      id: 'stat-lor-requests',
      label: 'LOR Requests',
      value: stats.pendingLORRequests,
      icon: FaFileAlt,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      change: '+3',
      changeType: 'increase'
    },
  ];


  // Top performers with more details
  const topPerformers = getAllRankedInterns().slice(0, 3).map((intern, idx) => ({
    ...intern,
    id: intern?._id || intern?.id || `top-${idx}`,
    name: intern?.name || 'Intern',
    department: intern?.department || 'General',
    score: Math.round(intern?.score || 0),
    achievement: ['Outstanding Performance', 'Most Improved', 'Best Project'][idx],
    projectsCompleted: Math.floor(Math.random() * 5) + 3
  }));

  const rankingCounts = {
    gold: safeArrayLength(rankingData.gold),
    silver: safeArrayLength(rankingData.silver),
    bronze: safeArrayLength(rankingData.bronze)
  };

  // Enhanced quick actions
  const quickActions = [
    {
      id: 'action-add-intern',
      label: 'Add Intern',
      icon: FaUserPlus,
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      onClick: handleAddIntern,
      description: 'Add a new intern to the program',
    },
    {
      id: 'action-update-intern',
      label: 'Update Intern',
      icon: FaEdit,
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
      onClick: handleViewAllInterns,
      description: 'Edit intern details and progress',
    },
    {
      id: 'action-generate-lor',
      label: 'Generate LOR',
      icon: FaFileAlt,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      onClick: handleViewLORRequests,
      description: 'Create recommendation letter',
    },
    {
      id: 'action-view-tasks',
      label: 'View Tasks',
      icon: FaTasks,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      onClick: handleViewTasks,
      description: 'Manage and review tasks',
    },
  ];


  const getScoreColor = (score) => {
    if (score >= 85) return 'text-teal-600';
    if (score >= 70) return 'text-cyan-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-gray-500';
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <FaSpinner className="animate-spin" />
          <span>Updating dashboard...</span>
        </div>
      )}

      {/* Header Section */}


      <div className="max-w-7xl mx-auto  py-2">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 mb-3">
                Welcome back, {user?.username || 'Mentor'}!
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
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <FaTrophy className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Gold: {rankingCounts.gold}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <FaTrophy className="w-5 h-5 text-gray-300" />
              <span className="font-semibold">Silver: {rankingCounts.silver}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <FaTrophy className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Bronze: {rankingCounts.bronze}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => (
            <div
              key={stat.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={stat.label === 'LOR Requests' ? handleViewLORRequests :
                       stat.label === 'Total Interns' ? handleViewAllInterns :
                       stat.label === 'Pending Reviews' ? handleViewTasks :
                       stat.label === 'Avg. Score' ? handleViewAnalytics : undefined
                      }
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}{stat.suffix || ''}
                  </p>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    vs last month
                    {stat.changeType === 'increase' ?
                      <FaArrowUp className="w-3 h-3 text-green-500" /> :
                      <FaArrowDown className="w-3 h-3 text-red-500" />
                    }
                  </div>
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
                      <th className="py-4 px-6 text-left font-semibold">Course</th>
                      <th className="py-4 px-6 text-left font-semibold">Progress</th>
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

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FaTasks className="w-5 h-5 text-teal-600" />
                            Intern Management
                          </h3>
                          <button
                            onClick={()=>navigate(`/dashboard/Mentor/interns`)}
                            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                          >
                            Manage All
                            <FaAngleRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4"
                        >
                          {/* Add Intern Single */}
                          <div className="p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors group cursor-pointer relative">
                            <div className="flex flex-col items-center text-center"
                              onClick={()=>navigate(`/dashboard/Mentor/interns`)}
                              >
                              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors"
                              >
                                <FaUserPlus className="w-6 h-6 text-teal-600"
                                />
                              </div>
                              <h4 className="font-medium text-gray-800 mb-1">Add Intern</h4>
                              <p className="text-xs text-gray-500">Single entry</p>
                            </div>
                          </div>

                          {/* Add Intern Bulk */}
                          <div className="p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors group cursor-pointer relative">
                            <div className="flex flex-col items-center text-center"
                                onClick={()=>navigate(`/dashboard/Mentor/interns`)}
                            >
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                                <FaUpload className="w-6 h-6 text-purple-600" />
                              </div>
                              <h4 className="font-medium text-gray-800 mb-1">Bulk Upload</h4>
                              <p className="text-xs text-gray-500">CSV/Excel import</p>
                            </div>
                          </div>

                          {/* Update Intern Single */}
                          <div className="p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors group cursor-pointer relative">
                            <div className="flex flex-col items-center text-center"
                                       onClick={()=>navigate(`/dashboard/Mentor/interns`)}
                            >
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                                <FaUserEdit className="w-6 h-6 text-blue-600" />
                              </div>
                              <h4 className="font-medium text-gray-800 mb-1">Update Intern</h4>
                              <p className="text-xs text-gray-500">Single record</p>
                            </div>
                          </div>

                          {/* Update Intern Bulk */}
                          <div className="p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors group cursor-pointer relative">
                            <div className="flex flex-col items-center text-center"
                                  onClick={()=>navigate(`/dashboard/Mentor/interns`)}
                            >
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                                <FaDatabase className="w-6 h-6 text-orange-600" />
                              </div>
                              <h4 className="font-medium text-gray-800 mb-1">Bulk Update</h4>
                              <p className="text-xs text-gray-500">Mass updates</p>
                            </div>
                          </div>
                        </div>
                      </div>


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
                  <h3 className="font-bold text-gray-800">{user?.username || 'Mentor'}</h3>
                  <p className="text-sm text-gray-500">Senior Mentor</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>


            </div>


            {/* Top Performers */}
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
                {topPerformers.length > 0 ? (
                  topPerformers.map((intern, index) => (
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
                        <p className="text-xs text-teal-600 mt-1">{intern.achievement}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(intern.score)}`}>
                          {intern.score}%
                        </p>
                        <p className="text-xs text-gray-500">{intern.projectsCompleted} projects</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaTrophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No ranking data available</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleViewAnalytics}
                className="w-full mt-6 px-4 py-2 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors text-sm font-medium"
              >
                View Full Rankings
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <FaRocket className="w-5 h-5 text-teal-600" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="group relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    title={action.description}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-medium text-${action.color}-700 block`}>
                      {action.label}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                      {action.shortcut}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Intern Detail Modal */}
        {selectedIntern && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedIntern(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 sticky top-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedIntern.avatar}
                      alt={selectedIntern.name}
                      className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl"
                    />
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{selectedIntern.name}</h2>
                      <p className="text-teal-100">{selectedIntern.department} • {selectedIntern.project}</p>
                      <div className="flex gap-2 mt-2">
                        <a href={selectedIntern.github} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                          <FaGithub className="w-4 h-4" />
                        </a>
                        <a href={selectedIntern.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                          <FaLinkedin className="w-4 h-4" />
                        </a>
                      </div>
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

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaEnvelope className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-gray-600">{selectedIntern.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaPhone className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-gray-600">{selectedIntern.phone || '+1 234 567 890'}</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntern.skills?.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                    <p className="text-2xl font-bold text-teal-600">{selectedIntern.progress}%</p>
                    <p className="text-xs text-gray-600">Overall Progress</p>
                    <div className="w-full bg-white rounded-full h-1.5 mt-2">
                      <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${selectedIntern.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <p className="text-2xl font-bold text-amber-600">4.5</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
