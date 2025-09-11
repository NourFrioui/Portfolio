"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Project = {
  _id?: string;
  title: string;
  description: string;
  detailedDescription?: string;
  categoryId?: string;
  imageUrl?: string;
  images?: string[];
  technologies?: string[];
  tags?: string[];
  status?: string;
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  projectUrl?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  order?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  timeline?: {
    start?: string;
    end?: string;
    duration?: string;
  };
  team?: {
    size?: number;
    role?: string;
  };
  results?: {
    metric: string;
    value: string;
  }[];
  projectType?: string;
};

type Category = {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    detailedDescription: "",
    categoryId: "",
    technologies: [],
    tags: [],
    status: "planning",
    startDate: "",
    endDate: "",
    githubUrl: "",
    projectUrl: "",
    features: [],
    challenges: [],
    solutions: [],
    images: [],
    order: 1,
    isFeatured: false,
    isActive: true,
    timeline: {
      start: "",
      end: "",
      duration: "",
    },
    team: {
      size: 1,
      role: "",
    },
    results: [],
    projectType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchProjects = async () => {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    setProjects(data);
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/tags`);
      const data = await res.json();
      const names: string[] = (data || []).map((t: any) => (typeof t === 'string' ? t : t.name)).filter(Boolean);
      setAllTags(names);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const res = await fetch(`${API_BASE}/technologies`);
      const data = await res.json();
      // Expecting array of objects with name field or plain strings
      const names: string[] = (data || []).map((t: any) => (typeof t === 'string' ? t : t.name)).filter(Boolean);
      setAllTechnologies(names);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data.filter((cat: Category) => cat.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    fetchTechnologies();
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = editingProject 
        ? `${API_BASE}/projects/${editingProject._id}`
        : `${API_BASE}/projects`;
      const method = editingProject ? "PATCH" : "POST";
      // Build a safe payload with only allowed fields (DTO)
      const isValidHttpUrl = (value?: string): boolean => {
        try {
          if (!value) return false;
          const url = new URL(value);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      };
      const normalizeUrl = (u?: string) => {
        const abs = buildAbsoluteUrl(u);
        return isValidHttpUrl(abs) ? abs : undefined;
      };
      let payload: any = {
        title: formData.title,
        description: formData.description,
        detailedDescription: formData.detailedDescription || undefined,
        categoryId: formData.categoryId || undefined,
        imageUrl: normalizeUrl(formData.imageUrl),
        images: (formData.images || []).map((x) => normalizeUrl(x)).filter(Boolean) as string[],
        technologies: formData.technologies || [],
        tags: formData.tags || [],
        status: formData.status || undefined,
        githubUrl: normalizeUrl(formData.githubUrl) || undefined,
        projectUrl: normalizeUrl(formData.projectUrl) || undefined,
        features: formData.features || [],
        challenges: formData.challenges || [],
        solutions: formData.solutions || [],
        order: formData.order || 1,
        isFeatured: formData.isFeatured || false,
        isActive: formData.isActive !== false,
        timeline: formData.timeline || undefined,
        team: formData.team || undefined,
        results: formData.results || undefined,
        projectType: formData.projectType || undefined,
      };
      if (!payload.imageUrl) delete payload.imageUrl;
      // Debug: Inspect final payload (remove for production if desired)
      console.debug('[AdminProjects] submitting payload', payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(`Failed to ${editingProject ? 'update' : 'add'} project`);
      
      resetForm();
      setShowModal(false);
      await fetchProjects();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      detailedDescription: "",
      categoryId: "",
      technologies: [],
      tags: [],
      status: "planning",
      startDate: "",
      endDate: "",
      githubUrl: "",
      projectUrl: "",
      features: [],
      challenges: [],
      solutions: [],
      images: [],
      order: projects.length + 1,
      isFeatured: false,
      isActive: true
    });
    setEditingProject(null);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Images handling
  const buildAbsoluteUrl = (raw?: string | null) => {
    const u = (raw || '').trim();
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${API_BASE}${u}`;
    // handle common backend return shapes
    if (u.includes('uploads/')) return `${API_BASE}/${u}`; // served statically
    // assume it's a filename under /upload/:filename
    return `${API_BASE}/upload/${u}`;
  };

  const handleImagesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      try {
        const res = await fetch(`${API_BASE}/upload/image`, { method: 'POST', body, headers: { Authorization: `Bearer ${token || ''}` } });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        let finalUrl = '';
        if (data?.url) finalUrl = buildAbsoluteUrl(data.url);
        else if (data?.filename) finalUrl = buildAbsoluteUrl(data.filename);
        else if (data?.path) finalUrl = buildAbsoluteUrl(data.path);
        if (finalUrl) newUrls.push(finalUrl);
      } catch (err) {
        console.error('Image upload error:', err);
      }
    }
    const merged = [...(formData.images || []), ...newUrls.filter(Boolean)];
    setFormData({ ...formData, images: merged, imageUrl: formData.imageUrl || merged[0] });
  };

  const removeImageAt = (idx: number) => {
    const next = (formData.images || []).filter((_, i) => i !== idx);
    const nextMain = formData.imageUrl && formData.imageUrl === formData.images?.[idx]
      ? (next[0] || '')
      : formData.imageUrl;
    setFormData({ ...formData, images: next, imageUrl: nextMain });
  };

  const setMainImage = (url: string) => setFormData({ ...formData, imageUrl: url });

  // Tags handling
  const [tagInput, setTagInput] = useState('');
  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    const exists = (formData.tags || []).includes(value);
    if (!exists) setFormData({ ...formData, tags: [ ...(formData.tags || []), value ] });
    setTagInput('');
  };
  const removeTag = (value: string) => {
    setFormData({ ...formData, tags: (formData.tags || []).filter(t => t !== value) });
  };

  const deleteProject = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      await fetchProjects();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects Management</h1>
            <p className="text-slate-600 mt-1">Manage your portfolio projects</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Project
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="modern-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                  {project.categoryId && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                      {categories.find(cat => cat._id === project.categoryId)?.name || 'Unknown Category'}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(project)}
                    className="text-indigo-600 hover:text-indigo-700 p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {project.status && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'completed' ? 'bg-green-100 text-green-700' :
                    project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cover Image URL (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cover Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://your-cdn.com/cover.png or /uploads/cover.png or filename.png"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      You can paste an external URL, a server path (starting with /uploads/...), or select a main image below.
                    </p>
                    {formData.imageUrl && (
                      <div className="mt-2 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={buildAbsoluteUrl(formData.imageUrl)}
                          alt="cover-preview"
                          className="w-20 h-20 object-cover rounded border border-slate-200"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Project Images */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImagesSelected(e.target.files)}
                      className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {(formData.images && formData.images.length > 0) && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {formData.images!.map((url, idx) => (
                          <div key={idx} className={`relative rounded-lg overflow-hidden border ${formData.imageUrl === url ? 'border-indigo-500' : 'border-slate-200'}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`image-${idx}`} className="w-full h-28 object-cover" />
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent flex justify-between gap-2">
                              <button type="button" onClick={() => setMainImage(url)} className="text-xs px-2 py-1 rounded bg-white/90 hover:bg-white">
                                {formData.imageUrl === url ? 'Main' : 'Set Main'}
                              </button>
                              <button type="button" onClick={() => removeImageAt(idx)} className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tags multi-select (preset only) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                    {/* Preset tags as selectable chips */}
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 border border-slate-300 rounded-lg p-3">
                        {allTags.map((tag) => {
                          const selected = (formData.tags || []).includes(tag);
                          return (
                            <button
                              type="button"
                              key={tag}
                              onClick={() => {
                                const set = new Set(formData.tags || []);
                                if (set.has(tag)) set.delete(tag); else set.add(tag);
                                setFormData({ ...formData, tags: Array.from(set) });
                              }}
                              className={`px-3 py-1 rounded-full text-sm border transition-colors ${selected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {/* Manual add removed as requested */}
                  </div>

                  {/* Technologies multi-select */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Technologies</label>
                    <div className="flex flex-wrap gap-2 border border-slate-300 rounded-lg p-3">
                      {allTechnologies.map((tech) => {
                        const selected = (formData.technologies || []).includes(tech);
                        return (
                          <button
                            type="button"
                            key={tech}
                            onClick={() => {
                              const set = new Set(formData.technologies || []);
                              if (set.has(tech)) set.delete(tech); else set.add(tech);
                              setFormData({ ...formData, technologies: Array.from(set) });
                            }}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${selected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timeline</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="date"
                        placeholder="Start"
                        value={formData.timeline?.start || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: { ...formData.timeline, start: e.target.value } })
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="date"
                        placeholder="End"
                        value={formData.timeline?.end || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: { ...formData.timeline, end: e.target.value } })
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 3 months)"
                        value={formData.timeline?.duration || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: { ...formData.timeline, duration: e.target.value } })
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Team</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Team size"
                        value={formData.team?.size || 1}
                        onChange={(e) =>
                          setFormData({ ...formData, team: { ...formData.team, size: parseInt(e.target.value) || 1 } })
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Your role"
                        value={formData.team?.role || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, team: { ...formData.team, role: e.target.value } })
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Results (metrics)</label>
                    {(formData.results || []).map((res, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Metric (e.g. Users)"
                          value={res.metric}
                          onChange={(e) => {
                            const next = [...(formData.results || [])];
                            next[idx].metric = e.target.value;
                            setFormData({ ...formData, results: next });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 1,000+)"
                          value={res.value}
                          onChange={(e) => {
                            const next = [...(formData.results || [])];
                            next[idx].value = e.target.value;
                            setFormData({ ...formData, results: next });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, results: (formData.results || []).filter((_, i) => i !== idx) })}
                          className="px-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, results: [...(formData.results || []), { metric: '', value: '' }] })}
                      className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
                    >
                      + Add Result
                    </button>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Type</label>
                    <input
                      type="text"
                      value={formData.projectType || ''}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      placeholder="e.g. Mobile App, Web App, Backend Service"
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={2}
                      placeholder="Brief description for project cards"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      value={formData.detailedDescription || ''}
                      onChange={(e) => setFormData({...formData, detailedDescription: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={4}
                      placeholder="Detailed description for project details page"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status || 'planning'}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="planning">Planning</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl || ''}
                        onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Live Project URL
                      </label>
                      <input
                        type="url"
                        value={formData.projectUrl || ''}
                        onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order || 1}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured || false}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-slate-700">
                        Featured Project
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive !== false}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-700">
                        Active/Published
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Features (one per line)
                    </label>
                    <textarea
                      value={formData.features?.join('\n') || ''}
                      onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim())})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Feature 1\nFeature 2\nFeature 3"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Challenges (one per line)
                      </label>
                      <textarea
                        value={formData.challenges?.join('\n') || ''}
                        onChange={(e) => setFormData({...formData, challenges: e.target.value.split('\n').filter(c => c.trim())})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        placeholder="Challenge 1\nChallenge 2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Solutions (one per line)
                      </label>
                      <textarea
                        value={formData.solutions?.join('\n') || ''}
                        onChange={(e) => setFormData({...formData, solutions: e.target.value.split('\n').filter(s => s.trim())})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        placeholder="Solution 1\nSolution 2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
