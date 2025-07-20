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
      
      // Optimistically update UI
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      // Mark all as read in parallel
      await Promise.all(
        unreadNotifications.map(n => apiHelper.markNotificationAsRead(n.id))
      );
      
      toast.success('All notifications marked as read');
    } catch (err) {
      // Revert optimistic update if error occurs
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
    <div className="container mx-auto px-4 py-6">
      <SectionHeader 
        title="Notifications" 
        actionText={isMarkingAll ? 'Processing...' : 'Mark all as read'} 
        onActionClick={markAllAsRead}
        actionDisabled={isMarkingAll || notifications.every(n => n.read)}
      />
      
      {loading ? (
        <Card>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-red-500 text-center py-4">{error}</p>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-4">You don't have any notifications yet.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              title={notification.title}
              subtitle={`${notification.message} • ${formatDate(notification.createdAt)}`}
              rightContent={
                !notification.read && (
                  <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                )
              }
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`${notification.read ? 'opacity-75' : 'font-medium'} hover:bg-gray-50`}
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;