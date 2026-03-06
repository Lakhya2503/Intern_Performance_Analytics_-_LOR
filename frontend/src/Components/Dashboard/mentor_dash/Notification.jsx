import React, { useState, useEffect } from 'react';
import {
  getAllMessagesForMentor,
  getSendMessage,
  replayOfSender
} from '../../../api/index';
import { requestHandler } from '../../../utils/index';

const MentorNotification = () => {
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentLoading, setSentLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    repliedMessages: 0,
    totalSentMessages: 0
  });

  useEffect(() => {
    fetchAllMessages();
    fetchSentMessages();
  }, []);

  const fetchAllMessages = async () => {
    await requestHandler(
      async () => getAllMessagesForMentor(),
      setLoading,
      (response) => {
        const messagesData = Array.isArray(response?.data) ? response.data : [];
        setMessages(messagesData);

        const unread = messagesData.filter(msg => msg.status === 'unread' || !msg.status).length;
        const replied = messagesData.filter(msg => msg.replayMessage).length;

        setStats(prev => ({
          ...prev,
          totalMessages: messagesData.length,
          unreadMessages: unread,
          repliedMessages: replied
        }));
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  };

  const fetchSentMessages = async () => {
    await requestHandler(
      async () => getSendMessage(),
      setSentLoading,
      (response) => {
        const sentMessagesData = Array.isArray(response?.data) ? response.data : [];
        setSentMessages(sentMessagesData);

        setStats(prev => ({
          ...prev,
          totalSentMessages: sentMessagesData.length
        }));
      },
      (error) => {
        console.error('Error fetching sent messages:', error);
      }
    );
  };

  const handleReplyClick = (message) => {
    setReplyingTo(message);
    setReplyText(message.replayMessage || '');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSendReply = async (messageId) => {
    if (!replyText.trim()) return;

    await requestHandler(
      async () => replayOfSender({ sendMessage: replyText }, messageId),
      setSendingReply,
      () => {
        fetchAllMessages();
        fetchSentMessages();
        setReplyingTo(null);
        setReplyText('');
      },
      (error) => {
        console.error('Error sending reply:', error);
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

  const getStatusBadge = (status, hasReplied) => {
    if (hasReplied) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">Replied</span>;
    }
    if (status === 'unread' || !status) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">Unread</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700 border border-teal-200 shadow-sm">Read</span>;
  };

  const StatCard = ({ title, value, color, icon, bgColor }) => (
    <div className={`bg-white rounded-2xl shadow-lg border ${bgColor} p-6 transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${color} mb-1`}>{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-14 h-14 ${color.replace('text', 'bg').replace('600', '100')} rounded-2xl flex items-center justify-center shadow-inner`}>
          <svg className={`w-7 h-7 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
      </div>
    </div>
  );

  const renderInbox = () => (
    <>
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-500"></div>
          <p className="mt-4 text-teal-600 font-medium">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-700 text-xl font-medium">No messages found</p>
          <p className="text-gray-500 text-sm mt-2">When you receive messages, they'll appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {messages.map((message, index) => (
            <div
              key={message._id}
              className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {message.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-semibold text-gray-800">{message.fullName}</h3>
                    </div>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{message.email}</span>
                    <div className="flex gap-2 ml-auto">
                      {getStatusBadge(message.status, !!message.replayMessage)}
                    </div>
                  </div>
                  <div className="ml-10">
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-medium text-gray-700">Subject:</span> {message.subject || 'No Subject'}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Received: {formatDate(message.replayAt || message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-10 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>

              {message.replayMessage && replyingTo?._id !== message._id && (
                <div className="ml-10 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-l-4 border-emerald-400 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Your Reply:</p>
                    {message.replayAt && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(message.replayAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{message.replayMessage}</p>
                </div>
              )}

              {replyingTo?._id !== message._id && (
                <div className="ml-10 mt-4">
                  <button
                    onClick={() => handleReplyClick(message)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    {message.replayMessage ? 'Edit Reply' : 'Reply'}
                  </button>
                </div>
              )}

              {replyingTo?._id === message._id && (
                <div className="ml-10 mt-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-200 shadow-inner">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white/80"
                    rows="4"
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={handleCancelReply}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(message._id)}
                      disabled={sendingReply || !replyText.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      {sendingReply ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderSentMessages = () => (
    <>
      {sentLoading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-200 border-t-cyan-500"></div>
          <p className="mt-4 text-cyan-600 font-medium">Loading sent messages...</p>
        </div>
      ) : sentMessages.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <p className="text-gray-700 text-xl font-medium">No sent messages found</p>
          <p className="text-gray-500 text-sm mt-2">Your replies to messages will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {sentMessages.map((message, index) => (
            <div
              key={message._id}
              className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {message.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-semibold text-gray-800">{message.fullName}</h3>
                    </div>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{message.email}</span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-sm ml-auto">
                      {message.status}
                    </span>
                  </div>
                  <div className="ml-10">
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-medium text-gray-700">Subject:</span> {message.subject || 'No Subject'}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Sent: {formatDate(message.replayAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-10 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Original Message:
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>

              <div className="ml-10 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 border-l-4 border-cyan-400 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-cyan-200 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Your Reply:</p>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{message.replayMessage}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-transparent bg-clip-text">
              Mentor Notifications
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Manage and track your conversations with mentees</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Messages"
            value={stats.totalMessages}
            color="text-teal-600"
            bgColor="border-teal-100"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />}
          />
          <StatCard
            title="Unread Messages"
            value={stats.unreadMessages}
            color="text-amber-600"
            bgColor="border-amber-100"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
          />
          <StatCard
            title="Sent Messages"
            value={stats.totalSentMessages}
            color="text-cyan-600"
            bgColor="border-cyan-100"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`pb-4 px-1 font-medium text-sm transition-all duration-200 relative ${
                activeTab === 'inbox'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inbox
              {stats.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {stats.unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`pb-4 px-1 font-medium text-sm transition-all duration-200 ${
                activeTab === 'sent'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent Messages
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <h2 className="text-xl font-semibold">
              {activeTab === 'inbox' ? (
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-transparent bg-clip-text">
                  Inbox Messages
                </span>
              ) : (
                <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-transparent bg-clip-text">
                  Sent Messages
                </span>
              )}
            </h2>
          </div>

          {activeTab === 'inbox' ? renderInbox() : renderSentMessages()}
        </div>

        {/* Refresh Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
          <button
            onClick={fetchAllMessages}
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Inbox
          </button>
          <button
            onClick={fetchSentMessages}
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Sent Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorNotification;
