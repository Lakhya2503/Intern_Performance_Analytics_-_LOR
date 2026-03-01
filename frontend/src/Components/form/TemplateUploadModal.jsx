// components/modals/TemplateUploadModal.jsx
import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaFileAlt, FaCheckCircle, FaImage } from 'react-icons/fa';

function TemplateUploadModal({ isOpen, onClose, onUpload, uploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, GIF)');
      return;
    }

    // Check file size (limit to 10MB for templates)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL for images
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FaCloudUploadAlt className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Upload LOR Template Image</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <FaTimes className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-3">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Template preview"
                      className="max-h-40 mx-auto rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
                    <FaCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-700">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <FaImage className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-gray-700 mb-2">
                  Drag and drop your template image here, or{' '}
                  <button
                    onClick={() => document.getElementById('fileInput').click()}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports PNG, JPG, JPEG, GIF (Max 10MB)
                </p>
              </>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-6 space-y-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Template Image Guidelines:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload a clear template image</li>
                <li>• Recommended size: 1920x1080px or larger</li>
                <li>• Use high resolution for better quality</li>
                <li>• The image will be used as LOR background</li>
              </ul>
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                !selectedFile || uploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="w-4 h-4" />
                  Upload Template Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateUploadModal;
