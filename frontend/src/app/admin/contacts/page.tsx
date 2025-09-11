"use client";

import React, { useEffect, useState } from "react";
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

type Contact = {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchContacts = async () => {
    const res = await fetch(`${API_BASE}/contact`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/contact/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      await fetchContacts();
    } catch (e) {
      setError((e as Error).message);
    }
  };

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

  const openContactModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    if (!contact.isRead) {
      markAsRead(contact._id!);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'unread') return !contact.isRead;
    if (filter === 'read') return contact.isRead;
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
            <p className="text-slate-600 mt-1">View and manage contact form submissions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All ({contacts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Unread ({contacts.filter(c => !c.isRead).length})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Read ({contacts.filter(c => c.isRead).length})
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="modern-card p-8 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No messages found</h3>
              <p className="text-slate-600">
                {filter === 'all' 
                  ? "You haven't received any contact messages yet." 
                  : `No ${filter} messages found.`}
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div 
                key={contact._id} 
                className={`modern-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  !contact.isRead ? 'border-l-4 border-l-indigo-500 bg-indigo-50/30' : ''
                }`}
                onClick={() => openContactModal(contact)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
                      {!contact.isRead && (
                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{contact.email}</p>
                    {contact.subject && (
                      <p className="text-slate-800 font-medium mb-2">Subject: {contact.subject}</p>
                    )}
                    <p className="text-slate-700 line-clamp-2">{contact.message}</p>
                    {contact.createdAt && (
                      <p className="text-slate-500 text-sm mt-3">{formatDate(contact.createdAt)}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!contact.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(contact._id!);
                        }}
                        className="text-indigo-600 hover:text-indigo-700 p-1"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContact(contact._id);
                      }}
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

        {/* Contact Detail Modal */}
        {showModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Contact Message</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <p className="text-slate-900">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <a 
                        href={`mailto:${selectedContact.email}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>

                  {selectedContact.subject && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                      <p className="text-slate-900">{selectedContact.subject}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-900 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {selectedContact.createdAt && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Received</label>
                      <p className="text-slate-600">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
