import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{start}</span> to{' '}
          <span className="font-medium">{end}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700'
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="text-gray-400 px-2">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700'
            }`}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired
};

export default Pagination;
