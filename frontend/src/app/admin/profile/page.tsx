"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import PdfUpload from "@/components/admin/PdfUpload";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import ProfilePreview from "@/components/admin/ProfilePreview";

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  BriefcaseIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  SparklesIcon,
  GlobeAltIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

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
  description: string;
  location: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  profileImageUrl: string;
  resumeUrl: string;
  yearsOfExperience: number;
  availableForWork: boolean;
  hourlyRate: string;
  skills: string[];
  languages: string[];
};

type Technology = {
  _id: string;
  name: string;
  percentage: number;
  iconUrl?: string;
};

const AVAILABLE_LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Turkish",
];

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "portfolio" | "social">(
    "basic"
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Form states
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    username: "",
    email: "",
    fullName: "",
    title: "",
    bio: "",
    description: "",
    location: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
    profileImageUrl: "",
    resumeUrl: "",
    yearsOfExperience: 0,
    availableForWork: true,
    hourlyRate: "",
    skills: [],
    languages: [],
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Calculate profile completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      const fields = [
        formData.fullName,
        formData.title,
        formData.bio,
        formData.location,
        formData.phone,
        formData.profileImageUrl,
        formData.skills?.length,
        formData.languages?.length,
        formData.website,
        formData.github,
      ];
      const filledFields = fields.filter(
        (field) => field && field !== "" && field !== 0
      ).length;
      const percentage = Math.round((filledFields / fields.length) * 100);
      setCompletionPercentage(percentage);
    };
    calculateCompletion();
  }, [formData]);

  // Fetch technologies from backend
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await api.get("/technologies");
        setTechnologies(response.data);
      } catch (error) {
        console.error("Error fetching technologies:", error);
      }
    };
    fetchTechnologies();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try to fetch user profile directly
        const response = await api.get("/users/portfolio/public");
        const profileData = response.data;

        console.log("Profile data received:", profileData);
        setUser(profileData);
        setFormData(profileData);
        setSelectedSkills(profileData.skills || []);
        setSelectedLanguages(profileData.languages || []);
      } catch (error) {
        console.error("Error fetching user profile:", error);

        // Create default profile with existing data if available
        const defaultProfile = {
          _id: "default",
          username: "",
          email: "",
          fullName: "",
          title: "",
          bio: "",
          description: "",
          location: "",
          phone: "",
          website: "",
          linkedin: "",
          github: "",
          twitter: "",
          profileImageUrl: "",
          resumeUrl: "",
          yearsOfExperience: 0,
          availableForWork: true,
          hourlyRate: "",
          skills: [],
          languages: [],
        };
        setUser(defaultProfile);
        setFormData(defaultProfile);
        setSelectedSkills([]);
        setSelectedLanguages([]);
        toast.error("Could not load profile data. Using default values.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skillName: string) => {
    const newSkills = selectedSkills.includes(skillName)
      ? selectedSkills.filter((skill) => skill !== skillName)
      : [...selectedSkills, skillName];
    setSelectedSkills(newSkills);
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((lang) => lang !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(newLanguages);
    setFormData((prev) => ({ ...prev, languages: newLanguages }));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setMessage(null);

    try {
      // Use the correct API endpoint for updating profile
      // First get the user ID from the current user data
      if (!user?._id) {
        throw new Error("User ID not found");
      }

      // Only send fields that are allowed in UpdateProfileDto
      const allowedFields = [
        "username",
        "email",
        "fullName",
        "title",
        "bio",
        "description",
        "location",
        "phone",
        "website",
        "linkedin",
        "github",
        "twitter",
        "profileImageUrl",
        "resumeUrl",
        "yearsOfExperience",
        "availableForWork",
        "hourlyRate",
        "skills",
        "languages",
      ];

      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            allowedFields.includes(key) && value !== undefined && value !== null
        )
      );

      // Handle profileImageUrl - it's now a string URL, so we can include it in the update
      if (cleanFormData.profileImageUrl) {
        // profileImageUrl is now a string, so we can include it directly
        cleanFormData.profileImageUrl = cleanFormData.profileImageUrl;
      }

      console.log("Sending formData:", cleanFormData);
      const response = await api.patch(
        `/users/${user._id}/profile`,
        cleanFormData
      );
      const updatedProfile = response.data;

      setUser(updatedProfile);
      setFormData(updatedProfile);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <SparklesIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-700 font-medium">Loading your profile...</p>
          <p className="text-gray-500 text-sm mt-2">
            Preparing your portfolio settings
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex">
        {/* Persistent Sidebar */}
        <div className="w-80 bg-white shadow-xl border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Profile Completion Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">
                    Profile Completion
                  </span>
                </div>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Preview</span>
                </button>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {completionPercentage}%
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      completionPercentage >= 80
                        ? "bg-green-100 text-green-800"
                        : completionPercentage >= 50
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {completionPercentage >= 80
                      ? "Excellent"
                      : completionPercentage >= 50
                      ? "Good"
                      : "Needs Work"}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      completionPercentage >= 80
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : completionPercentage >= 50
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              {[
                {
                  key: "basic",
                  label: "Basic Info",
                  icon: UserIcon,
                  color: "blue",
                },
                {
                  key: "portfolio",
                  label: "Portfolio Details",
                  icon: BriefcaseIcon,
                  color: "purple",
                },
                {
                  key: "social",
                  label: "Social Links",
                  icon: LinkIcon,
                  color: "indigo",
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() =>
                      setActiveTab(tab.key as "basic" | "portfolio" | "social")
                    }
                    className={`w-full py-4 px-6 font-medium text-sm flex items-center space-x-3 relative transition-all duration-300 rounded-xl ${
                      activeTab === tab.key
                        ? `text-${tab.color}-600 bg-${tab.color}-50 shadow-md border-2 border-${tab.color}-200`
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-2 border-transparent"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        activeTab === tab.key
                          ? `text-${tab.color}-600`
                          : "text-gray-400"
                      }`}
                    />
                    <span>{tab.label}</span>
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeSidebarTab"
                        className={`absolute right-2 w-2 h-2 bg-${tab.color}-600 rounded-full`}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 space-y-3"
            >
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">
                    Skills
                  </span>
                  <span className="text-lg font-bold text-blue-900">
                    {selectedSkills.length}
                  </span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-700 font-medium">
                    Languages
                  </span>
                  <span className="text-lg font-bold text-indigo-900">
                    {selectedLanguages.length}
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700 font-medium">
                    Experience
                  </span>
                  <span className="text-lg font-bold text-purple-900">
                    {formData.yearsOfExperience || 0}y
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Portfolio Profile Settings
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your portfolio information and personal details
                </p>
              </div>
            </motion.div>

            <motion.form
              onSubmit={saveProfile}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {/* Basic Info Tab */}
                  {activeTab === "basic" && (
                    <motion.div
                      key="basic"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Basic Information
                          </h2>
                          <p className="text-gray-600">
                            Your personal and contact details
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                            Username
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.username || ""}
                              onChange={(e) =>
                                handleInputChange("username", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="Your username"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={formData.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="your.email@example.com"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.fullName || ""}
                              onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="Your full name"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                            Professional Title
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.title || ""}
                              onChange={(e) =>
                                handleInputChange("title", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="e.g., Full Stack Developer"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4" />
                            <span>Location</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.location || ""}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="City, Country"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors flex items-center space-x-2">
                            <PhoneIcon className="h-4 w-4" />
                            <span>Phone</span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                            Bio (Short Introduction)
                          </label>
                          <div className="relative">
                            <textarea
                              value={formData.bio || ""}
                              onChange={(e) =>
                                handleInputChange("bio", e.target.value)
                              }
                              rows={3}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                              placeholder="Brief intro that appears above your name..."
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                              {(formData.bio || "").length}/200
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                            Description (About Me Section)
                          </label>
                          <div className="relative">
                            <textarea
                              value={formData.description || ""}
                              onChange={(e) =>
                                handleInputChange("description", e.target.value)
                              }
                              rows={3}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                              placeholder="Detailed description for About Me section..."
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                              {(formData.description || "").length}/500
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Portfolio Details Tab */}
                  {activeTab === "portfolio" && (
                    <motion.div
                      key="portfolio"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <BriefcaseIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Portfolio Details
                          </h2>
                          <p className="text-gray-600">
                            Professional information and portfolio assets
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors flex items-center space-x-2">
                            <AcademicCapIcon className="h-4 w-4" />
                            <span>Years of Experience</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={formData.yearsOfExperience || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  "yearsOfExperience",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              min="0"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors flex items-center space-x-2">
                            <CurrencyDollarIcon className="h-4 w-4" />
                            <span>Hourly Rate</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.hourlyRate || ""}
                              onChange={(e) =>
                                handleInputChange("hourlyRate", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="e.g., $50/hour"
                            />
                          </div>
                        </motion.div>
                        <div className="md:col-span-2">
                          <motion.div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-dashed border-purple-200">
                            <PdfUpload
                              currentPdf={formData.resumeUrl || ""}
                              onPdfUpload={(pdfUrl) =>
                                handleInputChange("resumeUrl", pdfUrl)
                              }
                              label="CV/Resume Upload"
                              userId={user?._id}
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                            Profile Image
                          </label>
                          <div className="relative">
                            <ImageUpload
                              currentImage={formData.profileImageUrl || ""}
                              onImageUpload={(imageUrl) =>
                                handleInputChange("profileImageUrl", imageUrl)
                              }
                              label="Profile Image"
                              userId={user?._id}
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Skills Selection */}
                      <motion.div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                          Skills - Select from Available Technologies
                        </label>
                        <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {technologies.map((tech) => (
                              <motion.button
                                key={tech._id}
                                type="button"
                                onClick={() => handleSkillToggle(tech.name)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selectedSkills.includes(tech.name)
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
                                }`}
                              >
                                {tech.name}
                              </motion.button>
                            ))}
                          </div>
                          {selectedSkills.length > 0 && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm text-purple-700 font-medium mb-2">
                                Selected Skills ({selectedSkills.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Languages Selection */}
                      <motion.div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                          Languages - Select Multiple
                        </label>
                        <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {AVAILABLE_LANGUAGES.map((language) => (
                              <motion.button
                                key={language}
                                type="button"
                                onClick={() => handleLanguageToggle(language)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selectedLanguages.includes(language)
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200"
                                }`}
                              >
                                {language}
                              </motion.button>
                            ))}
                          </div>
                          {selectedLanguages.length > 0 && (
                            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                              <p className="text-sm text-indigo-700 font-medium mb-2">
                                Selected Languages ({selectedLanguages.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedLanguages.map((language) => (
                                  <span
                                    key={language}
                                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                      >
                        <input
                          type="checkbox"
                          id="availableForWork"
                          checked={formData.availableForWork || false}
                          onChange={(e) =>
                            handleInputChange(
                              "availableForWork",
                              e.target.checked
                            )
                          }
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="availableForWork"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Available for work / freelance projects
                        </label>
                        <div className="ml-auto">
                          {formData.availableForWork && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              ✓ Available
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Social Links Tab */}
                  {activeTab === "social" && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                          <LinkIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Social Links
                          </h2>
                          <p className="text-gray-600">
                            Connect your social media and professional profiles
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-indigo-600 transition-colors flex items-center space-x-2">
                            <GlobeAltIcon className="h-4 w-4" />
                            <span>Website</span>
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formData.website || ""}
                              onChange={(e) =>
                                handleInputChange("website", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-indigo-600 transition-colors">
                            LinkedIn
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formData.linkedin || ""}
                              onChange={(e) =>
                                handleInputChange("linkedin", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="https://linkedin.com/in/yourprofile"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-indigo-600 transition-colors">
                            GitHub
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formData.github || ""}
                              onChange={(e) =>
                                handleInputChange("github", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="https://github.com/yourusername"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-indigo-600 transition-colors">
                            Twitter
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formData.twitter || ""}
                              onChange={(e) =>
                                handleInputChange("twitter", e.target.value)
                              }
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                              placeholder="https://twitter.com/yourusername"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Footer with Save Button */}
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium ${
                          message.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {message.type === "success" ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          <ExclamationCircleIcon className="h-5 w-5" />
                        )}
                        <span>{message.text}</span>
                      </motion.div>
                    )}

                    <div className="text-sm text-gray-600">
                      Profile completion:{" "}
                      <span className="font-semibold text-gray-900">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-xl flex items-center space-x-3 shadow-lg transition-all duration-300"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5" />
                        <span>Save Profile</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.form>

            {/* Profile Preview Modal */}
            <ProfilePreview
              isOpen={previewMode}
              onClose={() => setPreviewMode(false)}
              profileData={formData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
