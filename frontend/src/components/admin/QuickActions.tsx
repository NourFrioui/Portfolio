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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`${action.color} text-white rounded-lg p-4 transition-colors duration-200 block`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
