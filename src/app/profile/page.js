'use client';
import React from 'react';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card';
import SectionHeader from '@/components/SectionHeader';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useUser();

  const profileFields = [
    { 
      label: 'Full Name', 
      value: user?.name, 
      icon: <FiUser className="text-gray-400" /> 
    },
    { 
      label: 'Email', 
      value: user?.email, 
      icon: <FiMail className="text-gray-400" /> 
    },
    { 
      label: 'Phone', 
      value: user?.phone, 
      icon: <FiPhone className="text-gray-400" />,
      hidden: !user?.phone
    },
    { 
      label: 'Location', 
      value: user?.location, 
      icon: <FiMapPin className="text-gray-400" />,
      hidden: !user?.location
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <SectionHeader title="Your Profile" />
      
      <Card className="mb-6">
        <div className="flex items-center space-x-4 p-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            {user?.role && (
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                {user.role}
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-lg mb-4 px-4 pt-4">Personal Information</h3>
        <div className="space-y-3 px-4 pb-4">
          {profileFields.map((field) => (
            !field.hidden && (
              <div key={field.label} className="flex items-start space-x-3">
                <div className="mt-1">{field.icon}</div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500">{field.label}</label>
                  <p className="mt-1 text-gray-800">{field.value || 'Not provided'}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;