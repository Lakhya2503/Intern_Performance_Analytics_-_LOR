import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "../common/Hero";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [counters, setCounters] = useState({
    clients: 0,
    projects: 0,
    satisfaction: 0,
    countries: 0
  });

  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  // Stats counter animation
  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const steps = 60;
          const stepTime = duration / steps;

          let currentStep = 0;
          const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounters({
              clients: Math.min(Math.round(500 * progress), 500),
              projects: Math.min(Math.round(1500 * progress), 1500),
              satisfaction: Math.min(Math.round(99 * progress), 99),
              countries: Math.min(Math.round(25 * progress), 25)
            });

            if (currentStep >= steps) {
              clearInterval(interval);
            }
          }, stepTime);

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => statsObserver.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast Automation",
      description: "Process thousands of tasks in seconds with our optimized workflow engine.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to protect your sensitive data.",
      color: "from-cyan-500 to-teal-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
        </svg>
      ),
      title: "Global Infrastructure",
      description: "Deploy your workflows across multiple regions for maximum performance.",
      color: "from-teal-600 to-cyan-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Seamless Integration",
      description: "Connect with 100+ popular tools and platforms out of the box.",
      color: "from-cyan-600 to-teal-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at TechCorp",
      content: "LOR Automation has transformed how we handle our daily operations. We've reduced manual work by 80%.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108777-466fd6c24371?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Operations Director at GlobalLogistics",
      content: "The ROI we've seen in just 3 months is incredible. Their automation solutions are game-changing.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Emily Rodriguez",
      role: "Founder at StartupScale",
      content: "As a growing company, LOR's scalable solutions have been perfect for our needs. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero Section with animation */}
      <div ref={heroRef}>
        <Hero />
      </div>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                {counters.clients}+
              </div>
              <div className="text-sm text-slate-600 uppercase tracking-wider">Happy Clients</div>
              <div className="w-0 group-hover:w-full h-0.5 bg-teal-500 mx-auto transition-all duration-300"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                {counters.projects}+
              </div>
              <div className="text-sm text-slate-600 uppercase tracking-wider">Projects Completed</div>
              <div className="w-0 group-hover:w-full h-0.5 bg-teal-500 mx-auto transition-all duration-300"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                {counters.satisfaction}%
              </div>
              <div className="text-sm text-slate-600 uppercase tracking-wider">Satisfaction Rate</div>
              <div className="w-0 group-hover:w-full h-0.5 bg-teal-500 mx-auto transition-all duration-300"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                {counters.countries}+
              </div>
              <div className="text-sm text-slate-600 uppercase tracking-wider">Countries Served</div>
              <div className="w-0 group-hover:w-full h-0.5 bg-teal-500 mx-auto transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">
              Why Choose Us
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Modern Business
            </h2>
            <p className="text-slate-600">
              Everything you need to automate your workflows and scale your operations efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Animated border */}
                <div className="absolute bottom-0 left-1/2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 transform -translate-x-1/2 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">
              Testimonials
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-slate-600">
              Don't just take our word for it — hear from some of our satisfied customers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Testimonial Card */}
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    activeTestimonial === index
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 absolute top-0 left-0 translate-x-full'
                  }`}
                >
                  <div className="bg-slate-50 rounded-3xl p-8 md:p-10 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                        <p className="text-teal-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-lg italic mb-6">"{testimonial.content}"</p>

                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`transition-all duration-300 ${
                      activeTestimonial === index
                        ? 'w-8 bg-teal-600'
                        : 'w-2 bg-teal-200 hover:bg-teal-400'
                    } h-2 rounded-full`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-10 md:p-16 overflow-hidden group">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
            </div>

            <div className="relative z-10 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Automate Your Workflow?
              </h2>
              <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto">
                Join 500+ companies already using LOR Automation to streamline their operations.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 shadow-lg transition-all hover:scale-105 hover:shadow-2xl group/btn"
                >
                  <span className="flex items-center gap-2">
                    Start Free Trial
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
                >
                  Schedule Demo
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm">
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  14-day free trial
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl ${
          scrollProgress > 30 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
