// ApplicationsPage.js
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
        backgroundColor: 'rgba(70, 130, 180, 0.1)',
        color: '#4682B4',
        icon: <FiClock style={{ marginRight: '0.25rem' }} />,
        text: 'Applied'
      },
      reviewed: {
        backgroundColor: 'rgba(128, 0, 128, 0.1)',
        color: '#800080',
        icon: <FiBriefcase style={{ marginRight: '0.25rem' }} />,
        text: 'Under Review'
      },
      interview: {
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        color: '#FFA500',
        icon: <FiAlertCircle style={{ marginRight: '0.25rem' }} />,
        text: 'Interview'
      },
      offered: {
        backgroundColor: 'rgba(1, 68, 33, 0.1)',
        color: '#014421',
        icon: <FiCheckCircle style={{ marginRight: '0.25rem' }} />,
        text: 'Offer Received'
      },
      rejected: {
        backgroundColor: 'rgba(139, 0, 0, 0.1)',
        color: '#8B0000',
        icon: <FiXCircle style={{ marginRight: '0.25rem' }} />,
        text: 'Not Selected'
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        title="Your Applications" 
        actionText={filter === 'all' ? 'Show All' : null}
        onActionClick={() => setFilter('all')}
      >
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          {['all', 'applied', 'reviewed', 'interview', 'offered', 'rejected'].map((f) => (
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
      ) : filteredApplications.length === 0 ? (
        <Card>
          <div style={{
            textAlign: 'center',
            padding: '2rem 0'
          }}>
            <FiBriefcase style={{
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
                ? 'You haven\'t applied to any jobs yet'
                : `No ${filter} applications`}
            </h3>
            <p style={{
              marginTop: '0.25rem',
              fontSize: '0.875rem',
              color: 'rgba(140, 60, 30, 0.7)'
            }}>
              {filter === 'all' 
                ? 'Get started by applying to jobs that match your skills'
                : 'Check back later or apply to more positions'}
            </p>
          </div>
        </Card>
      ) : (
        <Card style={{
          borderTop: '1px solid rgba(140, 60, 30, 0.1)',
          borderBottom: '1px solid rgba(140, 60, 30, 0.1)'
        }}>
          {filteredApplications.map((app) => (
            <ListItem
              key={app.id}
              title={app.jobTitle}
              subtitle={
                <span style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  marginTop: '0.25rem'
                }}>
                  <span>{app.company}</span>
                  <span>Applied on {formatDate(app.appliedDate)}</span>
                </span>
              }
              rightContent={getStatusBadge(app.status)}
              href={`/applications/${app.id}`}
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

export default ApplicationsPage;