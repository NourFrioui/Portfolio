"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
import { 
  AcademicCapIcon, 
  CalendarIcon, 
  MapPinIcon,
  TrophyIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

type Study = {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
  logo?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const Studies: React.FC = () => {
  const t = useTranslations("Studies");
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const fallbackStudies: Study[] = [
    {
      _id: "1",
      degree: "Master's in Computer Science",
      institution: "University of Technology",
      location: "Paris, France",
      startDate: "2020-09-01",
      endDate: "2022-06-30",
      current: false,
      description: "Specialized in Software Engineering and Web Technologies with focus on modern development frameworks and methodologies.",
      gpa: "3.8/4.0",
      honors: ["Magna Cum Laude", "Dean's List"],
      coursework: ["Advanced Web Development", "Database Systems", "Software Architecture", "Machine Learning"]
    },
    {
      _id: "2",
      degree: "Bachelor's in Information Technology",
      institution: "Institute of Technology",
      location: "Lyon, France",
      startDate: "2017-09-01",
      endDate: "2020-06-30",
      current: false,
      description: "Comprehensive foundation in computer science principles, programming languages, and system design.",
      gpa: "3.6/4.0",
      coursework: ["Data Structures", "Algorithms", "Web Programming", "Network Security"]
    }
  ];

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await fetch(`${API_BASE}/studies`);
        if (response.ok) {
          const data = await response.json();
          setStudies(data);
        } else {
          setStudies(fallbackStudies);
        }
      } catch (error) {
        console.error("Error fetching studies:", error);
        setStudies(fallbackStudies);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="studies">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>

            {studies.map((study, index) => (
              <motion.div
                key={study._id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>

                {/* Content card */}
                <div className="ml-20 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <AcademicCapIcon className="w-6 h-6 mr-2 text-blue-500" />
                        {study.degree}
                      </h3>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        {study.institution}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {study.location}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {formatDate(study.startDate)} - {study.current ? t("present") : formatDate(study.endDate!)}
                        </span>
                      </div>
                    </div>

                    {study.gpa && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 lg:ml-6">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                          {t("gpa")}
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {study.gpa}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {study.description}
                  </p>

                  {study.honors && study.honors.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
                        {t("honors")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {study.honors.map((honor, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium"
                          >
                            {honor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {study.coursework && study.coursework.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <BookOpenIcon className="w-5 h-5 mr-2 text-green-500" />
                        {t("coursework")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {study.coursework.map((course, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Studies;
