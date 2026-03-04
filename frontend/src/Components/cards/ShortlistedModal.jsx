import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimesCircle,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaRocket,
  FaCalendarAlt,
  FaStar,
  FaFilter,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { formatDate } from '../../utils/lorUtils';
import LoadingSpinner from '../cards/LoadingSpinner';

const ShortlistedModal = ({
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
        intern.course?.toLowerCase().includes(searchTerm);

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
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-500 to-purple-600">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaStar className="w-5 h-5" />
            Shortlisted Students for LOR
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
                placeholder="Search by name, email, or course..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
              />
            </div>

            {departments.length > 0 && (
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}

            {(search || departmentFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
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
              <LoadingSpinner message="Loading shortlisted students..." />
            </div>
          ) : filteredInterns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedInterns.map((intern) => (
                <div
                  key={intern.id}
                  className="bg-white border border-purple-100 rounded-xl p-5 hover:shadow-md transition-all hover:border-purple-200"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FaUser className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{intern.name}</h3>
                          <p className="text-xs text-gray-500">ID: {intern.id}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Score: {typeof intern.score === 'number' ? intern.score.toFixed(1) : intern.score}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{intern.email}</span>
                      </div>

                      {intern.department && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBuilding className="w-3 h-3 text-gray-400" />
                          <span>{intern.department}</span>
                        </div>
                      )}

                      {intern.course && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaStar className="w-3 h-3 text-gray-400" />
                          <span>{intern.course}</span>
                        </div>
                      )}

                      {intern.endDate && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                          <span>Ends: {formatDate(intern.endDate)}</span>
                        </div>
                      )}
                    </div>

                    {intern.mentor && (
                      <div className="text-xs text-gray-500">
                        Mentor: {intern.mentor}
                      </div>
                    )}

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          onGenerateLOR(intern);
                          onClose();
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <FaRocket className="w-3 h-3" />
                        Generate LOR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <FaStar className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">No shortlisted students found</p>
              <p className="text-sm text-gray-400 mt-2">
                {search || departmentFilter
                  ? 'No students match your search criteria'
                  : 'All eligible students have been processed'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredInterns.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 mb-2">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredInterns.length)} of{' '}
                {filteredInterns.length} students
              </p>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-purple-100 text-purple-600'
                  }`}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm text-gray-600 ">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-purple-100 text-purple-600'
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

ShortlistedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  interns: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onGenerateLOR: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default ShortlistedModal;
