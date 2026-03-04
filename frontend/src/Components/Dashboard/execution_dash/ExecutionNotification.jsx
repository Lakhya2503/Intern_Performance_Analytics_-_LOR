import React, { useState, useEffect } from 'react';
import {
  sendMessage,
  getMessage,
  deleteMessage
} from '../../../api/index';
import { requestHandler } from '../../../utils/index';

const ExecutionNotification = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    customSubject: ''
  });

  // Subject options
  const subjectOptions = [
    { value: 'lor', label: 'LOR', color: 'blue' },
    { value: 'interns', label: 'Interns', color: 'green' },
    { value: 'task', label: 'Task', color: 'yellow' },
    { value: 'dashboard controller', label: 'Dashboard Controller', color: 'purple' },
    { value: 'authentication', label: 'Authentication', color: 'indigo' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    await requestHandler(
      async () => getMessage(),
      setLoading,
      (response) => {
        const messagesData = Array.isArray(response?.data) ? response.data : [];
        setMessages(messagesData);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      subject: value,
      customSubject: value === 'other' ? prev.customSubject : ''
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      subject: formData.subject === 'other' ? formData.customSubject : formData.subject,
      message: formData.message
    };

    // Validate
    if (!payload.fullName || !payload.email || !payload.subject || !payload.message) {
      alert('Please fill in all fields');
      return;
    }

    await requestHandler(
      async () => sendMessage(payload),
      setSending,
      () => {
        // Reset form and refresh messages
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: '',
          customSubject: ''
        });
        setShowForm(false);
        fetchMessages();
      },
      (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message');
      }
    );
  };

  const handleDeleteMessage = async (messageId) => {
    await requestHandler(
      async () => deleteMessage(messageId),
      setDeleting,
      () => {
        setDeleteConfirm(null);
        fetchMessages();
      },
      (error) => {
        console.error('Error deleting message:', error);
        alert('Failed to delete message');
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubjectColor = (subject) => {
    const option = subjectOptions.find(opt =>
      opt.value === subject || opt.label.toLowerCase() === subject?.toLowerCase()
    );

    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return colorMap[option?.color || 'gray'];
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'replied': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Replied' },
      'unread': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Unread' },
      'read': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Read' }
    };

    const statusInfo = statusMap[status?.toLowerCase()] || { color: 'bg-gray-100 text-gray-700 border-gray-200', label: status || 'Unknown' };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusInfo.color} shadow-sm`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                Execution Notification
              </span>
            </h1>
            <p className="text-gray-600 text-lg">Send and manage execution-related notifications</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 self-start"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showForm ? "M19 9l-7 7-7-7" : "M12 4v16m8-8H4"} />
            </svg>
            {showForm ? 'Hide Form' : 'New Message'}
          </button>
        </div>

        {/* Message Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
              <h2 className="text-xl font-semibold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Send New Message
                </span>
              </h2>
            </div>

            <form onSubmit={handleSendMessage} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleSubjectChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Subject (shown when 'other' is selected) */}
                {formData.subject === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Subject
                    </label>
                    <input
                      type="text"
                      name="customSubject"
                      value={formData.customSubject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50/50"
                      placeholder="Enter custom subject"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Messages List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <h2 className="text-xl font-semibold">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Sent Messages
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
              <p className="mt-4 text-purple-600 font-medium">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-700 text-xl font-medium">No messages found</p>
              <p className="text-gray-500 text-sm mt-2">Click "New Message" to send your first notification</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((message, index) => (
                <div
                  key={message._id}
                  className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 relative"
                  style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                >
                  {/* Delete Confirmation Modal */}
                  {deleteConfirm === message._id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center p-6 rounded-2xl">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Message</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            disabled={deleting}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                          >
                            {deleting ? (
                              <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Deleting...
                              </>
                            ) : (
                              'Yes, Delete'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {message.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{message.fullName}</h3>
                            <p className="text-sm text-gray-500">{message.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-auto">
                          {getStatusBadge(message.status)}
                        </div>
                      </div>

                      <div className="ml-12 mt-2">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSubjectColor(message.subject)}`}>
                            {message.subject}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(message.createdAt || message.replayAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="ml-12 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  </div>

                  {/* Reply Info (if any) */}
                  {message.replayMessage && (
                    <div className="ml-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-400 shadow-sm mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Reply from Mentor:</p>
                        {message.replayAt && (
                          <span className="text-xs text-gray-500">{formatDate(message.replayAt)}</span>
                        )}
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">{message.replayMessage}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="ml-12 flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(message._id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={fetchMessages}
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Messages
          </button>
        </div>
      </div>

      {/* Animation Styles */}
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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionNotification;
