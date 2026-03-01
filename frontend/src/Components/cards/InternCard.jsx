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
import { MdOutlineEmail } from 'react-icons/md';

const InternCard = ({ 
  intern, 
  onView, 
  onEdit, 
  onEmail, 
  onShare, 
  variant = 'default',
  // Button visibility props - default to true for backward compatibility
  showViewButton = true,
  showEditButton = true,
  showEmailButton = true,
  showShareButton = true,
  // Optional: hide all buttons at once (overrides individual props)
  hideAllButtons = false
}) => {
  // Helper function to get score color based on percentage
  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'text-gray-400';
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'text-emerald-600';
    if (roundedScore >= 70) return 'text-sky-600';
    if (roundedScore >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  // Helper function to get score background color for progress bar
  const getScoreBgColor = (score) => {
    if (!score && score !== 0) return 'bg-gray-400';
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'bg-emerald-600';
    if (roundedScore >= 70) return 'bg-sky-600';
    if (roundedScore >= 50) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        icon: <FaCheckCircle className="w-3 h-3" />,
        text: 'Active',
        bg: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        border: 'border-emerald-200'
      },
      inactive: {
        icon: <FaTimesCircle className="w-3 h-3" />,
        text: 'Inactive',
        bg: 'bg-gray-100',
        textColor: 'text-gray-700',
        border: 'border-gray-200'
      },
      probation: {
        icon: <FaClock className="w-3 h-3" />,
        text: 'Probation',
        bg: 'bg-amber-100',
        textColor: 'text-amber-700',
        border: 'border-amber-200'
      },
      completed: {
        icon: <FaCheckCircle className="w-3 h-3" />,
        text: 'Completed',
        bg: 'bg-blue-100',
        textColor: 'text-blue-700',
        border: 'border-blue-200'
      }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.textColor} border ${config.border}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

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

  // Helper function to get performance level
  const getPerformanceLevel = (score) => {
    if (!score && score !== 0) return 'Not Rated';
    const roundedScore = Math.round(score);
    if (roundedScore >= 85) return 'Excellent';
    if (roundedScore >= 70) return 'Good';
    if (roundedScore >= 50) return 'Average';
    return 'Needs Improvement';
  };

  // Helper function to get initial avatar color based on name
  const getAvatarColor = (name) => {
    const gradients = [
      'from-emerald-500 to-teal-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600',
      'from-cyan-500 to-sky-600'
    ];
    if (!name) return gradients[0];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Check if intern has any issues
  const hasIssues = intern.isCompliantIssue || intern.isDisciplineIssue;
  const issueCount = [intern.isCompliantIssue, intern.isDisciplineIssue].filter(Boolean).length;

  // Calculate score for display
  const displayScore = intern.score ? Math.round(intern.score) : 0;
  const scoreColor = getScoreColor(intern.score);
  const scoreBgColor = getScoreBgColor(intern.score);
  const avatarGradient = getAvatarColor(intern.name);
  const performanceLevel = getPerformanceLevel(intern.score);

  // Get status based on intern data
  const getInternStatus = () => {
    if (intern.status) return intern.status;
    if (intern.isActive && intern.isProbation) return 'probation';
    if (intern.isActive) return 'active';
    if (intern.isCompleted) return 'completed';
    return 'inactive';
  };

  const internStatus = getInternStatus();
  const statusBadge = getStatusBadge(internStatus);

  return (
    <div className={`
      bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
      overflow-hidden border border-gray-100 relative group
      ${variant === 'compact' ? 'max-w-sm' : 'max-w-md'}
    `}>
      {/* Decorative gradient line at top */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${avatarGradient}`}></div>

      {/* Header with avatar and basic info */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br ${avatarGradient} rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-md`}>
              {intern.name?.charAt(0) || '?'}
            </div>
            {hasIssues && (
              <div className="absolute -top-1 -right-1">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white text-[10px] text-white items-center justify-center font-bold">
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
                <h3 className="font-bold text-gray-900 text-lg truncate">
                  {intern.name || 'Unknown Intern'}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FaIdCard className="w-3 h-3" />
                  ID: {intern._id?.slice(-6) || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <FaStar className="w-3 h-3 text-amber-400" />
                  <span className={`font-bold text-sm ${scoreColor}`}>
                    {displayScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Department and Role */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                <FaUsers className="w-3 h-3" />
                {intern.department || 'No Dept'}
              </span>
              {intern.role && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                  <FaUserTie className="w-3 h-3" />
                  {intern.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="truncate">
              <p className="text-xs text-gray-400">Course</p>
              <p className="font-medium truncate" title={intern.course}>
                {intern.course || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaUserTie className="w-4 h-4 text-blue-600" />
            </div>
            <div className="truncate">
              <p className="text-xs text-gray-400">Mentor</p>
              <p className="font-medium truncate" title={intern.mentor}>
                {intern.mentor || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="w-4 h-4 text-amber-600" />
            </div>
            <div className="truncate">
              <p className="text-xs text-gray-400">End Date</p>
              <p className="font-medium text-xs" title={formatDate(intern.endDate)}>
                {formatDate(intern.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
              <FaChartLine className="w-4 h-4 text-rose-600" />
            </div>
            <div className="truncate">
              <p className="text-xs text-gray-400">Performance</p>
              <p className={`font-medium text-xs ${scoreColor}`}>
                {performanceLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Contact information */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaEnvelope className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${intern.email}`} className="text-blue-600 hover:underline truncate">
              {intern.email || 'No email'}
            </a>
          </div>
          {intern.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <span>{intern.phone}</span>
            </div>
          )}
          {intern.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
              <span className="truncate">{intern.location}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Performance Score</span>
            <span className={`font-bold ${scoreColor}`}>{displayScore}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${scoreBgColor} transition-all duration-700 relative`}
              style={{ width: `${displayScore}%` }}
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-white opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Issue Indicators */}
        {hasIssues && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {intern.isCompliantIssue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                <FaExclamationTriangle className="w-3 h-3" />
                Compliance Issue
              </span>
            )}
            {intern.isDisciplineIssue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium">
                <FaFlag className="w-3 h-3" />
                Discipline Issue
              </span>
            )}
          </div>
        )}

        {/* Skills/Tags */}
        {intern.skills && intern.skills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {intern.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                >
                  {skill}
                </span>
              ))}
              {intern.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                  +{intern.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer with status and actions */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {statusBadge}
          </div>
          <div className="flex items-center gap-1">
            
            {/* View Button - Conditionally rendered */}
            {!hideAllButtons && showViewButton && onView && (
              <button
                onClick={() => onView(intern)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group relative"
                title="View Details"
              >
                <FaEye className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                {/* <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  View Details
                </span> */}
              </button>
            )}
            
            {/* Edit Button - Conditionally rendered */}
            {!hideAllButtons && showEditButton && onEdit && (
              <button
                onClick={() => onEdit(intern)}
                className="p-2 hover:bg-amber-50 rounded-lg transition-colors group relative"
                title="Edit Intern"
              >
                <FaEdit className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                {/* <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Edit
                </span> */}
              </button>
            )}
            
            {/* Share Button - Conditionally rendered */}
            {!hideAllButtons && showShareButton && onShare && (
              <button
                onClick={() => onShare(intern)}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors group relative"
                title="Share Profile"
              >
                <FaShare className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Share
                </span>
              </button>
            )}
          </div>
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
  variant: 'default',
  // Button visibility defaults
  showViewButton: true,
  showEditButton: true,
  showEmailButton: true,
  showShareButton: true,
  hideAllButtons: false
};

export default InternCard;