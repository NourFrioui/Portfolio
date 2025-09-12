"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
import {
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  TrophyIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { getLocalizedText } from "@/utils/localization";
import { Study } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

const Studies: React.FC = () => {
  const t = useTranslations("Studies");
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentLanguage, setCurrentLanguage] = useState<"en" | "fr">("en"); // NEW

  // Fallback data with proper localized structure
  const fallbackStudies: Study[] = [
    {
      _id: "1",
      degree: {
        en: "Master's in Computer Science",
        fr: "Master en Informatique",
      },
      institution: {
        en: "University of Technology",
        fr: "Université de Technologie",
      },
      field: { en: "Computer Science", fr: "Informatique" },
      location: { en: "Paris, France", fr: "Paris, France" },
      startDate: "2020-09-01",
      endDate: "2022-06-30",
      isCurrent: false,
      description: {
        en: "Specialized in Software Engineering and Web Technologies with focus on modern development frameworks and methodologies.",
        fr: "Spécialisation en ingénierie logicielle et technologies web, avec un accent sur les frameworks modernes et les méthodologies de développement.",
      },
      grade: "3.8/4.0",
      honors: [
        { en: "Magna Cum Laude", fr: "Magna Cum Laude" },
        { en: "Dean's List", fr: "Liste du Doyen" },
      ],
      subjects: [
        { en: "Advanced Web Development", fr: "Développement Web Avancé" },
        { en: "Database Systems", fr: "Systèmes de Base de Données" },
        { en: "Software Architecture", fr: "Architecture Logicielle" },
        { en: "Machine Learning", fr: "Apprentissage Automatique" },
      ],
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      degree: {
        en: "Bachelor's in Information Technology",
        fr: "Licence en Technologies de l'Information",
      },
      institution: {
        en: "Institute of Technology",
        fr: "Institut de Technologie",
      },
      field: {
        en: "Information Technology",
        fr: "Technologies de l'Information",
      },
      location: { en: "Lyon, France", fr: "Lyon, France" },
      startDate: "2017-09-01",
      endDate: "2020-06-30",
      isCurrent: false,
      description: {
        en: "Comprehensive foundation in computer science principles, programming languages, and system design.",
        fr: "Base solide en principes d'informatique, langages de programmation et conception de systèmes.",
      },
      grade: "3.6/4.0",
      subjects: [
        { en: "Data Structures", fr: "Structures de Données" },
        { en: "Algorithms", fr: "Algorithmes" },
        { en: "Web Programming", fr: "Programmation Web" },
        { en: "Network Security", fr: "Sécurité Réseau" },
      ],
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
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
    return date.toLocaleDateString(
      currentLanguage === "fr" ? "fr-FR" : "en-US",
      {
        // NEW
        year: "numeric",
        month: "short",
      }
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
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

          {/* Language Switcher (optionnel) */}
          <div className="flex justify-center mt-6">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setCurrentLanguage("en")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentLanguage === "en"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLanguage("fr")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentLanguage === "fr"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Français
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {studies.map((study, index) => (
            <motion.div
              key={study._id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative mb-12 last:mb-0"
            >
              <div className="ml-20 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                  <AcademicCapIcon className="w-6 h-6 mr-2 text-blue-500" />
                  {getLocalizedText(study.degree, currentLanguage)}
                </h3>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {getLocalizedText(study.institution, currentLanguage)}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {getLocalizedText(study.field, currentLanguage)} •{" "}
                  {getLocalizedText(study.location, currentLanguage)}
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {getLocalizedText(study.description, currentLanguage)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Studies;
