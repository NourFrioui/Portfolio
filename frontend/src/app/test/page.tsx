"use client";

import React from "react";
import ProjectsUpdated from "@/components/ProjectsUpdated";
import Skills from "@/components/Skills";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Test des composants mis à jour
        </h1>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Projets avec données localisées
            </h2>
            <ProjectsUpdated />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Compétences avec données localisées
            </h2>
            <Skills />
          </section>
        </div>
      </div>
    </div>
  );
  
}
