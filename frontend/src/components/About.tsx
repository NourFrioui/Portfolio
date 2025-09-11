"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Award, Users } from "lucide-react";
import api from "../utils/api";
import ImageDisplay from "./ImageDisplay";
import { isValidImageUrl, getImageUrl } from "../utils/imageUtils";
import { useTranslations } from "../hooks/useTranslations";

interface UserProfile {
  _id?: string;
  fullName: string;
  title: string;
  bio: string;
  description: string;
  profileImageUrl?: string;
  yearsOfExperience?: number;
  skills?: string[];
  location?: string;
  email?: string;
  experience?: string[];
  languages?: string[];
  education?: string[];
  certifications?: string[];
  interests?: string[];
  username?: string;
  resumeUrl?: string;
  availableForWork?: boolean;
  hourlyRate?: number;
}

const About: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/portfolio/public");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback data
        setUserProfile({
          fullName: "John Doe",
          title: "Full Stack Developer",
          bio: "Passionate developer with expertise in modern web technologies",
          description:
            "I am a dedicated full-stack developer with a passion for creating innovative web solutions. With expertise in modern technologies and a commitment to clean, efficient code, I help businesses build robust digital experiences.",
          yearsOfExperience: 5,
          skills: [
            "React & Next.js",
            "Node.js & Express",
            "TypeScript",
            "MongoDB & PostgreSQL",
          ],
          location: "Your Location",
          resumeUrl: "/upload/pdfs/sample.pdf",
          availableForWork: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  const skillColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-orange-100 text-orange-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("About.title")}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {/* Bio - Short introduction */}
            {userProfile?.bio && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <span className="font-semibold">
                  {t("About.experienceLabel")}
                </span>
                <p className="text-lg text-blue-900 font-medium italic">
                  "{userProfile.bio}"
                </p>
              </div>
            )}

            {/* Description - Detailed about me */}
            <p className="text-lg text-gray-700 leading-relaxed">
              {userProfile?.description || t("About.fallbackDescription")}
            </p>
            {userProfile?.yearsOfExperience && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("About.experienceText").replace(
                  "{years}",
                  userProfile.yearsOfExperience.toString()
                )}
              </p>
            )}
            {userProfile?.location && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("About.locationText").replace(
                  "{location}",
                  userProfile.location
                )}
              </p>
            )}
            {/* Quick facts & Availability */}
            <div className="flex flex-wrap gap-3">
              {userProfile?.availableForWork && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  ✅ {t("About.availableForWork")}
                </span>
              )}
              {typeof userProfile?.hourlyRate === "number" && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  💼 {userProfile.hourlyRate} €/h
                </span>
              )}
              {userProfile?.email && (
                <a
                  href={`mailto:${userProfile.email}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                >
                  ✉️ {userProfile.email}
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {(
                userProfile?.skills || [
                  "React & Next.js",
                  "Node.js & Express",
                  "TypeScript",
                  "MongoDB & PostgreSQL",
                ]
              ).map((skill, index) => (
                <div
                  key={skill}
                  className={`${
                    skillColors[index % skillColors.length]
                  } px-4 py-2 rounded-full text-sm font-medium`}
                >
                  {skill}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#contact" className="btn btn-primary">
                {t("Hero.cta")}
              </a>
              {userProfile?.resumeUrl && (
                <a
                  href={userProfile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  {t("Hero.downloadCV")}
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {userProfile?.profileImageUrl ? (
              <img
                src={userProfile.profileImageUrl}
                alt={userProfile?.fullName || "Profile"}
                className="w-80 h-80 rounded-full object-cover border-4 border-blue-200"
              />
            ) : (
              <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-6xl">
                💻
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
