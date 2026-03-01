import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FaSearch,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
  FaUserGraduate,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSpinner,
  FaSync,
  FaEnvelope,
  FaFilter,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaComment,
  FaUsers,
  FaBan,
  FaUndo,
  FaChevronDown,
  FaThLarge,
  FaList,
  FaEye
} from 'react-icons/fa';
import {
  uploadLorTemplate,
  generateLorAndSend,
  internsWithLor,
  rejectedInternForLor,
  rejectToGenLor,
  bulkUploadInternForGenLor,
  internsWithNoLor,
  updateAndSendLor
} from '../../../api';
import { requestHandler } from '../../../utils';
import LORCard from '../../cards/LORCard';
import LORFormModal from '../../form/LORFormModal';
import TemplateUploadModal from '../../form/TemplateUploadModal';
import {toast} from 'react-hot-toast'

// ==================== CONSTANTS ====================
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status', color: 'gray', icon: FaFilter },
  { value: 'generated', label: 'LOR Generated', color: 'green', icon: FaCheckCircle },
  { value: 'pending', label: 'Pending', color: 'yellow', icon: FaClock },
  { value: 'rejected', label: 'Rejected', color: 'red', icon: FaTimesCircle }
];

const ITEMS_PER_PAGE = 12;

// View options
const VIEW_OPTIONS = {
  CARD: 'card',
  LIST: 'list'
};

// 👇 SUGGESTION MESSAGES FOR REJECTION
const REJECTION_SUGGESTIONS = [
  "Hi [Name], thank you for your request. I regret to inform you that I will not be able to provide a Letter of Recommendation for you. I wish you the best in your future endeavors.",
  "Hello [Name], I appreciate you reaching out. After careful consideration, I must decline your request for a Letter of Recommendation.",
  "Hi [Name], thank you for considering me. Unfortunately, I am unable to write a Letter of Recommendation for you at this time.",
  "Hello [Name], I’m sorry, but I will not be able to provide a Letter of Recommendation. I hope you understand.",
  "Hi [Name], I appreciate your request. However, I must respectfully decline writing a Letter of Recommendation for you.",
  "Hello [Name], thank you for reaching out. I am not able to provide a Letter of Recommendation on your behalf.",
  "Hi [Name], after consideration, I will have to decline your request for a Letter of Recommendation.",
  "Hello [Name], I regret to inform you that I cannot provide a Letter of Recommendation for you.",
  "Hi [Name], thank you for your message. I am unable to support your request for a Letter of Recommendation.",
  "Hello [Name], I appreciate your interest, but I must decline your request for a Letter of Recommendation."
];

// ==================== UTILITY FUNCTIONS ====================
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return null;
  }
};

// Function to get status badge color
const getStatusBadge = (status) => {
  switch(status) {
    case 'generated':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const InternsLorRequest = () => {
  // ==================== STATE MANAGEMENT ====================
  // Separate states for each type of interns
  const [generatedInterns, setGeneratedInterns] = useState([]);
  const [pendingInterns, setPendingInterns] = useState([]);
  const [rejectedInterns, setRejectedInterns] = useState([]);

  const [selectedIntern, setSelectedIntern] = useState(null);
  const [sendingEmailFor, setSendingEmailFor] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [bulkUploadResult, setBulkUploadResult] = useState(null);

  // View state
  const [viewMode, setViewMode] = useState(VIEW_OPTIONS.CARD);

  // State for rejection confirmation and suggestions
  const [showRejectionConfirm, setShowRejectionConfirm] = useState(false);
  const [rejectingIntern, setRejectingIntern] = useState(null);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const [customRejectionMessage, setCustomRejectionMessage] = useState('');

  // State for update confirmation (for rejected interns)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [updatingIntern, setUpdatingIntern] = useState(null);

  // State for resend email confirmation
  const [showResendConfirm, setShowResendConfirm] = useState(false);
  const [resendIntern, setResendIntern] = useState(null);

  // State for generate LOR for rejected intern confirmation
  const [showGenerateRejectedConfirm, setShowGenerateRejectedConfirm] = useState(false);
  const [generateRejectedIntern, setGenerateRejectedIntern] = useState(null);

  // Hover state for cards
  const [hoveredItem, setHoveredItem] = useState(null);

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState({
    initial: true,
    action: false,
    template: false,
    bulk: false,
    generated: false,
    pending: false,
    rejected: false
  });

  const [error, setError] = useState(null);

  const [modals, setModals] = useState({
    generate: false,
    rejection: false,
    template: false,
    rejected: false
  });

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientDesignation: '',
    recipientOrganization: '',
    customMessage: '',
    includeScore: true,
    includeProjects: true,
    includeSkills: true
  });

  const [rejectionData, setRejectionData] = useState({
    status: false,
    comment: ''
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    department: '',
    domain: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE
  });

  // ==================== NOTIFICATION HANDLER ====================

  // ==================== API CALLS ====================

  // 1. Fetch Generated LOR Interns
  const fetchGeneratedInterns = async () => {
    setLoading(prev => ({ ...prev, generated: true }));

    await requestHandler(
      () => internsWithLor(),
      null,
      (res) => {
        const processed = (res.data || []).map(intern => ({
          ...intern,
          id: intern._id,
          name: intern.name || intern.username || 'N/A',
          username: intern.username || intern.email?.split('@')[0] || 'N/A',
          email: intern.email || 'N/A',
          department: intern.department || 'N/A',
          domain: intern.internshipDomain || intern.course || 'Not specified',
          endDate: intern.endDate || null,
          status: 'generated',
          lorGenerated: true,
          lorGeneratedDate: intern.updatedAt ? formatDateTime(intern.updatedAt) : null,
          lorId: intern._id,
          score: intern.score || 'N/A',
          approval: intern.approval,
          emailSentCount: intern.emailSentCount || 0,
          lastEmailSent: intern.lastEmailSent || null,
          previewUrl: intern.previewUrl || null
        }));
        setGeneratedInterns(processed);
      },
      (err) => {
        console.error('Error fetching generated interns:', err);
        toast.success('error', 'Failed to fetch generated LOR interns');
      }
    );

    setLoading(prev => ({ ...prev, generated: false }));
  };

  // 2. Fetch Pending LOR Interns
  const fetchPendingInterns = async () => {
    setLoading(prev => ({ ...prev, pending: true }));

    await requestHandler(
      () => internsWithNoLor(),
      null,
      (res) => {
        const processed = (res.data || []).map(intern => ({
          ...intern,
          id: intern._id,
          name: intern.name || intern.username || 'N/A',
          username: intern.username || intern.email?.split('@')[0] || 'N/A',
          email: intern.email || 'N/A',
          department: intern.department || 'N/A',
          domain: intern.internshipDomain || intern.course || 'Not specified',
          endDate: intern.endDate || null,
          status: 'pending',
          lorGenerated: false,
          score: intern.score || 'N/A',
          approval: intern.approval
        }));
        setPendingInterns(processed);
      },
      (err) => {
        console.error('Error fetching pending interns:', err);
        toast.success('error', 'Failed to fetch pending LOR interns');
      }
    );

    setLoading(prev => ({ ...prev, pending: false }));
  };

  // 3. Fetch Rejected LOR Interns
  const fetchRejectedInterns = async () => {
    setLoading(prev => ({ ...prev, rejected: true }));

    await requestHandler(
      () => rejectedInternForLor(),
      null,
      (res) => {
        const processed = (res.data || []).map(intern => ({
          ...intern,
          id: intern._id,
          name: intern.name || intern.username || 'N/A',
          username: intern.username || intern.email?.split('@')[0] || 'N/A',
          email: intern.email || 'N/A',
          department: intern.department || 'N/A',
          domain: intern.internshipDomain || intern.course || 'Not specified',
          endDate: intern.endDate || null,
          status: 'rejected',
          lorGenerated: false,
          rejectionReason: intern.approval?.comment || intern.rejectionReason || 'No reason provided',
          rejectedAt: intern.updatedAt ? formatDateTime(intern.updatedAt) : null,
          rejectedBy: intern.approval?.approvedBy || 'System',
          score: intern.score || 'N/A',
          approval: intern.approval
        }));
        setRejectedInterns(processed);
      },
      (err) => {
        console.error('Error fetching rejected interns:', err);
        toast.success('error', 'Failed to fetch rejected LOR interns');
      }
    );

    setLoading(prev => ({ ...prev, rejected: false }));
  };

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(prev => ({ ...prev, initial: true }));
    setError(null);

    try {
      await Promise.all([
        fetchGeneratedInterns(),
        fetchPendingInterns(),
        fetchRejectedInterns()
      ]);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Fetch error:', err);
      toast.success('error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, [toast.success]);

  // ==================== COMBINED INTERNS FOR DISPLAY ====================
  const allInterns = useMemo(() => {
    return [...generatedInterns, ...pendingInterns, ...rejectedInterns];
  }, [generatedInterns, pendingInterns, rejectedInterns]);

  const filteredInterns = useMemo(() => {
    return allInterns.filter(intern => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search ||
        intern.name?.toLowerCase().includes(searchTerm) ||
        intern.username?.toLowerCase().includes(searchTerm) ||
        intern.email?.toLowerCase().includes(searchTerm) ||
        intern.department?.toLowerCase().includes(searchTerm) ||
        intern.domain?.toLowerCase().includes(searchTerm);

      const matchesStatus = filters.status === 'all' || intern.status === filters.status;

      const matchesDepartment = !filters.department ||
        intern.department?.toLowerCase().includes(filters.department.toLowerCase());

      const matchesDomain = !filters.domain ||
        intern.domain?.toLowerCase().includes(filters.domain.toLowerCase());

      return matchesSearch && matchesStatus && matchesDepartment && matchesDomain;
    });
  }, [allInterns, filters]);

  const paginatedInterns = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredInterns.slice(start, start + pagination.itemsPerPage);
  }, [filteredInterns, pagination]);

  const totalPages = Math.ceil(filteredInterns.length / pagination.itemsPerPage);

  const stats = useMemo(() => ({
    total: allInterns.length,
    generated: generatedInterns.length,
    pending: pendingInterns.length,
    rejected: rejectedInterns.length
  }), [allInterns.length, generatedInterns.length, pendingInterns.length, rejectedInterns.length]);

  // Get unique departments and domains for filters
  const departments = useMemo(() => {
    const depts = new Set(allInterns.map(i => i.department).filter(Boolean));
    return Array.from(depts);
  }, [allInterns]);

  const domains = useMemo(() => {
    const doms = new Set(allInterns.map(i => i.domain).filter(d => d !== 'Not specified'));
    return Array.from(doms);
  }, [allInterns]);

  // ==================== HANDLE GENERATE LOR ====================
  const handleGenerateLOR = (intern) => {
    setSelectedIntern(intern);
    setFormData({
      recipientName: intern.name || '',
      recipientEmail: intern.email || '',
      recipientDesignation: '',
      recipientOrganization: '',
      customMessage: '',
      includeScore: true,
      includeProjects: true,
      includeSkills: true
    });
    setModals(prev => ({ ...prev, generate: true }));
  };

  const handleGenerateAndSend = async () => {
    if (!selectedIntern) return;

    const payload = {
      status: true,
      ...formData
    };

    setLoading(prev => ({ ...prev, action: true }));

    await requestHandler(
      () => generateLorAndSend(selectedIntern._id, payload),
      null,
      () => {
        toast.success('success', `✨ LOR generated and sent successfully to ${selectedIntern.name}`);
        setModals(prev => ({ ...prev, generate: false }));
        setSelectedIntern(null);
        fetchAllData();
      },
      (err) => {
        toast.success('error', 'Failed to generate LOR: ' + err.message);
      }
    );

    setLoading(prev => ({ ...prev, action: false }));
  };

  // ==================== HANDLE REJECT LOR ====================
  const handleRejectLOR = (intern) => {
    setRejectingIntern(intern);
    setShowRejectionConfirm(true);
  };

  const confirmRejection = () => {
    setShowRejectionConfirm(false);
    if (rejectingIntern) {
      const defaultMessage = REJECTION_SUGGESTIONS[0].replace('[Name]', rejectingIntern.name || rejectingIntern.username);
      setRejectionData({
        status: false,
        comment: defaultMessage
      });
      setCustomRejectionMessage(defaultMessage);
      setSelectedIntern(rejectingIntern);
      setModals(prev => ({ ...prev, rejection: true }));
    }
  };

  const cancelRejection = () => {
    setShowRejectionConfirm(false);
    setRejectingIntern(null);
  };

  const handleSuggestionSelect = (suggestion) => {
    const messageWithName = suggestion.replace('[Name]', selectedIntern?.name || selectedIntern?.username || 'Intern');
    setRejectionData(prev => ({ ...prev, comment: messageWithName }));
    setCustomRejectionMessage(messageWithName);
    setShowSuggestionDropdown(false);
  };

  const handleCustomMessageChange = (e) => {
    const message = e.target.value;
    setCustomRejectionMessage(message);
    setRejectionData(prev => ({ ...prev, comment: message }));
  };

  const handleSubmitRejection = async () => {
    if (!selectedIntern) return;

    if (!rejectionData.comment?.trim()) {
      toast.success('error', 'Please provide a rejection reason');
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));

    await requestHandler(
      () => rejectToGenLor(selectedIntern._id, rejectionData),
      null,
      () => {
        toast.success('success', `❌ LOR request rejected for ${selectedIntern.name}`);
        setModals(prev => ({ ...prev, rejection: false }));
        setSelectedIntern(null);
        fetchAllData();
      },
      (err) => {
        toast.success('error', 'Failed to reject LOR: ' + err.message);
      }
    );

    setLoading(prev => ({ ...prev, action: false }));
  };

  // ==================== HANDLE RESEND EMAIL WITH CONFIRMATION ====================
  const handleResendEmailClick = (intern) => {
    setResendIntern(intern);
    setShowResendConfirm(true);
  };

  const confirmResendEmail = async () => {
    if (!resendIntern) return;

    setShowResendConfirm(false);
    setSendingEmailFor(resendIntern._id);

    await requestHandler(
      () => updateAndSendLor(resendIntern._id),
      null,
      () => {
        toast.success('success', `✅ LOR email resent successfully to ${resendIntern.name}`);
        fetchAllData();
      },
      (err) => {
        toast.success('error', 'Failed to resend email: ' + err.message);
      }
    );

    setSendingEmailFor(null);
    setResendIntern(null);
  };

  const cancelResendEmail = () => {
    setShowResendConfirm(false);
    setResendIntern(null);
  };

  // ==================== HANDLE GENERATE LOR FOR REJECTED INTERN WITH CONFIRMATION ====================
  const handleGenerateRejectedClick = (intern) => {
    setGenerateRejectedIntern(intern);
    setShowGenerateRejectedConfirm(true);
  };

  const confirmGenerateRejected = async () => {
    if (!generateRejectedIntern) return;

    setShowGenerateRejectedConfirm(false);
    setLoading(prev => ({ ...prev, action: true }));
    setSendingEmailFor(generateRejectedIntern._id);

    await requestHandler(
      () => updateAndSendLor(generateRejectedIntern._id),
      null,
      () => {
        toast.success('success', `✅ LOR generated and sent successfully to ${generateRejectedIntern.name}`);
        fetchAllData();
      },
      (err) => {
        toast.success('error', 'Failed to generate LOR: ' + err.message);
      }
    );

    setLoading(prev => ({ ...prev, action: false }));
    setSendingEmailFor(null);
    setGenerateRejectedIntern(null);
  };

  const cancelGenerateRejected = () => {
    setShowGenerateRejectedConfirm(false);
    setGenerateRejectedIntern(null);
  };

  // ==================== BULK UPLOAD HANDLER ====================
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      toast.success('error', 'Please upload only Excel or CSV files');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.success('error', 'File size should be less than 10MB');
      return;
    }

    handleBulkUpload(file);
  };

  const handleBulkUpload = async (bulkInternOfLorGen) => {
    const formData = new FormData();
    formData.append('bulkInternOfLorGen', bulkInternOfLorGen);

    setLoading(prev => ({ ...prev, bulk: true }));
    setBulkUploadResult(null);

    await requestHandler(
      () => bulkUploadInternForGenLor(formData),
      null,
      (res) => {
        setBulkUploadResult(res.data);
        toast.success('success', `✅ Bulk upload completed! ${res.data.successCount || 0} interns processed successfully.`);
        fetchAllData();

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      (err) => {
        console.error('Bulk upload error:', err);
        toast.success('error', err.message || 'Failed to upload file. Please check the format and try again.');

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    );

    setLoading(prev => ({ ...prev, bulk: false }));
  };

  // ==================== TEMPLATE UPLOAD HANDLER ====================
  const handleTemplateUpload = async (file) => {
    if (!file) {
      toast.success('error', 'Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('lorTemp', file);

    setLoading(prev => ({ ...prev, template: true }));

    await requestHandler(
      () => uploadLorTemplate(formData),
      null,
      () => {
        toast.success('success', '✅ Template uploaded successfully!');
        setModals(prev => ({ ...prev, template: false }));
      },
      (err) => {
        console.error('Upload error:', err);
        toast.success('error', err.message || 'Failed to upload template. Please try again.');
      }
    );

    setLoading(prev => ({ ...prev, template: false }));
  };

  // ==================== UI HANDLERS ====================
  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDepartmentFilter = (e) => {
    setFilters(prev => ({ ...prev, department: e.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDomainFilter = (e) => {
    setFilters(prev => ({ ...prev, domain: e.target.value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'all', department: '', domain: '' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ==================== LOADING STATE ====================
  if (loading.initial) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <FaSpinner className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading LOR requests...</p>
          <p className="text-sm text-gray-400 mt-2">Fetching generated, pending, and rejected interns</p>
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* ==================== NOTIFICATION ==================== */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <FaCheckCircle />}
            {notification.type === 'error' && <FaExclamationTriangle />}
            {notification.type === 'warning' && <FaExclamationTriangle />}
            {notification.type === 'info' && <FaSpinner className="animate-spin" />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Letter of Recommendation Management
            </h1>
            <p className="text-indigo-100 mt-2 flex items-center gap-2">
              <FaRocket className="w-4 h-4" />
              Manage Generated, Pending, and Rejected LOR requests
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {/* View Toggle */}
            <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setViewMode(VIEW_OPTIONS.CARD)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === VIEW_OPTIONS.CARD
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/20'
                }`}
                title="Card View"
              >
                <FaThLarge className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode(VIEW_OPTIONS.LIST)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === VIEW_OPTIONS.LIST
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/20'
                }`}
                title="List View"
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>

            {/* Bulk Upload Button */}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx,.xls,.csv"
                className="hidden"
                id="bulk-upload-file"
                disabled={loading.bulk}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading.bulk}
                className={`flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all ${
                  loading.bulk ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Bulk upload interns for LOR generation"
              >
                {loading.bulk ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaUsers className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {loading.bulk ? 'Uploading...' : 'Bulk Upload'}
                </span>
              </button>
            </div>

            <button
              onClick={() => setModals(prev => ({ ...prev, template: true }))}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              title="Upload LOR template"
            >
              <FaCloudUploadAlt className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Template</span>
            </button>

            <button
              onClick={() => setModals(prev => ({ ...prev, rejected: true }))}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all relative"
              title="View rejected requests"
            >
              <FaExclamationTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Rejected</span>
              {stats.rejected > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {stats.rejected}
                </span>
              )}
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading.generated || loading.pending || loading.rejected}
              className={`flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all ${
                (loading.generated || loading.pending || loading.rejected) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh data"
            >
              <FaSync className={`w-4 h-4 ${(loading.generated || loading.pending || loading.rejected) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bulk Upload Result Panel */}
        {bulkUploadResult && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FaCheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white font-medium">Upload completed!</span>
                <div className="flex gap-3">
                  <span className="text-sm text-white/80">
                    Processed: <span className="font-bold text-white">{bulkUploadResult.totalCount || 0}</span>
                  </span>
                  <span className="text-sm text-white/80">
                    Success: <span className="font-bold text-green-300">{bulkUploadResult.successCount || 0}</span>
                  </span>
                  {bulkUploadResult.errors?.length > 0 && (
                    <span className="text-sm text-white/80">
                      Errors: <span className="font-bold text-yellow-300">{bulkUploadResult.errors.length}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setBulkUploadResult(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <FaTimesCircle />
              </button>
            </div>

            {bulkUploadResult.errors?.length > 0 && (
              <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-100 mb-2">Errors:</p>
                <div className="max-h-32 overflow-y-auto">
                  {bulkUploadResult.errors.map((error, index) => (
                    <p key={index} className="text-xs text-yellow-100/80 mt-1">
                      • {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-indigo-100 text-sm">Total Interns</p>
              <FaUserGraduate className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-indigo-100 text-sm">Generated</p>
              <FaCheckCircle className="w-4 h-4 text-green-300" />
            </div>
            <p className="text-2xl font-bold mt-1 text-green-300">{stats.generated}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-indigo-100 text-sm">Pending</p>
              <FaClock className="w-4 h-4 text-yellow-300" />
            </div>
            <p className="text-2xl font-bold mt-1 text-yellow-300">{stats.pending}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <p className="text-indigo-100 text-sm">Rejected</p>
              <FaTimesCircle className="w-4 h-4 text-red-300" />
            </div>
            <p className="text-2xl font-bold mt-1 text-red-300">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* ==================== FILTERS ==================== */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, email, department, or domain..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(option => {
              const Icon = option.icon;
              const isActive = filters.status === option.value;

              const getColorClasses = (color) => {
                switch(color) {
                  case 'green':
                    return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
                  case 'yellow':
                    return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
                  case 'red':
                    return 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200';
                  default:
                    return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
                }
              };

              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all border-2 flex items-center gap-2 ${
                    isActive ? getColorClasses(option.color) : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          {departments.length > 0 && (
            <select
              value={filters.department}
              onChange={handleDepartmentFilter}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}

          {domains.length > 0 && (
            <select
              value={filters.domain}
              onChange={handleDomainFilter}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
            >
              <option value="">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          )}
        </div>

        {/* Active Filters Indicator */}
        {(filters.search || filters.status !== 'all' || filters.department || filters.domain) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Active filters:</span>
            {filters.search && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                Search: {filters.search}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
              </span>
            )}
            {filters.department && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                Dept: {filters.department}
              </span>
            )}
            {filters.domain && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                Domain: {filters.domain}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ==================== INTERNS DISPLAY ==================== */}
      {paginatedInterns.length > 0 ? (
        <>
          {/* View Mode Indicator */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {paginatedInterns.length} of {filteredInterns.length} interns
            </p>
            <p className="text-xs text-gray-400">
              {viewMode === VIEW_OPTIONS.CARD ? 'Card View' : 'List View'}
            </p>
          </div>

          {/* Card View */}
          {viewMode === VIEW_OPTIONS.CARD && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedInterns.map((intern) => (
                <LORCard
                  key={intern.id}
                  intern={intern}
                  onGenerate={handleGenerateLOR}
                  onReject={handleRejectLOR}
                  onSendEmail={handleGenerateLOR}
                  onResendEmail={handleResendEmailClick}
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  isSending={sendingEmailFor === intern._id}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === VIEW_OPTIONS.LIST && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name/Username</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Domain</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedInterns.map((intern) => (
                      <tr
                        key={intern.id}
                        className="hover:bg-gray-50 transition-colors"
                        onMouseEnter={() => setHoveredItem(intern._id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{intern.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">@{intern.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{intern.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{intern.department || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{intern.domain}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(intern.endDate)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(intern.status)}`}>
                            {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {intern.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleGenerateLOR(intern)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Generate LOR"
                                >
                                  <FaRocket className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectLOR(intern)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject LOR"
                                >
                                  <FaBan className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {intern.status === 'generated' && (
                              <>
                                <button
                                  onClick={() => handleResendEmailClick(intern)}
                                  disabled={sendingEmailFor === intern._id}
                                  className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
                                    sendingEmailFor === intern._id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  title="Resend Email"
                                >
                                  {sendingEmailFor === intern._id ? (
                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <FaEnvelope className="w-4 h-4" />
                                  )}
                                </button>
                                {intern.previewUrl && (
                                  <button
                                    onClick={() => window.open(intern.previewUrl, '_blank')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Preview LOR"
                                  >
                                    <FaEye className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}

                            {intern.status === 'rejected' && (
                              <button
                                onClick={() => handleGenerateRejectedClick(intern)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Generate LOR for Rejected Intern"
                              >
                                <FaUndo className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <FaSearch className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No interns found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {filters.search || filters.status !== 'all' || filters.department || filters.domain
              ? 'No interns match your current search criteria. Try adjusting your filters.'
              : 'No interns are currently available.'}
          </p>
          {(filters.search || filters.status !== 'all' || filters.department || filters.domain) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ==================== PAGINATION ==================== */}
      {filteredInterns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, filteredInterns.length)}</span>{' '}
              of <span className="font-medium">{filteredInterns.length}</span> results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`p-2 rounded-xl transition-all ${
                  pagination.currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          pagination.currentPage === page
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={i} className="text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === totalPages}
                className={`p-2 rounded-xl transition-all ${
                  pagination.currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700'
                }`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== REJECTION CONFIRMATION DIALOG ==================== */}
      {showRejectionConfirm && rejectingIntern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Confirm Rejection</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to reject LOR request for <span className="font-semibold">{rejectingIntern.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelRejection}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejection}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESEND EMAIL CONFIRMATION DIALOG ==================== */}
      {showResendConfirm && resendIntern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FaEnvelope className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Resend LOR Email</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to resend the LOR email to <span className="font-semibold">{resendIntern.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelResendEmail}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResendEmail}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Resend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GENERATE LOR FOR REJECTED INTERN CONFIRMATION ==================== */}
      {showGenerateRejectedConfirm && generateRejectedIntern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
              <FaUndo className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Generate LOR for Rejected Intern</h3>
            <p className="text-gray-600 text-center mb-6">
              This will generate and send LOR for <span className="font-semibold">{generateRejectedIntern.name}</span>.
              <br />
              <span className="text-xs text-gray-500 mt-2 block">The intern's status will be updated to generated.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelGenerateRejected}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmGenerateRejected}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm & Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== REJECTION MODAL WITH SUGGESTIONS ==================== */}
      {modals.rejection && selectedIntern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-500 to-red-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaBan className="w-5 h-5" />
                Reject LOR Request
              </h2>
              <button
                onClick={() => {
                  setModals(prev => ({ ...prev, rejection: false }));
                  setSelectedIntern(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <FaTimesCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FaUser className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedIntern.name}</p>
                    <p className="text-sm text-gray-500">{selectedIntern.email}</p>
                    <p className="text-xs text-gray-400">@{selectedIntern.username}</p>
                  </div>
                </div>
              </div>

              {/* Suggestion Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a suggestion message
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowSuggestionDropdown(!showSuggestionDropdown)}
                    className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none flex items-center justify-between"
                  >
                    <span className="text-gray-600">Select a rejection message</span>
                    <FaChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showSuggestionDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {REJECTION_SUGGESTIONS.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <p className="text-sm text-gray-700">
                            {suggestion.replace('[Name]', selectedIntern.name || selectedIntern.username)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Message Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or write a custom message
                </label>
                <textarea
                  value={customRejectionMessage}
                  onChange={handleCustomMessageChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none resize-none"
                  placeholder="Enter rejection reason..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModals(prev => ({ ...prev, rejection: false }));
                    setSelectedIntern(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRejection}
                  disabled={loading.action}
                  className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all ${
                    loading.action ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading.action ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaBan className="w-4 h-4" />
                      Reject LOR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Upload Modal */}
      <TemplateUploadModal
        isOpen={modals.template}
        onClose={() => setModals(prev => ({ ...prev, template: false }))}
        onUpload={handleTemplateUpload}
        uploading={loading.template}
      />

      {/* LOR Form Modal */}
      {modals.generate && selectedIntern && (
        <LORFormModal
          isOpen={modals.generate}
          onClose={() => {
            setModals(prev => ({ ...prev, generate: false }));
            setSelectedIntern(null);
          }}
          intern={selectedIntern}
          lorFormData={formData}
          setLorFormData={setFormData}
          onSubmit={handleGenerateAndSend}
          actionLoading={loading.action}
        />
      )}

      {/* Rejected Interns Modal */}
      {modals.rejected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-500 to-red-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaExclamationTriangle className="w-5 h-5" />
                Rejected LOR Requests
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {rejectedInterns.length}
                </span>
              </h2>
              <button
                onClick={() => setModals(prev => ({ ...prev, rejected: false }))}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <FaTimesCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              {rejectedInterns.length > 0 ? (
                <div className="space-y-4">
                  {rejectedInterns.map((intern) => (
                    <div
                      key={intern.id}
                      className="bg-white border border-red-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-red-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaUser className="w-6 h-6 text-red-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{intern.name}</h3>
                              <p className="text-sm text-gray-500">@{intern.username}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Rejected
                              </span>
                              <button
                                onClick={() => {
                                  setModals(prev => ({ ...prev, rejected: false }));
                                  handleGenerateRejectedClick(intern);
                                }}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                              >
                                <FaUndo className="w-3 h-3" />
                                Generate LOR
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaEnvelope className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-500">Email:</span>
                                <span className="text-gray-700 font-medium truncate">{intern.email}</span>
                              </div>

                              {intern.department && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaBuilding className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500">Dept:</span>
                                  <span className="text-gray-700 font-medium">{intern.department}</span>
                                </div>
                              )}

                              {intern.domain && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaRocket className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500">Domain:</span>
                                  <span className="text-gray-700 font-medium">{intern.domain}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              {intern.endDate && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500">End Date:</span>
                                  <span className="text-gray-700 font-medium">
                                    {formatDate(intern.endDate)}
                                  </span>
                                </div>
                              )}

                              {intern.rejectedAt && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FaClock className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500">Rejected:</span>
                                  <span className="text-gray-700 font-medium">{intern.rejectedAt}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-start gap-2">
                              <FaComment className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-red-500 font-medium mb-1">Rejection Reason</p>
                                <p className="text-sm text-gray-700">{intern.rejectionReason}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                    <FaCheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <p className="text-gray-600 font-medium text-lg">No rejected interns found</p>
                  <p className="text-sm text-gray-400 mt-2">All LOR requests are either pending or generated</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InternsLorRequest;
