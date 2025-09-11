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
  categoryId?: {
    _id: string;
    name: string;
  };
  percentage: number;
  icon?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
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
            categoryId: { _id: "cat1", name: "Frontend" }, 
            percentage: 90, 
            description: "Advanced React patterns, hooks, context, performance optimization"
          },
          { 
            _id: "2", 
            name: "Next.js", 
            categoryId: { _id: "cat1", name: "Frontend" }, 
            percentage: 85,
            description: "SSR, SSG, API routes, deployment optimization"
          },
          {
            _id: "3",
            name: "TypeScript",
            categoryId: { _id: "cat1", name: "Frontend" },
            percentage: 80,
            description: "Type safety, generics, advanced patterns"
          },
          { 
            _id: "4", 
            name: "Node.js", 
            categoryId: { _id: "cat2", name: "Backend" }, 
            percentage: 85,
            description: "RESTful APIs, microservices, performance tuning"
          },
          { 
            _id: "5", 
            name: "Express", 
            categoryId: { _id: "cat2", name: "Backend" }, 
            percentage: 80,
            description: "Middleware, authentication, API design"
          },
          { 
            _id: "6", 
            name: "MongoDB", 
            categoryId: { _id: "cat3", name: "Database" }, 
            percentage: 75,
            description: "Schema design, aggregation, indexing"
          },
          { 
            _id: "7", 
            name: "Git", 
            categoryId: { _id: "cat4", name: "Tools" }, 
            percentage: 90,
            description: "Version control, branching strategies, CI/CD"
          },
          { 
            _id: "8", 
            name: "Docker", 
            categoryId: { _id: "cat4", name: "Tools" }, 
            percentage: 70,
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

  const getLevelColor = (percentage: number) => {
    if (percentage >= 90) return "success";
    if (percentage >= 75) return "primary";
    if (percentage >= 50) return "warning";
    return "secondary";
  };

  const getLevelLabel = (percentage: number) => {
    if (percentage >= 90) return "Expert";
    if (percentage >= 75) return "Advanced";
    if (percentage >= 50) return "Intermediate";
    return "Beginner";
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
    ...Array.from(
      new Set(
        technologies
          .map((tech) => tech.categoryId?.name)
          .filter((name): name is string => typeof name === 'string' && name.length > 0)
      )
    ),
  ];
  const filteredTechnologies =
    activeFilter === "All"
      ? technologies
      : technologies.filter((tech) => tech.categoryId?.name === activeFilter);

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

        {/* Enhanced Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">
                {getCategoryTranslation(category)} ({category === "All" ? technologies.length : technologies.filter(t => t.categoryId?.name === category).length})
              </span>
              {activeFilter === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              )}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Skills.loading") || "Loading skills..."}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Skills Container with Scrollable Grid */}
            <div 
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 rounded-lg"
              style={{ 
                maxHeight: '600px', // Height for exactly 2 rows of 3 items each
                scrollBehavior: 'smooth'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                {filteredTechnologies.map((tech, index) => (
                  <Card
                    key={tech._id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 bg-white border border-gray-200 hover:border-blue-300"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {tech.icon ? (
                            <img 
                              src={tech.icon} 
                              alt={`${tech.name} icon`} 
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                (e.currentTarget as HTMLImageElement).nextElementSibling!.textContent = getTechIcon(tech.name);
                              }}
                            />
                          ) : (
                            getTechIcon(tech.name)
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tech.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" size="sm" className="text-xs">
                              {getCategoryTranslation(tech.categoryId?.name || "Other")}
                            </Badge>
                            <Badge variant={getLevelColor(tech.percentage) as any} size="sm" className="text-xs">
                              {getLevelLabel(tech.percentage)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 group-hover:text-purple-600 transition-colors">
                          {tech.percentage}%
                        </div>
                        <div className="text-xs text-gray-500">proficiency</div>
                      </div>
                    </div>

                    {tech.description && (
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {tech.description}
                      </p>
                    )}

                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                            tech.percentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            tech.percentage >= 75 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                            tech.percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          style={{ width: `${tech.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Enhanced Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2 transform translate-y-2 group-hover:translate-y-0">
                      <div className="text-xs text-gray-500 text-center bg-gray-50 rounded-lg py-2 px-3">
                        💡 Click to see projects using {tech.name}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Scroll Indicators */}
            {filteredTechnologies.length > 6 && (
              <div className="flex justify-center mt-6 space-x-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Scroll to see more skills</span>
                  <svg className="w-4 h-4 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            )}

            {/* Skills Count Display */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {filteredTechnologies.length} skill{filteredTechnologies.length !== 1 ? 's' : ''} 
                {activeFilter !== "All" && ` in ${getCategoryTranslation(activeFilter)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb {
          background-color: #3b82f6;
          border-radius: 6px;
        }
        
        .scrollbar-track-gray-200::-webkit-scrollbar-track {
          background-color: #e5e7eb;
          border-radius: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Skills;
