import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { Athenura } from "../../public/images";

const Footer = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for footer (optional, can be removed if not needed)
  useEffect(() => {
    const handleScroll = () => {
      // Check if near bottom of page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

      setScrolled(scrollPercentage > 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className={`bg-white border-t border-gray-200 transition-all duration-300 ${
      scrolled ? "shadow-lg" : ""
    }`}>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            {/* <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
                <BsLightningChargeFill className="h-5 w-5" />
              </span>
              LOR Automation
            </h2> */}
             <img
                      src={Athenura}
                      alt="Athenura Logo"
                      className="h-12 md:h-14 transition-transform duration-300 group-hover:scale-105"
                    />
            <p className="text-gray-600 text-sm leading-relaxed">
              Streamlining your workflow with intelligent automation solutions.
              We help you save time, reduce errors, and scale your business faster.
            </p>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 tracking-wide relative inline-block">
              Product
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 tracking-wide relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-teal-600 transition-colors duration-300 group flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Location */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 tracking-wide relative inline-block">
              Get in Touch
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm">

              {/* Location */}
              <li className="flex items-start gap-3 group">
                <FaLocationDot className="h-5 w-5 text-teal-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-600 leading-relaxed">
                  Sector 62, Noida, Uttar Pradesh
                </span>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:official@athenura.in"
                  className="flex items-center gap-3 text-gray-600 hover:text-teal-600 transition-colors group"
                >
                  <MdEmail className="h-5 w-5 text-teal-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  official@athenura.in
                </a>
              </li>

              {/* Phone */}
              <li>
                <a
                  href="tel:+919835051934"
                  className="flex items-center gap-3 text-gray-600 hover:text-teal-600 transition-colors group"
                >
                  <FaPhoneAlt className="h-4 w-4 text-teal-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  +91 98350 51934
                </a>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} LOR Automation Inc. All rights reserved.
          </p>

          <div className="flex gap-6">
            {/* GitHub Icon */}
            <a
              href="https://github.com/Athenura"
              className="text-gray-500 hover:text-teal-600 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">GitHub</span>
              <FaGithub size={20} />
            </a>

            {/* Twitter Icon */}
            <a
              href="https://x.com/athenura_in"
              className="text-gray-500 hover:text-teal-600 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">Twitter</span>
              <FaTwitter size={20} />
            </a>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/company/athenura/"
              className="text-gray-500 hover:text-teal-600 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
