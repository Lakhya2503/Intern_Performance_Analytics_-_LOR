import React from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaSync } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry, fullPage = false }) => {
  const content = (
    <div className="text-center max-w-md mx-auto">
      <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
        <FaExclamationTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <FaSync className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        {content}
      </div>
    );
  }

  return content;
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  fullPage: PropTypes.bool
};

export default ErrorMessage;
