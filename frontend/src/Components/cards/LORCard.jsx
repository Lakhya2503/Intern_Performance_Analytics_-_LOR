import React, { useState } from 'react';
import {
  FaEye,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDownload,
  FaMagic,
  FaPaperPlane,
  FaUserGraduate,
  FaCalendarAlt,
  FaBuilding,
  FaIdCard,
  FaStar,
  FaRegFilePdf,
  FaFilePdf,
  FaExclamationTriangle,
  FaComment,
  FaCommentAlt,
  FaInfoCircle
} from 'react-icons/fa';

const LORCard = ({
  intern,
  onGenerate,
  onPreview,
  onDownload,
  onSendEmail,
  hoveredItem,
  setHoveredItem
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showRejectionDetails, setShowRejectionDetails] = useState(false);

  // Check if intern is rejected (based on approval status false)
  const isRejected = intern.approval?.status === false;
  const rejectionComment = intern.approval?.comment || intern.rejectionReason;

  const getStatusBadge = () => {
    if (isRejected) {
      return (
        <div className="absolute top-3 right-3">
          <div className="relative group">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 shadow-sm">
              <FaTimesCircle className="w-3 h-3" />
              Rejected
            </span>
            {/* Rejection reason tooltip */}
            {rejectionComment && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white rounded-xl shadow-xl border border-red-100 z-20 hidden group-hover:block animate-fadeIn">
                <div className="flex items-start gap-2">
                  <FaCommentAlt className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">{rejectionComment}</p>
                </div>
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-red-100 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (intern.lorGenerated) {
      return (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 shadow-sm">
            <FaCheckCircle className="w-3 h-3" />
            LOR Generated
          </span>
        </div>
      );
    }

    return (
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">
          <FaClock className="w-3 h-3" />
          Pending
        </span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get card style based on status
  const getCardStyle = () => {
    if (isRejected) {
      return 'ring-1 ring-red-200 bg-red-50/30';
    }
    return 'border-gray-100';
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => {
        setHoveredItem(intern._id);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setHoveredItem(null);
        setShowActions(false);
      }}
    >
      {/* Main Card */}
      <div className={`
        bg-white rounded-2xl shadow-lg overflow-hidden
        transform transition-all duration-300
        ${hoveredItem === intern._id ? 'scale-102 shadow-xl ring-2 ring-indigo-200' : 'hover:shadow-xl'}
        border ${getCardStyle()}
      `}>
        {/* Header with Gradient - Different for rejected */}
        <div className={`
          bg-gradient-to-r p-4 relative
          ${isRejected
            ? 'from-red-500 to-pink-600'
            : intern.lorGenerated
              ? 'from-green-500 to-emerald-600'
              : 'from-indigo-500 to-purple-600'}
        `}>
          <div className="absolute inset-0 bg-black opacity-10"></div>

          {/* Avatar and Status */}
          <div className="relative flex items-center gap-4">
            <div className={`
              w-16 h-16 bg-white rounded-xl flex items-center justify-center
              text-2xl font-bold shadow-lg
              ${isRejected ? 'text-red-600' : intern.lorGenerated ? 'text-green-600' : 'text-indigo-600'}
              transform transition-all duration-300
              ${hoveredItem === intern._id ? 'scale-110 rotate-3' : ''}
            `}>
              {intern.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-bold text-lg truncate">{intern.name}</h3>
              <p className="text-indigo-100 text-sm truncate flex items-center gap-1">
                <FaEnvelope className="w-3 h-3" />
                {intern.email}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          {getStatusBadge()}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <FaBuilding className="w-3 h-3" />
                <span className="text-xs font-medium">Department</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {intern.department || 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <FaCalendarAlt className="w-3 h-3" />
                <span className="text-xs font-medium">End Date</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(intern.endDate)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <FaIdCard className="w-3 h-3" />
                <span className="text-xs font-medium">ID</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {intern._id?.slice(-6) || 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <FaStar className="w-3 h-3" />
                <span className="text-xs font-medium">Score</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {intern.score || intern.approval?.score || '-'}
              </p>
            </div>
          </div>

          {/* Rejection Details - Expanded View */}
          {isRejected && rejectionComment && (
            <div className="mb-4">
              <button
                onClick={() => setShowRejectionDetails(!showRejectionDetails)}
                className="w-full text-left"
              >
                <div className={`
                  p-3 bg-red-50 rounded-xl border border-red-200
                  transition-all duration-300 hover:bg-red-100
                  ${showRejectionDetails ? 'rounded-b-none' : ''}
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-medium text-red-700">Rejection Reason</span>
                    </div>
                    <FaInfoCircle className={`w-4 h-4 text-red-400 transition-transform duration-300 ${showRejectionDetails ? 'rotate-180' : ''}`} />
                  </div>
                  {!showRejectionDetails && (
                    <p className="text-xs text-red-600 mt-2 line-clamp-2">
                      {rejectionComment}
                    </p>
                  )}
                </div>
              </button>

              {/* Expanded Comment Section */}
              {showRejectionDetails && (
                <div className="p-4 bg-red-50/50 border border-t-0 border-red-200 rounded-b-xl animate-slideDown">
                  <div className="flex items-start gap-3">
                    <FaCommentAlt className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {rejectionComment}
                      </p>
                      {intern.approval?.updatedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Rejected on: {formatDate(intern.approval.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generated Date if LOR exists */}
          {intern.lorGenerated && intern.lorGeneratedDate && (
            <div className="mb-4 p-2 bg-green-50 rounded-xl border border-green-100">
              <p className="text-xs text-green-700 flex items-center gap-2">
                <FaCheckCircle className="w-3 h-3" />
                Generated on: {intern.lorGeneratedDate}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {isRejected ? (
              <div className="flex-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onGenerate(intern)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm font-medium col-span-2"
                >
                  <FaMagic className="w-4 h-4" />
                  Regenerate LOR
                </button>
              </div>
            ) : !intern.lorGenerated ? (
              <button
                onClick={() => onGenerate(intern)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm font-medium"
              >
                <FaMagic className="w-4 h-4" />
                Generate LOR
              </button>
            ) : (
              <div className="flex-1 grid grid-cols-3 gap-2">
                <button
                  onClick={() => onPreview(intern)}
                  className="flex items-center justify-center p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all duration-300 hover:scale-105"
                  title="Preview LOR"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDownload(intern)}
                  className="flex items-center justify-center p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all duration-300 hover:scale-105"
                  title="Download LOR"
                >
                  <FaDownload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSendEmail(intern)}
                  className="flex items-center justify-center p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all duration-300 hover:scale-105"
                  title="Send Email"
                >
                  <FaEnvelope className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LORCard;
