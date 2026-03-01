import React, { useState } from 'react';
import {
  FiMail,
  FiClock,
  FiShield,
  FiStar,
  FiEye,
  FiMessageCircle,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiTrendingUp,
  FiAward,
  FiCalendar
} from 'react-icons/fi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineSecurity
} from 'react-icons/md';
import { BsPersonBadge, BsPersonCheck, BsPersonX } from 'react-icons/bs';

const ExecutionCard = ({ member, onUpdateAuth }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    name, 
    role, 
    email, 
    active, 
    isAuthorized, 
    score, 
    avatar, 
    lastActive = '2 hours ago', 
    online = true,
    department = 'Execution',
    experience = '3 years',
    tasksCompleted = 156,
    successRate = '98%'
  } = member;

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-teal-600',
      'bg-blue-600',
      'bg-green-600',
      'bg-amber-600',
      'bg-purple-600'
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const getAuthStatusBadge = (authorized) => {
    return authorized
      ? 'bg-teal-100 text-teal-700 border-teal-200'
      : 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getScoreColor = (scoreValue) => {
    if (scoreValue >= 90) return 'text-green-600';
    if (scoreValue >= 70) return 'text-teal-600';
    if (scoreValue >= 50) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card */}
      <div 
        className={`bg-white rounded-lg border ${
          isAuthorized ? 'border-teal-200' : 'border-gray-200'
        } shadow-sm hover:shadow-md transition-all duration-300 ${
          isHovered ? 'transform -translate-y-1' : ''
        }`}
      >
        {/* Card Header */}
        <div className={`px-5 py-4 border-b ${
          isAuthorized ? 'bg-teal-50 border-teal-100' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            {/* Avatar Section */}
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className={`w-12 h-12 rounded-lg object-cover border-2 ${
                    isAuthorized ? 'border-teal-200' : 'border-gray-200'
                  }`}
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg ${getAvatarColor(name)} flex items-center justify-center text-white font-semibold`}>
                  {getAvatarInitials(name)}
                </div>
              )}
              
              {/* Online/Offline Indicator */}
              <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                online ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
            </div>

            {/* Name and Role */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate flex items-center gap-2">
                {name}
                {active && (
                  <FiCheckCircle className="text-green-500 text-sm" />
                )}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white text-gray-700 px-2 py-0.5 rounded-full text-xs border border-gray-200">
                  {role || 'Team Member'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Member Details */}
          <div className="space-y-3 mb-4">
            {/* Email */}
            <div className="flex items-center gap-2 text-sm">
              <FiMail className="text-gray-400 text-sm" />
              <span className="text-gray-600 truncate">{email || 'N/A'}</span>
            </div>

            {/* Authorization Status */}
            <div className="flex items-center gap-2 text-sm">
              <MdOutlineSecurity className="text-gray-400 text-sm" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAuthStatusBadge(isAuthorized)}`}>
                {isAuthorized ? 'Authorized' : 'Not Authorized'}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-sm">
              <FiUser className="text-gray-400 text-sm" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Department & Experience */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <FiActivity className="text-gray-400" />
                {department}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar className="text-gray-400" />
                {experience}
              </span>
            </div>

            {/* Tasks & Success Rate */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-600">Tasks</p>
                <p className="text-lg font-semibold text-gray-800">{tasksCompleted}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-600">Success</p>
                <p className="text-lg font-semibold text-green-600">{successRate}</p>
              </div>
            </div>
          </div>

          {/* Performance Score */}
          {score && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <FiStar className="text-amber-500" />
                  Performance Score:
                </span>
                <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    score >= 90 ? 'bg-green-500' :
                    score >= 70 ? 'bg-teal-500' :
                    score >= 50 ? 'bg-amber-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Last Active */}
          <div className="mb-4 flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            <span className="flex items-center gap-1">
              <FiClock className="text-gray-400" />
              Last active: {lastActive}
            </span>
            {online && (
              <span className="flex items-center gap-1 text-green-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Online
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onUpdateAuth}
              className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-teal-200 focus:outline-none flex items-center justify-center gap-2"
            >
              <MdOutlineAdminPanelSettings className="text-base" />
              Manage Auth
            </button>

            <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none flex items-center justify-center gap-2">
              <FiEye className="text-base" />
              Details
            </button>
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
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionCard;