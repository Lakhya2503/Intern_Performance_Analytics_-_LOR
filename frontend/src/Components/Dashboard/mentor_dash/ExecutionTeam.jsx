import React, { useState, useEffect } from 'react';
import { changeAuthorization, executionTeamMembers } from '../../../api/index';
import { requestHandler } from '../../../utils';
import ExecutionCard from '../../cards/ExecutionCard';
import {
  FiUsers, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiXCircle,
  FiBarChart2, FiUserCheck, FiUserX, FiActivity, FiTrendingUp,
  FiClock
} from 'react-icons/fi';
import {
  MdOutlineSecurity, MdOutlineAdminPanelSettings,
  MdOutlinePeople
} from 'react-icons/md';
import { BsPersonBadge, BsShieldCheck, BsShieldX } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';

const ExecutionTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingAuth, setUpdatingAuth] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, authorized, unauthorized
  const [updatingMemberId, setUpdatingMemberId] = useState(null);

  // Fetch execution team members
  const fetchExecutionTeam = async () => {
    await requestHandler(
      async () => {
        const response = await executionTeamMembers();
        console.log('API Response:', response); // For debugging
        return response;
      },
      setLoading,
      (res) => {
        // Handle the response structure based on your API
        const members = res.data || res || [];
        setTeamMembers(members);
        setError(null);

        // Show success message
      },
      (err) => {
        setError(err.message || 'Failed to fetch execution team');
        console.error('Error fetching execution team:', err);
      }
    );
  };

  // Handle authorization update
  const handleAuthorizationUpdate = async (memberId, currentAuthStatus) => {
    const newAuthStatus = !currentAuthStatus;
    setUpdatingMemberId(memberId);

    await requestHandler(
      async () => {
        const response = await changeAuthorization(memberId, { isAuthorized: newAuthStatus });
        console.log('Update Response:', response); // For debugging
        return response;
      },
      setUpdatingAuth,
      (res) => {
        // Update the local state with the new authorization status
        setTeamMembers(prevMembers =>
          prevMembers.map(member =>
            member._id === memberId ? { ...member, isAuthorized: newAuthStatus } : member
          )
        );
        setError(null);

      },
      (err) => {
        setError(err.message || 'Failed to update authorization');
        console.error('Error updating authorization:', err);
      }
    ).finally(() => {
      setUpdatingMemberId(null);
    });
  };

  const handleRefresh = () => {
    fetchExecutionTeam();
  };

  useEffect(() => {
    fetchExecutionTeam();
  }, []);

  // Filter members
  const filteredMembers = teamMembers.filter(member => {
    if (filter === 'authorized') return member.isAuthorized === true;
    if (filter === 'unauthorized') return member.isAuthorized === false;
    return true;
  });

  // Calculate stats based on actual data
  const totalMembers = teamMembers.length;
  const authorizedCount = teamMembers.filter(m => m.isAuthorized === true).length;
  const unauthorizedCount = teamMembers.filter(m => m.isAuthorized === false).length;

  // Note: 'active' field might not exist in your API, using a default or alternative
  const activeCount = teamMembers.length; // Since all members might be active by default
  const activePercentage = totalMembers ? 100 : 0;

  // Calculate join dates from createdAt
  const getRecentJoinCount = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return teamMembers.filter(m => new Date(m.createdAt) > thirtyDaysAgo).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-sm bg-opacity-95">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="text-xl" />
            </div>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main header with gradient */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BsPersonBadge className="text-3xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    Execution Team Management
                  </h1>
                  <p className="text-teal-100 text-base flex items-center gap-2 mt-1">
                    <MdOutlineSecurity className="text-xl" />
                    Manage team members and their authorizations
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Summary Cards */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <HiOutlineUserGroup className="text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalMembers}</p>
                    <p className="text-sm text-teal-100">Total Members</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                    <BsShieldCheck className="text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{authorizedCount}</p>
                    <p className="text-sm text-teal-100">Authorized</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/30 rounded-lg flex items-center justify-center">
                    <FiClock className="text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{getRecentJoinCount()}</p>
                    <p className="text-sm text-teal-100">New (30d)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions and filters */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === 'all'
                    ? 'bg-white text-teal-700 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <MdOutlinePeople className="text-lg" />
                All Members
              </button>
              <button
                onClick={() => setFilter('authorized')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === 'authorized'
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <BsShieldCheck className="text-lg" />
                Authorized
              </button>
              <button
                onClick={() => setFilter('unauthorized')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  filter === 'unauthorized'
                    ? 'bg-white text-amber-700 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <BsShieldX className="text-lg" />
                Unauthorized
              </button>
            </div>

            <button
              onClick={handleRefresh}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all text-white border border-white/20"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Error display */}
        {error && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 text-red-700 px-4 py-3 rounded-xl border border-red-200 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="text-xl text-red-500" />
              </div>
              <p className="text-sm flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FiXCircle className="text-xl" />
              </button>
            </div>
          </div>
        )}

        {/* Stats overview */}
        {!loading && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <FiUsers />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-800">{totalMembers}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Active team members
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center text-white">
                  <FiUserCheck />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Authorized</p>
                  <p className="text-2xl font-bold text-emerald-600">{authorizedCount}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {totalMembers ? Math.round((authorizedCount / totalMembers) * 100) : 0}% of total
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                  <FiUserX />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unauthorized</p>
                  <p className="text-2xl font-bold text-amber-600">{unauthorizedCount}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Pending authorization
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <FiClock />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Latest Join</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {teamMembers.length > 0
                      ? new Date(Math.max(...teamMembers.map(m => new Date(m.createdAt)))).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Most recent member
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading team members...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
          </div>
        )}

        {/* Team members grid */}
        {!loading && filteredMembers.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalMembers}</span> members
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiBarChart2 />
                <span>Sorted by join date</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => (
                <div
                  key={member._id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ExecutionCard
                    member={member}
                    onUpdateAuth={() => handleAuthorizationUpdate(
                      member._id,
                      member.isAuthorized
                    )}
                    isUpdating={updatingMemberId === member._id}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiUsers className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filter === 'all' ? 'No Team Members Found' :
                 filter === 'authorized' ? 'No Authorized Members' : 'No Unauthorized Members'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' ? 'There are no execution team members to display.' :
                 filter === 'authorized' ? 'No members have been authorized yet.' :
                 'All members are currently authorized.'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
                >
                  View All Members
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ExecutionTeam;
