'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card';
import SectionHeader from '@/components/SectionHeader';
import apiHelper from '@/lib/apiHelper';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBell } from 'react-icons/fi';

const SettingsPage = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    notificationsEnabled: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        notificationsEnabled: user.notificationsEnabled !== false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await apiHelper.updateProfile(formData);
      
      if (response.success) {
        updateUser(response.user);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (confirm('Are you sure you want to deactivate your account?')) {
      // Implement deactivation logic
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
      // Implement deletion logic
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <SectionHeader title="Settings" />
      
      <Card>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiMail className="mr-2 text-gray-400" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiPhone className="mr-2 text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiMapPin className="mr-2 text-gray-400" /> Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center pt-2">
              <FiBell className="mr-2 text-gray-400" />
              <input
                id="notificationsEnabled"
                name="notificationsEnabled"
                type="checkbox"
                checked={formData.notificationsEnabled}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
                Enable email notifications
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </Card>

      <Card className="mt-6">
        <SectionHeader title="Account Actions" />
        <div className="p-4 space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Deactivate Account</h4>
            <p className="text-sm text-gray-500 mb-3">Temporarily disable your account. You can reactivate it later by logging in.</p>
            <button
              onClick={handleDeactivate}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-2 border border-red-200 rounded-md hover:bg-red-50"
            >
              Deactivate Account
            </button>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Delete Account</h4>
            <p className="text-sm text-gray-500 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-2 border border-red-200 rounded-md hover:bg-red-50"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;