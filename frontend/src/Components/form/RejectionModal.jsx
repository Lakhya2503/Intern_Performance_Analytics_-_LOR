import React, { useState } from 'react';
import {
  FaTimes,
  FaExclamationTriangle,
  FaComment,
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaBuilding
} from 'react-icons/fa';

const RejectionModal = ({
  isOpen,
  onClose,
  intern,
  rejectionData,
  setRejectionData,
  onSubmit,
  actionLoading
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen || !intern) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate comment before showing confirmation
    if (!rejectionData.comment.trim()) {
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmRejection = () => {
    onSubmit(); // Parent component already has the data in rejectionData
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaExclamationTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">
                    Reject LOR Request
                  </h3>
                  <p className="text-red-100 text-sm mt-1">
                    for {intern.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <FaExclamationTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                    Important
                  </h4>
                  <p className="text-xs text-yellow-700">
                    Rejecting this LOR request will mark it as rejected. 
                    This action cannot be undone and the intern will be notified.
                  </p>
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            <div>
              <label 
                htmlFor="rejection-comment"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <FaComment className="text-red-500" />
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-comment"
                value={rejectionData.comment}
                onChange={(e) => setRejectionData(prev => ({ 
                  ...prev, 
                  comment: e.target.value 
                }))}
                rows="4"
                required
                disabled={actionLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                placeholder="e.g., Intern has not completed the minimum required hours..."
              />
              <p className="text-xs text-gray-500 mt-2">
                This comment will be saved with the rejection record
              </p>
            </div>

            {/* Status Badge */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Status will be set to:
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Rejected
                </span>
              </div>
            </div>

            {/* Intern Info Card */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Intern Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaUser className="w-3 h-3 text-gray-400" />
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p className="font-medium text-gray-900">{intern.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-3 h-3 text-gray-400" />
                  <div>
                    <p className="text-gray-500 text-xs">Department</p>
                    <p className="font-medium text-gray-900">
                      {intern.department || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <FaEnvelope className="w-3 h-3 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="font-medium text-gray-900 truncate" title={intern.email}>
                      {intern.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading || !rejectionData.comment.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Review Rejection
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={handleCancel}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Are you absolutely sure?
              </h3>
              <p className="text-gray-600">
                This will reject <span className="font-semibold">{intern.name}</span>'s LOR request.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700">
                <span className="font-semibold">Warning:</span> This action cannot be undone. 
                The intern will be notified of this rejection.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Rejection reason:
              </p>
              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                "{rejectionData.comment}"
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                No, Go Back
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-4 h-4" />
                    Yes, Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RejectionModal;