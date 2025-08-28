"use client";

import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Hi, I&apos;m <span className="text-blue-600">Alex</span>
              <br />
              Creative Designer
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              I create beautiful, functional websites and applications with a focus on user experience and modern design principles.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium py-3 px-8 rounded-full transition-colors duration-300"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                  Profile Image
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white py-2 px-6 rounded-full font-medium">
                5+ Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;