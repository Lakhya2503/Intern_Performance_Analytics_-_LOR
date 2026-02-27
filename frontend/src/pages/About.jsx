import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const About = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [counters, setCounters] = useState({ efficiency: 0, hours: 0 });

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (statsVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepTime = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounters({
          efficiency: Math.min(Math.round(300 * progress), 300),
          hours: Math.min(Math.round(10000 * progress), 10000)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [statsVisible]);

  // Auto-rotate core values
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const coreValues = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Our architecture is optimized for speed, ensuring your workflows execute in milliseconds, not minutes.",
      features: ["Real-time processing", "Optimized algorithms", "Instant feedback"]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Secure & Reliable",
      description: "Data integrity is our priority. We use enterprise-grade encryption to ensure your information never leaks.",
      features: ["256-bit encryption", "99.99% uptime", "Regular audits"]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Scalable Tech",
      description: "Built to grow with you. Whether you process 10 requests or 10 million, our system handles the load effortlessly.",
      features: ["Auto-scaling", "Load balancing", "Global infrastructure"]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- Section 1: Intro / Mission with enhanced animations --- */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />

        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Text Content with fade-in animation */}
          <div className="space-y-6 animate-fade-in-up">
            <h4 className="text-teal-600 font-bold uppercase tracking-widest text-sm">
              Who We Are
            </h4>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Revolutionizing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 animate-gradient">
                Workflow Automation
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              At <strong className="text-teal-600">LOR Automation</strong>, we believe that your time is too valuable to be spent on repetitive manual tasks. We build intelligent systems that streamline operations, eliminate errors, and empower teams to focus on innovation.
            </p>

            {/* Stats with counter animation */}
            <div ref={statsRef} className="flex gap-4 pt-2">
              <div className="border-l-4 border-teal-500 pl-4 hover:border-teal-600 transition-colors cursor-pointer transform hover:scale-105 duration-300">
                <p className="text-2xl font-bold text-slate-900">{counters.efficiency}%</p>
                <p className="text-sm text-slate-500">Efficiency Increase</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4 hover:border-teal-600 transition-colors cursor-pointer transform hover:scale-105 duration-300">
                <p className="text-2xl font-bold text-slate-900">{counters.hours.toLocaleString()}+</p>
                <p className="text-sm text-slate-500">Hours Saved</p>
              </div>
            </div>

            {/* New: Quick action buttons */}
            <div className="flex gap-3 pt-4">
              <button className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-100 transition-colors">
                Watch Demo
              </button>
              <button className="px-4 py-2 border border-teal-200 text-teal-600 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-colors">
                Read Case Studies
              </button>
            </div>
          </div>

          {/* Image/Visual with hover effects */}
          <div className="relative group">
            <div className="absolute inset-0 bg-teal-600 rounded-3xl transform rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Team working"
              className="relative rounded-3xl shadow-xl border border-slate-200 w-full object-cover h-[400px] group-hover:scale-105 transition-transform duration-500"
            />

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 transform group-hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">24/7 Active Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Core Values with interactive features --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose LOR Automation?
            </h2>
            <p className="text-slate-600">
              We don't just write code; we engineer solutions that adapt to your business needs.
            </p>

            {/* New: Interactive tabs for mobile */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveValue(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeValue === index ? 'w-8 bg-teal-600' : 'bg-teal-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className={`p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group ${
                  activeValue === index ? 'ring-2 ring-teal-500 shadow-lg' : ''
                }`}
                onMouseEnter={() => setActiveValue(index)}
              >
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 group-hover:rotate-12">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {value.description}
                </p>

                {/* New: Feature list with animation */}
                <ul className="space-y-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden">
                  {value.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-teal-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Progress indicator */}
                <div className="mt-4 w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: activeValue === index ? '100%' : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Enhanced CTA with micro-interactions --- */}
      <section className="py-20 px-6">
        <div className="container mx-auto bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
          {/* Animated background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10 animate-pulse-slow">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of professionals who are saving time and reducing errors with LOR Automation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              to="/signup"
              className="bg-white text-teal-700 px-8 py-3.5 rounded-xl font-bold hover:bg-teal-50 shadow-lg transition-all hover:scale-110 hover:shadow-2xl group/btn"
            >
              <span className="flex items-center gap-2">
                Get Started Now
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/contact"
              className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
            >
              Contact Sales
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex justify-center items-center gap-6 text-white/80 text-sm relative z-10">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trusted by 500+ companies
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ISO 27001 Certified
            </span>
          </div>
        </div>
      </section>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default About;
