import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaUser, FaEnvelope, FaGraduationCap,
         FaChartLine, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle,
         FaIdBadge, FaChalkboardTeacher, FaUsers, FaStar,
         FaAward, FaClock, FaBell, FaShieldAlt } from 'react-icons/fa';

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

  // Get color class based on score with enhanced gradients
  const getScoreGradient = (score) => {
    if (score >= 85) return 'from-green-500 to-emerald-600 text-white';
    if (score >= 70) return 'from-teal-400 to-cyan-600 text-white';
    if (score >= 50) return 'from-yellow-400 to-amber-600 text-white';
    return 'from-red-400 to-rose-600 text-white';
  };

  // Get status badge with enhanced styling
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approve':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200';
      case 'Rejected':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200';
      default:
        return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-200';
    }
  };

  // Get performance level
  const getPerformanceLevel = (score) => {
    if (score >= 85) return { text: 'Excellent', icon: FaAward, color: 'text-yellow-500' };
    if (score >= 70) return { text: 'Good', icon: FaStar, color: 'text-teal-500' };
    if (score >= 50) return { text: 'Average', icon: FaChartLine, color: 'text-amber-500' };
    return { text: 'Needs Improvement', icon: FaExclamationTriangle, color: 'text-red-500' };
  };

  if (!isOpen) return null;

  const performanceLevel = getPerformanceLevel(formData.score);
  const PerformanceIcon = performanceLevel.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 animate-slideIn">
        {/* Header with animated gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl animate-pulse-slow">
                  {mode === 'add' ?
                    <FaUsers className="w-7 h-7 text-white" /> :
                    <FaIdBadge className="w-7 h-7 text-white" />
                  }
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {mode === 'add' ? 'Add New Intern' : 'Edit Intern'}
                  </h3>
                  {mode === 'edit' && (
                    <p className="text-sm text-teal-100 mt-1 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <FaIdBadge className="w-3 h-3" />
                      ID: {formData._id || formData.id || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:rotate-90 hover:scale-110"
                disabled={loading}
              >
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden ID fields for edit mode */}
        {mode === 'edit' && (
          <input type="hidden" name="_id" value={formData._id} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white">
          {/* Score Overview Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 rounded-xl border border-indigo-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                  <FaChartLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Performance</p>
                  <p className="text-xs text-gray-500">Based on 6 metrics</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreGradient(formData.score)} bg-clip-text text-transparent`}>
                  {formData.score}%
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${performanceLevel.color}`}>
                  <PerformanceIcon className="w-4 h-4" />
                  {performanceLevel.text}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information with glass morphism effect */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
              <h4 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b-2 border-teal-100 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="group/input">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within/input:text-teal-500 transition-colors w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300"
                      required
                      disabled={loading}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="group/input">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within/input:text-teal-500 transition-colors w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white hover:border-teal-300 cursor-pointer"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all hover:border-teal-300"
                    disabled={loading}
                    placeholder="Engineering"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information with glass morphism effect */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
              <h4 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b-2 border-purple-100 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <FaGraduationCap className="w-4 h-4 text-white" />
                </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics with enhanced styling */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-orange-100">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <FaChartLine className="w-4 h-4 text-white" />
                  </div>
                  Performance Metrics
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Overall:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getScoreGradient(formData.score)} shadow-lg`}>
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${formData.taskCompletion}%, #e5e7eb ${formData.taskCompletion}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      name="taskCompletion"
                      value={formData.taskCompletion}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-orange-600"
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.taskQuality}%, #e5e7eb ${formData.taskQuality}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      name="taskQuality"
                      value={formData.taskQuality}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600"
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${formData.deadlineAdherence}%, #e5e7eb ${formData.deadlineAdherence}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      name="deadlineAdherence"
                      value={formData.deadlineAdherence}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-green-600"
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      style={{
                        background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${formData.attendance}%, #e5e7eb ${formData.attendance}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      name="attendance"
                      value={formData.attendance}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-purple-600"
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      style={{
                        background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${formData.mentorFeedback}%, #e5e7eb ${formData.mentorFeedback}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      name="mentorFeedback"
                      value={formData.mentorFeedback}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-500 font-bold text-pink-600"
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
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      style={{
                        background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${formData.communication}%, #e5e7eb ${formData.communication}%, #e5e7eb 100%)`
                      }}
                    />
                    <input
                      type="number"
                      name="communication"
                      value={formData.communication}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Additional Info with enhanced styling */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
              <h4 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b-2 border-amber-100 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg">
                  <FaCalendarAlt className="w-4 h-4 text-white" />
                </div>
                Status & Additional Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white hover:border-amber-300 cursor-pointer"
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approve">Approve</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  {formData.status && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(formData.status)}`}>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all hover:border-amber-300"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FaBell className="w-4 h-4 text-amber-500" />
                  Active Status
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group/radio">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === true}
                      onChange={() => handleRadioChange('isActive', true)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      disabled={loading}
                    />
                    <span className="text-sm flex items-center gap-1 group-hover/radio:text-green-600 transition-colors">
                      <FaCheckCircle className="w-4 h-4 text-green-500" />
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group/radio">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === false}
                      onChange={() => handleRadioChange('isActive', false)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      disabled={loading}
                    />
                    <span className="text-sm flex items-center gap-1 group-hover/radio:text-gray-600 transition-colors">
                      <FaTimes className="w-4 h-4 text-gray-500" />
                      Inactive
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-all duration-300 group/checkbox border border-transparent hover:border-red-200">
                  <input
                    type="checkbox"
                    name="isCompliantIssue"
                    checked={formData.isCompliantIssue}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
                    disabled={loading}
                  />
                  <span className="text-sm flex items-center gap-1 group-hover/checkbox:scale-105 transition-transform">
                    <FaShieldAlt className="w-4 h-4 text-red-500" />
                    Compliance Issue
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-yellow-50 rounded-lg transition-all duration-300 group/checkbox border border-transparent hover:border-yellow-200">
                  <input
                    type="checkbox"
                    name="isDisciplineIssue"
                    checked={formData.isDisciplineIssue}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    disabled={loading}
                  />
                  <span className="text-sm flex items-center gap-1 group-hover/checkbox:scale-105 transition-transform">
                    <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />
                    Discipline Issue
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions with enhanced buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:via-teal-600 hover:to-cyan-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-100 relative overflow-hidden group/btn"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></span>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  {mode === 'add' ? 'Adding...' : 'Updating...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'add' ? (
                    <>
                      <FaUsers className="w-4 h-4" />
                      Add Intern
                    </>
                  ) : (
                    <>
                      <FaIdBadge className="w-4 h-4" />
                      Update Intern
                    </>
                  )}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium disabled:opacity-50 transition-all duration-300 hover:border-gray-400 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 active:scale-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Enhanced animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease infinite;
        }

        /* Custom range input styling */
        input[type=range] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
        }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid currentColor;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        input[type=range]::-webkit-slider-thumb:active {
          transform: scale(0.9);
        }

        /* Smooth hover effects */
        .hover\:scale-105 {
          transition: all 0.2s cubic-bezier(0.2, 0.9, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default InternForm;
