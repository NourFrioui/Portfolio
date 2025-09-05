"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Project = {
  _id?: string;
  title: string;
  description: string;
  category?: string;
  imageUrl?: string;
  technologies?: string[];
  status?: string;
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  features?: string[];
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    category: "",
    technologies: [],
    status: "planning",
    startDate: "",
    endDate: "",
    githubUrl: "",
    liveUrl: "",
    features: [],
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

  useEffect(() => {
    fetchProjects();
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
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
      category: "",
      technologies: [],
      status: "planning",
      startDate: "",
      endDate: "",
      githubUrl: "",
      liveUrl: "",
      features: [],
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
                  {project.category && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                      {project.category}
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
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      required
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
