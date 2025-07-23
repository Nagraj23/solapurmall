import React from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaGooglePlusG } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 py-20 mt-0 px-6 md:px-12 lg:px-20 text-sm  font-inter">
      {/* Main Grid for Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

        {/* Our Services */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-poppins font-semibold mb-4 text-blue-300">Our Services</h3>
          <ul className="space-y-2">
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">SMS Packages</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Software Development</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Software Design</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Website Development</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Web Based Application Development</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Website Maintenance</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Web based Marketing Strategies</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Web Hosting Services</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Domain Registration</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Graphics Design</li>
          </ul>
        </div>

        {/* My Account */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-poppins font-semibold mb-4 text-blue-300">My Account</h3>
          <ul className="space-y-2">
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">My Account</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Order History</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Wish List</li>
            <li className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Newsletter</li>
          </ul>
        </div>

        {/* Connect with us */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-poppins font-semibold mb-4 text-blue-300">Connect with us</h3>
          <div className="flex gap-4">
            {/* Social Icons with improved styling and hover effects */}
            <a href="https://www.facebook.com/share/16M57mAAD7/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white rounded-full p-2 w-10 h-10 transition-all duration-300 ease-in-out transform hover:scale-110" />
            </a>
            <a href="https://twitter.com/SolapurMallcom" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="bg-gray-700 text-gray-200 hover:bg-sky-500 hover:text-white rounded-full p-2 w-10 h-10 transition-all duration-300 ease-in-out transform hover:scale-110" />
            </a>
            <a href="https://www.youtube.com/SOLAPURMALL" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <FaYoutube className="bg-gray-700 text-gray-200 hover:bg-red-600 hover:text-white rounded-full p-2 w-10 h-10 transition-all duration-300 ease-in-out transform hover:scale-110" />
            </a>
            <a href="https://plus.google.com/u/0/102962801088238231753/posts" target="_blank" rel="noopener noreferrer" aria-label="Google Plus">
              <FaGooglePlusG className="bg-gray-700 text-gray-200 hover:bg-orange-500 hover:text-white rounded-full p-2 w-10 h-10 transition-all duration-300 ease-in-out transform hover:scale-110" />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-poppins font-semibold mb-4 text-blue-300">Solapurmall</h3>
          <address className="not-italic space-y-1">
            <p>23 B Rangraj Nagar, Behind Market Yard, Solapur</p>
            <p className="mt-2">Mobile: <a href="tel:+7385111191" className="hover:text-blue-200 transition-colors duration-200">+7385111191</a></p>
            <p>Tel: <a href="tel:02172370239" className="hover:text-blue-200 transition-colors duration-200"> 0217 2370239</a></p>
            <p className="mt-2">Email:</p>
            <a href="mailto:rldomte@gmail.com" className="block hover:text-blue-200 transition-colors duration-200">rldomte@gmail.com</a>
            <a href="mailto:lomatedinesh@gmail.com" className="block hover:text-blue-200 transition-colors duration-200">lomatedinesh@gmail.com</a>
          </address>
          <p className="mt-4 font-semibold text-blue-300">Total visitors</p>
          <p className="text-lg">100</p>
        </div>
      </div>

      {/* Copyright/Bottom Bar (optional, but good practice) */}
      <div className="mt-10  pt-6 border-t border-gray-700 text-center text-gray-400 mb-60 md:mb-0">
        <p>&copy; {new Date().getFullYear()} Solapurmall. All rights reserved.</p>
        <p className="text-xs mt-1"><b>Team SMIT:</b> Designed with <span role="img" aria-label="heart">❤️</span> in Solapur, Maharashtra</p>
      </div>
    </footer>
  );
};

export default Footer;