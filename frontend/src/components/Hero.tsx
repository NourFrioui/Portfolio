"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";

interface UserProfile {
  fullName: string;
  title: string;
  bio: string;
  profileImage?: string;
}

const Hero: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/portfolio/public");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback data
        setUserProfile({
          fullName: "Your Name",
          title: "Full Stack Developer",
          bio: "I build modern, scalable web applications with great user experiences.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-16"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Hello, I'm {" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userProfile?.fullName || "Your Name"}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              {userProfile?.title || "Full Stack Developer"}
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {userProfile?.bio || "I build modern, scalable web applications with great user experiences."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
