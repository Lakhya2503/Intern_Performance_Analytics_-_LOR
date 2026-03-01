import React from 'react'
import { Athenura } from '../../public/images'

const Privacy = () => {
      const date = new Date();
      const lastUpdated = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

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
          <div className="mb-4 flex justify-center">
            <img
              src={Athenura}
              alt="Athenura Logo"
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:text-xl">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">

            {/* Quick Navigation (Optional enhancement) */}
            <nav className="mb-8 flex flex-wrap gap-2" aria-label="Policy sections">
              {['Introduction', 'Information We Collect', 'How We Use Information', 'Data Protection', 'Contact Us'].map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                >
                  {section}
                </a>
              ))}
            </nav>

            {/* Introduction Section */}
            <section id="introduction" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                At <span className="font-semibold text-blue-600">Athenura</span>, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you visit our website or use our services.
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy
                policy, please do not access the site.
              </p>
            </section>

            {/* Information Collection Section */}
            <section id="information-we-collect" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Data</h3>
                  <p className="text-gray-600">
                    We may collect personal identification information, such as your:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Name and email address</li>
                    <li>Phone number and address</li>
                    <li>Payment information</li>
                    <li>Account credentials</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                  <p className="text-gray-600">
                    We automatically collect information about how you interact with our services:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information</li>
                    <li>Cookies and tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="how-we-use-information" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "To provide and maintain our services",
                  "To improve customer experience",
                  "To process your transactions",
                  "To send you updates and marketing"
                ].map((text, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Protection */}
            <section id="data-protection" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-gray-700">
                  We implement a variety of security measures to maintain the safety of your personal information.
                  Your personal information is contained behind secured networks and is only accessible by a limited
                  number of persons who have special access rights to such systems.
                </p>
              </div>
            </section>

            {/* Third Party Disclosure */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Disclosure</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer to outside parties your personally identifiable
                information unless we provide users with advance notice. This does not include website hosting
                partners and other parties who assist us in operating our website, conducting our business,
                or serving our users.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact-us" className="mb-8 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
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
                      <p className="font-semibold text-gray-900">Athenura Headquarters</p>
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
                © {new Date().getFullYear()} Athenura. All rights reserved. | {contactInfo.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
