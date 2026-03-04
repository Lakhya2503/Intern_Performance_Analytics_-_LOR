import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiLock,
  FiMail,
  FiUser
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Athenura, AthnuraTitleImage } from "../../../public/images";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, user } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "", // Changed to identifier for UI
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [inputType, setInputType] = useState(''); // Track if typing username or email

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Detect if input is email or username for UI feedback
    if (name === 'identifier') {
      if (value.includes('@') && value.includes('.')) {
        setInputType('email');
      } else if (value.length > 0) {
        setInputType('username');
      } else {
        setInputType('');
      }
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Your logic - detect if email or username
      const isEmail = formData.identifier.includes('@');

      const payload = {
        password: formData.password,
        ...(isEmail
          ? { email: formData.identifier }
          : { username: formData.identifier })
      };

      const result = await login(payload);

      if (result.success && rememberMe) {
        localStorage.setItem('rememberedUser', formData.identifier);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        form: error.message || "Invalid username/email or password"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered identifier on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({ ...prev, identifier: rememberedUser }));
      // Detect type for UI
      if (rememberedUser.includes('@') && rememberedUser.includes('.')) {
        setInputType('email');
      } else {
        setInputType('username');
      }
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Split Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-teal-500/20 border border-white/40 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[800px] lg:min-h-[900px]">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 p-8 sm:p-10 xl:p-12 order-1 lg:order-1 overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg shadow-teal-500/30 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <img
                      src={AthnuraTitleImage}
                      alt="Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-4xl font-black text-slate-800 mt-4 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-slate-500 font-medium flex items-center justify-center">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-teal-400 mr-2"></span>
                  Sign in to your account
                  <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400 ml-2"></span>
                </p>
              </div>

              {/* Live Indicator - Shows what user is typing */}
              {formData.identifier && (
                <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${inputType === 'email' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm text-teal-700">
                    Signing in with <span className="font-bold">{inputType === 'email' ? 'email address' : 'username'}</span>
                  </span>
                </div>
              )}

              {/* Info Message - Clear that users can use username OR email */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiInfo className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-blue-800">
                  <span className="font-semibold">Two ways to sign in:</span>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center">
                      <FiUser className="w-4 h-4 mr-1" /> Username
                    </span>
                    <span className="text-blue-300">|</span>
                    <span className="flex items-center">
                      <FiMail className="w-4 h-4 mr-1" /> Email
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errors.form && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl text-red-600 text-sm animate-slideDown shadow-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <FiAlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-semibold">{errors.form}</span>
                  </div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Username/Email Input - Clear labeling */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <span className="w-1 h-4 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></span>
                    <span>Username <span className="text-slate-400 font-normal mx-1">or</span> Email</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      {/* Dynamic icon based on what user is typing */}
                      {inputType === 'email' ? (
                        <FiMail className={`w-5 h-5 transition-colors duration-200 ${errors.identifier ? 'text-red-400' : 'text-teal-500'}`} />
                      ) : inputType === 'username' ? (
                        <FiUser className={`w-5 h-5 transition-colors duration-200 ${errors.identifier ? 'text-red-400' : 'text-teal-500'}`} />
                      ) : (
                        // Show both icons when empty
                        <div className="flex items-center space-x-1">
                          <FiUser className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 text-xs">/</span>
                          <FiMail className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      name="identifier" // Changed to identifier
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your username or email address"
                      className={`w-full pl-16 pr-4 py-4 bg-white border-2 rounded-xl text-slate-900 placeholder-slate-400 font-medium outline-none transition-all duration-200
                        ${errors.identifier
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
                        } hover:border-slate-300`}
                    />
                    {formData.identifier && !errors.identifier && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.identifier && (
                    <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center animate-slideDown">
                      <FiAlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {errors.identifier}
                    </p>
                  )}

                  {/* Helper text with examples */}
                  {!errors.identifier && (
                    <p className="text-xs text-slate-400 mt-2 ml-1 flex items-center">
                      {!formData.identifier ? (
                        <>
                          <span className="bg-slate-100 px-2 py-1 rounded mr-2">example</span>
                          <span className="text-slate-300">or</span>
                          <span className="bg-slate-100 px-2 py-1 rounded ml-2">example@example.com</span>
                        </>
                      ) : inputType === 'email' ? (
                        <span className="text-teal-600">📧 Will sign in with email</span>
                      ) : (
                        <span className="text-teal-600">👤 Will sign in with username</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <span className="w-1 h-4 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></span>
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiLock className={`w-5 h-5 transition-colors duration-200 ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-4 bg-white border-2 rounded-xl text-slate-900 placeholder-slate-400 font-medium outline-none transition-all duration-200
                        ${errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
                        } hover:border-slate-300`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center animate-slideDown">
                      <FiAlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-2 border-slate-300 rounded focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                      />
                      {rememberMe && (
                        <FiCheckCircle className="absolute -top-0.5 -left-0.5 w-5 h-5 text-teal-600 pointer-events-none" />
                      )}
                    </div>
                    <label className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="relative w-full py-4 mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white
                  rounded-xl text-lg font-bold tracking-wide shadow-lg shadow-teal-500/30
                  hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5
                  transition-all duration-300 transform overflow-hidden group
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading || authLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        {inputType === 'email' ? <FiMail className="w-5 h-5 mr-2" /> : <FiUser className="w-5 h-5 mr-2" />}
                        Sign In
                      </>
                    )}
                  </span>
                </button>

                {/* Signup Link Footer */}
                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-slate-500 font-medium">
                      New to our platform?
                    </span>
                  </div>
                </div>

                <p className="text-center text-slate-500 font-medium">
                  <Link
                    to="/register"
                    className="text-teal-600 font-bold hover:text-teal-700 inline-flex items-center group"
                  >
                    Create an account
                    <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </form>
            </div>

            {/* Right Side - Image */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-500 to-cyan-600 p-8 sm:p-10 xl:p-12 flex items-center justify-center relative overflow-hidden order-2 lg:order-2">
              {/* Decorative elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              {/* Image Container */}
              <div className="relative z-10 text-center w-full">
                {/* Main Illustration/Image */}
                <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                  <img
                    src={Athenura}
                    alt="Team collaboration illustration"
                    className="w-full max-w-md mx-auto drop-shadow-2xl rounded-2xl"
                  />
                </div>

                {/* Text Content */}
                <h3 className="text-3xl xl:text-4xl font-bold text-white mb-4">
                  Welcome Back!
                </h3>
                <p className="text-white/90 text-lg xl:text-xl mb-8 max-w-md mx-auto">
                  Access your account to continue collaborating with mentors and team members.
                </p>

                {/* Feature List */}
                <div className="space-y-4 max-w-sm mx-auto">
                    <div className="flex items-center text-white bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <FiUser className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">Access your professional network</span>
                    </div>

                    <div className="flex items-center text-white bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <FiLock className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">Protected and secure account access</span>
                    </div>

                    <div className="flex items-center text-white bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <FiCheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">Monitor your activity and performance</span>
                    </div>
                  </div>

                {/* Testimonial/Quote */}
                <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-white/90 text-sm italic">
                    "Your gateway to meaningful professional connections"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          33% { transform: translate(-50%, -50%) scale(1.1); }
          66% { transform: translate(-50%, -50%) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
