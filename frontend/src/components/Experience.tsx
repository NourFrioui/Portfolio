"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from '@/hooks/useTranslations';
import api from "@/utils/api";

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
  current?: boolean;
}

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const formatPeriod = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    if (current || !endDate) return `${start} - Present`;
    return `${start} - ${formatDate(endDate)}`;
  };

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Professional Experience</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">A selection of roles highlighting impact, ownership and growth.</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp._id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {exp.companyLogo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={buildAbsoluteUrl(exp.companyLogo)} alt={`${exp.company} logo`} className="w-12 h-12 rounded-md object-contain bg-white border" />
                      )}
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug">{exp.position}</h3>
                        <div className="text-blue-600 font-medium">{exp.company}</div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="inline-flex items-center bg-slate-100 px-2 py-0.5 rounded-full">{formatPeriod(exp.startDate, exp.endDate, exp.current)}</span>
                          {exp.location && <span>• {exp.location}</span>}
                        </div>
                      </div>
                    </div>
                    <Link href={`/experience/${exp._id}`} className="text-sm text-blue-600 hover:text-blue-700">View details →</Link>
                  </div>

                  {exp.description && (
                    <p className="text-slate-700 mt-4 leading-relaxed">{exp.description}</p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-6 mt-4 space-y-1 text-slate-700">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">{tech}</span>
                        ))}
                      </div>
                    )}
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border">#{tag}</span>
                        ))}
                      </div>
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

export default Experience;
