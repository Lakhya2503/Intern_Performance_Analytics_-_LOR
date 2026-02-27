// import React, { useState, useEffect } from 'react';
// import {
//   FaSearch,
//   FaFilter,
//   FaEye,
//   FaEnvelope,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaFileAlt,
//   FaDownload,
//   FaUpload,
//   FaSpinner,
//   FaUserGraduate,
//   FaFilePdf,
//   FaPaperPlane,
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaCloudUploadAlt,
//   FaFileWord,
//   FaFileExcel,
//   FaFileCsv,
//   FaTimes,
//   FaCheckDouble,
//   FaExclamationTriangle,
//   FaRocket,
//   FaMagic,
//   FaBolt,
//   FaShieldAlt,
//   FaHistory,
//   FaUndo,
//   FaRedo,
//   FaPrint,
//   FaShare,
//   FaCopy,
//   FaRegFilePdf,
//   FaRegEnvelope,
//   FaRegCheckCircle,
//   FaRegClock,
//   FaRegFileAlt,
//   FaUserCheck,
//   FaUserClock,
//   FaUserTimes
// } from 'react-icons/fa';
// import { MdPendingActions, MdOutlineEmail, MdOutlineFileDownload } from 'react-icons/md';
// import { HiOutlineSparkles, HiDocumentText } from 'react-icons/hi';
// import { BiSupport } from 'react-icons/bi';
// import { BsFileEarmarkPdf, BsFileEarmarkWord, BsFileEarmarkExcel } from 'react-icons/bs';
// import {
//   uploadLorTemplate,
//   generateLorAndSend,
//   internsWithLor,
//   rejectedInternForLor,
//   updateAndSendLor
// } from '../../../api';
// import { requestHandler } from '../../../utils';

// function LORRequest() {
//   // State Management
//   const [interns, setInterns] = useState([]);
//   const [rejectedInterns, setRejectedInterns] = useState([]);
//   const [selectedIntern, setSelectedIntern] = useState(null);

//   // UI State
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Modal State
//   const [showGenerateModal, setShowGenerateModal] = useState(false);
//   const [showTemplateModal, setShowTemplateModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [showRejectedModal, setShowRejectedModal] = useState(false);

//   // Form State
//   const [templateFile, setTemplateFile] = useState(null);
//   const [lorFormData, setLorFormData] = useState({
//     recipientName: '',
//     recipientEmail: '',
//     recipientDesignation: '',
//     recipientOrganization: '',
//     customMessage: '',
//     includeScore: true,
//     includeProjects: true,
//     includeSkills: true
//   });

//   // Filter and Search State
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   // Animation states
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [focusedField, setFocusedField] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     await Promise.all([
//       fetchInternsWithLOR(),
//       fetchRejectedInterns()
//     ]);
//   };

//   // Fetch interns with LOR
//   const fetchInternsWithLOR = async () => {
//     await requestHandler(
//       async () => {
//         const response = await internsWithLor();
//         return response;
//       },
//       setLoading,
//       (res) => {
//         setInterns(res.data || []);
//         setError(null);
//       },
//       (err) => {
//         setError(err.message || 'Failed to fetch interns');
//         console.error('Error fetching interns:', err);
//       }
//     );
//   };

//   // Fetch rejected interns for LOR
//   const fetchRejectedInterns = async () => {
//     await requestHandler(
//       async () => {
//         const response = await rejectedInternForLor();
//         return response;
//       },
//       null,
//       (res) => {
//         setRejectedInterns(res.data || []);
//       },
//       (err) => {
//         console.error('Error fetching rejected interns:', err);
//       }
//     );
//   };

//   // Handle template upload
//   const handleTemplateUpload = async () => {
//     if (!templateFile) {
//       alert('Please select a template file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('template', templateFile);

//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 90) {
//           clearInterval(interval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 200);

//     await requestHandler(
//       async () => {
//         const response = await uploadLorTemplate(formData);
//         return response;
//       },
//       setActionLoading,
//       (res) => {
//         clearInterval(interval);
//         setUploadProgress(100);
//         setTimeout(() => {
//           alert('✨ Template uploaded successfully!');
//           setShowTemplateModal(false);
//           setTemplateFile(null);
//           setUploadProgress(0);
//         }, 500);
//       },
//       (err) => {
//         clearInterval(interval);
//         setUploadProgress(0);
//         alert('Failed to upload template: ' + err.message);
//       }
//     );
//   };

//   // Handle generate and send LOR
//   const handleGenerateAndSend = async () => {
//     if (!selectedIntern) return;

//     const internId = selectedIntern.id || selectedIntern._id;

//     const payload = {
//       ...lorFormData,
//       internId: internId,
//       generatedAt: new Date().toISOString()
//     };

//     await requestHandler(
//       async () => {
//         const response = await generateLorAndSend(internId, payload);
//         return response;
//       },
//       setActionLoading,
//       (res) => {
//         alert('✨ LOR generated and sent successfully!');
//         setShowGenerateModal(false);
//         resetForm();
//         fetchAllData();
//       },
//       (err) => {
//         alert('Failed to generate LOR: ' + err.message);
//       }
//     );
//   };

//   // Handle update and send LOR
//   const handleUpdateAndSend = async (internLorId) => {
//     await requestHandler(
//       async () => {
//         const response = await updateAndSendLor(internLorId);
//         return response;
//       },
//       setActionLoading,
//       (res) => {
//         alert('✨ LOR updated and sent successfully!');
//         fetchAllData();
//       },
//       (err) => {
//         alert('Failed to update LOR: ' + err.message);
//       }
//     );
//   };

//   // Reset form
//   const resetForm = () => {
//     setLorFormData({
//       recipientName: '',
//       recipientEmail: '',
//       recipientDesignation: '',
//       recipientOrganization: '',
//       customMessage: '',
//       includeScore: true,
//       includeProjects: true,
//       includeSkills: true
//     });
//     setSelectedIntern(null);
//   };

//   // Open generate modal
//   const openGenerateModal = (intern) => {
//     setSelectedIntern(intern);
//     setLorFormData(prev => ({
//       ...prev,
//       recipientName: intern.name || '',
//       recipientEmail: intern.email || ''
//     }));
//     setShowGenerateModal(true);
//   };

//   // Filter and sort interns
//   const filteredInterns = interns
//     .filter(intern => {
//       const matchesSearch = searchTerm === '' ||
//         intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         intern.department?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesStatus = selectedStatus === 'All' ||
//         (selectedStatus === 'Generated' && intern.lorGenerated) ||
//         (selectedStatus === 'Pending' && !intern.lorGenerated);

//       return matchesSearch && matchesStatus;
//     })
//     .sort((a, b) => {
//       if (sortConfig.key) {
//         const aValue = a[sortConfig.key];
//         const bValue = b[sortConfig.key];
//         if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//         if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });

//   // Pagination
//   const totalPages = Math.ceil(filteredInterns.length / itemsPerPage);
//   const paginatedInterns = filteredInterns.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Statistics
//   const stats = {
//     total: interns.length,
//     generated: interns.filter(i => i.lorGenerated).length,
//     pending: interns.filter(i => !i.lorGenerated).length,
//     rejected: rejectedInterns.length
//   };

//   const handleSort = (key) => {
//     setSortConfig({
//       key,
//       direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
//     });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return <FaSort className="w-3 h-3 text-gray-400" />;
//     return sortConfig.direction === 'asc' ?
//       <FaSortUp className="w-3 h-3 text-indigo-600" /> :
//       <FaSortDown className="w-3 h-3 text-indigo-600" />;
//   };

//   const getStatusBadge = (intern) => {
//     if (intern.lorGenerated) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
//           <FaCheckCircle className="w-3 h-3" />
//           LOR Generated
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
//         <FaClock className="w-3 h-3" />
//         Pending
//       </span>
//     );
//   };

//   // Form field component
//   const FormField = ({ icon: Icon, label, name, type = 'text', placeholder, options = null, required = false }) => {
//     const isFocused = focusedField === name;
//     const value = lorFormData[name];

//     return (
//       <div className="space-y-1.5">
//         <label className="block text-sm font-medium text-gray-700 transition-colors duration-200">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <div className="relative">
//           <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
//             isFocused ? 'text-indigo-600 scale-110' : 'text-gray-400'
//           }`}>
//             <Icon className="w-4 h-4" />
//           </div>

//           {options ? (
//             <select
//               name={name}
//               value={value}
//               onChange={(e) => setLorFormData({ ...lorFormData, [name]: e.target.value })}
//               onFocus={() => setFocusedField(name)}
//               onBlur={() => setFocusedField(null)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm transition-all duration-300 outline-none hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//             >
//               {options.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           ) : type === 'checkbox' ? (
//             <div className="flex items-center gap-2 pl-10">
//               <input
//                 type="checkbox"
//                 name={name}
//                 checked={value}
//                 onChange={(e) => setLorFormData({ ...lorFormData, [name]: e.target.checked })}
//                 onFocus={() => setFocusedField(name)}
//                 onBlur={() => setFocusedField(null)}
//                 className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//               />
//               <span className="text-sm text-gray-600">Include in LOR</span>
//             </div>
//           ) : (
//             <input
//               type={type}
//               name={name}
//               value={value}
//               onChange={(e) => setLorFormData({ ...lorFormData, [name]: e.target.value })}
//               onFocus={() => setFocusedField(name)}
//               onBlur={() => setFocusedField(null)}
//               placeholder={placeholder}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm transition-all duration-300 outline-none hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//             />
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading && interns.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//             <FaFileAlt className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           </div>
//           <p className="text-gray-600 mt-4 font-medium">Loading LOR requests...</p>
//           <p className="text-gray-400 text-sm">Please wait a moment</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Stats */}
//       <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//           <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
//         </div>

//         <div className="relative">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center gap-3">
//                 LOR Requests
//                 <span className="bg-white/20 backdrop-blur-sm text-white text-lg font-normal px-4 py-1 rounded-full border border-white/30">
//                   {filteredInterns.length} Total
//                 </span>
//               </h1>
//               <p className="text-indigo-100 mt-2 flex items-center gap-2">
//                 <FaRocket className="w-4 h-4" />
//                 Generate and manage Letter of Recommendations for interns
//               </p>
//             </div>
//             <div className="flex gap-3 mt-4 md:mt-0">
//               {/* Template Upload Button */}
//               <button
//                 onClick={() => setShowTemplateModal(true)}
//                 onMouseEnter={() => setHoveredItem('template')}
//                 onMouseLeave={() => setHoveredItem(null)}
//                 className="relative group"
//               >
//                 <div className={`absolute inset-0 bg-white rounded-xl blur-lg transition-all duration-300 ${
//                   hoveredItem === 'template' ? 'opacity-40 scale-110' : 'opacity-0'
//                 }`}></div>
//                 <div className={`relative flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl transition-all duration-300 transform ${
//                   hoveredItem === 'template' ? 'scale-105 bg-white/30' : ''
//                 }`}>
//                   {hoveredItem === 'template' ? (
//                     <FaCloudUploadAlt className="w-5 h-5 animate-bounce" />
//                   ) : (
//                     <FaCloudUploadAlt className="w-4 h-4" />
//                   )}
//                   <span className="text-sm font-semibold">Upload Template</span>
//                 </div>
//               </button>

//               {/* Rejected Interns Button */}
//               <button
//                 onClick={() => setShowRejectedModal(true)}
//                 onMouseEnter={() => setHoveredItem('rejected')}
//                 onMouseLeave={() => setHoveredItem(null)}
//                 className="relative group"
//               >
//                 <div className={`absolute inset-0 bg-white rounded-xl blur-lg transition-all duration-300 ${
//                   hoveredItem === 'rejected' ? 'opacity-40 scale-110' : 'opacity-0'
//                 }`}></div>
//                 <div className={`relative flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl transition-all duration-300 transform ${
//                   hoveredItem === 'rejected' ? 'scale-105 bg-white/30' : ''
//                 }`}>
//                   {hoveredItem === 'rejected' ? (
//                     <FaExclamationTriangle className="w-5 h-5 animate-bounce" />
//                   ) : (
//                     <FaExclamationTriangle className="w-4 h-4" />
//                   )}
//                   <span className="text-sm font-semibold">Rejected</span>
//                   {stats.rejected > 0 && (
//                     <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
//                       {stats.rejected}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//             {[
//               { label: 'Total Interns', value: stats.total, icon: FaUserGraduate, color: 'white' },
//               { label: 'LOR Generated', value: stats.generated, icon: FaCheckCircle, color: 'text-green-200' },
//               { label: 'Pending', value: stats.pending, icon: FaClock, color: 'text-yellow-200' },
//               { label: 'Rejected', value: stats.rejected, icon: FaTimesCircle, color: 'text-red-200' }
//             ].map((stat, index) => {
//               const Icon = stat.icon;
//               return (
//                 <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
//                   <div className="flex items-center justify-between">
//                     <p className="text-indigo-100 text-xs">{stat.label}</p>
//                     <Icon className={`w-4 h-4 ${stat.color}`} />
//                   </div>
//                   <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
//             <div className="relative flex-1 md:flex-initial md:w-80 group">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-indigo-500 transition-colors" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or department..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all"
//               />
//             </div>
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 bg-white cursor-pointer hover:border-indigo-300 transition-all"
//             >
//               <option value="All">All Status</option>
//               <option value="Generated">LOR Generated</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </div>

//           {/* Quick Actions */}
//           <div className="flex items-center gap-2">
//             <button className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all text-gray-600 hover:text-indigo-600">
//               <FaPrint className="w-4 h-4" />
//             </button>
//             <button className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all text-gray-600 hover:text-indigo-600">
//               <FaDownload className="w-4 h-4" />
//             </button>
//             <button className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all text-gray-600 hover:text-indigo-600">
//               <FaHistory className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Interns List */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
//                 <th className="py-4 px-6 text-left">
//                   <button
//                     onClick={() => handleSort('name')}
//                     className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600"
//                   >
//                     Intern {getSortIcon('name')}
//                   </button>
//                 </th>
//                 <th className="py-4 px-6 text-left">
//                   <button
//                     onClick={() => handleSort('department')}
//                     className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600"
//                   >
//                     Department {getSortIcon('department')}
//                   </button>
//                 </th>
//                 <th className="py-4 px-6 text-left">
//                   <button
//                     onClick={() => handleSort('batch')}
//                     className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600"
//                   >
//                     Batch {getSortIcon('batch')}
//                   </button>
//                 </th>
//                 <th className="py-4 px-6 text-left">LOR Status</th>
//                 <th className="py-4 px-6 text-left">Generated Date</th>
//                 <th className="py-4 px-6 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedInterns.map((intern) => (
//                 <tr
//                   key={intern.id || intern._id}
//                   className="hover:bg-indigo-50/30 border-b last:border-b-0 transition-all duration-200 group"
//                   onMouseEnter={() => setHoveredItem(intern.id)}
//                   onMouseLeave={() => setHoveredItem(null)}
//                 >
//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold transition-all duration-300 ${
//                         hoveredItem === intern.id ? 'scale-110 rotate-3' : ''
//                       }`}>
//                         {intern.name?.charAt(0) || '?'}
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">{intern.name}</p>
//                         <p className="text-xs text-gray-500">{intern.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
//                       {intern.department || 'N/A'}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6 text-gray-600">{intern.batch || 'N/A'}</td>
//                   <td className="py-4 px-6">{getStatusBadge(intern)}</td>
//                   <td className="py-4 px-6 text-gray-600">
//                     {intern.lorGenerated ? intern.lorGeneratedDate || 'Today' : '-'}
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-2">
//                       {!intern.lorGenerated ? (
//                         <button
//                           onClick={() => openGenerateModal(intern)}
//                           className="p-2 hover:bg-indigo-100 rounded-xl transition-all duration-300 group"
//                           title="Generate LOR"
//                         >
//                           <FaMagic className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
//                         </button>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => setSelectedIntern(intern)}
//                             className="p-2 hover:bg-green-100 rounded-xl transition-all duration-300"
//                             title="View LOR"
//                           >
//                             <FaEye className="w-4 h-4 text-green-600" />
//                           </button>
//                           <button
//                             onClick={() => handleUpdateAndSend(intern.lorId)}
//                             className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-300"
//                             title="Resend LOR"
//                           >
//                             <FaPaperPlane className="w-4 h-4 text-blue-600" />
//                           </button>
//                           <button
//                             className="p-2 hover:bg-purple-100 rounded-xl transition-all duration-300"
//                             title="Download LOR"
//                           >
//                             <FaDownload className="w-4 h-4 text-purple-600" />
//                           </button>
//                         </>
//                       )}
//                       <button
//                         className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
//                         title="Send Email"
//                       >
//                         <FaEnvelope className="w-4 h-4 text-gray-600" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* No Results */}
//         {filteredInterns.length === 0 && (
//           <div className="p-12 text-center">
//             <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
//               <FaFileAlt className="w-8 h-8 text-indigo-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">No LOR requests found</h3>
//             <p className="text-gray-500">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredInterns.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-600">
//               Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInterns.length)} of {filteredInterns.length} interns
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`p-2 rounded-xl transition-all duration-300 ${
//                   currentPage === 1
//                     ? 'text-gray-300 cursor-not-allowed'
//                     : 'hover:bg-indigo-50 text-indigo-600 hover:scale-110'
//                 }`}
//               >
//                 <FaChevronLeft className="w-4 h-4" />
//               </button>
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-8 h-8 rounded-xl text-sm font-medium transition-all duration-300 ${
//                     currentPage === i + 1
//                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-110'
//                       : 'hover:bg-indigo-50 text-gray-600 hover:scale-105'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className={`p-2 rounded-xl transition-all duration-300 ${
//                   currentPage === totalPages
//                     ? 'text-gray-300 cursor-not-allowed'
//                     : 'hover:bg-indigo-50 text-indigo-600 hover:scale-110'
//                 }`}
//               >
//                 <FaChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Generate LOR Modal */}
//       {showGenerateModal && selectedIntern && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-slideUp">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-t-2xl sticky top-0 z-10">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
//                     <FaMagic className="w-8 h-8 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">Generate LOR</h2>
//                     <p className="text-indigo-100 text-sm">For: {selectedIntern.name}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowGenerateModal(false);
//                     resetForm();
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 group"
//                 >
//                   <FaTimes className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 space-y-5">
//               {/* Intern Info Card */}
//               <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
//                     {selectedIntern.name?.charAt(0)}
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-800">{selectedIntern.name}</h4>
//                     <p className="text-sm text-gray-600">{selectedIntern.email}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium text-indigo-600">{selectedIntern.department}</p>
//                     <p className="text-xs text-gray-500">Batch: {selectedIntern.batch}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Recipient Details */}
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   icon={FaUserGraduate}
//                   label="Recipient Name"
//                   name="recipientName"
//                   placeholder="Dr. John Smith"
//                   required
//                 />
//                 <FormField
//                   icon={FaEnvelope}
//                   label="Recipient Email"
//                   name="recipientEmail"
//                   type="email"
//                   placeholder="john@university.edu"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   icon={BiSupport}
//                   label="Designation"
//                   name="recipientDesignation"
//                   placeholder="Professor"
//                 />
//                 <FormField
//                   icon={HiDocumentText}
//                   label="Organization"
//                   name="recipientOrganization"
//                   placeholder="University Name"
//                 />
//               </div>

//               <FormField
//                 icon={FaFileAlt}
//                 label="Custom Message"
//                 name="customMessage"
//                 type="text"
//                 placeholder="Add a personal message (optional)"
//               />

//               {/* Options */}
//               <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Include in LOR:</h4>
//                 <div className="grid grid-cols-3 gap-3">
//                   <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
//                     <input
//                       type="checkbox"
//                       checked={lorFormData.includeScore}
//                       onChange={(e) => setLorFormData({ ...lorFormData, includeScore: e.target.checked })}
//                       className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-700">Score</span>
//                   </label>
//                   <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
//                     <input
//                       type="checkbox"
//                       checked={lorFormData.includeProjects}
//                       onChange={(e) => setLorFormData({ ...lorFormData, includeProjects: e.target.checked })}
//                       className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-700">Projects</span>
//                   </label>
//                   <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
//                     <input
//                       type="checkbox"
//                       checked={lorFormData.includeSkills}
//                       onChange={(e) => setLorFormData({ ...lorFormData, includeSkills: e.target.checked })}
//                       className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-700">Skills</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Preview Button */}
//               <button
//                 onClick={() => setShowPreviewModal(true)}
//                 className="w-full p-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
//               >
//                 <FaEye className="w-4 h-4" />
//                 Preview LOR
//               </button>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleGenerateAndSend}
//                   disabled={actionLoading}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
//                 >
//                   {actionLoading ? (
//                     <>
//                       <FaSpinner className="w-5 h-5 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <FaMagic className="w-4 h-4 group-hover:rotate-12 transition-transform" />
//                       Generate & Send LOR
//                       <FaPaperPlane className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowGenerateModal(false);
//                     resetForm();
//                   }}
//                   className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-white hover:border-indigo-300 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Template Upload Modal */}
//       {showTemplateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                     <FaCloudUploadAlt className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-white">Upload LOR Template</h3>
//                     <p className="text-blue-100 text-sm">Upload your custom LOR template</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowTemplateModal(false);
//                     setTemplateFile(null);
//                     setUploadProgress(0);
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <FaTimes className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
//                 templateFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
//               }`}>
//                 <div className="relative">
//                   <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${
//                     templateFile ? 'bg-green-100' : 'bg-blue-100'
//                   }`}>
//                     {templateFile ? (
//                       <FaFileWord className="w-10 h-10 text-green-600 animate-bounce" />
//                     ) : (
//                       <FaCloudUploadAlt className="w-10 h-10 text-blue-500" />
//                     )}
//                   </div>

//                   {uploadProgress > 0 && uploadProgress < 100 && (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//                     </div>
//                   )}

//                   <p className="text-sm text-gray-600 mb-2">
//                     {templateFile ? 'File selected:' : 'Drag & drop or click to upload template'}
//                   </p>

//                   {templateFile ? (
//                     <div className="space-y-2">
//                       <p className="text-sm font-medium text-gray-800 bg-green-100 py-2 px-3 rounded-xl">
//                         📄 {templateFile.name}
//                       </p>
//                       {uploadProgress > 0 && (
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
//                             style={{ width: `${uploadProgress}%` }}
//                           ></div>
//                         </div>
//                       )}
//                       <button
//                         onClick={() => setTemplateFile(null)}
//                         className="text-xs text-red-500 hover:text-red-600 transition-colors"
//                       >
//                         Remove file
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <p className="text-xs text-gray-400 mb-4">Supports: Word, PDF, TXT</p>
//                       <input
//                         type="file"
//                         accept=".doc,.docx,.pdf,.txt"
//                         onChange={(e) => setTemplateFile(e.target.files[0])}
//                         className="hidden"
//                         id="templateFile"
//                       />
//                       <label
//                         htmlFor="templateFile"
//                         className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
//                       >
//                         <FaUpload className="w-4 h-4" />
//                         Choose File
//                       </label>
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Tips */}
//               <div className="bg-blue-50 rounded-xl p-4">
//                 <h4 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
//                   <FaShieldAlt className="w-3 h-3" />
//                   Template Tips
//                 </h4>
//                 <ul className="text-xs text-blue-700 space-y-1">
//                   <li>• Use placeholders like &#123;name&#125;, &#123;score&#125;, &#123;projects&#125;</li>
//                   <li>• Keep formatting simple for best results</li>
//                   <li>• Max file size: 10MB</li>
//                   <li>• Supported formats: DOC, DOCX, PDF, TXT</li>
//                 </ul>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleTemplateUpload}
//                   disabled={!templateFile || actionLoading}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {actionLoading ? (
//                     <>
//                       <FaSpinner className="w-5 h-5 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <FaCloudUploadAlt className="w-4 h-4" />
//                       Upload Template
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowTemplateModal(false);
//                     setTemplateFile(null);
//                     setUploadProgress(0);
//                   }}
//                   className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-white hover:border-blue-300 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Rejected Interns Modal */}
//       {showRejectedModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 sticky top-0">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                     <FaExclamationTriangle className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-white">
//                     <h2 className="text-xl font-bold">Rejected Interns</h2>
//                     <p className="text-red-100 text-sm">Interns rejected for LOR generation</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowRejectedModal(false)}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <FaTimes className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {rejectedInterns.length > 0 ? (
//                 <div className="space-y-3">
//                   {rejectedInterns.map((intern) => (
//                     <div
//                       key={intern.id || intern._id}
//                       className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-all"
//                     >
//                       <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
//                         {intern.name?.charAt(0)}
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-800">{intern.name}</h3>
//                         <p className="text-sm text-gray-600">{intern.email}</p>
//                         <p className="text-xs text-gray-500 mt-1">Reason: {intern.rejectionReason || 'Not specified'}</p>
//                       </div>
//                       <div className="text-right">
//                         <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
//                           Rejected
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <FaCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
//                   <p className="text-gray-600">No rejected interns found</p>
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
//               <button
//                 onClick={() => setShowRejectedModal(false)}
//                 className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* LOR Preview Modal */}
//       {showPreviewModal && selectedIntern && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sticky top-0">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                     <FaFilePdf className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-white">
//                     <h2 className="text-xl font-bold">LOR Preview</h2>
//                     <p className="text-gray-300 text-sm">For: {selectedIntern.name}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowPreviewModal(false)}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <FaTimes className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-8">
//               {/* LOR Content */}
//               <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-inner">
//                 <div className="text-center mb-8">
//                   <h1 className="text-2xl font-bold text-gray-800">LETTER OF RECOMMENDATION</h1>
//                   <p className="text-gray-500 mt-2">For {selectedIntern.name}</p>
//                 </div>

//                 <div className="space-y-4 text-gray-700">
//                   <p>To,</p>
//                   <p className="font-medium">{lorFormData.recipientName || 'Recipient Name'}</p>
//                   <p>{lorFormData.recipientDesignation || 'Designation'}</p>
//                   <p>{lorFormData.recipientOrganization || 'Organization'}</p>

//                   <p className="mt-6">Dear {lorFormData.recipientName ? lorFormData.recipientName.split(' ')[0] : 'Sir/Madam'},</p>

//                   <p>
//                     I am pleased to recommend <span className="font-semibold text-indigo-600">{selectedIntern.name}</span> for
//                     their outstanding performance during their internship with us.
//                   </p>

//                   {lorFormData.includeScore && (
//                     <p>
//                       During their tenure, they demonstrated exceptional skills and achieved a
//                       remarkable score of <span className="font-semibold text-green-600">{selectedIntern.score}%</span>.
//                     </p>
//                   )}

//                   {lorFormData.includeProjects && (
//                     <p>
//                       They successfully completed multiple projects showing great initiative and
//                       problem-solving abilities.
//                     </p>
//                   )}

//                   {lorFormData.includeSkills && (
//                     <p>
//                       Their technical skills, particularly in {selectedIntern.department || 'their field'},
//                       were impressive and they consistently delivered high-quality work.
//                     </p>
//                   )}

//                   {lorFormData.customMessage && (
//                     <p className="italic border-l-4 border-indigo-300 pl-4">
//                       "{lorFormData.customMessage}"
//                     </p>
//                   )}

//                   <p>
//                     I am confident that {selectedIntern.name} will excel in any future endeavors
//                     and highly recommend them for any opportunity they pursue.
//                   </p>

//                   <div className="mt-8">
//                     <p>Sincerely,</p>
//                     <p className="font-semibold mt-4">Mentor Name</p>
//                     <p className="text-sm text-gray-500">Mentor</p>
//                     <p className="text-sm text-gray-500">Organization Name</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowPreviewModal(false)}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
//                 >
//                   Close Preview
//                 </button>
//                 <button className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-white hover:border-indigo-300 transition-all flex items-center justify-center gap-2">
//                   <FaDownload className="w-4 h-4" />
//                   Download PDF
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add these animations to your global CSS */}
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

// export default LORRequest;
