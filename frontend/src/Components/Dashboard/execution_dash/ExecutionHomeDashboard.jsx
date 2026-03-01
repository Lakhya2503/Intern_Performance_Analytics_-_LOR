// src/pages/Execution/ExecutionHomeDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import {
  getAllInterns,
  scoreRankingInterns,
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
  FaTrophy,
  FaClipboardList,
  FaCheckSquare,
  FaFlag,
  FaUserCog,
  FaProjectDiagram,
  FaBug,
  FaLightbulb,
  FaHandshake
} from "react-icons/fa";
import { MdPendingActions, MdAssignment, MdFeedback, MdOutlineTask } from "react-icons/md";

export default function ExecutionHomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(false);
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [stats, setStats] = useState({
    totalInterns: 0,
    activeProjects: 12,
    completedTasks: 156,
    pendingTasks: 43,
    upcomingDeadlines: 8,
    teamEfficiency: 87,
    averageResponseTime: '2.4h',
    satisfactionRate: 94,
    totalMeetings: 24,
    resourcesAllocated: 18,
    bugsReported: 23,
    bugsResolved: 19,
    clientFeedback: 4.8
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

        setStats(prev => ({
          ...prev,
          totalInterns: Array.isArray(internsData) ? internsData.length : 0
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
      },
      (error) => {
        console.error('Error fetching rankings:', error);
        setRankingData({ gold: [], silver: [], bronze: [] });
      }
    );

    setLoading(false);
  };

  // Navigation handlers
  const handleViewAllInterns = () => {
    navigate('/dashboard/ExecutionTeam/interns');
  };

  const handleViewProjects = () => {
    navigate('/dashboard/ExecutionTeam/projects');
  };

  const handleViewTasks = () => {
    navigate('/dashboard/ExecutionTeam/tasks');
  };

  const handleViewTeam = () => {
    navigate('/dashboard/ExecutionTeam/team');
  };

  const handleViewReports = () => {
    navigate('/dashboard/ExecutionTeam/reports');
  };

  const handleViewAnalytics = () => {
    navigate('/dashboard/ExecutionTeam/analytics');
  };

  const handleViewMeetings = () => {
    navigate('/dashboard/ExecutionTeam/meetings');
  };

  const handleViewResources = () => {
    navigate('/dashboard/ExecutionTeam/resources');
  };

  const handleViewBugs = () => {
    navigate('/dashboard/ExecutionTeam/bugs');
  };

  // Safely get array length with fallback
  const safeArrayLength = (arr) => {
    return Array.isArray(arr) ? arr.length : 0;
  };

  // Combine all ranked interns
  const getAllRankedInterns = () => {
    return [
      ...(rankingData.gold || []),
      ...(rankingData.silver || []),
      ...(rankingData.bronze || [])
    ];
  };

  // Project distribution data
  const projectStats = [
    { id: 'proj-frontend', name: 'Frontend Projects', count: 4, color: 'teal', icon: FaCode, progress: 85 },
    { id: 'proj-backend', name: 'Backend Projects', count: 3, color: 'cyan', icon: FaServer, progress: 72 },
    { id: 'proj-mobile', name: 'Mobile Apps', count: 2, color: 'emerald', icon: FaMobile, progress: 68 },
    { id: 'proj-uiux', name: 'UI/UX Design', count: 2, color: 'purple', icon: FaPen, progress: 91 },
    { id: 'proj-qa', name: 'QA Testing', count: 1, color: 'amber', icon: FaBug, progress: 95 },
  ];

  // Active projects with details
  const activeProjects = [
    {
      id: 'project-1',
      name: 'E-commerce Platform',
      lead: 'Alice Johnson',
      team: 8,
      progress: 75,
      deadline: 'Dec 30, 2024',
      priority: 'High',
      status: 'on-track',
      department: 'Full Stack'
    },
    {
      id: 'project-2',
      name: 'Mobile Banking App',
      lead: 'Bob Smith',
      team: 6,
      progress: 60,
      deadline: 'Jan 15, 2025',
      priority: 'High',
      status: 'on-track',
      department: 'Mobile'
    },
    {
      id: 'project-3',
      name: 'Admin Dashboard',
      lead: 'Carol Davis',
      team: 4,
      progress: 90,
      deadline: 'Dec 15, 2024',
      priority: 'Medium',
      status: 'ahead',
      department: 'Frontend'
    },
    {
      id: 'project-4',
      name: 'API Gateway',
      lead: 'David Wilson',
      team: 3,
      progress: 45,
      deadline: 'Feb 1, 2025',
      priority: 'Medium',
      status: 'at-risk',
      department: 'Backend'
    },
    {
      id: 'project-5',
      name: 'Analytics Platform',
      lead: 'Eva Brown',
      team: 5,
      progress: 30,
      deadline: 'Mar 10, 2025',
      priority: 'Low',
      status: 'on-track',
      department: 'Data'
    },
  ];

  // Team members with roles
  const teamMembers = Array.isArray(interns)
    ? interns.slice(0, 8).map((intern, index) => ({
        ...intern,
        id: intern?._id || intern?.id || `member-${index}`,
        name: intern?.name || `Team Member ${index + 1}`,
        role: ['Lead Developer', 'UI/UX Designer', 'Backend Engineer', 'QA Tester', 'Frontend Developer', 'DevOps', 'Project Manager', 'Mobile Developer'][index % 8],
        department: intern?.department || ['Engineering', 'Design', 'QA', 'Product'][index % 4],
        status: ['active', 'active', 'active', 'on-leave', 'active', 'active', 'active', 'active'][index % 8],
        tasksCompleted: Math.floor(Math.random() * 45) + 20,
        avatar: `https://ui-avatars.com/api/?name=${intern?.name?.replace(' ', '+') || 'Team+Member'}&background=0D9488&color=fff&size=128`,
      }))
    : [];

  // Upcoming meetings
  const upcomingMeetings = [
    { id: 'meeting-1', title: 'Sprint Planning', date: 'Today, 3:00 PM', attendees: 12, room: 'Conference A', host: 'John Doe' },
    { id: 'meeting-2', title: 'Code Review Session', date: 'Tomorrow, 10:00 AM', attendees: 8, room: 'Virtual', host: 'Alice Johnson' },
    { id: 'meeting-3', title: 'Client Demo', date: 'Tomorrow, 2:00 PM', attendees: 15, room: 'Conference B', host: 'Bob Smith' },
    { id: 'meeting-4', title: 'Weekly Sync', date: 'Wed, 11:00 AM', attendees: 20, room: 'Main Hall', host: 'Carol Davis' },
    { id: 'meeting-5', title: 'Retrospective', date: 'Fri, 4:00 PM', attendees: 10, room: 'Virtual', host: 'David Wilson' },
  ];

  // Recent activities
  const recentActivities = [
    { id: 'act-1', user: 'Alice Johnson', action: 'completed task', target: 'API Integration', time: '5 min ago', type: 'completion' },
    { id: 'act-2', user: 'Bob Smith', action: 'created new branch', target: 'feature/auth', time: '15 min ago', type: 'code' },
    { id: 'act-3', user: 'Carol Davis', action: 'commented on', target: 'UI Design Review', time: '1 hour ago', type: 'comment' },
    { id: 'act-4', user: 'David Wilson', action: 'deployed to', target: 'staging environment', time: '2 hours ago', type: 'deploy' },
    { id: 'act-5', user: 'Eva Brown', action: 'reported bug', target: '#234 - Login issue', time: '3 hours ago', type: 'bug' },
    { id: 'act-6', user: 'Frank Miller', action: 'merged PR', target: '#89 - Dashboard UI', time: '5 hours ago', type: 'merge' },
  ];

  // Bugs/issues tracker
  const bugsList = [
    { id: 'bug-1', title: 'Login page not responsive', project: 'E-commerce Platform', severity: 'High', status: 'in-progress', assignee: 'Alice Johnson' },
    { id: 'bug-2', title: 'API timeout on payment', project: 'Mobile Banking App', severity: 'Critical', status: 'pending', assignee: 'Bob Smith' },
    { id: 'bug-3', title: 'Chart not loading', project: 'Analytics Platform', severity: 'Medium', status: 'resolved', assignee: 'Carol Davis' },
    { id: 'bug-4', title: 'Broken links in footer', project: 'Admin Dashboard', severity: 'Low', status: 'in-progress', assignee: 'David Wilson' },
  ];

  // Resource allocation
  const resources = [
    { id: 'res-1', name: 'Development Servers', allocated: 8, total: 10, status: 'optimal' },
    { id: 'res-2', name: 'Database Connections', allocated: 12, total: 15, status: 'optimal' },
    { id: 'res-3', name: 'API Rate Limits', allocated: 75, total: 100, status: 'warning' },
    { id: 'res-4', name: 'Storage', allocated: 450, total: 500, unit: 'GB', status: 'optimal' },
  ];

  // Quick stats cards
  const quickStats = [
    { id: 'stat-active-projects', label: 'Active Projects', value: stats.activeProjects, icon: FaProjectDiagram, color: 'teal', change: '+2', changeType: 'increase' },
    { id: 'stat-completed-tasks', label: 'Completed Tasks', value: stats.completedTasks, icon: FaCheckCircle, color: 'green', change: '+28', changeType: 'increase' },
    { id: 'stat-pending-tasks', label: 'Pending Tasks', value: stats.pendingTasks, icon: FaTasks, color: 'amber', change: '-12', changeType: 'decrease' },
    { id: 'stat-team-efficiency', label: 'Team Efficiency', value: `${stats.teamEfficiency}%`, icon: FaChartLine, color: 'cyan', change: '+5%', changeType: 'increase' },
  ];

  // Quick actions for execution team
  const quickActions = [
    { id: 'action-create-task', label: 'Create Task', icon: MdAssignment, color: 'teal', onClick: handleViewTasks },
    { id: 'action-start-project', label: 'Start Project', icon: FaRocket, color: 'cyan', onClick: handleViewProjects },
    { id: 'action-schedule-meeting', label: 'Schedule Meeting', icon: FaCalendarCheck, color: 'emerald', onClick: handleViewMeetings },
    { id: 'action-assign-resource', label: 'Assign Resource', icon: FaUserCog, color: 'purple', onClick: handleViewResources },
    { id: 'action-report-bug', label: 'Report Bug', icon: FaBug, color: 'red', onClick: handleViewBugs },
    { id: 'action-view-analytics', label: 'Analytics', icon: FaChartBar, color: 'blue', onClick: handleViewAnalytics },
  ];

  // Performance metrics
  const performanceMetrics = [
    { id: 'metric-1', label: 'Satisfaction Rate', value: `${stats.satisfactionRate}%`, icon: FaThumbsUp, color: 'green', trend: '+2%' },
    { id: 'metric-2', label: 'Avg Response Time', value: stats.averageResponseTime, icon: FaClock, color: 'cyan', trend: '-0.3h' },
    { id: 'metric-3', label: 'Bugs Resolved', value: `${stats.bugsResolved}/${stats.bugsReported}`, icon: FaBug, color: 'amber', trend: '+5' },
    { id: 'metric-4', label: 'Client Feedback', value: stats.clientFeedback, icon: FaStar, color: 'yellow', trend: '+0.2' },
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'ahead': return 'text-teal-600 bg-teal-100';
      case 'at-risk': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'on-leave': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Welcome back, {user?.username || 'Team'}!
              <span className="text-2xl">🚀</span>
            </h1>
            <p className="text-teal-100 mt-2 flex items-center gap-2">
              <FaRocket className="w-4 h-4" />
              Execution team dashboard - Track projects, tasks, and team performance
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
              onClick={handleViewMeetings}
              className="flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-xl hover:bg-teal-50 transition-colors"
            >
              <FaCalendarCheck className="w-4 h-4" />
              <span className="text-sm">Schedule Meeting</span>
            </button>
          </div>
        </div>

        {/* Quick Date Navigation */}
        <div className="flex gap-2 mt-6">
          {['Today', 'This Week', 'This Month', 'Quarter'].map((item) => (
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
            onClick={stat.label === 'Active Projects' ? handleViewProjects :
                     stat.label === 'Pending Tasks' ? handleViewTasks : undefined}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-800">
                  {stat.value}
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

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaProjectDiagram className="w-5 h-5 text-teal-600" />
                Active Projects
              </h2>
              <button
                onClick={handleViewProjects}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                View All <FaAngleRight />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="py-4 px-6 text-left">Project</th>
                    <th className="py-4 px-6 text-left">Lead</th>
                    <th className="py-4 px-6 text-left">Team</th>
                    <th className="py-4 px-6 text-left">Progress</th>
                    <th className="py-4 px-6 text-left">Deadline</th>
                    <th className="py-4 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-teal-50/30 border-b last:border-b-0">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-800">{project.name}</p>
                          <p className="text-xs text-gray-500">{project.department}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{project.lead}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                          {project.team} members
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{project.deadline}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-teal-600" />
                Team Members
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={handleViewTeam}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {teamMembers.length > 0 ? (
                teamMembers
                  .filter(member =>
                    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((member) => (
                    <div key={member.id} className="p-4 hover:bg-teal-50/30">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800">{member.name}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{member.role}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">{member.department}</span>
                            <span className="text-xs text-gray-500">{member.tasksCompleted} tasks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No team members found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaChartLine className="w-5 h-5 text-purple-600" />
                Performance Metrics
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.id} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 bg-${metric.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                    </div>
                    <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
                    <span className={`text-xs text-${metric.color}-600 font-medium mt-1 block`}>
                      {metric.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaCalendarCheck className="w-5 h-5 text-teal-600" />
                Upcoming Meetings
              </h2>
              <button
                onClick={handleViewMeetings}
                className="text-teal-600 hover:text-teal-700"
              >
                <FaAngleRight />
              </button>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 hover:bg-teal-50/30">
                  <h3 className="font-medium text-gray-800 text-sm">{meeting.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <FaRegClock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">{meeting.room}</span>
                    <span className="text-xs text-gray-500">{meeting.attendees} attendees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaClipboardList className="w-5 h-5 text-amber-600" />
                Recent Activities
              </h2>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-3 hover:bg-amber-50/30">
                  <p className="text-sm">
                    <span className="font-medium text-gray-800">{activity.user}</span>
                    <span className="text-gray-600"> {activity.action} </span>
                    <span className="font-medium text-gray-800">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bugs Tracker */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaBug className="w-4 h-4 text-red-500" />
            Issues & Bugs
          </h3>
          <div className="space-y-3">
            {bugsList.map((bug) => (
              <div key={bug.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{bug.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{bug.project} • {bug.assignee}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(bug.severity)}`}>
                    {bug.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaServer className="w-4 h-4 text-teal-600" />
            Resource Allocation
          </h3>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{resource.name}</span>
                  <span className="font-medium">
                    {resource.allocated}/{resource.total} {resource.unit || ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      resource.status === 'optimal' ? 'bg-teal-600' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${(resource.allocated / resource.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
                    <p className="text-teal-100">{selectedIntern.role} • {selectedIntern.department}</p>
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
                  <span className="text-sm text-gray-600">{selectedIntern.email || 'email@example.com'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaPhone className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-600">+1 234 567 890</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-teal-50 rounded-xl">
                  <p className="text-2xl font-bold text-teal-600">{selectedIntern.tasksCompleted || 0}</p>
                  <p className="text-xs text-gray-600">Tasks Done</p>
                </div>
                <div className="text-center p-3 bg-cyan-50 rounded-xl">
                  <p className="text-2xl font-bold text-cyan-600">4.8</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-gray-600">Projects</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                  Assign Task
                </button>
                <button
                  onClick={() => {
                    setSelectedIntern(null);
                    navigate(`/dashboard/Execution/team/${selectedIntern.id}`);
                  }}
                  className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
