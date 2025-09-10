"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useTranslations } from "../hooks/useTranslations";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface Technology {
  _id: string;
  name: string;
  category: string;
  percentage: number;
  iconUrl?: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  description?: string;
}

const Skills: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const t = useTranslations();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await api.get("/technologies");
        setTechnologies(response.data);
      } catch (error) {
        console.error("Error fetching technologies:", error);
        // Fallback data
        setTechnologies([
          { 
            _id: "1", 
            name: "React", 
            category: "Frontend", 
            percentage: 90, 
            level: "expert",
            yearsOfExperience: 4,
            description: "Advanced React patterns, hooks, context, performance optimization"
          },
          { 
            _id: "2", 
            name: "Next.js", 
            category: "Frontend", 
            percentage: 85,
            level: "advanced",
            yearsOfExperience: 3,
            description: "SSR, SSG, API routes, deployment optimization"
          },
          {
            _id: "3",
            name: "TypeScript",
            category: "Frontend",
            percentage: 80,
            level: "advanced",
            yearsOfExperience: 3,
            description: "Type safety, generics, advanced patterns"
          },
          { 
            _id: "4", 
            name: "Node.js", 
            category: "Backend", 
            percentage: 85,
            level: "advanced",
            yearsOfExperience: 4,
            description: "RESTful APIs, microservices, performance tuning"
          },
          { 
            _id: "5", 
            name: "Express", 
            category: "Backend", 
            percentage: 80,
            level: "advanced",
            yearsOfExperience: 3,
            description: "Middleware, authentication, API design"
          },
          { 
            _id: "6", 
            name: "MongoDB", 
            category: "Database", 
            percentage: 75,
            level: "intermediate",
            yearsOfExperience: 2,
            description: "Schema design, aggregation, indexing"
          },
          { 
            _id: "7", 
            name: "Git", 
            category: "Tools", 
            percentage: 90,
            level: "expert",
            yearsOfExperience: 5,
            description: "Version control, branching strategies, CI/CD"
          },
          { 
            _id: "8", 
            name: "Docker", 
            category: "Tools", 
            percentage: 70,
            level: "intermediate",
            yearsOfExperience: 2,
            description: "Containerization, multi-stage builds, orchestration"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Create category mapping for translations
  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "All": t("Skills.all") || "All",
      "Frontend": t("Skills.frontend") || "Frontend",
      "Backend": t("Skills.backend") || "Backend",
      "Database": t("Skills.database") || "Database",
      "Tools": t("Skills.tools") || "Tools",
      "Design": t("Skills.design") || "Design",
    };
    return categoryMap[category] || category;
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "expert": return "success";
      case "advanced": return "primary";
      case "intermediate": return "warning";
      case "beginner": return "secondary";
      default: return "default";
    }
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case "expert": return "Expert";
      case "advanced": return "Advanced";
      case "intermediate": return "Intermediate";
      case "beginner": return "Beginner";
      default: return level;
    }
  };

  const getTechIcon = (name: string) => {
    const icons: { [key: string]: string } = {
      "React": "⚛️",
      "Next.js": "▲",
      "TypeScript": "🔷",
      "Node.js": "🟢",
      "Express": "🚂",
      "MongoDB": "🍃",
      "Git": "📝",
      "Docker": "🐳",
      "JavaScript": "💛",
      "Python": "🐍",
      "Vue.js": "💚",
      "Angular": "🔺",
      "PostgreSQL": "🐘",
      "MySQL": "🐬",
      "Redis": "🔴",
      "AWS": "☁️",
      "Firebase": "🔥",
      "Figma": "🎨",
      "Photoshop": "🖼️"
    };
    return icons[name] || "💻";
  };

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
            {t("Skills.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("Skills.subtitle")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(category)}
            >
              {getCategoryTranslation(category)} ({category === "All" ? technologies.length : technologies.filter(t => t.category === category).length})
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Skills.loading") || "Loading skills..."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnologies.map((tech) => (
              <Card
                key={tech._id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTechIcon(tech.name)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tech.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" size="sm">
                          {getCategoryTranslation(tech.category)}
                        </Badge>
                        {tech.level && (
                          <Badge variant={getLevelColor(tech.level) as any} size="sm">
                            {getLevelLabel(tech.level)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {tech.yearsOfExperience && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{tech.yearsOfExperience}+</div>
                      <div className="text-xs text-gray-500">years</div>
                    </div>
                  )}
                </div>

                {tech.description && (
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {tech.description}
                  </p>
                )}

                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{t("Skills.proficiency") || "Proficiency"}</span>
                    <span className="font-medium">{tech.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        tech.percentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        tech.percentage >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        tech.percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}
                      style={{ width: `${tech.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                  <div className="text-xs text-gray-500 text-center">
                    Click to see projects using {tech.name}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
