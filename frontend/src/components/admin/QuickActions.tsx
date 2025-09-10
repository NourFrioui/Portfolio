"use client";

import React from 'react';
import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      title: 'Add Project',
      description: 'Create a new project showcase',
      href: '/admin/projects',
      icon: '➕',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Update Profile',
      description: 'Edit your personal information',
      href: '/admin/profile',
      icon: '✏️',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Add Experience',
      description: 'Add work experience entry',
      href: '/admin/experience',
      icon: '💼',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Manage Tech Stack',
      description: 'Update your technologies',
      href: '/admin/technologies',
      icon: '⚡',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">⚡</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`${action.color} text-white rounded-xl p-5 transition-all duration-300 block hover:transform hover:scale-105 hover:shadow-xl group`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-2xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{action.title}</h4>
                <p className="text-sm opacity-90 mt-1">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
