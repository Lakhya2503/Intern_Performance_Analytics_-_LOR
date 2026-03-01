import React from 'react'

const TermsAndService = () => {
  // Constants for easy updates
        const date = new Date();
      const lastUpdated = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
  const companyName = "Athenura"
  const contactInfo = {
    address: "Sector 62, Noida, Uttar Pradesh",
    email: "official@athenura.in",
    phone: "+91 98350 51934",
    hours: "Monday - Friday, 9:00 AM - 6:00 PM (IST)"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:text-xl">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">

            {/* Quick Navigation */}
            <nav className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-4" aria-label="Terms sections">
              {[
                'Agreement', 'Eligibility', 'Accounts', 'Services',
                'Payments', 'Intellectual Property', 'Termination', 'Contact'
              ].map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                >
                  {section}
                </a>
              ))}
            </nav>

            {/* Agreement to Terms */}
            <section id="agreement" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing or using the services provided by <span className="font-semibold text-blue-600">{companyName}</span>, you agree to be bound by these Terms of Service.
                If you disagree with any part of the terms, you may not access the service.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">Important:</span> These terms constitute a legally binding agreement between you and {companyName}.
                  Please read them carefully.
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <div className="space-y-4">
                <p className="text-gray-600">By using our services, you represent and warrant that:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into a binding contract</li>
                  <li>You are not located in a country that is subject to government embargo</li>
                  <li>You will comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section id="accounts" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Your Responsibilities
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>Maintain account security</li>
                    <li>Provide accurate information</li>
                    <li>Keep login credentials confidential</li>
                    <li>Notify us of unauthorized access</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Prohibited Actions
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>Sharing account credentials</li>
                    <li>Using automated tools</li>
                    <li>Impersonating others</li>
                    <li>Violating laws</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Services and Products */}
            <section id="services" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Services and Products</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {companyName} provides technology solutions and services. We reserve the right to:
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Modify or discontinue services without notice",
                    "Refuse service to anyone for any reason",
                    "Update pricing and features",
                    "Implement usage limits"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section id="payments" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Pricing and Billing</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        All payments are non-refundable
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Prices subject to change with notice
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Taxes may apply based on location
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Methods</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Credit/Debit cards
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        UPI and Net Banking
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Bank transfers
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  The service and its original content, features, and functionality are and will remain the exclusive property of {companyName} and its licensors.
                </p>
                <div className="flex items-center space-x-2 bg-purple-50 p-4 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-sm text-gray-600">
                    Our services are protected by copyright, trademark, and other laws. You may not use our trademarks without written permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section id="termination" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation a breach of the Terms.
              </p>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 font-medium">Upon termination:</p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Your right to use the service will cease immediately</li>
                  <li>We may delete your account and data</li>
                  <li>Certain provisions shall survive termination</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  In no event shall {companyName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc list-inside mt-3 text-gray-600 space-y-1">
                  <li>Your use or inability to use the service</li>
                  <li>Any unauthorized access to your data</li>
                  <li>Any third-party conduct on the service</li>
                </ul>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact" className="mb-8 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0" aria-hidden="true">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{companyName} Headquarters</p>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0" aria-hidden="true">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Us</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0" aria-hidden="true">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Call Us</p>
                      <a
                        href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-6 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-500">
                    📅 Business Hours: {contactInfo.hours}
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} {companyName}. All rights reserved. | {contactInfo.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndService
