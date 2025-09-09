"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";

interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
  location?: string;
  current?: boolean;
}

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get("/experience");
        setExperiences(response.data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        // Fallback data
        setExperiences([
          {
            _id: "1",
            position: "Senior Full Stack Developer",
            company: "TechCorp Inc.",
            startDate: "2022-01-01",
            endDate: undefined,
            current: true,
            description:
              "Lead development of scalable web applications using React, Node.js, and cloud technologies.",
            technologies: ["React", "Node.js", "AWS", "TypeScript", "MongoDB"],
            location: "Remote",
          },
          {
            _id: "2",
            position: "Full Stack Developer",
            company: "StartupXYZ",
            startDate: "2020-01-01",
            endDate: "2022-01-01",
            description:
              "Built and maintained multiple client projects from conception to deployment.",
            technologies: ["Vue.js", "Express", "PostgreSQL", "Docker"],
            location: "San Francisco, CA",
          },
          {
            _id: "3",
            position: "Frontend Developer",
            company: "WebAgency",
            startDate: "2018-01-01",
            endDate: "2020-01-01",
            description:
              "Developed responsive web interfaces and improved user experience across various projects.",
            technologies: ["JavaScript", "CSS3", "HTML5", "jQuery"],
            location: "New York, NY",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatPeriod = (
    startDate: string,
    endDate?: string,
    current?: boolean
  ) => {
    const start = formatDate(startDate);
    if (current || !endDate) return `${start} - Present`;
    return `${start} - ${formatDate(endDate)}`;
  };

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A quick overview of my recent roles and responsibilities
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-lg text-blue-600 font-medium">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="text-sm text-gray-500">{exp.location}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full mt-2 md:mt-0">
                    {formatPeriod(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{exp.description}</p>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      Technologies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
