"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from '@/hooks/useTranslations';
import api from "@/utils/api";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

interface UserData {
  fullName?: string;
  title?: string;
  bio?: string;
  profileImage?: string;
  resumeUrl?: string;
  yearsOfExperience?: number;
  availableForWork?: boolean;
}

interface Stats {
  totalProjects: number;
  totalTechnologies: number;
  totalClients: number;
}

const Hero: React.FC = () => {
  const t = useTranslations("Hero");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
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
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await api.get("/users/portfolio/public");
        setUserData(userResponse.data);

        // Fetch stats
        try {
          const statsResponse = await api.get("/dashboard/statistics");
          setStats({
            totalProjects: statsResponse.data?.overview?.totalProjects || 0,
            totalTechnologies: statsResponse.data?.overview?.totalTechnologies || 0,
            totalClients: 12, // Fallback since not in API
          });
        } catch (statsError) {
          // Fallback stats
          setStats({
            totalProjects: 8,
            totalTechnologies: 15,
            totalClients: 12,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback data
        setUserData({
          fullName: "John Doe",
          title: "Full Stack Developer",
          bio: "I create modern web applications with cutting-edge technologies",
          yearsOfExperience: 5,
          availableForWork: true,
        });
        setStats({
          totalProjects: 8,
          totalTechnologies: 15,
          totalClients: 12,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Avatar with animated ring */}
          {userData?.profileImage && (
            <div className="mb-8 relative">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin" style={{animationDuration: '3s'}}></div>
                <img
                  src={buildAbsoluteUrl(userData.profileImage)}
                  alt={userData.fullName || "Profile"}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl m-1"
                />
              </div>
              {userData?.availableForWork && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="success" size="sm">
                    ✅ Available
                  </Badge>
                </div>
              )}
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

          {/* Dynamic Stats */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{userData?.yearsOfExperience || 5}+</div>
                <div className="text-sm text-gray-600">{t("yearsExperience") || "Years Experience"}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.totalProjects}+</div>
                <div className="text-sm text-gray-600">{t("projectsCompleted") || "Projects Completed"}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">{stats.totalClients}+</div>
                <div className="text-sm text-gray-600">{t("happyClients") || "Happy Clients"}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.totalTechnologies}+</div>
                <div className="text-sm text-gray-600">{t("technologies") || "Technologies"}</div>
              </div>
            </div>
          )}

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#projects">
              <Button size="lg">
                🚀 {t("viewProjects") || "View My Projects"}
              </Button>
            </Link>

            {userData?.resumeUrl && (
              <a
                href={buildAbsoluteUrl(userData.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  📄 {t("downloadCV") || "Download CV"}
                </Button>
              </a>
            )}

            <Link href="#contact">
              <Button variant="ghost" size="lg">
                💬 {t("cta") || "Get In Touch"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
