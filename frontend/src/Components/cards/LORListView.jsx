import React from 'react';
import PropTypes from 'prop-types';
import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaRocket,
  FaBan,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaCalendarAlt,
  FaEye,
  FaUndo,
  FaStar
} from 'react-icons/fa';
import { formatDate, getStatusBadge } from '../../utils/lorUtils';

const LORListView = ({
  interns,
  onGenerate,
  onReject,
  onResendEmail,
  onGenerateRejected,
  sendingEmailFor,
  setHoveredItem
}) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'generated':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4" />;
      case 'eligible':
        return <FaStar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name/Username</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Domain</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {interns.map((intern) => (
              <tr
                key={intern.id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredItem?.(intern._id)}
                onMouseLeave={() => setHoveredItem?.(null)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{intern.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">@{intern.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{intern.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{intern.department || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{intern.domain}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(intern.endDate)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getStatusBadge(intern.status)}`}>
                    {getStatusIcon(intern.status)}
                    {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {intern.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onGenerate(intern)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Generate LOR"
                        >
                          <FaRocket className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(intern)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject LOR"
                        >
                          <FaBan className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {intern.status === 'generated' && (
                      <>
                        <button
                          onClick={() => onResendEmail?.(intern)}
                          disabled={sendingEmailFor === intern._id}
                          className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
                            sendingEmailFor === intern._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Resend Email"
                        >
                          {sendingEmailFor === intern._id ? (
                            <FaSpinner className="w-4 h-4 animate-spin" />
                          ) : (
                            <FaEnvelope className="w-4 h-4" />
                          )}
                        </button>
                        {intern.previewUrl && (
                          <button
                            onClick={() => window.open(intern.previewUrl, '_blank')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Preview LOR"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}

                    {intern.status === 'rejected' && (
                      <button
                        onClick={() => onGenerateRejected?.(intern)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Generate LOR for Rejected Intern"
                      >
                        <FaUndo className="w-4 h-4" />
                      </button>
                    )}

                    {intern.status === 'eligible' && (
                      <button
                        onClick={() => onGenerate(intern)}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium flex items-center gap-1"
                      >
                        <FaRocket className="w-3 h-3" />
                        Generate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

LORListView.propTypes = {
  interns: PropTypes.array.isRequired,
  onGenerate: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onResendEmail: PropTypes.func,
  onGenerateRejected: PropTypes.func,
  sendingEmailFor: PropTypes.string,
  setHoveredItem: PropTypes.func
};

export default LORListView;
