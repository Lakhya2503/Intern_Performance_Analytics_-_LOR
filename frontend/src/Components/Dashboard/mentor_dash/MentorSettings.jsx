import React, { useState, useEffect } from 'react';
import { requestHandler } from '../../../utils/index';
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaGlobe,
  FaLanguage,
  FaEnvelope,
  FaMobile,
  FaDesktop,
  FaMoon,
  FaSun,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronRight,
  FaSignOutAlt,
  FaTrash,
  FaDownload,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaGoogle,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaClock,
  FaBellSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaCog,
  FaUserCog,
  FaUsers,
  FaEnvelopeOpen,
  FaSms,
  FaWhatsapp,
  FaSlack,
  FaDiscord,
  FaToggleOn,
  FaToggleOff,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaMinus,
  FaTimes,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaQrcode,
  FaFingerprint,
  FaIdCard,
  FaHistory,
  FaBan,
  FaLock as FaLockSolid,
  FaVideo,
  FaCalendarAlt
} from 'react-icons/fa';

// Import only the API functions you provided
import {
  loggedOutUser,
  currentUser,
  deleteAccount,
  updateAvatar,
  updateProfile
} from '../../../api/index';

// Note: The following functions are NOT available in your imports:
// - updatePassword
// - updateSettings
// - updateIntegration
// - getLoginHistory
// - getActiveSessions
// - revokeSession
// - exportUserData

const MentorSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    security: true,
    notifications: false,
    privacy: false,
    preferences: false,
    integrations: false
  });

  // Data states
  const [activeSessions, setActiveSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [integrations, setIntegrations] = useState([]);
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

  // Settings state - using only profile data since other APIs aren't available
  const [settings, setSettings] = useState({
    // Profile Settings (from currentUser API)
    profile: {
      displayName: '',
      username: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      timezone: 'America/Los_Angeles',
      language: 'English',
      avatar: null
    },

    // Local UI state for other settings (not synced with backend)
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      desktopNotifications: true,
      emailPreferences: {
        mentorshipRequests: true,
        sessionReminders: true,
        messages: true,
        achievements: true,
        newsletter: false,
        securityAlerts: true
      },
      pushPreferences: {
        newMessages: true,
        sessionReminders: true,
        menteeUpdates: true,
        systemAlerts: true
      }
    },

    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showOnlineStatus: true,
      allowMenteeRequests: true,
      allowMessages: 'everyone',
      dataSharing: false
    },

    preferences: {
      defaultSessionDuration: 60,
      reminderTime: 15,
      autoAcceptRequests: false,
      weeklyReport: true,
      sessionRecording: false,
      notesSharing: true
    },

    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  // Fetch user data on component mount using currentUser API
  useEffect(() => {
    fetchUserData();
    // Mock data for features not supported by APIs
    fetchMockData();
  }, []);

  // Fetch user data using currentUser API
  const fetchUserData = () => {
    requestHandler(
      async () => await currentUser(),
      setFetchLoading,
      (response) => {
        // Update settings with user data from API
        const userData = response.data;
        setUserData(userData);

        setSettings(prevSettings => ({
          ...prevSettings,
          profile: {
            ...prevSettings.profile,
            displayName: userData.displayName || '',
            username: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            bio: userData.bio || '',
            location: userData.location || '',
            timezone: userData.timezone || 'America/Los_Angeles',
            language: userData.language || 'English',
            avatar: userData.avatar || null
          }
        }));

        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to fetch user data');
      }
    );
  };

  // Mock data for features not supported by APIs
  const fetchMockData = () => {
    // Mock active sessions
    setActiveSessions([
      {
        id: '1',
        deviceName: 'Chrome on Windows',
        device: 'desktop',
        location: 'New York, USA',
        lastActive: '2 minutes ago',
        isCurrent: true
      },
      {
        id: '2',
        deviceName: 'Safari on iPhone',
        device: 'mobile',
        location: 'New York, USA',
        lastActive: '2 hours ago',
        isCurrent: false
      }
    ]);

    // Mock login history
    setLoginHistory([
      { deviceName: 'Chrome on Windows', location: 'New York, USA', time: 'Today, 10:30 AM' },
      { deviceName: 'Safari on iPhone', location: 'New York, USA', time: 'Yesterday, 8:15 PM' },
      { deviceName: 'Firefox on Mac', location: 'Boston, USA', time: '2 days ago' }
    ]);

    // Mock integrations
    setIntegrations([
      { id: '1', name: 'Google Calendar', description: 'Sync your sessions', icon: 'googleCalendar', enabled: true },
      { id: '2', name: 'Slack', description: 'Get notifications in Slack', icon: 'slack', enabled: false },
      { id: '3', name: 'Zoom', description: 'Auto-create meeting links', icon: 'zoom', enabled: true },
      { id: '4', name: 'GitHub', description: 'Connect your repositories', icon: 'github', enabled: false }
    ]);
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
        setSuccessMessage('Avatar updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to update avatar');
      }
    );
  };

  // Password strength checker (UI only)
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

  // Handle profile update using updateProfile API
  const handleProfileUpdate = () => {
    const profileData = {
      displayName: settings.profile.displayName,
      username: settings.profile.username,
      email: settings.profile.email,
      phone: settings.profile.phone,
      bio: settings.profile.bio,
      location: settings.profile.location,
      timezone: settings.profile.timezone,
      language: settings.profile.language
    };

    requestHandler(
      async () => await updateProfile(profileData),
      setLoading,
      (response) => {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to update profile');
      }
    );
  };

  // Handle profile field change (local only)
  const handleProfileChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  // Handle delete account using deleteAccount API
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
        // Redirect to login page
        window.location.href = '/login';
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to delete account');
        setShowConfirmModal(false);
      }
    );
  };

  // Handle logout using loggedOutUser API
  const handleLogout = () => {
    requestHandler(
      async () => await loggedOutUser(),
      setLoading,
      (response) => {
        // Clear local storage and redirect
        localStorage.removeItem('token');
        window.location.href = '/login';
      },
      (error) => {
        setErrorMessage(error.message || 'Failed to logout');
      }
    );
  };

  // Handle toggle change (local only - no API)
  const handleToggleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setSuccessMessage('Settings updated locally');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle revoke session (mock)
  const handleRevokeSession = (sessionId) => {
    setModalAction('revoke');
    setModalData(sessionId);
    setShowConfirmModal(true);
  };

  // Confirm revoke session (mock)
  const confirmRevokeSession = () => {
    setActiveSessions(prev => prev.filter(session => session.id !== modalData));
    setSuccessMessage('Session revoked successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowConfirmModal(false);
  };

  // Handle integration toggle (mock)
  const handleIntegrationToggle = (integrationId, enabled) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, enabled: !enabled }
          : integration
      )
    );
    setSuccessMessage('Integration updated locally');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle export data (mock)
  const handleExportData = () => {
    setModalAction('export');
    setShowConfirmModal(true);
  };

  // Confirm export data (mock)
  const confirmExportData = () => {
    const mockData = {
      profile: settings.profile,
      settings: settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mentor-data.json';
    a.click();

    setSuccessMessage('Data exported successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowConfirmModal(false);
  };

  // Handle modal confirm
  const handleModalConfirm = () => {
    switch (modalAction) {
      case 'delete':
        confirmDeleteAccount();
        break;
      case 'export':
        confirmExportData();
        break;
      case 'revoke':
        confirmRevokeSession();
        break;
      default:
        setShowConfirmModal(false);
    }
  };

  // Get modal content based on action
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
      case 'export':
        return {
          icon: FaDownload,
          iconBg: 'bg-teal-100',
          iconColor: 'text-teal-600',
          title: 'Export Data',
          message: 'Your data will be exported as a JSON file. This may take a moment.',
          confirmColor: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
        };
      case 'revoke':
        return {
          icon: FaBan,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          title: 'Revoke Session',
          message: 'Are you sure you want to revoke this session? The device will be logged out immediately.',
          confirmColor: 'bg-orange-600 hover:bg-orange-700'
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
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border-l-4 border-teal-500 text-teal-700 p-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-teal-600" />
            </div>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
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
                  { id: 'privacy', label: 'Privacy', icon: FaShieldAlt },
                  { id: 'preferences', label: 'Preferences', icon: FaCog },
                  { id: 'integrations', label: 'Integrations', icon: FaGlobe }
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
                      <Icon className={activeSection === item.id ? 'animate-pulse' : ''} />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      <FaChevronRight className={`text-sm transition-transform ${
                        activeSection === item.id ? 'translate-x-1' : ''
                      }`} />
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
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          settings.profile.displayName?.charAt(0) || <FaUser />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.displayName}
                          onChange={(e) => handleProfileChange('displayName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Enter your display name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={settings.profile.username}
                          onChange={(e) => handleProfileChange('username', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Enter username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={settings.profile.location}
                          onChange={(e) => handleProfileChange('location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Enter your location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.profile.timezone}
                          onChange={(e) => handleProfileChange('timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        >
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                          <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                          <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="Tell us about yourself..."
                      />
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

                      {/* Active Sessions */}
                      <div className="bg-white p-6 rounded-2xl border border-teal-100">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaDesktop className="text-teal-600" />
                          Active Sessions
                        </h3>

                        <div className="space-y-4">
                          {activeSessions.length > 0 ? (
                            activeSessions.map((session) => (
                              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                    {session.device === 'mobile' ? (
                                      <FaMobile className="text-teal-600" />
                                    ) : (
                                      <FaDesktop className="text-teal-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{session.deviceName}</p>
                                    <p className="text-xs text-gray-500">
                                      {session.location} • {session.isCurrent ? 'Current session' : `Last active ${session.lastActive}`}
                                    </p>
                                  </div>
                                </div>
                                {!session.isCurrent && (
                                  <button
                                    onClick={() => handleRevokeSession(session.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                  >
                                    Revoke
                                  </button>
                                )}
                                {session.isCurrent && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Active
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No active sessions found</p>
                          )}
                        </div>
                      </div>

                      {/* Login History */}
                      <div className="bg-white p-6 rounded-2xl border border-teal-100">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaHistory className="text-teal-600" />
                          Recent Login History
                        </h3>

                        <div className="space-y-3">
                          {loginHistory.length > 0 ? (
                            loginHistory.map((login, index) => (
                              <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-800">{login.deviceName}</p>
                                  <p className="text-gray-500 text-xs">{login.location}</p>
                                </div>
                                <p className="text-gray-500 text-xs">{login.time}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No login history found</p>
                          )}
                        </div>
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
                              <FaEnvelope className="text-teal-600" />
                              <span className="text-gray-700">Email Notifications</span>
                            </div>
                            <button
                              onClick={() => handleToggleChange('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications.emailNotifications ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaMobile className="text-teal-600" />
                              <span className="text-gray-700">Push Notifications</span>
                            </div>
                            <button
                              onClick={() => handleToggleChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications.pushNotifications ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaSms className="text-teal-600" />
                              <span className="text-gray-700">SMS Notifications</span>
                            </div>
                            <button
                              onClick={() => handleToggleChange('notifications', 'smsNotifications', !settings.notifications.smsNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications.smsNotifications ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaDesktop className="text-teal-600" />
                              <span className="text-gray-700">Desktop Notifications</span>
                            </div>
                            <button
                              onClick={() => handleToggleChange('notifications', 'desktopNotifications', !settings.notifications.desktopNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications.desktopNotifications ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications.desktopNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Email Preferences */}
                      <div className="bg-white p-6 rounded-2xl border border-teal-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Email Preferences</h3>

                        <div className="space-y-3">
                          {Object.entries(settings.notifications.emailPreferences).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <button
                                onClick={() => handleToggleChange('notifications', 'emailPreferences', {
                                  ...settings.notifications.emailPreferences,
                                  [key]: !value
                                })}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  value ? 'bg-teal-600' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    value ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Privacy Settings</h2>
                    <button
                      onClick={() => toggleSection('privacy')}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {expandedSections.privacy ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections.privacy && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Visibility</h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Who can see your profile?
                            </label>
                            <select
                              value={settings.privacy.profileVisibility}
                              onChange={(e) => handleToggleChange('privacy', 'profileVisibility', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                            >
                              <option value="public">Public - Everyone can see</option>
                              <option value="mentors-only">Mentors Only</option>
                              <option value="private">Private - Only mentees</option>
                            </select>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Show email address</span>
                              <button
                                onClick={() => handleToggleChange('privacy', 'showEmail', !settings.privacy.showEmail)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  settings.privacy.showEmail ? 'bg-teal-600' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    settings.privacy.showEmail ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Show phone number</span>
                              <button
                                onClick={() => handleToggleChange('privacy', 'showPhone', !settings.privacy.showPhone)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  settings.privacy.showPhone ? 'bg-teal-600' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    settings.privacy.showPhone ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Show location</span>
                              <button
                                onClick={() => handleToggleChange('privacy', 'showLocation', !settings.privacy.showLocation)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  settings.privacy.showLocation ? 'bg-teal-600' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    settings.privacy.showLocation ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Show online status</span>
                              <button
                                onClick={() => handleToggleChange('privacy', 'showOnlineStatus', !settings.privacy.showOnlineStatus)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  settings.privacy.showOnlineStatus ? 'bg-teal-600' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    settings.privacy.showOnlineStatus ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-teal-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Data & Sharing</h3>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">Data Sharing</p>
                              <p className="text-sm text-gray-500">Share anonymous usage data to help improve the platform</p>
                            </div>
                            <button
                              onClick={() => handleToggleChange('privacy', 'dataSharing', !settings.privacy.dataSharing)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                settings.privacy.dataSharing ? 'bg-teal-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  settings.privacy.dataSharing ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Export Data */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              <p className="font-medium text-gray-800">Export Data</p>
                              <p className="text-sm text-gray-500">Download all your data as JSON</p>
                            </div>
                            <button
                              onClick={handleExportData}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                            >
                              <FaDownload className="inline mr-2" />
                              Export
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
                    <button
                      onClick={() => toggleSection('preferences')}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {expandedSections.preferences ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections.preferences && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Session Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={settings.preferences.defaultSessionDuration}
                            onChange={(e) => handleToggleChange('preferences', 'defaultSessionDuration', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                            min="15"
                            max="180"
                            step="15"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reminder Time (minutes before)
                          </label>
                          <input
                            type="number"
                            value={settings.preferences.reminderTime}
                            onChange={(e) => handleToggleChange('preferences', 'reminderTime', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                            min="5"
                            max="120"
                            step="5"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">Auto-accept Mentee Requests</p>
                            <p className="text-sm text-gray-500">Automatically accept new mentorship requests</p>
                          </div>
                          <button
                            onClick={() => handleToggleChange('preferences', 'autoAcceptRequests', !settings.preferences.autoAcceptRequests)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.preferences.autoAcceptRequests ? 'bg-teal-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.preferences.autoAcceptRequests ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">Weekly Report</p>
                            <p className="text-sm text-gray-500">Receive weekly summary of your mentoring activity</p>
                          </div>
                          <button
                            onClick={() => handleToggleChange('preferences', 'weeklyReport', !settings.preferences.weeklyReport)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.preferences.weeklyReport ? 'bg-teal-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.preferences.weeklyReport ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">Session Recording</p>
                            <p className="text-sm text-gray-500">Allow recording of mentoring sessions</p>
                          </div>
                          <button
                            onClick={() => handleToggleChange('preferences', 'sessionRecording', !settings.preferences.sessionRecording)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.preferences.sessionRecording ? 'bg-teal-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.preferences.sessionRecording ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">Share Notes</p>
                            <p className="text-sm text-gray-500">Share session notes with mentees</p>
                          </div>
                          <button
                            onClick={() => handleToggleChange('preferences', 'notesSharing', !settings.preferences.notesSharing)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.preferences.notesSharing ? 'bg-teal-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.preferences.notesSharing ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Integrations Section */}
              {activeSection === 'integrations' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Integrations</h2>
                    <button
                      onClick={() => toggleSection('integrations')}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {expandedSections.integrations ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections.integrations && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {integrations.length > 0 ? (
                        integrations.map((integration) => (
                          <div key={integration.id} className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-xl border border-teal-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {integration.icon === 'googleCalendar' && <FaCalendarAlt className="text-teal-600" />}
                                {integration.icon === 'slack' && <FaSlack className="text-teal-600" />}
                                {integration.icon === 'zoom' && <FaVideo className="text-teal-600" />}
                                {integration.icon === 'github' && <FaGithub className="text-teal-600" />}
                                {integration.icon === 'linkedin' && <FaLinkedin className="text-teal-600" />}
                                <div>
                                  <p className="font-medium text-gray-800">{integration.name}</p>
                                  <p className="text-xs text-gray-500">{integration.description}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleIntegrationToggle(integration.id, integration.enabled)}
                                disabled={loading}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  integration.enabled ? 'bg-teal-600' : 'bg-gray-300'
                                } disabled:opacity-50`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    integration.enabled ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <FaGlobe className="text-4xl text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No integrations available</p>
                        </div>
                      )}
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

export default MentorSettings;
