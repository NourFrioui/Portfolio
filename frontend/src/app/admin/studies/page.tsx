"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic";

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Study = {
  _id?: string;
  degree: {
    en: string;
    fr: string;
  };
  institution: {
    en: string;
    fr: string;
  };
  location: {
    en: string;
    fr: string;
  };
  startDate: string;
  endDate?: string;
  current: boolean;
  description: {
    en: string;
    fr: string;
  };
  gpa?: {
    en: string;
    fr: string;
  };
  honors?: string[];
  coursework?: string[];
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

const StudiesAdminPage: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'fr'>('en');
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [formData, setFormData] = useState<Omit<Study, '_id' | 'createdAt' | 'updatedAt' | '__v'>>({
    degree: { en: '', fr: '' },
    institution: { en: '', fr: '' },
    location: { en: '', fr: '' },
    startDate: '',
    endDate: '',
    current: false,
    description: { en: '', fr: '' },
    gpa: { en: '', fr: '' },
    honors: [],
    coursework: [],
  });

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      const response = await fetch(`${API_BASE}/studies`);
      if (response.ok) {
        const data = await response.json();
        setStudies(data);
      }
    } catch (error) {
      console.error("Error fetching studies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!editingStudy) return;
  
      const url = `${API_BASE}/studies/${editingStudy._id}`;
      
      // Préparer les données pour l'envoi
      const dataToSend = {
        ...formData,
        // S'assurer que tous les champs localisés sont présents
        degree: {
          en: formData.degree.en || '',
          fr: formData.degree.fr || ''
        },
        institution: {
          en: formData.institution.en || '',
          fr: formData.institution.fr || ''
        },
        location: {
          en: formData.location.en || '',
          fr: formData.location.fr || ''
        },
        description: {
          en: formData.description.en || '',
          fr: formData.description.fr || ''
        },
        gpa: formData.gpa ? {
          en: formData.gpa.en || '',
          fr: formData.gpa.fr || ''
        } : undefined,
        honors: formData.honors || [],
        coursework: formData.coursework || []
      };
  
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        await fetchStudies();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving study:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Préparer les données pour la création
      const dataToSend = {
        ...formData,
        // S'assurer que tous les champs localisés sont présents
        degree: {
          en: formData.degree.en || '',
          fr: formData.degree.fr || ''
        },
        institution: {
          en: formData.institution.en || '',
          fr: formData.institution.fr || ''
        },
        location: {
          en: formData.location.en || '',
          fr: formData.location.fr || ''
        },
        description: {
          en: formData.description.en || '',
          fr: formData.description.fr || ''
        },
        gpa: formData.gpa ? {
          en: formData.gpa.en || '',
          fr: formData.gpa.fr || ''
        } : undefined,
        honors: formData.honors || [],
        coursework: formData.coursework || []
      };

      const response = await fetch(`${API_BASE}/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await fetchStudies();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating study:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this study?")) {
      try {
        const response = await fetch(`${API_BASE}/studies/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchStudies();
        }
      } catch (error) {
        console.error("Error deleting study:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      degree: { en: '', fr: '' },
      institution: { en: '', fr: '' },
      location: { en: '', fr: '' },
      startDate: '',
      endDate: '',
      current: false,
      description: { en: '', fr: '' },
      gpa: { en: '', fr: '' },
      honors: [],
      coursework: [],
    });
    setEditingStudy(null);
    setShowForm(false);
  };

  const handleEdit = (study: Study) => {
    const { _id, createdAt, updatedAt, __v, ...cleanStudy } = study;
  
    // Formater les dates au format YYYY-MM-DD pour les inputs date
    const formattedStudy = {
      ...cleanStudy,
      startDate: cleanStudy.startDate ? cleanStudy.startDate.split('T')[0] : '',
      endDate: cleanStudy.endDate ? cleanStudy.endDate.split('T')[0] : '',
      // S'assurer que tous les champs localisés sont correctement initialisés
      degree: cleanStudy.degree || { en: '', fr: '' },
      institution: cleanStudy.institution || { en: '', fr: '' },
      location: cleanStudy.location || { en: '', fr: '' },
      description: cleanStudy.description || { en: '', fr: '' },
      gpa: cleanStudy.gpa || { en: '', fr: '' },
      honors: cleanStudy.honors || [],
      coursework: cleanStudy.coursework || [],
    };
  
    setFormData(formattedStudy);
    setEditingStudy(study);
    setShowForm(true);
  };
  
  const handleArrayInput = (field: "honors" | "coursework", value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData({ ...formData, [field]: items });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Studies Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + New Study
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingStudy ? "Edit Study" : "Add New Study"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Onglets de langue */}
                <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className={`py-2 px-4 font-medium ${currentLang === 'en' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setCurrentLang('en')}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 font-medium ${currentLang === 'fr' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setCurrentLang('fr')}
                  >
                    Français
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        degree: {
                          ...formData.degree,
                          [currentLang]: e.target.value
                        }
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        institution: {
                          ...formData.institution,
                          [currentLang]: e.target.value
                        }
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          [currentLang]: e.target.value
                        }
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      disabled={formData.current}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current: e.target.checked,
                          endDate: e.target.checked ? "" : formData.endDate,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Currently studying
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: {
                          ...formData.description,
                          [currentLang]: e.target.value
                        }
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GPA
                  </label>
                  <input
                    type="text"
                    value={formData.gpa?.[currentLang] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gpa: {
                          ...(formData.gpa || { en: '', fr: '' }),
                          [currentLang]: e.target.value
                        }
                      })
                    }
                    placeholder="e.g., 3.8/4.0"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Honors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.honors?.join(", ") || ""}
                    onChange={(e) => handleArrayInput("honors", e.target.value)}
                    placeholder="e.g., Magna Cum Laude, Dean's List"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Relevant Coursework (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.coursework?.join(", ") || ""}
                    onChange={(e) =>
                      handleArrayInput("coursework", e.target.value)
                    }
                    placeholder="e.g., Web Development, Database Systems"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingStudy ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {studies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No studies found. Add your first study to get started.
              </p>
            </div>
          ) : (
            studies.map((study) => (
              <div
                key={study._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {study.degree.en} / {study.degree.fr}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-1">
                      {study.institution.en} / {study.institution.fr}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {study.location.en} / {study.location.fr}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(study.startDate)} -{" "}
                      {study.current ? "Present" : formatDate(study.endDate!)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(study)}
                      className="text-indigo-600 hover:text-indigo-700 p-1"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(study._id!)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">English:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {study.description.en}
                  </p>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Français:</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {study.description.fr}
                  </p>
                </div>

                {(study.gpa?.en || study.gpa?.fr) && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>GPA:</strong> {study.gpa?.en} / {study.gpa?.fr}
                    </p>
                  </div>
                )}

                {study.honors && study.honors.length > 0 && (
                  <div className="mb-2">
                    <strong className="text-sm text-gray-600 dark:text-gray-400">
                      Honors / Distinctions:
                    </strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {study.honors.map((honor, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs"
                        >
                          {honor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {study.coursework && study.coursework.length > 0 && (
                  <div>
                    <strong className="text-sm text-gray-600 dark:text-gray-400">
                      Coursework / Cours:
                    </strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {study.coursework.map((course, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudiesAdminPage;
