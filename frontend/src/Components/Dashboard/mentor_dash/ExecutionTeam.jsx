import React, { useState, useEffect } from 'react';
import { changeAuthorization, executionTeamMembers } from '../../../api/index';
import { requestHandler } from '../../../utils';
import ExecutionCard from '../../cards/ExecutionCard';
import { FiUsers, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MdOutlineSecurity, MdOutlineAdminPanelSettings } from 'react-icons/md';
import { BsPersonBadge } from 'react-icons/bs';

const ExecutionTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatingAuth, setUpdatingAuth] = useState(false);
  const [authValue, setAuthValue] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch execution team members
  const fetchExecutionTeam = async () => {
    await requestHandler(
      async () => {
        const response = await executionTeamMembers();
        console.log(response);
        return response;
      },
      setLoading,
      (res) => {
        setTeamMembers(res.data || []);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to fetch execution team');
        console.error('Error fetching execution team:', err);
      }
    );
  };

  // Handle authorization update
  const handleAuthorizationUpdate = async (memberId, isAuthorized) => {
    await requestHandler(
      async () => {
        const response = await changeAuthorization(memberId, { isAuthorized });
        return response;
      },
      setUpdatingAuth,
      (res) => {
        setTeamMembers(prevMembers =>
          prevMembers.map(member =>
            member._id === memberId ? { ...member, isAuthorized: isAuthorized } : member
          )
        );
        setSelectedMember(null);
        setError(null);
        
        // Show success toast
        setSuccessMessage(`Authorization ${isAuthorized ? 'granted' : 'revoked'} successfully`);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      },
      (err) => {
        setError(err.message || 'Failed to update authorization');
        console.error('Error updating authorization:', err);
      }
    );
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setAuthValue(member.isAuthorized || false);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchExecutionTeam();
  };

  useEffect(() => {
    fetchExecutionTeam();
  }, []);

  // Calculate stats
  const totalMembers = teamMembers.length;
  const authorizedCount = teamMembers.filter(m => m.isAuthorized).length;
  const activeCount = teamMembers.filter(m => m.active).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-teal-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <FiCheckCircle className="text-2xl" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main header */}
      <div className="bg-white border-b border-gray-200 py-8 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BsPersonBadge className="text-3xl text-teal-600" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Execution Team Management
                </h1>
              </div>
              <p className="text-gray-600 text-base flex items-center gap-2">
                <MdOutlineSecurity className="text-xl text-teal-500" />
                Manage team members and their authorizations
              </p>
            </div>
            
            {/* Stats Summary */}
            <div className="flex gap-4">
              <div className="bg-teal-50 rounded-lg px-5 py-3 border border-teal-100">
                <div className="flex items-center gap-3">
                  <FiUsers className="text-2xl text-teal-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalMembers}</p>
                    <p className="text-sm text-gray-600">Total Members</p>
                  </div>
                </div>
              </div>
              <div className="bg-teal-50 rounded-lg px-5 py-3 border border-teal-100">
                <div className="flex items-center gap-3">
                  <MdOutlineAdminPanelSettings className="text-2xl text-teal-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{authorizedCount}</p>
                    <p className="text-sm text-gray-600">Authorized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors text-gray-700"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Error display */}
        {error && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200 flex items-center gap-3">
              <FiAlertCircle className="text-xl text-red-500" />
              <p className="text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <FiXCircle className="text-xl" />
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        )}

        {/* Team members grid */}
        {!loading && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={member._id || member.id}
                className="animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ExecutionCard
                  member={member}
                  onUpdateAuth={() => handleSelectMember(member)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && teamMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto border border-gray-200">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Team Members Found</h3>
              <p className="text-gray-600 mb-4">There are no execution team members to display.</p>
              <button
                onClick={handleRefresh}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Authorization Update Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal header */}
            <div className="bg-teal-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <MdOutlineAdminPanelSettings className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Update Authorization</h3>
                  <p className="text-teal-100 text-sm">
                    Modify access permissions for {selectedMember.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Member info preview */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {selectedMember.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedMember.name}</p>
                      <p className="text-sm text-gray-600">{selectedMember.role || 'Team Member'}</p>
                    </div>
                  </div>
                </div>

                {/* Authorization toggle */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-800">
                        Authorization Status
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Toggle to grant or revoke access
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={authValue}
                        onChange={(e) => setAuthValue(e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-gray-300 peer-checked:bg-teal-600 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                    </label>
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
                    authValue ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {authValue ? (
                      <>
                        <FiCheckCircle className="text-lg" />
                        <span>User will have access to execution features</span>
                      </>
                    ) : (
                      <>
                        <FiXCircle className="text-lg" />
                        <span>User will be restricted from execution features</span>
                      </>
                    )}
                  </div>
                </div>

                {updatingAuth && (
                  <div className="flex items-center justify-center p-3 bg-teal-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent mr-3"></div>
                    <span className="text-teal-700 text-sm">Updating authorization...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="bg-gray-50 px-6 py-3 rounded-b-lg border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                disabled={updatingAuth}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAuthorizationUpdate(selectedMember._id || selectedMember.id, authValue);
                }}
                disabled={updatingAuth}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updatingAuth ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="text-lg" />
                    Update Authorization
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
};

export default ExecutionTeam;