import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
    errors: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (formStatus.errors[name]) {
      setFormStatus(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ""
        }
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Please fix the errors below",
        errors
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you! Your message has been sent successfully.",
        errors: {}
      });

      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        message: ""
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);

    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: "Something went wrong. Please try again later.",
        errors: {}
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear form status
  const clearStatus = () => {
    setFormStatus({
      submitted: false,
      success: false,
      message: "",
      errors: {}
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 py-12 px-4 md:px-12 flex items-center relative overflow-hidden">

      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5 border border-teal-100/50 hover:shadow-teal-500/10 transition-shadow duration-500">

          {/* Left Side: Contact Info (Teal Background) */}
          <div className="md:col-span-2 bg-gradient-to-br from-teal-800 via-teal-800 to-teal-900 p-10 text-white flex flex-col justify-between relative overflow-hidden group">
            {/* Animated Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000 delay-300" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 animate-fade-in">Get in Touch</h2>
              <p className="text-teal-100 mb-8 leading-relaxed border-l-4 border-teal-400 pl-4 italic">
                Have questions about our automation tools? Need a custom solution?
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                {/* Phone - Interactive */}
                <div className="flex items-start gap-4 group/item transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm group-hover/item:bg-white/20 group-hover/item:scale-110 transition-all duration-300">
                    <FaPhoneAlt className="group-hover/item:rotate-12 transition-transform duration-300"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      Phone
                      <span className="w-1 h-1 bg-teal-400 rounded-full animate-ping" />
                    </h3>
                    <p className="text-teal-100 text-sm hover:text-white transition-colors cursor-pointer">
                      +91 98350 51934
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group/item transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm group-hover/item:bg-white/20 group-hover/item:scale-110 transition-all duration-300">
                    <MdEmail className="group-hover/item:rotate-12 transition-transform duration-300"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email</h3>
                    <p className="text-teal-100 text-sm hover:text-white transition-colors cursor-pointer">
                      official@athenura.in
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 group/item transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm group-hover/item:bg-white/20 group-hover/item:scale-110 transition-all duration-300">
                    <FaLocationDot className="group-hover/item:rotate-12 transition-transform duration-300"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Office</h3>
                    <p className="text-teal-100 text-sm">
                      Sector 62, Noida, Uttar Pradesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links with enhanced animations */}
            <div className="flex gap-4 mt-8 relative z-10">
              <a href="https://www.linkedin.com/company/athenura/" target="_blank" rel="noopener noreferrer"
                 className="group/social transform hover:scale-110 transition-all duration-300">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-teal-800 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30">
                  <FaLinkedin className="group-hover/social:rotate-360 transition-transform duration-500"/>
                </div>
              </a>

              <a href="https://x.com/athenura_in" target="_blank" rel="noopener noreferrer"
                 className="group/social transform hover:scale-110 transition-all duration-300">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-teal-800 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30">
                  <FaTwitter className="group-hover/social:rotate-360 transition-transform duration-500"/>
                </div>
              </a>

              <a href="https://github.com/Athenura" target="_blank" rel="noopener noreferrer"
                 className="group/social transform hover:scale-110 transition-all duration-300">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-teal-800 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30">
                  <FaGithub className="group-hover/social:rotate-360 transition-transform duration-500"/>
                </div>
              </a>
            </div>
          </div>

          {/* Right Side: Form with enhanced styling */}
          <div className="md:col-span-3 p-10 bg-white/90 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Send us a Message</h3>
            <p className="text-slate-500 mb-6 text-sm">We'd love to hear from you</p>

            {/* Status Messages */}
            {formStatus.submitted && formStatus.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                formStatus.success
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              } animate-slide-down`}>
                {formStatus.success ? (
                  <FiCheckCircle className="flex-shrink-0 text-xl" />
                ) : (
                  <FiAlertCircle className="flex-shrink-0 text-xl" />
                )}
                <p className="flex-1 text-sm">{formStatus.message}</p>
                <button
                  onClick={clearStatus}
                  className="p-1 hover:bg-white/50 rounded-full transition-colors"
                >
                  <IoMdClose />
                </button>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">

                {/* Name Field with Validation */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 flex items-center justify-between">
                    <span>Full Name <span className="text-teal-600">*</span></span>
                    {formStatus.errors.fullName && (
                      <span className="text-xs text-amber-600 font-normal">
                        {formStatus.errors.fullName}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-slate-50 border ${
                      formStatus.errors.fullName
                        ? 'border-amber-300 focus:ring-amber-500'
                        : 'border-slate-200 focus:ring-teal-500'
                    } rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all outline-none hover:bg-white`}
                  />
                </div>

                {/* Email Field with Validation */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 flex items-center justify-between">
                    <span>Email Address <span className="text-teal-600">*</span></span>
                    {formStatus.errors.email && (
                      <span className="text-xs text-amber-600 font-normal">
                        {formStatus.errors.email}
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 bg-slate-50 border ${
                      formStatus.errors.email
                        ? 'border-amber-300 focus:ring-amber-500'
                        : 'border-slate-200 focus:ring-teal-500'
                    } rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all outline-none hover:bg-white`}
                  />
                </div>
              </div>

              {/* Message Field with Validation */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 flex items-center justify-between">
                  <span>Message <span className="text-teal-600">*</span></span>
                  {formStatus.errors.message && (
                    <span className="text-xs text-amber-600 font-normal">
                      {formStatus.errors.message}
                    </span>
                  )}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about your project or question..."
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    formStatus.errors.message
                      ? 'border-amber-300 focus:ring-amber-500'
                      : 'border-slate-200 focus:ring-teal-500'
                  } rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all outline-none resize-none hover:bg-white`}
                ></textarea>
                <p className="text-xs text-slate-400 text-right">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Submit Button with Loading State */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <span className={`flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                  Send Message
                  <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>

                {/* Loading Spinner */}
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
            </form>

            {/* Character count indicator */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
              <p>We respect your privacy. Your information is safe with us.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .rotate-360 {
          transform: rotate(360deg);
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
};

export default Contact;
