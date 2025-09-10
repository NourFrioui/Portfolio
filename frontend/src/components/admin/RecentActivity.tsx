"use client";

import React from 'react';

interface ActivityItem {
  id: string;
  type: 'project' | 'experience' | 'contact' | 'profile';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

const RecentActivity: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'project',
      title: 'New Project Added',
      description: 'E-commerce Platform project was created',
      timestamp: '2 hours ago',
      icon: '💼',
    },
    {
      id: '2',
      type: 'contact',
      title: 'New Contact Message',
      description: 'John Doe sent a message about collaboration',
      timestamp: '5 hours ago',
      icon: '📧',
    },
    {
      id: '3',
      type: 'profile',
      title: 'Profile Updated',
      description: 'Bio and skills section updated',
      timestamp: '1 day ago',
      icon: '👤',
    },
    {
      id: '4',
      type: 'experience',
      title: 'Experience Added',
      description: 'Senior Developer role at TechCorp added',
      timestamp: '2 days ago',
      icon: '🎯',
    },
  ];

  const getTypeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'contact':
        return 'bg-green-100 text-green-800';
      case 'profile':
        return 'bg-purple-100 text-purple-800';
      case 'experience':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">📊</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">{activity.icon}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(activity.type)}`}>
                  {activity.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
              <p className="text-xs text-gray-400 font-medium">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-lg transition-colors">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
