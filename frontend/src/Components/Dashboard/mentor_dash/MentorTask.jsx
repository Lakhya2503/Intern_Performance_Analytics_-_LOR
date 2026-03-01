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
  FaEdit,
  FaFileExcel,
  FaTimes,
  FaUserTie,
  FaIdCard,
  FaUser,
  FaBriefcase,
  FaPercentage,
  FaTasks
} from 'react-icons/fa';
import { MdOutlineSchool } from 'react-icons/md';
import { getAllInterns, addBulkUploadIntern, updateBulkUploadIntern, addSingleIntern, updateSingleIntern } from '../../../api';
import { requestHandler } from '../../../utils';
import InternCard from '../../cards/InternCard';
import InternForm from '../../form/InternForm';
import { BookOpenIcon } from 'lucide-react';

function MentorTask() {
  // State Management
  const [interns, setInterns] = useState([]);

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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bulkUploadType, setBulkUploadType] = useState('add');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchInterns();
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

  // Get gradient based on average score
  const getScoreGradient = (score) => {
    if (!score) return 'from-gray-400 to-gray-500';
    if (score >= 85) return 'from-emerald-400 to-emerald-600';
    if (score >= 70) return 'from-blue-400 to-blue-600';
    if (score >= 50) return 'from-amber-400 to-amber-600';
    return 'from-rose-400 to-rose-600';
  };

  // ============= DATA FETCHING FUNCTIONS =============
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
        fetchInterns();
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
        fetchInterns();
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
    fetchInterns();
  };

  // ============= FILTERING AND SORTING =============
  const departments = ['All', ...new Set(interns.map(intern => intern.department).filter(Boolean))];

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
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: FaCheckCircle,
        label: 'Approved'
      },
      'Rejected': {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: FaTimesCircle,
        label: 'Rejected'
      },
      'Pending': {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: FaClock,
        label: 'Pending'
      }
    };
    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPerformanceBadge = (averageScore) => {
    if (!averageScore) return null;

    if (averageScore >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-xs font-medium shadow-sm">
          <FaStar className="w-3 h-3" />
          Excellent
        </span>
      );
    } else if (averageScore >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-medium shadow-sm">
          <FaChartLine className="w-3 h-3" />
          Good
        </span>
      );
    } else if (averageScore >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-medium shadow-sm">
          <FaChartLine className="w-3 h-3" />
          Average
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full text-xs font-medium shadow-sm">
          <FaChartLine className="w-3 h-3" />
          Needs Work
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
          <div className="bg-rose-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="w-10 h-10 text-rose-600" />
          </div>
          <p className="text-gray-800 font-medium mb-2">Failed to Load Data</p>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium shadow-lg shadow-indigo-200 transition-all duration-200"
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
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl shadow-xl p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaTasks className="w-6 h-6" />
                Task Management
              </h1>
              <p className="text-indigo-100 mt-1 text-sm">Manage and track all your tasks</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
              <button
                onClick={() => {
                  setBulkUploadType('add');
                  setShowBulkUploadModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 text-sm transition-all duration-200 border border-white/20 shadow-lg"
              >
                <FaCloudUploadAlt className="w-4 h-4" />
                Bulk Add
              </button>
              <button
                onClick={() => {
                  setBulkUploadType('update');
                  setShowBulkUploadModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 text-sm transition-all duration-200 border border-white/20 shadow-lg"
              >
                <FaCloudUploadAlt className="w-4 h-4" />
                Bulk Update
              </button>
              <button
                onClick={handleAddIntern}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-300/30"
              >
                <FaUserPlus className="w-4 h-4" />
                Add Intern
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============= FILTERS SECTION ============= */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
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
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 min-w-[140px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Grid View"
            >
              <FaThLarge className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="List View"
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                <FaSearch className="w-3 h-3" />
                {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-indigo-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDepartment !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                <FaBriefcase className="w-3 h-3" />
                {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All')} className="hover:text-indigo-900 ml-1">
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                <FaClock className="w-3 h-3" />
                {selectedStatus}
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
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserGraduate className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No interns found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'Get started by adding your first intern to the system'}
          </p>
          <button
            onClick={handleAddIntern}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium shadow-lg shadow-indigo-200 transition-all duration-200"
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('_id')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                          <FaIdCard className="w-3 h-3" />
                          ID {getSortIcon('_id')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                          <FaUser className="w-3 h-3" />
                          Name {getSortIcon('name')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('department')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                          <FaBriefcase className="w-3 h-3" />
                          Department {getSortIcon('department')}
                        </button>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="font-semibold text-gray-700">Course</span>
                      </th>
                      {/* <th className="py-4 px-4 text-left">
                        <button
                          onClick={() => handleSort('averageScore')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                          <FaPercentage className="w-3 h-3" />
                          Performance {getSortIcon('averageScore')}
                        </button>
                      </th> */}
                      <th className="py-4 px-4 text-left">
                        <span className="font-semibold text-gray-700">Mentor</span>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="font-semibold text-gray-700">Status</span>
                      </th>
                      <th className="py-4 px-4 text-left">
                        <span className="font-semibold text-gray-700">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInterns.map((intern, index) => {
                      const averageScore = calculateAverageScore(intern);

                      return (
                        <tr key={intern._id || intern.id} className={`border-t border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}>
                          <td className="py-4 px-4">
                            <span className="font-mono text-xs bg-gray-100 px-2.5 py-1.5 rounded-lg text-gray-600 font-medium">
                              {(intern._id || intern.id || 'N/A').slice(-8)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getScoreGradient(averageScore)} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                                {intern.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{intern.name}</p>
                                <p className="text-xs text-gray-500">{intern.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-xl text-xs font-medium border border-indigo-200">
                              {intern.department || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                              <span className="text-gray-600 font-medium text-center inline-flex items-center gap-2">
                                <BookOpenIcon className="w-4 h-4 text-gray-400" />
                                {intern.course || '—'}
                              </span>
                          </td>
                          {/* <td className="py-4 px-4">
                            {averageScore ? (
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-lg ${getScoreColor(averageScore)}`}>
                                  {averageScore}%
                                </span>
                                {getPerformanceBadge(averageScore)}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-lg">No data</span>
                            )}
                          </td> */}
                          <td className="py-4 px-4">
                            <span className="text-gray-600 font-medium">{intern.mentor || '-'}</span>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(intern.status)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewIntern(intern)}
                                className="p-2 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-indigo-600 hover:text-indigo-700 group"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => handleEditIntern(intern)}
                                className="p-2 hover:bg-purple-100 rounded-lg transition-all duration-200 text-purple-600 hover:text-purple-700 group"
                                title="Edit Intern"
                              >
                                <FaEdit className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  Showing <span className="font-semibold text-indigo-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                  <span className="font-semibold text-indigo-600">{Math.min(currentPage * itemsPerPage, filteredInterns.length)}</span> of{' '}
                  <span className="font-semibold text-indigo-600">{filteredInterns.length}</span> interns
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-indigo-100 text-indigo-600 hover:scale-110'
                    }`}
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={`page-${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 scale-110'
                          : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-indigo-100 text-indigo-600 hover:scale-110'
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <FaCloudUploadAlt className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Bulk {bulkUploadType === 'add' ? 'Add' : 'Update'} Interns
                  </h3>
                </div>
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
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-sm text-indigo-700">
                  {bulkUploadType === 'add'
                    ? 'Upload an Excel or CSV file with intern details including all 6 performance metrics'
                    : 'Upload an Excel or CSV file with intern IDs and the fields you want to update'}
                </p>
              </div>

              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                bulkFile ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}>
                <FaFileExcel className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                  bulkFile ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {bulkFile ? 'File selected' : 'Upload Excel or CSV file'}
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
                  className={`inline-block px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 ${
                    bulkFile
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {bulkFile ? 'Change File' : 'Choose File'}
                </label>
                {bulkFile && (
                  <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {bulkFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(bulkFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBulkUpload}
                  disabled={!bulkFile || bulkLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-200"
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
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= DETAIL MODAL ============= */}
      {showDetailModal && selectedIntern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className={`bg-gradient-to-r ${getScoreGradient(calculateAverageScore(selectedIntern))} p-5 sticky top-0`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                    {selectedIntern.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedIntern.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                      <FaIdCard className="w-3 h-3" />
                      <span>ID: {(selectedIntern._id || selectedIntern.id || 'N/A').slice(-8)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
                  <FaEnvelope className="w-4 h-4 text-indigo-600" />
                  <div className="truncate">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedIntern.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <FaCalendarAlt className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedIntern.endDate ? new Date(selectedIntern.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl">
                  <FaStar className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-indigo-600">{Math.round(selectedIntern.score) || 0}%</p>
                  <p className="text-xs text-gray-500">Overall</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl">
                  <MdOutlineSchool className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900 truncate">{selectedIntern.course || '-'}</p>
                  <p className="text-xs text-gray-500">Course</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl">
                  <FaUserTie className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900 truncate">{selectedIntern.mentor || '-'}</p>
                  <p className="text-xs text-gray-500">Mentor</p>
                </div>
              </div>

              {/* Performance Metrics */}
             <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaTasks className="w-4 h-4 text-indigo-600" />
                  6 Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Task Completion', multiplier: 7.2 },  // (90/6)*7.2 = 108% (capped at 100)
                    { label: 'Task Quality', multiplier: 6.6 },      // (90/6)*6.6 = 99%
                    { label: 'Deadline Adherence', multiplier: 6.0 }, // (90/6)*6.0 = 90%
                    { label: 'Attendance', multiplier: 5.4 },         // (90/6)*5.4 = 81%
                    { label: 'Mentor Feedback', multiplier: 4.8 },    // (90/6)*4.8 = 72%
                    { label: 'Communication', multiplier: 6.0 }       // (90/6)*6.0 = 90%
                  ].map((metric, idx) => {
                    // Using the exact formula: (average / 6) * multiplier
                    const baseValue = selectedIntern.score / 6;
                    const calculatedValue = Math.min(100, Math.round(baseValue * metric.multiplier));

                    return (
                      <div key={idx}>
                        <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 min-w-[40px]">
                            {calculatedValue}%
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${
                                calculatedValue >= 85 ? 'from-emerald-500 to-emerald-600' :
                                calculatedValue >= 70 ? 'from-blue-500 to-blue-600' :
                                calculatedValue >= 50 ? 'from-amber-500 to-amber-600' :
                                'from-rose-500 to-rose-600'
                              }`}
                              style={{ width: `${calculatedValue}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Average Score Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Average of 6 Metrics:</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${getScoreColor(selectedIntern.score)}`}>
                        {selectedIntern.score}%
                      </span>
                      {getPerformanceBadge(selectedIntern.score)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {(selectedIntern.isCompliantIssue || selectedIntern.isDisciplineIssue) && (
                <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-4 mb-4 border border-rose-200">
                  <p className="text-xs font-semibold text-rose-700 mb-2">Issues Detected:</p>
                  <div className="flex gap-2">
                    {selectedIntern.isCompliantIssue && (
                      <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium border border-amber-200">
                        Compliance Issue
                      </span>
                    )}
                    {selectedIntern.isDisciplineIssue && (
                      <span className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
                        Discipline Issue
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditIntern(selectedIntern);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Intern
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorTask;
