import React, { useState, useEffect } from 'react';
import {
  addBulkUploadIntern,
  updateBulkUploadIntern,
  addSingleIntern,
  updateSingleIntern,
  getAllInterns,
  generateLorAndSend,
  internsWithLor,
  rejectedInternForLor,
  updateAndSendLor,
} from '../../../api/index';
import {requestHandler} from '../../../utils/index';

const MentorTask = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('add');
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [showRankingsModal, setShowRankingsModal] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Form States
  const [singleInternData, setSingleInternData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    startDate: '',
    endDate: ''
  });

  const [bulkFile, setBulkFile] = useState(null);
  const [lorData, setLorData] = useState({
    internId: '',
    template: '',
    recipientEmail: ''
  });

  const [lorInterns, setLorInterns] = useState([]);
  const [rejectedInterns, setRejectedInterns] = useState([]);

  // Get unique departments for filter
  const departments = [...new Set(interns.map(intern => intern.department).filter(Boolean))];

  // Filter interns based on search and department
  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || intern.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  useEffect(() => {
    fetchAllInterns();
    fetchLorInterns();
    fetchRejectedInterns();
  }, []);

  const fetchAllInterns = () => {
    requestHandler(
      async () => await getAllInterns(),
      setLoading,
      (response) => {
        setInterns(response.data || []);
      },
      (error) => {
        setError(error.message || 'Failed to fetch interns');
      }
    );
  };

  const fetchLorInterns = () => {
    requestHandler(
      async () => await internsWithLor(),
      setLoading,
      (response) => {
        setLorInterns(response.data || []);
      },
      (error) => {
        setError(error.message || 'Failed to fetch LOR interns');
      }
    );
  };

  const fetchRejectedInterns = () => {
    requestHandler(
      async () => await rejectedInternForLor(),
      setLoading,
      (response) => {
        setRejectedInterns(response.data || []);
      },
      (error) => {
        setError(error.message || 'Failed to fetch rejected interns');
      }
    );
  };

  const handleAddSingleIntern = (e) => {
    e.preventDefault();

    requestHandler(
      async () => await addSingleIntern(singleInternData),
      setLoading,
      (response) => {
        setSuccessMessage('✨ Intern added successfully!');
        setSingleInternData({
          name: '',
          email: '',
          phone: '',
          department: '',
          startDate: '',
          endDate: ''
        });
        fetchAllInterns();
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to add intern');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleUpdateSingleIntern = (e) => {
    e.preventDefault();

    if (!selectedIntern) {
      setError('Please select an intern to update');
      return;
    }

    requestHandler(
      async () => await updateSingleIntern(selectedIntern.id, singleInternData),
      setLoading,
      (response) => {
        setSuccessMessage('🔄 Intern updated successfully!');
        setSelectedIntern(null);
        setSingleInternData({
          name: '',
          email: '',
          phone: '',
          department: '',
          startDate: '',
          endDate: ''
        });
        fetchAllInterns();
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to update intern');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleBulkAdd = (e) => {
    e.preventDefault();

    if (!bulkFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', bulkFile);

    requestHandler(
      async () => await addBulkUploadIntern(formData),
      setLoading,
      (response) => {
        setSuccessMessage('📦 Bulk upload completed successfully!');
        setBulkFile(null);
        fetchAllInterns();
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to bulk upload');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleBulkUpdate = (e) => {
    e.preventDefault();

    if (!bulkFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', bulkFile);

    requestHandler(
      async () => await updateBulkUploadIntern(formData),
      setLoading,
      (response) => {
        setSuccessMessage('🔄 Bulk update completed successfully!');
        setBulkFile(null);
        fetchAllInterns();
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to bulk update');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleGenerateLor = (internId) => {
    if (!lorData.template || !lorData.recipientEmail) {
      setError('Please fill in all LOR fields');
      return;
    }

    const payload = {
      template: lorData.template,
      recipientEmail: lorData.recipientEmail
    };

    requestHandler(
      async () => await generateLorAndSend(internId, payload),
      setLoading,
      (response) => {
        setSuccessMessage('📄 LOR generated and sent successfully!');
        setLorData({
          internId: '',
          template: '',
          recipientEmail: ''
        });
        fetchLorInterns();
        fetchRejectedInterns();
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to generate LOR');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleUpdateAndSendLor = (internLorId) => {
    setConfirmationAction({
      type: 'UPDATE_LOR',
      id: internLorId
    });
    setShowConfirmation(true);
  };

  const confirmUpdateAndSendLor = () => {
    if (!confirmationAction) return;

    requestHandler(
      async () => await updateAndSendLor(confirmationAction.id),
      setLoading,
      (response) => {
        setSuccessMessage('📧 LOR updated and sent successfully!');
        fetchLorInterns();
        fetchRejectedInterns();
        setShowConfirmation(false);
        setConfirmationAction(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to update and send LOR');
        setTimeout(() => setError(''), 3000);
      }
    );
  };



  const handleSelectInternForUpdate = (intern) => {
    setSelectedIntern(intern);
    setSingleInternData({
      name: intern.name,
      email: intern.email,
      phone: intern.phone,
      department: intern.department,
      startDate: intern.startDate,
      endDate: intern.endDate
    });
    setActiveTab('update');
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'engineering': 'bg-indigo-100 text-indigo-800',
      'marketing': 'bg-pink-100 text-pink-800',
      'sales': 'bg-orange-100 text-orange-800',
      'hr': 'bg-purple-100 text-purple-800',
      'finance': 'bg-emerald-100 text-emerald-800'
    };
    return colors[department?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Intern Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage interns, generate LORs, and track performance</p>
        </div>

        {/* Success/Error Messages with Icons */}
        {successMessage && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md animate-slideIn">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md animate-slideIn">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation with Icons */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-2">
          <div className="flex space-x-2">
            <button
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('add')}
            >
              <span className="mr-2">➕</span>
              Add Interns
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'update'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('update')}
            >
              <span className="mr-2">🔄</span>
              Update Interns
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'lor'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('lor')}
            >
              <span className="mr-2">📄</span>
              LOR Generation
            </button>
            {/* <button
              className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200"
              onClick={handleViewRankings}
            >
              <span className="mr-2">🏆</span>
              View Rankings
            </button> */}
          </div>
        </div>

        {/* Search and Filter Bar - Only show when there are interns */}
        {interns.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search interns by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="w-64">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4 font-medium">Loading...</p>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to update and send this LOR?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setConfirmationAction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdateAndSendLor}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rankings Modal */}
        {showRankingsModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  🏆 Intern Rankings
                </h3>
                <button
                  onClick={() => setShowRankingsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                {rankings.map((intern, index) => (
                  <div
                    key={intern.id}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      index === 0 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' :
                      index === 1 ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50' :
                      index === 2 ? 'border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-500' :
                          index === 2 ? 'text-amber-700' :
                          'text-gray-400'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{intern.name}</h4>
                          <p className="text-sm text-gray-600">{intern.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">{intern.score}</span>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Interns Tab */}
        {activeTab === 'add' && (
          <div className="space-y-6">
            {/* Single Add Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">👤</span>
                  Add Single Intern
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddSingleIntern} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={singleInternData.name}
                        onChange={(e) => setSingleInternData({...singleInternData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={singleInternData.email}
                        onChange={(e) => setSingleInternData({...singleInternData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={singleInternData.phone}
                        onChange={(e) => setSingleInternData({...singleInternData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        placeholder="Engineering"
                        value={singleInternData.department}
                        onChange={(e) => setSingleInternData({...singleInternData, department: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={singleInternData.startDate}
                        onChange={(e) => setSingleInternData({...singleInternData, startDate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={singleInternData.endDate}
                        onChange={(e) => setSingleInternData({...singleInternData, endDate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    <span className="mr-2">✨</span>
                    Add Single Intern
                  </button>
                </form>
              </div>
            </div>

            {/* Bulk Add Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">📦</span>
                  Bulk Add Interns
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleBulkAdd} className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      id="bulk-file"
                      onChange={(e) => setBulkFile(e.target.files[0])}
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                    />
                    <label htmlFor="bulk-file" className="cursor-pointer">
                      <span className="text-4xl mb-2 block">📎</span>
                      <span className="text-gray-600">
                        {bulkFile ? bulkFile.name : 'Click to select or drag and drop'}
                      </span>
                      <span className="text-sm text-gray-400 block mt-2">
                        Supports: CSV, Excel files
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !bulkFile}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    <span className="mr-2">📤</span>
                    Bulk Upload
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Update Interns Tab */}
        {activeTab === 'update' && (
          <div className="space-y-6">
            {/* Single Update Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">🔄</span>
                  Update Single Intern
                </h2>
              </div>
              <div className="p-6">
                {/* Intern Selection with Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Intern to Update:
                  </label>
                  <select
                    onChange={(e) => {
                      const intern = interns.find(i => i.id === parseInt(e.target.value));
                      if (intern) handleSelectInternForUpdate(intern);
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedIntern?.id || ''}
                  >
                    <option value="">Choose an intern...</option>
                    {filteredInterns.map(intern => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name} - {intern.email} {intern.department ? `(${intern.department})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedIntern && (
                  <form onSubmit={handleUpdateSingleIntern} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={singleInternData.name}
                          onChange={(e) => setSingleInternData({...singleInternData, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          value={singleInternData.email}
                          onChange={(e) => setSingleInternData({...singleInternData, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          value={singleInternData.phone}
                          onChange={(e) => setSingleInternData({...singleInternData, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Department</label>
                        <input
                          type="text"
                          value={singleInternData.department}
                          onChange={(e) => setSingleInternData({...singleInternData, department: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          value={singleInternData.startDate}
                          onChange={(e) => setSingleInternData({...singleInternData, startDate: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <input
                          type="date"
                          value={singleInternData.endDate}
                          onChange={(e) => setSingleInternData({...singleInternData, endDate: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium shadow-lg"
                      >
                        <span className="mr-2">💾</span>
                        Update Intern
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIntern(null);
                          setSingleInternData({
                            name: '',
                            email: '',
                            phone: '',
                            department: '',
                            startDate: '',
                            endDate: ''
                          });
                        }}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Bulk Update Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">📦</span>
                  Bulk Update Interns
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleBulkUpdate} className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors">
                    <input
                      type="file"
                      id="bulk-update-file"
                      onChange={(e) => setBulkFile(e.target.files[0])}
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                    />
                    <label htmlFor="bulk-update-file" className="cursor-pointer">
                      <span className="text-4xl mb-2 block">📎</span>
                      <span className="text-gray-600">
                        {bulkFile ? bulkFile.name : 'Click to select update file'}
                      </span>
                      <span className="text-sm text-gray-400 block mt-2">
                        Upload CSV or Excel file with updated data
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !bulkFile}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    <span className="mr-2">🔄</span>
                    Bulk Update
                  </button>
                </form>
              </div>
            </div>

            {/* Interns List Preview */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  Interns List ({filteredInterns.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInterns.slice(0, 5).map(intern => (
                        <tr key={intern.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-800">{intern.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{intern.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${getDepartmentColor(intern.department)}`}>
                              {intern.department || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(intern.status)}`}>
                              {intern.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleSelectInternForUpdate(intern)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredInterns.length > 5 && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Showing 5 of {filteredInterns.length} interns
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOR Generation Tab */}
        {activeTab === 'lor' && (
          <div className="space-y-6">
            {/* Generate LOR Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">📄</span>
                  Generate LOR
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Select Intern:</label>
                      <select
                        onChange={(e) => setLorData({...lorData, internId: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={lorData.internId}
                      >
                        <option value="">Choose an intern...</option>
                        {interns.map(intern => (
                          <option key={intern.id} value={intern.id}>
                            {intern.name} - {intern.department || 'No Department'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Recipient Email:</label>
                      <input
                        type="email"
                        value={lorData.recipientEmail}
                        onChange={(e) => setLorData({...lorData, recipientEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="recipient@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">LOR Template:</label>
                    <textarea
                      value={lorData.template}
                      onChange={(e) => setLorData({...lorData, template: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="5"
                      placeholder="Dear [Recipient],&#10;&#10;I am pleased to recommend [Intern Name] who completed their internship with us...&#10;&#10;Sincerely,&#10;[Your Name]"
                    />
                  </div>

                  <button
                    onClick={() => handleGenerateLor(lorData.internId)}
                    disabled={loading || !lorData.internId || !lorData.template || !lorData.recipientEmail}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    <span className="mr-2">📧</span>
                    Generate & Send LOR
                  </button>
                </div>
              </div>
            </div>

            {/* Interns with LOR */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">✅</span>
                  Interns with LOR ({lorInterns.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Sent Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {lorInterns.map(intern => (
                        <tr key={intern.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{intern.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{intern.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(intern.lorStatus)}`}>
                              {intern.lorStatus || 'Generated'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {intern.sentDate ? new Date(intern.sentDate).toLocaleDateString() : 'Not sent'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleUpdateAndSendLor(intern.lorId)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                            >
                              <span className="mr-1">🔄</span>
                              Update & Send
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rejected Interns for LOR */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">❌</span>
                  Rejected Interns ({rejectedInterns.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Reason</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rejectedInterns.map(intern => (
                        <tr key={intern.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{intern.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{intern.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <span className="text-red-600">{intern.rejectionReason}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => {
                                setLorData({...lorData, internId: intern.id});
                                setActiveTab('lor');
                                // Scroll to form
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                            >
                              <span className="mr-1">🔄</span>
                              Retry
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MentorTask;
