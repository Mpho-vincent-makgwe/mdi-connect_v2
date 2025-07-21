// NotificationsPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Card from '@/components/Card';
import ListItem from '@/components/ListItem';
import SectionHeader from '@/components/SectionHeader';
import apiHelper from '@/lib/apiHelper';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiHelper.getNotifications();
        
        if (response.success) {
          setNotifications(response.data);
        } else {
          setError(response.message || 'Failed to load notifications');
          toast.error(response.message || 'Failed to load notifications');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch notifications');
        toast.error(err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchNotifications();
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await apiHelper.markNotificationAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
        toast.success('Notification marked as read');
      } else {
        toast.error(response.message || 'Failed to mark notification as read');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      await Promise.all(
        unreadNotifications.map(n => apiHelper.markNotificationAsRead(n.id))
      );
      
      toast.success('All notifications marked as read');
    } catch (err) {
      setNotifications(notifications);
      toast.error(err.message || 'Failed to mark all notifications as read');
    } finally {
      setIsMarkingAll(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <SectionHeader 
        title="Notifications" 
        actionText={isMarkingAll ? 'Processing...' : 'Mark all as read'} 
        onActionClick={markAllAsRead}
        actionDisabled={isMarkingAll || notifications.every(n => n.read)}
      />
      
      {loading ? (
        <Card>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1rem 0'
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
      ) : notifications.length === 0 ? (
        <Card>
          <p style={{
            color: 'rgba(140, 60, 30, 0.7)',
            textAlign: 'center',
            padding: '1rem 0'
          }}>You don't have any notifications yet.</p>
        </Card>
      ) : (
        <Card style={{
          borderTop: '1px solid rgba(140, 60, 30, 0.1)',
          borderBottom: '1px solid rgba(140, 60, 30, 0.1)'
        }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              title={notification.title}
              subtitle={`${notification.message} • ${formatDate(notification.createdAt)}`}
              rightContent={
                !notification.read && (
                  <span style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: '#132857'
                  }}></span>
                )
              }
              onClick={() => !notification.read && markAsRead(notification.id)}
              style={{
                fontWeight: notification.read ? 'normal' : '500',
                opacity: notification.read ? 0.75 : 1,
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

export default NotificationsPage;