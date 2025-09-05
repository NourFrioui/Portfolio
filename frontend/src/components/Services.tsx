"use client";

import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Web Development',
      description: 'Full-stack web applications using modern technologies',
      icon: '🌐',
      features: ['React/Next.js', 'Node.js/Express', 'Database Design', 'API Development']
    },
    {
      title: 'Mobile Development',
      description: 'Cross-platform mobile applications',
      icon: '📱',
      features: ['React Native', 'Flutter', 'iOS/Android', 'App Store Deployment']
    },
    {
      title: 'UI/UX Design',
      description: 'User-centered design and prototyping',
      icon: '🎨',
      features: ['Figma/Sketch', 'Prototyping', 'User Research', 'Design Systems']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What I Do
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Services I offer to help bring your ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
