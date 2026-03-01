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
  FaMedal
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

  // Get color based on average score
  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-teal-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
    rejected: interns.filter(i => i.status === 'Rejected').length,
    pending: interns.filter(i => i.status === 'Pending').length,
    overallAverageScore: interns.length > 0
      ? Math.round(interns.reduce((acc, i) => {
          const avgScore = calculateAverageScore(i);
          return acc + (avgScore || 0);
        }, 0) / interns.length)
      : 0,
    lorEligible: lorEligibleInterns.length,
    withIssues: interns.filter(i => i.isCompliantIssue || i.isDisciplineIssue).length,
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
      <FaSortUp className="w-3 h-3 text-teal-600" /> :
      <FaSortDown className="w-3 h-3 text-teal-600" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Approve': { bg: 'bg-teal-100', text: 'text-teal-700', icon: FaCheckCircle, label: 'Approved' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-700', icon: FaTimesCircle, label: 'Rejected' },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: FaClock, label: 'Pending' }
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPerformanceBadge = (averageScore) => {
    if (!averageScore) return null;
    
    if (averageScore >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <FaStar className="w-3 h-3" />
          Excellent
        </span>
      );
    } else if (averageScore >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
          <FaChartLine className="w-3 h-3" />
          Good
        </span>
      );
    } else if (averageScore >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          <FaChartLine className="w-3 h-3" />
          Average
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
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
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interns...</p>
        </div>
      </div>
    );
  }

  if (error && interns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Interns Management</h1>
            <p className="text-teal-100 mt-1 text-sm">Manage and monitor all your interns</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
            <button
              onClick={() => setShowLorEligibleModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm transition-colors"
              disabled={lorLoading}
            >
              {lorLoading ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaScroll className="w-4 h-4" />
              )}
              LOR Eligible ({stats.lorEligible})
            </button>
            <button
              onClick={() => setShowRankingModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm transition-colors"
            >
              <FaTrophy className="w-4 h-4" />
              Rankings ({rankingStats.total})
            </button>
            <button
              onClick={() => {
                setBulkUploadType('add');
                setShowBulkUploadModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm transition-colors"
            >
              <FaCloudUploadAlt className="w-4 h-4" />
              Bulk Upload
            </button>
            <button
              onClick={handleAddIntern}
              className="flex items-center gap-2 px-3 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 text-sm transition-colors"
            >
              <FaUserPlus className="w-4 h-4" />
              Add Intern
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mt-6">
          <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">Total</p>
            <p className="text-xl font-bold text-white">{stats.total}</p>
          </div>
          {/* <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">Approved</p>
            <p className="text-xl font-bold text-white">{stats.approved}</p>
          </div> */}
          <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">Rejected</p>
            <p className="text-xl font-bold text-white">{stats.rejected}</p>
          </div>
          <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">Pending</p>
            <p className="text-xl font-bold text-white">{stats.pending}</p>
          </div>
          <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">Avg. Score</p>
            <p className="text-xl font-bold text-white">{stats.overallAverageScore}%</p>
          </div>
          <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">LOR Eligible</p>
            <p className="text-xl font-bold text-white">{stats.lorEligible}</p>
          </div>
          <div className="bg-teal-700/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-teal-200 text-xs">With Issues</p>
            <p className="text-xl font-bold text-white">{stats.withIssues}</p>
          </div>
        </div>
      </div>

      {/* ============= FILTERS SECTION ============= */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
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
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white min-w-[140px]"
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
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white min-w-[120px]"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-teal-100 text-teal-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Grid View"
            >
              <FaThLarge className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-teal-100 text-teal-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="List View"
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-xs text-gray-500">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-teal-900">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All')} className="hover:text-teal-900">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('All')} className="hover:text-teal-900">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============= CONTENT SECTION ============= */}
      {filteredInterns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaUserGraduate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No interns found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first intern'}
          </p>
          <button
            onClick={handleAddIntern}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
          >
            <FaUserPlus className="w-4 h-4" />
            Add Your First Intern
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            /* List View */
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left">
                        <button 
                          onClick={() => handleSort('_id')} 
                          className="flex items-center gap-1 font-medium text-gray-700 hover:text-teal-600"
                        >
                          <FaIdCard className="w-3 h-3" />
                          ID {getSortIcon('_id')}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-left">
                        <button 
                          onClick={() => handleSort('name')} 
                          className="flex items-center gap-1 font-medium text-gray-700 hover:text-teal-600"
                        >
                          <FaUser className="w-3 h-3" />
                          Name {getSortIcon('name')}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-left">
                        <button 
                          onClick={() => handleSort('department')} 
                          className="flex items-center gap-1 font-medium text-gray-700 hover:text-teal-600"
                        >
                          <FaBriefcase className="w-3 h-3" />
                          Department {getSortIcon('department')}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-left">Course</th>
                      <th className="py-3 px-4 text-left">
                        <button 
                          onClick={() => handleSort('averageScore')} 
                          className="flex items-center gap-1 font-medium text-gray-700 hover:text-teal-600"
                        >
                          <FaPercentage className="w-3 h-3" />
                          Performance {getSortIcon('averageScore')}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-left">Mentor</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInterns.map((intern) => {
                      const averageScore = calculateAverageScore(intern);
                      
                      return (
                        <tr key={intern._id || intern.id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {(intern._id || intern.id || 'N/A').slice(-8)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {intern.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{intern.name}</p>
                                <p className="text-xs text-gray-500">{intern.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
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
                              <span className="text-gray-400 text-xs">No data</span>
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
                                className="p-1.5 hover:bg-teal-100 rounded transition-colors"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4 text-teal-600" />
                              </button>
                              <button
                                onClick={() => handleEditIntern(intern)}
                                className="p-1.5 hover:bg-teal-100 rounded transition-colors"
                                title="Edit Intern"
                              >
                                <FaEdit className="w-4 h-4 text-teal-600" />
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
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredInterns.length)}</span> of{' '}
                  <span className="font-medium">{filteredInterns.length}</span> interns
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition-colors ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-teal-100 text-teal-600'
                    }`}
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded text-sm transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-teal-600 text-white' 
                          : 'hover:bg-teal-100 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition-colors ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-teal-100 text-teal-600'
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-teal-600 p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Bulk {bulkUploadType === 'add' ? 'Upload' : 'Update'} Interns
                </h3>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkFile(null);
                  }}
                  className="p-1 hover:bg-teal-700 rounded transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setBulkUploadType('add')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bulkUploadType === 'add'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Add New
                </button>
                <button
                  onClick={() => setBulkUploadType('update')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bulkUploadType === 'update'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Update Existing
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaFileExcel className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
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
                  className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg text-sm cursor-pointer hover:bg-teal-700 transition-colors"
                >
                  Choose File
                </label>
                {bulkFile && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 truncate">
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
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-600 p-4 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaTrophy className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-medium text-white">Intern Rankings</h2>
                </div>
                <button
                  onClick={() => setShowRankingModal(false)}
                  className="p-1 hover:bg-teal-700 rounded transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Gold Tier */}
              {rankingData.gold.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-yellow-600 mb-3 flex items-center gap-2">
                    <FaTrophy className="w-4 h-4" />
                    Gold Tier ({rankingData.gold.length} interns)
                  </h3>
                  <div className="space-y-2">
                    {rankingData.gold.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-3 p-3 border rounded-lg bg-yellow-50 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{intern.name}</h3>
                              <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-yellow-600">
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
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <FaTrophy className="w-4 h-4" />
                    Silver Tier ({rankingData.silver.length} interns)
                  </h3>
                  <div className="space-y-2">
                    {rankingData.silver.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{intern.name}</h3>
                              <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-600">
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
                  <h3 className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-2">
                    <FaTrophy className="w-4 h-4" />
                    Bronze Tier ({rankingData.bronze.length} interns)
                  </h3>
                  <div className="space-y-2">
                    {rankingData.bronze.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);
                      return (
                        <div key={intern._id || intern.id} className="flex items-center gap-3 p-3 border rounded-lg bg-amber-50 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{intern.name}</h3>
                              <span className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">
                                {(intern._id || intern.id || '').slice(-6)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{intern.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-700">
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
                  <FaTrophy className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No ranking data available</p>
                  <p className="text-sm text-gray-400 mt-1">Interns need performance metrics to appear in rankings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============= LOR ELIGIBLE MODAL ============= */}
      {showLorEligibleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-600 p-4 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaScroll className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-medium text-white">LOR Eligible Interns</h2>
                </div>
                <button
                  onClick={() => setShowLorEligibleModal(false)}
                  className="p-1 hover:bg-teal-700 rounded transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {lorLoading ? (
                <div className="flex justify-center py-12">
                  <FaSpinner className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
              ) : lorEligibleInterns.length > 0 ? (
                <div className="space-y-4">
                  {lorEligibleInterns.map((intern) => {
                    const averageScore = calculateAverageScore(intern);
                    
                    return (
                      <div key={intern._id || intern.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {intern.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{intern.name}</h3>
                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                                  ID: {(intern._id || intern.id || '').slice(-8)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{intern.email}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                                  {intern.department || 'N/A'}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {intern.course || 'N/A'}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  Mentor: {intern.mentor || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-teal-600">
                              Score: <span className="text-lg">{intern.score || 0}%</span>
                            </div>
                            {averageScore && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">Performance:</span>
                                <span className={`font-bold ${getScoreColor(averageScore)}`}>
                                  {averageScore}%
                                </span>
                                {getPerformanceBadge(averageScore)}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              End Date: {intern.endDate}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleGenerateLOR(intern)}
                                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs hover:bg-teal-700 flex items-center gap-1 transition-colors"
                              >
                                <FaScroll className="w-3 h-3" />
                                Generate LOR
                              </button>
                              <button
                                onClick={() => handleEmailIntern(intern.email)}
                                className="px-3 py-1.5 border border-teal-600 text-teal-600 rounded-lg text-xs hover:bg-teal-50 flex items-center gap-1 transition-colors"
                              >
                                <FaEnvelope className="w-3 h-3" />
                                Email
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics - Full Display */}
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <FaTasks className="w-4 h-4 text-teal-600" />
                            6 Performance Metrics
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Task Completion</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{intern.taskCompletion || 0}%</p>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500"
                                    style={{ width: `${intern.taskCompletion || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Task Quality</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{intern.taskQuality || 0}%</p>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500"
                                    style={{ width: `${intern.taskQuality || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Deadline Adherence</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{intern.deadlineAdherence || 0}%</p>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500"
                                    style={{ width: `${intern.deadlineAdherence || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Attendance</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{intern.attendance || 0}%</p>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500"
                                    style={{ width: `${intern.attendance || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Mentor Feedback</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{intern.mentorFeedback || 0}%</p>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500"
                                    style={{ width: `${intern.mentorFeedback || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Communication</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{intern.communication || 0}%</p>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500"
                                    style={{ width: `${intern.communication || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Average Score Summary */}
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Average of 6 Metrics:</span>
                              <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold ${getScoreColor(averageScore)}`}>
                                  {averageScore || 0}%
                                </span>
                                {getPerformanceBadge(averageScore)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Issues */}
                        {(intern.isCompliantIssue || intern.isDisciplineIssue) && (
                          <div className="mt-3 flex gap-2">
                            {intern.isCompliantIssue && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                Compliance Issue
                              </span>
                            )}
                            {intern.isDisciplineIssue && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                Discipline Issue
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaScroll className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No LOR eligible interns found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Interns must complete their internship and have good performance metrics
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============= DETAIL MODAL - FULL INTERN CARD ============= */}
      {showDetailModal && selectedIntern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-600 p-4 rounded-t-lg sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-teal-600 font-bold text-xl">
                    {selectedIntern.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white">{selectedIntern.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-teal-100">
                      <FaIdCard className="w-3 h-3" />
                      <span>ID: {(selectedIntern._id || selectedIntern.id || 'N/A').slice(-8)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1 hover:bg-teal-700 rounded transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg">
                  <FaEnvelope className="w-4 h-4 text-teal-600" />
                  <div className="truncate">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium truncate">{selectedIntern.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg">
                  <FaCalendarAlt className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium">
                      {selectedIntern.endDate ? new Date(selectedIntern.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaStar className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-teal-600">{Math.round(selectedIntern.score) || 0}%</p>
                  <p className="text-xs text-gray-500">Overall</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaGraduationCap className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                  <p className="text-sm font-medium truncate">{selectedIntern.course || '-'}</p>
                  <p className="text-xs text-gray-500">Course</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaUserTie className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                  <p className="text-sm font-medium truncate">{selectedIntern.mentor || '-'}</p>
                  <p className="text-xs text-gray-500">Mentor</p>
                </div>
              </div>

              {/* Performance Metrics - Full Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                {/* <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FaTasks className="w-4 h-4 text-teal-600" />
                  6 Performance Metrics
                </h4> */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Task Completion</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{selectedIntern.taskCompletion || 0}%</p>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500"
                          style={{ width: `${selectedIntern.taskCompletion || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Task Quality</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{selectedIntern.taskQuality || 0}%</p>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500"
                          style={{ width: `${selectedIntern.taskQuality || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deadline Adherence</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{selectedIntern.deadlineAdherence || 0}%</p>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500"
                          style={{ width: `${selectedIntern.deadlineAdherence || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Attendance</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{selectedIntern.attendance || 0}%</p>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500"
                          style={{ width: `${selectedIntern.attendance || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mentor Feedback</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{selectedIntern.mentorFeedback || 0}%</p>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500"
                          style={{ width: `${selectedIntern.mentorFeedback || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Communication</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{selectedIntern.communication || 0}%</p>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500"
                          style={{ width: `${selectedIntern.communication || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Average Score Summary */}
                {/* <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Average of 6 Metrics:</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${getScoreColor(calculateAverageScore(selectedIntern))}`}>
                        {calculateAverageScore(selectedIntern) || 0}%
                      </span>
                      {getPerformanceBadge(calculateAverageScore(selectedIntern))}
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Issues */}
              {(selectedIntern.isCompliantIssue || selectedIntern.isDisciplineIssue) && (
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Issues:</p>
                  <div className="flex gap-2">
                    {selectedIntern.isCompliantIssue && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        Compliance Issue
                      </span>
                    )}
                    {selectedIntern.isDisciplineIssue && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
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
                  className="flex-1 px-3 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Intern
                </button>
                {/* <button
                  onClick={() => handleEmailIntern(selectedIntern.email)}
                  className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <FaEnvelope className="w-4 h-4" />
                  Send Email
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interns;