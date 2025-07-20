'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card';
import ListItem from '@/components/ListItem';
import SectionHeader from '@/components/SectionHeader';
import apiHelper from '@/lib/apiHelper';
import { toast } from 'react-toastify';
import { FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const ApplicationsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.getApplications();
        
        if (response.success) {
          setApplications(response.data);
        } else {
          setError(response.message);
          toast.error(response.message || 'Failed to load applications');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch applications');
        toast.error(err.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (user && !userLoading) {
      fetchApplications();
    }
  }, [user, userLoading]);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: {
        className: 'bg-blue-100 text-blue-800',
        icon: <FiClock className="mr-1" />,
        text: 'Applied'
      },
      reviewed: {
        className: 'bg-purple-100 text-purple-800',
        icon: <FiBriefcase className="mr-1" />,
        text: 'Under Review'
      },
      interview: {
        className: 'bg-yellow-100 text-yellow-800',
        icon: <FiAlertCircle className="mr-1" />,
        text: 'Interview'
      },
      offered: {
        className: 'bg-green-100 text-green-800',
        icon: <FiCheckCircle className="mr-1" />,
        text: 'Offer Received'
      },
      rejected: {
        className: 'bg-red-100 text-red-800',
        icon: <FiXCircle className="mr-1" />,
        text: 'Not Selected'
      }
    };

    const config = statusConfig[status] || {
      className: 'bg-gray-100 text-gray-800',
      icon: null,
      text: status
    };

    return (
      <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${config.className}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <SectionHeader 
        title="Your Applications" 
        actionText={filter === 'all' ? 'Show All' : null}
        onActionClick={() => setFilter('all')}
      >
        <div className="flex space-x-2 mt-4">
          {['all', 'applied', 'reviewed', 'interview', 'offered', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === f 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </SectionHeader>
      
      {loading ? (
        <Card>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-red-500 text-center py-4">{error}</p>
        </Card>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' 
                ? 'You haven\'t applied to any jobs yet'
                : `No ${filter} applications`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Get started by applying to jobs that match your skills'
                : 'Check back later or apply to more positions'}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-gray-100">
          {filteredApplications.map((app) => (
            <ListItem
              key={app.id}
              title={app.jobTitle}
              subtitle={
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <span>{app.company}</span>
                  <span className="hidden sm:block">•</span>
                  <span>Applied on {formatDate(app.appliedDate)}</span>
                </div>
              }
              rightContent={getStatusBadge(app.status)}
              href={`/applications/${app.id}`}
              className="hover:bg-gray-50"
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default ApplicationsPage;