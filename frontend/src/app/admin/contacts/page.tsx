"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type Contact = {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchContacts = async () => {
    const res = await fetch(`${API_BASE}/contact`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete contact");
      await fetchContacts();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Contacts</h1>
          <a href="/admin/login" className="text-blue-600 underline">
            Change account
          </a>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-gray-600 text-sm">{c.email}</p>
                  <p className="mt-2 text-gray-800">{c.message}</p>
                </div>
                <button
                  onClick={() => deleteContact(c._id)}
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
