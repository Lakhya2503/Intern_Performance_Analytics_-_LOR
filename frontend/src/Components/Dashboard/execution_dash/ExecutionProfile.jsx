import { useEffect, useState } from 'react';
import {
  FaBriefcase,
  FaBuilding,
  FaCamera,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaExclamationCircle,
  FaGlobe,
  FaGraduationCap,
  FaIdCard,
  FaLink,
  FaSave,
  FaSpinner,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import { requestHandler } from '../../../utils';

// Import the API functions
import { currentUser, updateAvatar, updateProfile } from '../../../api/index';

const ExecutionProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current user data
  const fetchCurrentUser = () => {
    requestHandler(
      async () => await currentUser(),
      setLoading,
      (response) => {
        setProfile(response.data);
        setEditForm({
          fullName: response.data.fullName || '',
          bio: response.data.bio || ''
        });
        if (response.data.avatar) {
          // Convert file path to URL if needed
          const avatarUrl = response.data.avatar.startsWith('C:')
            ? `http://localhost:5000/${response.data.avatar.split('public\\')[1]?.replace(/\\/g, '/')}`
            : response.data.avatar;
          setAvatarPreview(avatarUrl);
        }
        setError(null);
      },
      (error) => {
        setError(error.message || 'Failed to fetch profile');
        console.error('Error fetching profile:', error);
      }
    );
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Handle avatar change
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

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    requestHandler(
      async () => await updateAvatar(formData),
      setUploadingAvatar,
      (response) => {
        setProfile(prev => ({
          ...prev,
          avatar: response.data.avatar
        }));
        setAvatarFile(null);
      },
      (error) => {
        setError(error.message || 'Failed to update avatar');
        console.error('Error updating avatar:', error);
      }
    );
  };

  // Handle profile update - only sends fullName and bio
  const handleProfileUpdate = async () => {
    // Only send the fields that are editable
    const updateData = {
      fullName: editForm.fullName,
      bio: editForm.bio
    };

    requestHandler(
      async () => await updateProfile(updateData),
      setUpdatingProfile,
      (response) => {
        setProfile(prev => ({
          ...prev,
          ...response.data
        }));
        setIsEditing(false);
      },
      (error) => {
        setError(error.message || 'Failed to update profile');
        console.error('Error updating profile:', error);
      }
    );
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      fullName: profile?.fullName || '',
      bio: profile?.bio || ''
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get avatar URL
  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (profile?.avatar) {
      return profile.avatar.startsWith('C:')
        ? `http://localhost:5000/${profile.avatar.split('public\\')[1]?.replace(/\\/g, '/')}`
        : profile.avatar;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-indigo-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationCircle className="text-4xl text-red-600" />
          </div>
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={fetchCurrentUser}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border-l-4 border-indigo-500 text-indigo-700 p-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-indigo-600" />
            </div>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mb-8 border border-indigo-100">
          {/* Cover Photo with Gradient */}
          <div className="h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
              {/* Avatar with Rings */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-white transform transition-transform group-hover:scale-105">
                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()}
                      alt={profile?.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${profile?.fullName}&background=6366f1&color=fff&size=160&bold=true`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {profile?.fullName?.charAt(0) || 'M'}
                      </span>
                    </div>
                  )}

                  {/* Avatar Upload Overlay */}
                  <label className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
                        <FaCamera className="text-white text-xl" />
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              {/* Name and Role */}
              <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {profile?.fullName.toUpperCase() || profile?.user?.username || "ExecutionTeam"}
                </h1>
                <div className="flex items-center gap-3 font-bold text-zinc-700">
                  <FaBriefcase className="text-sm" />
                  <span className="font-medium">ExecutionTeam</span>
                </div>
              </div>
            </div>

            {/* Upload Avatar Button */}
            {avatarFile && (
              <div className="absolute bottom-4 right-8 animate-fadeIn">
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="px-6 py-3 bg-white/90 backdrop-blur-sm text-indigo-700 rounded-xl font-medium hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  {uploadingAvatar ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaCamera />
                      Save New Avatar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="pt-20 md:pt-24 px-6 md:px-12 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 mb-1">Member Since</p>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  {formatDate(profile?.user?.createdAt)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-purple-600 mb-1">Email</p>
                <p className="font-semibold text-gray-800 flex items-center gap-2 truncate">
                  <FaEnvelope className="text-purple-500" />
                  {profile?.user?.email}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-emerald-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                    profile?.user?.isAuthorized
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-amber-500 text-white shadow-sm'
                  }`}>
                    <FaCheckCircle className="text-xs" />
                    {profile?.user?.isAuthorized ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <p className="text-sm text-amber-600 mb-1">User ID</p>
                <p className="font-semibold text-gray-800 flex items-center gap-2 truncate">
                  <FaIdCard className="text-amber-500" />
                  {profile?._id?.slice(-6) || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-indigo-100">
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              // Edit Mode - Only fullName and bio are editable
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Tell us about yourself, your experience, and your mentoring philosophy..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={updatingProfile}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingProfile ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                      <FaUser className="text-indigo-600" />
                    </div>
                    <p className="text-sm text-indigo-600 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {profile?.fullName || 'Not provided'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                      <FaEnvelope className="text-indigo-600" />
                    </div>
                    <p className="text-sm text-indigo-600 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {profile?.user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About Me</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {profile?.bio || 'No bio provided yet.'}
                  </p>
                </div>

                {/* Additional Info - Read Only */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-indigo-600" />
                      Account Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-indigo-600">Username</p>
                        <p className="font-medium text-gray-800">
                          {profile?.user?.username || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-600">User ID</p>
                        <p className="font-medium text-gray-800">
                          {profile?._id || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-600">Role</p>
                        <p className="font-medium text-gray-800">
                          {profile?.user?.role || 'Mentor'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaLink className="text-indigo-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {profile?.user?.email && (
                        <div className="flex items-center gap-3 text-gray-700 p-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-indigo-100">
                          <FaEnvelope className="text-indigo-500" />
                          <span className="truncate">{profile.user.email}</span>
                        </div>
                      )}
                      {!profile?.user?.email && (
                        <p className="text-gray-500 text-center py-4">No contact information</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="border-t border-indigo-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaIdCard className="text-indigo-600" />
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <p className="text-sm text-indigo-600 mb-1">Account Created</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(profile?.user?.createdAt)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <p className="text-sm text-indigo-600 mb-1">Last Updated</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(profile?.updatedAt)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <p className="text-sm text-indigo-600 mb-1">Account Status</p>
                      <p className="font-medium text-gray-800">
                        {profile?.user?.isAuthorized ? 'Active' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecutionProfile;
