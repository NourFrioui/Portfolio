"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import QuickActions from '@/components/admin/QuickActions';
import RecentActivity from '@/components/admin/RecentActivity';

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

type DashboardStats = {
  overview: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    totalTechnologies: number;
    totalMessages: number;
    unreadMessages: number;
  };
  charts: {
    projectsByStatus: Array<{ name: string; value: number }>;
    monthlyActivity: Array<{ name: string; projects: number; messages: number }>;
  };
  recent: {
    projects: Array<{
      _id: string;
      title: string;
      status: string;
      createdAt: string;
    }>;
    messages: Array<{
      _id: string;
      name: string;
      subject: string;
      isRead: boolean;
      createdAt: string;
    }>;
  };
};

export default function AdminIndexPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE}/dashboard/statistics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="modern-card p-6 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Nour! 👋</h1>
              <p className="text-indigo-100">Here&apos;s what&apos;s happening with your portfolio today.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                🚀
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="modern-card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Projects"
              value={stats?.overview.totalProjects || 0}
              icon="🚀"
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatsCard
              title="Technologies"
              value={stats?.overview.totalTechnologies || 0}
              icon="⚡"
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatsCard
              title="Messages"
              value={stats?.overview.totalMessages || 0}
              icon="📧"
              trend={{ value: 3.1, isPositive: false }}
            />
            <StatsCard
              title="Completed"
              value={stats?.overview.completedProjects || 0}
              icon="✅"
              trend={{ value: 15.3, isPositive: true }}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="modern-card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Page Views</span>
                <span className="text-sm font-medium text-slate-900">2,847</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Contact Forms</span>
                <span className="text-sm font-medium text-slate-900">23</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Project Views</span>
                <span className="text-sm font-medium text-slate-900">1,456</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>

          <div className="modern-card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">
                  📈
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Growth Rate</h4>
                  <p className="text-sm text-slate-500">+23% this month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">
                  ⭐
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Client Rating</h4>
                  <p className="text-sm text-slate-500">4.9/5.0 average</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                  🎯
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Success Rate</h4>
                  <p className="text-sm text-slate-500">98% project completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
