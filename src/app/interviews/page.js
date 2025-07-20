'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card';
import ListItem from '@/components/ListItem';
import SectionHeader from '@/components/SectionHeader';
import apiHelper from '@/lib/apiHelper';
import { toast } from 'react-toastify';
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiRefreshCw,
  FiUser,
  FiVideo,
  FiPhone
} from 'react-icons/fi';

const InterviewsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.getInterviews();
        
        if (response.success) {
          setInterviews(response.data);
        } else {
          setError(response.message);
          toast.error(response.message || 'Failed to load interviews');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch interviews');
        toast.error(err.message || 'Failed to fetch interviews');
      } finally {
        setLoading(false);
      }
    };

    if (user && !userLoading) {
      fetchInterviews();
    }
  }, [user, userLoading]);

  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'all') return true;
    return interview.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: {
        className: 'bg-blue-100 text-blue-800',
        icon: <FiClock className="mr-1" />,
        text: 'Scheduled'
      },
      completed: {
        className: 'bg-green-100 text-green-800',
        icon: <FiCheckCircle className="mr-1" />,
        text: 'Completed'
      },
      canceled: {
        className: 'bg-red-100 text-red-800',
        icon: <FiXCircle className="mr-1" />,
        text: 'Canceled'
      },
      rescheduled: {
        className: 'bg-yellow-100 text-yellow-800',
        icon: <FiRefreshCw className="mr-1" />,
        text: 'Rescheduled'
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

  const getInterviewTypeIcon = (type) => {
    const icons = {
      'in-person': <FiUser className="mr-1" />,
      'video': <FiVideo className="mr-1" />,
      'phone': <FiPhone className="mr-1" />
    };
    return icons[type] || <FiCalendar className="mr-1" />;
  };

  const formatDateTime = (dateString) => {
    const options = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        title="Upcoming Interviews" 
        actionText={filter === 'all' ? 'Show All' : null}
        onActionClick={() => setFilter('all')}
      >
        <div className="flex flex-wrap gap-2 mt-4">
          {['all', 'scheduled', 'completed', 'canceled', 'rescheduled'].map((f) => (
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
      ) : filteredInterviews.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' 
                ? 'No interviews scheduled'
                : `No ${filter} interviews`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Check back later or apply to more positions'
                : 'You have no interviews with this status'}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-gray-100">
          {filteredInterviews.map((interview) => (
            <ListItem
              key={interview.id}
              title={`${interview.jobTitle} Interview`}
              subtitle={
                <div className="flex flex-col space-y-1 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-1.5" />
                    {formatDateTime(interview.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {getInterviewTypeIcon(interview.type)}
                    {interview.type} • With {interview.interviewerName}
                  </div>
                </div>
              }
              rightContent={getStatusBadge(interview.status)}
              href={`/interviews/${interview.id}`}
              className="hover:bg-gray-50"
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default InterviewsPage;