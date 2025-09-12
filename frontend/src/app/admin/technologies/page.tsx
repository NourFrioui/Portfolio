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

type Technology = {
  _id?: string;
  name: { en: string; fr: string };
  percentage: number;
  iconUrl?: string;
  categoryId?: string;
  description?: { en: string; fr: string };
  icon?: string;
  order?: number;
  isActive?: boolean;
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

export default function AdminTechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState<Technology>({
    name: { en: "", fr: "" },
    percentage: 50,
    categoryId: "",
    description: { en: "", fr: "" },
    icon: "",
    order: 1,
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "fr">("en");
  const buildAbsoluteUrl = (raw?: string | null) => {
    const u = (raw || "").trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/")) return `${API_BASE}${u}`;
    if (u.includes("uploads/")) return `${API_BASE}/${u}`;
    return `${API_BASE}/upload/${u}`;
  };

  const isImg = (u?: string) =>
    (!!u && /\.(png|jpe?g|gif|svg|webp|bmp)$/i.test(u)) ||
    u?.startsWith("http") ||
    u?.startsWith("/");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchTechnologies = async () => {
    const res = await fetch(`${API_BASE}/technologies`);
    const data = await res.json();
    setTechnologies(data);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data.filter((cat: Category) => cat.isActive));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchTechnologies();
    fetchCategories();
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
      // Build a safe payload with only allowed fields
      const payload = {
        name: formData.name,
        percentage: formData.percentage,
        categoryId: formData.categoryId || undefined,
        description: formData.description || undefined,
        icon: formData.icon ? buildAbsoluteUrl(formData.icon) : undefined,
        order: formData.order || 1,
        isActive: formData.isActive !== false,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          `Failed to ${editingTech ? "update" : "add"} technology`
        );

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
      name: { en: "", fr: "" },
      percentage: 50,
      categoryId: "",
      description: { en: "", fr: "" },
      icon: "",
      order: technologies.length + 1,
      isActive: true,
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Technologies & Skills
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your technical skills and expertise levels
            </p>
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
            <div
              key={tech._id}
              className="modern-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 flex items-center gap-3">
                  {tech.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={buildAbsoluteUrl(tech.icon)}
                      alt={`${
                        tech.name.en || tech.name.fr || "technology"
                      }-icon`}
                      className="w-8 h-8 object-contain rounded"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  )}
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {tech.name.en || tech.name.fr || "Untitled"}
                  </h3>
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
                  <span className="font-medium text-slate-900">
                    {tech.percentage}%
                  </span>
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
                    {editingTech ? "Edit Technology" : "Add New Technology"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Language Switcher */}
                  <div className="flex mb-4 border-b border-gray-200">
                    <button
                      type="button"
                      className={`py-2 px-4 font-medium ${
                        currentLang === "en"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentLang("en")}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 font-medium ${
                        currentLang === "fr"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentLang("fr")}
                    >
                      Français
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Technology Name * ({currentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.name[currentLang]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: {
                            ...formData.name,
                            [currentLang]: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Icon URL or Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Icon URL (or upload an image below)
                    </label>
                    <input
                      type="text"
                      value={formData.icon || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="https://... or /uploads/... or filename.png"
                    />
                    <div className="mt-2 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {formData.icon && (
                        <img
                          src={buildAbsoluteUrl(formData.icon)}
                          alt="icon-preview"
                          className="w-10 h-10 object-contain rounded border border-slate-200"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      )}
                      <button
                        type="button"
                        className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
                        onClick={() => setFormData({ ...formData, icon: "" })}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Icon Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const body = new FormData();
                        body.append("file", f);
                        try {
                          const res = await fetch(`${API_BASE}/upload/image`, {
                            method: "POST",
                            body,
                          });
                          if (!res.ok) throw new Error("Upload failed");
                          const data = await res.json();
                          const url = data?.url || data?.filename || data?.path;
                          if (url)
                            setFormData({
                              ...formData,
                              icon: buildAbsoluteUrl(url),
                            });
                        } catch (err) {
                          console.error("Icon upload error:", err);
                        }
                      }}
                      className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          percentage: Number(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description ({currentLang.toUpperCase()})
                    </label>
                    <textarea
                      value={formData.description?.[currentLang] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: {
                            ...(formData.description || { en: "", fr: "" }),
                            [currentLang]: e.target.value,
                          },
                        })
                      }
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
                      {loading
                        ? "Saving..."
                        : editingTech
                        ? "Update Technology"
                        : "Add Technology"}
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
