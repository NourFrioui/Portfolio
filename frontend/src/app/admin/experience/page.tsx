"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Experience = {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
  location?: string;
  isCurrentJob?: boolean;
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Experience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: [],
    location: "",
    isCurrentJob: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_BASE}/experience`);
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = editingExperience 
        ? `${API_BASE}/experience/${editingExperience._id}`
        : `${API_BASE}/experience`;
      const method = editingExperience ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Failed to ${editingExperience ? 'update' : 'add'} experience`);
      
      resetForm();
      setShowModal(false);
      await fetchExperiences();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
      location: "",
      isCurrentJob: false,
    });
    setEditingExperience(null);
  };

  const openModal = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData(experience);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const deleteExperience = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete experience");
      await fetchExperiences();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Work Experience</h1>
            <p className="text-slate-600 mt-1">Manage your professional work history</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Experience
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Experience Timeline */}
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <div className="modern-card p-8 text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No experience added yet</h3>
              <p className="text-slate-600">Add your work experience to showcase your professional journey.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp._id} className="modern-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{exp.position}</h3>
                      {exp.isCurrentJob && (
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-medium text-indigo-600 mb-2">{exp.company}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <span>
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                      {exp.location && <span>📍 {exp.location}</span>}
                    </div>
                    <p className="text-slate-700 mb-4">{exp.description}</p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openModal(exp)}
                      className="text-green-600 hover:text-green-700 p-1"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteExperience(exp._id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingExperience ? 'Edit Experience' : 'Add New Experience'}
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
                        Company *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        disabled={formData.isCurrentJob}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isCurrentJob"
                      checked={formData.isCurrentJob || false}
                      onChange={(e) => setFormData({...formData, isCurrentJob: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                    />
                    <label htmlFor="isCurrentJob" className="ml-2 block text-sm text-slate-700">
                      This is my current job
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={4}
                      required
                      placeholder="Describe your role, responsibilities, and achievements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={formData.technologies?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="React, Node.js, MongoDB, etc. (comma separated)"
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
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingExperience ? 'Update Experience' : 'Add Experience'}
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
