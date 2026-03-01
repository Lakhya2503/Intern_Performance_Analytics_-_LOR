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
  FaAward,
  FaRibbon
} from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import {
  getAllInterns,
  addBulkUploadIntern,
  updateBulkUploadIntern,
  addSingleIntern,
  updateSingleIntern,
  scoreRankingInterns,
  eligibleInternsForLOR
} from '../../../api';
import { requestHandler } from '../../../utils';
import InternCard from '../../cards/InternCard';
import InternForm from '../../form/InternForm';

function Interns() {
  // State Management
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState({ gold: [], silver: [], bronze: [] });
  const [lorEligibleInterns, setLorEligibleInterns] = useState([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [lorLoading, setLorLoading] = useState(false);
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
  const [showLorEligibleModal, setShowLorEligibleModal] = useState(false);
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

  // Get color based on average score
  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBgColor = (score) => {
    if (!score) return 'bg-gray-100';
    if (score >= 85) return 'bg-emerald-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-rose-100';
  };

  // ============= DATA FETCHING FUNCTIONS =============
  const fetchAllData = async () => {
    await Promise.all([
      fetchInterns(),
      fetchRankingData(),
      fetchLorEligibleInterns()
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

  const fetchLorEligibleInterns = async () => {
    await requestHandler(
      async () => {
        const response = await eligibleInternsForLOR();
        return response;
      },
      setLorLoading,
      (res) => {
        const processedData = (res.data || []).map(intern => ({
          ...intern,
          _id: intern._id || intern.id,
          id: intern.id || intern._id,
          score: intern.score ? Math.round(intern.score) : 0,
          averageScore: calculateAverageScore(intern),
          endDate: intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'N/A'
        }));
        setLorEligibleInterns(processedData);
      },
      (err) => {
        console.error('Error fetching LOR eligible interns:', err);
        setLorEligibleInterns([]);
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

  const handleGenerateLOR = (intern) => {
    alert(`Generate LOR for ${intern.name} (ID: ${intern._id || intern.id})`);
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
    topPerformers: interns.filter(i => {
      const avgScore = calculateAverageScore(i);
      return avgScore && avgScore >= 85;
    }).length,
    withCompleteMetrics: interns.filter(i => {
      return i.taskCompletion && i.taskQuality && i.deadlineAdherence &&
             i.attendance && i.mentorFeedback && i.communication;
    }).length
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Approve': {
        bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        text: 'text-white',
        icon: FaCheckCircle,
        label: 'Approved',
        shadow: 'shadow-lg shadow-emerald-500/30'
      },
      'Rejected': {
        bg: 'bg-gradient-to-r from-rose-500 to-pink-500',
        text: 'text-white',
        icon: FaTimesCircle,
        label: 'Rejected',
        shadow: 'shadow-lg shadow-rose-500/30'
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

  const getPerformanceBadge = (averageScore) => {
    if (!averageScore) return null;

    if (averageScore >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium shadow-lg shadow-emerald-500/30">
          <FaStar className="w-3 h-3" />
          Excellent
        </span>
      );
    } else if (averageScore >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 text-white rounded-full text-xs font-medium shadow-lg shadow-blue-500/30">
          <FaChartLine className="w-3 h-3" />
          Good
        </span>
      );
    } else if (averageScore >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 text-white rounded-full text-xs font-medium shadow-lg shadow-amber-500/30">
          <FaChartLine className="w-3 h-3" />
          Average
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 text-white rounded-full text-xs font-medium shadow-lg shadow-rose-500/30">
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
              <FaUserGraduate className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Loading interns...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (error && interns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="w-10 h-10 text-rose-600" />
          </div>
          <p className="text-gray-800 font-medium mb-2">Failed to load interns</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============= HEADER SECTION ============= */}
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

      {/* ============= FILTERS SECTION ============= */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, department, or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white min-w-[140px] transition-all"
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
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white min-w-[120px] transition-all"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all transform ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 scale-110'
                  : 'hover:bg-white/50 text-gray-600 hover:scale-105'
              }`}
              title="Grid View"
            >
              <FaThLarge className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all transform ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 scale-110'
                  : 'hover:bg-white/50 text-gray-600 hover:scale-105'
              }`}
              title="List View"
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200">
                <FaSearch className="w-3 h-3" />
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-indigo-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200">
                <FaBriefcase className="w-3 h-3" />
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All')} className="hover:text-indigo-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('All')} className="hover:text-indigo-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============= CONTENT SECTION ============= */}
      {filteredInterns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUserGraduate className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">No interns found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'Get started by adding your first intern to the program'}
          </p>
          <button
            onClick={handleAddIntern}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105"
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
            /* List View with enhanced styling */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-700">
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('_id')}
                          className="flex items-center gap-1 font-medium text-white hover:text-indigo-100"
                        >
                          <FaIdCard className="w-3 h-3" />
                          ID {getSortIcon('_id')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 font-medium text-white hover:text-indigo-100"
                        >
                          <FaUser className="w-3 h-3" />
                          Name {getSortIcon('name')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('department')}
                          className="flex items-center gap-1 font-medium text-white hover:text-indigo-100"
                        >
                          <FaBriefcase className="w-3 h-3" />
                          Department {getSortIcon('department')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left text-white">Course</th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('averageScore')}
                          className="flex items-center gap-1 font-medium text-white hover:text-indigo-100"
                        >
                          <FaPercentage className="w-3 h-3" />
                          Performance {getSortIcon('averageScore')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left text-white">Mentor</th>
                      <th className="py-4 px-4 text-left text-white">Status</th>
                      <th className="py-4 px-4 text-left text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInterns.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-r from-gray-50 to-indigo-50/30';

                      return (
                        <tr key={intern._id || intern.id} className={`${rowBg} hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all group`}>
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs bg-gradient-to-r from-gray-100 to-indigo-100 px-2 py-1 rounded-lg text-indigo-700">
                              {(intern._id || intern.id || 'N/A').slice(-8)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-indigo-500/30">
                                {intern.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{intern.name}</p>
                                <p className="text-xs text-gray-500">{intern.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200">
                              {intern.department || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-600">{intern.course || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            {averageScore ? (
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${getScoreBgColor(averageScore)} ${getScoreColor(averageScore)} shadow-lg`}>
                                  {averageScore}%
                                </div>
                                {getPerformanceBadge(averageScore)}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-lg">No data</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-600">{intern.mentor || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(intern.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => handleViewIntern(intern)}
                                className="p-2 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all transform hover:scale-110"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4 text-indigo-600" />
                              </button>
                              <button
                                onClick={() => handleEditIntern(intern)}
                                className="p-2 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all transform hover:scale-110"
                                title="Edit Intern"
                              >
                                <FaEdit className="w-4 h-4 text-indigo-600" />
                              </button>
                              <button
                                onClick={() => handleEmailIntern(intern.email)}
                                className="p-2 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all transform hover:scale-110"
                                title="Send Email"
                              >
                                <FaEnvelope className="w-4 h-4 text-indigo-600" />
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

          {/* ============= PAGINATION ============= */}
          {filteredInterns.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-indigo-600">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-semibold text-indigo-600">{Math.min(currentPage * itemsPerPage, filteredInterns.length)}</span> of{' '}
                  <span className="font-semibold text-indigo-600">{filteredInterns.length}</span> interns
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all transform ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 text-indigo-600 hover:scale-110'
                    }`}
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all transform ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 scale-110'
                          : 'hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 text-gray-600 hover:scale-105'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all transform ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 text-indigo-600 hover:scale-110'
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

      {/* ============= BULK UPLOAD MODAL ============= */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-700 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaCloudUploadAlt className="w-5 h-5" />
                  Bulk {bulkUploadType === 'add' ? 'Upload' : 'Update'} Interns
                </h3>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkFile(null);
                  }}
                  className="p-1.5 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setBulkUploadType('add')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all transform ${
                    bulkUploadType === 'add'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  Add New
                </button>
                <button
                  onClick={() => setBulkUploadType('update')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all transform ${
                    bulkUploadType === 'update'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  Update Existing
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors group">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FaFileExcel className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">
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
                  className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-sm cursor-pointer hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-600/30 transform hover:scale-105"
                >
                  Choose File
                </label>
                {bulkFile && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <p className="text-sm font-medium text-indigo-700 truncate">
                      {bulkFile.name}
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">
                      Size: {(bulkFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBulkUpload}
                  disabled={!bulkFile || bulkLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30 transform hover:scale-105"
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
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= RANKINGS MODAL ============= */}
      {showRankingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-700 p-5 sticky top-0 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaTrophy className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Intern Rankings</h2>
                </div>
                <button
                  onClick={() => setShowRankingModal(false)}
                  className="p-1.5 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Gold Tier */}
              {rankingData.gold.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-600 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <FaTrophy className="w-4 h-4 text-white" />
                    </div>
                    Gold Tier ({rankingData.gold.length} interns)
                  </h3>
                  <div className="space-y-3">
                    {rankingData.gold.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-4 p-4 border border-amber-200 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-lg transition-all transform hover:scale-105">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/30">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-800">{intern.name}</h3>
                              <span className="text-xs font-mono bg-amber-200/50 px-2 py-1 rounded-lg text-amber-700">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-amber-600">
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
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg shadow-gray-500/30">
                      <FaAward className="w-4 h-4 text-white" />
                    </div>
                    Silver Tier ({rankingData.silver.length} interns)
                  </h3>
                  <div className="space-y-3">
                    {rankingData.silver.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 hover:shadow-lg transition-all transform hover:scale-105">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-gray-500/30">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-800">{intern.name}</h3>
                              <span className="text-xs font-mono bg-gray-200/50 px-2 py-1 rounded-lg text-gray-600">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-600">
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
                <div>
                  <h3 className="text-sm font-semibold text-amber-700 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg shadow-amber-700/30">
                      <FaRibbon className="w-4 h-4 text-white" />
                    </div>
                    Bronze Tier ({rankingData.bronze.length} interns)
                  </h3>
                  <div className="space-y-3">
                    {rankingData.bronze.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-4 p-4 border border-amber-300 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-lg transition-all transform hover:scale-105">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-700/30">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-800">{intern.name}</h3>
                              <span className="text-xs font-mono bg-amber-200/50 px-2 py-1 rounded-lg text-amber-700">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-amber-700">
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
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No ranking data available</p>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Interns need performance metrics with scores above 0 to appear in rankings
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============= DETAIL MODAL ============= */}
      {showDetailModal && selectedIntern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-700 p-5 rounded-t-2xl sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-lg">
                    {selectedIntern.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedIntern.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-indigo-100 mt-1">
                      <FaIdCard className="w-3 h-3" />
                      <span>ID: {(selectedIntern._id || selectedIntern.id || 'N/A').slice(-8)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all transform hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-indigo-700" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{selectedIntern.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all transform hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="w-4 h-4 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedIntern.endDate ? new Date(selectedIntern.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all transform hover:scale-105">
                  <FaStar className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-indigo-600">{Math.round(selectedIntern.score) || 0}%</p>
                  <p className="text-xs text-gray-500 mt-1">Overall Score</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all transform hover:scale-105">
                  <FaGraduationCap className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800 truncate">{selectedIntern.course || '-'}</p>
                  <p className="text-xs text-gray-500 mt-1">Course</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all transform hover:scale-105">
                  <FaUserTie className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800 truncate">{selectedIntern.mentor || '-'}</p>
                  <p className="text-xs text-gray-500 mt-1">Mentor</p>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 rounded-xl p-5 text-white shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FaTasks className="w-4 h-4" />
                    Performance Summary
                  </h4>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{calculateAverageScore(selectedIntern) || 0}%</p>
                    <p className="text-xs text-indigo-200">Average of 6 Metrics</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Task Completion</span>
                      <span>{selectedIntern.taskCompletion || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full" style={{ width: `${selectedIntern.taskCompletion || 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Task Quality</span>
                      <span>{selectedIntern.taskQuality || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full" style={{ width: `${selectedIntern.taskQuality || 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Deadline Adherence</span>
                      <span>{selectedIntern.deadlineAdherence || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full" style={{ width: `${selectedIntern.deadlineAdherence || 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Attendance</span>
                      <span>{selectedIntern.attendance || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full" style={{ width: `${selectedIntern.attendance || 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Mentor Feedback</span>
                      <span>{selectedIntern.mentorFeedback || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full" style={{ width: `${selectedIntern.mentorFeedback || 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Communication</span>
                      <span>{selectedIntern.communication || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full" style={{ width: `${selectedIntern.communication || 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {(selectedIntern.isCompliantIssue || selectedIntern.isDisciplineIssue) && (
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
                  <p className="text-xs font-medium text-rose-800 mb-3 flex items-center gap-2">
                    <FaTimesCircle className="w-4 h-4" />
                    Issues Detected:
                  </p>
                  <div className="flex gap-2">
                    {selectedIntern.isCompliantIssue && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs font-medium shadow-lg shadow-orange-500/30">
                        Compliance Issue
                      </span>
                    )}
                    {selectedIntern.isDisciplineIssue && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-xs font-medium shadow-lg shadow-rose-500/30">
                        Discipline Issue
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 transform hover:scale-105"
                >
                  <FaEnvelope className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Interns;
