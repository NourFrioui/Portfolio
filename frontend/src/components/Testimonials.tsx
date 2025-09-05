"use client";

import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager at TechCorp',
      content: 'Exceptional work quality and attention to detail. Delivered our project ahead of schedule with outstanding results.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Startup Founder',
      content: 'Great communication and technical expertise. Helped us build our MVP from concept to launch.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Design Director',
      content: 'Perfect blend of technical skills and design sensibility. A pleasure to work with.',
      avatar: '👩‍🎨',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Feedback from amazing people I've had the pleasure to work with
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
