import React, { useState, useEffect } from 'react';
import { requestHandler } from '../../../utils/index';
import {
  FaUser,
  FaLock,
  FaBell,
  FaSignOutAlt,
  FaTrash,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaSave
} from 'react-icons/fa';
import { PiAlignCenterVerticalLight } from 'react-icons/pi';

// Import API functions
import {
  loggedOutUser,
  currentUser,
  deleteAccount,
  updateAvatar,
  updateProfile
} from '../../../api/index';

import { useAuth } from "../../../Context/AuthContext";

const ExecutionSetting = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    security: true,
    notifications: false
  });

  const { user } = useAuth();

  // User data states
  const [userData, setUserData] = useState({
    _id: '',
    fullName: '',
    bio: '',
    email: '',
    username: '',
    avatar: null,
    role: '',
    createdAt: '',
    updatedAt: ''
  });

  // Avatar states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  });

  // Notification settings (local only)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data using currentUser API
  const fetchUserData = () => {
    requestHandler(
      async () => await currentUser(),
      setFetchLoading,
      (response) => {
        const data = response.data;
        setUserData({
          _id: data._id || '',
          fullName: data.fullName || '',
          bio: data.bio || '',
          email: data.user?.email || '',
          username: data.user?.username || '',
          avatar: data.avatar || null,
          role: data.user?.role || '',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || ''
        });

        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to fetch user data');
        // Auto clear error after 3 seconds
        setTimeout(() => setErrorMessage(''), 3000);
      }
    );
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar update
  const handleAvatarUpdate = () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    requestHandler(
      async () => await updateAvatar(formData),
      setLoading,
      (response) => {
        setAvatarFile(null);
        // Refresh user data to get updated avatar
        fetchUserData();
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to update avatar');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    );
  };

  // Handle profile update - ONLY fullName and bio are editable
  const handleProfileUpdate = () => {
    const profileData = {
      fullName: userData.fullName,
      bio: userData.bio
    };

    requestHandler(
      async () => await updateProfile(profileData),
      setLoading,
      (response) => {
        // Refresh user data
        fetchUserData();
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to update profile');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    );
  };

  // Handle profile field change
  const handleProfileChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setModalAction('delete');
    setShowConfirmModal(true);
  };

  // Confirm delete account
  const confirmDeleteAccount = () => {
    requestHandler(
      async () => await deleteAccount(),
      setLoading,
      (response) => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to delete account');
        setTimeout(() => setErrorMessage(''), 3000);
        setShowConfirmModal(false);
      }
    );
  };

  // Handle logout
  const handleLogout = () => {
    requestHandler(
      async () => await loggedOutUser(),
      setLoading,
      (response) => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to logout');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    );
  };

  // Handle notification toggle (local only)
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;

    return {
      score: strength,
      label: strength <= 2 ? 'Weak' : strength <= 4 ? 'Medium' : 'Strong',
      color: strength <= 2 ? 'red' : strength <= 4 ? 'yellow' : 'green'
    };
  };

  // Handle modal confirm
  const handleModalConfirm = () => {
    switch (modalAction) {
      case 'delete':
        confirmDeleteAccount();
        break;
      default:
        setShowConfirmModal(false);
    }
  };

  // Get modal content
  const getModalContent = () => {
    switch (modalAction) {
      case 'delete':
        return {
          icon: FaTrash,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          title: 'Delete Account',
          message: 'Are you absolutely sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.',
          confirmColor: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent();
  const passwordStrength = checkPasswordStrength(passwordForm.newPassword);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-teal-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-teal-600 font-medium mt-4">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4 md:p-8">
      {/* Error Message - Only shown when there's an error */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border-l-4 border-red-500 text-red-700 p-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationCircle className="text-red-600" />
            </div>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp">
            <div className="text-center">
              <div className={`w-16 h-16 ${modalContent.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <modalContent.icon className={`w-8 h-8 ${modalContent.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{modalContent.title}</h3>
              <p className="text-gray-600 mb-6">{modalContent.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalConfirm}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 ${modalContent.confirmColor} text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-teal-100 sticky top-4">
              <nav className="space-y-1">
                {[
                  { id: 'profile', label: 'Profile Settings', icon: FaUser },
                  { id: 'security', label: 'Security & Password', icon: FaLock },
                  { id: 'notifications', label: 'Notifications', icon: FaBell },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      <Icon />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-teal-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt />
                  <span className="font-medium flex-1 text-left">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-teal-100">
              {/* Profile Settings Section */}
              {activeSection === 'profile' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      Save Changes
                    </button>
                  </div>

                  {/* Avatar Upload */}
                  <div className="mb-8 flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                            }}
                          />
                        ) : (
                          <FaUser className="text-white text-4xl" />
                        )}
                      </div>
                      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-teal-50 transition-colors">
                        <FaUpload className="text-teal-600 text-sm" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {avatarFile && (
                      <button
                        onClick={handleAvatarUpdate}
                        disabled={loading}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                      >
                        Upload Avatar
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Read-only fields (non-editable) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User ID
                        </label>
                        <input
                          type="text"
                          value={userData._id}
                          readOnly
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={userData.username}
                          readOnly
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          readOnly
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={userData.role}
                          readOnly
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Editable fields */}
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-teal-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.fullName}
                          onChange={(e) => handleProfileChange('fullName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio <span className="text-teal-600">*</span>
                        </label>
                        <textarea
                          value={userData.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    {/* Account metadata */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Account created:</span>{' '}
                          {new Date(userData.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last updated:</span>{' '}
                          {new Date(userData.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security & Password Section */}
              {activeSection === 'security' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Security & Password</h2>
                    <button
                      onClick={() => toggleSection('security')}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {expandedSections.security ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections.security && (
                    <div className="space-y-8">
                      {/* Change Password Form - UI only */}
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaKey className="text-teal-600" />
                          Change Password
                        </h3>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={passwordForm.showCurrent ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-12"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => setPasswordForm({...passwordForm, showCurrent: !passwordForm.showCurrent})}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                              >
                                {passwordForm.showCurrent ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={passwordForm.showNew ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-12"
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => setPasswordForm({...passwordForm, showNew: !passwordForm.showNew})}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                              >
                                {passwordForm.showNew ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {passwordForm.newPassword && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full bg-${passwordStrength.color}-500`}
                                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                                    {passwordStrength.label}
                                  </span>
                                </div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  <li className="flex items-center gap-1">
                                    {passwordForm.newPassword.length >= 8 ? (
                                      <FaCheckCircle className="text-green-500 text-xs" />
                                    ) : (
                                      <FaTimes className="text-red-500 text-xs" />
                                    )}
                                    At least 8 characters
                                  </li>
                                  <li className="flex items-center gap-1">
                                    {/[a-z]/.test(passwordForm.newPassword) ? (
                                      <FaCheckCircle className="text-green-500 text-xs" />
                                    ) : (
                                      <FaTimes className="text-red-500 text-xs" />
                                    )}
                                    Contains lowercase letter
                                  </li>
                                  <li className="flex items-center gap-1">
                                    {/[A-Z]/.test(passwordForm.newPassword) ? (
                                      <FaCheckCircle className="text-green-500 text-xs" />
                                    ) : (
                                      <FaTimes className="text-red-500 text-xs" />
                                    )}
                                    Contains uppercase letter
                                  </li>
                                  <li className="flex items-center gap-1">
                                    {/[0-9]/.test(passwordForm.newPassword) ? (
                                      <FaCheckCircle className="text-green-500 text-xs" />
                                    ) : (
                                      <FaTimes className="text-red-500 text-xs" />
                                    )}
                                    Contains number
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={passwordForm.showConfirm ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-12"
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() => setPasswordForm({...passwordForm, showConfirm: !passwordForm.showConfirm})}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                              >
                                {passwordForm.showConfirm ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                            )}
                          </div>

                          <div className="text-sm text-gray-500 italic">
                            Password change feature coming soon
                          </div>
                        </form>
                      </div>

                      {/* Delete Account */}
                      <div className="bg-white p-6 rounded-2xl border border-red-100">
                        <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                          <FaTrash />
                          Danger Zone
                        </h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">Delete Account</p>
                            <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                          </div>
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Notification Settings</h2>
                    <button
                      onClick={() => toggleSection('notifications')}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {expandedSections.notifications ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections.notifications && (
                    <div className="space-y-6">
                      {/* Notification Channels */}
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Channels</h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <PiAlignCenterVerticalLight className="text-teal-600" />
                              <span className="text-gray-700">Email Notifications</span>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle('emailNotifications')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                notifications.emailNotifications ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <PiAlignCenterVerticalLight className="text-teal-600" />
                              <span className="text-gray-700">Push Notifications</span>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle('pushNotifications')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                notifications.pushNotifications ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionSetting;
