// import { useEffect, useState } from "react";
// import { BsGraphUpArrow } from "react-icons/bs";
// import {
//   FaAngleRight,
//   FaArrowDown,
//   FaArrowUp,
//   FaDatabase,
//   FaEdit,
//   FaEnvelope,
//   FaFileAlt,
//   FaGithub,
//   FaLinkedin,
//   FaPhone,
//   FaRocket,
//   FaSearch,
//   FaSpinner,
//   FaStar,
//   FaTasks,
//   FaTimes,
//   FaTrophy,
//   FaUpload,
//   FaUserEdit,
//   FaUserGraduate,
//   FaUserPlus,
//   FaUsers,
//   FaCheckCircle,
//   FaClock,
//   FaExclamationTriangle,
//   FaChartLine,
//   FaMedal,
//   FaAward,
//   FaCertificate,
//   FaRegBell,
//   FaRegEnvelope,
//   FaRegCalendarAlt,
//   FaRegClock,
//   FaRegStar,
//   FaRegChartBar
// } from "react-icons/fa";
// import { MdOutlineRateReview, MdOutlineDashboard, MdOutlineAnalytics, MdOutlineAssignment, MdOutlineSchool } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../Context/AuthContext";
// import {
//   getAllInterns,
//   scoreRankingInterns
// } from "../../../api/index";
// import { requestHandler } from "../../../utils/index";

// export default function ExecutionHomeDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // State Management
//   const [loading, setLoading] = useState(false);
//   const [interns, setInterns] = useState([]);
//   const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
//   const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedIntern, setSelectedIntern] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [notifications, setNotifications] = useState([
//     { id: 1, message: 'New LOR request from John Doe', time: '5 min ago', read: false, type: 'lor' },
//     { id: 2, message: 'Task review pending for Alice', time: '1 hour ago', read: false, type: 'task' },
//     { id: 3, message: 'Weekly report ready', time: '2 hours ago', read: true, type: 'report' },
//   ]);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const [stats, setStats] = useState({
//     totalInterns: 0,
//     pendingInterns: 0,
//     approvedInterns: 0,
//     rejectedInterns: 0,
//     pendingLORRequests: 0,
//     averageScore: 0,
//     activeProjects: 0,
//     completionRate: 0
//   });

//   // Fetch dashboard data
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);

//     // Fetch all interns
//     await requestHandler(
//       async () => getAllInterns(),
//       setLoading,
//       (response) => {
//         const internsData = response?.data || [];
//         setInterns(Array.isArray(internsData) ? internsData : []);

//         const pending = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "pending").length : 0;
//         const approved = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "Approve").length : 0;
//         const rejected = Array.isArray(internsData) ? internsData.filter(intern => intern?.status === "Rejected").length : 0;
//         const activeProjects = Array.isArray(internsData) ? new Set(internsData.map(i => i.project)).size : 0;

//         setStats(prev => ({
//           ...prev,
//           totalInterns: Array.isArray(internsData) ? internsData.length : 0,
//           pendingInterns: pending,
//           approvedInterns: approved,
//           rejectedInterns: rejected,
//           activeProjects
//         }));
//       },
//       (error) => {
//         console.error('Error fetching interns:', error);
//         setInterns([]);
//       }
//     );

//     // Fetch rankings
//     await requestHandler(
//       async () => scoreRankingInterns(),
//       setLoading,
//       (response) => {
//         const rankings = response?.data || { gold: [], silver: [], bronze: [] };
//         setRankingData({
//           gold: Array.isArray(rankings.gold) ? rankings.gold : [],
//           silver: Array.isArray(rankings.silver) ? rankings.silver : [],
//           bronze: Array.isArray(rankings.bronze) ? rankings.bronze : []
//         });

//         const allRankedInterns = [
//           ...(Array.isArray(rankings.gold) ? rankings.gold : []),
//           ...(Array.isArray(rankings.silver) ? rankings.silver : []),
//           ...(Array.isArray(rankings.bronze) ? rankings.bronze : [])
//         ];

//         const scores = allRankedInterns.map(item => item?.score || 0);
//         const avgScore = scores.length > 0
//           ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length
//           : 0;

//         const completedTasks = allRankedInterns.filter(i => i.completionRate > 80).length;
//         const completionRate = allRankedInterns.length > 0
//           ? (completedTasks / allRankedInterns.length) * 100
//           : 0;

//         setStats(prev => ({
//           ...prev,
//           averageScore: avgScore.toFixed(1),
//           completionRate: Math.round(completionRate)
//         }));
//       },
//       (error) => {
//         console.error('Error fetching rankings:', error);
//         setRankingData({ gold: [], silver: [], bronze: [] });
//       }
//     );

//     // Calculate pending LOR requests from interns data
//     const pendingLORCount = Array.isArray(interns)
//       ? interns.filter(intern => intern?.lorRequested === true || intern?.lorStatus === 'pending').length
//       : 0;

//     setStats(prev => ({
//       ...prev,
//       pendingLORRequests: pendingLORCount
//     }));

//     setLoading(false);
//   };

//   // Navigation handlers
//   const handleViewAllInterns = () => navigate('/dashboard/ExecutionTeam/interns');
//   const handleViewAnalytics = () => navigate('/dashboard/ExecutionTeam/analytics');
//   const handleViewTasks = () => navigate('/dashboard/ExecutionTeam/task');
//   const handleViewLORRequests = () => navigate('/dashboard/ExecutionTeam/lor-requests');
//   const handleAddIntern = () => {
//     navigate('/dashboard/ExecutionTeam/interns', { state: { action: 'add' } });
//   };

//   const handleUpdateIntern = (intern) => {
//     navigate('/dashboard/ExecutionTeam/interns', {
//       state: {
//         action: 'edit',
//         internId: intern._id || intern.id
//       }
//     });
//   };

//   const handleGenerateLOR = (intern) => {
//     navigate('/dashboard/ExecutionTeam/lor-requests', {
//       state: {
//         action: 'generate',
//         internId: intern._id || intern.id,
//         internName: intern.name
//       }
//     });
//   };

//   // Safe array length
//   const safeArrayLength = (arr) => Array.isArray(arr) ? arr.length : 0;

//   // Get all ranked interns
//   const getAllRankedInterns = () => [
//     ...(rankingData.gold || []),
//     ...(rankingData.silver || []),
//     ...(rankingData.bronze || [])
//   ];

//   // Enhanced recent interns list with better styling data
//   const recentInterns = Array.isArray(interns)
//     ? interns.slice(0, 6).map((intern, index) => ({
//         ...intern,
//         id: intern?._id || intern?.id || `intern-${index}`,
//         lastActive: ['Just now', '2 hours ago', 'Yesterday', '3 days ago'][index % 4],
//         progress: Math.floor(Math.random() * 30) + 70,
//         tasksCompleted: Math.floor(Math.random() * 15) + 10,
//         totalTasks: 25,
//         avatar: `https://ui-avatars.com/api/?name=${intern?.name?.replace(' ', '+') || 'Intern'}&background=0D9488&color=fff&size=128&bold=true`,
//         email: intern?.email || `${intern?.name?.toLowerCase().replace(' ', '.')}@example.com`,
//         project: ['E-commerce Platform', 'Dashboard UI', 'API Gateway', 'Mobile App', 'Cloud Service', 'AI Integration'][index % 6],
//         github: `https://github.com/${intern?.name?.toLowerCase().replace(' ', '')}`,
//         linkedin: `https://linkedin.com/in/${intern?.name?.toLowerCase().replace(' ', '')}`,
//         status: ['active', 'active', 'active', 'idle', 'active', 'busy'][index % 6],
//         score: Math.floor(Math.random() * 30) + 70,
//         skills: ['React', 'Node.js', 'Python', 'UI/UX', 'DevOps', 'Cloud'][index % 6].split(' '),
//         department: ['Engineering', 'Design', 'Product', 'Marketing', 'Data Science', 'DevOps'][index % 6],
//         course: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc'][index % 6]
//       }))
//     : [];

//   // Enhanced quick stats with richer colors and icons
//   const quickStats = [
//     {
//       id: 'stat-total-interns',
//       label: 'Total Interns',
//       value: stats.totalInterns,
//       icon: FaUserGraduate,
//       gradient: 'from-teal-500 to-emerald-500',
//       bgGradient: 'from-teal-50 to-emerald-50',
//       iconBg: 'bg-white/20',
//       borderColor: 'border-teal-200',
//       textColor: 'text-teal-600',
//       change: '+12%',
//       changeType: 'increase',
//       description: 'Active interns in program'
//     },
//     {
//       id: 'stat-pending-tasks',
//       label: 'Pending Reviews',
//       value: stats.pendingInterns,
//       icon: MdOutlineRateReview,
//       gradient: 'from-amber-500 to-orange-500',
//       bgGradient: 'from-amber-50 to-orange-50',
//       iconBg: 'bg-white/20',
//       borderColor: 'border-amber-200',
//       textColor: 'text-amber-600',
//       change: '+5',
//       changeType: 'increase',
//       description: 'Awaiting your review'
//     },
//     {
//       id: 'stat-avg-score',
//       label: 'Avg. Score',
//       value: stats.averageScore,
//       icon: FaStar,
//       gradient: 'from-purple-500 to-pink-500',
//       bgGradient: 'from-purple-50 to-pink-50',
//       iconBg: 'bg-white/20',
//       borderColor: 'border-purple-200',
//       textColor: 'text-purple-600',
//       change: '+2.5%',
//       changeType: 'increase',
//       suffix: '',
//       description: 'Average performance score'
//     },
//     {
//       id: 'stat-lor-requests',
//       label: 'LOR Requests',
//       value: stats.pendingLORRequests,
//       icon: FaFileAlt,
//       gradient: 'from-emerald-500 to-green-500',
//       bgGradient: 'from-emerald-50 to-green-50',
//       iconBg: 'bg-white/20',
//       borderColor: 'border-emerald-200',
//       textColor: 'text-emerald-600',
//       change: '+3',
//       changeType: 'increase',
//       description: 'Pending letter requests'
//     },
//   ];

//   // Top performers with medal colors
//   const topPerformers = getAllRankedInterns().slice(0, 3).map((intern, idx) => ({
//     ...intern,
//     id: intern?._id || intern?.id || `top-${idx}`,
//     name: intern?.name || 'Intern',
//     department: intern?.department || 'General',
//     score: Math.round(intern?.score || 0),
//     achievement: ['Outstanding Performance', 'Most Improved', 'Best Project'][idx],
//     projectsCompleted: Math.floor(Math.random() * 5) + 3,
//     medalColor: ['from-yellow-400 to-yellow-500', 'from-gray-300 to-gray-400', 'from-amber-600 to-amber-700'][idx]
//   }));

//   const rankingCounts = {
//     gold: safeArrayLength(rankingData.gold),
//     silver: safeArrayLength(rankingData.silver),
//     bronze: safeArrayLength(rankingData.bronze)
//   };

//   // Enhanced quick actions with better colors
//   const quickActions = [
//     {
//       id: 'action-add-intern',
//       label: 'Add Intern',
//       icon: FaUserPlus,
//       gradient: 'from-teal-500 to-cyan-500',
//       hoverGradient: 'from-teal-600 to-cyan-600',
//       lightBg: 'bg-teal-50',
//       iconColor: 'text-teal-600',
//       onClick: handleAddIntern,
//       description: 'Add a new intern to the program',
//       shortcut: '⌘ + N'
//     },
//     {
//       id: 'action-update-intern',
//       label: 'Update Intern',
//       icon: FaEdit,
//       gradient: 'from-blue-500 to-indigo-500',
//       hoverGradient: 'from-blue-600 to-indigo-600',
//       lightBg: 'bg-blue-50',
//       iconColor: 'text-blue-600',
//       onClick: handleViewAllInterns,
//       description: 'Edit intern details and progress',
//       shortcut: '⌘ + U'
//     },
//     {
//       id: 'action-view-tasks',
//       label: 'View Tasks',
//       icon: FaTasks,
//       gradient: 'from-emerald-500 to-green-500',
//       hoverGradient: 'from-emerald-600 to-green-600',
//       lightBg: 'bg-emerald-50',
//       iconColor: 'text-emerald-600',
//       onClick: handleViewTasks,
//       description: 'Manage and review tasks',
//       shortcut: '⌘ + T'
//     },
//     {
//       id: 'action-lor-requests',
//       label: 'LOR Requests',
//       icon: FaFileAlt,
//       gradient: 'from-purple-500 to-pink-500',
//       hoverGradient: 'from-purple-600 to-pink-600',
//       lightBg: 'bg-purple-50',
//       iconColor: 'text-purple-600',
//       onClick: handleViewLORRequests,
//       description: 'Handle letter requests',
//       shortcut: '⌘ + L'
//     },
//   ];

//   const getScoreColor = (score) => {
//     if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
//     if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
//     if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
//     return 'text-gray-600 bg-gray-50 border-gray-200';
//   };

//   const getPriorityColor = (priority) => {
//     switch(priority?.toLowerCase()) {
//       case 'high': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200';
//       case 'medium': return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200';
//       case 'low': return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200';
//       default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'active': return 'bg-gradient-to-r from-green-500 to-emerald-500';
//       case 'idle': return 'bg-gradient-to-r from-amber-500 to-orange-500';
//       case 'busy': return 'bg-gradient-to-r from-red-500 to-pink-500';
//       case 'pending': return 'bg-gradient-to-r from-yellow-500 to-amber-500';
//       default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
//     }
//   };

//   const markNotificationAsRead = (id) => {
//     setNotifications(notifications.map(notif =>
//       notif.id === id ? { ...notif, read: true } : notif
//     ));
//   };

//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'lor': return <FaFileAlt className="w-4 h-4 text-purple-600" />;
//       case 'task': return <FaTasks className="w-4 h-4 text-amber-600" />;
//       case 'report': return <FaChartLine className="w-4 h-4 text-blue-600" />;
//       default: return <FaRegBell className="w-4 h-4 text-gray-600" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
//       {/* Loading Overlay with enhanced animation */}
//       {loading && (
//         <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-pulse">
//           <div className="relative">
//             <FaSpinner className="animate-spin w-5 h-5" />
//             <div className="absolute inset-0 animate-ping opacity-75">
//               <FaSpinner className="w-5 h-5" />
//             </div>
//           </div>
//           <span className="font-medium">Updating dashboard...</span>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Welcome Banner with richer gradients */}
//         <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 shadow-2xl">
//           {/* Animated background patterns */}
//           <div className="absolute inset-0">
//             <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
//             <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
//             <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

//             {/* Grid pattern */}
//             <div className="absolute inset-0 opacity-10"
//                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
//             </div>
//           </div>

//           <div className="relative z-10 p-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
//                     <span className="text-sm font-medium text-white">Executive Dashboard</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {['mon', 'tue', 'wed', 'thu', 'fri'].map((day, i) => (
//                       <div key={day} className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-white' : 'bg-white/40'}`}></div>
//                     ))}
//                   </div>
//                 </div>

//                 <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center gap-3">
//                   Welcome back, {user?.username || 'Execution Team'}!
//                   <span className="text-4xl animate-bounce inline-block">👋</span>
//                 </h1>

//                 <p className="text-teal-100 text-lg flex items-center gap-2">
//                   <FaRocket className="w-5 h-5" />
//                   Here's what's happening with your interns today
//                 </p>
//               </div>

//               <div className="flex gap-3 mt-6 md:mt-0">
//                 <button
//                   onClick={handleViewAnalytics}
//                   className="group flex items-center gap-2 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50"
//                 >
//                   <BsGraphUpArrow className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
//                   <span className="text-white font-medium">Analytics</span>
//                 </button>
//                 <button
//                   onClick={handleAddIntern}
//                   className="group flex items-center gap-2 px-6 py-3 bg-white rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl"
//                 >
//                   <FaUserPlus className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
//                   <span className="text-teal-600 font-medium">Add Intern</span>
//                 </button>
//               </div>
//             </div>

//             {/* Enhanced Ranking Stats with medal colors */}
//             <div className="flex flex-wrap items-center gap-4 mt-8">
//               <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-xl px-4 py-2 backdrop-blur-sm border border-yellow-400/30">
//                 <FaTrophy className="w-5 h-5 text-yellow-300" />
//                 <span className="font-semibold text-white">Gold: {rankingCounts.gold}</span>
//               </div>
//               <div className="flex items-center gap-2 bg-gradient-to-r from-gray-400/30 to-gray-500/30 rounded-xl px-4 py-2 backdrop-blur-sm border border-gray-400/30">
//                 <FaTrophy className="w-5 h-5 text-gray-300" />
//                 <span className="font-semibold text-white">Silver: {rankingCounts.silver}</span>
//               </div>
//               <div className="flex items-center gap-2 bg-gradient-to-r from-amber-700/30 to-amber-800/30 rounded-xl px-4 py-2 backdrop-blur-sm border border-amber-700/30">
//                 <FaTrophy className="w-5 h-5 text-amber-600" />
//                 <span className="font-semibold text-white">Bronze: {rankingCounts.bronze}</span>
//               </div>
//               <div className="flex items-center gap-2 ml-auto">
//                 <select
//                   value={selectedTimeframe}
//                   onChange={(e) => setSelectedTimeframe(e.target.value)}
//                   className="px-4 py-2 bg-white/20 rounded-xl text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 >
//                   <option value="weekly" className="text-gray-900">Weekly</option>
//                   <option value="monthly" className="text-gray-900">Monthly</option>
//                   <option value="quarterly" className="text-gray-900">Quarterly</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Quick Stats Grid with hover effects */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {quickStats.map((stat) => (
//             <div
//               key={stat.id}
//               className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
//               onClick={stat.label === 'LOR Requests' ? handleViewLORRequests :
//                        stat.label === 'Total Interns' ? handleViewAllInterns :
//                        stat.label === 'Pending Reviews' ? handleViewTasks :
//                        stat.label === 'Avg. Score' ? handleViewAnalytics : undefined
//                       }
//             >
//               {/* Background gradient on hover */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

//               {/* Decorative pattern */}
//               <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>

//               <div className="relative p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
//                     <stat.icon className="w-7 h-7 text-white" />
//                   </div>
//                   <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                     stat.changeType === 'increase'
//                       ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
//                       : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700'
//                   }`}>
//                     <span className="flex items-center gap-1">
//                       {stat.change}
//                       {stat.changeType === 'increase' ?
//                         <FaArrowUp className="w-3 h-3" /> :
//                         <FaArrowDown className="w-3 h-3" />
//                       }
//                     </span>
//                   </span>
//                 </div>

//                 <h3 className="text-gray-500 text-sm font-medium mb-1 group-hover:text-gray-700 transition-colors">{stat.label}</h3>

//                 <div className="flex items-end justify-between">
//                   <p className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
//                     {stat.value}{stat.suffix || ''}
//                   </p>
//                   <p className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">{stat.description}</p>
//                 </div>
//               </div>

//               {/* Animated progress bar */}
//               <div className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>
//             </div>
//           ))}
//         </div>

//         {/* Main Dashboard Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Enhanced Recent Interns Table */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//               <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                   <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
//                     <FaUsers className="w-4 h-4 text-white" />
//                   </div>
//                   Recent Interns
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search interns..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
//                     />
//                   </div>
//                   <button
//                     onClick={handleViewAllInterns}
//                     className="flex items-center gap-1 px-3 py-2 text-teal-600 hover:text-teal-700 text-sm font-medium bg-teal-50 rounded-lg hover:bg-teal-100 transition-all group"
//                   >
//                     View All
//                     <FaAngleRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                     <tr>
//                       <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Intern</th>
//                       <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
//                       <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
//                       <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
//                       <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {recentInterns.length > 0 ? (
//                       recentInterns
//                         .filter(intern =>
//                           intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           intern.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           intern.project?.toLowerCase().includes(searchTerm.toLowerCase())
//                         )
//                         .map((intern) => (
//                           <tr
//                             key={intern.id}
//                             className="hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 transition-all duration-300 cursor-pointer group"
//                             onClick={() => setSelectedIntern(intern)}
//                           >
//                             <td className="py-4 px-6">
//                               <div className="flex items-center gap-3">
//                                 <div className="relative">
//                                   <img
//                                     src={intern.avatar}
//                                     alt={intern.name}
//                                     className="w-10 h-10 rounded-xl ring-2 ring-teal-100 group-hover:ring-teal-300 transition-all"
//                                   />
//                                   <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(intern.status)}`}></span>
//                                 </div>
//                                 <div>
//                                   <p className="font-medium text-gray-800 group-hover:text-teal-600 transition-colors">{intern.name}</p>
//                                   <p className="text-xs text-gray-500">{intern.email}</p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="py-4 px-6">
//                               <span className="px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-xs font-medium">
//                                 {intern.department || 'General'}
//                               </span>
//                             </td>
//                             <td className="py-4 px-6">
//                               <p className="text-gray-600 text-sm font-medium">{intern.course}</p>
//                             </td>
//                             <td className="py-4 px-6">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
//                                   <div
//                                     className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-500 relative"
//                                     style={{ width: `${intern.progress}%` }}
//                                   >
//                                     <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
//                                   </div>
//                                 </div>
//                                 <span className="text-xs font-semibold text-gray-600">{intern.progress}%</span>
//                               </div>
//                             </td>
//                             <td className="py-4 px-6">
//                               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 intern.status === 'active' ? 'bg-green-100 text-green-700' :
//                                 intern.status === 'idle' ? 'bg-amber-100 text-amber-700' :
//                                 'bg-red-100 text-red-700'
//                               }`}>
//                                 {intern.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="py-12 text-center">
//                           <div className="flex flex-col items-center gap-3">
//                             <div className="w-20 h-20 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
//                               <FaUsers className="w-10 h-10 text-teal-600" />
//                             </div>
//                             <p className="text-gray-500 font-medium">No interns found</p>
//                             <button
//                               onClick={handleAddIntern}
//                               className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl"
//                             >
//                               Add Your First Intern
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Enhanced Intern Management Cards */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                     <MdOutlineAssignment className="w-4 h-4 text-white" />
//                   </div>
//                   Intern Management
//                 </h3>
//                 <button
//                   onClick={()=>navigate(`/dashboard/ExecutionTeam/interns`)}
//                   className="flex items-center gap-1 px-3 py-2 text-purple-600 hover:text-purple-700 text-sm font-medium bg-purple-50 rounded-lg hover:bg-purple-100 transition-all group"
//                 >
//                   Manage All
//                   <FaAngleRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {/* Add Intern Single */}
//                 <div
//                   className="group relative p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl hover:from-teal-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer border border-teal-100 hover:border-teal-300 hover:shadow-lg transform hover:-translate-y-1"
//                   onClick={()=>navigate(`/dashboard/ExecutionTeam/interns`, { state: { action: 'add' } })}
//                 >
//                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <span className="text-xs bg-teal-600 text-white px-2 py-1 rounded-full">New</span>
//                   </div>
//                   <div className="flex flex-col items-center text-center">
//                     <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
//                       <FaUserPlus className="w-7 h-7 text-white" />
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-1">Add Intern</h4>
//                     <p className="text-xs text-gray-500">Single entry</p>
//                     <div className="mt-2 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//                   </div>
//                 </div>

//                 {/* Add Intern Bulk */}
//                 <div
//                   className="group relative p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 cursor-pointer border border-purple-100 hover:border-purple-300 hover:shadow-lg transform hover:-translate-y-1"
//                   onClick={()=>navigate(`/dashboard/ExecutionTeam/interns`, { state: { action: 'bulk-add' } })}
//                 >
//                   <div className="flex flex-col items-center text-center">
//                     <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
//                       <FaUpload className="w-7 h-7 text-white" />
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-1">Bulk Upload</h4>
//                     <p className="text-xs text-gray-500">CSV/Excel import</p>
//                     <div className="mt-2 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//                   </div>
//                 </div>

//                 {/* Update Intern Single */}
//                 <div
//                   className="group relative p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-1"
//                   onClick={()=>navigate(`/dashboard/ExecutionTeam/interns`, { state: { action: 'edit' } })}
//                 >
//                   <div className="flex flex-col items-center text-center">
//                     <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
//                       <FaUserEdit className="w-7 h-7 text-white" />
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-1">Update Intern</h4>
//                     <p className="text-xs text-gray-500">Single record</p>
//                     <div className="mt-2 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//                   </div>
//                 </div>

//                 {/* Update Intern Bulk */}
//                 <div
//                   className="group relative p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-300 cursor-pointer border border-orange-100 hover:border-orange-300 hover:shadow-lg transform hover:-translate-y-1"
//                   onClick={()=>navigate(`/dashboard/ExecutionTeam/interns`, { state: { action: 'bulk-edit' } })}
//                 >
//                   <div className="flex flex-col items-center text-center">
//                     <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
//                       <FaDatabase className="w-7 h-7 text-white" />
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-1">Bulk Update</h4>
//                     <p className="text-xs text-gray-500">Mass updates</p>
//                     <div className="mt-2 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-8">
//             {/* Enhanced Profile Overview */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="relative">
//                   <div className="w-20 h-20 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
//                     {user?.username?.charAt(0) || 'M'}
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-xl text-gray-800">{user?.username || 'Execution Team'}</h3>
//                   <p className="text-sm text-gray-500 flex items-center gap-1">
//                     <MdOutlineSchool className="w-4 h-4" />
//                     Senior Execution Team
//                   </p>
//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="flex items-center gap-1">
//                       <FaRegStar className="w-4 h-4 text-yellow-500" />
//                       <span className="text-xs text-gray-600">4.9 Rating</span>
//                     </div>
//                     <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
//                     <div className="flex items-center gap-1">
//                       <FaCheckCircle className="w-4 h-4 text-green-500" />
//                       <span className="text-xs text-gray-600">Verified</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick stats */}
//               <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-teal-600">{stats.approvedInterns}</p>
//                   <p className="text-xs text-gray-500">Approved</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-amber-600">{stats.pendingInterns}</p>
//                   <p className="text-xs text-gray-500">Pending</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-blue-600">{stats.activeProjects}</p>
//                   <p className="text-xs text-gray-500">Projects</p>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Top Performers */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                   <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
//                     <FaTrophy className="w-4 h-4 text-white" />
//                   </div>
//                   Top Performers
//                 </h3>
//                 <span className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
//                   This Month
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 {topPerformers.length > 0 ? (
//                   topPerformers.map((intern, index) => (
//                     <div
//                       key={intern.id}
//                       className="group relative flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-teal-200"
//                       onClick={() => setSelectedIntern(intern)}
//                     >
//                       {/* Rank badge */}
//                       <div className={`absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r ${intern.medalColor} rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
//                         {index + 1}
//                       </div>

//                       <div className="relative">
//                         <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
//                           {intern.name?.charAt(0) || 'I'}
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <p className="font-semibold text-gray-800 truncate">{intern.name}</p>
//                         <p className="text-xs text-gray-500">{intern.department}</p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <FaAward className="w-3 h-3 text-yellow-500" />
//                           <p className="text-xs text-teal-600 font-medium truncate">{intern.achievement}</p>
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <div className={`px-2 py-1 rounded-lg text-sm font-bold ${getScoreColor(intern.score)}`}>
//                           {intern.score}%
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">{intern.projectsCompleted} projects</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8">
//                     <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <FaTrophy className="w-8 h-8 text-yellow-600" />
//                     </div>
//                     <p className="text-gray-500 font-medium">No ranking data available</p>
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={handleViewAnalytics}
//                 className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-600 rounded-xl hover:from-teal-100 hover:to-cyan-100 transition-all text-sm font-medium border border-teal-200 hover:border-teal-300"
//               >
//                 View Full Rankings
//               </button>
//             </div>

//             {/* Enhanced Quick Actions */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                   <FaRocket className="w-4 h-4 text-white" />
//                 </div>
//                 Quick Actions
//               </h3>

//               <div className="grid grid-cols-2 gap-3">
//                 {quickActions.map((action) => (
//                   <button
//                     key={action.id}
//                     onClick={action.onClick}
//                     className="group relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-transparent overflow-hidden"
//                     title={action.description}
//                   >
//                     {/* Hover gradient background */}
//                     <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

//                     <div className="relative">
//                       <div className={`w-12 h-12 ${action.lightBg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md`}>
//                         <action.icon className={`w-6 h-6 ${action.iconColor} group-hover:text-white transition-colors duration-300`} />
//                       </div>
//                       <span className={`text-sm font-semibold text-gray-700 group-hover:text-${action.iconColor.replace('text-', '')} transition-colors block`}>
//                         {action.label}
//                       </span>
//                       <span className="text-[10px] text-gray-400 mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
//                         {action.shortcut}
//                       </span>
//                     </div>

//                     {/* Animated corner accent */}
//                     <div className={`absolute bottom-0 right-0 w-0 h-0 bg-gradient-to-r ${action.gradient} group-hover:w-2 group-hover:h-2 transition-all duration-300`}></div>
//                   </button>
//                 ))}
//               </div>

//               {/* Activity summary */}
//               <div className="mt-4 pt-4 border-t border-gray-100">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-500 flex items-center gap-1">
//                     <FaRegClock className="w-4 h-4" />
//                     Last activity
//                   </span>
//                   <span className="text-gray-800 font-medium">2 min ago</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Intern Detail Modal */}
//         {selectedIntern && (
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
//             onClick={() => setSelectedIntern(null)}
//           >
//             <div
//               className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
//               onClick={e => e.stopPropagation()}
//             >
//               {/* Modal Header with gradient */}
//               <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 p-8 sticky top-0">
//                 {/* Decorative patterns */}
//                 <div className="absolute inset-0 opacity-10"
//                      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
//                 </div>

//                 <div className="relative flex items-start justify-between">
//                   <div className="flex items-center gap-6">
//                     <div className="relative">
//                       <img
//                         src={selectedIntern.avatar}
//                         alt={selectedIntern.name}
//                         className="w-24 h-24 rounded-2xl border-4 border-white shadow-2xl"
//                       />
//                       <span className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-4 border-white ${getStatusColor(selectedIntern.status)}`}></span>
//                     </div>
//                     <div className="text-white">
//                       <h2 className="text-3xl font-bold mb-2">{selectedIntern.name}</h2>
//                       <p className="text-teal-100 flex items-center gap-2">
//                         <MdOutlineSchool className="w-4 h-4" />
//                         {selectedIntern.department} • {selectedIntern.project}
//                       </p>
//                       <div className="flex gap-2 mt-3">
//                         <a href={selectedIntern.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all hover:scale-110">
//                           <FaGithub className="w-4 h-4 text-white" />
//                         </a>
//                         <a href={selectedIntern.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all hover:scale-110">
//                           <FaLinkedin className="w-4 h-4 text-white" />
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setSelectedIntern(null)}
//                     className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all hover:scale-110"
//                   >
//                     <FaTimes className="w-5 h-5 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Modal Body */}
//               <div className="p-8 space-y-8">
//                 {/* Contact Info */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
//                     <FaEnvelope className="w-5 h-5 text-teal-600" />
//                     <span className="text-sm text-gray-700 truncate">{selectedIntern.email}</span>
//                   </div>
//                   <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
//                     <FaPhone className="w-5 h-5 text-purple-600" />
//                     <span className="text-sm text-gray-700">{selectedIntern.phone || '+1 234 567 890'}</span>
//                   </div>
//                 </div>

//                 {/* Skills */}
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <FaStar className="w-4 h-4 text-yellow-500" />
//                     Skills & Expertise
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedIntern.skills?.map((skill, idx) => (
//                       <span
//                         key={idx}
//                         className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-xl text-sm font-medium border border-teal-200 hover:from-teal-100 hover:to-cyan-100 transition-all hover:scale-105 cursor-default"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Progress Stats */}
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="text-center p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
//                     <p className="text-3xl font-bold text-teal-600">{selectedIntern.progress}%</p>
//                     <p className="text-xs text-gray-600 mt-1">Overall Progress</p>
//                     <div className="w-full bg-white rounded-full h-2 mt-3">
//                       <div
//                         className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${selectedIntern.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
//                     <p className="text-3xl font-bold text-amber-600">
//                       {Math.floor(selectedIntern.score / 20) || 4}
//                       <span className="text-lg text-amber-400">.5</span>
//                     </p>
//                     <p className="text-xs text-gray-600 mt-1">Performance</p>
//                     <div className="flex justify-center gap-1 mt-2">
//                       {[1,2,3,4,5].map(star => (
//                         <FaStar key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-500' : 'text-gray-300'}`} />
//                       ))}
//                     </div>
//                   </div>
//                   <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//                     <p className="text-3xl font-bold text-blue-600">{selectedIntern.tasksCompleted}</p>
//                     <p className="text-xs text-gray-600 mt-1">Tasks Done</p>
//                     <p className="text-xs text-gray-500 mt-2">of {selectedIntern.totalTasks} total</p>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => handleUpdateIntern(selectedIntern)}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                   >
//                     <FaEdit className="w-4 h-4" />
//                     Update Profile
//                   </button>
//                   <button
//                     onClick={() => handleGenerateLOR(selectedIntern)}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                   >
//                     <FaFileAlt className="w-4 h-4" />
//                     Generate LOR
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add animation styles */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }

//         .animate-slideUp {
//           animation: slideUp 0.4s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }



const ExecutionHomeDashboard = () => {
  return (
    <div>

    </div>
  )
}

export default ExecutionHomeDashboard
