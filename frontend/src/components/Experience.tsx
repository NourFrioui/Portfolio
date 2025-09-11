"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from '@/hooks/useTranslations';
import api from "@/utils/api";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
  tags?: string[];
  highlights?: string[];
  companyLogo?: string;
  location?: string;
  isCurrentJob?: boolean;
  type?: "fulltime" | "freelance" | "contract" | "internship";
  projectIds?: string[];
}

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const t = useTranslations();

  const buildAbsoluteUrl = (raw?: string | null) => {
    const u = (raw || '').trim();
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${API_BASE}${u}`;
    if (u.includes('uploads/')) return `${API_BASE}/${u}`;
    return `${API_BASE}/upload/${u}`;
  };

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
            company: "Tech Startup Inc.",
            position: "Senior Full Stack Developer",
            startDate: "2022-01-01",
            isCurrentJob: true,
            description: "Led development of scalable web applications using modern technologies.",
            technologies: ["React", "Node.js", "TypeScript", "MongoDB"],
            type: "fulltime",
            location: "Remote",
            highlights: [
              "Architected and built 3 major product features",
              "Reduced page load times by 40%",
              "Mentored 2 junior developers"
            ]
          },
          {
            _id: "2",
            company: "Digital Agency",
            position: "Frontend Developer",
            startDate: "2020-06-01",
            endDate: "2021-12-31",
            description: "Developed responsive websites and web applications for various clients.",
            technologies: ["React", "Vue.js", "SCSS", "WordPress"],
            type: "freelance",
            location: "Paris, France"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = useMemo(() => {
    if (filter === "all") return experiences;
    return experiences.filter(exp => exp.type === filter);
  }, [experiences, filter]);

  const experienceTypes = useMemo(() => {
    const types = new Set(experiences.map(exp => exp.type).filter(Boolean));
    return Array.from(types);
  }, [experiences]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const formatPeriod = (startDate: string, endDate?: string, isCurrentJob?: boolean) => {
    const start = formatDate(startDate);
    if (isCurrentJob || !endDate) return `${start} - Present`;
    return `${start} - ${formatDate(endDate)}`;
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "fulltime": return "Full-time";
      case "freelance": return "Freelance";
      case "contract": return "Contract";
      case "internship": return "Internship";
      default: return type;
    }
  };

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t("Experience.title") || "Professional Experience"}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t("Experience.subtitle") || "A timeline of roles highlighting impact, ownership and growth."}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={filter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({experiences.length})
          </Button>
          {experienceTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(type || "")}
            >
              {getTypeLabel(type)} ({experiences.filter(e => e.type === type).length})
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent"></div>
            
            <div className="space-y-8">
              {filteredExperiences.map((exp, index) => (
                <div key={exp._id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-4 ${exp.isCurrentJob ? 'bg-green-500 border-green-200' : 'bg-blue-500 border-blue-200'}`}></div>
                  </div>

                  {/* Experience card */}
                  <Card className="flex-1 group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        {exp.companyLogo && (
                          <img 
                            src={buildAbsoluteUrl(exp.companyLogo)} 
                            alt={`${exp.company} logo`} 
                            className="w-12 h-12 rounded-lg object-contain bg-white border shadow-sm" 
                          />
                        )}
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug">
                            {exp.position}
                          </h3>
                          <div className="text-blue-600 font-medium text-lg">{exp.company}</div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary" size="sm">
                              {formatPeriod(exp.startDate, exp.endDate, exp.isCurrentJob)}
                            </Badge>
                            {exp.isCurrentJob && (
                              <Badge variant="success" size="sm">Current</Badge>
                            )}
                            {exp.type && (
                              <Badge variant="info" size="sm">{getTypeLabel(exp.type)}</Badge>
                            )}
                            {exp.location && (
                              <Badge variant="default" size="sm">📍 {exp.location}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {exp.projectIds && exp.projectIds.length > 0 && (
                        <Link href={`/experience/${exp._id}`}>
                          <Button variant="ghost" size="sm">
                            View Projects →
                          </Button>
                        </Link>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-slate-700 mb-4 leading-relaxed">{exp.description}</p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-slate-900 mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {exp.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies?.map((tech, i) => (
                        <Badge key={i} variant="primary" size="sm">{tech}</Badge>
                      ))}
                      {exp.tags?.map((tag, i) => (
                        <Badge key={i} variant="default" size="sm">#{tag}</Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
