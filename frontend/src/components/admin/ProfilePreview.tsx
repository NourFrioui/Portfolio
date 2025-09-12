"use client";

import React from "react";
import { motion } from "framer-motion";
import { getLocalizedText } from "@/utils/localization";
import {
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Download,
  Briefcase,
  Calendar,
} from "lucide-react";
import ImageDisplay from "../ImageDisplay";
import { useTranslations } from "next-intl";

type UserProfile = {
  _id?: string;
  username: string;
  email: string;
  role?: string;
  fullName: string;
  title: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  linkedin: string;
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

interface ProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: Partial<UserProfile>;
}

export default function ProfilePreview({
  isOpen,
  onClose,
  profileData,
}: ProfilePreviewProps) {
  const t = useTranslations("Admin.profilePreview");

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500">
              {t("hourlyRate", { rate: profileData.hourlyRate || "0" })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <ImageDisplay
                userId={profileData._id || ""}
                alt={
                  getLocalizedText(profileData.fullName) || t("defaults.name")
                }
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                fallback={
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {getLocalizedText(profileData.fullName)?.charAt(0) ||
                        t("defaults.initial")}
                    </span>
                  </div>
                }
              />
              {profileData.availableForWork && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <CheckBadgeIcon className="h-3 w-3" />
                  <span>{t("available")}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {getLocalizedText(profileData.fullName) || t("defaults.name")}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {getLocalizedText(profileData.title) || t("defaults.title")}
            </p>

            {/* Contact Info */}
            <div
              className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6"
              aria-label={t("contactInfo")}
            >
              {profileData.location && (
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{getLocalizedText(profileData.location)}</span>
                </div>
              )}
              {profileData.phone ? (
                <div className="flex items-center space-x-1">
                  <PhoneIcon className="h-4 w-4" />
                  <a
                    href={`tel:${profileData.phone}`}
                    className="hover:underline"
                  >
                    {profileData.phone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{t("noPhone")}</span>
                </div>
              )}
              {profileData.email ? (
                <div className="flex items-center space-x-1">
                  <EnvelopeIcon className="h-4 w-4" />
                  <a
                    href={`mailto:${profileData.email}`}
                    className="hover:underline"
                  >
                    {profileData.email}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{t("noEmail")}</span>
                </div>
              )}
              {profileData.website ? (
                <div className="flex items-center space-x-1">
                  <GlobeAltIcon className="h-4 w-4" />
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {profileData.website}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>{t("noWebsite")}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profileData.bio && (
              <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
                {getLocalizedText(profileData.bio)}
              </p>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {profileData.yearsOfExperience || 0}+
              </div>
              <p className="text-gray-500">
                {t("yearsExperience", {
                  count: profileData.yearsOfExperience || 0,
                })}
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {profileData.skills?.length || 0}
              </div>
              <div className="text-gray-600 font-medium">{t("skills")}</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {profileData.languages?.length || 0}
              </div>
              <div className="text-gray-600 font-medium">{t("languages")}</div>
            </div>
          </div>

          {/* Skills Section */}
          {profileData.skills && profileData.skills.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t("skills")}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {profileData.languages && profileData.languages.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("languages")}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {profileData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 rounded-full text-sm font-medium border border-green-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("contactInfo")}
            </h3>
            <div className="flex justify-center space-x-4">
              {profileData.website && (
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <GlobeAltIcon className="h-6 w-6 text-gray-600" />
                </a>
              )}
              {profileData.github && (
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {profileData.linkedin && (
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {profileData.twitter && (
                <a
                  href={profileData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Hourly Rate */}
          {profileData.hourlyRate && (
            <div className="mt-8 text-center">
              <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-2xl border border-green-200">
                <span className="text-lg font-semibold text-green-800">
                  {t("hourlyRate", { rate: profileData.hourlyRate || "0" })}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
