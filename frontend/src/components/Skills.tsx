"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";

interface Technology {
  _id: string;
  name: string;
  category: string;
  percentage: number;
  iconUrl?: string;
}

const Skills: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await api.get("/technologies");
        setTechnologies(response.data);
      } catch (error) {
        console.error("Error fetching technologies:", error);
        // Fallback data
        setTechnologies([
          { _id: "1", name: "React", category: "Frontend", percentage: 90 },
          { _id: "2", name: "Next.js", category: "Frontend", percentage: 85 },
          {
            _id: "3",
            name: "TypeScript",
            category: "Frontend",
            percentage: 80,
          },
          { _id: "4", name: "Node.js", category: "Backend", percentage: 85 },
          { _id: "5", name: "Express", category: "Backend", percentage: 80 },
          { _id: "6", name: "MongoDB", category: "Database", percentage: 75 },
          { _id: "7", name: "Git", category: "Tools", percentage: 90 },
          { _id: "8", name: "Docker", category: "Tools", percentage: 70 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(technologies.map((tech) => tech.category))),
  ];
  const filteredTechnologies =
    activeFilter === "All"
      ? technologies
      : technologies.filter((tech) => tech.category === activeFilter);

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnologies.map((tech) => (
              <div
                key={tech._id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tech.name}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tech.category}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Proficiency</span>
                    <span>{tech.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${tech.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
