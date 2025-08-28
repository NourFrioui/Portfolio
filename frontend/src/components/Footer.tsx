"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold">Portfolio</div>
            <p className="mt-2 text-gray-400">
              Creating beautiful digital experiences
            </p>
          </div>

          <div className="flex space-x-6">
            {['twitter', 'github', 'linkedin', 'dribbble'].map((social, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;