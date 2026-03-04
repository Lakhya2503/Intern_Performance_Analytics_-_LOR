import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaRocket,
  FaCalendarAlt,
  FaComment,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUndo
} from 'react-icons/fa';
import { formatDate, formatDateTime } from '../../utils/lorUtils';
import LoadingSpinner from '../cards/LoadingSpinner';

const RejectedInternsModal = ({
  isOpen,
  onClose,
  interns,
  loading,
  onGenerateLOR,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!isOpen) return null;

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(interns.map(i => i.department).filter(Boolean));
    return Array.from(depts);
  }, [interns]);

  // Filter interns
  const filteredInterns = useMemo(() => {
    return interns.filter(intern => {
      const searchTerm = search.toLowerCase();
      const matchesSearch = !search ||
        intern.name?.toLowerCase().includes(searchTerm) ||
        intern.email?.toLowerCase().includes(searchTerm) ||
        intern.username?.toLowerCase().includes(searchTerm) ||
        intern.rejectionReason?.toLowerCase().includes(searchTerm);

      const matchesDepartment = !departmentFilter || intern.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [interns, search, departmentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredInterns.length / itemsPerPage);
  const paginatedInterns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInterns.slice(start, start + itemsPerPage);
  }, [filteredInterns, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearch('');
    setDepartmentFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-500 to-red-600">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaExclamationTriangle className="w-5 h-5" />
            Rejected LOR Requests
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {filteredInterns.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <FaTimesCircle className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or rejection reason..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
              />
            </div>

            {departments.length > 0 && (
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}

            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FaClock className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {(search || departmentFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner message="Loading rejected interns..." />
            </div>
          ) : filteredInterns.length > 0 ? (
            <div className="space-y-4">
              {paginatedInterns.map((intern) => (
                <div
                  key={intern.id}
                  className="bg-white border border-red-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-red-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaUser className="w-6 h-6 text-red-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{intern.name}</h3>
                          <p className="text-sm text-gray-500">@{intern.username}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <FaExclamationTriangle className="w-3 h-3" />
                            Rejected
                          </span>
                          <button
                            onClick={() => {
                              onGenerateLOR(intern);
                              onClose();
                            }}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                            title="Generate LOR for this intern"
                          >
                            <FaUndo className="w-3 h-3" />
                            Generate LOR
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
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

                          {intern.score && intern.score !== 'N/A' && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Score:</span>
                              <span className="font-semibold text-red-600">{intern.score}%</span>
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

                          {intern.rejectedBy && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaUser className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-500">Rejected by:</span>
                              <span className="text-gray-700 font-medium">{intern.rejectedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-start gap-2">
                          <FaComment className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-red-500 font-medium mb-1">Rejection Reason</p>
                            <p className="text-sm text-gray-700">{intern.rejectionReason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info if available */}
                      {(intern.isCompliantIssue || intern.isDisciplineIssue) && (
                        <div className="mt-3 flex gap-2">
                          {intern.isCompliantIssue && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                              Compliance Issue
                            </span>
                          )}
                          {intern.isDisciplineIssue && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                              Discipline Issue
                            </span>
                          )}
                        </div>
                      )}
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
              <p className="text-sm text-gray-400 mt-2">
                {search || departmentFilter
                  ? 'No interns match your search criteria'
                  : 'All LOR requests are either pending or generated'}
              </p>
              {(search || departmentFilter) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredInterns.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredInterns.length)} of{' '}
                {filteredInterns.length} rejected requests
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-red-100 text-red-600'
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
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-red-600 text-white'
                              : 'hover:bg-red-50 text-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={i} className="text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

RejectedInternsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  interns: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onGenerateLOR: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default RejectedInternsModal;
