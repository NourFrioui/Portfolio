"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { useTranslations } from "../hooks/useTranslations";
import { Modal } from "./ui/Modal";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import { ExternalLink, Github, Calendar, Users, Target, Lightbulb, CheckCircle } from "lucide-react";

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
  // Extended fields for case study
  longDescription?: string;
  challenges?: string[];
  solutions?: string[];
  features?: string[];
  timeline?: {
    start: string;
    end?: string;
    duration?: string;
  };
  team?: {
    size: number;
    role: string;
  };
  results?: {
    metric: string;
    value: string;
  }[];
  gallery?: string[];
  clientTestimonial?: {
    text: string;
    author: string;
    position: string;
  };
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [tech, setTech] = useState<string | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback data with extended case study information
        setProjects([
          {
            _id: "1",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with payment integration",
            longDescription: "A comprehensive e-commerce platform built from scratch with modern technologies. Features include user authentication, product catalog, shopping cart, secure payment processing, order management, and admin dashboard. The platform handles thousands of products and processes hundreds of orders daily.",
            category: "Web Development",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis", "AWS"],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            featured: true,
            challenges: [
              "Implementing secure payment processing with multiple gateways",
              "Optimizing database queries for large product catalogs",
              "Building real-time inventory management",
              "Ensuring mobile responsiveness across all devices"
            ],
            solutions: [
              "Integrated Stripe and PayPal with robust error handling",
              "Implemented database indexing and query optimization",
              "Built WebSocket-based real-time updates",
              "Used responsive design principles and extensive testing"
            ],
            features: [
              "Multi-vendor marketplace support",
              "Advanced search and filtering",
              "Wishlist and comparison tools",
              "Order tracking and notifications",
              "Admin analytics dashboard",
              "Mobile-first responsive design"
            ],
            timeline: {
              start: "2023-01",
              end: "2023-06",
              duration: "6 months"
            },
            team: {
              size: 3,
              role: "Full-Stack Developer & Team Lead"
            },
            results: [
              { metric: "Performance Score", value: "95/100" },
              { metric: "Load Time", value: "< 2s" },
              { metric: "Conversion Rate", value: "+35%" },
              { metric: "User Satisfaction", value: "4.8/5" }
            ],
            clientTestimonial: {
              text: "The platform exceeded our expectations. The team delivered a robust, scalable solution that has significantly improved our online sales.",
              author: "Sarah Johnson",
              position: "CEO, TechStore"
            }
          },
          {
            _id: "2",
            title: "Task Management App",
            description: "Collaborative project management tool with real-time updates",
            longDescription: "A modern project management application designed for remote teams. Features real-time collaboration, task assignment, progress tracking, file sharing, and team communication. Built with scalability in mind to support teams of all sizes.",
            category: "Web Development",
            technologies: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io", "Prisma", "Tailwind"],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            featured: true,
            challenges: [
              "Real-time synchronization across multiple users",
              "Complex permission system for team roles",
              "Optimizing performance with large datasets",
              "Cross-browser compatibility for real-time features"
            ],
            solutions: [
              "Implemented WebSocket connections with Socket.io",
              "Built role-based access control system",
              "Used virtual scrolling and pagination",
              "Extensive browser testing and polyfills"
            ],
            features: [
              "Real-time collaboration",
              "Kanban and list views",
              "Time tracking and reporting",
              "File attachments and comments",
              "Team chat integration",
              "Mobile app companion"
            ],
            timeline: {
              start: "2023-03",
              end: "2023-08",
              duration: "5 months"
            },
            team: {
              size: 4,
              role: "Frontend Lead Developer"
            },
            results: [
              { metric: "Active Users", value: "2,500+" },
              { metric: "Task Completion", value: "+40%" },
              { metric: "Team Productivity", value: "+25%" },
              { metric: "User Retention", value: "85%" }
            ]
          },
          {
            _id: "3",
            title: "Weather Dashboard",
            description: "Beautiful weather app with location-based forecasts",
            longDescription: "An intuitive weather application providing accurate forecasts, interactive maps, and personalized weather alerts. Features include current conditions, 7-day forecasts, radar maps, and severe weather notifications.",
            category: "Web Development",
            technologies: ["React", "API Integration", "Chart.js", "CSS3", "PWA", "Geolocation"],
            liveUrl: "#",
            githubUrl: "#",
            status: "completed",
            featured: true,
            challenges: [
              "Integrating multiple weather APIs for accuracy",
              "Creating smooth animations for weather transitions",
              "Implementing offline functionality",
              "Optimizing for various screen sizes"
            ],
            solutions: [
              "Built API aggregation layer with fallback systems",
              "Used CSS animations and Framer Motion",
              "Implemented service worker for PWA capabilities",
              "Responsive design with mobile-first approach"
            ],
            features: [
              "Current weather conditions",
              "7-day detailed forecasts",
              "Interactive weather maps",
              "Severe weather alerts",
              "Location-based suggestions",
              "Offline mode support"
            ],
            timeline: {
              start: "2023-07",
              end: "2023-09",
              duration: "3 months"
            },
            team: {
              size: 2,
              role: "Solo Developer"
            },
            results: [
              { metric: "Accuracy Rate", value: "94%" },
              { metric: "App Store Rating", value: "4.7/5" },
              { metric: "Daily Active Users", value: "15K+" },
              { metric: "Load Speed", value: "1.2s" }
            ]
          }
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesTech =
        tech === "all" || (p.technologies && p.technologies.includes(tech));
      return matchesSearch && matchesCategory && matchesTech;
    });
  }, [projects, search, category, tech]);

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

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder={t("Projects.search", {
                default: "Search projects...",
              })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2 w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="all">
                {t("Projects.allCategories", { default: "All categories" })}
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white"
              value={tech}
              onChange={(e) => setTech(e.target.value as any)}
            >
              <option value="all">
                {t("Projects.allTechnologies", { default: "All technologies" })}
              </option>
              {technologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">{t("Projects.loading")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <Card
                key={project._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
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
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.featured && (
                        <Badge variant="primary" size="sm">
                          Featured
                        </Badge>
                      )}
                      {project.status && (
                        <Badge 
                          variant={
                            project.status === "completed" ? "success" :
                            project.status === "in-progress" ? "warning" : "default"
                          } 
                          size="sm"
                        >
                          {getStatusTranslation(project.status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {project.category && (
                    <Badge variant="secondary" size="sm" className="mb-3">
                      {project.category}
                    </Badge>
                  )}
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="info" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="default" size="sm">
                          +{project.technologies.length - 4} more
                        </Badge>
                      )}
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
                          onClick={() => window.open(project.liveUrl, '_blank')}
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
                          onClick={() => window.open(project.githubUrl, '_blank')}
                        >
                          <Github className="w-4 h-4 mr-1" />
                          {t("Projects.sourceCode") || "Code"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Case Study Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeCaseStudy}
          size="xl"
          title={selectedProject?.title}
        >
          {selectedProject && (
            <div className="max-h-[80vh] overflow-y-auto">
              {/* Project Header */}
              <div className="mb-6">
                {selectedProject.imageUrl && (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.category && (
                    <Badge variant="secondary">{selectedProject.category}</Badge>
                  )}
                  {selectedProject.status && (
                    <Badge 
                      variant={
                        selectedProject.status === "completed" ? "success" :
                        selectedProject.status === "in-progress" ? "warning" : "default"
                      }
                    >
                      {getStatusTranslation(selectedProject.status)}
                    </Badge>
                  )}
                  {selectedProject.featured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              {/* Project Stats */}
              {(selectedProject.timeline || selectedProject.team) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedProject.timeline && (
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Timeline</h4>
                      </div>
                      <p className="text-gray-600">
                        {selectedProject.timeline.start} - {selectedProject.timeline.end || "Present"}
                      </p>
                      {selectedProject.timeline.duration && (
                        <p className="text-sm text-gray-500">Duration: {selectedProject.timeline.duration}</p>
                      )}
                    </Card>
                  )}
                  
                  {selectedProject.team && (
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Team</h4>
                      </div>
                      <p className="text-gray-600">{selectedProject.team.size} members</p>
                      <p className="text-sm text-gray-500">Role: {selectedProject.team.role}</p>
                    </Card>
                  )}
                </div>
              )}

              {/* Technologies */}
              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <Badge key={index} variant="info">{tech}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {selectedProject.features && selectedProject.features.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Key Features</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProject.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(selectedProject.challenges || selectedProject.solutions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-gray-900">Challenges</h4>
                      </div>
                      <ul className="space-y-2">
                        {selectedProject.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">⚠</span>
                            <span className="text-gray-700">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedProject.solutions && selectedProject.solutions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-gray-900">Solutions</h4>
                      </div>
                      <ul className="space-y-2">
                        {selectedProject.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">💡</span>
                            <span className="text-gray-700">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Results */}
              {selectedProject.results && selectedProject.results.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Results & Impact</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProject.results.map((result, index) => (
                      <Card key={index} className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {result.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.metric}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Testimonial */}
              {selectedProject.clientTestimonial && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Client Feedback</h4>
                  <Card className="p-6 bg-blue-50">
                    <blockquote className="text-gray-700 italic mb-4">
                      "{selectedProject.clientTestimonial.text}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">
                        {selectedProject.clientTestimonial.author}
                      </div>
                      <div className="text-gray-600">
                        {selectedProject.clientTestimonial.position}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                {selectedProject.liveUrl && selectedProject.liveUrl !== "#" && (
                  <Button
                    onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("Projects.visitLive") || "Visit Live Site"}
                  </Button>
                )}
                {selectedProject.githubUrl && selectedProject.githubUrl !== "#" && (
                  <Button
                    variant="secondary"
                    onClick={() => window.open(selectedProject.githubUrl, '_blank')}
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

export default Projects;
