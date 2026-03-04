import React from 'react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

const ActionButton = ({
  icon: Icon,
  onClick,
  children,
  loading = false,
  loadingText,
  disabled = false,
  title,
  active = false,
  variant = 'default',
  badge,
  badgeColor = 'red',
  className = ''
}) => {
  const baseClasses = 'flex items-center gap-2 transition-all relative';

  const variantClasses = {
    default: 'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700',
    outline: 'px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50',
    ghost: 'px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg',
    header: 'px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 text-white'
  };

  const activeClasses = active ? {
    default: 'ring-2 ring-offset-2 ring-indigo-500',
    outline: 'bg-indigo-50 border-indigo-500 text-indigo-700',
    ghost: 'bg-indigo-100 text-indigo-700',
    header: 'bg-white text-indigo-600'
  }[variant] : '';

  const badgeColors = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${baseClasses} ${variantClasses[variant]} ${activeClasses} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        <>
          <Icon className="w-4 h-4" />
          {children}
        </>
      )}

      {!loading && badge > 0 && (
        <span className={`absolute -top-2 -right-2 w-5 h-5 ${badgeColors[badgeColor]} text-white text-xs rounded-full flex items-center justify-center animate-pulse`}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  active: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost', 'header']),
  badge: PropTypes.number,
  badgeColor: PropTypes.oneOf(['red', 'yellow', 'green', 'blue', 'purple']),
  className: PropTypes.string
};

export default ActionButton;
