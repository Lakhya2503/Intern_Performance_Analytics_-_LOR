import React from 'react';
import { FaTimes, FaDownload, FaFilePdf, FaPrint } from 'react-icons/fa';

const LORPreviewModal = ({ isOpen, onClose, intern, lorFormData }) => {
  if (!isOpen || !intern) return null;

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading LOR for:', intern.name);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaFilePdf className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">LOR Preview</h2>
                <p className="text-gray-300 text-sm">For: {intern.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                title="Print"
              >
                <FaPrint className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                title="Download PDF"
              >
                <FaDownload className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* LOR Content */}
        <div className="p-8 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Letter Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">LETTER OF RECOMMENDATION</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto"></div>
            </div>

            {/* Recipient Info */}
            <div className="mb-6">
              <p className="text-gray-600">To,</p>
              <p className="font-semibold text-gray-800 mt-2">
                {lorFormData?.recipientName || 'The Admissions Committee'}
              </p>
              {lorFormData?.recipientDesignation && (
                <p className="text-gray-600">{lorFormData.recipientDesignation}</p>
              )}
              {lorFormData?.recipientOrganization && (
                <p className="text-gray-600">{lorFormData.recipientOrganization}</p>
              )}
            </div>

            {/* Salutation */}
            <p className="text-gray-700 mb-4">
              Dear {lorFormData?.recipientName?.split(' ')[0] || 'Sir/Madam'},
            </p>

            {/* Body */}
            <div className="space-y-4 text-gray-700">
              <p>
                I am pleased to recommend <span className="font-semibold text-indigo-600">{intern.name}</span> for
                their outstanding performance during their internship with us.
              </p>

              {intern.department && (
                <p>
                  <span className="font-semibold">{intern.name}</span> worked in our{' '}
                  <span className="font-semibold text-indigo-600">{intern.department}</span> department
                  and demonstrated exceptional skills and dedication.
                </p>
              )}

              {lorFormData?.includeScore && intern.score && (
                <p>
                  During their tenure, they achieved an impressive score of{' '}
                  <span className="font-semibold text-green-600">{intern.score}%</span> and consistently
                  exceeded expectations.
                </p>
              )}

              {lorFormData?.includeProjects && (
                <p>
                  They successfully completed multiple projects, showing great initiative,
                  problem-solving abilities, and attention to detail.
                </p>
              )}

              {lorFormData?.includeSkills && (
                <p>
                  Their technical and interpersonal skills were impressive, and they worked
                  exceptionally well with team members.
                </p>
              )}

              {lorFormData?.customMessage && (
                <p className="italic border-l-4 border-indigo-300 pl-4 py-2 bg-indigo-50 rounded-r-lg">
                  "{lorFormData.customMessage}"
                </p>
              )}

              <p className="mt-6">
                I am confident that {intern.name} will excel in any future endeavors and
                highly recommend them for any opportunity they pursue.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p>Sincerely,</p>
              <p className="font-semibold text-lg mt-4">Mentor Name</p>
              <p className="text-gray-600">Mentor</p>
              <p className="text-gray-600">Organization Name</p>
              <p className="text-sm text-gray-400 mt-2">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LORPreviewModal;
