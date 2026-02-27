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
  FaPlus,
  FaFileExcel,
  FaTimes,
  FaUser,
  FaFlag,
  FaExclamationTriangle,
  FaUserTie
} from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import {
  getAllInterns,
  addBulkUploadIntern,
  updateBulkUploadIntern,
  addSingleIntern,
  updateSingleIntern,
  scoreRankingInterns
} from '../../../api';
import { requestHandler } from '../../../utils';
import InternCard from '../../cards/InternCard'

function Interns() {
  // State Management
  const [interns, setInterns] = useState([]);
  const [rankingData, setRankingData] = useState([]);

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
  const [showAddInternModal, setShowAddInternModal] = useState(false);
  const [showEditInternModal, setShowEditInternModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [bulkUploadType, setBulkUploadType] = useState('add');

  // Form State
  const [internFormData, setInternFormData] = useState({
    name: '',
    email: '',
    department: '',
    score: '',
    duration: '',
    batch: '',
    status: 'Pending',
    gender: '',
    course: '',
    mentor: '',
    endDate: '',
    isActive: true,
    isCompliantIssue: false,
    isDisciplineIssue: false
  });

  const [bulkFile, setBulkFile] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchInterns(),
      fetchRankingData()
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
        const roundedData = res.data.map(intern => ({
          ...intern,
          score: intern.score ? Math.round(intern.score) : 0
        }));
        setInterns(roundedData);
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
        const roundedData = res.data.map(item => ({
          ...item,
          score: item.score ? Math.round(item.score) : 0
        }));
        setRankingData(roundedData);
      },
      (err) => {
        console.error('Error fetching ranking data:', err);
      }
    );
  };

  const handleAddSingleIntern = async () => {
    const payload = {
      ...internFormData,
      score: parseInt(internFormData.score) || 0
    };

    await requestHandler(
      async () => {
        const response = await addSingleIntern(payload);
        return response;
      },
      setBulkLoading,
      () => {
        alert('Intern added successfully!');
        setShowAddInternModal(false);
        resetForm();
        fetchInterns();
      },
      (err) => {
        alert('Failed to add intern: ' + err.message);
      }
    );
  };

  const handleUpdateSingleIntern = async () => {
    const internId = selectedIntern?.id || selectedIntern?._id;
    if (!internId) return;

    const payload = {
      ...internFormData,
      score: parseInt(internFormData.score) || 0
    };

    await requestHandler(
      async () => {
        const response = await updateSingleIntern(internId, payload);
        return response;
      },
      setBulkLoading,
      () => {
        alert('Intern updated successfully!');
        setShowEditInternModal(false);
        setSelectedIntern(null);
        resetForm();
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
    formData.append('file', bulkFile);

    await requestHandler(
      async () => {
        const response = bulkUploadType === 'add'
          ? await addBulkUploadIntern(formData)
          : await updateBulkUploadIntern(formData);
        return response;
      },
      setBulkLoading,
      () => {
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

  const handleEmailIntern = (intern) => {
    window.location.href = `mailto:${intern.email}`;
  };

  const openEditModal = (intern) => {
    setSelectedIntern(intern);
    setInternFormData({
      name: intern.name || '',
      email: intern.email || '',
      department: intern.department || '',
      score: intern.score || '',
      duration: intern.duration || '',
      batch: intern.batch || '',
      status: intern.status || 'Pending',
      gender: intern.gender || '',
      course: intern.course || '',
      mentor: intern.mentor || '',
      endDate: intern.endDate || '',
      isActive: intern.isActive !== undefined ? intern.isActive : true,
      isCompliantIssue: intern.isCompliantIssue || false,
      isDisciplineIssue: intern.isDisciplineIssue || false
    });
    setShowEditInternModal(true);
  };

  const resetForm = () => {
    setInternFormData({
      name: '',
      email: '',
      department: '',
      score: '',
      duration: '',
      batch: '',
      status: 'Pending',
      gender: '',
      course: '',
      mentor: '',
      endDate: '',
      isActive: true,
      isCompliantIssue: false,
      isDisciplineIssue: false
    });
  };

  const departments = ['All', ...new Set(interns.map(intern => intern.department).filter(Boolean))];
  const statuses = ['All', 'Approve', 'Rejected', 'Pending'];

  const filteredInterns = interns
    .filter(intern => {
      const matchesSearch = searchTerm === '' ||
        intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All' || intern.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || intern.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
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

  const stats = {
    total: interns.length,
    approved: interns.filter(i => i.status === 'Approve').length,
    rejected: interns.filter(i => i.status === 'Rejected').length,
    pending: interns.filter(i => i.status === 'Pending').length,
    averageScore: interns.length > 0
      ? Math.round(interns.reduce((acc, i) => acc + (i.score || 0), 0) / interns.length)
      : 0
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
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

  const getScoreColor = (score) => {
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'text-teal-600';
    if (roundedScore >= 70) return 'text-teal-500';
    if (roundedScore >= 50) return 'text-teal-400';
    return 'text-gray-500';
  };

  const refreshInterns = () => {
    fetchAllData();
  };

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
            onClick={refreshInterns}
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
      {/* Header */}
      <div className="bg-teal-600 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Interns Management</h1>
            <p className="text-teal-100 mt-1 text-sm">Manage and monitor all your interns</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setShowRankingModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm"
            >
              <FaTrophy className="w-4 h-4" />
              Rankings
            </button>
            <button
              onClick={() => {
                setBulkUploadType('add');
                setShowBulkUploadModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm"
            >
              <FaCloudUploadAlt className="w-4 h-4" />
              Bulk Upload
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowAddInternModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 text-sm"
            >
              <FaUserPlus className="w-4 h-4" />
              Add Intern
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          <div className="bg-teal-700 rounded-lg p-3">
            <p className="text-teal-200 text-xs">Total</p>
            <p className="text-xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-teal-700 rounded-lg p-3">
            <p className="text-teal-200 text-xs">Approved</p>
            <p className="text-xl font-bold text-white">{stats.approved}</p>
          </div>
          <div className="bg-teal-700 rounded-lg p-3">
            <p className="text-teal-200 text-xs">Rejected</p>
            <p className="text-xl font-bold text-white">{stats.rejected}</p>
          </div>
          <div className="bg-teal-700 rounded-lg p-3">
            <p className="text-teal-200 text-xs">Pending</p>
            <p className="text-xl font-bold text-white">{stats.pending}</p>
          </div>
          <div className="bg-teal-700 rounded-lg p-3">
            <p className="text-teal-200 text-xs">Avg. Score</p>
            <p className="text-xl font-bold text-white">{stats.averageScore}%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex-1 flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <FaThLarge className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <FaList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedInterns.map((intern) => (
            <InternCard
              key={intern._id || intern.id}
              intern={intern}
              onView={(intern) => setSelectedIntern(intern)}
              onEdit={(intern) => openEditModal(intern)}
              onEmail={(intern) => handleEmailIntern(intern)}
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
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 font-medium text-gray-700">
                      Name {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button onClick={() => handleSort('department')} className="flex items-center gap-1 font-medium text-gray-700">
                      Department {getSortIcon('department')}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">Course</th>
                  <th className="py-3 px-4 text-left">
                    <button onClick={() => handleSort('score')} className="flex items-center gap-1 font-medium text-gray-700">
                      Score {getSortIcon('score')}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">Mentor</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInterns.map((intern) => (
                  <tr key={intern._id || intern.id} className="border-t hover:bg-gray-50">
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
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                        {intern.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{intern.course || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={getScoreColor(intern.score)}>
                        {Math.round(intern.score)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{intern.mentor || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {getStatusBadge(intern.status)}
                        {!intern.isActive && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedIntern(intern)}
                          className="p-1.5 hover:bg-teal-100 rounded"
                          title="View"
                        >
                          <FaEye className="w-4 h-4 text-teal-600" />
                        </button>
                        <button
                          onClick={() => openEditModal(intern)}
                          className="p-1.5 hover:bg-teal-100 rounded"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4 text-teal-600" />
                        </button>
                        <button
                          onClick={() => handleEmailIntern(intern)}
                          className="p-1.5 hover:bg-teal-100 rounded"
                          title="Email"
                        >
                          <FaEnvelope className="w-4 h-4 text-teal-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredInterns.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInterns.length)} of {filteredInterns.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-300' : 'hover:bg-teal-100 text-teal-600'}`}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded text-sm ${
                    currentPage === i + 1 ? 'bg-teal-600 text-white' : 'hover:bg-teal-100 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-300' : 'hover:bg-teal-100 text-teal-600'}`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddInternModal || showEditInternModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-600 p-4 sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  {showAddInternModal ? 'Add New Intern' : 'Edit Intern'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddInternModal(false);
                    setShowEditInternModal(false);
                    setSelectedIntern(null);
                    resetForm();
                  }}
                  className="p-1 hover:bg-teal-700 rounded"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={internFormData.name}
                    onChange={(e) => setInternFormData({ ...internFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={internFormData.email}
                    onChange={(e) => setInternFormData({ ...internFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={internFormData.gender}
                    onChange={(e) => setInternFormData({ ...internFormData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={internFormData.department}
                    onChange={(e) => setInternFormData({ ...internFormData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={internFormData.course}
                    onChange={(e) => setInternFormData({ ...internFormData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mentor</label>
                  <input
                    type="text"
                    value={internFormData.mentor}
                    onChange={(e) => setInternFormData({ ...internFormData, mentor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                  <input
                    type="number"
                    value={internFormData.score}
                    onChange={(e) => setInternFormData({ ...internFormData, score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={internFormData.endDate ? internFormData.endDate.split('T')[0] : ''}
                    onChange={(e) => setInternFormData({ ...internFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={internFormData.duration}
                    onChange={(e) => setInternFormData({ ...internFormData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={internFormData.batch}
                    onChange={(e) => setInternFormData({ ...internFormData, batch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={internFormData.status}
                    onChange={(e) => setInternFormData({ ...internFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approve">Approve</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={internFormData.isActive === true}
                        onChange={() => setInternFormData({ ...internFormData, isActive: true })}
                        className="text-teal-600"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={internFormData.isActive === false}
                        onChange={() => setInternFormData({ ...internFormData, isActive: false })}
                        className="text-teal-600"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={internFormData.isCompliantIssue}
                    onChange={(e) => setInternFormData({ ...internFormData, isCompliantIssue: e.target.checked })}
                    className="rounded text-teal-600"
                  />
                  <span className="text-sm">Compliance Issue</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={internFormData.isDisciplineIssue}
                    onChange={(e) => setInternFormData({ ...internFormData, isDisciplineIssue: e.target.checked })}
                    className="rounded text-teal-600"
                  />
                  <span className="text-sm">Discipline Issue</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  onClick={showAddInternModal ? handleAddSingleIntern : handleUpdateSingleIntern}
                  disabled={bulkLoading || !internFormData.name || !internFormData.email}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm disabled:opacity-50"
                >
                  {bulkLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      {showAddInternModal ? 'Adding...' : 'Updating...'}
                    </span>
                  ) : (
                    showAddInternModal ? 'Add Intern' : 'Update Intern'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddInternModal(false);
                    setShowEditInternModal(false);
                    setSelectedIntern(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-teal-600 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Bulk {bulkUploadType === 'add' ? 'Upload' : 'Update'}
                </h3>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkFile(null);
                  }}
                  className="p-1 hover:bg-teal-700 rounded"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setBulkUploadType('add')}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    bulkUploadType === 'add'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={() => setBulkUploadType('update')}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    bulkUploadType === 'update'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Update
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaFileExcel className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload Excel or CSV file
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
                  className="inline-block px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm cursor-pointer hover:bg-teal-700"
                >
                  Choose File
                </label>
                {bulkFile && (
                  <p className="mt-2 text-xs text-gray-600">
                    Selected: {bulkFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleBulkUpload}
                  disabled={!bulkFile || bulkLoading}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm disabled:opacity-50"
                >
                  {bulkLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    bulkUploadType === 'add' ? 'Upload' : 'Update'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rankings Modal */}
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
                  className="p-1 hover:bg-teal-700 rounded"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {rankingData.length > 0 ? (
                <div className="space-y-2">
                  {rankingData.map((intern, index) => (
                    <div
                      key={intern.id || intern._id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                        index === 0 ? 'bg-teal-600 text-white' :
                        index === 1 ? 'bg-teal-500 text-white' :
                        index === 2 ? 'bg-teal-400 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{intern.name}</h3>
                        <p className="text-xs text-gray-500">{intern.department}</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(intern.score)}`}>
                          {Math.round(intern.score)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaTrophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No ranking data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIntern && !showEditInternModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="bg-teal-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-teal-600 font-bold text-xl">
                    {selectedIntern.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white">{selectedIntern.name}</h2>
                    <p className="text-sm text-teal-100">{selectedIntern.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntern(null)}
                  className="p-1 hover:bg-teal-700 rounded"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg">
                  <FaEnvelope className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{selectedIntern.email}</p>
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

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaStar className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-teal-600">{Math.round(selectedIntern.score)}%</p>
                  <p className="text-xs text-gray-500">Score</p>
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

              {(selectedIntern.isCompliantIssue || selectedIntern.isDisciplineIssue) && (
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Issues:</p>
                  <div className="flex gap-2">
                    {selectedIntern.isCompliantIssue && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        Compliance
                      </span>
                    )}
                    {selectedIntern.isDisciplineIssue && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        Discipline
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEmailIntern(selectedIntern)}
                  className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center justify-center gap-2"
                >
                  <MdOutlineEmail className="w-4 h-4" />
                  Send Email
                </button>
                <button
                  onClick={() => {
                    setSelectedIntern(null);
                    openEditModal(selectedIntern);
                  }}
                  className="flex-1 px-3 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm flex items-center justify-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredInterns.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FaUserGraduate className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No interns found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default Interns;
