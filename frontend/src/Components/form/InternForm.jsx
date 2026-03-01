import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaUser, FaEnvelope, FaGraduationCap, 
         FaChartLine, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle,
         FaIdBadge, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const InternForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = 'add', // 'add' or 'edit'
  loading = false
}) => {
  const [formData, setFormData] = useState({
    // Include ID field for edit mode
    _id: '',
    id: '',
    name: '',
    email: '',
    department: '',
    gender: '',
    course: '',
    mentor: '',
    // Scoring fields (percentage inputs)
    taskCompletion: 0,
    taskQuality: 0,
    deadlineAdherence: 0,
    attendance: 0,
    mentorFeedback: 0,
    communication: 0,
    // Calculated field
    score: 0,
    // Other fields
    duration: '',
    batch: '',
    status: 'Pending',
    endDate: '',
    isActive: true,
    isCompliantIssue: false,
    isDisciplineIssue: false
  });

  // Initialize form with data when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        // Preserve both _id and id for compatibility
        _id: initialData._id || initialData.id || '',
        id: initialData.id || initialData._id || '',
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        gender: initialData.gender || '',
        course: initialData.course || '',
        mentor: initialData.mentor || '',
        // Scoring fields
        taskCompletion: initialData.taskCompletion || 0,
        taskQuality: initialData.taskQuality || 0,
        deadlineAdherence: initialData.deadlineAdherence || 0,
        attendance: initialData.attendance || 0,
        mentorFeedback: initialData.mentorFeedback || 0,
        communication: initialData.communication || 0,
        // Calculated score
        score: initialData.score || 0,
        // Other fields
        duration: initialData.duration || '',
        batch: initialData.batch || '',
        status: initialData.status || 'Pending',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isCompliantIssue: initialData.isCompliantIssue || false,
        isDisciplineIssue: initialData.isDisciplineIssue || false
      });
    } else {
      // Reset form when adding new
      setFormData({
        _id: '',
        id: '',
        name: '',
        email: '',
        department: '',
        gender: '',
        course: '',
        mentor: '',
        // Scoring fields
        taskCompletion: 0,
        taskQuality: 0,
        deadlineAdherence: 0,
        attendance: 0,
        mentorFeedback: 0,
        communication: 0,
        // Calculated field
        score: 0,
        // Other fields
        duration: '',
        batch: '',
        status: 'Pending',
        endDate: '',
        isActive: true,
        isCompliantIssue: false,
        isDisciplineIssue: false
      });
    }
  }, [initialData, mode, isOpen]);

  // Calculate average score whenever any scoring field changes
  useEffect(() => {
    const scores = [
      formData.taskCompletion,
      formData.taskQuality,
      formData.deadlineAdherence,
      formData.attendance,
      formData.mentorFeedback,
      formData.communication
    ];
    
    // Calculate average (sum of all scores divided by number of fields)
    const total = scores.reduce((sum, score) => sum + (Number(score) || 0), 0);
    const average = Math.round(total / 6);
    
    setFormData(prev => ({
      ...prev,
      score: isNaN(average) ? 0 : average
    }));
  }, [
    formData.taskCompletion,
    formData.taskQuality,
    formData.deadlineAdherence,
    formData.attendance,
    formData.mentorFeedback,
    formData.communication
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For scoring fields, ensure value is between 0-100
    if (name.includes('task') || name.includes('deadline') || 
        name.includes('attendance') || name.includes('mentorFeedback') || 
        name.includes('communication')) {
      let numValue = parseInt(value) || 0;
      // Clamp value between 0 and 100
      numValue = Math.min(100, Math.max(0, numValue));
      
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare submit data
    const submitData = {
      ...formData,
      // Ensure all scoring fields are numbers
      taskCompletion: Number(formData.taskCompletion),
      taskQuality: Number(formData.taskQuality),
      deadlineAdherence: Number(formData.deadlineAdherence),
      attendance: Number(formData.attendance),
      mentorFeedback: Number(formData.mentorFeedback),
      communication: Number(formData.communication),
      score: Number(formData.score)
    };
    
    // For edit mode, ensure we have the ID
    if (mode === 'edit') {
      // Make sure _id is set (prefer _id over id)
      if (!submitData._id && submitData.id) {
        submitData._id = submitData.id;
      }
      
      // Log the ID for debugging
      console.log('Submitting update for intern ID:', submitData._id);
      
      // If still no ID, show error
      if (!submitData._id) {
        alert('Error: Intern ID is missing. Please try again.');
        return;
      }
    }
    
    onSubmit(submitData);
  };

  // Get color class based on score
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approve':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-slideIn">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                {mode === 'add' ? <FaUsers className="w-6 h-6 text-white" /> : <FaIdBadge className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {mode === 'add' ? 'Add New Intern' : 'Edit Intern'}
                </h3>
                {mode === 'edit' && (
                  <p className="text-sm text-teal-100 mt-1 flex items-center gap-1">
                    <FaIdBadge className="w-3 h-3" />
                    ID: {formData._id || formData.id || 'N/A'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-teal-700 rounded-lg transition-all duration-200 hover:rotate-90"
              disabled={loading}
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Hidden ID fields for edit mode */}
        {mode === 'edit' && (
          <input type="hidden" name="_id" value={formData._id} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <FaUser className="text-teal-500" />
              Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  disabled={loading}
                  placeholder="Engineering"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <FaGraduationCap className="text-teal-500" />
              Academic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  disabled={loading}
                  placeholder="B.Tech Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentor</label>
                <div className="relative">
                  <FaChalkboardTeacher className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="mentor"
                    value={formData.mentor}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    disabled={loading}
                    placeholder="Dr. Smith"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  disabled={loading}
                  placeholder="2024 Batch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 months"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics (6 Fields) */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaChartLine className="text-teal-500" />
                Performance Metrics
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Overall Score:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(formData.score)}`}>
                  {formData.score}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Task Completion */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Task Completion
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="taskCompletion"
                    value={formData.taskCompletion}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <input
                    type="number"
                    name="taskCompletion"
                    value={formData.taskCompletion}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Task Quality */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Task Quality
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="taskQuality"
                    value={formData.taskQuality}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <input
                    type="number"
                    name="taskQuality"
                    value={formData.taskQuality}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Deadline Adherence */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Deadline Adherence
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="deadlineAdherence"
                    value={formData.deadlineAdherence}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <input
                    type="number"
                    name="deadlineAdherence"
                    value={formData.deadlineAdherence}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Attendance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Attendance
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Mentor Feedback */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mentor Feedback
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="mentorFeedback"
                    value={formData.mentorFeedback}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <input
                    type="number"
                    name="mentorFeedback"
                    value={formData.mentorFeedback}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Communication */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Communication
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="communication"
                    value={formData.communication}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <input
                    type="number"
                    name="communication"
                    value={formData.communication}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status & Additional Info */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <FaCalendarAlt className="text-teal-500" />
              Status & Additional Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                  disabled={loading}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approve">Approve</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {formData.status && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(formData.status)}`}>
                      <FaCheckCircle className="w-3 h-3" />
                      {formData.status}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">Active Status</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === true}
                    onChange={() => handleRadioChange('isActive', true)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    disabled={loading}
                  />
                  <span className="text-sm flex items-center gap-1">
                    <FaCheckCircle className="w-4 h-4 text-green-500" />
                    Active
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === false}
                    onChange={() => handleRadioChange('isActive', false)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    disabled={loading}
                  />
                  <span className="text-sm flex items-center gap-1">
                    <FaTimes className="w-4 h-4 text-gray-500" />
                    Inactive
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  name="isCompliantIssue"
                  checked={formData.isCompliantIssue}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
                  disabled={loading}
                />
                <span className="text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                  Compliance Issue
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-yellow-50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  name="isDisciplineIssue"
                  checked={formData.isDisciplineIssue}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  disabled={loading}
                />
                <span className="text-sm flex items-center gap-1">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />
                  Discipline Issue
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  {mode === 'add' ? 'Adding...' : 'Updating...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'add' ? 'Add Intern' : 'Update Intern'}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50 transition-all duration-200 hover:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InternForm;