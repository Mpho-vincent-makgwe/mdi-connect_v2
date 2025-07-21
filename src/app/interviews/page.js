// InterviewsPage.js
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
        backgroundColor: 'rgba(70, 130, 180, 0.1)',
        color: '#4682B4',
        icon: <FiClock style={{ marginRight: '0.25rem' }} />,
        text: 'Scheduled'
      },
      completed: {
        backgroundColor: 'rgba(1, 68, 33, 0.1)',
        color: '#014421',
        icon: <FiCheckCircle style={{ marginRight: '0.25rem' }} />,
        text: 'Completed'
      },
      canceled: {
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        color: '#8B0000',
        icon: <FiXCircle style={{ marginRight: '0.25rem' }} />,
        text: 'Canceled'
      },
      rescheduled: {
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        color: '#FFA500',
        icon: <FiRefreshCw style={{ marginRight: '0.25rem' }} />,
        text: 'Rescheduled'
      }
    };

    const config = statusConfig[status] || {
      backgroundColor: 'rgba(140, 60, 30, 0.1)',
      color: '#8C3C1E',
      icon: null,
      text: status
    };

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.75rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        backgroundColor: config.backgroundColor,
        color: config.color
      }}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getInterviewTypeIcon = (type) => {
    const icons = {
      'in-person': <FiUser style={{ marginRight: '0.25rem' }} />,
      'video': <FiVideo style={{ marginRight: '0.25rem' }} />,
      'phone': <FiPhone style={{ marginRight: '0.25rem' }} />
    };
    return icons[type] || <FiCalendar style={{ marginRight: '0.25rem' }} />;
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
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <Card>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 0'
          }}>
            <div style={{
              animation: 'spin 1s linear infinite',
              borderRadius: '9999px',
              height: '2rem',
              width: '2rem',
              border: '2px solid #132857',
              borderTopColor: 'transparent'
            }}></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <SectionHeader 
        title="Upcoming Interviews" 
        actionText={filter === 'all' ? 'Show All' : null}
        onActionClick={() => setFilter('all')}
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          {['all', 'scheduled', 'completed', 'canceled', 'rescheduled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: filter === f ? '#132857' : 'rgba(140, 60, 30, 0.1)',
                color: filter === f ? '#F2ECE4' : '#8C3C1E',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </SectionHeader>
      
      {loading ? (
        <Card>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 0'
          }}>
            <div style={{
              animation: 'spin 1s linear infinite',
              borderRadius: '9999px',
              height: '2rem',
              width: '2rem',
              border: '2px solid #132857',
              borderTopColor: 'transparent'
            }}></div>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <p style={{
            color: '#8B0000',
            textAlign: 'center',
            padding: '1rem 0'
          }}>{error}</p>
        </Card>
      ) : filteredInterviews.length === 0 ? (
        <Card>
          <div style={{
            textAlign: 'center',
            padding: '2rem 0'
          }}>
            <FiCalendar style={{
              margin: '0 auto',
              height: '3rem',
              width: '3rem',
              color: 'rgba(140, 60, 30, 0.4)'
            }} />
            <h3 style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#1A1A1A'
            }}>
              {filter === 'all' 
                ? 'No interviews scheduled'
                : `No ${filter} interviews`}
            </h3>
            <p style={{
              marginTop: '0.25rem',
              fontSize: '0.875rem',
              color: 'rgba(140, 60, 30, 0.7)'
            }}>
              {filter === 'all' 
                ? 'Check back later or apply to more positions'
                : 'You have no interviews with this status'}
            </p>
          </div>
        </Card>
      ) : (
        <Card style={{
          borderTop: '1px solid rgba(140, 60, 30, 0.1)',
          borderBottom: '1px solid rgba(140, 60, 30, 0.1)'
        }}>
          {filteredInterviews.map((interview) => (
            <ListItem
              key={interview.id}
              title={`${interview.jobTitle} Interview`}
              subtitle={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: 'rgba(140, 60, 30, 0.7)'
                  }}>
                    <FiCalendar style={{ marginRight: '0.375rem' }} />
                    {formatDateTime(interview.date)}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: 'rgba(140, 60, 30, 0.7)'
                  }}>
                    {getInterviewTypeIcon(interview.type)}
                    {interview.type} • With {interview.interviewerName}
                  </div>
                </div>
              }
              rightContent={getStatusBadge(interview.status)}
              href={`/interviews/${interview.id}`}
              style={{
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: 'rgba(242, 236, 228, 0.5)'
                }
              }}
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default InterviewsPage;