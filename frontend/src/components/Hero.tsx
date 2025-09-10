"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from '@/hooks/useTranslations';
import api from "@/utils/api";

interface UserData {
  fullName?: string;
  title?: string;
  bio?: string;
  profileImage?: string;
  resumeUrl?: string;
}

const Hero: React.FC = () => {
  const t = useTranslations("Hero");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

  const buildAbsoluteUrl = (raw?: string | null) => {
    const u = (raw || "").trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/")) return `${API_BASE}${u}`;
    if (u.includes("uploads/")) return `${API_BASE}/${u}`;
    return `${API_BASE}/upload/${u}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/portfolio/public");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback data
        setUserData({
          fullName: "John Doe",
          title: "Full Stack Developer",
          bio: "I create modern web applications with cutting-edge technologies",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {userData?.profileImage && (
            <div className="mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={buildAbsoluteUrl(userData.profileImage)}
                alt={userData.fullName || "Profile"}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">{t("greeting")}</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userData?.fullName || "John Doe"}
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-700 mb-6 font-medium">
            {userData?.title || t("title")}
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {userData?.bio || t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t("cta")}
            </Link>

            {userData?.resumeUrl && (
              <a
                href={buildAbsoluteUrl(userData.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t("downloadCV")}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
