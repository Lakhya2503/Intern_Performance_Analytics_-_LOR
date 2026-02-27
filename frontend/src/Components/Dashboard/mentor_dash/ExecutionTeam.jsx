import React, { useState, useEffect } from 'react';
import { changeAuthorization, executionTeamMembers } from '../../../api/index'
import { requestHandler } from '../../../utils';
import ExecutionCard from '../../cards/ExecutionCard';

const ExecutionTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatingAuth, setUpdatingAuth] = useState(false);

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
  const handleAuthorizationUpdate = async (memberId, newAuthLevel) => {
    await requestHandler(
      async () => {
        const response = await changeAuthorization(memberId, { authorizationLevel: newAuthLevel });
        return response;
      },
      setUpdatingAuth,
      (res) => {
        // Update the member in the list
        setTeamMembers(prevMembers =>
          prevMembers.map(member =>
            member.id === memberId ? { ...member, authorizationLevel: newAuthLevel } : member
          )
        );
        setSelectedMember(null);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to update authorization');
        console.error('Error updating authorization:', err);
      }
    );
  };

  useEffect(() => {
    fetchExecutionTeam();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main header with teal to cyan gradient */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Execution Team Management</h1>
          <p className="text-teal-50 mt-2">Manage team members and their authorizations</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading team members...</p>
          </div>
        )}

        {/* Team members grid */}
        {!loading && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <ExecutionCard
                key={member.id}
                member={member}
                onUpdateAuth={() => setSelectedMember(member)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && teamMembers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600">No team members found</p>
          </div>
        )}
      </div>

      {/* Authorization Update Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-lg font-semibold">Update Authorization</h3>
              <p className="text-teal-50 text-sm mt-1">
                Update authorization level for {selectedMember.name}
              </p>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorization Level
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedMember.authorizationLevel || 'standard'}
                  >
                    <option value="standard">Standard</option>
                    <option value="advanced">Advanced</option>
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>

                {updatingAuth && (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-500 border-t-transparent mr-2"></div>
                    <span className="text-gray-600">Updating...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                disabled={updatingAuth}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const select = document.querySelector('select');
                  handleAuthorizationUpdate(selectedMember.id, select.value);
                }}
                disabled={updatingAuth}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all disabled:opacity-50"
              >
                Update Authorization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionTeam;
