"use client";

import React from 'react';

const Skills = () => {
  const skills = [
    { id: 1, name: "UI/UX Design", percentage: 90 },
    { id: 2, name: "Web Development", percentage: 85 },
    { id: 3, name: "Mobile Apps", percentage: 75 },
    { id: 4, name: "Graphic Design", percentage: 80 },
  ];

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">My Skills</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="text-gray-600">{skill.percentage}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${skill.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {["HTML", "CSS", "JavaScript", "React", "Node.js", "Python", "Figma", "Photoshop"].map(
            (tech, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900">{tech}</h3>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;