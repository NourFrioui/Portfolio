"use client";

import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { id: 1, label: "Home", href: "#home" },
    { id: 2, label: "About", href: "#about" },
    { id: 3, label: "Skills", href: "#skills" },
    { id: 4, label: "Projects", href: "#projects" },
    { id: 5, label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-800">Portfolio</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Contact/Login Buttons */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
            >
              Contact Me
            </a>
            <a
              href="/admin/login"
              className="ml-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-full transition-colors duration-300"
            >
              Admin Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full text-center transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Me
              </a>
              <a
                href="/admin/login"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-full text-center transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
