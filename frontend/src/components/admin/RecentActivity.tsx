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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-xl">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                  {activity.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
