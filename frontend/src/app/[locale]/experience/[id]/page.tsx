"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Exp = {
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
};

function buildAbsoluteUrl(raw?: string | null) {
  const u = (raw || "").trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  if (u.includes("uploads/")) return `${API_BASE}/${u}`;
  return `${API_BASE}/upload/${u}`;
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? dateString
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function ExperienceDetail({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const [exp, setExp] = useState<Exp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/experience/${params.id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load experience");
        const data = await res.json();
        setExp(data);
        // Fetch related projects titles if any
        if (data?.projectIds?.length) {
          const pres = await fetch(`${API_BASE}/projects`, { cache: "no-store" });
          const plist = await pres.json();
          const ids = new Set<string>(data.projectIds.map((x: any) => (typeof x === 'string' ? x : x?._id)));
          const rel = (plist || [])
            .filter((p: any) => p?._id && ids.has(p._id))
            .map((p: any) => ({ _id: p._id, title: p.title }));
          setRelated(rel);
        } else {
          setRelated([]);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const period = exp ? `${formatDate(exp.startDate)} - ${exp.isCurrentJob || !exp.endDate ? t('Experience.present') : formatDate(exp.endDate)}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-90" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
          <div className="flex items-start gap-4">
            {exp?.companyLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={buildAbsoluteUrl(exp.companyLogo)}
                alt={`${exp.company} logo`}
                className="w-16 h-16 rounded-md object-contain bg-white/10 backdrop-blur border border-white/20"
              />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                {exp?.position || (loading ? t('Experience.details.loading') : t('Experience.title'))}
              </h1>
              <div className="mt-1 text-blue-100">
                {exp?.company}
                {exp?.location ? ` • ${exp.location}` : ""}
              </div>
              {exp && (
                <div className="mt-2 inline-flex items-center text-xs bg-white/10 text-white px-2 py-1 rounded-full border border-white/20">
                  {period}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <p className="text-center text-slate-600 mt-4">{t('Experience.details.loading')}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {t('Experience.details.error')}: {error}
          </div>
        )}

        {exp && (
          <div className="space-y-8">
            {exp.description && (
              <section className="translate-y-0 opacity-100 transition-all duration-300">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('Experience.overview')}</h2>
                <p className="text-slate-700 leading-relaxed">{exp.description}</p>
              </section>
            )}

            {exp.highlights && exp.highlights.length > 0 && (
              <section className="translate-y-0 opacity-100 transition-all duration-300">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('Experience.highlights')}</h2>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Experience.technologies')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {exp.tags && exp.tags.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Experience.tags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {related.length > 0 && (
              <section className="mt-2">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">{t('Experience.relatedProjects')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((p) => (
                    <Link
                      key={p._id}
                      href={`/projects/${p._id}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5"
                    >
                      <div className="text-slate-900 font-medium">{p.title}</div>
                      <div className="text-blue-600 text-sm mt-1">{t('Experience.viewProject')} →</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="pt-2">
              <Link href="#" onClick={() => history.back()} className="text-blue-600 hover:text-blue-700 text-sm">
                {t('Experience.back')}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
