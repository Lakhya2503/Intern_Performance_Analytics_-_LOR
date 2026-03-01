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
  FaBan,
  FaRedoAlt,
  FaSpinner,
  FaQuestionCircle,
  FaBuilding,
  FaCalendarAlt,
  FaIdCard,
  FaStar,
  FaExclamationTriangle,
  FaCommentAlt,
  FaInfoCircle
} from 'react-icons/fa';

const LORCard = ({
  intern,
  onGenerate,
  onReject,
  onSendEmail,
  onResendEmail,
  onDownload,
  hoveredItem,
  setHoveredItem,
  isSending = false
}) => {
  const [showRejectionDetails, setShowRejectionDetails] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showResendConfirm, setShowResendConfirm] = useState(false);

  // Status checks
  const isRejected = intern.status === 'rejected' || intern.rejectionReason;
  const isGenerated = intern.lorGenerated || intern.status === 'generated';
  const isPending = !isRejected && !isGenerated;
  const rejectionComment = intern.approval?.comment || intern.rejectionReason;
  const isEmailSending = isSendingEmail || isSending;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handlers
  const handleSendEmail = async () => {
    if (isEmailSending) return;
    setIsSendingEmail(true);
    setShowResendConfirm(false);
    
    try {
      if (onResendEmail) {
        await onResendEmail(intern);
      } else {
        await onSendEmail(intern);
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleResendClick = (e) => {
    e.stopPropagation();
    setShowResendConfirm(true);
  };

  const handleCancelResend = (e) => {
    e.stopPropagation();
    setShowResendConfirm(false);
  };

  // Status badge configuration
  const getStatusConfig = () => {
    if (isRejected) {
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: FaTimesCircle,
        label: 'Rejected'
      };
    }
    if (isGenerated) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: FaCheckCircle,
        label: 'LOR Generated'
      };
    }
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: FaClock,
      label: 'Pending'
    };
  };

  // Card styling based on status
  const cardStyles = {
    rejected: 'ring-1 ring-red-200 bg-red-50/30',
    generated: 'ring-1 ring-green-200 bg-green-50/30',
    pending: 'border-gray-100'
  };

  const gradientStyles = {
    rejected: 'from-red-500 to-pink-600',
    generated: 'from-green-500 to-emerald-600',
    pending: 'from-indigo-500 to-purple-600'
  };

  const avatarColors = {
    rejected: 'text-red-600',
    generated: 'text-green-600',
    pending: 'text-indigo-600'
  };

  const status = isRejected ? 'rejected' : isGenerated ? 'generated' : 'pending';
  const StatusIcon = getStatusConfig().icon;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowResendConfirm(false)}
    >
      {/* Main Card */}
      <div className={`
        bg-white rounded-2xl shadow-lg overflow-hidden
        transform transition-all duration-300
        ${hoveredItem === intern._id ? 'scale-102 shadow-xl ring-2 ring-indigo-200' : 'hover:shadow-xl'}
        border ${cardStyles[status]}
      `}>
        {/* Header with Gradient */}
        <div className={`
          bg-gradient-to-r p-4 relative
          ${gradientStyles[status]}
        `}>
          <div className="absolute inset-0 bg-black opacity-10" />

          {/* Avatar and Info */}
          <div className="relative flex items-center gap-4">
            <div className={`
              w-16 h-16 bg-white rounded-xl flex items-center justify-center
              text-2xl font-bold shadow-lg ${avatarColors[status]}
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
          <div className="absolute top-3 right-3">
            <div className="relative group">
              <span className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                text-xs font-medium border shadow-sm
                ${getStatusConfig().bg} ${getStatusConfig().text} ${getStatusConfig().border}
              `}>
                <StatusIcon className="w-3 h-3" />
                {getStatusConfig().label}
              </span>
              
              {/* Rejection tooltip */}
              {isRejected && rejectionComment && (
                <div className="absolute right-0 mt-2 w-64 p-3 bg-white rounded-xl shadow-xl border border-red-100 z-20 hidden group-hover:block animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <FaCommentAlt className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">{rejectionComment}</p>
                  </div>
                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-red-100 transform rotate-45" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <DetailCard
              icon={FaBuilding}
              color="text-indigo-600"
              label="Department"
              value={intern.department || 'N/A'}
            />
            <DetailCard
              icon={FaCalendarAlt}
              color="text-purple-600"
              label="End Date"
              value={formatDate(intern.endDate)}
            />
            <DetailCard
              icon={FaIdCard}
              color="text-green-600"
              label="ID"
              value={intern._id?.slice(-6) || 'N/A'}
            />
            <DetailCard
              icon={FaStar}
              color="text-orange-600"
              label="Score"
              value={intern.score || intern.approval?.score || '-'}
            />
          </div>

          {/* Rejection Details */}
          {isRejected && rejectionComment && (
            <RejectionDetails
              comment={rejectionComment}
              isOpen={showRejectionDetails}
              onToggle={() => setShowRejectionDetails(!showRejectionDetails)}
              updatedAt={intern.approval?.updatedAt}
              formatDate={formatDate}
            />
          )}

          {/* Generated Info */}
          {isGenerated && (
            <GeneratedInfo
              generatedDate={intern.lorGeneratedDate || intern.approval?.updatedAt}
              lastEmailSent={intern.lastEmailSent}
              emailSentCount={intern.emailSentCount}
              formatDate={formatDate}
            />
          )}

          {/* Actions */}
          <div className="relative">
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              {isRejected ? (
                <RegenerateButton onGenerate={() => onGenerate(intern)} />
              ) : isGenerated ? (
                <GeneratedActions
                  onResend={handleResendClick}
                  onDownload={onDownload ? () => onDownload(intern) : null}
                  previewUrl={intern.previewUrl}
                  isEmailSending={isEmailSending}
                />
              ) : (
                <PendingActions
                  onGenerate={() => onGenerate(intern)}
                  onReject={() => onReject(intern)}
                />
              )}
            </div>

            {/* Resend Confirmation */}
            {showResendConfirm && isGenerated && (
              <ResendConfirmation
                email={intern.email}
                lastEmailSent={intern.lastEmailSent}
                isEmailSending={isEmailSending}
                onConfirm={handleSendEmail}
                onCancel={handleCancelResend}
                formatDate={formatDate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{styles}</style>
    </div>
  );
};

// Sub-components
const DetailCard = ({ icon: Icon, color, label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <div className={`flex items-center gap-2 ${color} mb-1`}>
      <Icon className="w-3 h-3" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
  </div>
);

const RejectionDetails = ({ comment, isOpen, onToggle, updatedAt, formatDate }) => (
  <div className="mb-4">
    <button onClick={onToggle} className="w-full text-left">
      <div className={`
        p-3 bg-red-50 rounded-xl border border-red-200
        transition-all duration-300 hover:bg-red-100
        ${isOpen ? 'rounded-b-none' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-red-700">Rejection Reason</span>
          </div>
          <FaInfoCircle className={`w-4 h-4 text-red-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {!isOpen && (
          <p className="text-xs text-red-600 mt-2 line-clamp-2">{comment}</p>
        )}
      </div>
    </button>

    {isOpen && (
      <div className="p-4 bg-red-50/50 border border-t-0 border-red-200 rounded-b-xl animate-slideDown">
        <div className="flex items-start gap-3">
          <FaCommentAlt className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment}</p>
            {updatedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Rejected on: {formatDate(updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);

const GeneratedInfo = ({ generatedDate, lastEmailSent, emailSentCount, formatDate }) => (
  <div className="mb-4 space-y-2">
    <div className="p-2 bg-green-50 rounded-xl border border-green-100">
      <p className="text-xs text-green-700 flex items-center gap-2">
        <FaCheckCircle className="w-3 h-3" />
        Generated on: {generatedDate ? formatDate(generatedDate) : 'N/A'}
      </p>
    </div>

    {lastEmailSent && (
      <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700 flex items-center gap-2">
          <FaEnvelope className="w-3 h-3" />
          Last email sent: {formatDate(lastEmailSent)}
        </p>
      </div>
    )}

    {/* {emailSentCount && emailSentCount > 1 && (
      <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
        <p className="text-xs text-purple-700 flex items-center gap-2">
          <FaPaperPlane className="w-3 h-3" />
          Emails sent: {emailSentCount} times
        </p>
      </div>
    )} */}  
  </div>
);

const RegenerateButton = ({ onGenerate }) => (
  <button
    onClick={onGenerate}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
      bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl 
      hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
      transform hover:scale-105 hover:shadow-lg text-sm font-medium"
  >
    <FaMagic className="w-4 h-4" />
    Regenerate LOR
  </button>
);

const PendingActions = ({ onGenerate, onReject }) => (
<>
  <button
    onClick={onGenerate}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
      bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl 
      hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
      transform hover:scale-105 hover:shadow-lg text-sm font-medium"
  >
    <FaMagic className="w-4 h-4" />
    Generate LOR
  </button>
  <button
    onClick={onReject}
    className="flex items-center justify-center px-4 py-2.5 bg-red-50 
      text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 
      text-sm font-medium gap-2"
    title="Reject Request"
  >
    <FaBan className="w-4 h-4" />
    Reject Request
  </button>
</>
);

const GeneratedActions = ({ onResend, onDownload, previewUrl, isEmailSending }) => (
  <>
    <button
      onClick={onResend}
      disabled={isEmailSending}
      className={`
        flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
        bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl 
        transition-all duration-300 text-sm font-medium
        ${isEmailSending 
          ? 'opacity-75 cursor-not-allowed' 
          : 'hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg'
        }
      `}
    >
      {isEmailSending ? (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <FaRedoAlt className="w-4 h-4" />
          Resend Email
        </>
      )}
    </button>

    {onDownload && (
      <button
        onClick={onDownload}
        disabled={isEmailSending}
        className="flex items-center justify-center px-4 py-2.5 bg-gray-100 
          text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 
          text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download LOR"
      >
        <FaDownload className="w-4 h-4" />
      </button>
    )}

    {previewUrl && (
      <button
        onClick={() => window.open(previewUrl, '_blank')}
        disabled={isEmailSending}
        className="flex items-center justify-center px-4 py-2.5 bg-gray-100 
          text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 
          text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        title="Preview LOR"
      >
        <FaEye className="w-4 h-4" />
      </button>
    )}
  </>
);

const ResendConfirmation = ({ email, lastEmailSent, isEmailSending, onConfirm, onCancel, formatDate }) => (
  <div className="absolute inset-x-0 bottom-0 mb-2 mx-2 p-4 bg-white rounded-xl 
    shadow-2xl border border-blue-200 z-30 animate-slideUp">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <FaQuestionCircle className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 text-sm">Confirm Resend Email</h4>
        <p className="text-xs text-gray-600 mt-1">
          Are you sure you want to resend the LOR email to{' '}
          <span className="font-medium text-blue-600">{email}</span>?
        </p>
        {lastEmailSent && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <FaEnvelope className="w-3 h-3" />
            Last sent: {formatDate(lastEmailSent)}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onConfirm}
        disabled={isEmailSending}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
          bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg 
          hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 
          text-xs font-medium disabled:opacity-50"
      >
        {isEmailSending ? (
          <>
            <FaSpinner className="w-3 h-3 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <FaPaperPlane className="w-3 h-3" />
            Confirm Send
          </>
        )}
      </button>
      <button
        onClick={onCancel}
        disabled={isEmailSending}
        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg 
          hover:bg-gray-200 transition-all duration-300 text-xs font-medium 
          disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
    <div className="absolute -top-2 right-16 w-4 h-4 bg-white border-t border-l 
      border-blue-200 transform rotate-45" />
  </div>
);

// Styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
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
`;

export default LORCard;