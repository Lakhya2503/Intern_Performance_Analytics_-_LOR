import React from 'react';
import {
  FaTimes,
  FaUserTie,
  FaFileAlt,
  FaSpinner,
  FaCheck,
  FaToggleOn,
  FaToggleOff,
  FaPaperPlane
} from 'react-icons/fa';

const LORFormModal = ({
  isOpen,
  onClose,
  intern,
  lorFormData,
  setLorFormData,
  onSubmit,
  actionLoading
}) => {
  if (!isOpen || !intern) return null;

  // Helper functions to convert between UI display and server values
  const getDisplayStatus = () => lorFormData.status ? 'sent' : 'draft';

  const handleStatusChange = (value) => {
    // Convert UI string to server boolean
    setLorFormData(prev => ({
      ...prev,
      status: value === 'sent'
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    if (type === 'checkbox') {
      setLorFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'status') {
      handleStatusChange(value);
    } else {
      setLorFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleSendStatus = () => {
    setLorFormData(prev => ({ ...prev, sendStatus: !prev.sendStatus }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Data is already in server format (status is boolean)
    onSubmit(lorFormData);
  };

  const displayStatus = getDisplayStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold">Generate Letter of Recommendation</h3>
              <p className="text-indigo-100 text-sm mt-1">for {intern.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ready to Send Status - Visual indicator */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaPaperPlane className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Ready to Send</h4>
              <p className="text-sm text-green-600">This LOR will be marked as sent</p>
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaUserTie className="text-indigo-600" />
              Recipient Information
            </h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="recipientName" className="block text-xs font-medium text-gray-500 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={lorFormData.recipientName || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., Dr. John Smith"
                />
              </div>
              <div>
                <label htmlFor="recipientEmail" className="block text-xs font-medium text-gray-500 mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  name="recipientEmail"
                  value={lorFormData.recipientEmail || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., john@university.edu"
                />
              </div>
            </div>
          </div>

          {/* Send Email Toggle (only shown when status is 'sent') */}
          {lorFormData.status && ( // Only show when status is true (sent)
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Send Options</h4>
              <button
                type="button"
                onClick={handleToggleSendStatus}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-700">Send LOR via Email</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {lorFormData.sendStatus
                      ? 'Email will be sent immediately'
                      : 'Toggle on to send email immediately'}
                  </p>
                </div>
                <div className="text-3xl">
                  {lorFormData.sendStatus ? (
                    <FaToggleOn className="text-indigo-600" />
                  ) : (
                    <FaToggleOff className="text-gray-400" />
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Intern Summary */}
          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-indigo-900 mb-3">Intern Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-indigo-700 text-xs">Department</p>
                <p className="font-medium text-indigo-900">{intern.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-indigo-700 text-xs">Course</p>
                <p className="font-medium text-indigo-900">{intern.course || 'N/A'}</p>
              </div>
              <div>
                <p className="text-indigo-700 text-xs">End Date</p>
                <p className="font-medium text-indigo-900">
                  {intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              {intern.duration && (
                <div>
                  <p className="text-indigo-700 text-xs">Duration</p>
                  <p className="font-medium text-indigo-900">{intern.duration}</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Status Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">LOR Status:</span>
                <span className="font-medium text-green-600">
                  Sent
                </span>
              </div>
              {lorFormData.status && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email Status:</span>
                  <span className={`font-medium ${lorFormData.sendStatus ? 'text-green-600' : 'text-gray-600'}`}>
                    {lorFormData.sendStatus ? 'Will send email' : 'Will not send email'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient:</span>
                <span className="font-medium text-gray-700 truncate max-w-[200px]">
                  {lorFormData.recipientName || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Hidden field to ensure sendStatus is included */}
          <input type="hidden" name="sendStatus" value={lorFormData.sendStatus ? 'true' : 'false'} />

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {actionLoading ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  Confirm & Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LORFormModal;