import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FaCheckCircle,
  FaClock,
  FaRocket,
  FaTimesCircle,
  FaUserGraduate
} from 'react-icons/fa';
import {
  allInternsWithNoLor,
  bulkUploadInternForGenLor,
  eligibleInternsForLOR,
  generateLorAndSend,
  internsWithLor,
  rejectedInternForLor,
  rejectToGenLor,
  updateAndSendLor,
  uploadLorTemplate,
} from '../../../api';
import { requestHandler } from '../../../utils';
// Import all components
import ConfirmationModal from '../../cards/ConfirmationModal';
import ErrorMessage from '../../cards/ErrorMessage';
import HeaderActions from '../../cards/HeaderActions';
import LoadingSpinner from '../../cards/LoadingSpinner';
import LORCard from '../../cards/LORCard';
import LORListView from '../../cards/LORListView';
import Pagination from '../../cards/Pagination';
import RejectedInternsModal from '../../cards/RejectedInternsModal';
import SearchFilter from '../../cards/SearchFilter';
import ShortlistedModal from '../../cards/ShortlistedModal';
import StatsCard from '../../cards/StatsCard';
import LORFormModal from '../../form/LORFormModal';
import RejectionModal from '../../form/RejectionModal';
import TemplateUploadModal from '../../form/TemplateUploadModal';

// Import constants and utils
import {
  formatDateTime,
  ITEMS_PER_PAGE,
  REJECTION_SUGGESTIONS,
  STATUS_OPTIONS,
  VIEW_OPTIONS
} from '../../../utils/lorUtils';

const InternsLorRequest = () => {
  // ==================== STATE MANAGEMENT ====================
  const [generatedInterns, setGeneratedInterns] = useState([]);
  const [pendingInterns, setPendingInterns] = useState([]);
  const [rejectedInterns, setRejectedInterns] = useState([]);
  const [eligibleInterns, setEligibleInterns] = useState([]);

  const [selectedIntern, setSelectedIntern] = useState(null);
  const [sendingEmailFor, setSendingEmailFor] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);

  const [viewMode, setViewMode] = useState(VIEW_OPTIONS.CARD);
  const [hoveredItem, setHoveredItem] = useState(null);
  const fileInputRef = useRef(null);

  // Modal states
  const [showShortlistedModal, setShowShortlistedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showRejectionConfirm, setShowRejectionConfirm] = useState(false);
  const [showResendConfirm, setShowResendConfirm] = useState(false);
  const [showGenerateRejectedConfirm, setShowGenerateRejectedConfirm] = useState(false);

  const [rejectingIntern, setRejectingIntern] = useState(null);
  const [resendIntern, setResendIntern] = useState(null);
  const [generateRejectedIntern, setGenerateRejectedIntern] = useState(null);

  const [loading, setLoading] = useState({
    initial: true,
    action: false,
    template: false,
    bulk: false,
    generated: false,
    pending: false,
    rejected: false,
    eligible: false
  });

  const [error, setError] = useState(null);

  const [modals, setModals] = useState({
    generate: false,
    rejection: false,
    template: false
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

  // ==================== API CALLS ====================

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
        toast.error('Failed to fetch generated LOR interns');
      }
    );

    setLoading(prev => ({ ...prev, generated: false }));
  };

  const fetchPendingInterns = async () => {
    setLoading(prev => ({ ...prev, pending: true }));

    await requestHandler(
      () => eligibleInternsForLOR(),
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
        toast.error('Failed to fetch pending LOR interns');
      }
    );

    setLoading(prev => ({ ...prev, pending: false }));
  };

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
        toast.error('Failed to fetch rejected LOR interns');
      }
    );

    setLoading(prev => ({ ...prev, rejected: false }));
  };

  const fetchEligibleInterns = async () => {
    setLoading(prev => ({ ...prev, eligible: true }));

    await requestHandler(
      () => allInternsWithNoLor(),
      null,
      (res) => {
        const processed = (res.data || []).map(intern => ({
          ...intern,
          id: intern._id,
          name: intern.name || 'N/A',
          username: intern.username || intern.email?.split('@')[0] || 'N/A',
          email: intern.email || 'N/A',
          department: intern.department || 'N/A',
          domain: intern.course || 'Not specified',
          endDate: intern.endDate || null,
          startDate: intern.startDate || null,
          status: 'eligible',
          lorGenerated: false,
          score: intern.score || 'N/A',
          mentor: intern.mentor || 'Not assigned',
          course: intern.course || 'Not specified',
          isActive: intern.isActive,
          isCompliantIssue: intern.isCompliantIssue,
          isDisciplineIssue: intern.isDisciplineIssue
        }));
        setEligibleInterns(processed);
      },
      (err) => {
        console.error('Error fetching eligible interns:', err);
        toast.error('Failed to fetch eligible interns');
      }
    );

    setLoading(prev => ({ ...prev, eligible: false }));
  };

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
      toast.error('Failed to fetch data. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, []);

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
    rejected: rejectedInterns.length,
    eligible: eligibleInterns.length
  }), [allInterns, generatedInterns, pendingInterns, rejectedInterns, eligibleInterns]);

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
        toast.success(`✨ LOR generated and sent successfully to ${selectedIntern.name}`);
        setModals(prev => ({ ...prev, generate: false }));
        setSelectedIntern(null);
        fetchAllData();
        if (showShortlistedModal) {
          fetchEligibleInterns();
        }
      },
      (err) => {
        toast.error('Failed to generate LOR: ' + err.message);
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
      setSelectedIntern(rejectingIntern);
      setModals(prev => ({ ...prev, rejection: true }));
    }
  };

  const handleSubmitRejection = async () => {
    if (!selectedIntern || !rejectionData.comment?.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));

    await requestHandler(
      () => rejectToGenLor(selectedIntern._id, rejectionData),
      null,
      () => {
        toast.success(`❌ LOR request rejected for ${selectedIntern.name}`);
        setModals(prev => ({ ...prev, rejection: false }));
        setSelectedIntern(null);
        fetchAllData();
      },
      (err) => {
        toast.error('Failed to reject LOR: ' + err.message);
      }
    );

    setLoading(prev => ({ ...prev, action: false }));
  };

  // ==================== HANDLE RESEND EMAIL ====================
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
        toast.success(`✅ LOR email resent successfully to ${resendIntern.name}`);
        fetchAllData();
      },
      (err) => {
        toast.error('Failed to resend email: ' + err.message);
      }
    );

    setSendingEmailFor(null);
    setResendIntern(null);
  };

  // ==================== HANDLE GENERATE FOR REJECTED ====================
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
        toast.success(`✅ LOR generated and sent successfully to ${generateRejectedIntern.name}`);
        fetchAllData();
      },
      (err) => {
        toast.error('Failed to generate LOR: ' + err.message);
      }
    );

    setLoading(prev => ({ ...prev, action: false }));
    setSendingEmailFor(null);
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
      toast.error('Please upload only Excel or CSV files');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    handleBulkUpload(file);
  };

  const handleBulkUpload = async (file) => {
    const formData = new FormData();
    formData.append('bulkInternOfLorGen', file);

    setLoading(prev => ({ ...prev, bulk: true }));
    setBulkUploadResult(null);

    await requestHandler(
      () => bulkUploadInternForGenLor(formData),
      null,
      (res) => {
        setBulkUploadResult(res.data);
        toast.success(`✅ Bulk upload completed! ${res.data.successCount || 0} interns processed successfully.`);
        fetchAllData();

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      (err) => {
        console.error('Bulk upload error:', err);
        toast.error(err.message || 'Failed to upload file. Please check the format and try again.');

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
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('lorTemp', file);

    setLoading(prev => ({ ...prev, template: true }));

    await requestHandler(
      () => uploadLorTemplate(formData),
      null,
      () => {
        toast.success('✅ Template uploaded successfully!');
        setModals(prev => ({ ...prev, template: false }));
      },
      (err) => {
        console.error('Upload error:', err);
        toast.error(err.message || 'Failed to upload template. Please try again.');
      }
    );

    setLoading(prev => ({ ...prev, template: false }));
  };

  // ==================== UI HANDLERS ====================
  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
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
    if (showShortlistedModal) {
      fetchEligibleInterns();
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'all', department: '', domain: '' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleShowShortlisted = () => {
    setShowShortlistedModal(true);
    fetchEligibleInterns();
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ==================== LOADING STATE ====================
  if (loading.initial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner
          message="Loading LOR requests..."
          subMessage="Fetching generated, pending, and rejected interns"
          fullPage
        />
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={handleRefresh} fullPage />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Letter of Recommendation Management (LOR)
            </h1>
            <p className="text-indigo-100 mt-2 flex items-center gap-2">
              <FaRocket className="w-4 h-4" />
              Manage Generated, Pending, and Rejected LOR requests
            </p>
          </div>

          <HeaderActions
            viewMode={viewMode}
            onViewChange={setViewMode}
            onBulkUpload={handleFileSelect}
            onTemplateUpload={() => setModals(prev => ({ ...prev, template: true }))}
            onShowRejected={() => setShowRejectedModal(true)}
            onShowShortlisted={handleShowShortlisted}
            onRefresh={handleRefresh}
            stats={stats}
            loading={loading}
            fileInputRef={fileInputRef}
          />
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
          <StatsCard title="Total Interns" value={stats.total} icon={FaUserGraduate} color="indigo" bgColor="white/10" />
          <StatsCard title="Generated" value={stats.generated} icon={FaCheckCircle} color="green" bgColor="white/10" />
          <StatsCard title="Pending" value={stats.pending} icon={FaClock} color="yellow" bgColor="white/10" />
          <StatsCard title="Rejected" value={stats.rejected} icon={FaTimesCircle} color="red" bgColor="white/10" />
        </div>
      </div>

      {/* Filters */}
      <SearchFilter
        searchValue={filters.search}
        onSearchChange={handleSearch}
        filters={STATUS_OPTIONS}
        activeFilter={filters.status}
        onFilterChange={handleStatusFilter}
        placeholder="Search by name, username, email, department, or domain..."
      />

      {/* Additional Filters */}
      <div className="flex flex-wrap gap-4">
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

        {/* Active Filters Indicator */}
        {(filters.search || filters.status !== 'all' || filters.department || filters.domain) && (
          <div className="flex items-center gap-2 text-sm">
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

      {/* Interns Display */}
      {paginatedInterns.length > 0 ? (
        <>
          <div className="flex justify-between items-center gap-3">
            <p className="text-sm text-gray-600">
              Showing {paginatedInterns.length} of {filteredInterns.length} interns
            </p>
            <p className="text-xs text-gray-400">
              {viewMode === VIEW_OPTIONS.CARD ? 'Card View' : 'List View'}
            </p>
          </div>

          {viewMode === VIEW_OPTIONS.CARD ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedInterns.map((intern) => (
                <LORCard
                  key={intern.id}
                  intern={intern}
                  onGenerate={handleGenerateLOR}
                  onReject={handleRejectLOR}
                  onResendEmail={handleResendEmailClick}
                  onGenerateRejected={handleGenerateRejectedClick}
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  isSending={sendingEmailFor === intern._id}
                />
              ))}
            </div>
          ) : (
            <LORListView
              interns={paginatedInterns}
              onGenerate={handleGenerateLOR}
              onReject={handleRejectLOR}
              onResendEmail={handleResendEmailClick}
              onGenerateRejected={handleGenerateRejectedClick}
              sendingEmailFor={sendingEmailFor}
              setHoveredItem={setHoveredItem}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <FaRocket className="w-10 h-10 text-indigo-400" />
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

      {/* Pagination */}
      {filteredInterns.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredInterns.length}
          itemsPerPage={pagination.itemsPerPage}
        />
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={showRejectionConfirm}
        onClose={() => {
          setShowRejectionConfirm(false);
          setRejectingIntern(null);
        }}
        onConfirm={confirmRejection}
        title="Confirm Rejection"
        message="Are you sure you want to reject LOR request for"
        itemName={rejectingIntern?.name}
        type="danger"
        confirmText="Confirm Rejection"
      />

      <ConfirmationModal
        isOpen={showResendConfirm}
        onClose={() => {
          setShowResendConfirm(false);
          setResendIntern(null);
        }}
        onConfirm={confirmResendEmail}
        title="Resend LOR Email"
        message="Are you sure you want to resend the LOR email to"
        itemName={resendIntern?.name}
        type="info"
        confirmText="Confirm Resend"
      />

      <ConfirmationModal
        isOpen={showGenerateRejectedConfirm}
        onClose={() => {
          setShowGenerateRejectedConfirm(false);
          setGenerateRejectedIntern(null);
        }}
        onConfirm={confirmGenerateRejected}
        title="Generate LOR for Rejected Intern"
        message="This will generate and send LOR for"
        itemName={generateRejectedIntern?.name}
        type="restore"
        confirmText="Confirm & Generate"
      />

      <RejectionModal
        isOpen={modals.rejection}
        onClose={() => {
          setModals(prev => ({ ...prev, rejection: false }));
          setSelectedIntern(null);
        }}
        intern={selectedIntern}
        rejectionData={rejectionData}
        setRejectionData={setRejectionData}
        onSubmit={handleSubmitRejection}
        loading={loading.action}
      />

      <TemplateUploadModal
        isOpen={modals.template}
        onClose={() => setModals(prev => ({ ...prev, template: false }))}
        onUpload={handleTemplateUpload}
        uploading={loading.template}
      />

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

      <RejectedInternsModal
        isOpen={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
        interns={rejectedInterns}
        loading={loading.rejected}
        onGenerateLOR={handleGenerateRejectedClick}
        onRefresh={fetchRejectedInterns}
      />

      <ShortlistedModal
        isOpen={showShortlistedModal}
        onClose={() => setShowShortlistedModal(false)}
        interns={eligibleInterns}
        loading={loading.eligible}
        onGenerateLOR={handleGenerateLOR}
        onRefresh={fetchEligibleInterns}
      />

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
