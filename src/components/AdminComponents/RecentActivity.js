// components/AdminDashboard/RecentActivity.js
'use client';

import { FiUser, FiBriefcase, FiFileText, FiCalendar } from 'react-icons/fi';

const activities = [
  { type: 'user', message: 'New user registered: John Doe', time: '2 minutes ago', icon: <FiUser /> },
  { type: 'job', message: 'New job posted: Mining Engineer', time: '15 minutes ago', icon: <FiBriefcase /> },
  { type: 'application', message: 'New application received for Senior Tour Guide', time: '1 hour ago', icon: <FiFileText /> },
  { type: 'interview', message: 'Interview scheduled for Sarah Johnson', time: '2 hours ago', icon: <FiCalendar /> },
  { type: 'user', message: 'User profile updated: Michael Chen', time: '3 hours ago', icon: <FiUser /> },
];

export default function RecentActivity() {
  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return 'text-blue-600 bg-blue-100';
      case 'job': return 'text-green-600 bg-green-100';
      case 'application': return 'text-orange-600 bg-orange-100';
      case 'interview': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
            {activity.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}