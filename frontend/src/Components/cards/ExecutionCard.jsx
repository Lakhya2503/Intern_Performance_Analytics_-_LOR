import React from 'react';

const ExecutionCard = ({ member, onUpdateAuth }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card header with gradient */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">{member.name}</h3>
        <p className="text-teal-50 text-sm">{member.role}</p>
      </div>

      {/* Card body */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-800">{member.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              member.active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {member.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Authorization:</span>
            <span className="font-medium text-gray-800">
              {member.authorizationLevel || 'Standard'}
            </span>
          </div>
          {member.score && (
            <div className="flex justify-between">
              <span className="text-gray-600">Performance Score:</span>
              <span className="font-bold text-teal-600">{member.score}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onUpdateAuth}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all font-medium"
          >
            Update Auth
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionCard;
