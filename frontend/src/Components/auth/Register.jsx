import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiChevronDown,
  FiUserPlus,
  FiUsers,
  FiUserCheck,
  FiShield
} from "react-icons/fi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { Athenura, AthnuraTitleImage, RegisterImg } from "../../../public/images";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    role: "Mentor",
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
      const result = await register(formData);

      if (result.success) {
        navigate('/login', {
          state: { message: 'Registration successful! Please login with your credentials.' }
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({
        form: error.message || "Registration failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Split Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-teal-500/20 border border-white/40 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[800px] lg:min-h-[900px]">
            {/* Left Side - Image */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-500 to-cyan-600 p-8 sm:p-10 xl:p-12 flex items-center justify-center relative overflow-hidden order-1 lg:order-1">
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
                  Join Our Community
                </h3>
                <p className="text-white/90 text-lg xl:text-xl mb-8 max-w-md mx-auto">
                  Connect with mentors and team members to collaborate on amazing projects and grow together.
                </p>

                {/* Feature List */}
                <div className="space-y-4 max-w-sm mx-auto">

                    <div className="flex items-center text-white bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <FiUserCheck className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                      <span className="text-sm font-medium">
                        Learn from experienced mentors
                      </span>
                    </div>

                    <div className="flex items-center text-white bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <FiUsers className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                      <span className="text-sm font-medium">
                        Collaborate with execution-focused teams
                      </span>
                    </div>

                    <div className="flex items-center text-white bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <FiShield className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                      <span className="text-sm font-medium">
                        Secure, private, and trusted platform
                      </span>
                    </div>

                  </div>

                {/* Testimonial/Quote */}
                <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-white/90 text-sm italic">
                    "The best place to grow your professional network and find opportunities"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-8 sm:p-10 xl:p-12 order-2 lg:order-2 overflow-y-auto">
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
                  Create Account
                </h2>
                <p className="text-slate-500 font-medium flex items-center justify-center">
                  <span className="w-8 h-px bg-gradient-to-r from-transparent to-teal-400 mr-2"></span>
                  Join our community today
                  <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400 ml-2"></span>
                </p>
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
                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <span className="w-1 h-4 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></span>
                    I want to join as
                  </label>
                  <div className="relative group">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all appearance-none cursor-pointer hover:border-slate-300"
                    >
                      <option value="Mentor">Mentor</option>
                      <option value="ExecutionTeam">Execution Team</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-teal-600 transition-colors">
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <span className="w-1 h-4 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></span>
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiMail className={`w-5 h-5 transition-colors duration-200 ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-4 bg-white border-2 rounded-xl text-slate-900 placeholder-slate-400 font-medium outline-none transition-all duration-200
                        ${errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
                        } hover:border-slate-300`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center animate-slideDown">
                      <FiAlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700 ml-1 flex items-center">
                    <span className="w-1 h-4 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></span>
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiUser className={`w-5 h-5 transition-colors duration-200 ${errors.username ? 'text-red-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      className={`w-full pl-10 pr-4 py-4 bg-white border-2 rounded-xl text-slate-900 placeholder-slate-400 font-medium outline-none transition-all duration-200
                        ${errors.username
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
                        } hover:border-slate-300`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center animate-slideDown">
                      <FiAlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {errors.username}
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
                      placeholder="Create a password"
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

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3 pt-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (errors.terms) {
                          setErrors({ ...errors, terms: "" });
                        }
                      }}
                      className="w-4 h-4 mt-1 text-teal-600 border-2 border-slate-300 rounded focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                    />
                    {agreeTerms && (
                      <FiCheckCircle className="absolute -top-0.5 -left-0.5 w-5 h-5 text-teal-600 pointer-events-none" />
                    )}
                  </div>
                  <label className="text-sm text-slate-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-slideDown">
                    <FiAlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    {errors.terms}
                  </p>
                )}

                {/* Sign Up Button */}
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
                        Creating Account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </span>
                </button>

                {/* Login Link Footer */}
                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-slate-500 font-medium">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <p className="text-center text-slate-500 font-medium">
                  <Link
                    to="/login"
                    className="text-teal-600 font-bold hover:text-teal-700 inline-flex items-center group"
                  >
                    Sign in here
                    <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </form>
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

export default Register;
