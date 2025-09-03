"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Technology = {
  _id?: string;
  name: string;
  percentage: number;
  iconUrl?: string;
};

export default function AdminTechnologiesPage() {
  const [tech, setTech] = useState<Technology[]>([]);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchTech = async () => {
    const res = await fetch(`${API_BASE}/technologies`);
    const data = await res.json();
    setTech(data);
  };

  useEffect(() => {
    fetchTech();
  }, []);

  const addTech = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/technologies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, percentage }),
      });
      if (!res.ok) throw new Error("Failed to add technology (admin required)");
      setName("");
      setPercentage(50);
      await fetchTech();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTech = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/technologies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete technology");
      await fetchTech();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Technologies</h1>
          <a href="/admin/login" className="text-blue-600 underline">
            Change account
          </a>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form
          onSubmit={addTech}
          className="bg-white rounded-xl shadow p-6 mb-8 grid gap-4 md:grid-cols-3"
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            min={0}
            max={100}
            placeholder="Percentage"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            {loading ? "Adding…" : "Add Technology"}
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-4">
          {tech.map((t) => (
            <div key={t._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-gray-600 text-sm">{t.percentage}%</p>
                </div>
                <button
                  onClick={() => deleteTech(t._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
