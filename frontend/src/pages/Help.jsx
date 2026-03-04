import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQs, setExpandedFAQs] = useState([]);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'automation', name: 'Automation', icon: '⚡' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with LOR Automation?',
      answer: 'Getting started is easy! Simply click the "Get Started" button on our homepage, create your account, and you\'ll have access to our onboarding wizard. The wizard will guide you through setting up your first automation workflow in just a few minutes. We also offer a 14-day free trial with full access to all features.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What is the setup process like?',
      answer: 'Our setup process is designed to be intuitive and quick. After signing up, you\'ll be guided through: 1) Connecting your first integration, 2) Creating a simple automation workflow, 3) Testing your automation, and 4) Deploying it to production. Most users have their first automation running within 15 minutes.'
    },
    {
      id: 3,
      category: 'automation',
      question: 'Can I create complex workflows with multiple steps?',
      answer: 'Absolutely! Our workflow builder supports complex, multi-step automations with conditional logic, data transformations, and error handling. You can chain together multiple actions, create branches based on conditions, and even build loops for repetitive tasks.'
    },
    {
      id: 4,
      category: 'automation',
      question: 'How do I schedule automations?',
      answer: 'You can schedule automations to run at specific times or intervals using our scheduler. Set up cron expressions or use our visual scheduler to choose specific times, days of the week, or monthly intervals. You can also trigger automations based on events from connected apps.'
    },
    {
      id: 5,
      category: 'account',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans. All payments are processed securely through our PCI-compliant payment partners.'
    },
    {
      id: 6,
      category: 'account',
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes to your plan will be reflected in your next billing cycle. If you upgrade mid-cycle, we\'ll prorate the difference.'
    },
    {
      id: 7,
      category: 'integrations',
      question: 'What apps can I integrate with?',
      answer: 'We support over 100+ integrations including popular tools like Slack, Salesforce, HubSpot, Google Workspace, Microsoft 365, Zapier, Make, and many more. Check our integrations page for a complete list.'
    },
    {
      id: 8,
      category: 'integrations',
      question: 'How do I set up a new integration?',
      answer: 'Setting up integrations is simple: 1) Go to the Integrations section in your dashboard, 2) Search for the app you want to connect, 3) Click "Connect" and follow the OAuth authentication flow, 4) Configure the integration settings, and 5) Start using it in your workflows.'
    },
    {
      id: 9,
      category: 'security',
      question: 'How secure is my data?',
      answer: 'We take security seriously. All data is encrypted at rest and in transit using AES-256 and TLS 1.3. We\'re SOC2 Type II compliant, undergo regular security audits, and offer SSO and 2FA for enterprise customers. Your data never leaves our secure infrastructure without encryption.'
    },
    {
      id: 10,
      category: 'security',
      question: 'Do you offer SSO?',
      answer: 'Yes, we offer Single Sign-On (SSO) for all enterprise plans. We support SAML 2.0, OAuth 2.0, and OpenID Connect protocols. Contact our sales team to set up SSO for your organization.'
    }
  ];

  // QUICK START GUIDES - OPTION 1: Link to actual pages you'll create
  const quickGuides = [
    {
      title: 'Creating Your First Workflow',
      description: 'Learn how to create, test, and deploy your first automation workflow in minutes.',
      icon: '🎯',
      link: '/guides/first-workflow' // Create this page
    },
    {
      title: 'Best Practices for Automation',
      description: 'Discover tips and tricks to build efficient, maintainable automation workflows.',
      icon: '💡',
      link: '/guides/best-practices' // Create this page
    },
    {
      title: 'Troubleshooting Common Issues',
      description: 'Solutions to the most common problems users encounter.',
      icon: '🔧',
      link: '/guides/troubleshooting' // Create this page
    },
    {
      title: 'API Documentation',
      description: 'Comprehensive API reference for developers building custom integrations.',
      icon: '📡',
      link: '/docs/api' // Create this page
    }
  ];

  // OPTION 2: If you don't want to create separate pages,
  // you can make them scroll to specific FAQs
  // const quickGuides = [
  //   {
  //     title: 'Creating Your First Workflow',
  //     description: 'Learn how to create, test, and deploy your first automation workflow.',
  //     icon: '🎯',
  //     onClick: () => {
  //       setActiveCategory('getting-started');
  //       setSearchQuery('first workflow');
  //       // Scroll to FAQ section
  //       document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' });
  //     }
  //   },
  //   {
  //     title: 'Best Practices for Automation',
  //     description: 'Tips to build efficient, maintainable automation workflows.',
  //     icon: '💡',
  //     onClick: () => {
  //       setActiveCategory('automation');
  //       setSearchQuery('best practices');
  //       document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' });
  //     }
  //   },
  //   {
  //     title: 'Troubleshooting Common Issues',
  //     description: 'Solutions to the most common problems users encounter.',
  //     icon: '🔧',
  //     onClick: () => {
  //       setActiveCategory('all');
  //       setSearchQuery('troubleshooting');
  //       document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' });
  //     }
  //   },
  //   {
  //     title: 'API Documentation',
  //     description: 'Reference for developers building custom integrations.',
  //     icon: '📡',
  //     onClick: () => {
  //       setActiveCategory('integrations');
  //       setSearchQuery('api');
  //       document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // ];

  // OPTION 3: Replace with your own content
  // const quickGuides = [
  //   {
  //     title: 'Student Registration Guide',
  //     description: 'How to register students and manage their profiles.',
  //     icon: '👨‍🎓',
  //     link: '/guides/student-registration'
  //   },
  //   {
  //     title: 'Performance Analytics',
  //     description: 'Understanding the analytics dashboard and reports.',
  //     icon: '📊',
  //     link: '/guides/analytics'
  //   },
  //   {
  //     title: 'Mentor Setup',
  //     description: 'Setting up mentor accounts and assigning students.',
  //     icon: '👥',
  //     link: '/guides/mentor-setup'
  //   },
  //   {
  //     title: 'Intern Tracking',
  //     description: 'How to track intern progress and generate reports.',
  //     icon: '📈',
  //     link: '/guides/intern-tracking'
  //   }
  // ];

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'official@athenura.in',
      link: 'mailto:official@athenura.in',
      bgColor: 'from-teal-500 to-teal-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone Support',
      description: 'Speak with a specialist (Enterprise only)',
      action: '+91 98350 51934',
      link: 'tel:+919835051934',
      bgColor: 'from-teal-600 to-cyan-600'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQs(prev =>
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-10">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-[linear-gradient(rgba(17,24,39,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.03)_1px,transparent_1px)] bg-[size:32px_32px] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              How can we help you?
            </h1>
            <p className="text-teal-700 text-lg md:text-xl mb-8">
              Search our knowledge base or browse topics below
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl bg-white/10 backdrop-blur-md border border-zinc-200 text-teal-400 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all "
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      {/* <section className="py-8 bg-[linear-gradient(rgba(17,24,39,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.03)_1px,transparent_1px)] border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section id="faq-section" className="py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600">
              Find quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map(faq => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between group"
                  >
                    <span className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-teal-600 transform transition-transform duration-300 ${
                        expandedFAQs.includes(faq.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFAQs.includes(faq.id) ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No results found for "{searchQuery}"</p>
                <p className="text-slate-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  for more info login  
                </Link>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 text-teal-600 hover:text-teal-700 font-medium block mx-auto"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Contact Options - Only Email and Phone */}
      <section className="py-16 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-slate-600">
              Reach out to our support team
            </p>
          </div>

          <div className="grid md:grid-cols-2 max-w-2xl mx-auto gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`w-14 h-14 bg-gradient-to-br ${method.bgColor} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {method.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {method.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4">
                  {method.description}
                </p>

                <div className="text-teal-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  {method.action} →
                </div>

                {/* Animated border */}
                <div className="absolute bottom-0 left-1/2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 transform -translate-x-1/2 transition-all duration-500" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-8 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Support hours: Monday - Friday, 9am - 6pm EST</span>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Average response time: &lt; 2 hours for email
          </p>
        </div>
      </section>
    </div>
  );
};

export default Help;
