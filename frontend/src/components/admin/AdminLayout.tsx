"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const t = useTranslations('Admin');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  const navigation = [
    { name: t('dashboard'), href: "/admin", icon: "📊" },
    { name: t('profile'), href: "/admin/profile", icon: "👤" },
    { name: t('categories'), href: "/admin/categories", icon: "🗂️" },
    { name: t('projects'), href: "/admin/projects", icon: "💼" },
    { name: t('studies'), href: "/admin/studies", icon: "🎓" },
    { name: t('experience'), href: "/admin/experience", icon: "🎯" },
    { name: t('tags'), href: "/admin/tags", icon: "🏷️" },
    { name: t('technologies'), href: "/admin/technologies", icon: "💡" },
    { name: t('contacts'), href: "/admin/contacts", icon: "📧" },
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-slate-200">
        <div className="h-16 flex items-center justify-center border-b border-slate-200 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-white/20 backdrop-blur border border-white/30" />
            <h1 className="text-lg font-semibold text-white">{t('title')}</h1>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:transform hover:scale-105"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        isActive
                          ? "opacity-100"
                          : "opacity-80 group-hover:opacity-100"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:border-slate-300 transition-all duration-200 hover:transform hover:scale-105"
          >
            <span className="text-lg">🏠</span>
            <span>{t('backToPortfolio')}</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
          <div className="h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-slate-700">
                {t('portfolioManagement')}
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="text-xs text-slate-500">{t('backOffice')}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline font-medium">
                  {t('systemStatus')}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden sm:inline text-emerald-600 font-medium">
                  {t('online')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                aria-label={t('logout')}
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </header>
        <main className="py-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
