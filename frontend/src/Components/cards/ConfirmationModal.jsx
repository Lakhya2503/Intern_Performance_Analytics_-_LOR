import React from 'react';
import PropTypes from 'prop-types';
import {
  FaExclamationTriangle,
  FaEnvelope,
  FaUndo,
  FaTimesCircle,
  FaCheckCircle,
  FaBan
} from 'react-icons/fa';

const iconMap = {
  warning: FaExclamationTriangle,
  danger: FaBan,
  success: FaCheckCircle,
  info: FaEnvelope,
  restore: FaUndo,
  delete: FaTimesCircle
};

const colorMap = {
  warning: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-700'
  },
  danger: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700'
  },
  success: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700'
  },
  info: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  restore: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  delete: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700'
  }
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  itemName = ''
}) => {
  if (!isOpen) return null;

  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className={`w-16 h-16 mx-auto mb-4 ${colors.bg} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${colors.icon}`} />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-6">
          {message}
          {itemName && <span className="font-semibold block mt-2">{itemName}</span>}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'danger', 'success', 'info', 'restore', 'delete']),
  itemName: PropTypes.string
};

export default ConfirmationModal;
