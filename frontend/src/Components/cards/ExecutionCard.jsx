import React, { useState } from 'react';
import {
  FiMail,
  FiClock,
  FiStar,
  FiEye,
  FiMessageCircle,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiToggleLeft,
  FiToggleRight,
  FiUserPlus
} from 'react-icons/fi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineSecurity,
  MdOutlineEmail
} from 'react-icons/md';
import {
  BsPersonBadge,
  BsShieldCheck,
  BsShieldX,
  BsGraphUp,
  BsClockHistory
} from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';

const ExecutionCard = ({ member, onUpdateAuth, isUpdating }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Destructure with actual API field names
  const {
    _id,
    username,
    email,
    role,
    isAuthorized,
    createdAt,
    updatedAt,
    // Add any additional fields that might come from API
  } = member;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarGradient = (id) => {
    const gradients = [
      'from-teal-500 to-emerald-500',
      'from-blue-500 to-indigo-500',
      'from-purple-500 to-pink-500',
      'from-amber-500 to-orange-500',
      'from-rose-500 to-red-500',
      'from-cyan-500 to-sky-500'
    ];
    const index = id ? id.length % gradients.length : 0;
    return gradients[index];
  };

  const getAuthStatusBadge = (authorized) => {
    return authorized
      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200'
      : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border-gray-200';
  };

  const getAuthIcon = (authorized) => {
    return authorized ? <BsShieldCheck className="text-emerald-500" /> : <BsShieldX className="text-gray-400" />;
  };

  // Calculate member since
  const memberSince = formatDate(createdAt);
  const lastUpdated = formatDate(updatedAt);

  // Check if member is new (joined within last 7 days)
  const isNew = createdAt && (new Date() - new Date(createdAt)) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card with enhanced styling */}
      <div
        className={`bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden ${
          isAuthorized
            ? 'border-emerald-200 hover:border-emerald-300'
            : 'border-gray-200 hover:border-gray-300'
        } ${isHovered ? 'transform -translate-y-2 shadow-xl' : 'shadow-md'}`}
      >


        {/* Card Header with gradient based on authorization */}
        <div className={`relative px-5 py-4 border-b ${
          isAuthorized
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200'
            : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
        }`}>
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isAuthorized ? '#10b981' : '#9ca3af'} 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="relative flex items-center gap-4">
            {/* Avatar Section with gradient */}
            <div className="relative">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAvatarGradient(_id)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                {getAvatarInitials(username || 'User')}
              </div>

              {/* Authorization Indicator */}
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                isAuthorized ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></span>
            </div>

            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 truncate text-lg">
                  {username || 'Unknown User'}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 shadow-sm flex items-center gap-1">
                  <FiBriefcase className="text-gray-400" />
                  {role || 'Execution Team'}
                </span>
              </div>
            </div>

            {/* Auth Status Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isAuthorized ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              {getAuthIcon(isAuthorized)}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Member Details with improved styling */}
          <div className="space-y-3 mb-4">
            {/* Email with icon */}
            <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
                <MdOutlineEmail className="text-teal-600 text-sm" />
              </div>
              <span className="text-gray-600 truncate flex-1">{email || 'No email provided'}</span>
            </div>

            {/* Authorization Status with inline toggle */}
            <div className="flex items-center justify-between gap-2">
              <div className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 ${getAuthStatusBadge(isAuthorized)}`}>
                {isAuthorized ? (
                  <>
                    <div className="w-5 h-5 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                      <FiCheckCircle className="text-xs" />
                    </div>
                    <span>Authorized</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 bg-gray-400 rounded-lg flex items-center justify-center text-white">
                      <FiXCircle className="text-xs" />
                    </div>
                    <span>Not Authorized</span>
                  </>
                )}
              </div>

              {/* Inline Toggle Button */}
              <button
                onClick={onUpdateAuth}
                disabled={isUpdating}
                className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isAuthorized
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isAuthorized ? <FiToggleRight className="text-xl" /> : <FiToggleLeft className="text-xl" />}
                    <span>Toggle</span>
                  </div>
                )}
              </button>
            </div>

            {/* Dates Information */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="text-teal-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-xs font-medium text-gray-700">{memberSince}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiClock className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-xs font-medium text-gray-700">{lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="flex items-center gap-2 text-xs bg-teal-50 p-2 rounded-lg border border-teal-100">
              <span className="flex items-center gap-1 text-teal-700">
                <MdOutlineSecurity className="text-teal-500" />
                Role: {role || 'Execution Team'}
              </span>
              <span className="w-1 h-1 bg-teal-300 rounded-full"></span>
              <span className="flex items-center gap-1 text-teal-700">
                <FiActivity className="text-teal-500" />
                ID: {_id ? _id.slice(-6) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Action Buttons with enhanced styling */}
          <div className="flex gap-2">
            <button
              onClick={onUpdateAuth}
              disabled={isUpdating}
              className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <MdOutlineAdminPanelSettings className="text-base" />
                  {isAuthorized ? 'Revoke Auth' : 'Grant Auth'}
                </>
              )}
            </button>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 text-gray-700 py-2.5 px-3 rounded-lg text-sm font-medium hover:from-gray-200 hover:to-gray-100 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <FiEye className="text-base" />
              {showDetails ? 'Hide' : 'Details'}
            </button>
          </div>

          {/* Expandable Details Section */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 animate-slideDown">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BsGraphUp className="text-teal-600" />
                Member Details
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-medium text-gray-700">{_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Username:</span>
                  <span className="font-medium text-gray-700">{username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-700">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span className="font-medium text-gray-700">{role || 'Execution Team'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium text-gray-700">{new Date(createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium text-gray-700">{new Date(updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer with subtle gradient */}
        <div className={`px-5 py-2 border-t ${
          isAuthorized
            ? 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-emerald-200'
            : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-gray-500">
              <FiMessageCircle className="text-teal-500" />
              {isAuthorized ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .hover\:scale-105:hover {
          transform: scale(1.05);
        }

        .transform {
          transition: transform 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionCard;
