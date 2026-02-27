import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaFilter,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
  FaUserGraduate,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEnvelope,
  FaSpinner
} from 'react-icons/fa';
import {
  uploadLorTemplate,
  generateLorAndSend,
  internsWithLor,
  rejectedInternForLor,
  updateAndSendLor
} from '../../../api';
import { requestHandler } from '../../../utils';
import LORCard from '../../cards/LORCard'
import LORPreviewModal from '../../cards/LORPreviewModal'

function InternsLorRequest() {
  // State Management
  const [interns, setInterns] = useState([]);
  const [rejectedInterns, setRejectedInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showLORPreview, setShowLORPreview] = useState(false);

  // Form State
  const [templateFile, setTemplateFile] = useState(null);
  const [lorFormData, setLorFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientDesignation: '',
    recipientOrganization: '',
    customMessage: '',
    includeScore: true,
    includeProjects: true,
    includeSkills: true
  });

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Animation states
  const [hoveredItem, setHoveredItem] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchInternsWithLOR(),
      fetchRejectedInterns()
    ]);
  };

  const fetchInternsWithLOR = async () => {
    await requestHandler(
      async () => {
        const response = await internsWithLor();
        return response;
      },
      setLoading,
      (res) => {
        const processedInterns = (res.data || []).map(intern => ({
          ...intern,
          lorGenerated: intern.approval?.status === true || false,
          lorGeneratedDate: intern.approval?.updatedAt ?
            new Date(intern.approval.updatedAt).toLocaleDateString() : null,
          lorId: intern._id,
          rejectionReason: intern.approval?.comment || null,
          score: intern.score || '85' // You can modify this logic
        }));
        setInterns(processedInterns);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to fetch interns');
        console.error('Error fetching interns:', err);
      }
    );
  };

  const fetchRejectedInterns = async () => {
    await requestHandler(
      async () => {
        const response = await rejectedInternForLor();
        return response;
      },
      null,
      (res) => {
        const processedRejected = (res.data || []).map(intern => ({
          ...intern,
          rejectionReason: intern.approval?.comment || 'Not specified',
          rejectedAt: intern.approval?.updatedAt
        }));
        setRejectedInterns(processedRejected);
      },
      (err) => {
        console.error('Error fetching rejected interns:', err);
      }
    );
  };

  const handleGenerateLOR = (intern) => {
    setSelectedIntern(intern);
    setLorFormData(prev => ({
      ...prev,
      recipientName: intern.name || '',
      recipientEmail: intern.email || ''
    }));
    setShowGenerateModal(true);
  };

  const handlePreviewLOR = (intern) => {
    setSelectedIntern(intern);
    setShowLORPreview(true);
  };

  const handleDownloadLOR = (intern) => {
    // Implement download logic
    console.log('Downloading LOR for:', intern.name);
  };

  const handleSendEmail = (intern) => {
    // Implement email sending logic
    console.log('Sending email to:', intern.email);
  };

  const handleGenerateAndSend = async () => {
    if (!selectedIntern) return;

    await requestHandler(
      async () => {
        const response = await generateLorAndSend(selectedIntern._id, lorFormData);
        return response;
      },
      setActionLoading,
      (res) => {
        alert('✨ LOR generated and sent successfully!');
        setShowGenerateModal(false);
        fetchAllData();
      },
      (err) => {
        alert('Failed to generate LOR: ' + err.message);
      }
    );
  };

  // Filter and pagination
  const filteredInterns = interns
    .filter(intern => {
      const matchesSearch = searchTerm === '' ||
        intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' ||
        (selectedStatus === 'Generated' && intern.lorGenerated) ||
        (selectedStatus === 'Pending' && !intern.lorGenerated);

      return matchesSearch && matchesStatus;
    });

  const totalPages = Math.ceil(filteredInterns.length / itemsPerPage);
  const paginatedInterns = filteredInterns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: interns.length,
    generated: interns.filter(i => i.lorGenerated).length,
    pending: interns.filter(i => !i.lorGenerated).length,
    rejected: rejectedInterns.length
  };

  if (loading && interns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <FaSpinner className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading LOR requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              LOR Requests
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-lg">
                {filteredInterns.length} Total
              </span>
            </h1>
            <p className="text-indigo-100 mt-2 flex items-center gap-2">
              <FaRocket className="w-4 h-4" />
              Generate and manage Letter of Recommendations
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
            >
              <FaCloudUploadAlt className="w-4 h-4" />
              <span>Upload Template</span>
            </button>
            <button
              onClick={() => setShowRejectedModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all relative"
            >
              <FaExclamationTriangle className="w-4 h-4" />
              <span>Rejected</span>
              {stats.rejected > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.rejected}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total', value: stats.total, icon: FaUserGraduate, color: 'white' },
            { label: 'Generated', value: stats.generated, icon: FaCheckCircle, color: 'text-green-200' },
            { label: 'Pending', value: stats.pending, icon: FaClock, color: 'text-yellow-200' },
            { label: 'Rejected', value: stats.rejected, icon: FaTimesCircle, color: 'text-red-200' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-indigo-100 text-xs">{stat.label}</p>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-200"
          >
            <option value="All">All Status</option>
            <option value="Generated">LOR Generated</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedInterns.map((intern) => (
          <LORCard
            key={intern._id}
            intern={intern}
            onGenerate={handleGenerateLOR}
            onPreview={handlePreviewLOR}
            onDownload={handleDownloadLOR}
            onSendEmail={handleSendEmail}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredInterns.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <FaSearch className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No interns found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination */}
      {filteredInterns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInterns.length)} of {filteredInterns.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-all ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 text-indigo-600'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'hover:bg-indigo-50 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-all ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 text-indigo-600'
                }`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && selectedIntern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl">
              <h3 className="text-white font-bold">Generate LOR for {selectedIntern.name}</h3>
            </div>
            <div className="p-4">
              {/* Add your form fields here */}
              <button
                onClick={handleGenerateAndSend}
                disabled={actionLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl"
              >
                {actionLoading ? 'Generating...' : 'Generate & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOR Preview Modal */}
      <LORPreviewModal
        isOpen={showLORPreview}
        onClose={() => setShowLORPreview(false)}
        intern={selectedIntern}
        lorFormData={lorFormData}
      />
    </div>
  );
}

export default InternsLorRequest;
