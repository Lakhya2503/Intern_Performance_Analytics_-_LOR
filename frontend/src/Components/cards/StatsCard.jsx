import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  bgColor = 'white',
  trend = null,
  trendValue = null
}) => {
  const colorConfig = {
    indigo: {
      icon: 'bg-indigo-100 text-indigo-600',
      iconHover: 'group-hover:bg-indigo-200',
      accent: 'bg-indigo-300',
      gradient: 'from-indigo-100 to-transparent',
      trend: 'text-indigo-600',
      dot: 'bg-indigo-200',
      text: 'text-gray-800',
      value: 'text-gray-900 font-bold',
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      iconHover: 'group-hover:bg-green-200',
      accent: 'bg-green-300',
      gradient: 'from-green-100 to-transparent',
      trend: 'text-green-600',
      dot: 'bg-green-200',
      text: 'text-gray-800',
      value: 'text-gray-900 font-bold',
    },
    yellow: {
      icon: 'bg-yellow-100 text-yellow-600',
      iconHover: 'group-hover:bg-yellow-200',
      accent: 'bg-yellow-300',
      gradient: 'from-yellow-100 to-transparent',
      trend: 'text-yellow-600',
      dot: 'bg-yellow-200',
      text: 'text-gray-800',
      value: 'text-gray-900 font-bold',
    },
    red: {
      icon: 'bg-red-100 text-red-600',
      iconHover: 'group-hover:bg-red-200',
      accent: 'bg-red-300',
      gradient: 'from-red-100 to-transparent',
      trend: 'text-red-600',
      dot: 'bg-red-200',
      text: 'text-gray-800',
      value: 'text-gray-900 font-bold',
    },
    purple: {
      icon: 'bg-purple-100 text-purple-600',
      iconHover: 'group-hover:bg-purple-200',
      accent: 'bg-purple-300',
      gradient: 'from-purple-100 to-transparent',
      trend: 'text-purple-600',
      dot: 'bg-purple-200',
      text: 'text-gray-800',
      value: 'text-gray-900 font-bold',
    }
  };

  // Add default config as fallback
  const defaultConfig = {
    icon: 'bg-gray-100 text-gray-600',
    iconHover: 'group-hover:bg-gray-200',
    accent: 'bg-gray-300',
    gradient: 'from-gray-100 to-transparent',
    trend: 'text-gray-600',
    dot: 'bg-gray-200',
    text: 'text-gray-800',
    value: 'text-gray-900 font-bold',
  };

  // Safely get color config with fallback
  const selectedColor = colorConfig[color] || defaultConfig;

  const bgColorClasses = {
    white: 'bg-white',
    lightGray: 'bg-gray-50',
    lightIndigo: 'bg-indigo-50',
    lightGreen: 'bg-green-50',
    lightYellow: 'bg-yellow-50',
    lightRed: 'bg-red-50',
    lightPurple: 'bg-purple-50'
  };

  // Add fallback for bgColor
  const selectedBgColor = bgColorClasses[bgColor] || bgColorClasses.white;

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`
      relative
      ${selectedBgColor}
      rounded-2xl
      p-6
      transition-all duration-300
      hover:shadow-lg
      border border-gray-100
      group
      overflow-hidden
    `}>
      {/* Soft gradient overlay */}
      <div className={`
        absolute inset-0
        bg-gradient-to-br ${selectedColor.gradient}
        opacity-30
        group-hover:opacity-50
        transition-opacity duration-300
      `}></div>

      {/* Content - relative to appear above gradient */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`
              ${selectedColor.text}
              text-xs font-medium tracking-wide uppercase mb-1.5
            `}>
              {title}
            </p>
            <p className={`
              ${selectedColor.value}
              text-3xl mb-2
            `}>
              {value}
            </p>

            {/* Trend indicator */}
            {trend && trendValue && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`
                  inline-flex items-center gap-1
                  text-sm font-medium
                  ${selectedColor.trend}
                `}>
                  {getTrendIcon()}
                  {trendValue}
                </span>
                <span className="text-gray-400 text-xs">vs last month</span>
              </div>
            )}
          </div>

          {/* Icon container */}
          {Icon && (
            <div className={`
              ${selectedColor.icon}
              ${selectedColor.iconHover}
              p-3
              rounded-xl
              transition-all
              duration-300
              shadow-sm
              backdrop-blur-sm
              border border-white/20
            `}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="flex items-center gap-1.5 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${i === 0 ? `w-10 ${selectedColor.accent}` : 'w-2 bg-gray-200'}
                ${i === 0 && 'group-hover:w-12'}
              `}
            ></div>
          ))}
        </div>

        {/* Dots pattern */}
        <div className="absolute -bottom-4 -right-4 opacity-10">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${selectedColor.dot}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(['indigo', 'green', 'yellow', 'red', 'purple']),
  bgColor: PropTypes.oneOf(['white', 'lightGray', 'lightIndigo', 'lightGreen', 'lightYellow', 'lightRed', 'lightPurple']),
  trend: PropTypes.oneOf(['up', 'down']),
  trendValue: PropTypes.string
};

export default StatsCard;
