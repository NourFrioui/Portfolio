"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/utils/api";
import { useTranslations } from "../hooks/useTranslations";
import { getLocalizedText, getLocalizedArray } from "@/utils/localization";
import { Project, Technology, Tag } from "@/types";
import { Modal } from "./ui/Modal";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import {
  ExternalLink,
  Github,
  Calendar,
  Users,
  Target,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

const ProjectsUpdated: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [tech, setTech] = useState<string | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr">("en");
  const t = useTranslations();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, technologiesResponse, tagsResponse] =
          await Promise.all([
            api.get("/projects"),
            api.get("/technologies"),
            api.get("/tags"),
          ]);

        setProjects(projectsResponse.data);
        setTechnologies(technologiesResponse.data);
        setTags(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Simple fallback data
        setProjects([
          {
            _id: "1",
            title: { en: "E-Commerce Platform", fr: "Plateforme E-Commerce" },
            description: {
              en: "Full-stack e-commerce solution with payment integration",
              fr: "Solution e-commerce full-stack avec intégration de paiement",
            },
            technologyIds: [],
            tagIds: [],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            isFeatured: true,
            isActive: true,
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        setTechnologies([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const getProjectTechnologies = (project: Project) => {
    return technologies.filter((tech) =>
      project.technologyIds.includes(tech._id)
    );
  };

  const getProjectTags = (project: Project) => {
    return tags.filter((tag) => project.tagIds.includes(tag._id));
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.categoryId && set.add(p.categoryId));
    return Array.from(set);
  }, [projects]);

  const availableTechnologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      const projectTechs = getProjectTechnologies(p);
      projectTechs.forEach((t) =>
        set.add(getLocalizedText(t.name, currentLanguage))
      );
    });
    return Array.from(set);
  }, [projects, technologies, currentLanguage]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        getLocalizedText(p.title, currentLanguage)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        getLocalizedText(p.description, currentLanguage)
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory = category === "all" || p.categoryId === category;

      const projectTechs = getProjectTechnologies(p);
      const matchesTech =
        tech === "all" ||
        projectTechs.some(
          (t) => getLocalizedText(t.name, currentLanguage) === tech
        );

      return matchesSearch && matchesCategory && matchesTech;
    });
  }, [projects, search, category, tech, currentLanguage, technologies]);

  const openCaseStudy = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeCaseStudy = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
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

        {/* Language Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setCurrentLanguage("en")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === "en"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLanguage("fr")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLanguage === "fr"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Français
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={
                t("Projects.searchPlaceholder") || "Search projects..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Technologies</option>
              {availableTechnologies.map((techName) => (
                <option key={techName} value={techName}>
                  {techName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Projects.loading")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => {
              const projectTechnologies = getProjectTechnologies(project);
              const projectTags = getProjectTags(project);

              return (
                <Card
                  key={project._id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {project.imageUrl && (
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <img
                        src={project.imageUrl}
                        alt={getLocalizedText(project.title, currentLanguage)}
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

                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {getLocalizedText(project.title, currentLanguage)}
                      </h3>
                      <div className="flex gap-2">
                        {project.isFeatured && (
                          <Badge variant="primary" size="sm">
                            Featured
                          </Badge>
                        )}
                        {project.status && (
                          <Badge
                            variant={
                              project.status === "completed"
                                ? "success"
                                : project.status === "in-progress"
                                ? "warning"
                                : "default"
                            }
                            size="sm"
                          >
                            {getStatusTranslation(project.status)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {getLocalizedText(project.description, currentLanguage)}
                    </p>

                    {projectTechnologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {projectTechnologies.slice(0, 4).map((tech) => (
                          <Badge key={tech._id} variant="info" size="sm">
                            {getLocalizedText(tech.name, currentLanguage)}
                          </Badge>
                        ))}
                        {projectTechnologies.length > 4 && (
                          <Badge variant="default" size="sm">
                            +{projectTechnologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {projectTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {projectTags.slice(0, 3).map((tag) => (
                          <Badge key={tag._id} variant="secondary" size="sm">
                            {getLocalizedText(tag.name, currentLanguage)}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => openCaseStudy(project)}
                        className="w-full"
                        size="sm"
                      >
                        📖 {t("Projects.viewCaseStudy") || "View Case Study"}
                      </Button>

                      <div className="flex gap-2">
                        {project.liveUrl && project.liveUrl !== "#" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(project.liveUrl, "_blank")
                            }
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {t("Projects.liveDemo") || "Live Demo"}
                          </Button>
                        )}
                        {project.githubUrl && project.githubUrl !== "#" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(project.githubUrl, "_blank")
                            }
                          >
                            <Github className="w-4 h-4 mr-1" />
                            {t("Projects.sourceCode") || "Code"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Case Study Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeCaseStudy}
          size="xl"
          title={
            selectedProject
              ? getLocalizedText(selectedProject.title, currentLanguage)
              : ""
          }
        >
          {selectedProject && (
            <div className="max-h-[80vh] overflow-y-auto">
              {/* Project Header */}
              <div className="mb-6">
                {selectedProject.imageUrl && (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={selectedProject.imageUrl}
                      alt={getLocalizedText(
                        selectedProject.title,
                        currentLanguage
                      )}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.categoryId && (
                    <Badge variant="secondary">
                      {selectedProject.categoryId}
                    </Badge>
                  )}
                  {selectedProject.status && (
                    <Badge
                      variant={
                        selectedProject.status === "completed"
                          ? "success"
                          : selectedProject.status === "in-progress"
                          ? "warning"
                          : "default"
                      }
                    >
                      {getStatusTranslation(selectedProject.status)}
                    </Badge>
                  )}
                  {selectedProject.isFeatured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">
                  {getLocalizedText(
                    selectedProject.longDescription ||
                      selectedProject.description,
                    currentLanguage
                  )}
                </p>
              </div>

              {/* Technologies */}
              {getProjectTechnologies(selectedProject).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getProjectTechnologies(selectedProject).map((tech) => (
                      <Badge key={tech._id} variant="info">
                        {getLocalizedText(tech.name, currentLanguage)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {getProjectTags(selectedProject).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {getProjectTags(selectedProject).map((tag) => (
                      <Badge key={tag._id} variant="secondary">
                        {getLocalizedText(tag.name, currentLanguage)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                {selectedProject.liveUrl && selectedProject.liveUrl !== "#" && (
                  <Button
                    onClick={() =>
                      window.open(selectedProject.liveUrl, "_blank")
                    }
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("Projects.visitLive") || "Visit Live Site"}
                  </Button>
                )}
                {selectedProject.githubUrl &&
                  selectedProject.githubUrl !== "#" && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        window.open(selectedProject.githubUrl, "_blank")
                      }
                      className="flex-1"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {t("Projects.viewSource") || "View Source Code"}
                    </Button>
                  )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default ProjectsUpdated;
