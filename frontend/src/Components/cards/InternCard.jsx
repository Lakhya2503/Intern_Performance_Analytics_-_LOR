import React from 'react';
import {
  FaEnvelope,
  FaStar,
  FaCalendarAlt,
  FaGraduationCap,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFlag,
  FaExclamationTriangle,
  FaUserTie,
  FaIdCard,
  FaChartLine,
  FaPhone,
  FaMapMarkerAlt,
  FaUsers,
  FaShare
} from 'react-icons/fa';

// ============================================
// CONFIGURATION SYSTEM
// ============================================

// Size configurations
const SIZE_CONFIGS = {
  lg: {
    card: 'max-w-xl',
    avatar: 'w-20 h-20',
    avatarText: 'text-3xl',
    title: 'text-xl',
    subText: 'text-base',
    label: 'text-sm',
    badge: 'text-sm',
    iconContainer: 'w-10 h-10',
    iconSmall: 'w-8 h-8',
    iconTiny: 'w-4 h-4',
    spacing: 'p-6',
    gap: 'gap-6',
    gridCols: 'grid-cols-2',
    buttonSize: 'p-3',
    iconButton: 'w-6 h-6',
    progressHeight: 'h-2.5'
  },
  md: {
    card: 'max-w-md',
    avatar: 'w-16 h-16',
    avatarText: 'text-2xl',
    title: 'text-lg',
    subText: 'text-sm',
    label: 'text-xs',
    badge: 'text-xs',
    iconContainer: 'w-8 h-8',
    iconSmall: 'w-6 h-6',
    iconTiny: 'w-3 h-3',
    spacing: 'p-5',
    gap: 'gap-4',
    gridCols: 'grid-cols-2',
    buttonSize: 'p-2',
    iconButton: 'w-5 h-5',
    progressHeight: 'h-2'
  },
  sm: {
    card: 'max-w-sm',
    avatar: 'w-14 h-14',
    avatarText: 'text-xl',
    title: 'text-base',
    subText: 'text-xs',
    label: 'text-[11px]',
    badge: 'text-[11px]',
    iconContainer: 'w-7 h-7',
    iconSmall: 'w-5 h-5',
    iconTiny: 'w-2.5 h-2.5',
    spacing: 'p-4',
    gap: 'gap-3',
    gridCols: 'grid-cols-2',
    buttonSize: 'p-1.5',
    iconButton: 'w-4 h-4',
    progressHeight: 'h-1.5'
  },
  xs: {
    card: 'max-w-xs',
    avatar: 'w-12 h-12',
    avatarText: 'text-lg',
    title: 'text-sm',
    subText: 'text-[11px]',
    label: 'text-[10px]',
    badge: 'text-[10px]',
    iconContainer: 'w-6 h-6',
    iconSmall: 'w-4 h-4',
    iconTiny: 'w-2 h-2',
    spacing: 'p-3',
    gap: 'gap-2',
    gridCols: 'grid-cols-1',
    buttonSize: 'p-1',
    iconButton: 'w-3.5 h-3.5',
    progressHeight: 'h-1'
  }
};

// Font configurations
const FONT_CONFIGS = {
  lg: {
    title: 'text-xl',
    body: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs'
  },
  md: {
    title: 'text-lg',
    body: 'text-sm',
    small: 'text-xs',
    tiny: 'text-[11px]'
  },
  sm: {
    title: 'text-base',
    body: 'text-xs',
    small: 'text-[11px]',
    tiny: 'text-[10px]'
  },
  xs: {
    title: 'text-sm',
    body: 'text-[11px]',
    small: 'text-[10px]',
    tiny: 'text-[9px]'
  }
};

// ============================================
// PREDEFINED CONFIGURATION PRESETS
// ============================================

export const CARD_CONFIGS = {
  // Full featured card with all details
  full: {
    size: 'lg',
    showDepartment: true,
    showRole: true,
    showCourse: true,
    showMentor: true,
    showEndDate: true,
    showPerformance: true,
    showContact: true,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: true,
    showPhone: true,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: true,
    showShareButton: true,
    description: 'Large card with all information visible'
  },

  // Default balanced card
  default: {
    size: 'md',
    showDepartment: true,
    showRole: true,
    showCourse: true,
    showMentor: true,
    showEndDate: true,
    showPerformance: true,
    showContact: true,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: true,
    showPhone: true,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: true,
    showShareButton: true,
    description: 'Standard card with balanced information density'
  },

  // Compact card for dashboards
  compact: {
    size: 'sm',
    showDepartment: true,
    showRole: false,
    showCourse: true,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: false,
    showLocation: false,
    showPhone: false,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: true,
    showShareButton: false,
    description: 'Compact card for dashboard views'
  },

  // Minimal card for dense lists
  minimal: {
    size: 'xs',
    showDepartment: false,
    showRole: false,
    showCourse: false,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: false,
    showIssues: true,
    showProgressBar: false,
    showScoreBadge: true,
    showId: false,
    showLocation: false,
    showPhone: false,
    showEmail: false,
    showStatus: true,
    showViewButton: true,
    showEditButton: false,
    showShareButton: false,
    description: 'Minimal card for dense lists and tables'
  },

  // Profile view card
  profile: {
    size: 'lg',
    showDepartment: true,
    showRole: true,
    showCourse: true,
    showMentor: true,
    showEndDate: true,
    showPerformance: true,
    showContact: true,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: true,
    showPhone: true,
    showEmail: true,
    showStatus: true,
    showViewButton: false,
    showEditButton: true,
    showShareButton: true,
    description: 'Profile view with edit and share actions'
  },

  // Manager view card
  manager: {
    size: 'md',
    showDepartment: true,
    showRole: true,
    showCourse: false,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: true,
    showSkills: false,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: false,
    showPhone: true,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: true,
    showShareButton: false,
    description: 'Manager view focusing on performance and contact info'
  },

  // HR view card
  hr: {
    size: 'md',
    showDepartment: true,
    showRole: true,
    showCourse: true,
    showMentor: true,
    showEndDate: true,
    showPerformance: false,
    showContact: true,
    showSkills: true,
    showIssues: true,
    showProgressBar: false,
    showScoreBadge: false,
    showId: true,
    showLocation: true,
    showPhone: true,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: true,
    showShareButton: false,
    description: 'HR view focusing on personal and compliance info'
  },

  // Mentor view card
  mentor: {
    size: 'md',
    showDepartment: true,
    showRole: true,
    showCourse: true,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: false,
    showPhone: false,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: false,
    showShareButton: false,
    description: 'Mentor view focusing on progress and skills'
  },

  // Performance review card
  performance: {
    size: 'lg',
    showDepartment: false,
    showRole: false,
    showCourse: false,
    showMentor: true,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: false,
    showPhone: false,
    showEmail: false,
    showStatus: true,
    showViewButton: true,
    showEditButton: true,
    showShareButton: false,
    description: 'Performance review focused card'
  },

  // Quick view card (popup/preview)
  quick: {
    size: 'sm',
    showDepartment: true,
    showRole: true,
    showCourse: false,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: false,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: false,
    showPhone: false,
    showEmail: false,
    showStatus: true,
    showViewButton: true,
    showEditButton: false,
    showShareButton: false,
    description: 'Quick preview card for popups and hover states'
  },

  // Mobile card
  mobile: {
    size: 'xs',
    showDepartment: true,
    showRole: false,
    showCourse: false,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: false,
    showIssues: true,
    showProgressBar: false,
    showScoreBadge: true,
    showId: false,
    showLocation: false,
    showPhone: false,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: false,
    showShareButton: false,
    description: 'Optimized for mobile devices'
  },

  // Read-only card
  readonly: {
    size: 'md',
    showDepartment: true,
    showRole: true,
    showCourse: true,
    showMentor: true,
    showEndDate: true,
    showPerformance: true,
    showContact: true,
    showSkills: true,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: true,
    showPhone: true,
    showEmail: true,
    showStatus: true,
    showViewButton: true,
    showEditButton: false,
    showShareButton: false,
    description: 'Read-only view with view action only'
  },

  // Executive summary card
  executive: {
    size: 'lg',
    showDepartment: true,
    showRole: true,
    showCourse: false,
    showMentor: false,
    showEndDate: true,
    showPerformance: true,
    showContact: false,
    showSkills: false,
    showIssues: true,
    showProgressBar: true,
    showScoreBadge: true,
    showId: true,
    showLocation: false,
    showPhone: false,
    showEmail: false,
    showStatus: true,
    showViewButton: true,
    showEditButton: false,
    showShareButton: true,
    description: 'Executive summary with key metrics only'
  }
};

// ============================================
// THEME CONFIGURATIONS
// ============================================

export const CARD_THEMES = {
  light: {
    card: 'bg-white border-gray-100',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    background: 'bg-gray-50',
    border: 'border-gray-200',
    shadow: 'shadow-lg hover:shadow-xl'
  },
  dark: {
    card: 'bg-gray-800 border-gray-700',
    text: 'text-white',
    textMuted: 'text-gray-400',
    background: 'bg-gray-700',
    border: 'border-gray-600',
    shadow: 'shadow-lg hover:shadow-2xl'
  },
  pastel: {
    card: 'bg-gradient-to-br from-amber-50 to-emerald-50 border-amber-100',
    text: 'text-gray-800',
    textMuted: 'text-gray-600',
    background: 'bg-white/50',
    border: 'border-amber-200',
    shadow: 'shadow-lg hover:shadow-xl'
  },
  professional: {
    card: 'bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200',
    text: 'text-slate-800',
    textMuted: 'text-slate-600',
    background: 'bg-white/70',
    border: 'border-slate-300',
    shadow: 'shadow-md hover:shadow-lg'
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const InternCard = ({
  intern,
  onView,
  onEdit,
  onEmail,
  onShare,
  config = 'default', // Can be string key or custom config object
  theme = 'light',
  customConfig = {},
  className = ''
}) => {
  // Resolve configuration
  const getConfig = () => {
    // If config is a string, use predefined preset
    if (typeof config === 'string') {
      const preset = CARD_CONFIGS[config] || CARD_CONFIGS.default;
      return { ...preset, ...customConfig };
    }
    // If config is an object, use it directly
    return { ...CARD_CONFIGS.default, ...config, ...customConfig };
  };

  const activeConfig = getConfig();
  const size = activeConfig.size || 'md';
  const sizeStyles = SIZE_CONFIGS[size];
  const fonts = FONT_CONFIGS[size];
  const themeStyles = CARD_THEMES[theme] || CARD_THEMES.light;

  // Helper functions (same as before)
  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'text-gray-400';
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'text-emerald-600';
    if (roundedScore >= 70) return 'text-sky-600';
    if (roundedScore >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBgColor = (score) => {
    if (!score && score !== 0) return 'bg-gray-400';
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'bg-emerald-400';
    if (roundedScore >= 70) return 'bg-sky-400';
    if (roundedScore >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        icon: <FaCheckCircle className={sizeStyles.iconTiny} />,
        text: 'Active',
        bg: theme === 'dark' ? 'bg-emerald-900' : 'bg-emerald-50',
        textColor: theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700',
        border: theme === 'dark' ? 'border-emerald-800' : 'border-emerald-200'
      },
      inactive: {
        icon: <FaTimesCircle className={sizeStyles.iconTiny} />,
        text: 'Inactive',
        bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
        textColor: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
        border: theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
      },
      probation: {
        icon: <FaClock className={sizeStyles.iconTiny} />,
        text: 'Probation',
        bg: theme === 'dark' ? 'bg-amber-900' : 'bg-amber-50',
        textColor: theme === 'dark' ? 'text-amber-300' : 'text-amber-700',
        border: theme === 'dark' ? 'border-amber-800' : 'border-amber-200'
      },
      completed: {
        icon: <FaCheckCircle className={sizeStyles.iconTiny} />,
        text: 'Completed',
        bg: theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50',
        textColor: theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
        border: theme === 'dark' ? 'border-blue-800' : 'border-blue-200'
      }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${fonts.tiny} font-medium ${config.bg} ${config.textColor} border ${config.border}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: size === 'xs' ? 'numeric' : 'short',
        day: 'numeric'
      });

      if (size === 'xs' || size === 'sm') {
        return diffDays > 0 ? `${diffDays}d left` : `${Math.abs(diffDays)}d overdue`;
      }

      if (diffDays > 0) {
        return `${formattedDate} (${diffDays} days left)`;
      } else if (diffDays < 0) {
        return `${formattedDate} (${Math.abs(diffDays)} days overdue)`;
      }
      return formattedDate;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPerformanceLevel = (score) => {
    if (!score && score !== 0) return 'NR';
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'Excellent';
    if (roundedScore >= 70) return 'Good';
    if (roundedScore >= 50) return 'Average';
    return 'Needs Improvement';
  };

  const getAvatarColor = (name) => {
    const gradients = [
      'from-emerald-400 to-teal-500',
      'from-sky-400 to-blue-500',
      'from-purple-400 to-pink-500',
      'from-amber-400 to-orange-500',
      'from-rose-400 to-red-500',
      'from-cyan-400 to-sky-500'
    ];
    if (!name) return gradients[0];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const hasIssues = intern.isCompliantIssue || intern.isDisciplineIssue;
  const issueCount = [intern.isCompliantIssue, intern.isDisciplineIssue].filter(Boolean).length;
  const displayScore = intern.score ? Math.round(intern.score) : 0;
  const scoreColor = getScoreColor(intern.score);
  const scoreBgColor = getScoreBgColor(intern.score);
  const avatarGradient = getAvatarColor(intern.name);
  const performanceLevel = getPerformanceLevel(intern.score);

  const getInternStatus = () => {
    if (intern.status) return intern.status;
    if (intern.isActive && intern.isProbation) return 'probation';
    if (intern.isActive) return 'active';
    if (intern.isCompleted) return 'completed';
    return 'inactive';
  };

  const internStatus = getInternStatus();
  const statusBadge = getStatusBadge(internStatus);

  // Determine grid columns based on visible items
  const getGridCols = () => {
    let visibleCount = 0;
    if (activeConfig.showCourse) visibleCount++;
    if (activeConfig.showMentor) visibleCount++;
    if (activeConfig.showEndDate) visibleCount++;
    if (activeConfig.showPerformance) visibleCount++;

    if (size === 'xs' || visibleCount <= 2) return 'grid-cols-1';
    if (visibleCount <= 4) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <div className={`
      rounded-2xl transition-all duration-300
      overflow-hidden border relative group
      ${sizeStyles.card}
      ${themeStyles.card}
      ${themeStyles.shadow}
      ${className}
    `}>
      {/* Decorative gradient line */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${avatarGradient} opacity-80`}></div>

      {/* Background pattern - hidden on smaller sizes */}
      {size !== 'xs' && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-200 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-200 to-transparent rounded-full blur-3xl"></div>
        </div>
      )}

      <div className={`${sizeStyles.spacing} relative`}>
        {/* Header with avatar and basic info */}
        <div className={`flex items-start ${sizeStyles.gap}`}>
          {/* Avatar */}
          <div className="relative">
            <div className={`${sizeStyles.avatar} bg-gradient-to-br ${avatarGradient} rounded-xl flex items-center justify-center ${sizeStyles.avatarText} font-bold text-white shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
              {intern.name?.charAt(0) || '?'}
            </div>
            {hasIssues && activeConfig.showIssues && (
              <div className="absolute -top-1 -right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-400 border border-white text-[8px] text-white items-center justify-center font-bold">
                    {issueCount}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Basic info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`font-bold truncate ${fonts.title} ${themeStyles.text}`}>
                  {intern.name || 'Unknown Intern'}
                </h3>
                {activeConfig.showId && (
                  <p className={`flex items-center gap-1 ${fonts.small} ${themeStyles.textMuted}`}>
                    <FaIdCard className={sizeStyles.iconTiny} />
                    {size === 'xs' ? intern._id?.slice(-4) : `ID: ${intern._id?.slice(-6) || 'N/A'}`}
                  </p>
                )}
              </div>

              {/* Score Badge */}
            </div>

            {/* Department and Role */}
            {(activeConfig.showDepartment || activeConfig.showRole) && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {activeConfig.showDepartment && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg ${fonts.tiny} border ${themeStyles.background} ${themeStyles.textMuted} ${themeStyles.border}`}>
                    <FaUsers className={sizeStyles.iconTiny} />
                    {size === 'xs' ? intern.department?.substring(0, 3) || 'NA' : intern.department || 'No Dept'}
                  </span>
                )}
                {activeConfig.showRole && intern.role && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg ${fonts.tiny} border ${themeStyles.background} ${themeStyles.textMuted} ${themeStyles.border}`}>
                    <FaUserTie className={sizeStyles.iconTiny} />
                    {size === 'xs' ? intern.role?.substring(0, 3) || 'INT' : intern.role}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick info grid - Conditional rendering */}
        {(activeConfig.showCourse || activeConfig.showMentor || activeConfig.showEndDate || activeConfig.showPerformance) && (
          <div className={`grid ${getGridCols()} gap-2 mt-4`}>
            {activeConfig.showCourse && (
              <div className={`flex items-center gap-2 p-2 rounded-xl ${fonts.small} ${themeStyles.background}`}>
                <div className={`${sizeStyles.iconSmall} bg-emerald-100 rounded-lg flex items-center justify-center`}>
                  <FaGraduationCap className={`${sizeStyles.iconTiny} text-emerald-600`} />
                </div>
                <div className="truncate">
                  <p className={`text-emerald-600 font-medium ${fonts.tiny}`}>Course</p>
                  <p className="font-medium truncate text-gray-700" title={intern.course}>
                    {size === 'xs' ? intern.course?.substring(0, 8) || 'N/A' : intern.course || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {activeConfig.showMentor && (
              <div className={`flex items-center gap-2 p-2 rounded-xl ${fonts.small} ${themeStyles.background}`}>
                <div className={`${sizeStyles.iconSmall} bg-sky-100 rounded-lg flex items-center justify-center`}>
                  <FaUserTie className={`${sizeStyles.iconTiny} text-sky-600`} />
                </div>
                <div className="truncate">
                  <p className={`text-sky-600 font-medium ${fonts.tiny}`}>Mentor</p>
                  <p className="font-medium truncate text-gray-700" title={intern.mentor}>
                    {size === 'xs' ? intern.mentor?.substring(0, 6) || 'N/A' : intern.mentor || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {activeConfig.showEndDate && (
              <div className={`flex items-center gap-2 p-2 rounded-xl ${fonts.small} ${themeStyles.background}`}>
                <div className={`${sizeStyles.iconSmall} bg-amber-100 rounded-lg flex items-center justify-center`}>
                  <FaCalendarAlt className={`${sizeStyles.iconTiny} text-amber-600`} />
                </div>
                <div className="truncate">
                  <p className={`text-amber-600 font-medium ${fonts.tiny}`}>End</p>
                  <p className={`font-medium truncate text-gray-700 ${fonts.small}`} title={formatDate(intern.endDate)}>
                    {formatDate(intern.endDate)}
                  </p>
                </div>
              </div>
            )}

            {activeConfig.showPerformance && (
              <div className={`flex items-center gap-2 p-2 rounded-xl ${fonts.small} ${themeStyles.background}`}>
                <div className={`${sizeStyles.iconSmall} bg-rose-100 rounded-lg flex items-center justify-center`}>
                  <FaChartLine className={`${sizeStyles.iconTiny} text-rose-600`} />
                </div>
                <div className="truncate">
                  <p className={`text-rose-600 font-medium ${fonts.tiny}`}>Perf</p>
                  <p className={`font-medium truncate ${scoreColor} ${fonts.small}`}>
                    {performanceLevel}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact information - Conditional rendering */}
        {activeConfig.showContact && (activeConfig.showEmail || activeConfig.showPhone || (activeConfig.showLocation && intern.location)) && (
          <div className={`mt-4 space-y-1.5 p-2 rounded-xl ${fonts.small} ${themeStyles.background}`}>
            {activeConfig.showEmail && (
              <div className="flex items-center gap-2">
                <div className={`${sizeStyles.iconContainer} bg-emerald-100 rounded-lg flex items-center justify-center`}>
                  <FaEnvelope className={`${sizeStyles.iconTiny} text-emerald-600`} />
                </div>
                <a href={`mailto:${intern.email}`} className="text-emerald-600 hover:underline truncate font-medium">
                  {size === 'xs' ? intern.email?.substring(0, 12) + '...' : intern.email || 'No email'}
                </a>
              </div>
            )}
            {activeConfig.showPhone && intern.phone && (
              <div className="flex items-center gap-2">
                <div className={`${sizeStyles.iconContainer} bg-sky-100 rounded-lg flex items-center justify-center`}>
                  <FaPhone className={`${sizeStyles.iconTiny} text-sky-600`} />
                </div>
                <span className="text-gray-700">{intern.phone}</span>
              </div>
            )}
            {activeConfig.showLocation && intern.location && (
              <div className="flex items-center gap-2">
                <div className={`${sizeStyles.iconContainer} bg-amber-100 rounded-lg flex items-center justify-center`}>
                  <FaMapMarkerAlt className={`${sizeStyles.iconTiny} text-amber-600`} />
                </div>
                <span className="truncate text-gray-700">{intern.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar - Conditional */}
        {activeConfig.showProgressBar && activeConfig.showPerformance && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between">
              <span className={`${themeStyles.textMuted} font-medium ${fonts.tiny}`}>Score</span>
              <span className={`font-bold ${scoreColor} ${fonts.tiny}`}>{displayScore}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`${sizeStyles.progressHeight} rounded-full ${scoreBgColor} transition-all duration-700`}
                style={{ width: `${displayScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Issue Indicators - Conditional */}
        {activeConfig.showIssues && hasIssues && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {intern.isCompliantIssue && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${fonts.tiny} border bg-orange-50 text-orange-700 border-orange-200`}>
                <FaExclamationTriangle className={sizeStyles.iconTiny} />
                {size === 'xs' ? 'Comp' : 'Compliance'}
              </span>
            )}
            {intern.isDisciplineIssue && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${fonts.tiny} border bg-rose-50 text-rose-700 border-rose-200`}>
                <FaFlag className={sizeStyles.iconTiny} />
                {size === 'xs' ? 'Disc' : 'Discipline'}
              </span>
            )}
          </div>
        )}

        {/* Skills/Tags - Conditional */}
        {activeConfig.showSkills && intern.skills && intern.skills.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {intern.skills.slice(0, size === 'xs' ? 2 : 3).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 rounded-lg ${fonts.tiny} border ${themeStyles.background} ${themeStyles.textMuted} ${themeStyles.border}`}
                >
                  {size === 'xs' && skill.length > 6 ? skill.substring(0, 4) + '..' : skill}
                </span>
              ))}
              {intern.skills.length > (size === 'xs' ? 2 : 3) && (
                <span className={`px-2 py-0.5 rounded-lg ${fonts.tiny} border ${themeStyles.background} ${themeStyles.textMuted} ${themeStyles.border}`}>
                  +{intern.skills.length - (size === 'xs' ? 2 : 3)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer with status and actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          {activeConfig.showStatus && <div className="flex items-center gap-2">{statusBadge}</div>}

          {!activeConfig.hideAllButtons && (
            <div className={`flex items-center gap-0.5 ${themeStyles.background} p-1 rounded-xl ${!activeConfig.showStatus ? 'ml-auto' : ''}`}>
              {/* {activeConfig.showViewButton && onView && (
                <button
                  onClick={() => onView(intern)}
                  className={`${sizeStyles.buttonSize} hover:bg-blue-100 rounded-lg transition-all duration-200 group relative`}
                  title="View Details"
                >
                  <FaEye className={`${sizeStyles.iconButton} text-blue-500`} />
                  {size !== 'xs' && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View
                    </span>
                  )}
                </button>
              )} */}

              {activeConfig.showEditButton && onEdit && (
                <button
                  onClick={() => onEdit(intern)}
                  className={`${sizeStyles.buttonSize} hover:bg-amber-100 rounded-lg transition-all duration-200 group relative`}
                  title="Edit Intern"
                >
                  <FaEdit className={`${sizeStyles.iconButton} text-amber-500`} />
                  {size !== 'xs' && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Edit
                    </span>
                  )}
                </button>
              )}

              {/* {activeConfig.showShareButton && onShare && (
                <button
                  onClick={() => onShare(intern)}
                  className={`${sizeStyles.buttonSize} hover:bg-purple-100 rounded-lg transition-all duration-200 group relative`}
                  title="Share Profile"
                >
                  <FaShare className={`${sizeStyles.iconButton} text-purple-500`} />
                  {size !== 'xs' && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Share
                    </span>
                  )}
                </button>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Default props
InternCard.defaultProps = {
  intern: {
    name: 'Unknown Intern',
    email: 'no-email@example.com',
    gender: 'Not specified',
    course: 'No course',
    department: 'No department',
    mentor: 'Not assigned',
    role: 'Intern',
    isActive: false,
    isProbation: false,
    isCompleted: false,
    isCompliantIssue: false,
    isDisciplineIssue: false,
    score: 0,
    skills: [],
    _id: 'N/A',
    phone: '',
    location: '',
    endDate: null
  },
  onView: () => {},
  onEdit: () => {},
  onEmail: () => {},
  onShare: null,
  config: 'default',
  theme: 'light',
  customConfig: {},
  className: ''
};

export default InternCard;
