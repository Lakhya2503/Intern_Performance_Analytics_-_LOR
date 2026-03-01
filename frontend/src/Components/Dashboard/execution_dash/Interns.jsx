import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaEye,
  FaStar,
  FaEnvelope,
  FaCalendarAlt,
  FaGraduationCap,
  FaChartLine,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserPlus,
  FaThLarge,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaCloudUploadAlt,
  FaTrophy,
  FaEdit,
  FaFileExcel,
  FaTimes,
  FaUserTie,
  FaScroll,
  FaDownload,
  FaIdCard,
  FaUser,
  FaBriefcase,
  FaChartBar,
  FaPercentage,
  FaTasks,
  FaMedal,
  FaCrown,
  FaRibbon,
  FaAward
} from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import {
  getAllInterns,
  addBulkUploadIntern,
  updateBulkUploadIntern,
  addSingleIntern,
  updateSingleIntern,
  scoreRankingInterns
  // Removed eligibleInternsForLOR
} from '../../../api';
import { requestHandler } from '../../../utils';
import InternCard from '../../cards/InternCard';
import InternForm from '../../form/InternForm';

function Interns() {
  // State Management
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
  // Removed lorEligibleInterns state

  // UI State
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Modal State
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showInternFormModal, setShowInternFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  // Removed showLorEligibleModal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bulkUploadType, setBulkUploadType] = useState('add');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAllData();
  }, []);

  // ============= UTILITY FUNCTIONS =============
  // Calculate average of 6 performance metrics
  const calculateAverageScore = (intern) => {
    const metrics = [
      intern.taskCompletion,
      intern.taskQuality,
      intern.deadlineAdherence,
      intern.attendance,
      intern.mentorFeedback,
      intern.communication
    ];

    // Filter out undefined, null, or NaN values
    const validMetrics = metrics.filter(metric =>
      metric !== null && metric !== undefined && !isNaN(metric) && metric > 0
    );

    if (validMetrics.length === 0) return null;

    const sum = validMetrics.reduce((acc, metric) => acc + Number(metric), 0);
    return Math.round(sum / validMetrics.length);
  };

  // Get metrics completion status
  const getMetricsCount = (intern) => {
    const metrics = [
      intern.taskCompletion,
      intern.taskQuality,
      intern.deadlineAdherence,
      intern.attendance,
      intern.mentorFeedback,
      intern.communication
    ];
    return metrics.filter(m => m && m > 0).length;
  };

  // Get color based on average score - ENHANCED WITH MORE VIBRANT COLORS
  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 90) return 'text-emerald-600 font-bold';
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-teal-600';
    if (score >= 70) return 'text-cyan-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-rose-600';
  };

  // Get background color based on score - NEW FUNCTION FOR COLORFUL BACKGROUNDS
  const getScoreBgColor = (score) => {
    if (!score) return 'bg-gray-100';
    if (score >= 90) return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
    if (score >= 85) return 'bg-gradient-to-r from-green-500 to-teal-500 text-white';
    if (score >= 75) return 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white';
    if (score >= 70) return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    if (score >= 50) return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
    if (score >= 40) return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white';
  };

  // ============= DATA FETCHING FUNCTIONS =============
  const fetchAllData = async () => {
    await Promise.all([
      fetchInterns(),
      fetchRankingData()
      // Removed fetchLorEligibleInterns
    ]);
  };

  const fetchInterns = async () => {
    await requestHandler(
      async () => {
        const response = await getAllInterns();
        return response;
      },
      setLoading,
      (res) => {
        const processedData = (res.data || []).map(intern => ({
          ...intern,
          _id: intern._id || intern.id,
          id: intern.id || intern._id,
          // Ensure all metrics are numbers
          taskCompletion: intern.taskCompletion || 0,
          taskQuality: intern.taskQuality || 0,
          deadlineAdherence: intern.deadlineAdherence || 0,
          attendance: intern.attendance || 0,
          mentorFeedback: intern.mentorFeedback || 0,
          communication: intern.communication || 0,
          // Calculate average score
          averageScore: calculateAverageScore(intern)
        }));
        setInterns(processedData);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to fetch interns');
        console.error('Error fetching interns:', err);
      }
    );
  };

  const fetchRankingData = async () => {
    await requestHandler(
      async () => {
        const response = await scoreRankingInterns();
        return response;
      },
      null,
      (res) => {
        const rankings = res?.data || { gold: [], silver: [], bronze: [] };

        const processTier = (tier) => {
          return (tier || []).map(item => ({
            ...item,
            _id: item._id || item.id,
            id: item.id || item._id,
            score: item.score ? Math.round(item.score) : 0,
            averageScore: calculateAverageScore(item)
          }));
        };

        setRankingData({
          gold: processTier(rankings.gold),
          silver: processTier(rankings.silver),
          bronze: processTier(rankings.bronze)
        });
      },
      (err) => {
        console.error('Error fetching ranking data:', err);
        setRankingData({ gold: [], silver: [], bronze: [] });
      }
    );
  };

  // ============= CRUD OPERATIONS =============
  const handleAddIntern = () => {
    setFormMode('add');
    setSelectedIntern(null);
    setShowInternFormModal(true);
  };

  const handleEditIntern = (intern) => {
    setFormMode('edit');
    setSelectedIntern(intern);
    setShowInternFormModal(true);
  };

  const handleViewIntern = (intern) => {
    setSelectedIntern(intern);
    setShowDetailModal(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      await handleAddSingleIntern(formData);
    } else {
      await handleUpdateSingleIntern(formData);
    }
  };

  const handleAddSingleIntern = async (formData) => {
    await requestHandler(
      async () => {
        const { id, ...submitData } = formData;
        const response = await addSingleIntern(submitData);
        return response;
      },
      setBulkLoading,
      (res) => {
        alert('Intern added successfully!');
        setShowInternFormModal(false);
        fetchInterns();
      },
      (err) => {
        alert('Failed to add intern: ' + err.message);
      }
    );
  };

  const handleUpdateSingleIntern = async (formData) => {
    const internId = formData._id || formData.id;
    if (!internId) {
      alert('Intern ID is missing');
      return;
    }

    await requestHandler(
      async () => {
        const { id, ...submitData } = formData;
        const response = await updateSingleIntern(internId, submitData);
        return response;
      },
      setBulkLoading,
      (res) => {
        alert('Intern updated successfully!');
        setShowInternFormModal(false);
        setSelectedIntern(null);
        fetchAllData();
      },
      (err) => {
        alert('Failed to update intern: ' + err.message);
      }
    );
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    const fieldName = bulkUploadType === 'add' ? 'bulkAddInterns' : 'bulkUpdateInterns';
    formData.append(fieldName, bulkFile);

    await requestHandler(
      async () => {
        const response = bulkUploadType === 'add'
          ? await addBulkUploadIntern(formData)
          : await updateBulkUploadIntern(formData);
        return response;
      },
      setBulkLoading,
      (res) => {
        alert(`Bulk ${bulkUploadType === 'add' ? 'upload' : 'update'} completed successfully!`);
        setShowBulkUploadModal(false);
        setBulkFile(null);
        fetchAllData();
      },
      (err) => {
        alert(`Failed to ${bulkUploadType} interns: ` + err.message);
      }
    );
  };

  // ============= UTILITY FUNCTIONS =============
  const handleEmailIntern = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const refreshData = () => {
    fetchAllData();
  };

  // ============= FILTERING AND SORTING =============
  const departments = ['All', ...new Set(interns.map(intern => intern.department).filter(Boolean))];
  const statuses = ['All', 'Approve', 'Rejected', 'Pending'];

  const filteredInterns = interns
    .filter(intern => {
      const matchesSearch = searchTerm === '' ||
        intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (intern._id && intern._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (intern.id && intern.id.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDepartment = selectedDepartment === 'All' || intern.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || intern.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle average score sorting
        if (sortConfig.key === 'averageScore') {
          aValue = calculateAverageScore(a) || 0;
          bValue = calculateAverageScore(b) || 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredInterns.length / itemsPerPage);
  const paginatedInterns = filteredInterns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============= STATS CALCULATION =============
  const stats = {
    total: interns.length,
    approved: interns.filter(i => i.status === 'Approve').length,
    // Removed rejected, pending, lorEligible, withIssues, withCompleteMetrics
  };

  const rankingStats = {
    gold: rankingData.gold.length,
    silver: rankingData.silver.length,
    bronze: rankingData.bronze.length,
    total: rankingData.gold.length + rankingData.silver.length + rankingData.bronze.length
  };

  // ============= UI HELPER FUNCTIONS =============
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === 'asc' ?
      <FaSortUp className="w-3 h-3 text-indigo-600" /> :
      <FaSortDown className="w-3 h-3 text-indigo-600" />;
  };

  // ENHANCED STATUS BADGE WITH MORE COLORFUL VARIANTS
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Approve': {
        bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
        text: 'text-white',
        icon: FaCheckCircle,
        label: 'Approved',
        shadow: 'shadow-lg shadow-green-500/30'
      },
      'Rejected': {
        bg: 'bg-gradient-to-r from-rose-500 to-red-500',
        text: 'text-white',
        icon: FaTimesCircle,
        label: 'Rejected',
        shadow: 'shadow-lg shadow-red-500/30'
      },
      'Pending': {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        text: 'text-white',
        icon: FaClock,
        label: 'Pending',
        shadow: 'shadow-lg shadow-amber-500/30'
      }
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.shadow}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // ENHANCED PERFORMANCE BADGE WITH MORE COLORFUL VARIANTS
  const getPerformanceBadge = (averageScore) => {
    if (!averageScore) return null;

    if (averageScore >= 90) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-xs font-medium shadow-lg shadow-green-500/30">
          <FaCrown className="w-3 h-3" />
          Outstanding
        </span>
      );
    } else if (averageScore >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-xs font-medium shadow-lg shadow-green-500/30">
          <FaStar className="w-3 h-3" />
          Excellent
        </span>
      );
    } else if (averageScore >= 75) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full text-xs font-medium shadow-lg shadow-teal-500/30">
          <FaRibbon className="w-3 h-3" />
          Very Good
        </span>
      );
    } else if (averageScore >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xs font-medium shadow-lg shadow-blue-500/30">
          <FaChartLine className="w-3 h-3" />
          Good
        </span>
      );
    } else if (averageScore >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-medium shadow-lg shadow-blue-500/30">
          <FaAward className="w-3 h-3" />
          Above Average
        </span>
      );
    } else if (averageScore >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-medium shadow-lg shadow-amber-500/30">
          <FaChartLine className="w-3 h-3" />
          Average
        </span>
      );
    } else if (averageScore >= 40) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-medium shadow-lg shadow-orange-500/30">
          <FaChartLine className="w-3 h-3" />
          Below Average
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-medium shadow-lg shadow-rose-500/30">
          <FaChartLine className="w-3 h-3" />
          Needs Improvement
        </span>
      );
    }
  };

  // ============= LOADING AND ERROR STATES =============
  if (loading && interns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUserGraduate className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading interns...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (error && interns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============= HEADER SECTION - ENHANCED WITH BETTER GRADIENT ============= */}
      {/* ============= HEADER SECTION ============= */}
<div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 relative overflow-hidden">
  {/* Decorative elements */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24"></div>
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

  <div className="relative z-10">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaUserGraduate className="w-8 h-8" />
          Interns Management
        </h1>
        <p className="text-indigo-100 mt-2 text-sm flex items-center gap-2">
          <span className="inline-block w-1 h-1 bg-indigo-300 rounded-full"></span>
          Manage and monitor all your interns in one place
        </p>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
        <button
          onClick={() => setShowRankingModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm transition-all backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105"
        >
          <FaTrophy className="w-4 h-4" />
          Rankings
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {rankingStats.total}
          </span>
        </button>
        <button
          onClick={() => {
            setBulkUploadType('add');
            setShowBulkUploadModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm transition-all backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105"
        >
          <FaCloudUploadAlt className="w-4 h-4" />
          Bulk Upload
        </button>
        <button
          onClick={handleAddIntern}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 transform hover:scale-105"
        >
          <FaUserPlus className="w-4 h-4" />
          Add Intern
        </button>
      </div>
    </div>

    {/* Medal Holders - Gold, Silver, Bronze */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {/* Gold Holder */}
      <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-5 shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaTrophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm">Gold Tier</p>
                <p className="text-3xl font-bold text-white">{rankingData.gold.length}</p>
              </div>
            </div>
            <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Top Performers</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span>Score ≥ 85%</span>
            <span className="flex items-center gap-1">
              <FaStar className="w-3 h-3" />
              Elite
            </span>
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${rankingData.gold.length > 0 ? (rankingData.gold.length / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Silver Holder */}
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl p-5 shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaAward className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm">Silver Tier</p>
                <p className="text-3xl font-bold text-white">{rankingData.silver.length}</p>
              </div>
            </div>
            <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Strong Performers</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span>Score 70-84%</span>
            <span className="flex items-center gap-1">
              <FaChartLine className="w-3 h-3" />
              Advanced
            </span>
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${rankingData.silver.length > 0 ? (rankingData.silver.length / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bronze Holder */}
      <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-5 shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaRibbon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm">Bronze Tier</p>
                <p className="text-3xl font-bold text-white">{rankingData.bronze.length}</p>
              </div>
            </div>
            <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Rising Stars</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span>Score 50-69%</span>
            <span className="flex items-center gap-1">
              <FaChartLine className="w-3 h-3" />
              Developing
            </span>
          </div>
          <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${rankingData.bronze.length > 0 ? (rankingData.bronze.length / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* ============= FILTERS SECTION - ENHANCED WITH BETTER COLORS ============= */}
      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex-1 flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, department, or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors min-w-[140px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors min-w-[120px]"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-100 text-indigo-600 shadow-md'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Grid View"
            >
              <FaThLarge className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-100 text-indigo-600 shadow-md'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="List View"
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters - ENHANCED COLORS */}
        {(searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-xs border border-indigo-200 shadow-sm">
                <FaSearch className="w-3 h-3" />
                {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-indigo-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-full text-xs border border-cyan-200 shadow-sm">
                <FaBriefcase className="w-3 h-3" />
                {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All')} className="hover:text-cyan-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs border border-amber-200 shadow-sm">
                <FaClock className="w-3 h-3" />
                {selectedStatus}
                <button onClick={() => setSelectedStatus('All')} className="hover:text-amber-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============= CONTENT SECTION ============= */}
      {filteredInterns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserGraduate className="w-16 h-16 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No interns found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first intern'}
          </p>
          <button
            onClick={handleAddIntern}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-sm shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
            <FaUserPlus className="w-4 h-4" />
            Add Your First Intern
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedInterns.map((intern) => (
                <InternCard
                  key={intern._id || intern.id}
                  intern={{
                    ...intern,
                    averageScore: calculateAverageScore(intern)
                  }}
                  onView={handleViewIntern}
                  onEdit={handleEditIntern}
                  onEmail={() => handleEmailIntern(intern.email)}
                />
              ))}
            </div>
          ) : (
            /* List View - ENHANCED WITH BETTER COLORS */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('_id')}
                          className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
                        >
                          <FaIdCard className="w-3 h-3" />
                          ID {getSortIcon('_id')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
                        >
                          <FaUser className="w-3 h-3" />
                          Name {getSortIcon('name')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('department')}
                          className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
                        >
                          <FaBriefcase className="w-3 h-3" />
                          Department {getSortIcon('department')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                          <FaGraduationCap className="w-3 h-3" />
                          Course
                        </span>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('averageScore')}
                          className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
                        >
                          <FaPercentage className="w-3 h-3" />
                          Performance {getSortIcon('averageScore')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                          <FaUserTie className="w-3 h-3" />
                          Mentor
                        </span>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                          <FaClock className="w-3 h-3" />
                          Status
                        </span>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                          <FaEye className="w-3 h-3" />
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInterns.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      const rowColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';

                      return (
                        <tr key={intern._id || intern.id} className={`${rowColor} hover:bg-indigo-50/50 transition-colors border-t border-gray-100`}>
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-2 py-1 rounded-lg">
                              {(intern._id || intern.id || 'N/A').slice(-8)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-medium shadow-md ${
                                averageScore >= 85 ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
                                averageScore >= 70 ? 'bg-gradient-to-br from-teal-500 to-cyan-500' :
                                averageScore >= 50 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                'bg-gradient-to-br from-rose-500 to-pink-500'
                              }`}>
                                {intern.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{intern.name}</p>
                                <p className="text-xs text-gray-500">{intern.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-xs font-medium border border-cyan-200 shadow-sm">
                              {intern.department || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{intern.course || '-'}</td>
                          <td className="py-3 px-4">
                            {averageScore ? (
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${getScoreColor(averageScore)}`}>
                                  {averageScore}%
                                </span>
                                {getPerformanceBadge(averageScore)}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">No data</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{intern.mentor || '-'}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(intern.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewIntern(intern)}
                                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditIntern(intern)}
                                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600"
                                title="Edit Intern"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============= PAGINATION - ENHANCED COLORS ============= */}
          {filteredInterns.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  Showing <span className="font-semibold text-indigo-600">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-semibold text-indigo-600">{Math.min(currentPage * itemsPerPage, filteredInterns.length)}</span> of{' '}
                  <span className="font-semibold text-indigo-600">{filteredInterns.length}</span> interns
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-xl transition-all ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-indigo-100 text-indigo-600 hover:shadow-md'
                    }`}
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'hover:bg-indigo-100 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-xl transition-all ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-indigo-100 text-indigo-600 hover:shadow-md'
                    }`}
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============= INTERN FORM MODAL ============= */}
      <InternForm
        isOpen={showInternFormModal}
        onClose={() => {
          setShowInternFormModal(false);
          setSelectedIntern(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedIntern}
        mode={formMode}
        loading={bulkLoading}
      />

      {/* ============= BULK UPLOAD MODAL - ENHANCED COLORS ============= */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Bulk {bulkUploadType === 'add' ? 'Upload' : 'Update'} Interns
                </h3>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkFile(null);
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setBulkUploadType('add')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    bulkUploadType === 'add'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Add New
                </button>
                <button
                  onClick={() => setBulkUploadType('update')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    bulkUploadType === 'update'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Update Existing
                </button>
              </div>

              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaFileExcel className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Upload Excel or CSV file
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {bulkUploadType === 'add'
                    ? 'File should contain intern details with 6 performance metrics'
                    : 'File should contain intern IDs and fields to update'}
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="hidden"
                  id="bulkFile"
                />
                <label
                  htmlFor="bulkFile"
                  className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
                >
                  Choose File
                </label>
                {bulkFile && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                    <p className="text-xs text-indigo-600 truncate font-medium">
                      Selected: {bulkFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(bulkFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBulkUpload}
                  disabled={!bulkFile || bulkLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
                >
                  {bulkLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    bulkUploadType === 'add' ? 'Upload Interns' : 'Update Interns'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkFile(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= RANKINGS MODAL - ENHANCED COLORS ============= */}
      {showRankingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-5 rounded-t-2xl sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <FaTrophy className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Intern Rankings</h2>
                </div>
                <button
                  onClick={() => setShowRankingModal(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Gold Tier */}
              {rankingData.gold.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                      <FaCrown className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-amber-700">Gold Tier ({rankingData.gold.length} interns)</span>
                  </h3>
                  <div className="space-y-2">
                    {rankingData.gold.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl hover:shadow-md transition-all">
                          <div className="w-9 h-9 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{intern.name}</h3>
                              <span className="text-xs font-mono bg-amber-200 text-amber-700 px-2 py-0.5 rounded">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-600 text-lg">
                              {averageScore || intern.score || 0}%
                            </div>
                            {getPerformanceBadge(averageScore)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Silver Tier */}
              {rankingData.silver.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-md">
                      <FaRibbon className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-gray-600">Silver Tier ({rankingData.silver.length} interns)</span>
                  </h3>
                  <div className="space-y-2">
                    {rankingData.silver.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                          <div className="w-9 h-9 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{intern.name}</h3>
                              <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-600 text-lg">
                              {averageScore || intern.score || 0}%
                            </div>
                            {getPerformanceBadge(averageScore)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bronze Tier */}
              {rankingData.bronze.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 bg-gradient-to-r from-amber-700 to-amber-800 rounded-lg flex items-center justify-center shadow-md">
                      <FaAward className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-amber-800">Bronze Tier ({rankingData.bronze.length} interns)</span>
                  </h3>
                  <div className="space-y-2">
                    {rankingData.bronze.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl hover:shadow-md transition-all">
                          <div className="w-9 h-9 bg-gradient-to-r from-amber-700 to-amber-800 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{intern.name}</h3>
                              <span className="text-xs font-mono bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-800 text-lg">
                              {averageScore || intern.score || 0}%
                            </div>
                            {getPerformanceBadge(averageScore)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No Rankings */}
              {rankingData.gold.length === 0 && rankingData.silver.length === 0 && rankingData.bronze.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrophy className="w-14 h-14 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No ranking data available</p>
                  <p className="text-sm text-gray-400 mt-1">Interns need performance metrics to appear in rankings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============= DETAIL MODAL - FULL INTERN CARD ============= */}
      {showDetailModal && selectedIntern && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
            <div className={`p-5 rounded-t-2xl ${
              calculateAverageScore(selectedIntern) >= 85 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
              calculateAverageScore(selectedIntern) >= 70 ? 'bg-gradient-to-r from-teal-500 to-cyan-500' :
              calculateAverageScore(selectedIntern) >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-gradient-to-r from-rose-500 to-pink-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-gray-800 font-bold text-2xl shadow-lg">
                    {selectedIntern.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedIntern.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <FaIdCard className="w-3 h-3" />
                      <span>ID: {(selectedIntern._id || selectedIntern.id || 'N/A').slice(-8)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-white" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold truncate">{selectedIntern.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-semibold">
                      {selectedIntern.endDate ? new Date(selectedIntern.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`text-center p-3 rounded-xl ${
                  calculateAverageScore(selectedIntern) >= 85 ? 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200' :
                  calculateAverageScore(selectedIntern) >= 70 ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200' :
                  calculateAverageScore(selectedIntern) >= 50 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200' :
                  'bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200'
                }`}>
                  <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                    calculateAverageScore(selectedIntern) >= 85 ? 'bg-emerald-500' :
                    calculateAverageScore(selectedIntern) >= 70 ? 'bg-teal-500' :
                    calculateAverageScore(selectedIntern) >= 50 ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}>
                    <FaStar className="w-4 h-4 text-white" />
                  </div>
                  <p className={`text-xl font-bold ${
                    calculateAverageScore(selectedIntern) >= 85 ? 'text-emerald-600' :
                    calculateAverageScore(selectedIntern) >= 70 ? 'text-teal-600' :
                    calculateAverageScore(selectedIntern) >= 50 ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>
                    {Math.round(selectedIntern.score) || 0}%
                  </p>
                  <p className="text-xs text-gray-500">Overall</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <FaGraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold truncate">{selectedIntern.course || '-'}</p>
                  <p className="text-xs text-gray-500">Course</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <FaUserTie className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold truncate">{selectedIntern.mentor || '-'}</p>
                  <p className="text-xs text-gray-500">Mentor</p>
                </div>
              </div>

              {/* Performance Metrics - Full Display */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FaTasks className="w-3 h-3 text-white" />
                  </div>
                  6 Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Task Completion</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{selectedIntern.taskCompletion || 0}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${selectedIntern.taskCompletion || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Task Quality</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{selectedIntern.taskQuality || 0}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${selectedIntern.taskQuality || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deadline Adherence</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{selectedIntern.deadlineAdherence || 0}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${selectedIntern.deadlineAdherence || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Attendance</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{selectedIntern.attendance || 0}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${selectedIntern.attendance || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mentor Feedback</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{selectedIntern.mentorFeedback || 0}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${selectedIntern.mentorFeedback || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Communication</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{selectedIntern.communication || 0}%</p>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${selectedIntern.communication || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Score Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Average of 6 Metrics:</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${getScoreColor(calculateAverageScore(selectedIntern))}`}>
                        {calculateAverageScore(selectedIntern) || 0}%
                      </span>
                      {getPerformanceBadge(calculateAverageScore(selectedIntern))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {(selectedIntern.isCompliantIssue || selectedIntern.isDisciplineIssue) && (
                <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-xl p-4 border border-rose-200">
                  <p className="text-xs font-bold text-gray-700 mb-3">Issues:</p>
                  <div className="flex gap-2">
                    {selectedIntern.isCompliantIssue && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-lg text-xs font-medium border border-orange-200 shadow-sm">
                        Compliance Issue
                      </span>
                    )}
                    {selectedIntern.isDisciplineIssue && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 rounded-lg text-xs font-medium border border-rose-200 shadow-sm">
                        Discipline Issue
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditIntern(selectedIntern);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 text-sm font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Intern
                </button>
                <button
                  onClick={() => handleEmailIntern(selectedIntern.email)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg transform hover:scale-105"
                >
                  <FaEnvelope className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interns;
