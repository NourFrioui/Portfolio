"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type User = {
  _id?: string;
  username: string;
  email: string;
  role?: string;
};

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setUser({ _id: data.userId, email: data.email, username: data.username });
        setUsername(data.username || "");
      } catch {}
    };
    fetchMe();
  }, [token]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setMessage("Saved");
    } catch (e) {
      setMessage((e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <form
          onSubmit={save}
          className="bg-white rounded-xl shadow p-6 grid gap-4"
        >
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
            Save
          </button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
}
