"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Technology = {
  _id?: string;
  name: string;
  percentage: number;
  iconUrl?: string;
  category?: string;
  description?: string;
};

export default function AdminTechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState<Technology>({
    name: "",
    percentage: 50,
    category: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchTechnologies = async () => {
    const res = await fetch(`${API_BASE}/technologies`);
    const data = await res.json();
    setTechnologies(data);
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = editingTech 
        ? `${API_BASE}/technologies/${editingTech._id}`
        : `${API_BASE}/technologies`;
      const method = editingTech ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Failed to ${editingTech ? 'update' : 'add'} technology`);
      
      resetForm();
      setShowModal(false);
      await fetchTechnologies();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      percentage: 50,
      category: "",
      description: "",
    });
    setEditingTech(null);
  };

  const openModal = (tech?: Technology) => {
    if (tech) {
      setEditingTech(tech);
      setFormData(tech);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const deleteTechnology = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/technologies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete technology");
      await fetchTechnologies();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const categories = ["Frontend", "Backend", "Database", "Tools", "Design", "Mobile"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Technologies & Skills</h1>
            <p className="text-slate-600 mt-1">Manage your technical skills and expertise levels</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Technology
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div key={tech._id} className="modern-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{tech.name}</h3>
                  {tech.description && (
                    <p className="text-slate-600 text-sm mb-3">{tech.description}</p>
                  )}
                  {tech.category && (
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full mb-3">
                      {tech.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(tech)}
                    className="text-purple-600 hover:text-purple-700 p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTechnology(tech._id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Proficiency</span>
                  <span className="font-medium text-slate-900">{tech.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${tech.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingTech ? 'Edit Technology' : 'Add New Technology'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Technology Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Proficiency Level: {formData.percentage}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.percentage}
                      onChange={(e) => setFormData({...formData, percentage: Number(e.target.value)})}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows={2}
                      placeholder="Brief description of your experience..."
                    />
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
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingTech ? 'Update Technology' : 'Add Technology'}
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
