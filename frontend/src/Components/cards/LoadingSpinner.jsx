import React from 'react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({
  size = 'md',
  message = 'Loading...',
  subMessage,
  fullPage = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const spinner = (
    <div className="text-center">
      <div className="relative inline-block">
        <div className={`${sizeClasses[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}></div>
        <FaSpinner className={`${iconSizes[size]} text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse`} />
      </div>
      {message && <p className="text-gray-600 mt-4 font-medium">{message}</p>}
      {subMessage && <p className="text-sm text-gray-400 mt-2">{subMessage}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  message: PropTypes.string,
  subMessage: PropTypes.string,
  fullPage: PropTypes.bool
};

export default LoadingSpinner;
