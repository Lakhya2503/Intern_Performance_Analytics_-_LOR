import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchFilter = ({
  searchValue,
  onSearchChange,
  filters = [],
  activeFilter,
  onFilterChange,
  placeholder = "Search...",
  showFilter = true
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {showFilter && filters.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {filters.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeFilter === value
                    ? `bg-${color}-100 text-${color}-700 border-2 border-${color}-300`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired
    })
  ),
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func,
  placeholder: PropTypes.string,  
  showFilter: PropTypes.bool
};

export default SearchFilter;
