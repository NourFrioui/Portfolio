"use client";

import React, { useEffect, useState } from "react";

type Technology = {
  _id: string;
  name: string;
  percentage: number;
  iconUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const Skills = () => {
  const [skills, setSkills] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const res = await fetch(`${API_BASE}/technologies`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load skills");
        const data = await res.json();
        setSkills(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, []);

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Skills
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {skills.map((skill) => (
            <div key={skill._id}>
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

        {!!skills.length && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900">{skill.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
