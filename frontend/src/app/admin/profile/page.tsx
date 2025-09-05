"use client";

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type UserProfile = {
  _id?: string;
  username: string;
  email: string;
  role?: string;
  // Portfolio specific fields
  fullName: string;
  title: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  linkedIn: string;
  github: string;
  twitter: string;
  profileImage: string;
  resumeUrl: string;
  yearsOfExperience: number;
  availableForWork: boolean;
  hourlyRate: string;
  skills: string[];
  languages: string[];
};

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'portfolio' | 'social'>('basic');

  // Form states
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    username: "",
    email: "",
    fullName: "",
    title: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    linkedIn: "",
    github: "",
    twitter: "",
    profileImage: "",
    resumeUrl: "",
    yearsOfExperience: 0,
    availableForWork: true,
    hourlyRate: "",
    skills: [],
    languages: []
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch basic user info
        const authRes = await fetch(`${API_BASE}/auth/profile`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (authRes.ok) {
          const authData = await authRes.json();
          
          // Try to fetch extended profile
          try {
            const profileRes = await fetch(`${API_BASE}/users/${authData.userId}/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              setUser(profileData);
              setFormData(profileData);
            } else {
              // Create default profile with basic auth data
              const defaultProfile = {
                _id: authData.userId,
                username: authData.username || "",
                email: authData.email || "",
                fullName: "",
                title: "",
                bio: "",
                location: "",
                phone: "",
                website: "",
                linkedIn: "",
                github: "",
                twitter: "",
                profileImage: "",
                resumeUrl: "",
                yearsOfExperience: 0,
                availableForWork: true,
                hourlyRate: "",
                skills: [],
                languages: []
              };
              setUser(defaultProfile);
              setFormData(defaultProfile);
            }
          } catch {
            // Fallback to basic profile
            const basicProfile = {
              _id: authData.userId,
              username: authData.username || "",
              email: authData.email || "",
              fullName: "",
              title: "",
              bio: "",
              location: "",
              phone: "",
              website: "",
              linkedIn: "",
              github: "",
              twitter: "",
              profileImage: "",
              resumeUrl: "",
              yearsOfExperience: 0,
              availableForWork: true,
              hourlyRate: "",
              skills: [],
              languages: []
            };
            setUser(basicProfile);
            setFormData(basicProfile);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setMessage({ type: 'error', text: "Failed to load user profile" });
      } finally {
        setLoading(false);
      }  
    };
    
    fetchUserProfile();
  }, [token]);

  const handleInputChange = (field: keyof UserProfile, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: 'skills' | 'languages', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch(`${API_BASE}/users/${user._id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      
      const updatedProfile = await res.json();
      setUser(updatedProfile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Profile Settings</h1>
          <p className="text-gray-600">Manage your portfolio information and personal details</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'basic', label: 'Basic Info', icon: '👤' },
                { key: 'portfolio', label: 'Portfolio Details', icon: '💼' },
                { key: 'social', label: 'Social Links', icon: '🔗' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'basic' | 'portfolio' | 'social')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <form onSubmit={saveProfile} className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username || ""}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / About Me
                  </label>
                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell visitors about yourself, your experience, and what you do..."
                  />
                </div>
              </div>
            )}

            {/* Portfolio Details Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience || 0}
                      onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate
                    </label>
                    <input
                      type="text"
                      value={formData.hourlyRate || ""}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $50/hour"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      currentImage={formData.profileImage || ""}
                      onImageUpload={(imageUrl) => handleInputChange('profileImage', imageUrl)}
                      label="Profile Image"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume/CV URL
                    </label>
                    <input
                      type="url"
                      value={formData.resumeUrl || ""}
                      onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/your-resume.pdf"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills (comma-separated)
                    </label>
                    <textarea
                      value={formData.skills?.join(', ') || ""}
                      onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, Node.js, TypeScript, Python..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages (comma-separated)
                    </label>
                    <textarea
                      value={formData.languages?.join(', ') || ""}
                      onChange={(e) => handleArrayInputChange('languages', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="English, French, Spanish..."
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="availableForWork"
                    checked={formData.availableForWork || false}
                    onChange={(e) => handleInputChange('availableForWork', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="availableForWork" className="ml-2 block text-sm text-gray-700">
                    Available for work / freelance projects
                  </label>
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedIn || ""}
                      onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github || ""}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.twitter || ""}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div>
                {message && (
                  <div className={`text-sm ${
                    message.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
