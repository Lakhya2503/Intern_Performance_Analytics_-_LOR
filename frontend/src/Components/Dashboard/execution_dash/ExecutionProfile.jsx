import React, { useState, useEffect } from 'react';
import { updateAvatar, updateProfile } from '../../../api/index';
import { requestHandler } from '../../../utils/index';

const ExecutionProfile = () => {
  // State Management
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Form State
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    bio: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    // Get user data from localStorage or context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setProfileForm({
          fullName: parsedUser.fullName || '',
          bio: parsedUser.bio || '',
          username: parsedUser.user?.username || '',
          email: parsedUser.user?.email || ''
        });
        setAvatarPreview(parsedUser.avatar || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

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

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    requestHandler(
      async () => await updateAvatar(formData),
      setLoading,
      (response) => {
        setSuccessMessage('✨ Avatar updated successfully!');
        // Update user data in localStorage
        if (userData) {
          const updatedUser = {
            ...userData,
            avatar: response.data?.avatar || avatarPreview
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUserData(updatedUser);
        }
        setAvatarFile(null);
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to update avatar');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      fullName: profileForm.fullName,
      bio: profileForm.bio,
      username: profileForm.username
    };

    requestHandler(
      async () => await updateProfile(payload),
      setLoading,
      (response) => {
        setSuccessMessage('✅ Profile updated successfully!');
        // Update user data in localStorage
        if (userData) {
          const updatedUser = {
            ...userData,
            fullName: profileForm.fullName,
            bio: profileForm.bio,
            user: {
              ...userData.user,
              username: profileForm.username,
              email: userData.user?.email // email remains unchanged
            }
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUserData(updatedUser);
        }
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      (error) => {
        setError(error.message || 'Failed to update profile');
        setTimeout(() => setError(''), 3000);
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInitials = () => {
    if (profileForm.fullName) {
      return profileForm.fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return profileForm.username?.slice(0, 2).toUpperCase() || 'EP';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Execution Team Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your profile information and settings</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md animate-slideIn">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md animate-slideIn">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4 font-medium">Updating profile...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">🖼️</span>
                  Profile Picture
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center">
                  {/* Avatar Display */}
                  <div className="relative group mb-4">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {getInitials()}
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-sm">✏️</span>
                    </label>
                  </div>

                  {/* Avatar Upload */}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />

                  {avatarFile && (
                    <div className="w-full space-y-3">
                      <p className="text-sm text-gray-600 text-center">
                        Selected: {avatarFile.name}
                      </p>
                      <button
                        onClick={handleAvatarUpload}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium shadow-lg"
                      >
                        <span className="mr-2">📤</span>
                        Upload Avatar
                      </button>
                    </div>
                  )}

                  {/* User Role Badge */}
                  <div className="mt-4 text-center">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {userData?.user?.role || 'Execution Team'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">👤</span>
                  Profile Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    <span className="mr-2">✏️</span>
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="p-6">
                {isEditing ? (
                  // Edit Mode Form
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profileForm.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all transform hover:scale-105 font-medium shadow-lg"
                      >
                        <span className="mr-2">💾</span>
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form to original values
                          if (userData) {
                            setProfileForm({
                              fullName: userData.fullName || '',
                              bio: userData.bio || '',
                              username: userData.user?.username || '',
                              email: userData.user?.email || ''
                            });
                          }
                        }}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {profileForm.fullName || 'Not provided'}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Username</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {profileForm.username}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {profileForm.email}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Member Since</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-800">
                        {profileForm.bio || 'No bio provided yet.'}
                      </p>
                    </div>

                    {/* Account Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">Account Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">User ID</span>
                          <span className="text-sm font-mono text-gray-800">{userData?.user?._id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Profile ID</span>
                          <span className="text-sm font-mono text-gray-800">{userData?._id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Status</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {userData?.user?.isAuthorized ? 'Authorized' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Last Updated</span>
                          <span className="text-sm text-gray-800">
                            {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionProfile;
