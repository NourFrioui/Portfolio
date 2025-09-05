"use client";

import React from 'react';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      period: '2022 - Present',
      description: 'Lead development of scalable web applications using React, Node.js, and cloud technologies.',
      technologies: ['React', 'Node.js', 'AWS', 'TypeScript', 'MongoDB']
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2020 - 2022',
      description: 'Built and maintained multiple client projects from conception to deployment.',
      technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Docker']
    },
    {
      title: 'Frontend Developer',
      company: 'WebAgency',
      period: '2018 - 2020',
      description: 'Developed responsive web interfaces and improved user experience across various projects.',
      technologies: ['JavaScript', 'CSS3', 'HTML5', 'jQuery']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Work Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            My professional journey and the experiences that shaped my skills
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full mt-2 md:mt-0">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
