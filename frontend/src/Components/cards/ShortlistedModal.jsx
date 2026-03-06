import React, { useState, useMemo, useEffect } from 'react';
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
  FaChevronRight,
  FaGraduationCap,
  FaAward,
  FaChartLine,
  FaCheckSquare,
  FaSquare,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaTrash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/lorUtils';
import LoadingSpinner from '../cards/LoadingSpinner';

const ShortlistedModal = ({
  isOpen,
  onClose,
  interns,
  loading,
  onGenerateLOR,
  onBulkGenerateLOR,
  onRefresh,
  accentColor = "teal"
}) => {
  // All hooks must be called at the top level, before any conditional returns
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const itemsPerPage = 10;

  // Get unique departments
  const departments = useMemo(() => {
    if (!interns || interns.length === 0) return [];
    const depts = new Set(interns.map(i => i.department).filter(Boolean));
    return Array.from(depts);
  }, [interns]);

  // Filter interns
  const filteredInterns = useMemo(() => {
    if (!interns || interns.length === 0) return [];
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

  // Check if all interns on current page are selected
  const areAllSelectedOnPage = useMemo(() => {
    if (paginatedInterns.length === 0) return false;
    return paginatedInterns.every(intern =>
      selectedInterns.some(selected => selected._id === intern._id)
    );
  }, [paginatedInterns, selectedInterns]);

  // Update selectAll state when page selection changes
  useEffect(() => {
    setSelectAll(areAllSelectedOnPage);
  }, [areAllSelectedOnPage]);

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredInterns.length === 0) {
      return {
        total: 0,
        avgScore: 0,
        departments: 0,
        selected: selectedInterns.length
      };
    }
    return {
      total: filteredInterns.length,
      avgScore: filteredInterns.reduce((acc, curr) => acc + (curr.score || 0), 0) / filteredInterns.length || 0,
      departments: departments.length,
      selected: selectedInterns.length
    };
  }, [filteredInterns, departments, selectedInterns]);

  // Early return after all hooks
  if (!isOpen) return null;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearch('');
    setDepartmentFilter('');
    setCurrentPage(1);
  };

  // Toggle selection of a single intern
  const toggleInternSelection = (intern) => {
    setSelectedInterns(prev => {
      const isSelected = prev.some(selected => selected._id === intern._id);
      if (isSelected) {
        return prev.filter(selected => selected._id !== intern._id);
      } else {
        return [...prev, intern];
      }
    });
  };

  // Toggle selection of all interns on current page
  const toggleSelectAll = () => {
    if (areAllSelectedOnPage) {
      // Deselect all interns on current page
      setSelectedInterns(prev =>
        prev.filter(selected =>
          !paginatedInterns.some(intern => intern._id === selected._id)
        )
      );
    } else {
      // Select all interns on current page
      const newSelections = paginatedInterns.filter(intern =>
        !selectedInterns.some(selected => selected._id === intern._id)
      );
      setSelectedInterns(prev => [...prev, ...newSelections]);
    }
  };

  // Select all interns across all pages
  const handleSelectAllAcrossPages = () => {
    if (selectedInterns.length === filteredInterns.length) {
      // If all are selected, deselect all
      setSelectedInterns([]);
    } else {
      // Select all filtered interns
      setSelectedInterns(filteredInterns);
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedInterns([]);
  };

  // Handle bulk generation
  const handleBulkGenerate = async () => {
    if (selectedInterns.length === 0) {
      toast.error('Please select at least one intern');
      return;
    }

    setBulkGenerating(true);

    try {
      await onBulkGenerateLOR(selectedInterns);
      setSelectedInterns([]);
    } catch (error) {
      console.error('Bulk generation error:', error);
    } finally {
      setBulkGenerating(false);
    }
  };

  // Get color classes based on accentColor
  const getColorClasses = () => {
    const colors = {
      teal: {
        gradient: 'from-teal-500 via-teal-600 to-teal-700',
        light: 'teal-100',
        medium: 'teal-500',
        dark: 'teal-700',
        hover: 'teal-600',
        text: 'teal-600',
        bg: 'teal-50',
        border: 'teal-200',
        ring: 'teal-200'
      }
    };
    return colors[accentColor] || colors.teal;
  };

  const colorClasses = getColorClasses();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all scale-100 animate-slideIn">
        {/* Header - Dynamic Gradient with Pattern */}
        <div className={`p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r ${colorClasses.gradient} relative overflow-hidden`}>
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border-4 border-white rounded-full opacity-20"></div>
          </div>

          <h2 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FaStar className="w-5 h-5" />
            </div>
            <span>Shortlisted Students for LOR</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-normal">
              {filteredInterns.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:rotate-90 relative z-10"
          >
            <FaTimesCircle className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Selection Stats Bar */}
        {selectedInterns.length > 0 && (
          <div className="bg-teal-500 px-6 py-3 border-b border-teal-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                <FaCheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {selectedInterns.length} intern{selectedInterns.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={clearSelections}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  <FaTrash className="w-3 h-3" />
                  Clear all
                </button>
              </div>

              {/* Bulk Generate Button */}
              <button
                onClick={handleBulkGenerate}
                disabled={bulkGenerating}
                className="px-6 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-all text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkGenerating ? (
                  <>
                    <LoadingSpinner size="sm" color="teal" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="w-4 h-4" />
                    Generate LORs for Selected ({selectedInterns.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {filteredInterns.length > 0 && (
          <div className={`bg-gradient-to-r from-teal-100 to-teal-50 px-6 py-3 border-b border-teal-200`}>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500 rounded-lg">
                  <FaUser className="w-3 h-3 text-teal-700" />
                </div>
                <span className="text-teal-700">
                  <span className="font-semibold">{stats.total}</span> Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500 rounded-lg">
                  <FaAward className="w-3 h-3 text-teal-700" />
                </div>
                <span className="text-teal-700">
                  Avg Score: <span className="font-semibold">{stats.avgScore.toFixed(1)}%</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500 rounded-lg">
                  <FaBuilding className="w-3 h-3 text-teal-700" />
                </div>
                <span className="text-teal-700">
                  <span className="font-semibold">{stats.departments}</span> Departments
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition-all shadow-sm hover:border-teal-500`}
              />
            </div>

            {departments.length > 0 && (
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition-all shadow-sm hover:border-teal-500 bg-white min-w-[200px]`}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}

            {/* Select All Across Pages Button */}
            {filteredInterns.length > 0 && (
              <button
                onClick={handleSelectAllAcrossPages}
                className={`px-6 py-3 text-teal-600 hover:bg-teal-50 rounded-xl transition-all text-sm font-medium flex items-center gap-2 border border-teal-200 hover:border-teal-500`}
              >
                {selectedInterns.length === filteredInterns.length ? (
                  <>
                    <FaCheckSquare className="w-4 h-4" />
                    Deselect All ({filteredInterns.length})
                  </>
                ) : (
                  <>
                    <FaSquare className="w-4 h-4" />
                    Select All ({filteredInterns.length})
                  </>
                )}
              </button>
            )}

            {(search || departmentFilter) && (
              <button
                onClick={clearFilters}
                className={`px-6 py-3 text-teal-600 hover:bg-teal-50 rounded-xl transition-all text-sm font-medium flex items-center gap-2 border border-teal-200 hover:border-teal-500`}
              >
                <FaFilter className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-350px)] bg-gradient-to-b from-white to-gray-50/50">
          {loading ? (
            <div className="py-16">
              <LoadingSpinner message="Loading shortlisted students..." />
            </div>
          ) : filteredInterns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Select All on Current Page - Shown as a card */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 text-teal-700 font-medium hover:text-teal-600 transition-colors"
                    >
                      {selectAll ? (
                        <FaCheckSquare className="w-5 h-5 text-teal-600" />
                      ) : (
                        <FaSquare className="w-5 h-5 text-teal-600" />
                      )}
                      <span>Select All on This Page</span>
                    </button>
                    <span className="text-sm text-gray-500">
                      ({paginatedInterns.length} interns)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {paginatedInterns.filter(intern =>
                      selectedInterns.some(selected => selected._id === intern._id)
                    ).length} selected
                  </div>
                </div>
              </div>

              {paginatedInterns.map((intern) => (
                <div
                  key={intern.id}
                  onMouseEnter={() => setHoveredCard(intern.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`bg-white border-2 rounded-xl p-5 transition-all duration-300 ${
                    hoveredCard === intern.id
                      ? 'border-teal-500 shadow-xl transform scale-[1.02]'
                      : selectedInterns.some(selected => selected._id === intern._id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-teal-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Selection Checkbox */}
                        <button
                          onClick={() => toggleInternSelection(intern)}
                          className="focus:outline-none"
                        >
                          {selectedInterns.some(selected => selected._id === intern._id) ? (
                            <FaCheckSquare className="w-6 h-6 text-teal-600" />
                          ) : (
                            <FaSquare className="w-6 h-6 text-teal-600 opacity-50 hover:opacity-100" />
                          )}
                        </button>

                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          hoveredCard === intern.id
                            ? 'bg-teal-600 text-white'
                            : 'bg-teal-50 text-teal-600'
                        }`}>
                          <FaUser className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{intern.name}</h3>
                          <p className="text-xs text-gray-500 font-mono">ID: {intern.id}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        intern.score >= 90
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : intern.score >= 75
                          ? 'bg-teal-100 text-teal-700 border border-teal-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        <span className="flex items-center gap-1">
                          <FaChartLine className="w-3 h-3" />
                          Score: {typeof intern.score === 'number' ? intern.score.toFixed(1) : intern.score}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50/50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="w-3 h-3 text-gray-400" />
                        <span className="truncate text-xs">{intern.email}</span>
                      </div>

                      {intern.department && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBuilding className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">{intern.department}</span>
                        </div>
                      )}

                      {intern.course && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaGraduationCap className="w-3 h-3 text-gray-400" />
                          <span className="text-xs truncate">{intern.course}</span>
                        </div>
                      )}

                      {intern.endDate && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">Ends: {formatDate(intern.endDate)}</span>
                        </div>
                      )}
                    </div>

                    {intern.mentor && (
                      <div className="text-xs text-gray-500 flex items-center gap-2 bg-teal-50 p-2 rounded-lg">
                        <span className="font-medium text-teal-700">Mentor:</span>
                        <span>{intern.mentor}</span>
                      </div>
                    )}

                    <div className="flex justify-end mt-2 pt-2 border-t border-teal-100">
                      <button
                        onClick={() => {
                          onGenerateLOR(intern);
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105"
                      >
                        <FaRocket className="w-4 h-4" />
                        Generate LOR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl flex items-center justify-center shadow-inner">
                <FaStar className="w-14 h-14 text-teal-400" />
              </div>
              <p className="text-gray-700 font-bold text-xl mb-2">No shortlisted students found</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                {search || departmentFilter
                  ? 'No students match your search criteria. Try adjusting your filters.'
                  : 'All eligible students have been processed. Check back later for new shortlisted candidates.'}
              </p>
              {(search || departmentFilter) && (
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredInterns.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-teal-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                <span className="font-semibold text-teal-600">{Math.min(currentPage * itemsPerPage, filteredInterns.length)}</span> of{' '}
                <span className="font-semibold text-teal-600">{filteredInterns.length}</span> students
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'text-teal-600 hover:bg-teal-50 hover:text-teal-700 bg-gray-50'
                  }`}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-teal-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'text-teal-600 hover:bg-teal-50 hover:text-teal-700 bg-gray-50'
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
  onBulkGenerateLOR: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  accentColor: PropTypes.string
};

export default ShortlistedModal;
