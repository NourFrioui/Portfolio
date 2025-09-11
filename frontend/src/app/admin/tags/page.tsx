"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Tag = {
  _id?: string;
  name: string;
  color?: string;
  isActive?: boolean;
};

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState<Tag>({ name: "", color: "#3b82f6", isActive: true });

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/tags`);
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const resetForm = () => {
    setForm({ name: "", color: "#3b82f6", isActive: true });
    setEditing(null);
  };

  const openModal = (tag?: Tag) => {
    if (tag) {
      setEditing(tag);
      setForm(tag);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = editing ? `${API_BASE}/tags/${editing._id}` : `${API_BASE}/tags`;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save tag");
      setShowModal(false);
      resetForm();
      await fetchTags();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/tags/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete tag");
      await fetchTags();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tags Management</h1>
            <p className="text-slate-600 mt-1">Create and manage tags</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Tag
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <div key={tag._id} className="modern-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || "#3b82f6" }} />
                    <h3 className="text-lg font-semibold text-slate-900">{tag.name}</h3>
                  </div>
                  <p className="text-slate-600 text-sm">{tag.isActive === false ? "Inactive" : "Active"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(tag)} className="text-indigo-600 hover:text-indigo-700 p-1" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => remove(tag._id)} className="text-red-600 hover:text-red-700 p-1" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{editing ? "Edit Tag" : "Add Tag"}</h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                    <input
                      type="color"
                      value={form.color || "#3b82f6"}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-16 h-10 p-1 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={form.isActive !== false}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : editing ? "Update" : "Add"}
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
