"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { useTranslations } from "../hooks/useTranslations";

interface Project {
  _id: string;
  title: string;
  description: string;
  category?: string;
  imageUrl?: string;
  technologies?: string[];
  status?: string;
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback data
        setProjects([
          {
            _id: "1",
            title: "E-Commerce Platform",
            description:
              "Full-stack e-commerce solution with payment integration",
            category: "Web Development",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            featured: true,
          },
          {
            _id: "2",
            title: "Task Management App",
            description:
              "Collaborative project management tool with real-time updates",
            category: "Web Development",
            technologies: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io"],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            featured: true,
          },
          {
            _id: "3",
            title: "Weather Dashboard",
            description: "Beautiful weather app with location-based forecasts",
            category: "Web Development",
            technologies: ["React", "API Integration", "Chart.js", "CSS3"],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            featured: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "completed":
        return t("Projects.completed");
      case "in-progress":
        return t("Projects.inProgress");
      case "planning":
        return t("Projects.planning");
      case "on-hold":
        return t("Projects.onHold");
      default:
        return status;
    }
  };

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("Projects.featuredTitle")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("Projects.featuredSubtitle")}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Projects.loading")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {project.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {!project.imageUrl && (
                    <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-4xl mb-4">
                      🚀
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      <Link href={`/projects/${project._id}`} className="hover:text-blue-600 transition-colors">
                        {project.title}
                      </Link>
                    </h3>
                    {project.status && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : project.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusTranslation(project.status)}
                      </span>
                    )}
                  </div>
                  {project.category && (
                    <p className="text-sm text-blue-600 mb-2">
                      {project.category}
                    </p>
                  )}
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mb-4">
                    <Link href={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {t("Projects.viewDetails")}
                    </Link>
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm text-gray-700 font-medium">
                        {t("Projects.technologies")}
                      </span>
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-4">
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {t("Projects.liveDemo")}
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        {t("Projects.sourceCode")}
                      </a>
                    )}
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

export default Projects;
