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
      trend: 'text-indigo-200',
      dot: 'bg-indigo-200'
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      iconHover: 'group-hover:bg-green-200',
      accent: 'bg-green-300',
      gradient: 'from-green-100 to-transparent',
      trend: 'text-green-200',
      dot: 'bg-green-200'
    },
    yellow: {
      icon: 'bg-yellow-100 text-yellow-600',
      iconHover: 'group-hover:bg-yellow-200',
      accent: 'bg-yellow-300',
      gradient: 'from-yellow-100 to-transparent',
      trend: 'text-yellow-200',
      dot: 'bg-yellow-200'
    },
    red: {
      icon: 'bg-red-100 text-red-600',
      iconHover: 'group-hover:bg-red-200',
      accent: 'bg-red-300',
      gradient: 'from-red-100 to-transparent',
      trend: 'text-red-200',
      dot: 'bg-red-200'
    },
    purple: {
      icon: 'bg-purple-100 text-purple-600',
      iconHover: 'group-hover:bg-purple-200',
      accent: 'bg-purple-300',
      gradient: 'from-purple-100 to-transparent',
      trend: 'text-purple-200',
      dot: 'bg-purple-200'
    }
  };

  const bgColorClasses = {
    white: 'bg-white',
    lightGray: 'bg-gray-50',
    lightIndigo: 'bg-indigo-50',
    lightGreen: 'bg-green-50',
    lightYellow: 'bg-yellow-50',
    lightRed: 'bg-red-50',
    lightPurple: 'bg-purple-50'
  };

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
      ${bgColorClasses[bgColor]}
      rounded-2xl
      p-6
      transition-all duration-300
      hover:shadow-md
      border border-gray-100
      group
      overflow-hidden
    `}>
      {/* Soft gradient overlay */}
      <div className={`
        absolute inset-0
        bg-gradient-to-br ${colorConfig[color].gradient}
        opacity-30
        group-hover:opacity-50
        transition-opacity duration-300
      `}></div>

      {/* Content - relative to appear above gradient */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-white text-xs font-medium tracking-wide uppercase mb-1.5 drop-shadow-sm">
              {title}
            </p>
            <p className="text-3xl font-bold text-white mb-2 drop-shadow-md">
              {value}
            </p>

            {/* Trend indicator with light colors */}
            {trend && trendValue && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`inline-flex items-center gap-1 text-sm font-medium text-white/90`}>
                  {getTrendIcon()}
                  {trendValue}
                </span>
                <span className="text-white/60 text-xs">vs last month</span>
              </div>
            )}
          </div>

          {/* Light icon container */}
          {Icon && (
            <div className={`
              ${colorConfig[color].icon}
              ${colorConfig[color].iconHover}
              p-3
              rounded-xl
              transition-all
              duration-300
              shadow-md
              backdrop-blur-sm
              border border-white/20
            `}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Light decorative elements */}
        <div className="flex items-center gap-1.5 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${i === 0 ? `w-10 ${colorConfig[color].accent}` : 'w-2 bg-white/40'}
                ${i === 0 && 'group-hover:w-12'}
              `}
            ></div>
          ))}
        </div>

        {/* Light dots pattern */}
        <div className="absolute -bottom-4 -right-4 opacity-10">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${colorConfig[color].dot}`}></div>
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
