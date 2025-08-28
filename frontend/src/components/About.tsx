"use client";

import React from "react";

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center text-gray-500">
              About Image
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              I&apos;m a passionate designer & developer
            </h3>
            <p className="text-gray-600 mb-6">
              With over 5 years of experience in web design and development, I
              specialize in creating beautiful, functional websites and
              applications that provide excellent user experiences.
            </p>
            <p className="text-gray-600 mb-6">
              My approach combines creative design with technical expertise to
              deliver solutions that not only look great but also perform
              exceptionally well across all devices and platforms.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h4 className="font-bold text-gray-900">Name:</h4>
                <p className="text-gray-600">Alex Morgan</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Email:</h4>
                <p className="text-gray-600">alex@example.com</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Age:</h4>
                <p className="text-gray-600">28</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">From:</h4>
                <p className="text-gray-600">New York, USA</p>
              </div>
            </div>

            <a
              href="#"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
